import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 190;
const SECTION_VH = 280;
const ENTRY_FRACTION = 0.3;
const IMAGE_FOLDER = "/LandingSequence";

function src(i: number) {
  return `${IMAGE_FOLDER}/ezgif-frame-${String(i + 1).padStart(3, "0")}.png`;
}

const PANELS = [
  {
    frames: [58, 90] as [number, number],
    side: "left" as const,
    eyebrow: "Adaptive learning",
    headline: "Knows when to slow down before you do.",
    body: "Every session adjusts in real time — finding the gaps before the exam does.",
    tag: "fig. A — adaptive engine",
    stat: "94%",
    statLabel: "say it helped",
  },
  {
    frames: [91, 122] as [number, number],
    side: "right" as const,
    eyebrow: "38 subjects covered",
    headline: "From alphabets to algorithms.",
    body: "Maths, Science, English, History and every subject in between. Class 1 through 12.",
    tag: "fig. B — content depth",
    stat: "38",
    statLabel: "subjects",
  },
  {
    frames: [123, 155] as [number, number],
    side: "left" as const,
    eyebrow: "Works everywhere",
    headline: "Download Sunday. Learn all week without signal.",
    body: "Browser, tablet, phone. Offline or 3G. Built for slow connections and fast minds.",
    tag: "fig. C — accessibility",
    stat: "190+",
    statLabel: "countries",
  },
  {
    frames: [156, 189] as [number, number],
    side: "right" as const,
    eyebrow: "No dark patterns",
    headline: "We don't bribe kids to learn.",
    body: "No streaks. No guilt. No dopamine tricks. Designed to be closed when the lesson's done.",
    tag: "fig. D — philosophy",
    stat: "2.4M+",
    statLabel: "students",
  },
] as const;

// ─── Panel animation ─────────────────────────────────────────────────────────
// Returns { opacity, translateY } based on frame position within the panel window.
// Entry: rises from +40vh → 0 (bottom 30% of window)
// Hold:  sits at 0
// Exit:  floats up to -20vh (top 20% of window)
function panelAnim(
  frames: [number, number],
  f: number,
): { opacity: number; y: number } {
  const [s, e] = frames;
  const total = e - s;
  const entryF = Math.floor(total * 0.3); // 30% = rise-in
  const exitF = Math.floor(total * 0.2); // 20% = float-out

  if (f < s || f > e) return { opacity: 0, y: 40 };

  const pos = f - s;

  // Entry: 0 → entryF — fade in + rise from 40vh
  if (pos <= entryF) {
    const t = pos / entryF;
    // ease out cubic
    const te = 1 - Math.pow(1 - t, 3);
    return { opacity: te, y: 40 * (1 - te) };
  }

  // Exit: last exitF frames — fade out + float up
  if (pos >= total - exitF) {
    const t = (pos - (total - exitF)) / exitF;
    const te = Math.pow(t, 2);
    return { opacity: 1 - te, y: -20 * te };
  }

  // Hold
  return { opacity: 1, y: 0 };
}

