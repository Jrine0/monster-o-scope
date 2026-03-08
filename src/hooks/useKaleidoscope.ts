import { useEffect, useRef } from "react";

const TWO_PI = Math.PI * 2;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));
const ease = (t: number) =>
  t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

function getInkRGB() {
  return document.documentElement.hasAttribute("data-theme")
    ? "30,28,24"
    : "237,233,223";
}

// const ORANGE_RGB = "242,116,13";

interface KState {
  scroll: number;
  scrollNorm: number;
  scrollVel: number;
  lastScroll: number;
  time: number;
  burst: number;
}

export function useKaleidoscope(canvasId: string) {
  const stateRef = useRef<KState>({
    scroll: 0,
    scrollNorm: 0,
    scrollVel: 0,
    lastScroll: 0,
    time: 0,
    burst: 0,
  });

  useEffect(() => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const state = stateRef.current;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    const onScroll = () => {
      state.scroll = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // ── Drawing helpers ──
    function drawSpoke(cx: number, cy: number, r: number, angle: number, strokeStyle: string, lineWidth: number) {
      ctx!.beginPath();
      ctx!.moveTo(cx, cy);
      ctx!.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
      ctx!.strokeStyle = strokeStyle;
      ctx!.lineWidth = lineWidth;
      ctx!.stroke();
    }

    function drawPolygon(cx: number, cy: number, r: number, sides: number, rotOffset: number, strokeStyle: string, lineWidth: number, dash: number[] | null) {
      if (sides < 3) return;
      ctx!.beginPath();
      for (let i = 0; i <= sides; i++) {
        const a = (i / sides) * TWO_PI + rotOffset;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        i === 0 ? ctx!.moveTo(x, y) : ctx!.lineTo(x, y);
      }
      ctx!.strokeStyle = strokeStyle;
      ctx!.lineWidth = lineWidth;
      if (dash) ctx!.setLineDash(dash);
      else ctx!.setLineDash([]);
      ctx!.stroke();
      ctx!.setLineDash([]);
    }

    function drawCircle(cx: number, cy: number, r: number, strokeStyle: string, lineWidth: number, dash: number[] | null) {
      ctx!.beginPath();
      ctx!.arc(cx, cy, r, 0, TWO_PI);
      ctx!.strokeStyle = strokeStyle;
      ctx!.lineWidth = lineWidth;
      if (dash) ctx!.setLineDash(dash);
      else ctx!.setLineDash([]);
      ctx!.stroke();
      ctx!.setLineDash([]);
    }

    function drawStar(cx: number, cy: number, outerR: number, innerR: number, points: number, rotOffset: number, strokeStyle: string, lineWidth: number) {
      ctx!.beginPath();
      for (let i = 0; i < points * 2; i++) {
        const a = (i / (points * 2)) * TWO_PI + rotOffset - Math.PI / 2;
        const r = i % 2 === 0 ? outerR : innerR;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        i === 0 ? ctx!.moveTo(x, y) : ctx!.lineTo(x, y);
      }
      ctx!.closePath();
      ctx!.strokeStyle = strokeStyle;
      ctx!.lineWidth = lineWidth;
      ctx!.stroke();
    }

    interface KParams {
      baseRadius: number;
      segments: number;
      rings: number;
      outerRot: number;
      innerRot: number;
      centerRot: number;
      opacity: number;
      burstScale: number;
      scrollNorm: number;
      polygonSides: number;
      _ink?: string;
    }

    function drawKaleidoscope(cx: number, cy: number, params: KParams) {
      const { baseRadius, segments, rings, outerRot, innerRot, centerRot, opacity, burstScale, polygonSides } = params;
      const R = baseRadius * burstScale;
      const alpha = clamp(opacity, 0, 0.55);
      const INK_RGB = params._ink || getInkRGB();

      ctx!.save();
      ctx!.translate(cx, cy);
      ctx!.rotate(outerRot);
      ctx!.translate(-cx, -cy);
      for (let i = 0; i < segments; i++) {
        const a = (i / segments) * TWO_PI;
        const lw = i % 2 === 0 ? 0.6 : 0.3;
        drawSpoke(cx, cy, R, a, `rgba(${INK_RGB},${alpha})`, lw);
      }
      for (let j = 1; j <= rings; j++) {
        const r = (R * j) / rings;
        const lw = j === rings ? 0.5 : 0.35;
        const dsh = j % 3 === 0 ? [4, 8] : null;
        drawCircle(cx, cy, r, `rgba(${INK_RGB},${alpha * 0.85})`, lw, dsh);
      }
      for (let j = 0; j < rings - 1; j++) {
        const r1 = (R * j) / rings;
        const r2 = (R * (j + 1)) / rings;
        const rm = (r1 + r2) / 2;
        const off = (j * Math.PI) / polygonSides;
        drawPolygon(cx, cy, rm, polygonSides, off, `rgba(${INK_RGB},${alpha * 0.6})`, 0.3, j % 2 ? [5, 9] : null);
      }
      ctx!.restore();

      const innerSegs = Math.round(segments * 1.5);
      const innerRings = Math.max(2, Math.round(rings * 0.6));
      const innerR = R * 0.65;
      ctx!.save();
      ctx!.translate(cx, cy);
      ctx!.rotate(innerRot);
      ctx!.translate(-cx, -cy);
      for (let i = 0; i < innerSegs; i++) {
        const a = (i / innerSegs) * TWO_PI;
        drawSpoke(cx, cy, innerR, a, `rgba(${INK_RGB},${alpha * 0.7})`, 0.35);
      }
      for (let j = 1; j <= innerRings; j++) {
        const r = (innerR * j) / innerRings;
        const dsh = j === innerRings ? [3, 6] : null;
        drawCircle(cx, cy, r, `rgba(${INK_RGB},${alpha * 0.6})`, 0.3, dsh);
      }
      drawPolygon(cx, cy, innerR * 0.85, innerSegs, innerRot * 0.5, `rgba(${INK_RGB},${alpha * 0.45})`, 0.25, null);
      ctx!.restore();

      const starR = R * 0.32;
      const starR2 = R * 0.2;
      const starR3 = R * 0.13;
      ctx!.save();
      ctx!.translate(cx, cy);
      ctx!.rotate(centerRot);
      ctx!.translate(-cx, -cy);
      drawStar(cx, cy, starR, starR * 0.38, 8, 0, `rgba(${INK_RGB},${alpha * 1.1})`, 0.7);
      drawStar(cx, cy, starR, starR * 0.38, 8, Math.PI / 8, `rgba(${INK_RGB},${alpha * 0.45})`, 0.35);
      drawStar(cx, cy, starR2, starR2 * 0.4, 8, 0, `rgba(${INK_RGB},${alpha * 0.9})`, 0.5);
      drawStar(cx, cy, starR3, starR3 * 0.4, 8, Math.PI / 8, `rgba(${INK_RGB},${alpha * 0.7})`, 0.4);
      const chLen = starR * 0.55;
      ctx!.beginPath();
      ctx!.moveTo(cx, cy - chLen);
      ctx!.lineTo(cx, cy + chLen);
      ctx!.moveTo(cx - chLen, cy);
      ctx!.lineTo(cx + chLen, cy);
      ctx!.strokeStyle = `rgba(${INK_RGB},${alpha * 0.4})`;
      ctx!.lineWidth = 0.35;
      ctx!.stroke();
      drawCircle(cx, cy, starR * 0.05, `rgba(${INK_RGB},${alpha})`, 0.6, null);
      drawCircle(cx, cy, starR * 0.12, `rgba(${INK_RGB},${alpha * 0.5})`, 0.35, null);
      ctx!.restore();

      const corners = [
        { x: cx - R * 0.75, y: cy - R * 0.75 },
        { x: cx + R * 0.75, y: cy - R * 0.75 },
        { x: cx - R * 0.75, y: cy + R * 0.75 },
        { x: cx + R * 0.75, y: cy + R * 0.75 },
      ];
      const accentSize = R * 0.08;
      corners.forEach(({ x, y }) => {
        const aAlpha = alpha * 0.6;
        ctx!.beginPath();
        ctx!.moveTo(x - accentSize, y);
        ctx!.lineTo(x + accentSize, y);
        ctx!.moveTo(x, y - accentSize);
        ctx!.lineTo(x, y + accentSize);
        ctx!.strokeStyle = `rgba(${INK_RGB},${aAlpha})`;
        ctx!.lineWidth = 0.45;
        ctx!.stroke();
        drawCircle(x, y, accentSize * 0.45, `rgba(${INK_RGB},${aAlpha * 0.8})`, 0.35, null);
        drawPolygon(x, y, accentSize * 0.7, 4, Math.PI / 4, `rgba(${INK_RGB},${aAlpha * 0.5})`, 0.3, null);
      });
    }

    function computeParams(t: number, sNorm: number, vel: number): KParams {
      const velAbs = Math.abs(vel);
      const burstRaw = clamp(velAbs / 60, 0, 1);
      state.burst = lerp(state.burst, burstRaw, 0.12);
      const segments = Math.round(lerp(8, 24, ease(sNorm)));
      const polygonSides = Math.round(lerp(5, 12, ease(sNorm)));
      const rings = Math.round(lerp(4, 8, ease(sNorm)));
      const W = canvas!.width;
      const H = canvas!.height;
      const baseR = Math.min(W, H) * lerp(0.38, 0.48, sNorm);
      const burstScale = 1 + state.burst * 0.12;
      const speedBoost = 1 + state.burst * 3.5;
      const outerRot = t * 0.008 * speedBoost + sNorm * Math.PI * 2;
      const innerRot = -(t * 0.012 * speedBoost) - sNorm * Math.PI * 1.5;
      const centerRot = t * 0.018 * speedBoost + sNorm * Math.PI * 0.8;
      const opacityCurve = 1 - Math.pow(Math.abs(sNorm - 0.5) * 2, 3) * 0.3;
      const opacity = lerp(0.28, 0.45, sNorm) * opacityCurve + state.burst * 0.1;
      return { baseRadius: baseR, segments, rings, polygonSides, outerRot, innerRot, centerRot, opacity, burstScale, scrollNorm: sNorm };
    }

    function drawSatellites(t: number, sNorm: number) {
      const W = canvas!.width;
      const H = canvas!.height;
      const midFade = clamp((sNorm - 0.25) / 0.2, 0, 1);
      if (midFade > 0) {
        const sr = Math.min(W, H) * 0.12 * midFade;
        const params: KParams = { baseRadius: sr, segments: 6, rings: 3, polygonSides: 6, outerRot: -(t * 0.01) - sNorm * 2, innerRot: t * 0.015, centerRot: -(t * 0.02), opacity: 0.08 * midFade, burstScale: 1 + state.burst * 0.08, scrollNorm: sNorm };
        params._ink = getInkRGB();
        drawKaleidoscope(W * 0.12, H * 0.5, params);
        drawKaleidoscope(W * 0.88, H * 0.5, params);
      }
      const bloomFade = clamp((sNorm - 0.65) / 0.2, 0, 1);
      if (bloomFade > 0) {
        const br = Math.min(W, H) * 0.55 * bloomFade;
        const params: KParams = { baseRadius: br, segments: 16, rings: 6, polygonSides: 10, outerRot: t * 0.005 + sNorm, innerRot: -(t * 0.007) - sNorm * 0.5, centerRot: t * 0.011, opacity: 0.06 * bloomFade, burstScale: 1, scrollNorm: sNorm };
        params._ink = getInkRGB();
        drawKaleidoscope(W * 0.5, H * 0.5, params);
      }
    }

    let rafId: number;
    let lastTime = 0;

    function render(timestamp: number) {
      const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp;
      state.time += dt;

      const totalScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
      state.scrollNorm = clamp(state.scroll / totalScroll, 0, 1);
      state.scrollVel = state.scroll - state.lastScroll;
      state.lastScroll = state.scroll;

      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      const W = canvas!.width;
      const H = canvas!.height;
      const params = computeParams(state.time, state.scrollNorm, state.scrollVel);
      params._ink = getInkRGB();
      drawKaleidoscope(W / 2, H / 2, params);
      drawSatellites(state.time, state.scrollNorm);

      rafId = requestAnimationFrame(render);
    }

    rafId = requestAnimationFrame(render);

    // Scroll progress bar
    const bar = document.getElementById("scroll-progress");
    const onScrollBar = () => {
      if (!bar) return;
      const total = document.body.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${clamp(window.scrollY / total, 0, 1)})`;
    };
    window.addEventListener("scroll", onScrollBar, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", onScrollBar);
    };
  }, [canvasId]);
}
