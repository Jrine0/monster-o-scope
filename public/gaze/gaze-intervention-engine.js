/**
 * gaze-intervention-engine.js
 * =============================================================
 * Owns all intervention types and decides when/how to fire them.
 *
 * Intervention levels:
 *   1 — SUBTLE    Screen edge pulse only. No sound, no disruption.
 *   2 — SOFT      Pulse + audio chime. Student aware something changed.
 *   3 — HARD      Content blur + "I'm back" modal. Forces acknowledgement.
 *   4 — ESCALATED All of the above + webhook POST to teacher dashboard.
 *
 * Adaptive frequency:
 *   Session average score → cooldown multiplier
 *   avg ≥ 80  (strong)  → 2.0× cooldown  (less frequent nudges)
 *   avg 65–79 (good)    → 1.5× cooldown
 *   avg 50–64 (average) → 1.0× cooldown  (baseline)
 *   avg 35–49 (weak)    → 0.75× cooldown (more frequent)
 *   avg < 35  (poor)    → 0.5×  cooldown (most frequent)
 *
 * Usage:
 *   InterventionEngine.init({ webhookUrl: 'https://...' });
 *   InterventionEngine.fire(level, context);
 *   InterventionEngine.updateSessionAverage(score);
 *   InterventionEngine.notifyRecovery();   // student returned to focus
 *   InterventionEngine.reset();
 */

