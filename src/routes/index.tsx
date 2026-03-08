import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { ScrollStory } from "@/components/ScrollStory";
import { Stats } from "@/components/Stats";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { useKaleidoscope } from "@/hooks/useKaleidoscope";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  useKaleidoscope("kscope-canvas");
  useScrollReveal();

  // Re-run reveal whenever new elements mount (e.g. after theme change)
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal:not(.visible)");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });

  return (
    <>
      {/* Scroll progress bar */}
      <div id="scroll-progress" className="scroll-progress" />

      {/* Global background kaleidoscope canvas */}
      <canvas
        id="kscope-canvas"
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Page content */}
      <div id="page-content" style={{ position: "relative", zIndex: 10 }}>
        <Nav />
        <Hero />

        {/* Transition band */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            padding: "3rem 0",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.9rem",
            background: "rgba(13, 15, 23, 0.45)",
          }}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 800 32"
            style={{ width: "100%", maxWidth: 700, height: 28, opacity: 0.18 }}
            fill="none"
          >
            <path
              d="M0 16 Q100 8 200 16 Q300 24 400 16 Q500 8 600 16 Q700 24 800 16"
              stroke="#ede9df"
              strokeWidth="0.8"
            />
            <circle cx="200" cy="16" r="3" stroke="#ede9df" strokeWidth="0.7" />
            <circle cx="400" cy="16" r="5" stroke="#ede9df" strokeWidth="0.7" />
            <circle cx="600" cy="16" r="3" stroke="#ede9df" strokeWidth="0.7" />
          </svg>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              opacity: 0.42,
            }}
          >
            <div style={{ width: 28, height: "1px", background: "#f2740d" }} />
            <span
              style={{
                fontFamily: "Courier Prime, monospace",
                fontSize: "0.65rem",
                color: "#ede9df",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
              }}
            >
              explore beyond
            </span>
            <div style={{ width: 28, height: "1px", background: "#f2740d" }} />
          </div>
        </div>

        {/* ── Floating margin annotations between hero and features ── */}
        <div
          aria-hidden="true"
          style={{
            position: "relative",
            height: 0,
            overflow: "visible",
            pointerEvents: "none",
            zIndex: 5,
          }}
        >
          {/* Left: Pythagorean theorem */}
          <div
            style={{
              position: "absolute",
              left: "2.5rem",
              top: "-4rem",
              opacity: 0.45,
              transform: "rotate(-1deg)",
            }}
          >
            <svg
              viewBox="0 0 60 52"
              style={{ width: 88, height: 76 }}
              fill="none"
            >
              <path
                d="M4 48 L4 8 L44 48 Z"
                stroke="#8a8d9a"
                strokeWidth="0.7"
              />
              <path
                d="M4 36 L8 36 L8 40"
                stroke="#8a8d9a"
                strokeWidth="0.5"
                fill="none"
              />
              <text
                x="0"
                y="30"
                fontFamily="Courier Prime,monospace"
                fontSize="5"
                fill="#8a8d9a"
              >
                a
              </text>
              <text
                x="22"
                y="52"
                fontFamily="Courier Prime,monospace"
                fontSize="5"
                fill="#8a8d9a"
              >
                b
              </text>
              <text
                x="22"
                y="26"
                fontFamily="Courier Prime,monospace"
                fontSize="5"
                fill="#f2740d"
              >
                c
              </text>
              <text
                x="0"
                y="52"
                fontFamily="Courier Prime,monospace"
                fontSize="4"
                fill="#8a8d9a"
              >
                a²+b²=c²
              </text>
            </svg>
          </div>
          {/* Right: Ohm's law */}
          <div
            style={{
              position: "absolute",
              right: "2.5rem",
              top: "-4rem",
              opacity: 0.45,
              transform: "rotate(1.2deg)",
              textAlign: "right",
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
        </div>

        {/* ── Extra scatter: H2O + cell diagram ── */}
        <div
          aria-hidden="true"
          style={{
            position: "relative",
            height: 0,
            overflow: "visible",
            pointerEvents: "none",
            zIndex: 5,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "1.5rem",
              top: "2rem",
              opacity: 0.3,
              transform: "rotate(-2deg)",
            }}
          >
            <svg
              viewBox="0 0 80 64"
              style={{ width: 80, height: 64 }}
              fill="none"
            >
              <circle
                cx="40"
                cy="44"
                r="12"
                stroke="#f2740d"
                strokeWidth="0.9"
              />
              <circle
                cx="16"
                cy="22"
                r="8"
                stroke="#8a8d9a"
                strokeWidth="0.8"
              />
              <circle
                cx="64"
                cy="22"
                r="8"
                stroke="#8a8d9a"
                strokeWidth="0.8"
              />
              <line
                x1="40"
                y1="33"
                x2="22"
                y2="28"
                stroke="#8a8d9a"
                strokeWidth="0.7"
              />
              <line
                x1="40"
                y1="33"
                x2="58"
                y2="28"
                stroke="#8a8d9a"
                strokeWidth="0.7"
              />
              <text
                x="35"
                y="48"
                fontFamily="Courier Prime,monospace"
                fontSize="6"
                fill="#f2740d"
              >
                O
              </text>
              <text
                x="10"
                y="25"
                fontFamily="Courier Prime,monospace"
                fontSize="5.5"
                fill="#8a8d9a"
              >
                H
              </text>
              <text
                x="58"
                y="25"
                fontFamily="Courier Prime,monospace"
                fontSize="5.5"
                fill="#8a8d9a"
              >
                H
              </text>
              <text
                x="14"
                y="62"
                fontFamily="Courier Prime,monospace"
                fontSize="4.5"
                fill="#8a8d9a"
              >
                H2O — 104.5°
              </text>
            </svg>
          </div>
          <div
            style={{
              position: "absolute",
              right: "1.5rem",
              top: "2rem",
              opacity: 0.3,
              transform: "rotate(1.8deg)",
            }}
          >
            <svg
              viewBox="0 0 90 70"
              style={{ width: 90, height: 70 }}
              fill="none"
            >
              <ellipse
                cx="45"
                cy="35"
                rx="40"
                ry="28"
                stroke="#8a8d9a"
                strokeWidth="0.8"
              />
              <ellipse
                cx="45"
                cy="35"
                rx="14"
                ry="10"
                stroke="#f2740d"
                strokeWidth="0.8"
              />
              <ellipse
                cx="22"
                cy="26"
                rx="5"
                ry="3"
                stroke="#8a8d9a"
                strokeWidth="0.5"
              />
              <ellipse
                cx="68"
                cy="42"
                rx="6"
                ry="3"
                stroke="#8a8d9a"
                strokeWidth="0.5"
              />
              <text
                x="38"
                y="38"
                fontFamily="Courier Prime,monospace"
                fontSize="4.5"
                fill="#f2740d"
              >
                nucleus
              </text>
              <text
                x="2"
                y="68"
                fontFamily="Courier Prime,monospace"
                fontSize="4"
                fill="#8a8d9a"
              >
                animal cell — class 9
              </text>
            </svg>
          </div>
        </div>

        <Features />
        <ScrollStory />
        <Stats />
        <CTA />
        <Footer />
      </div>
    </>
  );
}
