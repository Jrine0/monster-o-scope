// src/hooks/useLipSync.ts
// Lip sync state management extracted from edactly's lib/lipSync.ts
// for use in the Edactly Vite project.

import { useRef } from 'react'

export type VisemeName =
  | 'sil' | 'PP' | 'FF' | 'TH' | 'DD' | 'kk'
  | 'CH'  | 'SS' | 'nn' | 'RR' | 'aa' | 'E'
  | 'I'   | 'O'  | 'U'

export interface VisemeEvent {
  viseme:   VisemeName
  time:     number
  duration: number
}

export interface LipSyncData {
  timeline:       VisemeEvent[]
  totalDuration:  number
  startTime:      number
  isActive:       boolean
  audioElement?:  HTMLAudioElement | null
  analyser?:      AnalyserNode | null
  analyserBuffer?: Uint8Array | null
}

export function createLipSyncData(): LipSyncData {
  return { timeline: [], totalDuration: 0, startTime: 0, isActive: false, audioElement: null, analyser: null, analyserBuffer: null }
}

// ── Phoneme → viseme tables ───────────────────────────────────────────────
const DIGRAPHS: [string, VisemeName][] = [
  ['th','TH'],['sh','CH'],['ch','CH'],['ph','FF'],['wh','U'],['ck','kk'],['ng','kk'],['qu','kk'],
  ['ee','I'],['ea','I'],['ey','I'],['ie','I'],['oo','U'],['ou','aa'],['ow','aa'],
  ['ai','E'],['ay','E'],['ei','E'],['oi','O'],['oy','O'],
]
const CHAR_MAP: Record<string, VisemeName> = {
  a:'aa',e:'E',i:'I',o:'O',u:'U',p:'PP',b:'PP',m:'PP',f:'FF',v:'FF',
  t:'DD',d:'DD',k:'kk',g:'kk',c:'kk',q:'kk',x:'kk',s:'SS',z:'SS',
  n:'nn',l:'nn',r:'RR',j:'CH',y:'I',w:'U',h:'sil',
}
const VOWELS = new Set(['a','e','i','o','u'])

export function computeTimeline(text: string, rate = 1.0) {
  const timeline: VisemeEvent[] = []
  const baseDur = 0.06 / rate
  let time = 0
  const lower = text.toLowerCase()
  for (let i = 0; i < lower.length;) {
    const ch = lower[i]
    if (!/[a-z]/.test(ch)) {
      let pause = 0
      if (ch === ' ') pause = baseDur * 0.5
      else if (',;:'.includes(ch)) pause = baseDur * 4
      else if ('.!?'.includes(ch)) pause = baseDur * 6
      if (pause > 0) { const last = timeline.at(-1); if (last?.viseme === 'sil') last.duration += pause; else timeline.push({ viseme: 'sil', time, duration: pause }); time += pause }
      i++; continue
    }
    let viseme: VisemeName | undefined; let step = 1
    if (i + 1 < lower.length) { const pair = lower.slice(i, i+2); const m = DIGRAPHS.find(([d]) => d === pair); if (m) { viseme = m[1]; step = 2 } }
    if (!viseme) viseme = CHAR_MAP[ch] || 'sil'
    const dur = VOWELS.has(ch) ? baseDur * 1.3 : baseDur
    const last = timeline.at(-1)
    if (last?.viseme === viseme) last.duration += dur; else timeline.push({ viseme, time, duration: dur })
    time += dur; i += step
  }
  return { timeline, totalDuration: time }
}

export function stretchTimeline(timeline: VisemeEvent[], nominal: number, actual: number): VisemeEvent[] {
  if (nominal <= 0 || actual <= 0) return timeline
  const scale = actual / nominal
  return timeline.map(ev => ({ ...ev, time: ev.time * scale, duration: ev.duration * scale }))
}

export function getCurrentViseme(timeline: VisemeEvent[], elapsed: number): VisemeName {
  if (!timeline.length) return 'sil'
  for (const ev of timeline) { if (elapsed >= ev.time && elapsed < ev.time + ev.duration) return ev.viseme }
  return 'sil'
}

let sharedAudioCtx: AudioContext | null = null
function getAudioCtx() {
  if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') sharedAudioCtx = new AudioContext()
  return sharedAudioCtx
}
export function createAnalyserForAudio(audio: HTMLAudioElement) {
  const ctx = getAudioCtx()
  const source = ctx.createMediaElementSource(audio)
  const analyser = ctx.createAnalyser()
  analyser.fftSize = 256; analyser.smoothingTimeConstant = 0.5
  source.connect(analyser); analyser.connect(ctx.destination)
  return { analyser, buffer: new Uint8Array(analyser.frequencyBinCount) }
}
export function getAmplitude(analyser: AnalyserNode, buffer: Uint8Array): number {
  analyser.getByteTimeDomainData(buffer as unknown as Uint8Array)
  let sum = 0
  for (let i = 0; i < buffer.length; i++) { const x = buffer[i] - 128; sum += x * x }
  return Math.sqrt(sum / buffer.length)
}
export const SILENCE_THRESHOLD = 12

export const VISEME_TARGETS = [
  'viseme_sil','viseme_PP','viseme_FF','viseme_TH','viseme_DD','viseme_kk',
  'viseme_CH','viseme_SS','viseme_nn','viseme_RR','viseme_aa','viseme_E',
  'viseme_I','viseme_O','viseme_U',
] as const

export const VISEME_INTENSITY: Record<VisemeName, number> = {
  sil:0, PP:0.50,FF:0.40,TH:0.45,DD:0.45,kk:0.35,CH:0.45,SS:0.35,nn:0.35,RR:0.45,
  aa:0.75,E:0.65,I:0.55,O:0.70,U:0.55,
}
export const VISEME_JAW: Record<VisemeName, number> = {
  sil:0, PP:0.00,FF:0.03,TH:0.06,DD:0.10,kk:0.05,CH:0.08,SS:0.03,nn:0.05,RR:0.12,
  aa:0.30,E:0.18,I:0.10,O:0.25,U:0.08,
}

export function useLipSync() {
  const ref = useRef<LipSyncData>(createLipSyncData())
  return ref
}