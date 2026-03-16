// AttentionSidebar.tsx — Schoolme design system
// All logic from original preserved exactly.
// className-based styling → Schoolme inline CSS vars + Caveat/Lora/Courier Prime fonts.

"use client";

import { useState } from "react";
import CameraPermissionModal from "./CameraPermissionModal";
import {
  Eye,
  EyeOff,
  Brain,
  Activity,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Play,
  Square,
  TrendingUp,
  TrendingDown,
  Minus,
  Moon,
} from "lucide-react";
import type {
  AttentionBand,
  EscalationTier,
  AttentionFrame,
} from "./useGazeTrack";

interface AttentionSidebarProps {
  frame: AttentionFrame | null;
  score: number;
  band: AttentionBand;
  tier: EscalationTier;
  isTracking: boolean;
  gazeReady: boolean;
  cameraPermission:
    | "idle"
    | "requesting"
    | "granted"
    | "denied"
    | "previously_denied";
  onStart: () => void;
  onStop: () => void;
}

/* ── Token maps ── */
const BAND_HEX: Record<AttentionBand, string> = {
  FOCUSED: "#34d399",
  MILD: "#f59e0b",
  DISTRACTED: "#fb923c",
  ABSENT: "#f87171",
};
const BAND_LABEL: Record<AttentionBand, string> = {
  FOCUSED: "Focused",
  MILD: "Mild drift",
  DISTRACTED: "Distracted",
  ABSENT: "Absent",
};
const TIER_META: Record<EscalationTier, { label: string; color: string }> = {
  none: { label: "No alert", color: "var(--text-muted)" },
  soft: { label: "Soft alert active", color: "#f59e0b" },
  hard: { label: "David intervening", color: "#fb923c" },
};
const SIGNAL_ICONS: Record<string, React.ReactNode> = {
  gaze: <Eye size={13} strokeWidth={1.5} />,
  eyes: <EyeOff size={13} strokeWidth={1.5} />,
  headPose: <Brain size={13} strokeWidth={1.5} />,
  activity: <Activity size={13} strokeWidth={1.5} />,
};
const SIGNAL_LABELS: Record<string, string> = {
  gaze: "Gaze / Zone",
  eyes: "Eye openness",
  headPose: "Head pose",
  activity: "Activity ctx",
};

const CLIP_SM = "polygon(1% 0%,100% 1%,99% 100%,0% 99%)";
const f = {
  caveat: { fontFamily: "Caveat, cursive" } as React.CSSProperties,
  lora: { fontFamily: "Lora, Georgia, serif" } as React.CSSProperties,
  courier: { fontFamily: "Courier Prime, monospace" } as React.CSSProperties,
};

/* ── Score arc ── */
function ScoreArc({ score, band }: { score: number; band: AttentionBand }) {
  const r = 38,
    circ = 2 * Math.PI * r,
    dash = circ * (score / 100);
  const col = BAND_HEX[band];
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 96,
        height: 96,
      }}
    >
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          transform: "rotate(-90deg)",
        }}
        viewBox="0 0 96 96"
        fill="none"
      >
        <circle
          cx="48"
          cy="48"
          r={r}
          stroke="var(--border-strong)"
          strokeWidth="5"
          opacity="0.3"
        />
        <circle
          cx="48"
          cy="48"
          r={r}
          stroke={col}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={`${circ}`}
          strokeDashoffset={`${circ - dash}`}
          style={{ transition: "stroke-dashoffset 0.9s ease" }}
        />
      </svg>
      <div style={{ zIndex: 1, textAlign: "center" }}>
        <div
          style={{
            ...f.caveat,
            fontSize: "1.7rem",
            fontWeight: 700,
            color: col,
            lineHeight: 1,
          }}
        >
          {score}
        </div>
        <div
          style={{
            ...f.courier,
            fontSize: "0.55rem",
            letterSpacing: "0.12em",
            color: "var(--text-muted)",
          }}
        >
          / 100
        </div>
      </div>
    </div>
  );
}

