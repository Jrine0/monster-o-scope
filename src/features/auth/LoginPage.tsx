/**
 * LoginPage.tsx — Schoolme
 *
 * ── EXPORTS ──────────────────────────────────────────────────────────
 *   KaleidoscopeLoader   reusable app-wide loading screen
 *   LoginPage            portal-mounted route component
 *
 * ── LAYOUT ───────────────────────────────────────────────────────────
 *   Full-page centred layout (no sidebar).
 *   Live rotating kaleidoscope canvas fills the whole background.
 *   Eyebrow + Wordmark float above the form card.
 *   SVG annotations fill the four quadrants around the card.
 *   Theme toggle in top-right synced with the landing page.
 *
 * ── THEMING ──────────────────────────────────────────────────────────
 *   Reads localStorage('schoolme-theme') on mount, then watches
 *   <html data-theme="light"> mutations so it stays in sync with
 *   the landing page theme toggle without sharing state.
 */

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  GraduationCap,
  Backpack,
  ShieldCheck,
  Mail,
  Lock,
  IdCard,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
  Loader2,
  ChevronLeft,
  Sun,
  Moon,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { apiClient } from "@/lib/api-client";
import { ease } from "@/lib/animation";

/* ─────────────────────────────────────────────────────────────────────
   TYPES & CONSTANTS
───────────────────────────────────────────────────────────────────── */
type Mode = "teacher" | "student" | "admin";
type ThemeId = "dark" | "light";

const MODES: {
  key: Mode;
  label: string;
  Icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
    color?: string;
  }>;
  sub: string;
}[] = [
  {
    key: "teacher",
    label: "Teacher",
    Icon: GraduationCap,
    sub: "Manage your classroom",
  },
  {
    key: "student",
    label: "Student",
    Icon: Backpack,
    sub: "Learn at your own pace",
  },
  {
    key: "admin",
    label: "Admin",
    Icon: ShieldCheck,
    sub: "Oversee the platform",
  },
];

const DEST: Record<Mode, string> = {
  teacher: "/teacher",
  student: "/student",
  admin: "/admin",
};

const SPRING = { type: "spring" as const, stiffness: 400, damping: 32 };
const TWO_PI = Math.PI * 2;

/* ─────────────────────────────────────────────────────────────────────
   THEME TOKENS
   Two complete token sets — portal can't inherit CSS vars from landing.
───────────────────────────────────────────────────────────────────── */
type Palette = typeof DARK_PALETTE;
const DARK_PALETTE = {
  bg: "#07080d",
  bgDeep: "#0d0f17",
  bgSurface: "#12141e",
  bgElevated: "#191c28",
  border: "rgba(255,255,255,0.07)",
  borderSubtle: "rgba(255,255,255,0.03)",
  borderStrong: "rgba(255,255,255,0.12)",
  ink: "#ede9df",
  inkMid: "#8a8d9a",
  inkDim: "#4e5060",
  orange: "#f2740d",
  orangeBright: "#fb923c",
  orangeGlow: "rgba(242,116,13,0.15)",
  gridLine: "rgba(237,233,223,0.022)",
  kscopeInk: "237,233,223",
  kscopeOrg: "242,116,13",
  cardBg: "rgba(18,20,30,0.88)",
};
const LIGHT_PALETTE: Palette = {
  bg: "#f6f6f2",
  bgDeep: "#f0efe9",
  bgSurface: "#ffffff",
  bgElevated: "#f0efe9",
  border: "rgba(30,28,24,0.10)",
  borderSubtle: "rgba(30,28,24,0.05)",
  borderStrong: "rgba(30,28,24,0.18)",
  ink: "#1e1c18",
  inkMid: "#5a5750",
  inkDim: "#9a9590",
  orange: "#d4610a",
  orangeBright: "#f2740d",
  orangeGlow: "rgba(212,97,10,0.14)",
  gridLine: "rgba(30,28,24,0.04)",
  kscopeInk: "30,28,24",
  kscopeOrg: "196,87,10",
  cardBg: "rgba(255,255,255,0.92)",
};

/* ─────────────────────────────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────────────────────────────── */
function useViewport() {
  const [w, setW] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn, { passive: true });
    return () => window.removeEventListener("resize", fn);
  }, []);
  return { wide: w >= 700, narrow: w < 480 };
}

function useLockBodyScroll() {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);
}

/**
 * Reads the landing page's theme from localStorage and watches
 * MutationObserver on <html data-theme> so both stay in sync.
 * Returns [theme, toggleFn].
 */
function useThemeSync(): [ThemeId, () => void] {
  const getTheme = (): ThemeId =>
    document.documentElement.getAttribute("data-theme") === "light"
      ? "light"
      : "dark";

  const [theme, setTheme] = useState<ThemeId>(() =>
    typeof document !== "undefined" ? getTheme() : "dark",
  );

  useEffect(() => {
    // Stay in sync with landing-page mutations
    const obs = new MutationObserver(() => setTheme(getTheme()));
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => obs.disconnect();
  }, []);

  const toggle = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    if (next === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    localStorage.setItem("schoolme-theme", next);
    setTheme(next);
  }, [theme]);

  return [theme, toggle];
}

/* ═════════════════════════════════════════════════════════════════════
   KALEIDOSCOPE LOADER
   Exported — use as the standard loading screen anywhere in the app.

   import { KaleidoscopeLoader } from "@/pages/login";
   <KaleidoscopeLoader onDone={() => setReady(true)} />
   ═════════════════════════════════════════════════════════════════════ */
export interface KaleidoscopeLoaderProps {
  onDone: () => void;
  duration?: number;
  isDark?: boolean;
  overlay?: React.ReactNode;
}

