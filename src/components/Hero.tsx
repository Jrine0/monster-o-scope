import { LandingSequence } from "./LandingSequence";
import { useSketchBtn } from "../hooks/useSketchBtn";

export function Hero() {
  // Attach kaleidoscope hover to both .sketch-btn elements after mount
  useSketchBtn([]);

  return (
    <>
      {/* ── Above-fold hero ─────────────────────────────── */}
      <section className="hero grid-paper">
        {/* Ruler marks */}
        <div className="ruler" aria-hidden="true">
          {[
            { w: 16, label: "0" },
            { w: 8 },
            { w: 8 },
            { w: 8 },
            { w: 16, label: "50" },
            { w: 8 },
            { w: 8 },
            { w: 8 },
            { w: 16, label: "100" },
          ].map((tick, i) => (
            <div key={i} className="ruler-tick">
              <div
                style={{ width: tick.w, height: 1, background: "#ede9df" }}
              />
              {tick.label && <span>{tick.label}</span>}
            </div>
          ))}
        </div>

        {/* ── Corner annotations ── */}
        <div
          className="corner-annotation ca-tl"
          aria-hidden="true"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            alignItems: "flex-start",
          }}
        >
          <span>fig. 1 — landing</span>
          <svg
            viewBox="0 0 72 18"
            style={{ width: 110, height: 28, opacity: 0.75 }}
            fill="none"
          >
            <path
              d="M0 9 Q9 2 18 9 Q27 16 36 9 Q45 2 54 9 Q63 16 72 9"
              stroke="#f2740d"
              strokeWidth="0.9"
            />
            <text
              x="0"
              y="17"
              fontFamily="Courier Prime,monospace"
              fontSize="5"
              fill="#8a8d9a"
            >
              y = sin(x)
            </text>
          </svg>
        </div>

        <div
          className="corner-annotation ca-tr"
          aria-hidden="true"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            alignItems: "flex-end",
          }}
        >
          <span>rev. 01</span>
          <svg
            viewBox="0 0 52 40"
            style={{ width: 80, height: 60, opacity: 0.65 }}
            fill="none"
          >
            <line
              x1="4"
              y1="36"
              x2="48"
              y2="36"
              stroke="#8a8d9a"
              strokeWidth="0.7"
            />
            <line
              x1="26"
              y1="4"
              x2="26"
              y2="38"
              stroke="#8a8d9a"
              strokeWidth="0.7"
            />
            <path d="M8 36 Q26 4 44 36" stroke="#f2740d" strokeWidth="0.9" />
            <text
              x="28"
              y="12"
              fontFamily="Courier Prime,monospace"
              fontSize="5"
              fill="#8a8d9a"
            >
              y=x²
            </text>
          </svg>
        </div>

        <div
          className="corner-annotation ca-bl"
          aria-hidden="true"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            alignItems: "flex-start",
          }}
        >
          <span>schoolme / edu platform</span>
          <svg
            viewBox="0 0 52 32"
            style={{ width: 80, height: 50, opacity: 0.65 }}
            fill="none"
          >
            <ellipse
              cx="26"
              cy="16"
              rx="22"
              ry="8"
              stroke="#8a8d9a"
              strokeWidth="0.6"
            />
            <ellipse
              cx="26"
              cy="16"
              rx="22"
              ry="8"
              stroke="#8a8d9a"
              strokeWidth="0.6"
              transform="rotate(60 26 16)"
            />
            <ellipse
              cx="26"
              cy="16"
              rx="22"
              ry="8"
              stroke="#8a8d9a"
              strokeWidth="0.6"
              transform="rotate(120 26 16)"
            />
            <circle
              cx="26"
              cy="16"
              r="2.5"
              stroke="#f2740d"
              strokeWidth="0.7"
            />
            <circle cx="48" cy="16" r="1.2" fill="#8a8d9a" opacity="0.6" />
          </svg>
        </div>

        <div
          className="corner-annotation ca-br"
          aria-hidden="true"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            alignItems: "flex-end",
          }}
        >
          <span
            style={{
              fontFamily: '"Courier Prime", monospace',
              fontSize: "0.65rem",
              letterSpacing: "0.15em",
            }}
          >
            ◦ ◦ ◦ ◦ ◦
          </span>
          <svg
            viewBox="0 0 48 36"
            style={{ width: 74, height: 56, opacity: 0.65 }}
            fill="none"
          >
            <path d="M4 32 L24 4 L44 32 Z" stroke="#8a8d9a" strokeWidth="0.7" />
            <path
              d="M4 32 Q8 28 10 32"
              stroke="#f2740d"
              strokeWidth="0.6"
              fill="none"
            />
            <path
              d="M44 32 Q40 28 38 32"
              stroke="#8a8d9a"
              strokeWidth="0.5"
              fill="none"
            />
            <text
              x="16"
              y="30"
              fontFamily="Courier Prime,monospace"
              fontSize="4.5"
              fill="#8a8d9a"
            >
              180°
            </text>
          </svg>
        </div>

        {/* ── Scattered math annotations ── */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "3rem",
            top: "38%",
            opacity: 0.28,
            transform: "rotate(-1.5deg)",
            pointerEvents: "none",
          }}
        >
          <svg
            viewBox="0 0 120 44"
            style={{ width: 150, height: 55 }}
            fill="none"
          >
            <text
              x="4"
              y="18"
              fontFamily="Courier Prime,monospace"
              fontSize="13"
              fill="#f2740d"
            >
              e^iπ + 1 = 0
            </text>
            <text
              x="4"
              y="32"
              fontFamily="Courier Prime,monospace"
              fontSize="4.5"
              fill="#8a8d9a"
            >
              Euler's identity
            </text>
            <line
              x1="4"
              y1="36"
              x2="96"
              y2="36"
              stroke="#8a8d9a"
              strokeWidth="0.4"
              opacity="0.5"
            />
            <text
              x="4"
              y="43"
              fontFamily="Courier Prime,monospace"
              fontSize="4"
              fill="#8a8d9a"
              opacity="0.6"
            >
              most beautiful equation
            </text>
          </svg>
        </div>

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: "3rem",
            top: "35%",
            opacity: 0.28,
            transform: "rotate(1.8deg)",
            pointerEvents: "none",
          }}
        >
          <svg
            viewBox="0 0 80 80"
            style={{ width: 100, height: 100 }}
            fill="none"
          >
            <rect
              x="4"
              y="4"
              width="72"
              height="72"
              stroke="#8a8d9a"
              strokeWidth="0.5"
            />
            <rect
              x="4"
              y="4"
              width="44"
              height="44"
              stroke="#8a8d9a"
              strokeWidth="0.4"
            />
            <rect
              x="4"
              y="48"
              width="28"
              height="28"
              stroke="#8a8d9a"
              strokeWidth="0.4"
            />
            <rect
              x="32"
              y="48"
              width="16"
              height="16"
              stroke="#f2740d"
              strokeWidth="0.5"
            />
            <path
              d="M76 4 Q76 48 48 48 Q48 76 76 76"
              stroke="#f2740d"
              strokeWidth="0.7"
              fill="none"
            />
            <text
              x="4"
              y="78"
              fontFamily="Courier Prime,monospace"
              fontSize="4.5"
              fill="#8a8d9a"
            >
              phi = 1.618
            </text>
          </svg>
        </div>

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "1rem",
            top: "22%",
            opacity: 0.18,
            transform: "rotate(-2deg)",
            pointerEvents: "none",
          }}
        >
          <svg
            viewBox="0 0 100 40"
            style={{ width: 120, height: 48 }}
            fill="none"
          >
            <text
              x="2"
              y="12"
              fontFamily="Courier Prime,monospace"
              fontSize="5"
              fill="#8a8d9a"
            >
              e^x = 1 + x + x^2/2!
            </text>
            <text
              x="2"
              y="22"
              fontFamily="Courier Prime,monospace"
              fontSize="5"
              fill="#8a8d9a"
            >
              {" "}
              + x^3/3! + ...
            </text>
            <line
              x1="2"
              y1="26"
              x2="90"
              y2="26"
              stroke="#f2740d"
              strokeWidth="0.4"
              opacity="0.6"
            />
            <text
              x="2"
              y="35"
              fontFamily="Courier Prime,monospace"
              fontSize="4"
              fill="#8a8d9a"
              opacity="0.7"
            >
              Taylor series
            </text>
          </svg>
        </div>

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: "1rem",
            top: "24%",
            opacity: 0.2,
            transform: "rotate(1.5deg)",
            pointerEvents: "none",
          }}
        >
          <svg
            viewBox="0 0 60 60"
            style={{ width: 76, height: 76 }}
            fill="none"
          >
            <line
              x1="4"
              y1="30"
              x2="56"
              y2="30"
              stroke="#8a8d9a"
              strokeWidth="0.6"
            />
            <line
              x1="30"
              y1="4"
              x2="30"
              y2="56"
              stroke="#8a8d9a"
              strokeWidth="0.6"
            />
            <path
              d="M50 26 L56 30 L50 34"
              stroke="#8a8d9a"
              strokeWidth="0.5"
              fill="none"
            />
            <path
              d="M26 6 L30 2 L34 6"
              stroke="#8a8d9a"
              strokeWidth="0.5"
              fill="none"
            />
            <circle cx="14" cy="44" r="1.5" fill="#f2740d" opacity="0.7" />
            <circle cx="22" cy="34" r="1.5" fill="#f2740d" opacity="0.7" />
            <circle cx="34" cy="22" r="1.5" fill="#f2740d" opacity="0.7" />
            <circle cx="42" cy="14" r="1.5" fill="#f2740d" opacity="0.7" />
            <circle cx="46" cy="10" r="1.5" fill="#f2740d" opacity="0.7" />
            <text
              x="52"
              y="28"
              fontFamily="Courier Prime,monospace"
              fontSize="4"
              fill="#8a8d9a"
            >
              x
            </text>
            <text
              x="32"
              y="6"
              fontFamily="Courier Prime,monospace"
              fontSize="4"
              fill="#8a8d9a"
            >
              y
            </text>
          </svg>
        </div>

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "2.5rem",
            top: "62%",
            opacity: 0.32,
            transform: "rotate(-1deg)",
            pointerEvents: "none",
          }}
        >
          <svg
            viewBox="0 0 64 56"
            style={{ width: 88, height: 76 }}
            fill="none"
          >
            <path d="M4 52 L4 12 L44 52 Z" stroke="#8a8d9a" strokeWidth="0.7" />
            <path
              d="M4 40 L8 40 L8 44"
              stroke="#8a8d9a"
              strokeWidth="0.5"
              fill="none"
            />
            <text
              x="0"
              y="34"
              fontFamily="Courier Prime,monospace"
              fontSize="5"
              fill="#8a8d9a"
            >
              a
            </text>
            <text
              x="22"
              y="56"
              fontFamily="Courier Prime,monospace"
              fontSize="5"
              fill="#8a8d9a"
            >
              b
            </text>
            <text
              x="22"
              y="28"
              fontFamily="Courier Prime,monospace"
              fontSize="5"
              fill="#f2740d"
            >
              c
            </text>
            <text
              x="0"
              y="56"
              fontFamily="Courier Prime,monospace"
              fontSize="4"
              fill="#8a8d9a"
            >
              a²+b²=c²
            </text>
          </svg>
        </div>

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: "2.5rem",
            top: "60%",
            opacity: 0.32,
            transform: "rotate(1.2deg)",
            pointerEvents: "none",
          }}
        >
          <svg
            viewBox="0 0 64 44"
            style={{ width: 96, height: 66 }}
            fill="none"
          >
            <text
              x="4"
              y="12"
              fontFamily="Courier Prime,monospace"
              fontSize="7"
              fill="#f2740d"
            >
              V=IR
            </text>
            <line
              x1="4"
              y1="20"
              x2="16"
              y2="20"
              stroke="#8a8d9a"
              strokeWidth="0.6"
            />
            <rect
              x="16"
              y="16"
              width="16"
              height="8"
              stroke="#8a8d9a"
              strokeWidth="0.6"
            />
            <line
              x1="32"
              y1="20"
              x2="60"
              y2="20"
              stroke="#8a8d9a"
              strokeWidth="0.6"
            />
            <line
              x1="60"
              y1="20"
              x2="60"
              y2="34"
              stroke="#8a8d9a"
              strokeWidth="0.6"
            />
            <line
              x1="4"
              y1="20"
              x2="4"
              y2="34"
              stroke="#8a8d9a"
              strokeWidth="0.6"
            />
            <line
              x1="4"
              y1="34"
              x2="60"
              y2="34"
              stroke="#8a8d9a"
              strokeWidth="0.6"
            />
            <text
              x="20"
              y="42"
              fontFamily="Courier Prime,monospace"
              fontSize="4"
              fill="#8a8d9a"
            >
              circuit
            </text>
          </svg>
        </div>

        {/* ── Hero content ── */}
        <div className="hero-content">
          <div className="hero-eyebrow anim-up-0">
            <div className="eyebrow-rule" />
            <span className="eyebrow-text">Learning, for every kid</span>
            <div className="eyebrow-rule" />
          </div>

          <h1 className="hero-title anim-up-1" data-text="Schoolme">
            Schoolme
          </h1>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "2rem",
            }}
            className="anim-up-1"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 320 12"
              style={{ width: 250, height: 12 }}
              fill="none"
            >
              <path
                d="M0 7 Q20 4 40 7 Q60 10 80 6 Q100 3 120 7 Q140 10 160 6 Q180 3 200 7 Q220 10 240 6 Q260 3 280 7 Q300 10 320 6"
                stroke="rgba(242,116,13,0.6)"
                strokeWidth="1.4"
                opacity="0.42"
              />
              <path
                d="M0 8.5 Q20 6 40 8.5 Q60 11 80 8 Q100 5 120 8.5 Q140 11.5 160 8 Q180 5 200 8.5 Q220 11.5 240 8 Q260 5 280 8.5 Q300 11.5 320 8"
                stroke="#ede9df"
                strokeWidth="0.5"
                opacity="0.18"
              />
            </svg>
          </div>

          <p className="hero-subtitle anim-up-2">
            Every subject. Every chapter. Taught the way kids actually learn.
          </p>

          <div className="hero-buttons anim-up-2">
            <a href="#cta" className="sketch-btn filled">
              Get Started
            </a>
            <a
              href="#features"
              className="sketch-btn"
              style={{ transform: "rotate(0.6deg)" }}
            >
              View Demo
            </a>
          </div>

          <div className="scroll-hint anim-up-3" aria-hidden="true">
            <span className="annotation" style={{ fontSize: "0.75rem" }}>
              scroll to explore
            </span>
            <svg
              viewBox="0 0 24 32"
              style={{ width: 18, height: 26 }}
              fill="none"
            >
              <path
                d="M12 2 L12 28 M6 22 L12 30 L18 22"
                stroke="#8a8d9a"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* ── Full-width scroll-driven sequence ───────────────
           Mirrors the LogisticsScroll layout from the reference:
           fixed canvas that spans 100vw × 100vh, pinned for
           scrollStart → scrollEnd of the total page height.      ── */}
      <div
        style={{
          position: "relative",
          height: "300vh", // pin duration — tune to taste
          zIndex: 1,
        }}
      >
        {/* Sticky container — canvas is always full-viewport */}
        <div
          style={{
            position: "sticky",
            top: 0,
            width: "100vw",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          {/* Corner annotation — top-left */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "1.5rem",
              left: "2rem",
              zIndex: 10,
              pointerEvents: "none",
              opacity: 0.5,
            }}
          >
            <svg
              viewBox="0 0 90 18"
              style={{ width: 130, height: 26 }}
              fill="none"
            >
              <text
                x="0"
                y="13"
                fontFamily="Courier Prime,monospace"
                fontSize="5"
                fill="#8a8d9a"
              >
                fig. 2 — product walkthrough
              </text>
              <line
                x1="0"
                y1="16"
                x2="80"
                y2="16"
                stroke="#f2740d"
                strokeWidth="0.4"
              />
            </svg>
          </div>

          {/* Corner annotation — top-right */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "1.5rem",
              right: "2rem",
              zIndex: 10,
              pointerEvents: "none",
              opacity: 0.4,
              textAlign: "right",
            }}
          >
            <svg
              viewBox="0 0 60 18"
              style={{ width: 90, height: 26 }}
              fill="none"
            >
              <text
                x="60"
                y="13"
                fontFamily="Courier Prime,monospace"
                fontSize="5"
                fill="#8a8d9a"
                textAnchor="end"
              >
                seq. 001–208
              </text>
            </svg>
          </div>

          {/* The sequence canvas — fills the viewport */}
          <LandingSequence />
        </div>
      </div>
    </>
  );
}
