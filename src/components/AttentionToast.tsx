// components/AttentionToast.tsx
// Non-intrusive toast that appears when the student first enters the SOFT tier.
// Auto-dismisses after 6 seconds. Does NOT block interaction.

"use client";

import { useEffect, useState, useRef } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import type {
  AttentionBand,
  EscalationTier,
} from "../../../hooks/useGazeTrack";

interface AttentionToastProps {
  band: AttentionBand;
  tier: EscalationTier;
  score: number;
  isTracking: boolean;
}

const TOAST_MESSAGES: Record<string, string> = {
  MILD: "Looks like you're drifting a little — refocus when you're ready.",
  DISTRACTED: "You seem distracted. Try to bring your attention back.",
  ABSENT: "We can't see you. Are you still there?",
};

const TOAST_ICONS: Partial<Record<AttentionBand, React.ReactNode>> = {
  MILD: <Eye className="w-4 h-4 text-amber-500" />,
  DISTRACTED: <EyeOff className="w-4 h-4 text-orange-500" />,
  ABSENT: <EyeOff className="w-4 h-4 text-red-500" />,
};

const TOAST_COLORS: Partial<Record<AttentionBand, string>> = {
  MILD: "border-amber-300 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-700",
  DISTRACTED:
    "border-orange-300 bg-orange-50 dark:bg-orange-950/40 dark:border-orange-700",
  ABSENT: "border-red-300 bg-red-50 dark:bg-red-950/40 dark:border-red-700",
};

const AUTO_DISMISS_MS = 6_000;

export default function AttentionToast({
  band,
  tier,
  score,
  isTracking,
}: AttentionToastProps) {
  const [visible, setVisible] = useState(false);
  const [rendered, setRendered] = useState(false);
  const prevTierRef = useRef<EscalationTier>("none");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const prev = prevTierRef.current;
    prevTierRef.current = tier;

    // Show toast on transition INTO soft tier only
    if (tier === "soft" && prev === "none" && isTracking) {
      setRendered(true);
      requestAnimationFrame(() => setVisible(true));

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setVisible(false), AUTO_DISMISS_MS);
    }

    // Hide immediately on recovery
    if (tier === "none" && prev !== "none") {
      setVisible(false);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [tier, isTracking]);

  // Unmount after fade-out animation
  useEffect(() => {
    if (!visible) {
      const t = setTimeout(() => setRendered(false), 400);
      return () => clearTimeout(t);
    }
  }, [visible]);

  if (!rendered) return null;

  const msg = TOAST_MESSAGES[band] ?? TOAST_MESSAGES.DISTRACTED;
  const icon = TOAST_ICONS[band];
  const colors = TOAST_COLORS[band] ?? TOAST_COLORS.DISTRACTED!;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        fixed bottom-6 right-6 z-50
        flex items-start gap-3
        max-w-xs w-full
        border rounded-xl p-3.5 shadow-lg
        transition-all duration-400
        ${colors}
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"}
      `}
    >
      <span className="mt-0.5 shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-foreground mb-0.5">
          Attention check
        </p>
        <p className="text-xs text-muted-foreground leading-snug">{msg}</p>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="shrink-0 p-0.5 rounded text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