export function KaleidoscopeLoader({
  onDone,
  duration = 1800,
  isDark = true,
  overlay,
}: KaleidoscopeLoaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const t0Ref = useRef(0);

  const P = isDark ? DARK_PALETTE : LIGHT_PALETTE;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const clamp = (v: number, lo: number, hi: number) =>
      Math.max(lo, Math.min(hi, v));
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    function circ(
      cx: number,
      cy: number,
      r: number,
      col: string,
      lw: number,
      dash?: number[],
    ) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, TWO_PI);
      ctx.strokeStyle = col;
      ctx.lineWidth = lw;
      ctx.setLineDash(dash ?? []);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    function poly(
      cx: number,
      cy: number,
      r: number,
      n: number,
      rot: number,
      col: string,
      lw: number,
    ) {
      if (n < 3) return;
      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        const a = (i / n) * TWO_PI + rot;
        i === 0
          ? ctx.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
          : ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      }
      ctx.strokeStyle = col;
      ctx.lineWidth = lw;
      ctx.stroke();
    }
    function spk(
      cx: number,
      cy: number,
      r: number,
      a: number,
      col: string,
      lw: number,
    ) {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      ctx.strokeStyle = col;
      ctx.lineWidth = lw;
      ctx.stroke();
    }
    function star8(
      cx: number,
      cy: number,
      rO: number,
      rI: number,
      rot: number,
      col: string,
      lw: number,
    ) {
      ctx.beginPath();
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * TWO_PI + rot - Math.PI / 2;
        const r = i % 2 === 0 ? rO : rI;
        i === 0
          ? ctx.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
          : ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.strokeStyle = col;
      ctx.lineWidth = lw;
      ctx.stroke();
    }

    function frame(ts: number) {
      if (!t0Ref.current) t0Ref.current = ts;
      const elapsed = ts - t0Ref.current;
      const progress = easeOut(clamp(elapsed / duration, 0, 1));
      const t = elapsed / 1000;

      const W = canvas.width,
        H = canvas.height;
      const cx = W / 2,
        cy = H / 2;
      const R = Math.min(W, H) * 0.42 * progress;
      const al = progress * 0.36;

      const ink = (a: number) => `rgba(${P.kscopeInk},${(a * al).toFixed(3)})`;
      const org = (a: number) => `rgba(${P.kscopeOrg},${(a * al).toFixed(3)})`;

      ctx.clearRect(0, 0, W, H);
      if (R < 2) {
        rafRef.current = requestAnimationFrame(frame);
        return;
      }

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.22);
      ctx.translate(-cx, -cy);
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * TWO_PI;
        spk(
          cx,
          cy,
          R,
          a,
          i % 4 === 0 ? org(0.9) : ink(0.65),
          i % 2 === 0 ? 0.55 : 0.28,
        );
      }
      circ(cx, cy, R, org(0.65), 0.5);
      circ(cx, cy, R * 0.7, ink(0.75), 0.32, [4, 8]);
      circ(cx, cy, R * 0.44, ink(0.65), 0.28);
      ctx.restore();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-t * 0.16);
      ctx.translate(-cx, -cy);
      poly(cx, cy, R * 0.6, 9, 0, ink(0.45), 0.22);
      poly(cx, cy, R * 0.6, 9, Math.PI / 9, ink(0.22), 0.18);
      ctx.restore();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.3);
      ctx.translate(-cx, -cy);
      star8(cx, cy, R * 0.27, R * 0.11, 0, org(1.0), 0.6);
      star8(cx, cy, R * 0.27, R * 0.11, Math.PI / 8, ink(0.32), 0.24);
      const ch = R * 0.16;
      ctx.beginPath();
      ctx.moveTo(cx, cy - ch);
      ctx.lineTo(cx, cy + ch);
      ctx.moveTo(cx - ch, cy);
      ctx.lineTo(cx + ch, cy);
      ctx.strokeStyle = ink(0.32);
      ctx.lineWidth = 0.28;
      ctx.stroke();
      circ(cx, cy, R * 0.03, org(1.1), 0.65);
      circ(cx, cy, R * 0.07, org(0.38), 0.28);
      ctx.restore();

      const acc = R * 0.065;
      [
        [cx - R * 0.7, cy - R * 0.7],
        [cx + R * 0.7, cy - R * 0.7],
        [cx - R * 0.7, cy + R * 0.7],
        [cx + R * 0.7, cy + R * 0.7],
      ].forEach(([x, y], i) => {
        ctx.beginPath();
        ctx.moveTo(x - acc, y);
        ctx.lineTo(x + acc, y);
        ctx.moveTo(x, y - acc);
        ctx.lineTo(x, y + acc);
        ctx.strokeStyle = ink(0.45);
        ctx.lineWidth = 0.35;
        ctx.stroke();
        circ(x, y, acc * 0.38, i % 2 === 0 ? org(0.65) : ink(0.55), 0.28);
      });

      if (elapsed < duration) rafRef.current = requestAnimationFrame(frame);
      else onDone();
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [onDone, duration, P]);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
      {overlay !== undefined ? (
        overlay
      ) : (
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.6rem",
            pointerEvents: "none",
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
        >
          <span
            style={{
              fontFamily: "Caveat, cursive",
              fontSize: "clamp(2rem,5vw,3.5rem)",
              color: P.ink,
              transform: "rotate(-0.5deg)",
              display: "inline-block",
              lineHeight: 1,
            }}
          >
            Schoolme
          </span>
          <span
            style={{
              fontFamily: "Courier Prime, monospace",
              fontSize: "0.58rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: P.inkDim,
            }}
          >
            loading your portal…
          </span>
        </motion.div>
      )}
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════
   LIVE KALEIDOSCOPE BACKGROUND
   Continuously animating canvas — sits behind the entire page.
   Uses theme-aware ink colours.
   ═════════════════════════════════════════════════════════════════════ */
