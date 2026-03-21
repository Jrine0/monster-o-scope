// src/hooks/useGazeTrack.ts
// GazeTrack hook for Vyasa (Vite + React).
// Identical logic to the schoolme version but:
//   - no "use client" directive (not needed in Vite)
//   - studentId pulled from useAuthStore externally and passed in
//   - session POST goes to the Vyasa backend via api-client

import { useRef, useState, useCallback, useEffect } from 'react'

// ── Timing constants ──────────────────────────────────────────────────────
const SOFT_ALERT_DEBOUNCE_MS = 10_000   // 10 s → Tier 1
const AVATAR_ESCALATION_MS   = 25_000   // 25 s → Tier 2
const REENGAGE_COOLDOWN_MS   = 60_000   // 60 s between Tier-2 prompts

export type AttentionBand     = 'FOCUSED' | 'MILD' | 'DISTRACTED' | 'ABSENT'
export type EscalationTier    = 'none' | 'soft' | 'hard'
export type CameraPermission  = 'idle' | 'requesting' | 'granted' | 'previously_denied'
export type AvatarMood        = 'neutral' | 'happy' | 'serious' | 'surprise'

export interface SignalBreakdown {
  gaze:     { score: number; weight: number; contribution: number; reason: string }
  eyes:     { score: number; weight: number; contribution: number; reason: string }
  headPose: { score: number; weight: number; contribution: number; reason: string }
  activity: { score: number; weight: number; contribution: number; reason: string }
}

export interface AttentionFrame {
  score: number; rawScore: number; band: AttentionBand
  confidence: number; trend: 'RISING' | 'FALLING' | 'STABLE'
  signals: SignalBreakdown; activityState: string
  zone2Confirmed: boolean; drowsy: boolean; timestamp: number
}

export interface GazeAttentionState {
  score: number; band: AttentionBand; tier: EscalationTier; mood: AvatarMood
  frame: AttentionFrame | null; reEngageActive: boolean; hardInterventionActive: boolean
}

export interface UseGazeTrackOptions {
  studentId:           string
  sessionId?:          string
  lessonId?:           string
  webhookUrl?:         string
  onSoftAlert?:        (score: number) => void
  onHardIntervention?: (score: number) => void
  onRecovered?:        (score: number) => void
  onReEngageSpeak?:    (prompt: string) => void
  /** Vyasa API client for posting session summaries */
  apiClient?:          { post: (url: string, data: unknown) => Promise<unknown> }
}

const BAND_TO_MOOD: Record<AttentionBand, AvatarMood> = {
  FOCUSED: 'neutral', MILD: 'neutral', DISTRACTED: 'serious', ABSENT: 'surprise',
}

const RE_ENGAGE_PROMPTS = [
  "Hey, I noticed you drifted off — no worries, let's pick up where we left off.",
  "Still with me? Take a breath, then we'll carry on.",
  "I'm here whenever you're ready to continue. No rush.",
  "Looks like something pulled your attention. Come back when you can — I'll be right here.",
]

const EMPTY_SIGNALS: SignalBreakdown = {
  gaze:     { score: 100, weight: 0.40, contribution: 40, reason: '—' },
  eyes:     { score: 100, weight: 0.30, contribution: 30, reason: '—' },
  headPose: { score: 100, weight: 0.20, contribution: 20, reason: '—' },
  activity: { score: 100, weight: 0.10, contribution: 10, reason: '—' },
}

