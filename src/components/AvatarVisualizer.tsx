// src/components/AvatarVisualizer.tsx
// Copied from edactly — no Next.js dependencies, works in Vite as-is.

import { useRef, useEffect } from "react";

export type VisualizerState = "idle" | "thinking" | "speaking";

interface AvatarVisualizerProps {
  state: VisualizerState;
  analyser?: AnalyserNode | null;
}

const NUM_DOTS = 10;
const DOT_SIZE = 5;
const MAX_HEIGHT = 36;
const MIN_HEIGHT = DOT_SIZE;
const GAP = 14;
const THINKING_PERIOD = 900;
const SPEAKING_PERIOD = 600;

export default function AvatarVisualizer({
  state,
  analyser,
}: AvatarVisualizerProps) {
  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(performance.now());
  const fftBuffer = useRef<Uint8Array | null>(null);

  useEffect(() => {
    if (analyser && !fftBuffer.current)
      fftBuffer.current = new Uint8Array(analyser.frequencyBinCount);
  }, [analyser]);

  useEffect(() => {
    startRef.current = performance.now();
    cancelAnimationFrame(rafRef.current);

    const animate = (now: number) => {
      const elapsed = now - startRef.current;
      const dots = dotsRef.current;

      if (state === "idle") {
        dots.forEach((dot, i) => {
          if (!dot) return;
          const phase = (i / NUM_DOTS) * Math.PI * 2;
          const h =
            MIN_HEIGHT +
            ((Math.sin(phase) + 1) / 2) * (MAX_HEIGHT * 0.25 - MIN_HEIGHT);
          dot.style.height = `${h}px`;
          dot.style.opacity = "0.35";
        });
        return;
      }

      if (state === "thinking") {
        dots.forEach((dot, i) => {
          if (!dot) return;
          const phase =
            ((elapsed % THINKING_PERIOD) / THINKING_PERIOD) * Math.PI * 2;
          const offset = (i / NUM_DOTS) * Math.PI * 2;
          const norm = (Math.sin(phase - offset) + 1) / 2;
          const eased =
            norm < 0.5 ? 2 * norm * norm : 1 - Math.pow(-2 * norm + 2, 2) / 2;
          dot.style.height = `${MIN_HEIGHT + eased * (MAX_HEIGHT - MIN_HEIGHT)}px`;
          dot.style.opacity = `${0.5 + eased * 0.5}`;
        });
      }

      if (state === "speaking") {
        if (analyser && fftBuffer.current) {
          analyser.getByteFrequencyData(
            fftBuffer.current as unknown as Uint8Array,
          );
          const binCount = fftBuffer.current.length;
          dots.forEach((dot, i) => {
            if (!dot) return;
            const lo = Math.floor((i / NUM_DOTS) * binCount * 0.5);
            const hi = Math.floor(((i + 1) / NUM_DOTS) * binCount * 0.5);
            let sum = 0;
            for (let b = lo; b < hi; b++) sum += fftBuffer.current![b];
            const norm = sum / (hi - lo) / 255;
            dot.style.height = `${MIN_HEIGHT + norm * (MAX_HEIGHT - MIN_HEIGHT)}px`;
            dot.style.opacity = `${0.6 + norm * 0.4}`;
          });
        } else {
          dots.forEach((dot, i) => {
            if (!dot) return;
            const phase =
              ((elapsed % SPEAKING_PERIOD) / SPEAKING_PERIOD) * Math.PI * 2;
            const norm =
              (Math.sin(phase - (i / NUM_DOTS) * Math.PI * 2) + 1) / 2;
            dot.style.height = `${MIN_HEIGHT + norm * (MAX_HEIGHT - MIN_HEIGHT)}px`;
            dot.style.opacity = `${0.6 + norm * 0.4}`;
          });
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [state, analyser]);

  const dotColor = state !== "idle" ? "bg-chart-3" : "bg-muted-foreground/40";

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="flex items-end justify-center"
        style={{ gap: `${GAP - DOT_SIZE}px`, height: `${MAX_HEIGHT + 4}px` }}
      >
        {Array.from({ length: NUM_DOTS }).map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              dotsRef.current[i] = el;
            }}
            className={`rounded-full transition-colors duration-300 ${dotColor}`}
            style={{
              width: `${DOT_SIZE}px`,
              height: `${MIN_HEIGHT}px`,
              willChange: "height, opacity",
            }}
          />
        ))}
      </div>
      <span className="text-xs font-medium tracking-wide transition-all duration-300 text-muted-foreground">
        {state === "thinking"
          ? "Thinking…"
          : state === "speaking"
            ? "Speaking"
            : "Tutor"}
      </span>
    </div>
  );
}
