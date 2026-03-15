/**
 * gaze-api.js  (v2 — main-thread MediaPipe, no worker)
 * =============================================================
 * MediaPipe tasks-vision cannot be loaded in any worker context:
 *   - ESM build (vision_bundle.mjs) calls self.import() → fails
 *   - CJS build (vision_bundle.js)  has ES export wrapper   → fails
 *
 * Solution: run FaceLandmarker directly on the main thread.
 * MediaPipe's WASM executes in its own thread pool regardless,
 * so the performance impact is ~4ms per frame — imperceptible.
 *
 * Usage (unchanged from original):
 *   import GazeAPI from './gaze-api.js';
 *   await GazeAPI.start({ studentId, sessionId, lessonId, webhookUrl });
 *   GazeAPI.subscribe('frame', (f) => { ... });
 *   GazeAPI.subscribe('score', (s) => { ... });
 *   GazeAPI.stop();
 *   const summary = GazeAPI.finaliseSession();
 */

import ZoneManager         from './gaze-zone-manager.js';
import AttentionEngine     from './gaze-attention-engine.js';
import StateMachine        from './gaze-state-machine.js';
import InterventionEngine  from './gaze-intervention-engine.js';
import SessionSummariser   from './gaze-session-summariser.js';

const GazeAPI = (() => {

  const MEDIAPIPE_VERSION = '0.10.14';
  const MEDIAPIPE_BASE    = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_VERSION}`;
  const MODEL_URL         =
    'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

  let faceLandmarker  = null;
  let videoEl         = null;
  let stream          = null;
  let frameLoopId     = null;
  let isRunning       = false;
  let isReady         = false;
  let currentState    = null;

  const session = {
    startTime: null, totalFrames: 0,
    focusedFrames: 0, missingFrames: 0, events: [],
  };

  const listeners = {
    frame: [], attention: [], score: [], intervention: [],
    zone2: [], error: [], ready: [],
  };

  // ── Landmark indices ───────────────────────────────────────────────────────
  const LM = {
    NOSE_TIP: 1, CHIN: 152,
    LEFT_EYE_OUTER: 33,  RIGHT_EYE_OUTER: 263,
    LEFT_IRIS: 468,       RIGHT_IRIS: 473,
    LEFT_EYE_TOP: 159,   LEFT_EYE_BOT: 145,
    LEFT_EYE_LEFT: 33,   LEFT_EYE_RIGHT: 133,
    RIGHT_EYE_TOP: 386,  RIGHT_EYE_BOT: 374,
    RIGHT_EYE_LEFT: 362, RIGHT_EYE_RIGHT: 263,
    FOREHEAD: 10, LEFT_TEMPLE: 234, RIGHT_TEMPLE: 454,
  };

  // ── Eye closure state ──────────────────────────────────────────────────────
  const EYE_THRESHOLDS = { CLOSED: 0.15, DROWSY: 0.28 };
  const EYE_DURATIONS  = { BLINK_MAX: 400, SLOW_BLINK_MAX: 2000 };
  let eyeClosureState    = 'OPEN';
  let eyeClosureStart    = null;
  let eyeClosureDuration = 0;
  let blinkLog    = [];
  let slowBlinkLog = [];

  // ── Init MediaPipe on main thread ──────────────────────────────────────────
  async function initMediaPipe() {
    try {
      const { FaceLandmarker, FilesetResolver } = await import(
        `${MEDIAPIPE_BASE}/vision_bundle.mjs`
      );

      const filesetResolver = await FilesetResolver.forVisionTasks(
        `${MEDIAPIPE_BASE}/wasm`
      );

      faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: { modelAssetPath: MODEL_URL, delegate: 'GPU' },
        outputFaceBlendshapes: true,
        outputFacialTransformationMatrixes: true,
        runningMode: 'VIDEO',
        numFaces: 1,
      });

      isReady = true;
      emit('ready', { timestamp: Date.now() });
      requestAnimationFrame(frameLoop);

    } catch (err) {
      emit('error', { message: `MediaPipe init failed: ${err.message}`, source: 'mediapipe' });
    }
  }

  // ── Public: start() ────────────────────────────────────────────────────────
  async function start({
    fps = 15, videoElement = null,
    studentId = null, sessionId = null, lessonId = null,
    webhookUrl = null, videoStream = null,
  } = {}) {
    if (isRunning) { console.warn('[GazeAPI] Already running.'); return; }

    // Use pre-opened stream (from permission prompt) or open a new one
    if (videoStream) {
      stream = videoStream;
    } else {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, frameRate: fps }, audio: false,
        });
      } catch (err) {
        emit('error', { message: `Webcam access denied: ${err.message}`, source: 'webcam' });
        return;
      }
    }

    videoEl = videoElement ?? document.createElement('video');
    videoEl.srcObject   = stream;
    videoEl.autoplay    = true;
    videoEl.playsInline = true;
    videoEl.muted       = true;
    if (!videoElement) { videoEl.style.display = 'none'; document.body.appendChild(videoEl); }
    await videoEl.play();

    ZoneManager.reset();
    AttentionEngine.reset();
    StateMachine.reset();
    InterventionEngine.reset();
    SessionSummariser.init({ studentId, sessionId, lessonId: lessonId ?? null });
    InterventionEngine.init({ studentId, sessionId, webhookUrl: webhookUrl ?? null });
    InterventionEngine.setOnRecovery((e) => emit('intervention', { type: 'MANUAL_RECOVERY', ...e }));

    session.startTime     = Date.now();
    session.totalFrames   = 0;
    session.focusedFrames = 0;
    session.missingFrames = 0;
    session.events        = [];

    isRunning = true;

    // Initialise MediaPipe (async — 'ready' event fires when done)
    await initMediaPipe();
  }

  // ── Public: stop() ─────────────────────────────────────────────────────────
  function stop() {
    if (!isRunning) return;
    cancelAnimationFrame(frameLoopId);
    frameLoopId = null;
    faceLandmarker?.close();
    faceLandmarker = null;
    stream?.getTracks().forEach(t => t.stop());
    stream = null;
    if (videoEl && !videoEl.id) videoEl.remove();
    videoEl  = null;
    isRunning = false;
    isReady   = false;
  }

  // ── Public: subscribe() ────────────────────────────────────────────────────
  function subscribe(event, callback) {
    if (!listeners[event]) {
      console.warn(`[GazeAPI] Unknown event: "${event}"`);
      return () => {};
    }
    listeners[event].push(callback);
    return () => { listeners[event] = listeners[event].filter(cb => cb !== callback); };
  }

  // ── Frame loop (runs on main thread at 15fps) ──────────────────────────────
  let lastFrameTime = 0;
  const FRAME_BUDGET = 1000 / 15;

  function frameLoop(now) {
    if (!isRunning) return;
    frameLoopId = requestAnimationFrame(frameLoop);
    if (now - lastFrameTime < FRAME_BUDGET) return;
    lastFrameTime = now;
    if (!videoEl || videoEl.readyState < 2 || !isReady) return;

    const results = faceLandmarker.detectForVideo(videoEl, performance.now());
    const frameData = processResults(results, performance.now());
    handleFrameData(frameData);
  }

  // ── Process MediaPipe results into FrameData ───────────────────────────────
  function processResults(results, timestamp) {
    if (!results.faceLandmarks || results.faceLandmarks.length === 0) {
      return buildEmptyFrame(timestamp);
    }

    const lm     = results.faceLandmarks[0];
    const matrix = results.facialTransformationMatrixes?.[0]?.data ?? null;

    const gazeX = computeGazeX(lm);
    const gazeY = computeGazeY(lm);
    const { yaw, pitch, roll } = computeHeadPose(matrix, lm);

    const leftOpen  = eyeAspectRatio(lm, 'left');
    const rightOpen = eyeAspectRatio(lm, 'right');
    const avgOpen   = (leftOpen + rightOpen) / 2;

    const closure   = updateEyeClosureState(leftOpen, rightOpen, timestamp);
    const blinkRate = getNormalBlinkRate(timestamp);
    const slowRate  = getSlowBlinkRate(timestamp);

    return {
      timestamp, faceDetected: true,
      gaze: {
        x: r(gazeX), y: r(gazeY),
        offScreen: Math.abs(gazeX) > 0.25 || Math.abs(gazeY) > 0.25,
        vector: { yaw: r(yaw), pitch: r(pitch) },
      },
      headPose: {
        yaw: r(yaw), pitch: r(pitch), roll: r(roll),
        facingAway:  Math.abs(yaw) > 30 || Math.abs(pitch) > 25,
        lookingDown: pitch > 15, lookingUp: pitch < -20,
        lookingLeft: yaw < -20,  lookingRight: yaw > 20,
      },
      eyes: {
        leftOpenness: r(leftOpen), rightOpenness: r(rightOpen), avgOpenness: r(avgOpen),
        closureState: closure.state, closureDurationMs: closure.durationMs,
        isBlinking: closure.state === 'BLINKING',
        isDrowsy:   closure.state === 'SLOW_BLINK' || closure.drowsyPattern,
        isAsleep:   closure.state === 'CLOSED',
      },
      blinks: {
        detected: closure.newNormalBlink, slowBlinkDetected: closure.newSlowBlink,
        normalRatePerMinute: r(blinkRate), slowRatePerMinute: r(slowRate),
        drowsyPattern: closure.drowsyPattern,
        abnormalNormal: blinkRate > 30 || blinkRate < 5,
      },
      raw: {
        leftIris:  { x: r(lm[LM.LEFT_IRIS].x),  y: r(lm[LM.LEFT_IRIS].y)  },
        rightIris: { x: r(lm[LM.RIGHT_IRIS].x), y: r(lm[LM.RIGHT_IRIS].y) },
        noseTip:   { x: r(lm[LM.NOSE_TIP].x),   y: r(lm[LM.NOSE_TIP].y)  },
        gazeVector: { yaw: r(yaw), pitch: r(pitch) },
      },
    };
  }

  // ── Signal helpers ─────────────────────────────────────────────────────────
  function computeGazeX(lm) { return (irisOffX(lm,'left') + irisOffX(lm,'right')) / 2; }
  function irisOffX(lm, s) {
    const iris  = s==='left' ? lm[LM.LEFT_IRIS]      : lm[LM.RIGHT_IRIS];
    const inner = s==='left' ? lm[LM.LEFT_EYE_RIGHT] : lm[LM.RIGHT_EYE_LEFT];
    const outer = s==='left' ? lm[LM.LEFT_EYE_LEFT]  : lm[LM.RIGHT_EYE_RIGHT];
    return (iris.x - (outer.x+inner.x)/2) / (Math.abs(outer.x-inner.x)||0.001);
  }
  function computeGazeY(lm) { return (irisOffY(lm,'left') + irisOffY(lm,'right')) / 2; }
  function irisOffY(lm, s) {
    const iris = s==='left' ? lm[LM.LEFT_IRIS]    : lm[LM.RIGHT_IRIS];
    const top  = s==='left' ? lm[LM.LEFT_EYE_TOP] : lm[LM.RIGHT_EYE_TOP];
    const bot  = s==='left' ? lm[LM.LEFT_EYE_BOT] : lm[LM.RIGHT_EYE_BOT];
    return (iris.y - (top.y+bot.y)/2) / (Math.abs(bot.y-top.y)||0.001);
  }
  function eyeAspectRatio(lm, s) {
    const top  = s==='left' ? lm[LM.LEFT_EYE_TOP]   : lm[LM.RIGHT_EYE_TOP];
    const bot  = s==='left' ? lm[LM.LEFT_EYE_BOT]   : lm[LM.RIGHT_EYE_BOT];
    const l    = s==='left' ? lm[LM.LEFT_EYE_LEFT]  : lm[LM.RIGHT_EYE_LEFT];
    const ri   = s==='left' ? lm[LM.LEFT_EYE_RIGHT] : lm[LM.RIGHT_EYE_RIGHT];
    return Math.min(1, (dist(top,bot) / (dist(l,ri)||0.001)) / 0.35);
  }
  function dist(a,b) { return Math.sqrt((a.x-b.x)**2+(a.y-b.y)**2); }
  function computeHeadPose(matrix, lm) {
    if (matrix?.length >= 16) {
      const [r00,r10,r20,,,,r21,,,,r22] = matrix;
      return {
        pitch: Math.atan2(-r20, Math.sqrt(r00**2+r10**2)) * (180/Math.PI),
        yaw:   Math.atan2(r10, r00) * (180/Math.PI),
        roll:  Math.atan2(r21, r22) * (180/Math.PI),
      };
    }
    const lw = Math.abs(lm[LM.NOSE_TIP].x - lm[LM.LEFT_TEMPLE].x);
    const rw = Math.abs(lm[LM.RIGHT_TEMPLE].x - lm[LM.NOSE_TIP].x);
    return { yaw: ((rw-lw)/(lw+rw))*90, pitch: 0, roll: 0 };
  }
  function updateEyeClosureState(leftOpen, rightOpen, ts) {
    const avg = (leftOpen+rightOpen)/2;
    const closed = avg < EYE_THRESHOLDS.CLOSED || avg < EYE_THRESHOLDS.DROWSY;
    let newNormalBlink=false, newSlowBlink=false;
    if (closed) {
      if (!eyeClosureStart) eyeClosureStart = ts;
      eyeClosureDuration = ts - eyeClosureStart;
      eyeClosureState = eyeClosureDuration >= EYE_DURATIONS.SLOW_BLINK_MAX ? 'CLOSED'
                      : eyeClosureDuration >= EYE_DURATIONS.BLINK_MAX      ? 'SLOW_BLINK'
                      : 'BLINKING';
    } else {
      if (eyeClosureStart) {
        const d = ts - eyeClosureStart;
        if      (d < EYE_DURATIONS.BLINK_MAX)      { newNormalBlink=true; blinkLog.push(ts); }
        else if (d < EYE_DURATIONS.SLOW_BLINK_MAX) { newSlowBlink=true;   slowBlinkLog.push(ts); }
      }
      eyeClosureState='OPEN'; eyeClosureStart=null; eyeClosureDuration=0;
    }
    slowBlinkLog = slowBlinkLog.filter(t => ts-t < 30_000);
    return { state:eyeClosureState, durationMs:eyeClosureDuration, newNormalBlink, newSlowBlink, drowsyPattern: slowBlinkLog.length>=3 };
  }
  function getNormalBlinkRate(now) {
    blinkLog = blinkLog.filter(t => now-t < 60_000);
    return blinkLog.length / (60_000/60_000);
  }
  function getSlowBlinkRate(now) {
    const w = 5*60_000;
    slowBlinkLog = slowBlinkLog.filter(t => now-t < w);
    return slowBlinkLog.length / (w/60_000);
  }
  function buildEmptyFrame(ts) {
    return {
      timestamp:ts, faceDetected:false,
      gaze:{x:null,y:null,offScreen:null,vector:{yaw:null,pitch:null}},
      headPose:{yaw:null,pitch:null,roll:null,facingAway:null,lookingDown:null,lookingUp:null,lookingLeft:null,lookingRight:null},
      eyes:{leftOpenness:null,rightOpenness:null,avgOpenness:null,closureState:'OPEN',closureDurationMs:0,isBlinking:false,isDrowsy:false,isAsleep:false},
      blinks:{detected:false,slowBlinkDetected:false,normalRatePerMinute:null,slowRatePerMinute:null,drowsyPattern:false,abnormalNormal:null},
      raw:{leftIris:null,rightIris:null,noseTip:null,gazeVector:null},
    };
  }
  function r(n, d=4) { return n==null ? null : Math.round(n*10**d)/10**d; }

  // ── Pipeline (same as original) ────────────────────────────────────────────
  let prevZone2Status=null, prevBand=null, sessionScoreSum=0, sessionScoreCount=0;
  let pendingAlerts = {};

  const INTERVENTION_MAP = {
    DISTRACTED:{severity:'HIGH',delay:2_000}, ABSENT:{severity:'HIGH',delay:5_000},
    DROWSY:{severity:'MEDIUM',delay:3_000}, NOTE_TAKING_UNCONFIRMED:{severity:'LOW',delay:30_000},
  };

  function handleFrameData(frameData) {
    const activityContext = ZoneManager.process(frameData);
    const enrichedFrame   = { ...frameData, activityContext };
    const attentionResult = AttentionEngine.process(enrichedFrame);
    const machineResult   = StateMachine.process(attentionResult, frameData.timestamp);

    if (frameData.faceDetected) {
      sessionScoreSum += attentionResult.score; sessionScoreCount++;
      InterventionEngine.updateSessionAverage(sessionScoreSum / sessionScoreCount);
    }

    if (machineResult.shouldIntervene && machineResult.escalationLevel > 0) {
      const context = { ...attentionResult, state:machineResult.state, activity:activityContext.activity, faceMissingMs:machineResult.faceMissingMs, sessionStats:getSession() };
      const fired = InterventionEngine.fire(machineResult.escalationLevel, context);
      if (fired) {
        const ev = { level:machineResult.escalationLevel, levelName:['','SUBTLE','SOFT','HARD','ESCALATED'][machineResult.escalationLevel], state:machineResult.state, score:attentionResult.score, band:attentionResult.band, activity:activityContext.activity, timestamp:frameData.timestamp };
        emit('intervention', ev);
        SessionSummariser.ingestEvent(ev);
      }
    }

    if (machineResult.stateChanged && machineResult.state === 'FOCUSED') {
      InterventionEngine.notifyRecovery();
      emit('intervention', { type:'RECOVERED', score:attentionResult.score, timestamp:frameData.timestamp });
    }

    InterventionEngine.updateRecoveryProgress(machineResult.recoveryProgress);

    const fullFrame = { ...enrichedFrame, attention:attentionResult, machineState:machineResult };
    currentState = fullFrame;
    session.totalFrames++;
    if (!frameData.faceDetected) session.missingFrames++;
    else if (attentionResult.band === 'FOCUSED') session.focusedFrames++;

    emit('frame', fullFrame);
    emit('score', attentionResult);
    SessionSummariser.ingest(fullFrame);

    const newZ2 = activityContext.zone2?.status;
    if (newZ2 !== prevZone2Status) { emit('zone2', { type:'STATUS_CHANGE', previous:prevZone2Status, current:newZ2, center:activityContext.zone2?.center, timestamp:frameData.timestamp }); prevZone2Status=newZ2; }
    if (attentionResult.bandChanged && prevBand !== null) {
      if (bandRank(attentionResult.band) > bandRank(prevBand)) {
        logAndEmitAttention({ type:'BAND_CHANGE', severity:['ABSENT','DISTRACTED'].includes(attentionResult.band)?'HIGH':'MEDIUM', activity:activityContext.activity, band:attentionResult.band, prevBand, score:attentionResult.score, message:`Attention dropped to ${attentionResult.band}`, timestamp:frameData.timestamp, frameData:fullFrame });
      }
    }
    prevBand = attentionResult.band;
    checkAttentionEvents(fullFrame);
  }

  function bandRank(b) { return {FOCUSED:0,MILD:1,DISTRACTED:2,ABSENT:3}[b]??0; }

  function checkAttentionEvents(ef) {
    const { activity } = ef.activityContext;
    const rule = INTERVENTION_MAP[activity];
    if (ef.activityContext.nudge) logAndEmitAttention({ type:'ZONE2_RATIO_NUDGE', severity:'LOW', activity, message:'Too much time away from screen', timestamp:ef.timestamp, frameData:ef });
    if (!rule) { delete pendingAlerts[activity]; if (activity==='FOCUSED') pendingAlerts={}; return; }
    if (!pendingAlerts[activity]) { pendingAlerts[activity]={ startTime:ef.timestamp }; return; }
    const elapsed = ef.timestamp - pendingAlerts[activity].startTime;
    if (elapsed >= rule.delay) {
      logAndEmitAttention({ type:'ATTENTION_REQUIRED', severity:rule.severity, activity, durationMs:elapsed, message:`${activity} for ${Math.round(elapsed/1000)}s`, timestamp:ef.timestamp, frameData:ef });
      pendingAlerts[activity].startTime = ef.timestamp + 10_000;
    }
  }

  function logAndEmitAttention(event) {
    emit('attention', event);
    const last = session.events.at(-1);
    if (!last || event.timestamp-last.timestamp > 5_000) {
      const { frameData:_, ...light } = event;
      session.events.push(light);
    }
  }

  // ── Utilities ──────────────────────────────────────────────────────────────
  function emit(event, data) {
    listeners[event]?.forEach(cb => { try { cb(data); } catch(e) { console.error(`[GazeAPI] Listener error "${event}":`,e); } });
  }

  function getSession() {
    const now=Date.now(), ms=session.startTime?now-session.startTime:0;
    return { startTime:session.startTime, durationMs:ms, totalFrames:session.totalFrames, focusedFrames:session.focusedFrames, missingFrames:session.missingFrames, focusPercentage:session.totalFrames?Math.round(session.focusedFrames/session.totalFrames*100):null, events:[...session.events] };
  }

  // ── Public interface ───────────────────────────────────────────────────────
  return {
    start, stop, subscribe,
    getState:           () => currentState,
    getAttentionScore:  () => AttentionEngine.getSmoothedScore(),
    getSession,
    getZone2Status:     () => ZoneManager.getZone2Status(),
    setManualZone2:     (loc) => { ZoneManager.setManualZone2(loc); emit('zone2',{type:'MANUAL_SET',location:loc,timestamp:Date.now()}); },
    clearManualZone2:   () => { ZoneManager.setManualZone2(null); emit('zone2',{type:'MANUAL_CLEARED',timestamp:Date.now()}); },
    setWebhookUrl:      (url) => InterventionEngine.setWebhookUrl(url),
    getInterventionLog: () => InterventionEngine.getLog(),
    getMachineState:    () => StateMachine.getState(),
    finaliseSession:    () => SessionSummariser.finalise(),
    get isRunning()     { return isRunning; },
  };

})();

export default GazeAPI;
if (typeof window !== 'undefined') window.__GazeAPI = GazeAPI;