/* ── Signal bar ── */
function SignalBar({
  label,
  icon,
  score,
  weight,
  reason,
}: {
  label: string;
  icon: React.ReactNode;
  score: number;
  weight: number;
  contribution: number;
  reason: string;
}) {
  const pct = Math.round(score);
  const barColor =
    pct >= 75
      ? "#34d399"
      : pct >= 50
        ? "#f59e0b"
        : pct >= 25
          ? "#fb923c"
          : "#f87171";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            color: "var(--text-muted)",
          }}
        >
          {icon}
          <span
            style={{
              ...f.courier,
              fontSize: "0.6rem",
              letterSpacing: "0.08em",
            }}
          >
            {label}
          </span>
          <span style={{ ...f.courier, fontSize: "0.55rem", opacity: 0.55 }}>
            ×
            {weight.toFixed(0) === "0"
              ? weight.toFixed(2)
              : (weight * 100).toFixed(0) + "%"}
          </span>
        </div>
        <span
          style={{
            ...f.caveat,
            fontSize: "0.95rem",
            fontWeight: 700,
            color: "var(--text-primary)",
          }}
        >
          {pct}
        </span>
      </div>
      <div
        style={{
          height: 4,
          width: "100%",
          background: "var(--bg-deep)",
          borderRadius: "999px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: barColor,
            borderRadius: "999px",
            transition: "width 0.7s ease",
          }}
        />
      </div>
      {reason && reason !== "—" && (
        <p
          style={{
            ...f.courier,
            fontSize: "0.55rem",
            color: "var(--text-muted)",
            opacity: 0.65,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {reason}
        </p>
      )}
    </div>
  );
}