function LiveKaleidoscope({ P }: { P: Palette }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  // Re-create the canvas loop whenever the palette changes (theme switch)
  const Pref = useRef(P);
  Pref.current = P;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    let t0 = 0;

    function circ(
      cx: number,
      cy: number,
      r: number,
      col: string,
      lw: number,
      dash?: number[],
    ) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, TWO_PI);
      ctx.strokeStyle = col;
      ctx.lineWidth = lw;
      ctx.setLineDash(dash ?? []);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    function poly(
      cx: number,
      cy: number,
      r: number,
      n: number,
      rot: number,
      col: string,
      lw: number,
    ) {
      if (n < 3) return;
      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        const a = (i / n) * TWO_PI + rot;
        i === 0
          ? ctx.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
          : ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      }
      ctx.strokeStyle = col;
      ctx.lineWidth = lw;
      ctx.stroke();
    }
    function spk(
      cx: number,
      cy: number,
      r: number,
      a: number,
      col: string,
      lw: number,
    ) {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      ctx.strokeStyle = col;
      ctx.lineWidth = lw;
      ctx.stroke();
    }
    function star8(
      cx: number,
      cy: number,
      rO: number,
      rI: number,
      rot: number,
      col: string,
      lw: number,
    ) {
      ctx.beginPath();
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * TWO_PI + rot - Math.PI / 2;
        const r = i % 2 === 0 ? rO : rI;
        i === 0
          ? ctx.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
          : ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.strokeStyle = col;
      ctx.lineWidth = lw;
      ctx.stroke();
    }

    function frame(ts: number) {
      if (!t0) t0 = ts;
      const t = (ts - t0) / 1000;
      const CP = Pref.current;
      const W = canvas.width,
        H = canvas.height;
      const cx = W / 2,
        cy = H / 2;
      const R = Math.min(W, H) * 0.42;
      const AL = 0.34; // fixed alpha for live view

      const ink = (a: number) => `rgba(${CP.kscopeInk},${(a * AL).toFixed(3)})`;
      const org = (a: number) => `rgba(${CP.kscopeOrg},${(a * AL).toFixed(3)})`;

      ctx.clearRect(0, 0, W, H);

      // Layer 1 — outer 18 spokes + 3 rings
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.2);
      ctx.translate(-cx, -cy);
      for (let i = 0; i < 18; i++) {
        const a = (i / 18) * TWO_PI;
        spk(
          cx,
          cy,
          R,
          a,
          i % 4 === 0 ? org(0.85) : ink(0.6),
          i % 2 === 0 ? 0.55 : 0.28,
        );
      }
      circ(cx, cy, R, org(0.6), 0.5);
      circ(cx, cy, R * 0.72, ink(0.7), 0.32, [4, 8]);
      circ(cx, cy, R * 0.46, ink(0.6), 0.28);
      ctx.restore();

      // Layer 2 — inner polygon
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-t * 0.14);
      ctx.translate(-cx, -cy);
      poly(cx, cy, R * 0.63, 9, 0, ink(0.42), 0.22);
      poly(cx, cy, R * 0.63, 9, Math.PI / 9, ink(0.2), 0.18);
      poly(cx, cy, R * 0.38, 12, t * 0.05, ink(0.22), 0.18);
      ctx.restore();

      // Layer 3 — center star (slowest)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.28);
      ctx.translate(-cx, -cy);
      star8(cx, cy, R * 0.28, R * 0.12, 0, org(0.95), 0.6);
      star8(cx, cy, R * 0.28, R * 0.12, Math.PI / 8, ink(0.3), 0.22);
      star8(cx, cy, R * 0.18, R * 0.08, Math.PI / 4, org(0.55), 0.4);
      const ch = R * 0.17;
      ctx.beginPath();
      ctx.moveTo(cx, cy - ch);
      ctx.lineTo(cx, cy + ch);
      ctx.moveTo(cx - ch, cy);
      ctx.lineTo(cx + ch, cy);
      ctx.strokeStyle = ink(0.3);
      ctx.lineWidth = 0.28;
      ctx.stroke();
      circ(cx, cy, R * 0.032, org(1.0), 0.65);
      circ(cx, cy, R * 0.072, org(0.35), 0.28);
      ctx.restore();

      // Layer 4 — corner accents
      const acc = R * 0.068;
      [
        [cx - R * 0.72, cy - R * 0.72],
        [cx + R * 0.72, cy - R * 0.72],
        [cx - R * 0.72, cy + R * 0.72],
        [cx + R * 0.72, cy + R * 0.72],
      ].forEach(([x, y], i) => {
        ctx.beginPath();
        ctx.moveTo(x - acc, y);
        ctx.lineTo(x + acc, y);
        ctx.moveTo(x, y - acc);
        ctx.lineTo(x, y + acc);
        ctx.strokeStyle = ink(0.42);
        ctx.lineWidth = 0.35;
        ctx.stroke();
        circ(x, y, acc * 0.4, i % 2 === 0 ? org(0.6) : ink(0.5), 0.28);
        poly(x, y, acc * 0.65, 4, Math.PI / 4 + t * 0.1, ink(0.3), 0.22);
      });

      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []); // only runs once — palette is read from Pref.current each frame

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1,
        width: "100%",
        height: "100%",
        display: "block",
        pointerEvents: "none",
      }}
    />
  );
}

