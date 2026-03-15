// components/AttentionSidebar.tsx
// Full-signal attention sidebar panel.
// Shows: live score arc, band, per-signal bars, activity state,
// zone 2 status, drowsiness flag, trend arrow, and session controls.

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

// ── Config maps ──────────────────────────────────────────────────────────────

const BAND_COLOR: Record<AttentionBand, string> = {
  FOCUSED: "text-emerald-500",
  MILD: "text-amber-500",
  DISTRACTED: "text-orange-500",
  ABSENT: "text-red-500",
};

const BAND_BG: Record<AttentionBand, string> = {
  FOCUSED: "bg-emerald-500",
  MILD: "bg-amber-500",
  DISTRACTED: "bg-orange-500",
  ABSENT: "bg-red-500",
};

const BAND_RING: Record<AttentionBand, string> = {
  FOCUSED: "ring-emerald-400/50",
  MILD: "ring-amber-400/50",
  DISTRACTED: "ring-orange-400/50",
  ABSENT: "ring-red-400/50",
};

const BAND_LABEL: Record<AttentionBand, string> = {
  FOCUSED: "Focused",
  MILD: "Mild drift",
  DISTRACTED: "Distracted",
  ABSENT: "Absent",
};

const TIER_LABEL: Record<EscalationTier, { label: string; color: string }> = {
  none: { label: "No alert", color: "text-muted-foreground" },
  soft: { label: "Soft alert active", color: "text-amber-500" },
  hard: { label: "David intervening", color: "text-orange-500" },
};

const SIGNAL_ICONS: Record<string, React.ReactNode> = {
  gaze: <Eye className="w-3.5 h-3.5" />,
  eyes: <EyeOff className="w-3.5 h-3.5" />,
  headPose: <Brain className="w-3.5 h-3.5" />,
  activity: <Activity className="w-3.5 h-3.5" />,
};

const SIGNAL_LABELS: Record<string, string> = {
  gaze: "Gaze / Zone",
  eyes: "Eye openness",
  headPose: "Head pose",
  activity: "Activity ctx",
};

// ── Score arc SVG ────────────────────────────────────────────────────────────

function ScoreArc({ score, band }: { score: number; band: AttentionBand }) {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const dash = circ * (score / 100);
  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      <svg
        className="absolute inset-0 w-full h-full -rotate-90"
        viewBox="0 0 96 96"
        fill="none"
      >
        <circle
          cx="48"
          cy="48"
          r={r}
          stroke="currentColor"
          strokeWidth="5"
          className="text-border opacity-30"
        />
        <circle
          cx="48"
          cy="48"
          r={r}
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={`${circ}`}
          strokeDashoffset={`${circ - dash}`}
          className={BAND_COLOR[band]}
          style={{ transition: "stroke-dashoffset 0.9s ease" }}
        />
      </svg>
      <div className="z-10 text-center">
        <div className={`text-2xl font-bold tabular-nums ${BAND_COLOR[band]}`}>
          {score}
        </div>
        <div className="text-[10px] text-muted-foreground leading-none">
          / 100
        </div>
      </div>
    </div>
  );
}

// ── Signal bar ────────────────────────────────────────────────────────────────

