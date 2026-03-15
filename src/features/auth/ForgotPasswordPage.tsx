/**
 * ForgotPasswordPage.tsx — Schoolme
 *
 * Fully theme-aware — reads the same localStorage / data-theme attribute
 * as the landing page and LoginPage. Portal-mounted to escape any layout
 * container constraints.
 *
 * Two states:
 *   default   — email input + "Send Reset Link" button
 *   submitted — success confirmation with back-to-login link
 */

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "@tanstack/react-router";
import {
  Mail,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ChevronLeft,
  Sun,
  Moon,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";

/* ─────────────────────────────────────────────────────────────────────
   THEME — identical token sets to LoginPage
   (copy-paste intentional: this file must be self-contained in a portal)
───────────────────────────────────────────────────────────────────── */
type ThemeId = "dark" | "light";
type Palette = typeof DARK;

const DARK = {
  bg: "#07080d",
  bgSurface: "#12141e",
  bgElevated: "#191c28",
  border: "rgba(255,255,255,0.07)",
  borderSubtle: "rgba(255,255,255,0.03)",
  borderStrong: "rgba(255,255,255,0.12)",
  ink: "#ede9df",
  inkMid: "#8a8d9a",
  inkDim: "#4e5060",
  orange: "#f2740d",
  orangeGlow: "rgba(242,116,13,0.15)",
  orangeGlowSm: "rgba(242,116,13,0.10)",
  gridLine: "rgba(237,233,223,0.022)",
  cardBg: "rgba(18,20,30,0.92)",
  kscopeInk: "237,233,223",
  kscopeOrg: "242,116,13",
};
const LIGHT: Palette = {
  bg: "#f6f6f2",
  bgSurface: "#ffffff",
  bgElevated: "#f0efe9",
  border: "rgba(30,28,24,0.10)",
  borderSubtle: "rgba(30,28,24,0.05)",
  borderStrong: "rgba(30,28,24,0.18)",
  ink: "#1e1c18",
  inkMid: "#5a5750",
  inkDim: "#9a9590",
  orange: "#d4610a",
  orangeGlow: "rgba(212,97,10,0.14)",
  orangeGlowSm: "rgba(212,97,10,0.08)",
  gridLine: "rgba(30,28,24,0.04)",
  cardBg: "rgba(255,255,255,0.95)",
  kscopeInk: "30,28,24",
  kscopeOrg: "196,87,10",
};

/* ─────────────────────────────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────────────────────────────── */
function useLockBodyScroll() {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);
}