/* ═════════════════════════════════════════════════════════════════════
   ANNOTATIONS
   SVG sketches scattered around the four viewport quadrants.
   Theme-aware stroke colours via props.
   ═════════════════════════════════════════════════════════════════════ */
function Annotations({ P }: { P: Palette }) {
  const ink = P.inkDim;
  const org = P.orange;

  // We place 8 annotations — 2 per quadrant — using fixed positions
  // relative to viewport corners so they never overlap the centred card.
  const items = [
    // Top-left
    {
      x: "3%",
      y: "8%",
      rot: "-2deg",
      svg: (
        <svg viewBox="0 0 90 22" width="110" height="27" fill="none">
          <path
            d="M0 11 Q11 2 22 11 Q33 20 44 11 Q55 2 66 11 Q77 20 88 11"
            stroke={org}
            strokeWidth="0.9"
          />
          <text
            x="0"
            y="20"
            fontFamily="Courier Prime,monospace"
            fontSize="6"
            fill={ink}
          >
            y = sin(x)
          </text>
        </svg>
      ),
    },
    {
      x: "2%",
      y: "22%",
      rot: "1.5deg",
      svg: (
        <svg viewBox="0 0 80 70" width="80" height="70" fill="none">
          <path d="M10 60 L10 10 L65 60 Z" stroke={ink} strokeWidth="0.7" />
          <path
            d="M10 40 L18 40 L18 48 L10 48"
            stroke={ink}
            strokeWidth="0.5"
          />
          <text
            x="2"
            y="38"
            fontFamily="Courier Prime,monospace"
            fontSize="6"
            fill={ink}
          >
            a
          </text>
          <text
            x="34"
            y="66"
            fontFamily="Courier Prime,monospace"
            fontSize="6"
            fill={ink}
          >
            b
          </text>
          <text
            x="38"
            y="30"
            fontFamily="Courier Prime,monospace"
            fontSize="6"
            fill={org}
          >
            c
          </text>
          <text
            x="2"
            y="66"
            fontFamily="Courier Prime,monospace"
            fontSize="5"
            fill={ink}
          >
            a²+b²=c²
          </text>
        </svg>
      ),
    },
    // Top-right
    {
      x: "76%",
      y: "6%",
      rot: "2deg",
      svg: (
        <svg viewBox="0 0 80 72" width="80" height="72" fill="none">
          <line x1="4" y1="64" x2="76" y2="64" stroke={ink} strokeWidth="0.6" />
          <line x1="40" y1="4" x2="40" y2="66" stroke={ink} strokeWidth="0.6" />
          <path d="M8 64 Q40 8 72 64" stroke={org} strokeWidth="1.1" />
          <text
            x="44"
            y="18"
            fontFamily="Courier Prime,monospace"
            fontSize="6"
            fill={ink}
          >
            y = x²
          </text>
        </svg>
      ),
    },
    {
      x: "78%",
      y: "22%",
      rot: "-1.5deg",
      svg: (
        <svg viewBox="0 0 100 56" width="110" height="62" fill="none">
          <text
            x="4"
            y="14"
            fontFamily="Courier Prime,monospace"
            fontSize="9"
            fill={org}
            fontWeight="bold"
          >
            V = IR
          </text>
          <line x1="4" y1="22" x2="16" y2="22" stroke={ink} strokeWidth="0.7" />
          <rect
            x="16"
            y="17"
            width="16"
            height="10"
            stroke={ink}
            strokeWidth="0.7"
          />
          <line
            x1="32"
            y1="22"
            x2="60"
            y2="22"
            stroke={ink}
            strokeWidth="0.7"
          />
          <line
            x1="60"
            y1="22"
            x2="60"
            y2="38"
            stroke={ink}
            strokeWidth="0.7"
          />
          <line x1="4" y1="22" x2="4" y2="38" stroke={ink} strokeWidth="0.7" />
          <line x1="4" y1="38" x2="60" y2="38" stroke={ink} strokeWidth="0.7" />
          <text
            x="20"
            y="50"
            fontFamily="Courier Prime,monospace"
            fontSize="5.5"
            fill={ink}
          >
            resistor
          </text>
        </svg>
      ),
    },
    // Bottom-left
    {
      x: "2%",
      y: "68%",
      rot: "-1deg",
      svg: (
        <svg viewBox="0 0 110 70" width="110" height="70" fill="none">
          <ellipse
            cx="55"
            cy="35"
            rx="48"
            ry="18"
            stroke={ink}
            strokeWidth="0.7"
          />
          <ellipse
            cx="55"
            cy="35"
            rx="48"
            ry="18"
            stroke={ink}
            strokeWidth="0.7"
            transform="rotate(60 55 35)"
          />
          <ellipse
            cx="55"
            cy="35"
            rx="48"
            ry="18"
            stroke={ink}
            strokeWidth="0.7"
            transform="rotate(120 55 35)"
          />
          <circle
            cx="55"
            cy="35"
            r="5"
            stroke={org}
            strokeWidth="0.8"
            fill={org}
            fillOpacity="0.12"
          />
          <circle cx="103" cy="35" r="2.5" fill={ink} fillOpacity="0.5" />
          <text
            x="2"
            y="65"
            fontFamily="Courier Prime,monospace"
            fontSize="5.5"
            fill={ink}
          >
            atomic model
          </text>
        </svg>
      ),
    },
    {
      x: "3%",
      y: "82%",
      rot: "2deg",
      svg: (
        <svg viewBox="0 0 120 44" width="120" height="44" fill="none">
          <text
            x="4"
            y="16"
            fontFamily="Courier Prime,monospace"
            fontSize="11"
            fill={org}
            fontWeight="bold"
          >
            F = ma
          </text>
          <rect
            x="70"
            y="20"
            width="24"
            height="16"
            stroke={ink}
            strokeWidth="0.8"
          />
          <line
            x1="46"
            y1="28"
            x2="70"
            y2="28"
            stroke={ink}
            strokeWidth="0.9"
          />
          <path d="M66 24 L72 28 L66 32" stroke={ink} strokeWidth="0.7" />
          <text
            x="4"
            y="40"
            fontFamily="Courier Prime,monospace"
            fontSize="5.5"
            fill={ink}
          >
            Newton's 2nd
          </text>
        </svg>
      ),
    },
    // Bottom-right
    {
      x: "74%",
      y: "70%",
      rot: "1.5deg",
      svg: (
        <svg viewBox="0 0 130 52" width="130" height="52" fill="none">
          <path
            d="M6 36 Q22 6 38 36 Q54 66 70 36 Q86 6 102 36 Q118 66 124 42"
            stroke={org}
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <line
            x1="6"
            y1="36"
            x2="124"
            y2="36"
            stroke={ink}
            strokeWidth="0.45"
            strokeDasharray="3 4"
          />
          <text
            x="4"
            y="50"
            fontFamily="Courier Prime,monospace"
            fontSize="5.5"
            fill={ink}
          >
            wavelength λ, amplitude A
          </text>
        </svg>
      ),
    },
    {
      x: "76%",
      y: "84%",
      rot: "-2deg",
      svg: (
        <svg viewBox="0 0 90 68" width="90" height="68" fill="none">
          <circle
            cx="45"
            cy="34"
            r="30"
            stroke={ink}
            strokeWidth="0.65"
            fill={ink}
            fillOpacity="0.02"
          />
          <circle cx="45" cy="34" r="20" stroke={ink} strokeWidth="0.55" />
          <circle
            cx="45"
            cy="34"
            r="10"
            stroke={org}
            strokeWidth="0.8"
            fill={org}
            fillOpacity="0.08"
          />
          <text
            x="8"
            y="24"
            fontFamily="Courier Prime,monospace"
            fontSize="5.5"
            fill={ink}
          >
            mantle
          </text>
          <text
            x="32"
            y="37"
            fontFamily="Courier Prime,monospace"
            fontSize="5.5"
            fill={org}
          >
            core
          </text>
          <text
            x="2"
            y="64"
            fontFamily="Courier Prime,monospace"
            fontSize="5.5"
            fill={ink}
          >
            earth layers
          </text>
        </svg>
      ),
    },
  ];

  return (
    <>
      {items.map((item, i) => (
        <div
          key={i}
          aria-hidden="true"
          style={{
            position: "fixed",
            left: item.x,
            top: item.y,
            transform: `rotate(${item.rot})`,
            opacity: 0.38,
            pointerEvents: "none",
            zIndex: 3,
            userSelect: "none",
            transition: "opacity 0.4s ease",
          }}
        >
          {item.svg}
        </div>
      ))}
    </>
  );
}