// ─── Persistent side annotations — both sides, full sequence ─────────────────
function SideAnnotations({ f }: { f: number }) {
  const t = f / (FRAME_COUNT - 1);
  // annotations appear once the sequence starts (frame 0+) — full visibility
  const vis = Math.min(1, f / 10); // fade in over first 10 frames

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 22,
        pointerEvents: "none",
      }}
    >
      {/* ══════ LEFT SIDE ══════ */}

      {/* L1 — sine wave, top-left */}
      <div
        style={{
          position: "absolute",
          top: "6%",
          left: "2rem",
          opacity: vis * 0.82,
          transform: "rotate(-0.5deg)",
        }}
      >
        <svg
          viewBox="0 0 108 46"
          style={{ width: 140, height: 58 }}
          fill="none"
        >
          <text
            x="0"
            y="11"
            fontFamily="Courier Prime,monospace"
            fontSize="7"
            fill="#ede9df"
            letterSpacing="0.05em"
          >
            y = sin(x)
          </text>
          <path
            d="M0 28 Q10 18 20 28 Q30 38 40 28 Q50 18 60 28 Q70 38 80 28 Q90 18 100 28"
            stroke="#f2740d"
            strokeWidth="1.4"
            opacity="0.9"
          />
          <text
            x="0"
            y="43"
            fontFamily="Courier Prime,monospace"
            fontSize="5.5"
            fill="#8a8d9a"
          >
            amplitude = {(1 + t * 0.5).toFixed(2)}
          </text>
        </svg>
      </div>

      {/* L2 — atom / orbital model, upper-left */}
      <div
        style={{
          position: "absolute",
          top: "19%",
          left: "2rem",
          opacity: vis * (0.62 + t * 0.18),
        }}
      >
        <svg viewBox="0 0 72 72" style={{ width: 92, height: 92 }} fill="none">
          <ellipse
            cx="36"
            cy="36"
            rx="30"
            ry="11"
            stroke="#ede9df"
            strokeWidth="0.9"
          />
          <ellipse
            cx="36"
            cy="36"
            rx="30"
            ry="11"
            stroke="#ede9df"
            strokeWidth="0.9"
            transform="rotate(60 36 36)"
          />
          <ellipse
            cx="36"
            cy="36"
            rx="30"
            ry="11"
            stroke="#ede9df"
            strokeWidth="0.9"
            transform="rotate(120 36 36)"
          />
          <circle cx="36" cy="36" r="4.5" fill="#f2740d" opacity="0.9" />
          <circle cx="36" cy="6" r="2.5" fill="#ede9df" opacity="0.7" />
          <text
            x="0"
            y="70"
            fontFamily="Courier Prime,monospace"
            fontSize="5.5"
            fill="#8a8d9a"
          >
            atomic model
          </text>
        </svg>
      </div>

      {/* L3 — Euler identity, mid-left */}
      <div
        style={{
          position: "absolute",
          top: "42%",
          left: "2rem",
          opacity: vis * (0.75 + t * 0.1),
          transform: "rotate(-1deg)",
        }}
      >
        <svg
          viewBox="0 0 140 50"
          style={{ width: 176, height: 62 }}
          fill="none"
        >
          <text
            x="4"
            y="22"
            fontFamily="Courier Prime,monospace"
            fontSize="17"
            fill="#f2740d"
            fontWeight="bold"
          >
            e^iπ + 1 = 0
          </text>
          <line
            x1="4"
            y1="28"
            x2="118"
            y2="28"
            stroke="#f2740d"
            strokeWidth="0.6"
            opacity="0.4"
          />
          <text
            x="4"
            y="39"
            fontFamily="Courier Prime,monospace"
            fontSize="6"
            fill="#ede9df"
            opacity="0.8"
          >
            Euler's identity
          </text>
          <text
            x="4"
            y="48"
            fontFamily="Courier Prime,monospace"
            fontSize="5"
            fill="#8a8d9a"
            opacity="0.6"
          >
            most beautiful eq.
          </text>
        </svg>
      </div>

      {/* L4 — Pythagorean triangle, lower-left */}
      <div
        style={{
          position: "absolute",
          bottom: "23%",
          left: "2rem",
          opacity: vis * (0.68 + t * 0.1),
          transform: "rotate(-0.8deg)",
        }}
      >
        <svg viewBox="0 0 72 64" style={{ width: 92, height: 80 }} fill="none">
          <path d="M4 60 L4 8 L54 60 Z" stroke="#ede9df" strokeWidth="1.1" />
          <path
            d="M4 44 L10 44 L10 50"
            stroke="#ede9df"
            strokeWidth="0.7"
            fill="none"
          />
          <text
            x="0"
            y="36"
            fontFamily="Courier Prime,monospace"
            fontSize="7"
            fill="#ede9df"
          >
            a
          </text>
          <text
            x="28"
            y="64"
            fontFamily="Courier Prime,monospace"
            fontSize="7"
            fill="#ede9df"
          >
            b
          </text>
          <text
            x="26"
            y="30"
            fontFamily="Courier Prime,monospace"
            fontSize="7"
            fill="#f2740d"
          >
            c
          </text>
          <text
            x="0"
            y="64"
            fontFamily="Courier Prime,monospace"
            fontSize="5.5"
            fill="#8a8d9a"
          >
            a²+b²=c²
          </text>
        </svg>
      </div>

      {/* L5 — Taylor series, bottom-left */}
      <div
        style={{
          position: "absolute",
          bottom: "7%",
          left: "2rem",
          opacity: vis * 0.65,
          transform: "rotate(-1.5deg)",
        }}
      >
        <svg
          viewBox="0 0 128 42"
          style={{ width: 160, height: 52 }}
          fill="none"
        >
          <text
            x="2"
            y="13"
            fontFamily="Courier Prime,monospace"
            fontSize="6.5"
            fill="#ede9df"
          >
            e^x = 1 + x + x²/2!
          </text>
          <text
            x="2"
            y="25"
            fontFamily="Courier Prime,monospace"
            fontSize="6.5"
            fill="#ede9df"
          >
            {" "}
            + x³/3! + …
          </text>
          <line
            x1="2"
            y1="30"
            x2="110"
            y2="30"
            stroke="#f2740d"
            strokeWidth="0.5"
            opacity="0.6"
          />
          <text
            x="2"
            y="39"
            fontFamily="Courier Prime,monospace"
            fontSize="5.5"
            fill="#8a8d9a"
          >
            Taylor series
          </text>
        </svg>
      </div>

      {/* ══════ RIGHT SIDE ══════ */}

      {/* R1 — coordinate scatter, top-right */}
      <div
        style={{
          position: "absolute",
          top: "7%",
          right: "2rem",
          opacity: vis * (0.72 + t * 0.14),
        }}
      >
        <svg viewBox="0 0 72 72" style={{ width: 92, height: 92 }} fill="none">
          <line
            x1="6"
            y1="36"
            x2="66"
            y2="36"
            stroke="#ede9df"
            strokeWidth="0.9"
          />
          <line
            x1="36"
            y1="6"
            x2="36"
            y2="66"
            stroke="#ede9df"
            strokeWidth="0.9"
          />
          <path
            d="M60 31 L67 36 L60 41"
            stroke="#ede9df"
            strokeWidth="0.7"
            fill="none"
          />
          <path
            d="M31 8 L36 2 L41 8"
            stroke="#ede9df"
            strokeWidth="0.7"
            fill="none"
          />
          {(
            [
              [14, 56],
              [22, 44],
              [36, 30],
              [50, 19],
              [58, 13],
            ] as [number, number][]
          ).map(([cx, cy], i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r="2.5"
              fill="#f2740d"
              opacity={0.7 + t * 0.2}
            />
          ))}
          <text
            x="58"
            y="34"
            fontFamily="Courier Prime,monospace"
            fontSize="5.5"
            fill="#8a8d9a"
          >
            x
          </text>
          <text
            x="38"
            y="8"
            fontFamily="Courier Prime,monospace"
            fontSize="5.5"
            fill="#8a8d9a"
          >
            y
          </text>
        </svg>
      </div>

      {/* R2 — golden ratio spiral, upper-right */}
      <div
        style={{
          position: "absolute",
          top: "21%",
          right: "2rem",
          opacity: vis * (0.62 + t * 0.14),
          transform: "rotate(1.5deg)",
        }}
      >
        <svg
          viewBox="0 0 92 92"
          style={{ width: 116, height: 116 }}
          fill="none"
        >
          <rect
            x="4"
            y="4"
            width="84"
            height="84"
            stroke="#ede9df"
            strokeWidth="0.8"
          />
          <rect
            x="4"
            y="4"
            width="52"
            height="52"
            stroke="#ede9df"
            strokeWidth="0.6"
          />
          <rect
            x="4"
            y="56"
            width="32"
            height="32"
            stroke="#ede9df"
            strokeWidth="0.6"
          />
          <rect
            x="36"
            y="56"
            width="20"
            height="20"
            stroke="#f2740d"
            strokeWidth="0.8"
          />
          <path
            d="M88 4 Q88 56 56 56 Q56 88 88 88"
            stroke="#f2740d"
            strokeWidth="1.1"
            fill="none"
          />
          <text
            x="4"
            y="90"
            fontFamily="Courier Prime,monospace"
            fontSize="5.5"
            fill="#8a8d9a"
          >
            φ = 1.618…
          </text>
        </svg>
      </div>

      {/* R3 — Ohm's law circuit, mid-right */}
      <div
        style={{
          position: "absolute",
          top: "44%",
          right: "2rem",
          opacity: vis * (0.72 + t * 0.12),
          transform: "rotate(1deg)",
        }}
      >
        <svg viewBox="0 0 80 58" style={{ width: 100, height: 72 }} fill="none">
          <text
            x="4"
            y="16"
            fontFamily="Courier Prime,monospace"
            fontSize="13"
            fill="#f2740d"
            fontWeight="bold"
          >
            V = IR
          </text>
          <line
            x1="4"
            y1="28"
            x2="20"
            y2="28"
            stroke="#ede9df"
            strokeWidth="0.9"
          />
          <rect
            x="20"
            y="22"
            width="20"
            height="12"
            stroke="#ede9df"
            strokeWidth="0.9"
          />
          <line
            x1="40"
            y1="28"
            x2="72"
            y2="28"
            stroke="#ede9df"
            strokeWidth="0.9"
          />
          <line
            x1="72"
            y1="28"
            x2="72"
            y2="46"
            stroke="#ede9df"
            strokeWidth="0.9"
          />
          <line
            x1="4"
            y1="28"
            x2="4"
            y2="46"
            stroke="#ede9df"
            strokeWidth="0.9"
          />
          <line
            x1="4"
            y1="46"
            x2="72"
            y2="46"
            stroke="#ede9df"
            strokeWidth="0.9"
          />
          <text
            x="20"
            y="57"
            fontFamily="Courier Prime,monospace"
            fontSize="5.5"
            fill="#8a8d9a"
          >
            ohm's law
          </text>
        </svg>
      </div>

      {/* R4 — H₂O molecule, lower-right */}
      <div
        style={{
          position: "absolute",
          bottom: "21%",
          right: "2rem",
          opacity: vis * (0.65 + t * 0.14),
          transform: "rotate(1.2deg)",
        }}
      >
        <svg viewBox="0 0 88 76" style={{ width: 110, height: 95 }} fill="none">
          <circle cx="44" cy="52" r="18" stroke="#f2740d" strokeWidth="1.3" />
          <circle cx="14" cy="24" r="12" stroke="#ede9df" strokeWidth="1.1" />
          <circle cx="74" cy="24" r="12" stroke="#ede9df" strokeWidth="1.1" />
          <line
            x1="44"
            y1="34"
            x2="24"
            y2="30"
            stroke="#ede9df"
            strokeWidth="1.0"
          />
          <line
            x1="44"
            y1="34"
            x2="64"
            y2="30"
            stroke="#ede9df"
            strokeWidth="1.0"
          />
          <text
            x="40"
            y="57"
            fontFamily="Courier Prime,monospace"
            fontSize="8"
            fill="#f2740d"
            fontWeight="bold"
          >
            O
          </text>
          <text
            x="8"
            y="28"
            fontFamily="Courier Prime,monospace"
            fontSize="7.5"
            fill="#ede9df"
          >
            H
          </text>
          <text
            x="68"
            y="28"
            fontFamily="Courier Prime,monospace"
            fontSize="7.5"
            fill="#ede9df"
          >
            H
          </text>
          <text
            x="4"
            y="74"
            fontFamily="Courier Prime,monospace"
            fontSize="5.5"
            fill="#8a8d9a"
          >
            H₂O — 104.5°
          </text>
        </svg>
      </div>

      {/* R5 — integral, bottom-right */}
      <div
        style={{
          position: "absolute",
          bottom: "7%",
          right: "2rem",
          opacity: vis * 0.65,
          transform: "rotate(0.8deg)",
        }}
      >
        <svg
          viewBox="0 0 136 28"
          style={{ width: 170, height: 34 }}
          fill="none"
        >
          <text
            x="4"
            y="20"
            fontFamily="Courier Prime,monospace"
            fontSize="13"
            fill="#ede9df"
          >
            ∫₀^∞ e⁻ˣ dx = 1
          </text>
        </svg>
      </div>

      {/* ══════ SHARED HUD ══════ */}

      {/* Top-center: fig label + wave */}
      <div
        style={{
          position: "absolute",
          top: "1.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          opacity: 0.72,
        }}
      >
        <svg
          viewBox="0 0 200 24"
          style={{ width: 250, height: 30 }}
          fill="none"
        >
          <text
            x="100"
            y="12"
            fontFamily="Courier Prime,monospace"
            fontSize="7"
            fill="#8a8d9a"
            textAnchor="middle"
            letterSpacing="0.1em"
          >
            fig. 2 — product walkthrough
          </text>
          <path
            d="M22 19 Q60 14 100 19 Q140 24 178 19"
            stroke="#f2740d"
            strokeWidth="0.8"
            opacity="0.65"
          />
        </svg>
      </div>

      {/* Top-right: seq counter */}
      <div
        style={{
          position: "absolute",
          top: "1.5rem",
          right: "2rem",
          opacity: 0.68,
        }}
      >
        <svg viewBox="0 0 90 14" style={{ width: 112, height: 18 }} fill="none">
          <text
            x="90"
            y="11"
            fontFamily="Courier Prime,monospace"
            fontSize="6.5"
            fill="#8a8d9a"
            textAnchor="end"
          >
            {`seq. ${String(f + 1).padStart(3, "0")}–190`}
          </text>
        </svg>
      </div>

      {/* Left ruler */}
      <div
        style={{
          position: "absolute",
          left: "0.5rem",
          top: "10%",
          bottom: "10%",
          opacity: 0.55,
        }}
      >
        <svg
          viewBox="0 0 16 200"
          style={{ width: 20, height: "100%" }}
          fill="none"
        >
          {Array.from({ length: 11 }, (_, i) => {
            const y = (i / 10) * 200;
            const lit = t * 10 >= i;
            return (
              <g key={i}>
                <line
                  x1="8"
                  y1={y}
                  x2={i % 5 === 0 ? 16 : 12}
                  y2={y}
                  stroke={lit ? "#f2740d" : "#8a8d9a"}
                  strokeWidth="0.8"
                />
                {i % 5 === 0 && (
                  <text
                    x="1"
                    y={y + 3.5}
                    fontFamily="Courier Prime,monospace"
                    fontSize="4"
                    fill="#8a8d9a"
                  >
                    {i * 10}
                  </text>
                )}
              </g>
            );
          })}
          <circle cx="12" cy={t * 200} r="2.8" fill="#f2740d" opacity="1" />
        </svg>
      </div>

      {/* Bottom-center: frame counter + scroll hint */}
      <div
        style={{
          position: "absolute",
          bottom: "1.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.3rem",
          opacity: 0.72,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
          <span
            style={{
              fontFamily: "Courier Prime,monospace",
              fontSize: "0.62rem",
              color: "#8a8d9a",
              letterSpacing: "0.15em",
            }}
          >
            {String(f + 1).padStart(3, "0")} / {FRAME_COUNT}
          </span>
          <div
            style={{
              width: 72,
              height: 1.5,
              background: "rgba(137,141,154,0.25)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                height: "100%",
                width: `${((f + 1) / FRAME_COUNT) * 100}%`,
                background: "#f2740d",
                transition: "width 0.08s linear",
              }}
            />
          </div>
        </div>
        <svg
          viewBox="0 0 110 12"
          style={{ width: 136, height: 15 }}
          fill="none"
        >
          <text
            x="55"
            y="9"
            fontFamily="Courier Prime,monospace"
            fontSize="5.5"
            fill="#8a8d9a"
            textAnchor="middle"
          >
            {f >= FRAME_COUNT - 4 ? "— end of sequence —" : "keep scrolling ↓"}
          </text>
        </svg>
      </div>

      {/* Bottom-right: triangle */}
      <div
        style={{
          position: "absolute",
          bottom: "6%",
          right: "3.5rem",
          opacity: 0.45 + t * 0.2,
          transform: "rotate(0.5deg)",
        }}
      >
        <svg viewBox="0 0 60 52" style={{ width: 76, height: 65 }} fill="none">
          <path d="M4 48 L30 4 L56 48 Z" stroke="#ede9df" strokeWidth="0.9" />
          <path
            d="M4 48 Q9 42 13 48"
            stroke="#f2740d"
            strokeWidth="0.7"
            fill="none"
          />
          <text
            x="15"
            y="47"
            fontFamily="Courier Prime,monospace"
            fontSize="5.5"
            fill="#8a8d9a"
          >
            θ
          </text>
          <text
            x="0"
            y="57"
            fontFamily="Courier Prime,monospace"
            fontSize="4.5"
            fill="#8a8d9a"
            opacity="0.7"
          >
            not to scale
          </text>
        </svg>
      </div>

      {/* Bottom-left: spinning orbital rings */}
      <div
        style={{
          position: "absolute",
          left: "3.5rem",
          bottom: "18%",
          opacity: 0.38 + t * 0.18,
          transform: `rotate(${t * 200}deg)`,
        }}
      >
        <svg viewBox="0 0 68 68" style={{ width: 84, height: 84 }} fill="none">
          <circle
            cx="34"
            cy="34"
            r="30"
            stroke="#ede9df"
            strokeWidth="0.7"
            strokeDasharray="4 8"
          />
          <circle cx="34" cy="34" r="18" stroke="#ede9df" strokeWidth="0.5" />
          <circle cx="34" cy="34" r="7" stroke="#f2740d" strokeWidth="0.8" />
          <circle cx="34" cy="4" r="3" fill="#f2740d" opacity="0.8" />
          <circle cx="64" cy="34" r="2" fill="#ede9df" opacity="0.6" />
        </svg>
      </div>
    </div>
  );
}

