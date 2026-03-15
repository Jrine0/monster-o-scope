/**
 * gaze-state-machine.js
 * =============================================================
 * Manages attention state transitions with hysteresis.
 * Sits between the Attention Engine (scores) and the
 * Intervention Engine (actions).
 *
 * States:
 *   FOCUSED     — score 85–100, fully on task
 *   MILD        — score 60–84, slight drift
 *   DISTRACTED  — score 30–59, clearly off task
 *   CRITICAL    — score 0–29 OR sustained DISTRACTED, needs hard interrupt
 *   RECOVERING  — score rising, waiting for 10s sustained focus
 *
 * Hysteresis principle:
 *   Entering a worse state requires the bad score to persist for
 *   a grace period. Recovering requires 10s of sustained improvement.
 *   This prevents thrashing when a student is right on a boundary.
 *
 * Output per frame:
 * {
 *   state:          'DISTRACTED',
 *   prevState:      'MILD',
 *   stateChanged:   true,
 *   stateDurationMs: 3200,
 *   escalationLevel: 2,          // 0=none, 1=subtle, 2=soft, 3=hard, 4=critical
 *   shouldIntervene: true,        // true only on the frame intervention fires
 *   recoveryProgress: 0,          // 0–1, how far through the 10s recovery window
 * }
 */

