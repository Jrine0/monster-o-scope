// components/CameraPermissionModal.tsx
// Shown when the browser has previously denied camera access.
// Browsers don't allow JS to re-trigger a denied permission dialog —
// the user must manually reset it. This modal shows exactly how,
// with browser-specific instructions and the correct UI to click.

"use client";

import { useEffect, useState } from "react";
import { Camera, X, RefreshCw } from "lucide-react";

interface CameraPermissionModalProps {
  visible: boolean;
  onClose: () => void;
  onRetry: () => void; // called after user says they've reset it
}

type BrowserType = "chrome" | "firefox" | "safari" | "edge" | "other";

function detectBrowser(): BrowserType {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("edg/")) return "edge";
  if (ua.includes("firefox")) return "firefox";
  if (ua.includes("safari") && !ua.includes("chrome")) return "safari";
  if (ua.includes("chrome")) return "chrome";
  return "other";
}

const INSTRUCTIONS: Record<BrowserType, { steps: string[]; icon: string }> = {
  chrome: {
    icon: "🌐",
    steps: [
      "Click the 🔒 lock icon in the address bar (left of the URL)",
      'Find "Camera" in the permissions list',
      'Change it from "Blocked" to "Allow"',
      'Click "Reload" below to apply',
    ],
  },
  edge: {
    icon: "🌐",
    steps: [
      "Click the 🔒 lock icon in the address bar",
      'Click "Permissions for this site"',
      'Set "Camera" to "Allow"',
      'Click "Reload" below to apply',
    ],
  },
  firefox: {
    icon: "🦊",
    steps: [
      "Click the 🔒 lock icon left of the URL bar",
      'Click "Connection secure" → "More information"',
      'Go to the "Permissions" tab',
      'Find "Use the Camera" and uncheck "Block"',
      'Click "Reload" below to apply',
    ],
  },
  safari: {
    icon: "🧭",
    steps: [
      'Open Safari → "Settings" (⌘ ,)',
      'Click "Websites" → "Camera"',
      `Find "${typeof window !== "undefined" ? window.location.hostname : "this site"}" and set it to "Allow"`,
      'Click "Reload" below to apply',
    ],
  },
  other: {
    icon: "🌐",
    steps: [
      "Open your browser settings",
      'Find "Privacy & Security" → "Site permissions" → "Camera"',
      `Allow access for ${typeof window !== "undefined" ? window.location.hostname : "this site"}`,
      'Click "Reload" below to apply',
    ],
  },
};

export default function CameraPermissionModal({
  visible,
  onClose,
  onRetry,
}: CameraPermissionModalProps) {
  const [browser, setBrowser] = useState<BrowserType>("other");
  const [reloading, setReloading] = useState(false);

  useEffect(() => {
    setBrowser(detectBrowser());
  }, []);

  if (!visible) return null;

  const info = INSTRUCTIONS[browser];

  const handleReload = () => {
    setReloading(true);
    window.location.reload();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cam-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 fade-in duration-200">
          {/* Header */}
          <div className="flex items-start justify-between p-6 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center shrink-0">
                <Camera className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h2
                  id="cam-modal-title"
                  className="text-base font-semibold text-foreground"
                >
                  Camera access blocked
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Your browser is preventing camera access
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Browser badge */}
          <div className="px-6 pb-3">
            <span className="inline-flex items-center gap-1.5 text-xs bg-muted px-2.5 py-1 rounded-full text-muted-foreground">
              <span>{info.icon}</span>
              <span className="capitalize font-medium">
                {browser === "other" ? "Your browser" : browser}
              </span>
              <span>instructions</span>
            </span>
          </div>

          {/* Steps */}
          <div className="px-6 pb-5">
            <ol className="space-y-3">
              {info.steps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-foreground leading-snug">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Visual hint — address bar illustration */}
          <div className="mx-6 mb-5 rounded-xl border border-border bg-muted/30 p-3 flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 flex-1 bg-background border border-border rounded-lg px-2.5 py-1.5">
              <span className="text-sm">🔒</span>
              <span className="text-xs text-muted-foreground font-mono truncate">
                {typeof window !== "undefined"
                  ? window.location.hostname
                  : "localhost:3000"}
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
              ← click here
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 px-6 pb-6">
            <button
              onClick={handleReload}
              disabled={reloading}
              className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground text-sm font-semibold py-2.5 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${reloading ? "animate-spin" : ""}`}
              />
              {reloading ? "Reloading…" : "Reload page"}
            </button>
            <button
              onClick={onRetry}
              className="flex-1 flex items-center justify-center gap-2 bg-muted text-muted-foreground hover:text-foreground text-sm font-semibold py-2.5 rounded-full hover:bg-muted/80 transition-colors"
            >
              Try again
            </button>
          </div>

          {/* Footer note */}
          <p className="text-[11px] text-muted-foreground/60 text-center pb-4 px-6">
            GazeTrack only uses your camera locally — no video is ever stored or
            sent anywhere.
          </p>
        </div>
      </div>
    </>
  );
}
