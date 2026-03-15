/**
 * gaze-zone-manager.js
 * =============================================================
 * Manages attention zones and classifies student activity context.
 *
 * Zone 1 (Primary)   — the screen. Always fixed.
 * Zone 2 (Secondary) — dynamically learned from gaze patterns.
 *                      Falls back to 30s head-down tolerance,
 *                      then manual override via settings.
 *
 * Activity states:
 *   FOCUSED          — looking at screen, eyes open
 *   NOTE_TAKING      — in Zone 2, periodic returns to screen
 *   READING_OFFLINE  — in Zone 2, longer dwell, book-like pattern
 *   THINKING         — brief off-screen, returns within ~5s
 *   DISTRACTED       — off-screen, not in Zone 2, no return pattern
 *   DROWSY           — eyes partially/fully closed
 *   ABSENT           — face not detected
 *
 * Usage:
 *   import ZoneManager from './gaze-zone-manager.js';
 *   ZoneManager.init(options);
 *   const context = ZoneManager.process(frameData);
 *   ZoneManager.setManualZone2({ yaw: -18, pitch: 28 }); // from settings
 *   ZoneManager.reset();
 */

const ZoneManager = (() => {

  // ─── Configuration (overridable via init()) ────────────────────────────────
  let config = {
    // Zone 1: screen-facing thresholds (degrees)
    zone1YawMax:        25,    // ±25° yaw = facing screen
    zone1PitchMax:      20,    // ±20° pitch = facing screen

    // Zone 2 cluster detection
    zone2ClusterRadius:  25,   // degrees — "medium" precision (~25% screen space)
    zone2MinLooks:       3,    // confirmed after 3 consistent looks
    zone2MinDwellMs:     800,  // each look must last at least 800ms to count
    zone2DriftWindow:    2 * 60_000, // 2 minutes of consistent new pattern = re-learn

    // Fallback tolerance (no Zone 2 confirmed yet)
    fallbackHeadDownMs:  30_000,    // 30s looking down before flagging

    // Activity timing
    thinkingMaxMs:       5_000,     // brief look-away ≤5s = thinking
    noteTakingMaxAwayMs: 45_000,    // max time in Zone 2 before soft nudge
    // Ratio: if >60% of recent 2min in Zone 2 = nudge
    zone2RatioWindow:    2 * 60_000,
    zone2MaxRatio:       0.60,
  };

  // ─── Zone 2 learning state ─────────────────────────────────────────────────
  let zone2 = {
    status:     'LEARNING',   // LEARNING | CONFIRMED | MANUAL | UNAVAILABLE
    center:     null,         // { yaw, pitch } — learned cluster center
    candidates: [],           // recent off-screen gaze vectors for clustering
    lookCount:  0,            // confirmed looks to current cluster
    confirmedAt: null,

    // Drift detection — watches for new consistent pattern
    driftCandidates: [],
    driftStartTime:  null,
    driftCenter:     null,
  };

  // ─── Session gaze history (for ratio calculations) ─────────────────────────
  let gazeHistory = [];       // { timestamp, inZone1, inZone2 }
  const HISTORY_WINDOW = 2 * 60_000;

  // ─── Off-screen tracking ───────────────────────────────────────────────────
  let offScreenStart    = null;   // when student left Zone 1
  let zone2DwellStart   = null;   // when student entered Zone 2
  let lastZone1Return   = null;   // last time student returned to Zone 1
  let zone2DwellMs      = 0;

  // ─── Activity state ────────────────────────────────────────────────────────
  let currentActivity   = 'FOCUSED';
  let activityStartTime = null;

  // ─── Public: init() ───────────────────────────────────────────────────────
  function init(options = {}) {
    config = { ...config, ...options };
  }

  // ─── Public: process(frameData) ───────────────────────────────────────────
  /**
   * Main entry point. Call once per frame with the worker's FrameData.
   * Returns an activityContext object to merge into the API output.
   */
  function process(fd) {
    const now = fd.timestamp;

    // ── No face ─────────────────────────────────────────────────────────────
    if (!fd.faceDetected) {
      setActivity('ABSENT', now);
      return buildContext('ABSENT', 'NONE', now);
    }

    // ── Drowsy / asleep overrides everything else ────────────────────────────
    if (fd.eyes.isAsleep || fd.blinks.drowsyPattern) {
      setActivity('DROWSY', now);
      return buildContext('DROWSY', 'ZONE_1', now);
    }

    const vec  = fd.raw.gazeVector;  // { yaw, pitch }
    const inZ1 = isInZone1(vec);
    const inZ2 = isInZone2(vec);

    // ── Update gaze history for ratio calculations ───────────────────────────
    gazeHistory.push({ timestamp: now, inZone1: inZ1, inZone2: inZ2 });
    gazeHistory = gazeHistory.filter(h => now - h.timestamp < HISTORY_WINDOW);

    // ── Zone 1 (screen) ──────────────────────────────────────────────────────
    if (inZ1) {
      offScreenStart  = null;
      zone2DwellStart = null;
      lastZone1Return = now;
      zone2DwellMs    = 0;

      // Feed Zone 1 return as a signal to zone learner
      // (returns mean the off-screen location is worth tracking)
      if (zone2.status === 'LEARNING') {
        recordZone1Return(now);
      }

      setActivity('FOCUSED', now);
      return buildContext('FOCUSED', 'ZONE_1', now);
    }

    // ── Off screen — start timer ─────────────────────────────────────────────
    if (!offScreenStart) offScreenStart = now;
    const offScreenMs = now - offScreenStart;

    // Feed raw gaze vector to zone learner (always running)
    feedLearner(vec, now, offScreenMs);

    // ── Zone 2 (confirmed or manual) ─────────────────────────────────────────
    if (inZ2) {
      if (!zone2DwellStart) zone2DwellStart = now;
      zone2DwellMs = now - zone2DwellStart;

      const activity = classifyZone2Activity(zone2DwellMs, now);
      setActivity(activity, now);

      return buildContext(activity, 'ZONE_2', now, {
        zone2DwellMs,
        zone2Location: zone2.center,
        nudge: shouldNudgeZone2(now),
      });
    }

    // ── Off screen, not in Zone 2 ─────────────────────────────────────────────
    zone2DwellStart = null;
    zone2DwellMs    = 0;

    // Brief thinking tolerance
    if (offScreenMs < config.thinkingMaxMs) {
      setActivity('THINKING', now);
      return buildContext('THINKING', 'NONE', now, { offScreenMs });
    }

    // Fallback: head pitched down = tolerate for 30s (likely studying)
    if (fd.headPose.lookingDown && zone2.status !== 'CONFIRMED' && zone2.status !== 'MANUAL') {
      if (offScreenMs < config.fallbackHeadDownMs) {
        setActivity('NOTE_TAKING', now); // tentative — Zone 2 not confirmed yet
        return buildContext('NOTE_TAKING_UNCONFIRMED', 'NONE', now, {
          offScreenMs,
          zone2Status: zone2.status,
          hint: 'Zone 2 not yet confirmed — using 30s head-down tolerance',
        });
      }
    }

    // Genuinely distracted
    setActivity('DISTRACTED', now);
    return buildContext('DISTRACTED', 'NONE', now, {
      offScreenMs,
      zone2Status: zone2.status,
    });
  }

  // ─── Zone 1 check ─────────────────────────────────────────────────────────
  function isInZone1(vec) {
    if (!vec || vec.yaw === null) return false;
    return Math.abs(vec.yaw)   <= config.zone1YawMax &&
           Math.abs(vec.pitch) <= config.zone1PitchMax;
  }

  // ─── Zone 2 check ─────────────────────────────────────────────────────────
  function isInZone2(vec) {
    if (!vec || !zone2.center) return false;
    if (zone2.status !== 'CONFIRMED' && zone2.status !== 'MANUAL') return false;
    return angularDistance(vec, zone2.center) <= config.zone2ClusterRadius;
  }

  // ─── Zone 2 learner ───────────────────────────────────────────────────────
  /**
   * Feed every off-screen gaze vector into the learner.
   * Strategy: collect candidates → find dense cluster →
   * require 3 dwell-worthy visits → confirm.
   */
  function feedLearner(vec, now, offScreenMs) {
    if (!vec || vec.yaw === null) return;
    if (zone2.status === 'MANUAL') return; // manual override — don't touch

    // Only count frames where student has been looking in this direction
    // for at least the minimum dwell time (avoids counting passing glances)
    if (offScreenMs < config.zone2MinDwellMs) return;

    // ── Initial learning ───────────────────────────────────────────────────
    if (zone2.status === 'LEARNING') {
      zone2.candidates.push({ ...vec, timestamp: now });

      // Keep a rolling 5-minute window of candidates
      zone2.candidates = zone2.candidates.filter(c => now - c.timestamp < 5 * 60_000);

      // Try to find a cluster once we have enough data
      if (zone2.candidates.length >= config.zone2MinLooks * 5) {
        const cluster = findDenseCluster(zone2.candidates);
        if (cluster) {
          zone2.center   = cluster.center;
          zone2.lookCount = cluster.memberCount;

          if (cluster.memberCount >= config.zone2MinLooks) {
            confirmZone2(now);
          }
        }
      }
      return;
    }

    // ── Drift detection (Zone 2 already confirmed) ─────────────────────────
    if (zone2.status === 'CONFIRMED') {
      const distFromCurrent = angularDistance(vec, zone2.center);

      if (distFromCurrent > config.zone2ClusterRadius * 1.5) {
        // Student is consistently looking somewhere new
        if (!zone2.driftStartTime) {
          zone2.driftStartTime  = now;
          zone2.driftCandidates = [];
        }
        zone2.driftCandidates.push({ ...vec, timestamp: now });

        const driftDuration = now - zone2.driftStartTime;

        if (driftDuration >= config.zone2DriftWindow) {
          // 2+ minutes of new consistent pattern — re-learn Zone 2
          const newCluster = findDenseCluster(zone2.driftCandidates);
          if (newCluster && newCluster.memberCount >= config.zone2MinLooks) {
            zone2.center        = newCluster.center;
            zone2.confirmedAt   = now;
            zone2.driftStartTime = null;
            zone2.driftCandidates = [];
          }
        }
      } else {
        // Still in current Zone 2 — reset drift tracker
        zone2.driftStartTime  = null;
        zone2.driftCandidates = [];
      }
    }
  }

  /**
   * Called when student returns to Zone 1 — this is evidence that their
   * off-screen location is legitimate (they're checking back at screen).
   */
  function recordZone1Return(now) {
    // Find the most recent candidate cluster and give it credit
    if (zone2.candidates.length < 3) return;

    const recent = zone2.candidates.filter(c => now - c.timestamp < 30_000);
    if (recent.length < config.zone2MinLooks) return;

    const cluster = findDenseCluster(recent);
    if (cluster && cluster.memberCount >= config.zone2MinLooks) {
      zone2.center    = cluster.center;
      zone2.lookCount = (zone2.lookCount || 0) + 1;

      if (zone2.lookCount >= config.zone2MinLooks) {
        confirmZone2(now);
      }
    }
  }

  function confirmZone2(now) {
    zone2.status      = 'CONFIRMED';
    zone2.confirmedAt = now;
  }

  // ─── Simple density-based cluster finder ──────────────────────────────────
  /**
   * Finds the densest cluster of gaze vectors.
   * Uses a simple grid-cell approach — fast, no dependencies.
   * Returns { center: {yaw, pitch}, memberCount } or null.
   */
  function findDenseCluster(candidates) {
    if (!candidates.length) return null;

    let bestCenter = null;
    let bestCount  = 0;

    for (const pivot of candidates) {
      const members = candidates.filter(
        c => angularDistance(c, pivot) <= config.zone2ClusterRadius
      );
      if (members.length > bestCount) {
        bestCount  = members.length;
        bestCenter = {
          yaw:   members.reduce((s, c) => s + c.yaw,   0) / members.length,
          pitch: members.reduce((s, c) => s + c.pitch, 0) / members.length,
        };
      }
    }

    return bestCount >= 2 ? { center: bestCenter, memberCount: bestCount } : null;
  }

  // ─── Activity classification inside Zone 2 ────────────────────────────────
  function classifyZone2Activity(dwellMs, now) {
    // How often are they returning to screen?
    const recentHistory = gazeHistory.filter(h => now - h.timestamp < 60_000);
    const zone1Returns  = recentHistory.filter(h => h.inZone1).length;
    const total         = recentHistory.length || 1;
    const zone1Ratio    = zone1Returns / total;

    if (zone1Ratio > 0.2) {
      // Returning to screen regularly — active note-taking pattern
      return 'NOTE_TAKING';
    } else {
      // Mostly staying in Zone 2 — passive reading
      return 'READING_OFFLINE';
    }
  }

  // ─── Zone 2 nudge logic ───────────────────────────────────────────────────
  function shouldNudgeZone2(now) {
    if (!zone2DwellStart) return false;

    // Trigger 1: continuous dwell > 45s
    if (zone2DwellMs > config.noteTakingMaxAwayMs) return true;

    // Trigger 2: ratio check — >60% of last 2min in Zone 2
    const recent      = gazeHistory.filter(h => now - h.timestamp < config.zone2RatioWindow);
    const zone2Frames = recent.filter(h => h.inZone2).length;
    const ratio       = zone2Frames / (recent.length || 1);
    if (ratio > config.zone2MaxRatio) return true;

    return false;
  }

  // ─── Activity state helper ─────────────────────────────────────────────────
  function setActivity(activity, now) {
    if (activity !== currentActivity) {
      currentActivity   = activity;
      activityStartTime = now;
    }
  }

  // ─── Build context object ──────────────────────────────────────────────────
  function buildContext(activity, zone, now, extra = {}) {
    return {
      activity,          // FOCUSED | NOTE_TAKING | NOTE_TAKING_UNCONFIRMED |
                         // READING_OFFLINE | THINKING | DISTRACTED | DROWSY | ABSENT
      zone,              // ZONE_1 | ZONE_2 | NONE
      activityDurationMs: activityStartTime ? now - activityStartTime : 0,

      zone2: {
        status:    zone2.status,      // LEARNING | CONFIRMED | MANUAL | UNAVAILABLE
        center:    zone2.center,      // { yaw, pitch } or null
        confidence: zone2ConfidenceScore(),
      },

      // Populated when relevant
      ...extra,
    };
  }

  function zone2ConfidenceScore() {
    if (zone2.status === 'MANUAL')     return 1.0;
    if (zone2.status !== 'CONFIRMED')  return 0.0;
    // Confidence based on how many looks contributed to the cluster
    return Math.min(1, zone2.lookCount / (config.zone2MinLooks * 3));
  }

  // ─── Angular distance between two gaze vectors ────────────────────────────
  function angularDistance(a, b) {
    if (!a || !b || a.yaw === null || b.yaw === null) return Infinity;
    return Math.sqrt((a.yaw - b.yaw) ** 2 + (a.pitch - b.pitch) ** 2);
  }

  // ─── Public: setManualZone2() — called from settings ──────────────────────
  /**
   * @param {{ yaw: number, pitch: number } | null} location
   * Pass null to clear the manual override and resume auto-detection.
   */
  function setManualZone2(location) {
    if (location === null) {
      zone2.status = 'LEARNING';
      zone2.center = null;
      zone2.lookCount = 0;
      zone2.candidates = [];
      return;
    }
    zone2.status = 'MANUAL';
    zone2.center = { yaw: location.yaw, pitch: location.pitch };
  }

  // ─── Public: getZone2Status() — for settings UI ───────────────────────────
  function getZone2Status() {
    return {
      status:      zone2.status,
      center:      zone2.center,
      confidence:  zone2ConfidenceScore(),
      lookCount:   zone2.lookCount,
      candidateCount: zone2.candidates.length,
    };
  }

  // ─── Public: reset() ──────────────────────────────────────────────────────
  function reset() {
    zone2 = {
      status: 'LEARNING', center: null, candidates: [],
      lookCount: 0, confirmedAt: null,
      driftCandidates: [], driftStartTime: null, driftCenter: null,
    };
    gazeHistory     = [];
    offScreenStart  = null;
    zone2DwellStart = null;
    lastZone1Return = null;
    zone2DwellMs    = 0;
    currentActivity = 'FOCUSED';
    activityStartTime = null;
  }

  // ─── Public interface ──────────────────────────────────────────────────────
  return {
    init,
    process,
    setManualZone2,
    getZone2Status,
    reset,
  };

})();

export default ZoneManager;