function mapFrame(raw: Record<string, unknown>): AttentionFrame {
  const att = (raw.attention as Record<string, unknown>) ?? {}
  const ctx = (raw.activityContext as Record<string, unknown>) ?? {}
  const blinks = (raw.blinks as Record<string, unknown>) ?? {}
  const eyes   = (raw.eyes   as Record<string, unknown>) ?? {}
  const zone2  = (ctx.zone2  as Record<string, unknown>) ?? {}
  return {
    score:          (att.score as number)          ?? 100,
    rawScore:       (att.raw   as number)          ?? (att.score as number) ?? 100,
    band:           (att.band  as AttentionBand)   ?? 'FOCUSED',
    confidence:     (att.confidence as number)     ?? 1,
    trend:          (att.trend as AttentionFrame['trend']) ?? 'STABLE',
    activityState:  (ctx.activity as string)       ?? 'FOCUSED',
    zone2Confirmed: (zone2.status as string)       === 'CONFIRMED',
    drowsy:         (blinks.drowsyPattern as boolean) ?? (eyes.isDrowsy as boolean) ?? false,
    timestamp:      (raw.timestamp as number)      ?? Date.now(),
    signals: {
      gaze:     (att.signals as SignalBreakdown)?.gaze     ?? EMPTY_SIGNALS.gaze,
      eyes:     (att.signals as SignalBreakdown)?.eyes     ?? EMPTY_SIGNALS.eyes,
      headPose: (att.signals as SignalBreakdown)?.headPose ?? EMPTY_SIGNALS.headPose,
      activity: (att.signals as SignalBreakdown)?.activity ?? EMPTY_SIGNALS.activity,
    },
  }
}

