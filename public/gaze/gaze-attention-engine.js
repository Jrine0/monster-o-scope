/**
 * gaze-attention-engine.js
 * =============================================================
 * Phase 2 — Attention Engine.
 *
 * Takes an enriched FrameData (with activityContext from ZoneManager)
 * and produces a structured AttentionResult every frame.
 *
 * Scoring architecture:
 *   ┌─────────────────────────────────────────────────┐
 *   │  4 signal scorers (each 0–100)                  │
 *   │    Gaze/Zone        → 40% weight                │
 *   │    Eye openness     → 30% weight                │
 *   │    Head pose        → 20% weight                │
 *   │    Activity context → 10% weight                │
 *   ├─────────────────────────────────────────────────┤
 *   │  Weighted combination → raw score 0–100         │
 *   ├─────────────────────────────────────────────────┤
 *   │  Adaptive temporal smoother                     │
 *   │    Drop  → fast  (~1s time constant)            │
 *   │    Rise  → slow  (~4s time constant)            │
 *   ├─────────────────────────────────────────────────┤
 *   │  Face-loss decay (10s linear → 0)               │
 *   ├─────────────────────────────────────────────────┤
 *   │  Band classifier                                │
 *   │    85–100  FOCUSED                              │
 *   │    60–84   MILD                                 │
 *   │    30–59   DISTRACTED                           │
 *   │     0–29   ABSENT                               │
 *   └─────────────────────────────────────────────────┘
 *
 * Output shape (AttentionResult):
 * {
 *   timestamp,
 *   score:        78,           // smoothed 0–100
 *   band:         'MILD',       // FOCUSED | MILD | DISTRACTED | ABSENT
 *   signals: {
 *     gaze:     { score: 90, weight: 0.40, contribution: 36.0, reason: '...' },
 *     eyes:     { score: 72, weight: 0.30, contribution: 21.6, reason: '...' },
 *     headPose: { score: 85, weight: 0.20, contribution: 17.0, reason: '...' },
 *     activity: { score: 80, weight: 0.10, contribution:  8.0, reason: '...' },
 *   },
 *   raw:          75,           // pre-smoothing score
 *   confidence:   0.92,         // 0–1, low when face recently lost
 *   bandChanged:  false,        // true only on the frame band transitions
 *   trend:        'STABLE',     // IMPROVING | DECLINING | STABLE
 * }
 */

