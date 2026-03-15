// components/AttentionModal.tsx
// Tier-2 (hard) intervention — content blur + centred modal.
// Fires after the student has been distracted for AVATAR_ESCALATION_MS.
// David is already speaking a re-engage prompt at this point.
// Student dismisses with "I'm back" or the overlay auto-clears on recovery.

"use client";

import { Bot } from "lucide-react";
import type { AttentionBand } from "../../../hooks/useGazeTrack";

interface AttentionModalProps {
  visible: boolean;
  band: AttentionBand;
  score: number;
  onDismiss: () => void;
}

const MODAL_COPY: Partial<
  Record<AttentionBand, { title: string; body: string }>
> = {
  DISTRACTED: {
    title: "Hey, come back!",
    body: "David noticed you've been away for a bit. Whenever you're ready, tap the button and we'll carry on.",
  },
  ABSENT: {
    title: "Are you still there?",
    body: "We can't see you. Make sure your face is visible in the camera and you're in a well-lit space.",
  },
};

export default function AttentionModal({
  visible,
  band,
  score,
  onDismiss,
}: AttentionModalProps) {
  const copy = MODAL_COPY[band] ?? MODAL_COPY.DISTRACTED!;

  if (!visible) return null;

  return (
    <>
      {/* Content blur layer — sits below the modal, above page content */}
      <div
        aria-hidden
        className="fixed inset-0 z-50 backdrop-blur-md bg-background/40 transition-all duration-500"
      />

      {/* Modal card */}
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="attention-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
      >
        <div className="bg-card border border-border rounded-2xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center gap-5 text-center animate-in zoom-in-95 fade-in duration-300">
          {/* David avatar icon */}
          <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
            <Bot className="w-8 h-8 text-primary" />
          </div>

          {/* Copy */}
          <div className="space-y-1.5">
            <h2
              id="attention-modal-title"
              className="text-base font-semibold text-foreground"
            >
              {copy.title}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {copy.body}
            </p>
          </div>

          {/* Score pill */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            Attention score: {score}
          </div>

          {/* Dismiss */}
          <button
            onClick={onDismiss}
            className="w-full bg-primary text-primary-foreground text-sm font-semibold py-2.5 rounded-full hover:bg-primary/90 transition-colors active:scale-95"
          >
            I&apos;m back — let&apos;s continue
          </button>
        </div>
      </div>
    </>
  );
}
