// components/AttentionPulse.tsx
// Tier-1 (soft) intervention — an amber glow that pulses around the
// screen border when the student is mildly distracted.
// Completely non-blocking: no modals, no blur.
// Disappears automatically on recovery.

"use client";

import { useEffect, useRef } from "react";
import type {
  AttentionBand,
  EscalationTier,
} from "../../../hooks/useGazeTrack";

interface AttentionPulseProps {
  band: AttentionBand;
  tier: EscalationTier;
  isTracking: boolean;
}

// Map band → border glow colour token
const BAND_COLOR: Partial<Record<AttentionBand, string>> = {
  MILD: "rgba(251,191,36,0.55)", // amber-400
  DISTRACTED: "rgba(249,115,22,0.70)", // orange-500
  ABSENT: "rgba(239,68,68,0.80)", // red-500
};

export default function AttentionPulse({
  band,
  tier,
  isTracking,
}: AttentionPulseProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const visible = isTracking && (tier === "soft" || tier === "hard");
    const color = BAND_COLOR[band] ?? BAND_COLOR.DISTRACTED!;

    if (visible) {
      el.style.boxShadow = `inset 0 0 0 4px ${color}, inset 0 0 40px 8px ${color}`;
      el.style.opacity = "1";
    } else {
      el.style.boxShadow = "none";
      el.style.opacity = "0";
    }
  }, [band, tier, isTracking]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40 rounded-none transition-all duration-700"
      style={{ opacity: 0 }}
    />
  );
}