const AttentionEngine = (() => {

  // ─── Weights (must sum to 1.0) ────────────────────────────────────────────
  const WEIGHTS = {
    gaze:     0.40,
    eyes:     0.30,
    headPose: 0.20,
    activity: 0.10,
  };

  // ─── Band thresholds ──────────────────────────────────────────────────────
  const BANDS = [
    { name: 'FOCUSED',    min: 85, max: 100 },
    { name: 'MILD',       min: 60, max: 84  },
    { name: 'DISTRACTED', min: 30, max: 59  },
    { name: 'ABSENT',     min: 0,  max: 29  },
  ];

  // ─── Adaptive smoother constants ─────────────────────────────────────────
  // Alpha = 1 - e^(-dt/τ)  — higher α = faster response
  // τ_drop = 1s,  τ_rise = 4s  at 15fps (dt ≈ 66ms)
  const TAU_DROP = 1000;   // ms
  const TAU_RISE = 4000;   // ms

  // ─── Face-loss decay ──────────────────────────────────────────────────────
  const FACE_DECAY_MS = 10_000; // 10s to reach 0

  // ─── Zone 2 dwell scoring curve ──────────────────────────────────────────
  // At 0s dwell  → gaze score = 100 (full credit)
  // At 45s dwell → gaze score = 65  (nudge threshold)
  // Beyond 45s   → gaze score continues declining to 30 floor
  const ZONE2_SCORE_START   = 100;
  const ZONE2_SCORE_NUDGE   = 65;
  const ZONE2_SCORE_FLOOR   = 30;
  const ZONE2_NUDGE_MS      = 45_000;
  const ZONE2_FLOOR_MS      = 90_000;

  // ─── Trend detection ──────────────────────────────────────────────────────
  const TREND_WINDOW_MS = 5_000;
  const TREND_THRESHOLD = 5;   // score change needed to call a trend

  // ─── Internal state ───────────────────────────────────────────────────────
  let smoothedScore     = 100;
  let prevBand          = 'FOCUSED';
  let lastFaceTimestamp = null;   // last frame where face was detected
  let lastScoreBeforeLoss = 100;  // score at the moment face disappeared
  let scoreHistory      = [];     // { timestamp, score } for trend detection
  let lastTimestamp     = null;

  // ─── Public: process(enrichedFrame) ──────────────────────────────────────
  /**
   * Main entry. Call once per frame with the output of ZoneManager.process().
   * @param {object} ef - enriched frame (frameData + activityContext)
   * @returns {AttentionResult}
   */
  function process(ef) {
    const now = ef.timestamp;
    const dt  = lastTimestamp ? now - lastTimestamp : 66; // ms since last frame
    lastTimestamp = now;

    // ── Face-loss path ───────────────────────────────────────────────────
    if (!ef.faceDetected) {
      return handleFaceLoss(now, dt);
    }

    // Face is present — reset decay anchor
    lastFaceTimestamp    = now;
    lastScoreBeforeLoss  = smoothedScore;

    // ── Score each signal ────────────────────────────────────────────────
    const gazeSignal     = scoreGaze(ef);
    const eyesSignal     = scoreEyes(ef);
    const headPoseSignal = scoreHeadPose(ef);
    const activitySignal = scoreActivity(ef);

    // ── Weighted combination ─────────────────────────────────────────────
    const rawScore =
      gazeSignal.score     * WEIGHTS.gaze     +
      eyesSignal.score     * WEIGHTS.eyes     +
      headPoseSignal.score * WEIGHTS.headPose +
      activitySignal.score * WEIGHTS.activity;

    // ── Adaptive smoothing ────────────────────────────────────────────────
    const tau   = rawScore < smoothedScore ? TAU_DROP : TAU_RISE;
    const alpha = 1 - Math.exp(-dt / tau);
    smoothedScore = smoothedScore + alpha * (rawScore - smoothedScore);
    smoothedScore = clamp(smoothedScore, 0, 100);

    // ── Enrich signal objects with contribution ───────────────────────────
    const signals = {
      gaze:     { ...gazeSignal,     weight: WEIGHTS.gaze,     contribution: round(gazeSignal.score     * WEIGHTS.gaze)     },
      eyes:     { ...eyesSignal,     weight: WEIGHTS.eyes,     contribution: round(eyesSignal.score     * WEIGHTS.eyes)     },
      headPose: { ...headPoseSignal, weight: WEIGHTS.headPose, contribution: round(headPoseSignal.score * WEIGHTS.headPose) },
      activity: { ...activitySignal, weight: WEIGHTS.activity, contribution: round(activitySignal.score * WEIGHTS.activity) },
    };

    return buildResult(now, rawScore, signals, 1.0);
  }

  // ─── Face loss handler ─────────────────────────────────────────────────
  function handleFaceLoss(now, dt) {
    let confidence = 1.0;

    if (lastFaceTimestamp !== null) {
      const goneMs = now - lastFaceTimestamp;
      const decayFactor = Math.max(0, 1 - goneMs / FACE_DECAY_MS);

      // Linear decay from last known score to 0 over 10s
      smoothedScore = lastScoreBeforeLoss * decayFactor;
      confidence    = decayFactor;
    } else {
      smoothedScore = 0;
      confidence    = 0;
    }

    smoothedScore = clamp(smoothedScore, 0, 100);

    // All signals unknown when face is gone
    const noSignal = (reason) => ({
      score: 0, weight: 0, contribution: 0, reason, unavailable: true,
    });

    const signals = {
      gaze:     noSignal('Face not detected'),
      eyes:     noSignal('Face not detected'),
      headPose: noSignal('Face not detected'),
      activity: noSignal('Face not detected'),
    };

    return buildResult(now, smoothedScore, signals, confidence);
  }

  // ═══════════════════════════════════════════════════════════════════════
  // SIGNAL SCORERS — each returns { score: 0–100, reason: string }
  // ═══════════════════════════════════════════════════════════════════════

  // ── Signal 1: Gaze / Zone (40%) ─────────────────────────────────────────
  /**
   * Scoring logic:
   *   ZONE_1 (screen)          → 100
   *   ZONE_2 confirmed         → 100 → decays to 65 at 45s, 30 floor at 90s
   *   ZONE_2 unconfirmed       → 75 (tentative credit, Zone 2 not learned yet)
   *   THINKING (brief away)    → 85 (brief, forgivable)
   *   DISTRACTED off-screen    → scales with offScreenMs: 70 → 0 over 30s
   *   gaze.offScreen w/ face   → 60
   */
  function scoreGaze(ef) {
    const { activity, zone, zone2DwellMs = 0 } = ef.activityContext ?? {};

    switch (activity) {
      case 'FOCUSED':
        return { score: 100, reason: 'Looking at screen' };

      case 'NOTE_TAKING': {
        // Dwell-time curve
        const score = zone2DwellCurve(zone2DwellMs);
        return { score, reason: `Note-taking (Zone 2, ${Math.round(zone2DwellMs / 1000)}s dwell)` };
      }

      case 'READING_OFFLINE': {
        // Same curve but starts penalising faster (passive reading ≠ active note-taking)
        const score = zone2DwellCurve(zone2DwellMs, 0.8);
        return { score, reason: `Reading offline (Zone 2, ${Math.round(zone2DwellMs / 1000)}s dwell)` };
      }

      case 'NOTE_TAKING_UNCONFIRMED':
        return { score: 75, reason: 'Head down — Zone 2 not confirmed yet' };

      case 'THINKING': {
        const offMs = ef.activityContext.offScreenMs ?? 0;
        // Linear drop: 85 at 0s → 70 at 5s
        const score = Math.max(70, 85 - (offMs / 5000) * 15);
        return { score: round(score), reason: `Briefly looking away (${Math.round(offMs / 1000)}s)` };
      }

      case 'DISTRACTED': {
        const offMs = ef.activityContext.offScreenMs ?? 0;
        // Faster drop: 65 at 2s → 0 at 30s
        const score = Math.max(0, 65 - (offMs / 30_000) * 65);
        return { score: round(score), reason: `Distracted (${Math.round(offMs / 1000)}s off-screen)` };
      }

      case 'DROWSY':
        return { score: 40, reason: 'Drowsy — gaze unreliable' };

      case 'ABSENT':
        return { score: 0, reason: 'Face not detected' };

      default:
        // Fallback: use raw gaze deviation if activityContext is unavailable
        if (ef.gaze?.offScreen) return { score: 50, reason: 'Gaze off-screen' };
        return { score: 90, reason: 'Gaze on-screen (no context)' };
    }
  }

  /**
   * Zone 2 dwell scoring curve.
   * @param {number} dwellMs     - ms spent in Zone 2 this visit
   * @param {number} multiplier  - apply a scaling factor (for READING_OFFLINE)
   */
  function zone2DwellCurve(dwellMs, multiplier = 1.0) {
    let score;
    if (dwellMs <= ZONE2_NUDGE_MS) {
      // Linear: 100 → 65 over 0–45s
      const t = dwellMs / ZONE2_NUDGE_MS;
      score = ZONE2_SCORE_START - t * (ZONE2_SCORE_START - ZONE2_SCORE_NUDGE);
    } else if (dwellMs <= ZONE2_FLOOR_MS) {
      // Continued linear: 65 → 30 over 45s–90s
      const t = (dwellMs - ZONE2_NUDGE_MS) / (ZONE2_FLOOR_MS - ZONE2_NUDGE_MS);
      score = ZONE2_SCORE_NUDGE - t * (ZONE2_SCORE_NUDGE - ZONE2_SCORE_FLOOR);
    } else {
      score = ZONE2_SCORE_FLOOR;
    }
    return round(clamp(score * multiplier, ZONE2_SCORE_FLOOR, ZONE2_SCORE_START));
  }

  // ── Signal 2: Eye openness / drowsiness (30%) ────────────────────────────
  /**
   * Scoring logic:
   *   OPEN                → 100
   *   BLINKING            → 95  (ignore natural blinks)
   *   SLOW_BLINK          → scales 95 → 50 with duration (400ms–2s)
   *   CLOSED              → scales 50 → 0 with duration (2s+)
   *   drowsyPattern       → caps score at 60 regardless of closure state
   *   avgOpenness < 0.5   → partial credit based on openness ratio
   */
  function scoreEyes(ef) {
    const { eyes, blinks } = ef;
    if (!eyes) return { score: 100, reason: 'Eye data unavailable' };

    const { closureState, closureDurationMs, avgOpenness } = eyes;
    const { drowsyPattern } = blinks ?? {};

    let score;
    let reason;

    switch (closureState) {
      case 'OPEN':
        // Scale openness: 0.5 → 1.0 maps to 70 → 100
        score  = avgOpenness >= 0.5
          ? 70 + (avgOpenness - 0.5) * 60    // 70–100
          : avgOpenness * 140;               // 0–70 for very sleepy open eyes
        reason = `Eyes open (${Math.round((avgOpenness ?? 0) * 100)}% openness)`;
        break;

      case 'BLINKING':
        score  = 95;
        reason = 'Natural blink in progress';
        break;

      case 'SLOW_BLINK': {
        // 95 at 400ms, decays to 50 at 2000ms
        const t = (closureDurationMs - 400) / (2000 - 400);
        score   = 95 - clamp(t, 0, 1) * 45;
        reason  = `Slow blink (${closureDurationMs}ms) — possible drowsiness`;
        break;
      }

      case 'CLOSED': {
        // 50 at 2s, decays to 0 at 7s+
        const t = clamp((closureDurationMs - 2000) / 5000, 0, 1);
        score   = 50 - t * 50;
        reason  = `Eyes closed (${Math.round(closureDurationMs / 1000)}s)`;
        break;
      }

      default:
        score  = 100;
        reason = 'Eye state unknown';
    }

    // Drowsy pattern caps score — 3+ slow blinks in 30s is a hard signal
    if (drowsyPattern && score > 60) {
      score  = 60;
      reason += ' — drowsy pattern detected';
    }

    return { score: round(clamp(score, 0, 100)), reason };
  }

  // ── Signal 3: Head pose (20%) ────────────────────────────────────────────
  /**
   * Scoring logic:
   *   All angles near 0   → 100
   *   Yaw   ±0–15°        → full credit
   *   Yaw   15–30°        → linear drop to 60
   *   Yaw   30°+          → linear drop to 0 at 60°
   *   Pitch ±0–15°        → full credit
   *   Pitch 15–25°        → moderate drop (could be note-taking)
   *   Pitch 25°+          → stronger drop
   *   Roll  contribution  → minor penalty only at extremes
   *
   * Note: head pose is down-weighted vs gaze because a student can
   * have their face slightly turned and still be focused.
   */
  function scoreHeadPose(ef) {
    const { headPose } = ef;
    if (!headPose || headPose.yaw === null) {
      return { score: 100, reason: 'Head pose unavailable' };
    }

    const yawAbs   = Math.abs(headPose.yaw);
    const pitchAbs = Math.abs(headPose.pitch);
    const rollAbs  = Math.abs(headPose.roll ?? 0);

    // Yaw score (left/right turn)
    let yawScore;
    if      (yawAbs <= 15) yawScore = 100;
    else if (yawAbs <= 30) yawScore = 100 - ((yawAbs - 15) / 15) * 40;  // 100→60
    else                   yawScore = Math.max(0, 60 - ((yawAbs - 30) / 30) * 60); // 60→0

    // Pitch score (up/down tilt)
    // Down is more forgiving than up (note-taking is down, phone-checking is also down
    // but context disambiguates; up = daydreaming)
    let pitchScore;
    if      (pitchAbs <= 15) pitchScore = 100;
    else if (pitchAbs <= 25) pitchScore = 100 - ((pitchAbs - 15) / 10) * 30; // 100→70
    else                     pitchScore = Math.max(0, 70 - ((pitchAbs - 25) / 20) * 70); // 70→0

    // Roll score (tilt) — only penalises at extremes
    const rollScore = rollAbs <= 20 ? 100 : Math.max(70, 100 - (rollAbs - 20) * 1.5);

    // Combine: yaw is most important head-pose signal
    const combined = yawScore * 0.55 + pitchScore * 0.35 + rollScore * 0.10;

    const reasons = [];
    if (yawAbs > 15)   reasons.push(`yaw ${headPose.yaw.toFixed(1)}°`);
    if (pitchAbs > 15) reasons.push(`pitch ${headPose.pitch.toFixed(1)}°`);
    if (rollAbs > 20)  reasons.push(`roll ${(headPose.roll ?? 0).toFixed(1)}°`);
    const reason = reasons.length ? `Head turned: ${reasons.join(', ')}` : 'Head facing screen';

    return { score: round(clamp(combined, 0, 100)), reason };
  }

  // ── Signal 4: Activity context (10%) ─────────────────────────────────────
  /**
   * Acts as a modifier that validates or penalises the other signals'
   * interpretation. Think of it as a "context tax/bonus".
   *
   *   FOCUSED              → 100 (confirms gaze reading)
   *   NOTE_TAKING          → 85  (legitimate, slight reduction)
   *   READING_OFFLINE      → 75  (less interactive, slightly more concern)
   *   NOTE_TAKING_UNCONFIRMED → 65 (we don't know yet)
   *   THINKING             → 80  (brief, normal cognitive behaviour)
   *   DISTRACTED           → 20  (hard contextual penalty)
   *   DROWSY               → 30  (impaired state)
   *   ABSENT               → 0
   */
  function scoreActivity(ef) {
    const activity = ef.activityContext?.activity ?? 'FOCUSED';

    const scoreMap = {
      FOCUSED:                 { score: 100, reason: 'Engaged with content' },
      NOTE_TAKING:             { score: 85,  reason: 'Active note-taking' },
      READING_OFFLINE:         { score: 75,  reason: 'Reading offline material' },
      NOTE_TAKING_UNCONFIRMED: { score: 65,  reason: 'Unconfirmed study activity' },
      THINKING:                { score: 80,  reason: 'Brief cognitive pause' },
      DISTRACTED:              { score: 20,  reason: 'Off-task behaviour detected' },
      DROWSY:                  { score: 30,  reason: 'Impaired alertness' },
      ABSENT:                  { score: 0,   reason: 'Student absent' },
    };

    return scoreMap[activity] ?? { score: 70, reason: `Unknown activity: ${activity}` };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // RESULT BUILDER
  // ═══════════════════════════════════════════════════════════════════════

  function buildResult(timestamp, rawScore, signals, confidence) {
    const score = round(smoothedScore);
    const band  = classifyBand(score);

    const bandChanged = band !== prevBand;
    prevBand = band;

    // Update score history for trend
    scoreHistory.push({ timestamp, score });
    scoreHistory = scoreHistory.filter(h => timestamp - h.timestamp < TREND_WINDOW_MS);

    return {
      timestamp,
      score,                          // smoothed 0–100
      band,                           // FOCUSED | MILD | DISTRACTED | ABSENT
      signals,                        // per-signal breakdown
      raw:        round(rawScore),    // pre-smoothing score
      confidence: round(confidence),  // 0–1
      bandChanged,                    // true only on transition frame
      trend:      computeTrend(),     // IMPROVING | DECLINING | STABLE
    };
  }

  // ─── Band classifier ──────────────────────────────────────────────────
  function classifyBand(score) {
    for (const band of BANDS) {
      if (score >= band.min && score <= band.max) return band.name;
    }
    return 'ABSENT';
  }

  // ─── Trend detector ───────────────────────────────────────────────────
  function computeTrend() {
    if (scoreHistory.length < 2) return 'STABLE';
    const oldest = scoreHistory[0].score;
    const latest = scoreHistory.at(-1).score;
    const delta  = latest - oldest;
    if (delta >  TREND_THRESHOLD) return 'IMPROVING';
    if (delta < -TREND_THRESHOLD) return 'DECLINING';
    return 'STABLE';
  }

  // ─── Public: reset() ──────────────────────────────────────────────────
  function reset() {
    smoothedScore        = 100;
    prevBand             = 'FOCUSED';
    lastFaceTimestamp    = null;
    lastScoreBeforeLoss  = 100;
    scoreHistory         = [];
    lastTimestamp        = null;
  }

  // ─── Public: getSmoothedScore() — lightweight REST call ───────────────
  function getSmoothedScore() {
    return {
      score: round(smoothedScore),
      band:  classifyBand(round(smoothedScore)),
    };
  }

  // ─── Utilities ─────────────────────────────────────────────────────────
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function round(n, d = 2)  { return Math.round(n * 10 ** d) / 10 ** d; }

  // ─── Public interface ──────────────────────────────────────────────────
  return { process, reset, getSmoothedScore };

})();

export default AttentionEngine;