const StateMachine = (() => {

  // ─── State transition grace periods (ms) ─────────────────────────────────
  // How long a bad score must persist before state worsens
  const GRACE = {
    FOCUSED_TO_MILD:       3_000,   // 3s below 60 → MILD
    MILD_TO_DISTRACTED:    5_000,   // 5s more below 60 → DISTRACTED
    DISTRACTED_TO_CRITICAL: 8_000, // 8s more below 30 → CRITICAL
    FACE_GONE_TO_CRITICAL: 30_000, // 30s no face → CRITICAL
  };

  // ─── Recovery threshold ───────────────────────────────────────────────────
  // Score must stay ABOVE this to count toward recovery
  const RECOVERY_THRESHOLD  = 70;   // higher than entry thresholds (hysteresis)
  const RECOVERY_REQUIRED_MS = 10_000; // 10s sustained

  // ─── Escalation level per state ───────────────────────────────────────────
  const STATE_ESCALATION = {
    FOCUSED:    0,
    RECOVERING: 0,
    MILD:       1,
    DISTRACTED: 2,  // escalates to 3 after GRACE.DISTRACTED_TO_CRITICAL
    CRITICAL:   4,
  };

  // ─── Internal state ───────────────────────────────────────────────────────
  let currentState      = 'FOCUSED';
  let stateEnteredAt    = null;   // timestamp when current state began
  let badScoreStartedAt = null;   // when score first dropped below threshold
  let recoveryStartedAt = null;   // when sustained recovery began
  let hardInterventionAt = null;  // when Level 3 fired (for escalation timing)
  let faceGoneAt        = null;

  // Track whether each escalation level has fired in current bad episode
  let firedLevels = new Set();

  // ─── Public: process(attentionResult, timestamp) ─────────────────────────
  function process(ar, timestamp) {
    if (!stateEnteredAt) stateEnteredAt = timestamp;

    const score       = ar.score;
    const band        = ar.band;
    const facePresent = ar.confidence > 0.1;

    // ── Face tracking ───────────────────────────────────────────────────
    if (!facePresent) {
      if (!faceGoneAt) faceGoneAt = timestamp;
    } else {
      faceGoneAt = null;
    }

    const faceMissingMs = faceGoneAt ? timestamp - faceGoneAt : 0;

    // ── Determine target state ───────────────────────────────────────────
    const prevState = currentState;
    updateState(score, band, timestamp, faceMissingMs);

    const stateChanged    = currentState !== prevState;
    const stateDurationMs = timestamp - (stateEnteredAt ?? timestamp);

    if (stateChanged) {
      stateEnteredAt = timestamp;
      if (isWorseThan(currentState, prevState)) {
        // Entering worse state — reset recovery
        recoveryStartedAt = null;
      } else {
        // Improving — reset bad score timer
        badScoreStartedAt = null;
      }
      if (currentState === 'FOCUSED') {
        firedLevels = new Set(); // full reset on return to focused
      }
    }

    // ── Escalation level ─────────────────────────────────────────────────
    const escalationLevel = computeEscalationLevel(timestamp, stateDurationMs);

    // ── Should intervene this frame? ─────────────────────────────────────
    // Only fires once per escalation level per bad episode
    const shouldIntervene = escalationLevel > 0 && !firedLevels.has(escalationLevel);
    if (shouldIntervene) firedLevels.add(escalationLevel);

    // ── Recovery progress ─────────────────────────────────────────────────
    let recoveryProgress = 0;
    if (currentState === 'RECOVERING' && recoveryStartedAt) {
      recoveryProgress = Math.min(1, (timestamp - recoveryStartedAt) / RECOVERY_REQUIRED_MS);
    }

    return {
      state:            currentState,
      prevState,
      stateChanged,
      stateDurationMs,
      escalationLevel,
      shouldIntervene,
      recoveryProgress,
      faceMissingMs,
    };
  }

  // ─── State transition logic ───────────────────────────────────────────────
  function updateState(score, band, now, faceMissingMs) {

    // ── Critical: face missing too long ───────────────────────────────────
    if (faceMissingMs >= GRACE.FACE_GONE_TO_CRITICAL) {
      transition('CRITICAL', now);
      return;
    }

    switch (currentState) {

      case 'FOCUSED':
        if (score < 60) {
          if (!badScoreStartedAt) badScoreStartedAt = now;
          if (now - badScoreStartedAt >= GRACE.FOCUSED_TO_MILD) {
            transition('MILD', now);
          }
        } else {
          badScoreStartedAt = null;
        }
        break;

      case 'MILD':
        if (score >= RECOVERY_THRESHOLD) {
          // Potentially recovering
          if (!recoveryStartedAt) recoveryStartedAt = now;
          if (now - recoveryStartedAt >= RECOVERY_REQUIRED_MS) {
            transition('FOCUSED', now);
          }
        } else {
          recoveryStartedAt = null;
          // Keep degrading?
          if (score < 60) {
            if (!badScoreStartedAt) badScoreStartedAt = now;
            if (now - badScoreStartedAt >= GRACE.MILD_TO_DISTRACTED) {
              transition('DISTRACTED', now);
            }
          }
        }
        break;

      case 'DISTRACTED':
        if (score >= RECOVERY_THRESHOLD) {
          if (!recoveryStartedAt) recoveryStartedAt = now;
          if (now - recoveryStartedAt >= RECOVERY_REQUIRED_MS) {
            transition('MILD', now);
          }
        } else {
          recoveryStartedAt = null;
          if (score < 30) {
            if (!badScoreStartedAt) badScoreStartedAt = now;
            if (now - badScoreStartedAt >= GRACE.DISTRACTED_TO_CRITICAL) {
              transition('CRITICAL', now);
            }
          }
        }
        break;

      case 'CRITICAL':
        if (score >= RECOVERY_THRESHOLD && faceMissingMs === 0) {
          if (!recoveryStartedAt) recoveryStartedAt = now;
          if (now - recoveryStartedAt >= RECOVERY_REQUIRED_MS) {
            transition('DISTRACTED', now); // step down, not jump to FOCUSED
          }
        } else {
          recoveryStartedAt = null;
        }
        break;

      case 'RECOVERING':
        if (score >= RECOVERY_THRESHOLD) {
          if (now - recoveryStartedAt >= RECOVERY_REQUIRED_MS) {
            transition('FOCUSED', now);
          }
        } else {
          // Recovery broken — step back
          recoveryStartedAt = null;
          transition(score < 30 ? 'CRITICAL' : 'DISTRACTED', now);
        }
        break;
    }
  }

  function transition(newState, now) {
    if (newState === currentState) return;
    currentState   = newState;
    stateEnteredAt = now;
  }

  // ─── Escalation level computation ─────────────────────────────────────────
  // Level 1 — MILD entry
  // Level 2 — DISTRACTED entry
  // Level 3 — DISTRACTED for 8s (hard interrupt)
  // Level 4 — CRITICAL
  function computeEscalationLevel(now, stateDurationMs) {
    switch (currentState) {
      case 'MILD':
        return 1;
      case 'DISTRACTED':
        // Escalate to level 3 after 8s in DISTRACTED
        return stateDurationMs >= GRACE.DISTRACTED_TO_CRITICAL ? 3 : 2;
      case 'CRITICAL':
        return 4;
      default:
        return 0;
    }
  }

  // ─── Utility ──────────────────────────────────────────────────────────────
  const STATE_RANK = { FOCUSED: 0, RECOVERING: 0, MILD: 1, DISTRACTED: 2, CRITICAL: 3 };
  function isWorseThan(a, b) {
    return (STATE_RANK[a] ?? 0) > (STATE_RANK[b] ?? 0);
  }

  // ─── Public: reset() ──────────────────────────────────────────────────────
  function reset() {
    currentState       = 'FOCUSED';
    stateEnteredAt     = null;
    badScoreStartedAt  = null;
    recoveryStartedAt  = null;
    hardInterventionAt = null;
    faceGoneAt         = null;
    firedLevels        = new Set();
  }

  // ─── Public: getState() ───────────────────────────────────────────────────
  function getState() { return currentState; }

  return { process, reset, getState };

})();

export default StateMachine;