export function useGazeTrack(options: UseGazeTrackOptions) {
  const { studentId, sessionId, lessonId, webhookUrl, apiClient,
          onSoftAlert, onHardIntervention, onRecovered, onReEngageSpeak } = options

  const [isTracking, setIsTracking]         = useState(false)
  const [gazeReady, setGazeReady]           = useState(false)
  const [cameraPermission, setCameraPermission] = useState<CameraPermission>('idle')
  const [state, setState] = useState<GazeAttentionState>({
    score: 100, band: 'FOCUSED', tier: 'none', mood: 'neutral',
    frame: null, reEngageActive: false, hardInterventionActive: false,
  })

  const gazeAPIRef      = useRef<Record<string, unknown> | null>(null)
  const streamRef        = useRef<MediaStream | null>(null)
  const sessionIdRef    = useRef(sessionId ?? crypto.randomUUID())
  const softTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hardTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reEngageCoolRef = useRef(false)
  const lastBandRef     = useRef<AttentionBand>('FOCUSED')

  const clearTimers = useCallback(() => {
    if (softTimerRef.current) { clearTimeout(softTimerRef.current); softTimerRef.current = null }
    if (hardTimerRef.current) { clearTimeout(hardTimerRef.current); hardTimerRef.current = null }
  }, [])

  const armEscalation = useCallback((score: number) => {
    if (!softTimerRef.current) {
      softTimerRef.current = setTimeout(() => {
        setState(s => ({ ...s, tier: 'soft' }))
        onSoftAlert?.(score)
      }, SOFT_ALERT_DEBOUNCE_MS)
    }
    if (!hardTimerRef.current) {
      hardTimerRef.current = setTimeout(() => {
        if (!reEngageCoolRef.current) {
          reEngageCoolRef.current = true
          const prompt = RE_ENGAGE_PROMPTS[Math.floor(Math.random() * RE_ENGAGE_PROMPTS.length)]
          setState(s => ({ ...s, tier: 'hard', hardInterventionActive: true, reEngageActive: true, mood: BAND_TO_MOOD[lastBandRef.current] }))
          onHardIntervention?.(score)
          onReEngageSpeak?.(prompt)
          setTimeout(() => { reEngageCoolRef.current = false; setState(s => ({ ...s, reEngageActive: false })) }, REENGAGE_COOLDOWN_MS)
        }
      }, AVATAR_ESCALATION_MS)
    }
  }, [onSoftAlert, onHardIntervention, onReEngageSpeak])

  const handleRecovery = useCallback((score: number) => {
    clearTimers()
    setState(s => ({ ...s, tier: 'none', mood: 'neutral', hardInterventionActive: false, reEngageActive: false }))
    onRecovered?.(score)
  }, [clearTimers, onRecovered])

  const handleScore = useCallback(({ score, band }: { score: number; band: AttentionBand }) => {
    const prev = lastBandRef.current; lastBandRef.current = band
    const isBad  = band === 'DISTRACTED' || band === 'ABSENT'
    const wasGood = prev === 'FOCUSED' || prev === 'MILD'
    const isGood  = band === 'FOCUSED' || band === 'MILD'
    if (isGood && !wasGood) handleRecovery(score)
    else if (isBad) armEscalation(score)
    setState(s => ({ ...s, score, band, mood: isBad && s.tier === 'hard' ? BAND_TO_MOOD[band] : isGood ? 'neutral' : s.mood }))
  }, [handleRecovery, armEscalation])

  const handleFrame = useCallback((raw: Record<string, unknown>) => {
    setState(s => ({ ...s, frame: mapFrame(raw) }))
  }, [])

  // Load gaze-api.js as an ES module via inline <script type="module">
  const loadModules = useCallback(async () => {
    if (gazeAPIRef.current) return gazeAPIRef.current as { start: Function; stop: Function; subscribe: Function; finaliseSession: Function }

    await new Promise<void>((resolve, reject) => {
      if (document.querySelector('script[data-gaze-api]')) {
        if ((window as Window & { __GazeAPI?: unknown }).__GazeAPI) { resolve(); return }
        const poll = setInterval(() => {
          if ((window as Window & { __GazeAPI?: unknown }).__GazeAPI) { clearInterval(poll); resolve() }
        }, 50)
        setTimeout(() => { clearInterval(poll); reject(new Error('[GazeTrack] Timed out')) }, 10_000)
        return
      }
      const s = document.createElement('script')
      s.type = 'module'
      s.dataset.gazeApi = '1'
      // In Vite, /gaze/ maps to public/gaze/
      s.textContent = `
        import GazeAPI from '/gaze/gaze-api.js';
        window.__GazeAPI = GazeAPI;
        window.dispatchEvent(new Event('gazeapi:ready'));
      `
      s.onerror = () => reject(new Error('[GazeTrack] Failed to load /gaze/gaze-api.js'))
      document.head.appendChild(s)
      window.addEventListener('gazeapi:ready', () => resolve(), { once: true })
    })

    const api = (window as Window & { __GazeAPI?: unknown }).__GazeAPI
    if (!api) throw new Error('[GazeTrack] window.__GazeAPI not set')
    gazeAPIRef.current = api as Record<string, unknown>
    return api as { start: Function; stop: Function; subscribe: Function; finaliseSession: Function }
  }, [])

  const startTracking = useCallback(async () => {
    if (navigator.permissions) {
      try {
        const status = await navigator.permissions.query({ name: 'camera' as PermissionName })
        if (status.state === 'denied') { setCameraPermission('previously_denied'); return }
      } catch { /* not supported */ }
    }

    setCameraPermission('requesting')
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 }, audio: false })
      setCameraPermission('granted')
    } catch (err: unknown) {
      setCameraPermission('previously_denied')
      console.warn('[GazeTrack] Camera denied:', (err as Error).message)
      return
    }

    try {
      const GazeAPI = await loadModules()
      await GazeAPI.start({ studentId, sessionId: sessionIdRef.current, lessonId: lessonId ?? 'default', webhookUrl: webhookUrl ?? undefined, videoStream: streamRef.current })
      GazeAPI.subscribe('score', handleScore)
      GazeAPI.subscribe('frame', handleFrame)
      GazeAPI.subscribe('ready', () => setGazeReady(true))
      setIsTracking(true)
    } catch (err) {
      streamRef.current?.getTracks().forEach(t => t.stop())
      streamRef.current = null
      console.error('[GazeTrack] start failed:', err)
      setCameraPermission('idle')
    }
  }, [studentId, lessonId, webhookUrl, loadModules, handleScore, handleFrame])

  const stopTracking = useCallback(async () => {
    clearTimers()
    if (!gazeAPIRef.current) return
    ;(gazeAPIRef.current as { stop: Function }).stop()
    const summary = (gazeAPIRef.current as { finaliseSession: Function }).finaliseSession()
    if (summary && apiClient) {
      apiClient.post('/api/gaze/sessions', summary).catch((e: unknown) => console.warn('[GazeTrack] Session save failed:', e))
    }
    // Stop the camera stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    sessionIdRef.current = crypto.randomUUID()
    setIsTracking(false); setGazeReady(false); setCameraPermission('idle')
  }, [clearTimers, apiClient])

  const dismissHardIntervention = useCallback(() => {
    setState(s => ({ ...s, hardInterventionActive: false, tier: 'none' }))
  }, [])

  useEffect(() => () => { if (isTracking) stopTracking() }, []) // eslint-disable-line

  return { gazeState: state, isTracking, gazeReady, cameraPermission, startTracking, stopTracking, dismissHardIntervention }
}