// ─── Panel card — pop-up animation driven by panelAnim ───────────────────────
function PanelCard({
  panel,
  f,
}: {
  panel: (typeof PANELS)[number];
  f: number;
}) {
  const { opacity, y } = panelAnim(panel.frames, f);
  if (opacity < 0.01) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        // centre horizontally + vertically, then apply pop-up y offset
        transform: `translate(-50%, calc(-50% + ${y}vh))`,
        width: "min(480px, 52vw)",
        zIndex: 25,
        opacity,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          background: "rgba(7,8,13,0.92)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(237,233,223,0.10)",
          borderTop: "2px solid #f2740d",
          padding: "1.8rem 2.2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.85rem",
          }}
        >
          <div style={{ height: 1, width: 22, background: "#f2740d" }} />
          <span
            style={{
              fontFamily: "Courier Prime,monospace",
              fontSize: "0.6rem",
              color: "#f2740d",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}
          >
            {panel.eyebrow}
          </span>
        </div>
        <h3
          style={{
            fontFamily: "Caveat,cursive",
            fontSize: "1.9rem",
            fontWeight: 700,
            color: "#ede9df",
            lineHeight: 1.15,
            marginBottom: "0.65rem",
          }}
        >
          {panel.headline}
        </h3>
        <p
          style={{
            fontFamily: "Lora,serif",
            fontSize: "0.82rem",
            color: "#8a8d9a",
            lineHeight: 1.65,
            marginBottom: "1.1rem",
          }}
        >
          {panel.body}
        </p>
        <div
          style={{
            borderTop: "1px solid rgba(237,233,223,0.08)",
            paddingTop: "0.85rem",
            display: "flex",
            alignItems: "baseline",
            gap: "0.5rem",
          }}
        >
          <span
            style={{
              fontFamily: "Caveat,cursive",
              fontSize: "2.4rem",
              fontWeight: 700,
              color: "#f2740d",
            }}
          >
            {panel.stat}
          </span>
          <span
            style={{
              fontFamily: "Courier Prime,monospace",
              fontSize: "0.6rem",
              color: "#8a8d9a",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            {panel.statLabel}
          </span>
        </div>
      </div>
      <div style={{ marginTop: "0.45rem", textAlign: "right", opacity: 0.35 }}>
        <span
          style={{
            fontFamily: "Courier Prime,monospace",
            fontSize: "0.55rem",
            color: "#8a8d9a",
          }}
        >
          {panel.tag}
        </span>
      </div>
    </div>
  );
}

function ProgressDots({ f }: { f: number }) {
  return (
    <div
      style={{
        position: "absolute",
        right: "1.1rem",
        top: "50%",
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        gap: "0.45rem",
        zIndex: 30,
        pointerEvents: "none",
      }}
    >
      {PANELS.map((p, i) => {
        const [s, e] = p.frames;
        const active = f >= s && f <= e;
        return (
          <div
            key={i}
            style={{
              width: active ? 7 : 4,
              height: active ? 7 : 4,
              borderRadius: "50%",
              background: active ? "#f2740d" : "rgba(237,233,223,0.3)",
              transition: "all 0.3s ease",
              alignSelf: "center",
            }}
          />
        );
      })}
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────
export function LandingSequence({ className = "" }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const rafRef = useRef<number>(-1);
  const frameRef = useRef(0);
  const [displayFrame, setDisplayFrame] = useState(0);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);

  /* 1. preload */
  useEffect(() => {
    let cancelled = false,
      loaded = 0;
    imagesRef.current = Array(FRAME_COUNT).fill(null);
    const promises = Array.from(
      { length: FRAME_COUNT },
      (_, i) =>
        new Promise<void>((res) => {
          const img = new Image();
          img.src = src(i);
          img.onload = () => {
            if (!cancelled) {
              imagesRef.current[i] = img;
              loaded++;
              setProgress(loaded / FRAME_COUNT);
            }
            res();
          };
          img.onerror = () => res();
        }),
    );
    Promise.all(promises).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  /* 2. draw */
  function draw(index: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const img =
      imagesRef.current[Math.max(0, Math.min(FRAME_COUNT - 1, index))];
    if (!img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const cw = canvas.clientWidth * dpr,
      ch = canvas.clientHeight * dpr;
    if (canvas.width !== cw || canvas.height !== ch) {
      canvas.width = cw;
      canvas.height = ch;
    }
    ctx.clearRect(0, 0, cw, ch);
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const dw = img.naturalWidth * scale,
      dh = img.naturalHeight * scale;
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
  }

  /* 3. scroll → frame */
  useEffect(() => {
    if (!ready) return;
    draw(0);

    function onScroll() {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const sectionTop = wrap.offsetTop;
      const sectionScrollable = wrap.offsetHeight - window.innerHeight;
      if (sectionScrollable <= 0) return;
      const tFull = Math.max(
        0,
        Math.min(1, (window.scrollY - sectionTop) / sectionScrollable),
      );
      const tFrames = Math.max(
        0,
        (tFull - ENTRY_FRACTION) / (1 - ENTRY_FRACTION),
      );
      const frame = Math.min(
        FRAME_COUNT - 1,
        Math.floor(tFrames * FRAME_COUNT),
      );
      if (frame !== frameRef.current) {
        frameRef.current = frame;
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
          draw(frame);
          setDisplayFrame(frame);
        });
      }
    }

    const onResize = () => draw(frameRef.current);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [ready]);

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ position: "relative", height: `${SECTION_VH}vh` }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          background: "#07080d",
        }}
      >
        {/* loading */}
        {!ready && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              zIndex: 40,
            }}
          >
            <svg
              width="52"
              height="52"
              viewBox="0 0 52 52"
              fill="none"
              style={{ transform: "rotate(-90deg)" }}
            >
              <circle
                cx="26"
                cy="26"
                r="22"
                stroke="rgba(242,116,13,0.15)"
                strokeWidth="2"
              />
              <circle
                cx="26"
                cy="26"
                r="22"
                stroke="#f2740d"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 22}`}
                strokeDashoffset={`${2 * Math.PI * 22 * (1 - progress)}`}
                style={{ transition: "stroke-dashoffset 0.1s linear" }}
              />
            </svg>
            <span
              style={{
                fontFamily: "Courier Prime,monospace",
                fontSize: "0.6rem",
                color: "#8a8d9a",
                letterSpacing: "0.2em",
              }}
            >
              loading — {Math.round(progress * 100)}%
            </span>
          </div>
        )}

        {/* canvas — z:1 */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            display: "block",
            opacity: ready ? 1 : 0,
            transition: "opacity 0.5s",
            zIndex: 1,
          }}
        />

        {/* annotations — z:22, always on top of canvas */}
        {ready && <SideAnnotations f={displayFrame} />}

        {/* panel cards — z:25 */}
        {ready &&
          PANELS.map((p, i) => (
            <PanelCard key={i} panel={p} f={displayFrame} />
          ))}

        {/* progress dots — z:30 */}
        {ready && <ProgressDots f={displayFrame} />}
      </div>
    </div>
  );
}