/* ── Section eyebrow ── */
function Eyebrow({ label }: { label: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
        marginBottom: "0.65rem",
      }}
    >
      <div
        style={{
          height: 1,
          width: "0.8rem",
          background: "var(--orange)",
          opacity: 0.5,
        }}
      />
      <span
        style={{
          ...f.courier,
          fontSize: "0.58rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--orange)",
          opacity: 0.85,
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* ── Main ── */
export default function AttentionSidebar({
  frame,
  score,
  band,
  tier,
  isTracking,
  gazeReady,
  cameraPermission,
  onStart,
  onStop,
}: AttentionSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [showPermModal, setShowPermModal] = useState(false);

  const tierMeta = TIER_META[tier];
  const bandColor = BAND_HEX[band];
  const TrendIcon =
    frame?.trend === "RISING"
      ? TrendingUp
      : frame?.trend === "FALLING"
        ? TrendingDown
        : Minus;

  /* ── Collapsed ── */
  if (collapsed) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "1rem 0.5rem",
          gap: "0.75rem",
          borderLeft: "1px solid var(--border-subtle)",
          background: "var(--bg-surface)",
          height: "100%",
          width: 44,
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => setCollapsed(false)}
          title="Open attention panel"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-muted)",
            display: "flex",
          }}
        >
          <ChevronLeft size={16} strokeWidth={1.5} />
        </button>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
            marginTop: "0.5rem",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: isTracking ? bandColor : "var(--text-muted)",
              opacity: isTracking ? 1 : 0.3,
              animation:
                isTracking && (band === "DISTRACTED" || band === "ABSENT")
                  ? "as-pulse 1.5s ease-in-out infinite"
                  : "none",
            }}
          />
          {isTracking && (
            <span
              style={{
                ...f.caveat,
                fontSize: "0.9rem",
                fontWeight: 700,
                color: bandColor,
                transform: "rotate(-90deg)",
                whiteSpace: "nowrap",
                marginTop: "1rem",
              }}
            >
              {score}
            </span>
          )}
        </div>
        <style>{`@keyframes as-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.3)}}`}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: 252,
        flexShrink: 0,
        borderLeft: "1px solid var(--border-subtle)",
        background: "var(--bg-surface)",
        overflow: "hidden",
      }}
    >
      <CameraPermissionModal
        visible={showPermModal || cameraPermission === "previously_denied"}
        onClose={() => setShowPermModal(false)}
        onRetry={() => {
          setShowPermModal(false);
          onStart();
        }}
      />

      {/* Header */}
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.75rem 1rem",
          borderBottom: "1px solid var(--border-subtle)",
          background: "var(--bg-elevated)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Eye size={15} strokeWidth={1.5} color="var(--orange)" />
          <span
            style={{
              ...f.caveat,
              fontSize: "1.05rem",
              fontWeight: 700,
              color: "var(--text-primary)",
            }}
          >
            GazeTrack
          </span>
        </div>
        <button
          onClick={() => setCollapsed(true)}
          title="Collapse"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-muted)",
            display: "flex",
            padding: "0.15rem",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.color =
              "var(--text-primary)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.color = "var(--text-muted)")
          }
        >
          <ChevronRight size={15} strokeWidth={1.5} />
        </button>
      </div>

      {/* Scrollable body */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.1rem",
        }}
      >
        {/* Score arc + band */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <ScoreArc score={score} band={band} />
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                ...f.caveat,
                fontSize: "1.1rem",
                fontWeight: 700,
                color: bandColor,
              }}
            >
              {BAND_LABEL[band]}
            </div>
            {frame && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.35rem",
                  marginTop: "0.2rem",
                }}
              >
                <TrendIcon
                  size={12}
                  strokeWidth={1.5}
                  color={
                    frame.trend === "RISING"
                      ? "#34d399"
                      : frame.trend === "FALLING"
                        ? "#f87171"
                        : "var(--text-muted)"
                  }
                />
                <span
                  style={{
                    ...f.courier,
                    fontSize: "0.58rem",
                    letterSpacing: "0.08em",
                    color: "var(--text-muted)",
                  }}
                >
                  {frame.trend.charAt(0) + frame.trend.slice(1).toLowerCase()} ·{" "}
                  {Math.round(frame.confidence * 100)}% conf.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Alert tier */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.45rem 0.65rem",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-subtle)",
            clipPath: CLIP_SM,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              flexShrink: 0,
              display: "inline-block",
              background:
                tier === "none"
                  ? "var(--text-muted)"
                  : tier === "soft"
                    ? "#f59e0b"
                    : "#fb923c",
              animation:
                tier !== "none" ? "as-pulse 1.5s ease-in-out infinite" : "none",
              opacity: tier === "none" ? 0.4 : 1,
            }}
          />
          <span
            style={{
              ...f.courier,
              fontSize: "0.62rem",
              letterSpacing: "0.08em",
              color: tierMeta.color,
            }}
          >
            {tierMeta.label}
          </span>
        </div>

        {/* Signal breakdown */}
        <div>
          <Eyebrow label="Signal breakdown" />
          {frame ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {(["gaze", "eyes", "headPose", "activity"] as const).map(
                (key) => (
                  <SignalBar
                    key={key}
                    label={SIGNAL_LABELS[key]}
                    icon={SIGNAL_ICONS[key]}
                    score={frame.signals[key].score}
                    weight={frame.signals[key].weight}
                    contribution={frame.signals[key].contribution}
                    reason={frame.signals[key].reason}
                  />
                ),
              )}
            </div>
          ) : (
            <p
              style={{
                ...f.lora,
                fontStyle: "italic",
                fontSize: "0.82rem",
                color: "var(--text-muted)",
                textAlign: "center",
                padding: "1rem 0",
              }}
            >
              {isTracking
                ? "Waiting for signal…"
                : "Start tracking to see signals."}
            </p>
          )}
        </div>

        {/* Activity state */}
        {frame && (
          <div>
            <Eyebrow label="Activity" />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
              <span
                style={{
                  ...f.courier,
                  fontSize: "0.58rem",
                  letterSpacing: "0.06em",
                  background: "var(--bg-elevated)",
                  color: "var(--text-primary)",
                  padding: "0.2rem 0.55rem",
                  borderRadius: "999px",
                }}
              >
                {frame.activityState
                  .replace(/_/g, " ")
                  .toLowerCase()
                  .replace(/^\w/, (c) => c.toUpperCase())}
              </span>
              {frame.zone2Confirmed && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    ...f.courier,
                    fontSize: "0.58rem",
                    background: "rgba(242,116,13,0.10)",
                    color: "var(--orange)",
                    padding: "0.2rem 0.55rem",
                    borderRadius: "999px",
                  }}
                >
                  <MapPin size={10} strokeWidth={1.5} /> Zone 2 ✓
                </span>
              )}
              {frame.drowsy && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    ...f.courier,
                    fontSize: "0.58rem",
                    background: "rgba(251,191,36,0.10)",
                    color: "#fbbf24",
                    padding: "0.2rem 0.55rem",
                    borderRadius: "999px",
                  }}
                >
                  <Moon size={10} strokeWidth={1.5} /> Drowsy
                </span>
              )}
            </div>
          </div>
        )}

        {/* Raw vs smoothed */}
        {frame && Math.abs(frame.score - frame.rawScore) > 2 && (
          <p
            style={{
              ...f.courier,
              fontSize: "0.55rem",
              color: "var(--text-muted)",
              opacity: 0.55,
              textAlign: "center",
            }}
          >
            Raw: {frame.rawScore} → smoothed {frame.score}
          </p>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          flexShrink: 0,
          padding: "0.85rem 1rem",
          borderTop: "1px solid var(--border-subtle)",
          display: "flex",
          flexDirection: "column",
          gap: "0.4rem",
        }}
      >
        {!isTracking ? (
          <>
            <button
              onClick={
                cameraPermission === "previously_denied"
                  ? () => setShowPermModal(true)
                  : onStart
              }
              disabled={cameraPermission === "requesting"}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem",
                ...f.caveat,
                fontSize: "1rem",
                fontWeight: 700,
                padding: "0.6rem",
                background:
                  cameraPermission === "previously_denied"
                    ? "rgba(248,113,113,0.10)"
                    : "var(--orange)",
                color:
                  cameraPermission === "previously_denied"
                    ? "#f87171"
                    : "#07080d",
                border:
                  cameraPermission === "previously_denied"
                    ? "1px solid rgba(248,113,113,0.3)"
                    : "none",
                clipPath:
                  "polygon(0.3% 6%,1% 0%,99.5% 1%,100% 5%,99.6% 95%,99% 100%,0.5% 99%,0% 94%)",
                cursor:
                  cameraPermission === "requesting" ? "not-allowed" : "pointer",
                opacity: cameraPermission === "requesting" ? 0.65 : 1,
                transition: "background 0.2s",
              }}
            >
              {cameraPermission === "requesting" ? (
                <>
                  <span
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "currentColor",
                      animation: "as-spin 1s linear infinite",
                      display: "inline-block",
                    }}
                  />{" "}
                  Requesting…
                </>
              ) : cameraPermission === "previously_denied" ? (
                <>Camera blocked — fix it</>
              ) : (
                <>
                  <Play size={13} strokeWidth={2} /> Start tracking
                </>
              )}
            </button>
            {cameraPermission === "requesting" && (
              <p
                style={{
                  ...f.courier,
                  fontSize: "0.58rem",
                  letterSpacing: "0.08em",
                  color: "var(--text-muted)",
                  textAlign: "center",
                }}
              >
                Allow camera access in the browser dialog.
              </p>
            )}
          </>
        ) : (
          <button
            onClick={onStop}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
              ...f.caveat,
              fontSize: "1rem",
              fontWeight: 700,
              padding: "0.6rem",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-default)",
              cursor: "pointer",
              color: "var(--text-secondary)",
              clipPath:
                "polygon(0.3% 6%,1% 0%,99.5% 1%,100% 5%,99.6% 95%,99% 100%,0.5% 99%,0% 94%)",
              transition: "color 0.15s",
            }}
          >
            <Square size={13} strokeWidth={2} /> Stop &amp; save session
          </button>
        )}
        {isTracking && !gazeReady && (
          <p
            style={{
              ...f.courier,
              fontSize: "0.58rem",
              letterSpacing: "0.1em",
              color: "var(--text-muted)",
              textAlign: "center",
              animation: "as-pulse 1.5s ease-in-out infinite",
            }}
          >
            Initialising camera…
          </p>
        )}
        {isTracking && gazeReady && (
          <p
            style={{
              ...f.courier,
              fontSize: "0.58rem",
              letterSpacing: "0.1em",
              color: "#34d399",
              textAlign: "center",
            }}
          >
            ● Live
          </p>
        )}
      </div>

      <style>{`
        @keyframes as-pulse { 0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.3)} }
        @keyframes as-spin  { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