function SignalBar({
  label,
  icon,
  score,
  weight,
  contribution,
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
      ? "bg-emerald-500"
      : pct >= 50
        ? "bg-amber-500"
        : pct >= 25
          ? "bg-orange-500"
          : "bg-red-500";

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {icon}
          <span>{label}</span>
          <span className="text-[10px] opacity-60">
            ×
            {weight.toFixed(0) === "0"
              ? weight.toFixed(2)
              : (weight * 100).toFixed(0) + "%"}
          </span>
        </div>
        <span className="text-xs font-semibold tabular-nums text-foreground">
          {pct}
        </span>
      </div>
      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {reason && reason !== "—" && (
        <p className="text-[10px] text-muted-foreground/70 truncate">
          {reason}
        </p>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

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

  const tierInfo = TIER_LABEL[tier];
  const TrendIcon =
    frame?.trend === "RISING"
      ? TrendingUp
      : frame?.trend === "FALLING"
        ? TrendingDown
        : Minus;

  // ── Collapsed state ──────────────────────────────────────────────────────
  if (collapsed) {
    return (
      <div className="flex flex-col items-center py-4 px-2 gap-3 border-l border-border bg-card h-full w-12 shrink-0">
        <button
          onClick={() => setCollapsed(false)}
          className="text-muted-foreground hover:text-foreground transition-colors"
          title="Open attention panel"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="mt-2 flex flex-col items-center gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full ${isTracking ? BAND_BG[band] : "bg-muted-foreground/30"} ${isTracking && (band === "DISTRACTED" || band === "ABSENT") ? "animate-pulse" : ""}`}
          />
          {isTracking && (
            <span
              className={`text-[10px] font-bold tabular-nums -rotate-90 whitespace-nowrap mt-4 ${BAND_COLOR[band]}`}
            >
              {score}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-64 shrink-0 border-l border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex-none flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">
            GazeTrack
          </span>
        </div>
        <button
          onClick={() => setCollapsed(true)}
          className="text-muted-foreground hover:text-foreground transition-colors p-1"
          title="Collapse"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        {/* Score arc + band */}
        <div className="flex flex-col items-center gap-2">
          <div className={`ring-2 rounded-full ${BAND_RING[band]} p-1`}>
            <ScoreArc score={score} band={band} />
          </div>
          <div className="text-center space-y-0.5">
            <div className={`text-sm font-semibold ${BAND_COLOR[band]}`}>
              {BAND_LABEL[band]}
            </div>
            {frame && (
              <div className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
                <TrendIcon
                  className={`w-3 h-3 ${
                    frame.trend === "RISING"
                      ? "text-emerald-500"
                      : frame.trend === "FALLING"
                        ? "text-red-400"
                        : ""
                  }`}
                />
                {frame.trend.charAt(0) + frame.trend.slice(1).toLowerCase()}
                {" · "}
                {Math.round(frame.confidence * 100)}% conf.
              </div>
            )}
          </div>
        </div>

        {/* Alert tier */}
        <div className="flex items-center gap-2 px-3 py-2 bg-muted/40 rounded-lg">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              tier === "none"
                ? "bg-muted-foreground/40"
                : tier === "soft"
                  ? "bg-amber-400 animate-pulse"
                  : "bg-orange-500 animate-pulse"
            }`}
          />
          <span className={`text-xs font-medium ${tierInfo.color}`}>
            {tierInfo.label}
          </span>
        </div>

        {/* Signal breakdown */}
        {frame ? (
          <div className="space-y-3.5">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
              Signal Breakdown
            </p>
            {(["gaze", "eyes", "headPose", "activity"] as const).map((key) => (
              <SignalBar
                key={key}
                label={SIGNAL_LABELS[key]}
                icon={SIGNAL_ICONS[key]}
                score={frame.signals[key].score}
                weight={frame.signals[key].weight}
                contribution={frame.signals[key].contribution}
                reason={frame.signals[key].reason}
              />
            ))}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground text-center py-4">
            {isTracking
              ? "Waiting for signal…"
              : "Start tracking to see signals."}
          </div>
        )}

        {/* Activity state */}
        {frame && (
          <div className="space-y-2">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
              Activity
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[11px] bg-muted px-2 py-0.5 rounded-full text-foreground font-medium">
                {frame.activityState
                  .replace(/_/g, " ")
                  .toLowerCase()
                  .replace(/^\w/, (c) => c.toUpperCase())}
              </span>

              {frame.zone2Confirmed && (
                <span className="flex items-center gap-1 text-[11px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                  <MapPin className="w-2.5 h-2.5" /> Zone 2 ✓
                </span>
              )}

              {frame.drowsy && (
                <span className="flex items-center gap-1 text-[11px] bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 px-2 py-0.5 rounded-full font-medium">
                  <Moon className="w-2.5 h-2.5" /> Drowsy
                </span>
              )}
            </div>
          </div>
        )}

        {/* Raw score if smoothed ≠ raw */}
        {frame && Math.abs(frame.score - frame.rawScore) > 2 && (
          <div className="text-[10px] text-muted-foreground/60 text-center">
            Raw score: {frame.rawScore} (smoothed → {frame.score})
          </div>
        )}
      </div>

      {/* Footer — start / stop */}
      {/* Camera permission modal — rendered outside the sidebar so it's full-screen */}
      <CameraPermissionModal
        visible={showPermModal || cameraPermission === "previously_denied"}
        onClose={() => setShowPermModal(false)}
        onRetry={() => {
          setShowPermModal(false);
          onStart();
        }}
      />

      <div className="flex-none p-4 border-t border-border space-y-2">
        {!isTracking ? (
          <>
            <button
              onClick={
                cameraPermission === "previously_denied"
                  ? () => setShowPermModal(true)
                  : onStart
              }
              disabled={cameraPermission === "requesting"}
              className={`w-full flex items-center justify-center gap-2 text-xs font-semibold py-2.5 rounded-full transition-colors disabled:opacity-60 disabled:cursor-wait ${
                cameraPermission === "previously_denied"
                  ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/30"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              {cameraPermission === "requesting" ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-current/40 border-t-current animate-spin" />
                  Requesting camera…
                </>
              ) : cameraPermission === "previously_denied" ? (
                <>
                  <span className="text-base leading-none">🔒</span>
                  Camera blocked — fix it
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  Start tracking
                </>
              )}
            </button>

            {cameraPermission === "requesting" && (
              <p className="text-[10px] text-muted-foreground text-center leading-snug">
                Allow camera access in the browser dialog above.
              </p>
            )}
          </>
        ) : (
          <button
            onClick={onStop}
            className="w-full flex items-center justify-center gap-2 bg-muted text-muted-foreground hover:text-foreground text-xs font-semibold py-2.5 rounded-full hover:bg-muted/80 transition-colors"
          >
            <Square className="w-3.5 h-3.5" />
            Stop &amp; save session
          </button>
        )}
        {isTracking && !gazeReady && (
          <p className="text-[10px] text-muted-foreground text-center animate-pulse">
            Initialising camera…
          </p>
        )}
        {isTracking && gazeReady && (
          <p className="text-[10px] text-emerald-500 text-center">● Live</p>
        )}
      </div>
    </div>
  );
}
