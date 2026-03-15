/**
 * gaze-session-summariser.js
 * =============================================================
 * Runs in the browser alongside GazeAPI.
 * Accumulates lightweight per-frame data in memory every second,
 * computes rolling statistics, and on session end produces one
 * clean SessionSummary object ready to POST to the backend.
 *
 * Nothing is stored raw — all data is summarised in memory.
 *
 * Usage:
 *   import SessionSummariser from './gaze-session-summariser.js';
 *
 *   SessionSummariser.init({ studentId, sessionId, lessonId });
 *   SessionSummariser.ingest(fullFrame);   // call on every 'frame' event
 *   const summary = SessionSummariser.finalise();  // call on session end
 *   // then POST summary to /api/sessions
 */

const SessionSummariser = (() => {

  // ─── Config ────────────────────────────────────────────────────────────────
  let meta = {
    studentId:  null,
    sessionId:  null,
    lessonId:   null,
    startTime:  null,
    endTime:    null,
  };

  // ─── In-memory accumulators ────────────────────────────────────────────────

  // Score timeline — one entry per 5s bucket
  // { bucketStart, scores[], avgScore, band, dominantActivity }
  let scoreBuckets   = [];
  let currentBucket  = null;
  const BUCKET_SIZE_MS = 5_000;

  // Event log — state changes, interventions, zone2 confirmations
  let events = [];

  // Distraction reason counters
  let distractionReasons = {
    gaze_off_screen:    0,
    head_turned_away:   0,
    drowsy:             0,
    face_not_detected:  0,
    zone2_exceeded:     0,
  };

  // Attention band time accumulators (ms)
  let bandTime = {
    FOCUSED:    0,
    MILD:       0,
    DISTRACTED: 0,
    ABSENT:     0,
  };

  // Activity time accumulators (ms)
  let activityTime = {
    FOCUSED:                 0,
    NOTE_TAKING:             0,
    READING_OFFLINE:         0,
    THINKING:                0,
    DISTRACTED:              0,
    NOTE_TAKING_UNCONFIRMED: 0,
    DROWSY:                  0,
    ABSENT:                  0,
  };

  // Intervention counters
  let interventionCounts = { 1: 0, 2: 0, 3: 0, 4: 0 };
  let manualRecoveries   = 0;

  // Peak/trough tracking
  let peakScore   = 0;
  let troughScore = 100;

  // Rolling 60s score for trend — kept as ring buffer
  const TREND_WINDOW  = 60;  // samples
  let trendBuffer     = [];

  // Frame counters
  let totalFrames     = 0;
  let focusedFrames   = 0;
  let lastFrameTime   = null;
  let lastBand        = null;

  // Zone 2 tracking
  let zone2Confirmed  = false;
  let zone2Center     = null;

  // Blink / drowsiness accumulators
  let slowBlinkCount  = 0;
  let drowsyEpisodes  = 0;
  let inDrowsyEpisode = false;

  // ─── Public: init() ────────────────────────────────────────────────────────
  function init({ studentId, sessionId, lessonId = null } = {}) {
    reset();
    meta.studentId = studentId;
    meta.sessionId = sessionId;
    meta.lessonId  = lessonId;
    meta.startTime = new Date().toISOString();
  }

  // ─── Public: ingest(fullFrame) ─────────────────────────────────────────────
  /**
   * Call this on every 'frame' event from GazeAPI.
   * Lightweight — no heavy computation, just accumulate.
   */
  function ingest(frame) {
    const now = frame.timestamp;
    const dt  = lastFrameTime ? now - lastFrameTime : 66;
    lastFrameTime = now;
    totalFrames++;

    const att = frame.attention;
    const ctx = frame.activityContext;
    const ms  = frame.machineState;

    if (!att) return;

    const score    = att.score;
    const band     = att.band;
    const activity = ctx?.activity ?? 'FOCUSED';

    // ── Peak / trough ──────────────────────────────────────────────────
    if (score > peakScore)   peakScore   = score;
    if (score < troughScore) troughScore = score;

    // ── Band time ──────────────────────────────────────────────────────
    if (bandTime[band] !== undefined) bandTime[band] += dt;
    if (band === 'FOCUSED') focusedFrames++;

    // ── Activity time ──────────────────────────────────────────────────
    if (activityTime[activity] !== undefined) activityTime[activity] += dt;

    // ── Distraction reason (count frames, not events) ──────────────────
    if (band === 'DISTRACTED' || band === 'ABSENT') {
      if (!frame.faceDetected) {
        distractionReasons.face_not_detected++;
      } else if (frame.gaze?.offScreen) {
        distractionReasons.gaze_off_screen++;
      } else if (frame.headPose?.facingAway) {
        distractionReasons.head_turned_away++;
      } else if (frame.eyes?.isDrowsy) {
        distractionReasons.drowsy++;
      }
      if (ctx?.nudge) distractionReasons.zone2_exceeded++;
    }

    // ── Drowsy episodes ────────────────────────────────────────────────
    if (frame.eyes?.isDrowsy || frame.blinks?.drowsyPattern) {
      if (!inDrowsyEpisode) { drowsyEpisodes++; inDrowsyEpisode = true; }
    } else {
      inDrowsyEpisode = false;
    }
    if (frame.blinks?.slowBlinkDetected) slowBlinkCount++;

    // ── Trend ring buffer ──────────────────────────────────────────────
    trendBuffer.push(score);
    if (trendBuffer.length > TREND_WINDOW) trendBuffer.shift();

    // ── Score bucket (5s) ──────────────────────────────────────────────
    const bucketId = Math.floor(now / BUCKET_SIZE_MS);
    if (!currentBucket || currentBucket.bucketId !== bucketId) {
      if (currentBucket) finaliseBucket(currentBucket);
      currentBucket = {
        bucketId,
        offsetMs:   Math.round(now - (meta.startTime ? new Date(meta.startTime).getTime() : now)),
        scores:     [],
        activities: [],
        bands:      [],
      };
    }
    currentBucket.scores.push(score);
    currentBucket.activities.push(activity);
    currentBucket.bands.push(band);

    // ── Zone 2 ────────────────────────────────────────────────────────
    if (ctx?.zone2?.status === 'CONFIRMED' && !zone2Confirmed) {
      zone2Confirmed = true;
      zone2Center    = ctx.zone2.center;
    }

    lastBand = band;
  }

  // ─── Public: ingestEvent(event) ────────────────────────────────────────────
  /**
   * Call this on 'intervention' and 'attention' events from GazeAPI.
   */
  function ingestEvent(event) {
    // Lightweight — only store what's needed for analytics
    const entry = {
      type:      event.type ?? event.levelName ?? 'UNKNOWN',
      timestamp: new Date().toISOString(),
      offsetMs:  meta.startTime
        ? Date.now() - new Date(meta.startTime).getTime()
        : 0,
      score:     event.score ?? null,
      band:      event.band  ?? null,
      state:     event.state ?? null,
      level:     event.level ?? null,
    };
    events.push(entry);

    // Intervention counts
    if (event.level && interventionCounts[event.level] !== undefined) {
      interventionCounts[event.level]++;
    }
    if (event.type === 'MANUAL_RECOVERY') manualRecoveries++;
  }

  // ─── Public: finalise() ────────────────────────────────────────────────────
  /**
   * Call on session end. Returns a clean SessionSummary object.
   * This is what gets POSTed to /api/sessions.
   */
  function finalise() {
    // Finalise any open bucket
    if (currentBucket) finaliseBucket(currentBucket);

    meta.endTime = new Date().toISOString();
    const durationMs = meta.startTime
      ? new Date(meta.endTime) - new Date(meta.startTime)
      : 0;

    const totalBandMs  = Object.values(bandTime).reduce((a, b) => a + b, 0) || 1;
    const totalActMs   = Object.values(activityTime).reduce((a, b) => a + b, 0) || 1;
    const totalDistr   = Object.values(distractionReasons).reduce((a, b) => a + b, 0) || 1;

    // Overall average from bucket averages
    const allScores    = scoreBuckets.map(b => b.avgScore);
    const avgScore     = allScores.length
      ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
      : 0;

    // Trend: compare first 20% vs last 20% of session
    const bucketCount  = scoreBuckets.length;
    const sliceSize    = Math.max(1, Math.floor(bucketCount * 0.2));
    const earlyAvg     = avg(scoreBuckets.slice(0, sliceSize).map(b => b.avgScore));
    const lateAvg      = avg(scoreBuckets.slice(-sliceSize).map(b => b.avgScore));
    const sessionTrend = lateAvg - earlyAvg > 5  ? 'IMPROVING'
                       : earlyAvg - lateAvg > 5  ? 'DECLINING'
                       : 'STABLE';

    return {
      // ── Identity ──────────────────────────────────────────────────
      studentId:   meta.studentId,
      sessionId:   meta.sessionId,
      lessonId:    meta.lessonId,
      startTime:   meta.startTime,
      endTime:     meta.endTime,
      durationMs,
      durationFormatted: formatDuration(durationMs),

      // ── Score overview ─────────────────────────────────────────────
      scores: {
        average:  avgScore,
        peak:     peakScore,
        trough:   troughScore,
        trend:    sessionTrend,          // IMPROVING | DECLINING | STABLE
        earlyAvg: Math.round(earlyAvg),  // first 20% of session
        lateAvg:  Math.round(lateAvg),   // last 20% of session
      },

      // ── Band time breakdown (%) ───────────────────────────────────
      bandBreakdown: {
        focused:    pct(bandTime.FOCUSED,    totalBandMs),
        mild:       pct(bandTime.MILD,       totalBandMs),
        distracted: pct(bandTime.DISTRACTED, totalBandMs),
        absent:     pct(bandTime.ABSENT,     totalBandMs),
      },

      // ── Activity breakdown (%) ────────────────────────────────────
      activityBreakdown: {
        focused:                 pct(activityTime.FOCUSED,                 totalActMs),
        noteTaking:              pct(activityTime.NOTE_TAKING,             totalActMs),
        readingOffline:          pct(activityTime.READING_OFFLINE,         totalActMs),
        thinking:                pct(activityTime.THINKING,                totalActMs),
        distracted:              pct(activityTime.DISTRACTED,              totalActMs),
        noteTakingUnconfirmed:   pct(activityTime.NOTE_TAKING_UNCONFIRMED, totalActMs),
        drowsy:                  pct(activityTime.DROWSY,                  totalActMs),
        absent:                  pct(activityTime.ABSENT,                  totalActMs),
      },

      // ── Distraction reasons (%) ───────────────────────────────────
      distractionReasons: {
        gazeOffScreen:   pct(distractionReasons.gaze_off_screen,   totalDistr),
        headTurnedAway:  pct(distractionReasons.head_turned_away,  totalDistr),
        drowsy:          pct(distractionReasons.drowsy,            totalDistr),
        faceNotDetected: pct(distractionReasons.face_not_detected, totalDistr),
        zone2Exceeded:   pct(distractionReasons.zone2_exceeded,    totalDistr),
      },

      // ── Interventions ─────────────────────────────────────────────
      interventions: {
        total:          Object.values(interventionCounts).reduce((a, b) => a + b, 0),
        byLevel: {
          subtle:     interventionCounts[1],
          soft:       interventionCounts[2],
          hard:       interventionCounts[3],
          escalated:  interventionCounts[4],
        },
        manualRecoveries,
      },

      // ── Drowsiness ────────────────────────────────────────────────
      drowsiness: {
        episodes:       drowsyEpisodes,
        slowBlinkCount,
      },

      // ── Zone 2 ───────────────────────────────────────────────────
      zone2: {
        confirmed:  zone2Confirmed,
        center:     zone2Center,
      },

      // ── Timeline (for heatmap/replay) ─────────────────────────────
      // One data point per 5s — this is what drives the attention heatmap
      timeline: scoreBuckets.map(b => ({
        offsetMs:          b.offsetMs,
        avgScore:          b.avgScore,
        band:              b.band,
        dominantActivity:  b.dominantActivity,
      })),

      // ── Raw events (interventions, band changes) ──────────────────
      events,

      // ── Metadata ─────────────────────────────────────────────────
      totalFrames,
      dataQuality: totalFrames > 0
        ? Math.round((focusedFrames / totalFrames) * 100)
        : 0,
    };
  }

  // ─── Internal helpers ─────────────────────────────────────────────────────

  function finaliseBucket(bucket) {
    const avgScore       = Math.round(avg(bucket.scores));
    const band           = mode(bucket.bands);
    const dominantActivity = mode(bucket.activities);
    scoreBuckets.push({
      bucketId:         bucket.bucketId,
      offsetMs:         bucket.offsetMs,
      avgScore,
      band,
      dominantActivity,
    });
  }

  function avg(arr) {
    return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  }

  function mode(arr) {
    const freq = {};
    let max = 0, result = arr[0];
    for (const v of arr) {
      freq[v] = (freq[v] ?? 0) + 1;
      if (freq[v] > max) { max = freq[v]; result = v; }
    }
    return result;
  }

  function pct(val, total) {
    return Math.round((val / total) * 100);
  }

  function formatDuration(ms) {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    return `${String(h).padStart(2,'0')}:${String(m%60).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  }

  function reset() {
    meta             = { studentId: null, sessionId: null, lessonId: null, startTime: null, endTime: null };
    scoreBuckets     = [];
    currentBucket    = null;
    events           = [];
    distractionReasons = { gaze_off_screen: 0, head_turned_away: 0, drowsy: 0, face_not_detected: 0, zone2_exceeded: 0 };
    bandTime         = { FOCUSED: 0, MILD: 0, DISTRACTED: 0, ABSENT: 0 };
    activityTime     = { FOCUSED: 0, NOTE_TAKING: 0, READING_OFFLINE: 0, THINKING: 0, DISTRACTED: 0, NOTE_TAKING_UNCONFIRMED: 0, DROWSY: 0, ABSENT: 0 };
    interventionCounts = { 1: 0, 2: 0, 3: 0, 4: 0 };
    manualRecoveries = 0;
    peakScore        = 0;
    troughScore      = 100;
    trendBuffer      = [];
    totalFrames      = 0;
    focusedFrames    = 0;
    lastFrameTime    = null;
    lastBand         = null;
    zone2Confirmed   = false;
    zone2Center      = null;
    slowBlinkCount   = 0;
    drowsyEpisodes   = 0;
    inDrowsyEpisode  = false;
  }

  return { init, ingest, ingestEvent, finalise, reset };

})();

export default SessionSummariser;