/* ═════════════════════════════════════════════════════════════════════
   LOGIN PAGE
   ═════════════════════════════════════════════════════════════════════ */
export function LoginPage() {
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const setSession = useAuthStore((s) => s.setSession);
  const { wide: _wide, narrow } = useViewport();
  useLockBodyScroll();

  const [theme, toggleTheme] = useThemeSync();
  const isDark = theme === "dark";
  const P = isDark ? DARK_PALETTE : LIGHT_PALETTE;

  // Loader
  const [loaderDone, setLoaderDone] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const onLoaderDone = useCallback(() => setLoaderDone(true), []);
  useEffect(() => {
    if (!loaderDone) return;
    const t = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(t);
  }, [loaderDone]);

  // Form
  const [mode, setMode] = useState<Mode>("teacher");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [stuId, setStuId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const active = MODES.find((m) => m.key === mode)!;
  const modeIdx = MODES.findIndex((m) => m.key === mode);
  const prevIdxRef = useRef(modeIdx);
  // Slide direction: moving to a higher-index tab slides left (positive x), lower slides right
  const slideDir = useRef(0);

  function switchMode(m: Mode) {
    const nextIdx = MODES.findIndex((x) => x.key === m);
    slideDir.current = nextIdx > modeIdx ? 1 : -1;
    prevIdxRef.current = modeIdx;
    setMode(m);
    setError(null);
    setShowPass(false);
  }

  function getValues() {
    const idEl =
      formRef.current?.querySelector<HTMLInputElement>("[data-field='id']");
    const pwEl =
      formRef.current?.querySelector<HTMLInputElement>("[data-field='pw']");
    return {
      id: idEl?.value.trim() ?? (mode === "student" ? stuId : email),
      pw: pwEl?.value ?? password,
    };
  }
  function validate(id: string, pw: string) {
    if (mode === "student") {
      if (!id) return "Student ID is required";
    } else {
      if (!id) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(id)) return "Enter a valid email";
    }
    if (!pw) return "Password is required";
    if (pw.length < 6) return "Minimum 6 characters";
    return null;
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { id, pw } = getValues();
    const ve = validate(id, pw);
    if (ve) {
      setError(ve);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const payload =
        mode === "student"
          ? { student_id: id, password: pw }
          : { email: id, password: pw };
      const { data } = await apiClient.post("/auth/login", payload);
      setSession(data.access_token, data.user);
      navigate({ to: DEST[mode] });
    } catch (err: any) {
      setError(
        err.apiError?.message ??
          err.response?.data?.detail ??
          "Invalid credentials. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  /* ── Portal content ───────────────────────────────────────────────── */
  const content = (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: P.bg,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        overflowX: "hidden",
        fontFamily: "Lora, Georgia, serif",
        transition: "background 0.35s ease",
      }}
    >
      {/* Grid paper texture */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          backgroundImage: [
            `linear-gradient(${P.gridLine} 1px, transparent 1px)`,
            `linear-gradient(90deg, ${P.gridLine} 1px, transparent 1px)`,
          ].join(","),
          backgroundSize: "40px 40px",
        }}
      />

      {/* ── LOADER ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {!loaderDone && (
          <motion.div
            key="loader"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 10,
              background: P.bg,
            }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <KaleidoscopeLoader
              onDone={onLoaderDone}
              duration={1800}
              isDark={isDark}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT ────────────────────────────────────────────── */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            key="main"
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              position: "relative",
              zIndex: 5,
              minHeight: "100vh",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* Live rotating kaleidoscope canvas behind everything */}
            <LiveKaleidoscope P={P} />

            {/* Scattered annotations */}
            <Annotations P={P} />

            {/* ── TOP BAR ─────────────────────────────────────────── */}
            <header
              style={{
                position: "relative",
                zIndex: 10,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: narrow ? "0.75rem 1rem" : "0.85rem 2rem",
                borderBottom: `1px solid ${P.borderSubtle}`,
                background: isDark
                  ? "rgba(7,8,13,0.6)"
                  : "rgba(246,246,242,0.7)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
            >
              {/* Logo */}
              <span
                style={{
                  fontFamily: "Caveat,cursive",
                  fontSize: "1.4rem",
                  color: P.ink,
                  transform: "rotate(-0.5deg)",
                  display: "inline-block",
                  opacity: 0.7,
                }}
              >
                Schoolme
              </span>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                {/* Theme toggle */}
                <button
                  onClick={toggleTheme}
                  aria-label={
                    isDark ? "Switch to light mode" : "Switch to dark mode"
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 32,
                    height: 32,
                    background: "transparent",
                    border: `1.5px solid ${P.borderStrong}`,
                    borderRadius: "4px",
                    cursor: "pointer",
                    color: P.inkMid,
                    clipPath:
                      "polygon(0.5% 4%,2% 0.5%,98% 1.5%,99.5% 0%,100% 96%,98.5% 99.5%,2% 98.5%,0% 100%)",
                    transition: "color 0.2s, border-color 0.2s",
                  }}
                >
                  {isDark ? (
                    <Sun size={15} strokeWidth={1.4} />
                  ) : (
                    <Moon size={15} strokeWidth={1.4} />
                  )}
                </button>

                {/* Back link */}
                <Link
                  to="/"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    fontFamily: "Courier Prime,monospace",
                    fontSize: "0.66rem",
                    letterSpacing: "0.12em",
                    color: P.inkDim,
                    textDecoration: "none",
                  }}
                >
                  <ChevronLeft size={13} strokeWidth={1.5} />
                  Back to home
                </Link>
              </div>
            </header>

            {/* ── CENTRED CONTENT ─────────────────────────────────── */}
            <div
              style={{
                position: "relative",
                zIndex: 10,
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: narrow ? "1.5rem 1rem 2rem" : "2rem 1.5rem",
                gap: "1rem",
              }}
            >
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <div
                  style={{
                    height: 1,
                    width: "2rem",
                    background: P.orange,
                    opacity: 0.55,
                  }}
                />
                <span
                  style={{
                    fontFamily: "Courier Prime,monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: P.orange,
                    opacity: 0.85,
                  }}
                >
                  learning, for every kid
                </span>
                <div
                  style={{
                    height: 1,
                    width: "2rem",
                    background: P.orange,
                    opacity: 0.55,
                  }}
                />
              </motion.div>

              {/* Wordmark */}
              <motion.h1
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.55 }}
                style={{
                  fontFamily: "Caveat,cursive",
                  fontSize: "clamp(2.6rem,5vw,4.2rem)",
                  fontWeight: 400,
                  lineHeight: 1,
                  margin: 0,
                  color: P.ink,
                  transform: "rotate(-0.4deg)",
                  display: "inline-block",
                }}
              >
                Schoolme
              </motion.h1>

              {/* ── FORM CARD ─────────────────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.4, ease: ease.gentle }}
                style={{
                  width: "100%",
                  maxWidth: narrow ? "100%" : 440,
                  background: P.cardBg,
                  border: `1px solid ${P.border}`,
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  padding: narrow ? "1.25rem" : "2rem 2rem 1.75rem",
                  clipPath:
                    "polygon(0.3% 1%,1.5% 0%,99% 0.5%,100% 2%,99.7% 99%,98% 100%,0.5% 99.5%,0% 98%)",
                  boxShadow: isDark
                    ? "0 24px 64px rgba(0,0,0,0.45)"
                    : "0 12px 40px rgba(30,28,24,0.1)",
                }}
              >
                {/* Card header — slides with role change */}
                <div style={{ overflow: "hidden", marginBottom: "0.8rem" }}>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={mode}
                      initial={{ x: slideDir.current * 40, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: slideDir.current * -40, opacity: 0 }}
                      transition={{
                        duration: 0.22,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.85rem",
                      }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: isDark
                            ? "rgba(242,116,13,0.1)"
                            : "rgba(212,97,10,0.08)",
                          border: `1px solid ${isDark ? "rgba(242,116,13,0.22)" : "rgba(212,97,10,0.2)"}`,
                          clipPath: "polygon(1% 0%,100% 1%,99% 100%,0% 99%)",
                        }}
                      >
                        <active.Icon
                          size={17}
                          strokeWidth={1.5}
                          color={P.orange}
                        />
                      </div>
                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "baseline",
                            gap: "0.4rem",
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "Caveat,cursive",
                              fontSize: "1.5rem",
                              fontWeight: 700,
                              color: P.ink,
                              lineHeight: 1,
                            }}
                          >
                            {active.label}
                          </span>
                          <span
                            style={{
                              fontFamily: "Courier Prime,monospace",
                              fontSize: "0.55rem",
                              letterSpacing: "0.18em",
                              textTransform: "uppercase",
                              color: P.inkDim,
                            }}
                          >
                            portal
                          </span>
                        </div>
                        <div
                          style={{
                            fontFamily: "Lora,Georgia,serif",
                            fontStyle: "italic",
                            fontSize: "0.74rem",
                            color: P.inkMid,
                            marginTop: 3,
                          }}
                        >
                          {active.sub}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Orange rule */}
                <div
                  style={{
                    height: 1,
                    background: `linear-gradient(90deg,${P.orange},transparent)`,
                    opacity: 0.22,
                    marginBottom: "1rem",
                  }}
                />

                {/* Role tabs */}
                <div
                  style={{
                    display: "flex",
                    gap: "0.3rem",
                    marginBottom: "1rem",
                  }}
                  role="tablist"
                  aria-label="Select role"
                >
                  {MODES.map((m) => {
                    const on = mode === m.key;
                    return (
                      <button
                        key={m.key}
                        type="button"
                        role="tab"
                        aria-selected={on}
                        onClick={() => switchMode(m.key)}
                        style={{
                          flex: 1,
                          position: "relative",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.3rem",
                          padding: "0.42rem 0",
                          fontFamily: "Courier Prime,monospace",
                          fontSize: narrow ? "0.58rem" : "0.63rem",
                          letterSpacing: "0.07em",
                          textTransform: "uppercase",
                          background: "transparent",
                          border: `1px solid ${on ? (isDark ? "rgba(242,116,13,0.3)" : "rgba(212,97,10,0.28)") : P.borderSubtle}`,
                          color: on ? P.orange : P.inkDim,
                          cursor: "pointer",
                          clipPath: "polygon(1% 0%,100% 1%,99% 100%,0% 99%)",
                          transition: "color 0.18s, border-color 0.18s",
                          overflow: "hidden",
                        }}
                      >
                        {on && (
                          <motion.div
                            layoutId="pill-bg"
                            transition={SPRING}
                            style={{
                              position: "absolute",
                              inset: 0,
                              background: isDark
                                ? "rgba(242,116,13,0.08)"
                                : "rgba(212,97,10,0.07)",
                              clipPath:
                                "polygon(1% 0%,100% 1%,99% 100%,0% 99%)",
                              pointerEvents: "none",
                            }}
                          />
                        )}
                        <m.Icon
                          size={11}
                          strokeWidth={1.5}
                          style={{ position: "relative", zIndex: 1 }}
                        />
                        <span style={{ position: "relative", zIndex: 1 }}>
                          {m.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.18 }}
                      style={{ overflow: "hidden", marginBottom: "0.85rem" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "0.5rem",
                          padding: "0.6rem 0.8rem",
                          background: "rgba(248,113,113,0.08)",
                          border: "1px solid rgba(248,113,113,0.22)",
                        }}
                      >
                        <svg
                          viewBox="0 0 16 16"
                          width="14"
                          fill="none"
                          style={{ flexShrink: 0, marginTop: 1 }}
                        >
                          <circle
                            cx="8"
                            cy="8"
                            r="7"
                            stroke="#f87171"
                            strokeWidth="1.2"
                          />
                          <path
                            d="M8 5v3.5M8 11h.01"
                            stroke="#f87171"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                          />
                        </svg>
                        <span
                          style={{
                            fontSize: "0.79rem",
                            color: "#f87171",
                            lineHeight: 1.5,
                          }}
                        >
                          {error}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form */}
                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  noValidate
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.82rem",
                  }}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={mode}
                      initial={{ x: slideDir.current * 48, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: slideDir.current * -48, opacity: 0 }}
                      transition={{
                        duration: 0.22,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.82rem",
                      }}
                    >
                      {mode === "student" ? (
                        <Field
                          P={P}
                          label="Student ID"
                          Icon={IdCard}
                          type="text"
                          fieldKey="id"
                          value={stuId}
                          onChange={setStuId}
                          placeholder="e.g. STU-2024-001"
                          disabled={loading}
                          hasError={!!error && !stuId.trim()}
                        />
                      ) : (
                        <Field
                          P={P}
                          label="Email address"
                          Icon={Mail}
                          type="email"
                          fieldKey="id"
                          value={email}
                          onChange={setEmail}
                          placeholder="you@school.edu"
                          disabled={loading}
                          hasError={!!error && !email.trim()}
                        />
                      )}
                      <Field
                        P={P}
                        label="Password"
                        Icon={Lock}
                        type={showPass ? "text" : "password"}
                        fieldKey="pw"
                        value={password}
                        onChange={setPassword}
                        placeholder="••••••••"
                        disabled={loading}
                        hasError={!!error && !password}
                        suffix={
                          <button
                            type="button"
                            tabIndex={-1}
                            aria-label={showPass ? "Hide" : "Show"}
                            onClick={() => setShowPass((p) => !p)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: 0,
                              display: "flex",
                              alignItems: "center",
                              color: P.inkDim,
                            }}
                          >
                            {showPass ? (
                              <EyeOff size={14} strokeWidth={1.5} />
                            ) : (
                              <Eye size={14} strokeWidth={1.5} />
                            )}
                          </button>
                        }
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Remember / Forgot */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "0.4rem",
                    }}
                  >
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        cursor: "pointer",
                      }}
                    >
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={remember}
                        onClick={() => setRemember((p) => !p)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 15,
                          height: 15,
                          flexShrink: 0,
                          border: `1px solid ${remember ? P.orange : P.border}`,
                          background: remember ? P.orange : "transparent",
                          cursor: "pointer",
                          color: isDark ? "#07080d" : "white",
                          clipPath: "polygon(1% 0%,100% 1%,99% 100%,0% 99%)",
                          transition: "all 0.15s",
                        }}
                      >
                        {remember && <Check size={9} strokeWidth={3} />}
                      </button>
                      <span style={{ fontSize: "0.77rem", color: P.inkMid }}>
                        Remember me
                      </span>
                    </label>
                    <AnimatePresence>
                      {mode !== "student" && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                        >
                          <Link
                            to="/forgot-password"
                            style={{
                              fontFamily: "Courier Prime,monospace",
                              fontSize: "0.68rem",
                              letterSpacing: "0.08em",
                              color: P.orange,
                              textDecoration: "none",
                              opacity: 0.85,
                            }}
                          >
                            Forgot password?
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.45rem",
                      width: "100%",
                      padding: "0.88rem",
                      fontFamily: "Caveat,cursive",
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      letterSpacing: "0.02em",
                      background: P.orange,
                      color: isDark ? "#07080d" : "#ffffff",
                      border: "none",
                      cursor: loading ? "not-allowed" : "pointer",
                      transform: "rotate(-0.25deg)",
                      clipPath:
                        "polygon(0.3% 6%,1% 0%,99.5% 1%,100% 5%,99.6% 95%,99% 100%,0.5% 99%,0% 94%)",
                      transition: "background 0.2s",
                      opacity: loading ? 0.72 : 1,
                      marginTop: "0.1rem",
                    }}
                    whileHover={
                      loading
                        ? {}
                        : { scale: 1.01, boxShadow: `0 0 32px ${P.orangeGlow}` }
                    }
                    whileTap={loading ? {} : { scale: 0.99 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    {loading ? (
                      <>
                        <Loader2
                          size={14}
                          style={{ animation: "__kspin 1s linear infinite" }}
                        />
                        &nbsp;Signing in…
                      </>
                    ) : (
                      <>
                        Sign in to {active.label} portal
                        <motion.span
                          animate={{ x: [0, 3, 0] }}
                          transition={{
                            duration: 1.6,
                            repeat: Infinity,
                            delay: 2,
                            ease: "easeInOut",
                          }}
                        >
                          <ArrowRight size={13} strokeWidth={2.5} />
                        </motion.span>
                      </>
                    )}
                  </motion.button>
                </form>

                <p
                  style={{
                    marginTop: "1.25rem",
                    textAlign: "center",
                    fontFamily: "Lora,Georgia,serif",
                    fontStyle: "italic",
                    fontSize: "0.75rem",
                    color: P.inkMid,
                  }}
                >
                  No account?{" "}
                  <strong
                    style={{
                      color: P.ink,
                      fontWeight: 600,
                      fontStyle: "normal",
                    }}
                  >
                    Contact your school admin
                  </strong>
                </p>
              </motion.div>

              {/* Page footnote */}
              <p
                style={{
                  fontFamily: "Courier Prime,monospace",
                  fontSize: "0.56rem",
                  letterSpacing: "0.15em",
                  color: P.inkDim,
                  textAlign: "center",
                }}
              >
                ◦ &nbsp;schoolme.in &nbsp;·&nbsp; secure login
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes __kspin { to { transform:rotate(360deg); } }`}</style>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(content, document.body)
    : null;
}

/* ═════════════════════════════════════════════════════════════════════
   FIELD — theme-aware input component
   ═════════════════════════════════════════════════════════════════════ */
interface FieldProps {
  P: Palette;
  label: string;
  Icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
    color?: string;
  }>;
  type: string;
  fieldKey: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  hasError?: boolean;
  suffix?: React.ReactNode;
}
function Field({
  P,
  label,
  Icon,
  type,
  fieldKey,
  value,
  onChange,
  placeholder,
  disabled,
  hasError,
  suffix,
}: FieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label
        style={{
          display: "block",
          fontFamily: "Courier Prime,monospace",
          fontSize: "0.61rem",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: P.inkDim,
          marginBottom: "0.35rem",
        }}
      >
        {label}
      </label>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0 0.85rem",
          height: 44,
          background: P.bgElevated,
          border: `1px solid ${hasError ? "rgba(248,113,113,0.4)" : focused ? `rgba(${P.kscopeOrg},0.45)` : P.border}`,
          boxShadow: focused
            ? hasError
              ? "0 0 14px rgba(248,113,113,0.08)"
              : `0 0 18px ${P.orangeGlow}`
            : "none",
          clipPath:
            "polygon(0.3% 6%,1% 0%,99.5% 1%,100% 5%,99.6% 95%,99% 100%,0.5% 99%,0% 94%)",
          transition: "border-color 0.18s, box-shadow 0.18s",
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <Icon size={14} strokeWidth={1.5} color={P.inkDim} />
        <input
          data-field={fieldKey}
          type={type}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1,
            height: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            fontFamily: "Lora,Georgia,serif",
            fontSize: "0.88rem",
            color: P.ink,
            caretColor: P.orange,
            minWidth: 0,
          }}
          autoComplete={
            type === "email"
              ? "email"
              : type === "password"
                ? "current-password"
                : "off"
          }
        />
        {suffix && (
          <span
            style={{ display: "flex", alignItems: "center", flexShrink: 0 }}
          >
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