const InterventionEngine = (() => {

  // ─── Configuration ────────────────────────────────────────────────────────
  let config = {
    webhookUrl:      null,    // set via init() or setWebhookUrl()
    studentId:       null,    // passed through to webhook
    sessionId:       null,
    // Base cooldowns (ms) per level — scaled by adaptive multiplier
    cooldowns: {
      1: 30_000,   // subtle: 30s minimum between repeats
      2: 45_000,   // soft:   45s
      3: 60_000,   // hard:   60s
      4: 90_000,   // escalated: 90s
    },
  };

  // ─── Adaptive frequency state ─────────────────────────────────────────────
  let sessionAvgScore  = 75;   // initialise optimistically
  let cooldownMultiplier = 1.0;

  // ─── Intervention state ───────────────────────────────────────────────────
  let activeLevel           = 0;    // currently displayed intervention level
  let lastFiredAt           = {};   // level → timestamp
  let activeBlur            = false;
  let pulseAnimationId      = null;
  let pulseEl               = null;
  let blurEl                = null;
  let modalEl               = null;
  let recoveryTimer         = null;
  let onRecoveryCallback    = null; // called when student clicks "I'm back"

  // Session intervention log
  const interventionLog = [];

  // ─── Public: init() ───────────────────────────────────────────────────────
  function init(options = {}) {
    config = { ...config, ...options };
    setupDOMElements();
  }

  // ─── Public: fire(level, context) ─────────────────────────────────────────
  /**
   * Fire an intervention at the given level.
   * Respects adaptive cooldowns — won't re-fire if on cooldown.
   *
   * @param {1|2|3|4} level
   * @param {object}  context  — attentionResult + stateMachine output
   * @returns {boolean} whether intervention actually fired
   */
  function fire(level, context) {
    if (!isOffCooldown(level)) return false;

    const now = context.timestamp ?? performance.now();
    lastFiredAt[level] = now;
    activeLevel = level;

    // Log it
    const entry = {
      level,
      levelName:  LEVEL_NAMES[level],
      timestamp:  now,
      score:      context.score,
      band:       context.band,
      activity:   context.activity,
      state:      context.state,
    };
    interventionLog.push(entry);

    // ── Fire appropriate actions ───────────────────────────────────────
    if (level >= 1) firePulse(level);
    if (level >= 2) fireChime(level);
    if (level >= 3) fireBlur(context);
    if (level >= 4) fireWebhook(context);

    return true;
  }

  // ─── Public: notifyRecovery() ─────────────────────────────────────────────
  /**
   * Called by the state machine when the student has sustained 10s focus.
   * Clears all active interventions.
   */
  function notifyRecovery() {
    clearPulse();
    clearBlur();
    clearModal();
    activeLevel = 0;
    if (recoveryTimer) clearTimeout(recoveryTimer);
  }

  // ─── Public: updateSessionAverage(score) ─────────────────────────────────
  function updateSessionAverage(avg) {
    sessionAvgScore = avg;
    cooldownMultiplier = computeMultiplier(avg);
  }

  // ─── Public: getLog() ─────────────────────────────────────────────────────
  function getLog() { return [...interventionLog]; }

  // ─── Public: setOnRecovery(cb) ────────────────────────────────────────────
  // Callback fired when student clicks "I'm back" button
  function setOnRecovery(cb) { onRecoveryCallback = cb; }

  // ─── Adaptive multiplier ─────────────────────────────────────────────────
  function computeMultiplier(avg) {
    if      (avg >= 80) return 2.0;
    else if (avg >= 65) return 1.5;
    else if (avg >= 50) return 1.0;
    else if (avg >= 35) return 0.75;
    else                return 0.5;
  }

  function isOffCooldown(level) {
    const last     = lastFiredAt[level] ?? 0;
    const base     = config.cooldowns[level] ?? 30_000;
    const cooldown = base * cooldownMultiplier;
    return (performance.now() - last) >= cooldown;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // INTERVENTION IMPLEMENTATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  // ── Level 1: Screen edge pulse ────────────────────────────────────────────
  function firePulse(level) {
    if (!pulseEl) return;

    // Color intensity scales with level
    const colors = {
      1: 'rgba(255, 204, 0, 0.5)',    // amber — subtle
      2: 'rgba(255, 120, 0, 0.65)',   // orange — soft
      3: 'rgba(255, 40,  0, 0.80)',   // red — hard
      4: 'rgba(255, 0,   0, 1.00)',   // full red — critical
    };

    pulseEl.style.setProperty('--pulse-color', colors[level] ?? colors[1]);
    pulseEl.style.opacity = '1';
    pulseEl.dataset.level = level;
    pulseEl.classList.remove('gaze-pulse-active');
    void pulseEl.offsetWidth; // force reflow to restart animation
    pulseEl.classList.add('gaze-pulse-active');
  }

  function clearPulse() {
    pulseEl?.classList.remove('gaze-pulse-active');
    if (pulseEl) pulseEl.style.opacity = '0';
  }

  // ── Level 2: Audio chime ──────────────────────────────────────────────────
  function fireChime(level) {
    try {
      const ctx  = new (window.AudioContext || window.webkitAudioContext)();
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      // Softer tone for level 2, more urgent for level 4
      const freq = level >= 4 ? 880 : level === 3 ? 660 : 440;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.type = 'sine';

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.7);

      // Level 4: double chime
      if (level >= 4) {
        const osc2 = ctx.createOscillator();
        osc2.connect(gain);
        osc2.frequency.setValueAtTime(440, ctx.currentTime + 0.3);
        osc2.type = 'sine';
        osc2.start(ctx.currentTime + 0.3);
        osc2.stop(ctx.currentTime + 1.0);
      }

      // Clean up context after playback
      osc.onended = () => setTimeout(() => ctx.close(), 500);
    } catch (e) {
      console.warn('[GazeIntervention] Audio chime failed:', e.message);
    }
  }

  // ── Level 3: Content blur + modal ────────────────────────────────────────
  function fireBlur(context) {
    if (!blurEl || activeBlur) return;
    activeBlur = true;

    // Blur the main content area
    blurEl.style.backdropFilter = 'blur(8px)';
    blurEl.style.opacity        = '1';
    blurEl.style.pointerEvents  = 'all';

    // Show modal
    if (modalEl) {
      modalEl.style.display = 'flex';
      // Personalise message based on reason
      const msgEl = modalEl.querySelector('#gaze-modal-msg');
      if (msgEl) {
        msgEl.textContent = buildBlurMessage(context);
      }
    }
  }

  function buildBlurMessage(context) {
    const messages = {
      DISTRACTED: "Hey! Looks like you drifted off. Ready to get back to it?",
      CRITICAL:   "You've been away for a while. Let's get focused again!",
      DROWSY:     "You seem a bit tired. Take a breath and let's continue.",
      ABSENT:     "We lost you for a bit! Are you still there?",
    };
    return messages[context.state] ?? "Let's refocus!";
  }

  function clearBlur() {
    if (!activeBlur) return;
    activeBlur = false;
    if (blurEl) {
      blurEl.style.backdropFilter = '';
      blurEl.style.opacity        = '0';
      blurEl.style.pointerEvents  = 'none';
    }
    clearModal();
  }

  function clearModal() {
    if (modalEl) modalEl.style.display = 'none';
  }

  // ── Level 4: Webhook POST to teacher dashboard ────────────────────────────
  async function fireWebhook(context) {
    if (!config.webhookUrl) return;

    const payload = {
      event:       'ATTENTION_ESCALATED',
      timestamp:   new Date().toISOString(),
      studentId:   config.studentId,
      sessionId:   config.sessionId,
      score:       context.score,
      band:        context.band,
      state:       context.state,
      activity:    context.activity,
      faceMissingMs: context.faceMissingMs ?? 0,
      signals:     context.signals ?? null,
      sessionStats: context.sessionStats ?? null,
    };

    try {
      await fetch(config.webhookUrl, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
        // Fire-and-forget — don't block on response
        keepalive: true,
      });
    } catch (err) {
      console.warn('[GazeIntervention] Webhook failed:', err.message);
      // Fail silently — webhook delivery is best-effort
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // DOM SETUP
  // ═══════════════════════════════════════════════════════════════════════════

  function setupDOMElements() {
    // ── Inject styles ───────────────────────────────────────────────────
    if (!document.getElementById('gaze-intervention-styles')) {
      const style = document.createElement('style');
      style.id    = 'gaze-intervention-styles';
      style.textContent = `
        /* ── Pulse overlay ─────────────────────────────────────────── */
        #gaze-pulse-ring {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 9998;
          opacity: 0;
          border-radius: 0;
          box-shadow: inset 0 0 0 0px var(--pulse-color, rgba(255,204,0,0.5));
          transition: opacity 0.3s;
        }
        #gaze-pulse-ring.gaze-pulse-active {
          animation: gaze-pulse-anim 1.5s ease-in-out infinite;
        }
        @keyframes gaze-pulse-anim {
          0%   { box-shadow: inset 0 0 0  0px var(--pulse-color); }
          50%  { box-shadow: inset 0 0 0 18px var(--pulse-color); }
          100% { box-shadow: inset 0 0 0  0px var(--pulse-color); }
        }

        /* ── Blur overlay ──────────────────────────────────────────── */
        #gaze-blur-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          opacity: 0;
          pointer-events: none;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(0px);
          transition: opacity 0.4s, backdrop-filter 0.4s;
        }

        /* ── Focus modal ───────────────────────────────────────────── */
        #gaze-focus-modal {
          display: none;
          position: fixed;
          inset: 0;
          z-index: 10000;
          align-items: center;
          justify-content: center;
        }
        #gaze-focus-modal-inner {
          background: #1a1a2e;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 36px 40px;
          text-align: center;
          max-width: 380px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.6);
          animation: gaze-modal-in 0.3s ease-out;
        }
        @keyframes gaze-modal-in {
          from { transform: scale(0.85); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }
        #gaze-focus-modal h2 {
          font-size: 1.5rem;
          color: #ffffff;
          margin: 0 0 12px;
        }
        #gaze-modal-msg {
          font-size: 0.95rem;
          color: rgba(255,255,255,0.7);
          margin: 0 0 24px;
          line-height: 1.5;
        }
        #gaze-im-back-btn {
          background: linear-gradient(135deg, #00ffcc, #0099ff);
          color: #000;
          border: none;
          border-radius: 8px;
          padding: 12px 32px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: transform 0.1s, opacity 0.2s;
          letter-spacing: 0.5px;
        }
        #gaze-im-back-btn:hover  { opacity: 0.9; transform: scale(1.03); }
        #gaze-im-back-btn:active { transform: scale(0.97); }

        /* ── Recovery progress ring ────────────────────────────────── */
        #gaze-recovery-ring {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 56px;
          height: 56px;
          z-index: 9997;
          display: none;
        }
        #gaze-recovery-ring svg circle.track {
          fill: none;
          stroke: rgba(255,255,255,0.1);
          stroke-width: 4;
        }
        #gaze-recovery-ring svg circle.progress {
          fill: none;
          stroke: #00ffcc;
          stroke-width: 4;
          stroke-linecap: round;
          transform: rotate(-90deg);
          transform-origin: 50% 50%;
          transition: stroke-dashoffset 0.3s;
        }
      `;
      document.head.appendChild(style);
    }

    // ── Pulse ring ──────────────────────────────────────────────────────
    if (!document.getElementById('gaze-pulse-ring')) {
      pulseEl = document.createElement('div');
      pulseEl.id = 'gaze-pulse-ring';
      document.body.appendChild(pulseEl);
    } else {
      pulseEl = document.getElementById('gaze-pulse-ring');
    }

    // ── Blur overlay ────────────────────────────────────────────────────
    if (!document.getElementById('gaze-blur-overlay')) {
      blurEl = document.createElement('div');
      blurEl.id = 'gaze-blur-overlay';
      document.body.appendChild(blurEl);
    } else {
      blurEl = document.getElementById('gaze-blur-overlay');
    }

    // ── Focus modal ─────────────────────────────────────────────────────
    if (!document.getElementById('gaze-focus-modal')) {
      modalEl = document.createElement('div');
      modalEl.id        = 'gaze-focus-modal';
      modalEl.innerHTML = `
        <div id="gaze-focus-modal-inner">
          <h2>👋 Hey there!</h2>
          <p id="gaze-modal-msg">Looks like you drifted off. Ready to get back to it?</p>
          <button id="gaze-im-back-btn">I'm back!</button>
        </div>
      `;
      document.body.appendChild(modalEl);

      document.getElementById('gaze-im-back-btn').addEventListener('click', () => {
        clearBlur();
        clearPulse();
        activeLevel = 0;
        onRecoveryCallback?.({ source: 'manual', timestamp: performance.now() });
      });
    } else {
      modalEl = document.getElementById('gaze-focus-modal');
    }

    // ── Recovery ring ───────────────────────────────────────────────────
    if (!document.getElementById('gaze-recovery-ring')) {
      const ringEl = document.createElement('div');
      ringEl.id        = 'gaze-recovery-ring';
      const circ       = 2 * Math.PI * 24; // r=24
      ringEl.innerHTML = `
        <svg viewBox="0 0 56 56">
          <circle class="track"    cx="28" cy="28" r="24"/>
          <circle class="progress" cx="28" cy="28" r="24"
            stroke-dasharray="${circ}"
            stroke-dashoffset="${circ}"/>
        </svg>
      `;
      document.body.appendChild(ringEl);
    }
  }

  // ─── Public: updateRecoveryProgress(0–1) ─────────────────────────────────
  /**
   * Called every frame during recovery — animates the recovery ring.
   */
  function updateRecoveryProgress(progress) {
    const ringEl = document.getElementById('gaze-recovery-ring');
    if (!ringEl) return;

    if (progress <= 0) {
      ringEl.style.display = 'none';
      return;
    }

    ringEl.style.display = 'block';
    const circ   = 2 * Math.PI * 24;
    const circle = ringEl.querySelector('circle.progress');
    if (circle) {
      circle.style.strokeDashoffset = circ * (1 - progress);
    }
  }

  // ─── Public: setWebhookUrl() ──────────────────────────────────────────────
  function setWebhookUrl(url) { config.webhookUrl = url; }

  // ─── Public: reset() ──────────────────────────────────────────────────────
  function reset() {
    notifyRecovery();
    lastFiredAt        = {};
    activeLevel        = 0;
    sessionAvgScore    = 75;
    cooldownMultiplier = 1.0;
  }

  // ─── Constants ────────────────────────────────────────────────────────────
  const LEVEL_NAMES = {
    1: 'SUBTLE',
    2: 'SOFT',
    3: 'HARD',
    4: 'ESCALATED',
  };

  return {
    init,
    fire,
    notifyRecovery,
    updateSessionAverage,
    updateRecoveryProgress,
    setWebhookUrl,
    getLog,
    setOnRecovery,
    reset,
  };

})();

export default InterventionEngine;