function useThemeSync(): [ThemeId, () => void] {
  const getTheme = (): ThemeId =>
    document.documentElement.getAttribute("data-theme") === "light"
      ? "light"
      : "dark";

  const [theme, setTheme] = useState<ThemeId>(() =>
    typeof document !== "undefined" ? getTheme() : "dark",
  );

  useEffect(() => {
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

/* ─────────────────────────────────────────────────────────────────────
   BACKGROUND — subtle static kaleidoscope SVG (no canvas needed here,
   page is simple enough that a static decoration is more appropriate)
───────────────────────────────────────────────────────────────────── */
function BackgroundDecor({ P }: { P: Palette }) {
  const cx = 200,
    cy = 200,
    R = 172,
    TWO_PI = Math.PI * 2;

  const spokes = Array.from({ length: 14 }, (_, i) => ({
    x2: +(cx + Math.cos((i / 14) * TWO_PI) * R).toFixed(1),
    y2: +(cy + Math.sin((i / 14) * TWO_PI) * R).toFixed(1),
    thick: i % 2 === 0,
  }));

  const polyPts = (r: number, n: number, rot = 0) =>
    Array.from({ length: n }, (_, i) => {
      const a = (i / n) * TWO_PI + rot;
      return `${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`;
    }).join(" ");

  const starPts = (rO: number, rI: number, rot = 0) =>
    Array.from({ length: 16 }, (_, i) => {
      const a = (i / 16) * TWO_PI + rot - Math.PI / 2;
      const r = i % 2 === 0 ? rO : rI;
      return `${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`;
    }).join(" ");

  const ink = P.kscopeInk;
  const org = P.kscopeOrg;

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <svg
        viewBox="0 0 400 400"
        width="min(82vw,82vh)"
        height="min(82vw,82vh)"
        fill="none"
        style={{ opacity: 0.32 }}
      >
        {spokes.map((s, i) => (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={s.x2}
            y2={s.y2}
            stroke={`rgb(${ink})`}
            strokeWidth={s.thick ? 0.55 : 0.28}
            strokeOpacity="0.5"
          />
        ))}
        {[R, R * 0.73, R * 0.48, R * 0.28].map((r, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            stroke={i === 0 ? `rgb(${org})` : `rgb(${ink})`}
            strokeWidth={i === 0 ? 0.6 : 0.32}
            strokeOpacity={i === 0 ? 0.7 : 0.45}
            strokeDasharray={i === 2 ? "4 8" : undefined}
          />
        ))}
        <polygon
          points={polyPts(R * 0.6, 9, -0.6)}
          stroke={`rgb(${ink})`}
          strokeWidth="0.24"
          strokeOpacity="0.35"
        />
        <polygon
          points={starPts(R * 0.26, R * 0.11, 0)}
          stroke={`rgb(${org})`}
          strokeWidth="0.65"
          strokeOpacity="0.6"
        />
        <polygon
          points={starPts(R * 0.26, R * 0.11, Math.PI / 8)}
          stroke={`rgb(${ink})`}
          strokeWidth="0.26"
          strokeOpacity="0.3"
        />
        <line
          x1={cx}
          y1={cy - R * 0.26}
          x2={cx}
          y2={cy + R * 0.26}
          stroke={`rgb(${ink})`}
          strokeWidth="0.28"
          strokeOpacity="0.35"
        />
        <line
          x1={cx - R * 0.26}
          y1={cy}
          x2={cx + R * 0.26}
          y2={cy}
          stroke={`rgb(${ink})`}
          strokeWidth="0.28"
          strokeOpacity="0.35"
        />
        <circle
          cx={cx}
          cy={cy}
          r={R * 0.04}
          stroke={`rgb(${org})`}
          strokeWidth="0.8"
          strokeOpacity="0.7"
        />
        <circle
          cx={cx}
          cy={cy}
          r={R * 0.09}
          stroke={`rgb(${org})`}
          strokeWidth="0.36"
          strokeOpacity="0.4"
        />
        {[
          [cx - R * 0.7, cy - R * 0.7],
          [cx + R * 0.7, cy - R * 0.7],
          [cx - R * 0.7, cy + R * 0.7],
          [cx + R * 0.7, cy + R * 0.7],
        ].map(([x, y], i) => (
          <g key={i}>
            <line
              x1={x - R * 0.05}
              y1={y}
              x2={x + R * 0.05}
              y2={y}
              stroke={`rgb(${ink})`}
              strokeWidth="0.36"
              strokeOpacity="0.4"
            />
            <line
              x1={x}
              y1={y - R * 0.05}
              x2={x}
              y2={y + R * 0.05}
              stroke={`rgb(${ink})`}
              strokeWidth="0.36"
              strokeOpacity="0.4"
            />
            <circle
              cx={x}
              cy={y}
              r={R * 0.028}
              stroke={i % 2 === 0 ? `rgb(${org})` : `rgb(${ink})`}
              strokeWidth="0.3"
              strokeOpacity="0.45"
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   CORNER ANNOTATIONS  (matches LoginPage aesthetic)
───────────────────────────────────────────────────────────────────── */
function CornerAnnotations({ P }: { P: Palette }) {
  const ink = P.inkDim;
  const org = P.orange;

  return (
    <>
      {/* Top-left: sine wave */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          top: "6%",
          left: "2.5%",
          opacity: 0.32,
          transform: "rotate(-1.5deg)",
          pointerEvents: "none",
          zIndex: 3,
        }}
      >
        <svg viewBox="0 0 90 22" width="100" height="26" fill="none">
          <path
            d="M0 11 Q11 2 22 11 Q33 20 44 11 Q55 2 66 11 Q77 20 88 11"
            stroke={org}
            strokeWidth="0.9"
          />
          <text
            x="0"
            y="20"
            fontFamily="Courier Prime, monospace"
            fontSize="6"
            fill={ink}
          >
            y = sin(x)
          </text>
        </svg>
      </div>

      {/* Top-right: euler identity */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          top: "7%",
          right: "2.5%",
          opacity: 0.32,
          transform: "rotate(1.5deg)",
          pointerEvents: "none",
          zIndex: 3,
        }}
      >
        <svg viewBox="0 0 110 34" width="110" height="34" fill="none">
          <text
            x="4"
            y="22"
            fontFamily="Courier Prime, monospace"
            fontSize="16"
            fill={org}
            fontWeight="bold"
          >
            e
          </text>
          <text
            x="18"
            y="14"
            fontFamily="Courier Prime, monospace"
            fontSize="9"
            fill={ink}
          >
            iπ
          </text>
          <text
            x="36"
            y="22"
            fontFamily="Courier Prime, monospace"
            fontSize="15"
            fill={ink}
          >
            {" "}
            + 1 = 0
          </text>
          <text
            x="4"
            y="32"
            fontFamily="Courier Prime, monospace"
            fontSize="5.5"
            fill={ink}
          >
            Euler's identity
          </text>
        </svg>
      </div>

      {/* Bottom-left: Pythagoras */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          bottom: "6%",
          left: "2.5%",
          opacity: 0.32,
          transform: "rotate(-1deg)",
          pointerEvents: "none",
          zIndex: 3,
        }}
      >
        <svg viewBox="0 0 80 72" width="76" height="68" fill="none">
          <path d="M10 62 L10 10 L65 62 Z" stroke={ink} strokeWidth="0.7" />
          <path
            d="M10 42 L18 42 L18 50 L10 50"
            stroke={ink}
            strokeWidth="0.5"
          />
          <text
            x="2"
            y="38"
            fontFamily="Courier Prime, monospace"
            fontSize="6"
            fill={ink}
          >
            a
          </text>
          <text
            x="34"
            y="68"
            fontFamily="Courier Prime, monospace"
            fontSize="6"
            fill={ink}
          >
            b
          </text>
          <text
            x="38"
            y="30"
            fontFamily="Courier Prime, monospace"
            fontSize="6"
            fill={org}
          >
            c
          </text>
          <text
            x="2"
            y="68"
            fontFamily="Courier Prime, monospace"
            fontSize="5"
            fill={ink}
          >
            a²+b²=c²
          </text>
        </svg>
      </div>

      {/* Bottom-right: atom */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          bottom: "7%",
          right: "2.5%",
          opacity: 0.32,
          transform: "rotate(1.5deg)",
          pointerEvents: "none",
          zIndex: 3,
        }}
      >
        <svg viewBox="0 0 110 72" width="110" height="72" fill="none">
          <ellipse
            cx="55"
            cy="36"
            rx="48"
            ry="18"
            stroke={ink}
            strokeWidth="0.7"
          />
          <ellipse
            cx="55"
            cy="36"
            rx="48"
            ry="18"
            stroke={ink}
            strokeWidth="0.7"
            transform="rotate(60 55 36)"
          />
          <ellipse
            cx="55"
            cy="36"
            rx="48"
            ry="18"
            stroke={ink}
            strokeWidth="0.7"
            transform="rotate(120 55 36)"
          />
          <circle
            cx="55"
            cy="36"
            r="5"
            stroke={org}
            strokeWidth="0.8"
            fill={org}
            fillOpacity="0.12"
          />
          <text
            x="2"
            y="68"
            fontFamily="Courier Prime, monospace"
            fontSize="5.5"
            fill={ink}
          >
            atomic model
          </text>
        </svg>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   FIELD — same branded input as LoginPage
───────────────────────────────────────────────────────────────────── */
function EmailField({
  P,
  value,
  onChange,
  disabled,
}: {
  P: Palette;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label
        style={{
          display: "block",
          fontFamily: "Courier Prime, monospace",
          fontSize: "0.62rem",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: P.inkDim,
          marginBottom: "0.36rem",
        }}
      >
        Email address
      </label>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0 0.85rem",
          height: 46,
          background: P.bgElevated,
          border: `1px solid ${focused ? `rgba(${P.kscopeOrg},0.45)` : P.border}`,
          boxShadow: focused ? `0 0 20px ${P.orangeGlowSm}` : "none",
          clipPath:
            "polygon(0.3% 6%,1% 0%,99.5% 1%,100% 5%,99.6% 95%,99% 100%,0.5% 99%,0% 94%)",
          transition: "border-color 0.18s, box-shadow 0.18s",
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <Mail size={15} strokeWidth={1.5} color={P.inkDim} />
        <input
          type="email"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="you@school.edu"
          required
          disabled={disabled}
          autoComplete="email"
          style={{
            flex: 1,
            height: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            fontFamily: "Lora, Georgia, serif",
            fontSize: "0.9rem",
            color: P.ink,
            caretColor: P.orange,
            minWidth: 0,
          }}
        />
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════
   FORGOT PASSWORD PAGE
   ═════════════════════════════════════════════════════════════════════ */
export function ForgotPasswordPage() {
  const [theme, toggleTheme] = useThemeSync();
  useLockBodyScroll();

  const isDark = theme === "dark";
  const P = isDark ? DARK : LIGHT;

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await apiClient.post("/auth/forgot-password", { email });
      if (res.status === 200) setSubmitted(true);
    } catch (err: any) {
      setError(
        err.response?.data?.detail ?? "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

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
      {/* Grid texture */}
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

      {/* Kaleidoscope background */}
      <BackgroundDecor P={P} />

      {/* Corner annotations */}
      <CornerAnnotations P={P} />

      {/* ── TOP BAR ─────────────────────────────────────────────────── */}
      <header
        style={{
          position: "relative",
          zIndex: 10,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.85rem 2rem",
          borderBottom: `1px solid ${P.borderSubtle}`,
          background: isDark ? "rgba(7,8,13,0.6)" : "rgba(246,246,242,0.7)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <span
          style={{
            fontFamily: "Caveat, cursive",
            fontSize: "1.4rem",
            color: P.ink,
            transform: "rotate(-0.5deg)",
            display: "inline-block",
            opacity: 0.7,
          }}
        >
          Schoolme
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
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

          {/* Back to login */}
          <Link
            to="/login"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              fontFamily: "Courier Prime, monospace",
              fontSize: "0.66rem",
              letterSpacing: "0.12em",
              color: P.inkDim,
              textDecoration: "none",
            }}
          >
            <ChevronLeft size={13} strokeWidth={1.5} />
            Back to login
          </Link>
        </div>
      </header>

      {/* ── CENTRED CONTENT ───────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1.5rem",
          gap: "1rem",
        }}
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.45 }}
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
              fontFamily: "Courier Prime, monospace",
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
        <motion.span
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14, duration: 0.5 }}
          style={{
            fontFamily: "Caveat, cursive",
            fontSize: "clamp(2.4rem,5vw,3.8rem)",
            fontWeight: 400,
            lineHeight: 1,
            color: P.ink,
            transform: "rotate(-0.4deg)",
            display: "inline-block",
          }}
        >
          Schoolme
        </motion.span>

        {/* ── CARD ────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: "100%",
            maxWidth: 420,
            background: P.cardBg,
            border: `1px solid ${P.border}`,
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            padding: "2rem 2rem 1.75rem",
            clipPath:
              "polygon(0.3% 1%,1.5% 0%,99% 0.5%,100% 2%,99.7% 99%,98% 100%,0.5% 99.5%,0% 98%)",
            boxShadow: isDark
              ? "0 24px 64px rgba(0,0,0,0.45)"
              : "0 12px 40px rgba(30,28,24,0.1)",
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {submitted ? (
              /* ── SUCCESS STATE ────────────────────────────────────── */
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1.1rem",
                  textAlign: "center",
                }}
              >
                {/* Animated check icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -12 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 320,
                    damping: 22,
                    delay: 0.08,
                  }}
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {/* Breathing ring */}
                  <motion.div
                    style={{
                      position: "absolute",
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      background: `rgba(${P.kscopeOrg},0.06)`,
                    }}
                    animate={{ scale: [1, 1.45, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: `rgba(${P.kscopeOrg},0.1)`,
                      border: `1px solid rgba(${P.kscopeOrg},0.22)`,
                      borderRadius: "50%",
                    }}
                  >
                    <CheckCircle size={24} strokeWidth={1.5} color={P.orange} />
                  </div>
                </motion.div>

                {/* Heading — staggered word reveal */}
                <motion.h1
                  style={{
                    fontFamily: "Caveat, cursive",
                    fontSize: "1.9rem",
                    fontWeight: 700,
                    color: P.ink,
                    margin: 0,
                    lineHeight: 1.1,
                  }}
                  variants={{
                    hidden: {},
                    show: {
                      transition: {
                        delayChildren: 0.15,
                        staggerChildren: 0.08,
                      },
                    },
                  }}
                  initial="hidden"
                  animate="show"
                >
                  {"Check your email".split(" ").map((word, i) => (
                    <motion.span
                      key={i}
                      style={{ display: "inline-block", marginRight: "0.3rem" }}
                      variants={{
                        hidden: { opacity: 0, y: 14, filter: "blur(5px)" },
                        show: {
                          opacity: 1,
                          y: 0,
                          filter: "blur(0px)",
                          transition: {
                            duration: 0.65,
                            ease: [0.16, 1, 0.3, 1],
                          },
                        },
                      }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.h1>

                {/* Orange rule */}
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 72, opacity: 1 }}
                  transition={{ delay: 0.55, duration: 0.6 }}
                  style={{
                    height: 1,
                    background: `linear-gradient(90deg, transparent, ${P.orange}, transparent)`,
                    opacity: 0.45,
                  }}
                />

                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.45 }}
                  style={{
                    fontFamily: "Lora, Georgia, serif",
                    fontStyle: "italic",
                    fontSize: "0.85rem",
                    color: P.inkMid,
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  We sent a password reset link to{" "}
                  <strong
                    style={{
                      color: P.ink,
                      fontStyle: "normal",
                      fontWeight: 600,
                    }}
                  >
                    {email}
                  </strong>
                  .
                  <br />
                  The link expires in 30 minutes.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.72, duration: 0.35 }}
                >
                  <Link
                    to="/login"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      fontFamily: "Courier Prime, monospace",
                      fontSize: "0.7rem",
                      letterSpacing: "0.1em",
                      color: P.orange,
                      textDecoration: "none",
                      opacity: 0.9,
                    }}
                  >
                    <ArrowLeft size={13} strokeWidth={1.8} />
                    Back to login
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              /* ── FORM STATE ───────────────────────────────────────── */
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.1rem",
                }}
              >
                {/* Card heading */}
                <div style={{ textAlign: "center" }}>
                  <motion.h1
                    style={{
                      fontFamily: "Caveat, cursive",
                      fontSize: "1.75rem",
                      fontWeight: 700,
                      color: P.ink,
                      margin: 0,
                      lineHeight: 1.1,
                    }}
                    variants={{
                      hidden: {},
                      show: {
                        transition: {
                          delayChildren: 0.05,
                          staggerChildren: 0.07,
                        },
                      },
                    }}
                    initial="hidden"
                    animate="show"
                  >
                    {"Forgot password".split(" ").map((word, i) => (
                      <motion.span
                        key={i}
                        style={{
                          display: "inline-block",
                          marginRight: "0.3rem",
                        }}
                        variants={{
                          hidden: { opacity: 0, y: 12, filter: "blur(5px)" },
                          show: {
                            opacity: 1,
                            y: 0,
                            filter: "blur(0px)",
                            transition: {
                              duration: 0.6,
                              ease: [0.16, 1, 0.3, 1],
                            },
                          },
                        }}
                      >
                        {word}
                      </motion.span>
                    ))}
                  </motion.h1>

                  {/* Orange rule */}
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 60, opacity: 1 }}
                    transition={{ delay: 0.35, duration: 0.55 }}
                    style={{
                      height: 1,
                      background: `linear-gradient(90deg, transparent, ${P.orange}, transparent)`,
                      opacity: 0.4,
                      margin: "0.6rem auto 0",
                    }}
                  />

                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.4 }}
                    style={{
                      fontFamily: "Lora, Georgia, serif",
                      fontStyle: "italic",
                      fontSize: "0.8rem",
                      color: P.inkMid,
                      marginTop: "0.5rem",
                    }}
                  >
                    Enter your email and we'll send a reset link.
                  </motion.p>
                </div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.18 }}
                      style={{ overflow: "hidden" }}
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
                  onSubmit={handleSubmit}
                  noValidate
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.85rem",
                  }}
                >
                  <EmailField
                    P={P}
                    value={email}
                    onChange={setEmail}
                    disabled={loading}
                  />

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
                      fontFamily: "Caveat, cursive",
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
                    }}
                    whileHover={
                      loading
                        ? {}
                        : {
                            scale: 1.012,
                            boxShadow: `0 0 32px ${P.orangeGlow}`,
                          }
                    }
                    whileTap={loading ? {} : { scale: 0.988 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    {loading ? (
                      <>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          style={{ animation: "__fpspin 1s linear infinite" }}
                        >
                          <path
                            d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                        &nbsp;Sending…
                      </>
                    ) : (
                      <>
                        Send Reset Link
                        <motion.span
                          animate={{ x: [0, 3, 0] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 2,
                          }}
                        >
                          <ArrowRight size={13} strokeWidth={2.5} />
                        </motion.span>
                      </>
                    )}
                  </motion.button>
                </form>

                {/* Back to login */}
                <div style={{ textAlign: "center" }}>
                  <Link
                    to="/login"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      fontFamily: "Courier Prime, monospace",
                      fontSize: "0.69rem",
                      letterSpacing: "0.08em",
                      color: P.orange,
                      textDecoration: "none",
                      opacity: 0.85,
                    }}
                  >
                    <ArrowLeft size={13} strokeWidth={1.8} />
                    Back to login
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footnote */}
        <p
          style={{
            fontFamily: "Courier Prime, monospace",
            fontSize: "0.56rem",
            letterSpacing: "0.15em",
            color: P.inkDim,
            textAlign: "center",
          }}
        >
          ◦ &nbsp;schoolme.in &nbsp;·&nbsp; secure password reset
        </p>
      </div>

      <style>{`@keyframes __fpspin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(content, document.body)
    : null;
}
