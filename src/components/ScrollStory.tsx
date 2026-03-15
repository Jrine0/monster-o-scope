import { useScrollStory } from "@/hooks/useScrollStory";
import { useState, useRef, useEffect, useCallback } from "react";

/* ─────────────────────────────────────────────────────────────────────
   PANELS DATA — unchanged from original
───────────────────────────────────────────────────────────────────── */
const panels = [
  {
    label: "How it works — step 01",
    title: (
      <>
        Every chapter.
        <br />
        Every class.
      </>
    ),
    body: "The full NCERT syllabus — Classes 1 through 10 — structured exactly as your school follows it. No hunting, no confusion.",
    sketch: (
      <svg
        aria-hidden="true"
        viewBox="0 0 110 64"
        className="ss-sketch"
        fill="none"
      >
        {[
          [4, 8, 14, 48, "#f2740d"],
          [22, 14, 14, 42, "currentColor"],
          [40, 6, 14, 50, "currentColor"],
          [58, 18, 14, 38, "currentColor"],
          [76, 10, 14, 46, "#f2740d"],
          [94, 22, 12, 34, "currentColor"],
        ].map(([x, y, w, h, stroke], i) => (
          <rect
            key={i}
            x={x as number}
            y={y as number}
            width={w as number}
            height={h as number}
            rx="1"
            stroke={stroke as string}
            strokeWidth={stroke === "#f2740d" ? 0.9 : 0.7}
          />
        ))}
        <line
          x1="2"
          y1="58"
          x2="108"
          y2="58"
          stroke="currentColor"
          strokeWidth="0.6"
          opacity="0.4"
        />
        <text
          x="6"
          y="62"
          fontFamily="Courier Prime,monospace"
          fontSize="4.5"
          fill="currentColor"
          opacity="0.5"
        >
          cl.1
        </text>
        <text
          x="78"
          y="62"
          fontFamily="Courier Prime,monospace"
          fontSize="4.5"
          fill="currentColor"
          opacity="0.5"
        >
          cl.10
        </text>
      </svg>
    ),
    overlay: {
      badge: "01",
      heading: "Pick your subject.",
      body: "Maths, Science, History, English — every NCERT chapter from Class 1 to 10, organised the way your textbook is.",
    },
  },
  {
    label: "How it works — step 02",
    title: (
      <>
        See it.
        <br />
        Understand it.
      </>
    ),
    body: "Photosynthesis, the water cycle, Pythagoras — illustrated with diagrams and step-by-step breakdowns you can actually follow.",
    sketch: (
      <svg
        aria-hidden="true"
        viewBox="0 0 110 72"
        className="ss-sketch"
        fill="none"
      >
        <circle cx="55" cy="32" r="18" stroke="#f2740d" strokeWidth="0.9" />
        <path
          d="M47 50 L47 58 Q55 64 63 58 L63 50 Z"
          stroke="currentColor"
          strokeWidth="0.7"
        />
        <line
          x1="55"
          y1="4"
          x2="55"
          y2="10"
          stroke="currentColor"
          strokeWidth="0.7"
        />
        <line
          x1="29"
          y1="32"
          x2="23"
          y2="32"
          stroke="currentColor"
          strokeWidth="0.7"
        />
        <line
          x1="81"
          y1="32"
          x2="87"
          y2="32"
          stroke="currentColor"
          strokeWidth="0.7"
        />
        <text
          x="38"
          y="70"
          fontFamily="Courier Prime,monospace"
          fontSize="4.5"
          fill="currentColor"
          opacity="0.5"
        >
          visual learning
        </text>
      </svg>
    ),
    overlay: {
      badge: "02",
      heading: "Watch it come alive.",
      body: "Concepts explained through diagrams, animations and worked examples — not walls of text.",
    },
  },
  {
    label: "How it works — step 03",
    title: (
      <>
        Practice.
        <br />
        No pressure.
      </>
    ),
    body: 'Quizzes that feel like a conversation. Instant hints, not just "wrong — try again." Build confidence one question at a time.',
    sketch: (
      <svg
        aria-hidden="true"
        viewBox="0 0 110 60"
        className="ss-sketch"
        fill="none"
      >
        <rect
          x="4"
          y="4"
          width="10"
          height="10"
          rx="1"
          stroke="#f2740d"
          strokeWidth="0.9"
        />
        <path d="M6 9 L8 12 L13 6" stroke="#f2740d" strokeWidth="0.9" />
        <line
          x1="20"
          y1="9"
          x2="96"
          y2="9"
          stroke="currentColor"
          strokeWidth="0.6"
        />
        <rect
          x="4"
          y="22"
          width="10"
          height="10"
          rx="1"
          stroke="currentColor"
          strokeWidth="0.7"
        />
        <line
          x1="20"
          y1="27"
          x2="80"
          y2="27"
          stroke="currentColor"
          strokeWidth="0.6"
        />
        <rect
          x="4"
          y="40"
          width="10"
          height="10"
          rx="1"
          stroke="currentColor"
          strokeWidth="0.7"
        />
        <line
          x1="20"
          y1="45"
          x2="88"
          y2="45"
          stroke="currentColor"
          strokeWidth="0.6"
        />
        <text
          x="4"
          y="58"
          fontFamily="Courier Prime,monospace"
          fontSize="4.5"
          fill="currentColor"
          opacity="0.5"
        >
          adaptive quiz
        </text>
      </svg>
    ),
    overlay: {
      badge: "03",
      heading: "Test yourself.",
      body: "Chapter-end quizzes adapt to where you are. Get it right, move forward. Get it wrong, understand why.",
    },
  },
  {
    label: "How it works — step 04",
    title: (
      <>
        Your map.
        <br />
        Your pace.
      </>
    ),
    body: "Every topic you've mastered lights up. See exactly where you are, what's next, and how far you've come.",
    sketch: (
      <svg
        aria-hidden="true"
        viewBox="0 0 110 60"
        className="ss-sketch"
        fill="none"
      >
        <circle cx="16" cy="30" r="8" stroke="#f2740d" strokeWidth="0.9" />
        <circle cx="44" cy="16" r="8" stroke="#f2740d" strokeWidth="0.9" />
        <circle
          cx="72"
          cy="30"
          r="8"
          stroke="currentColor"
          strokeWidth="0.7"
          strokeDasharray="3 2"
        />
        <circle
          cx="96"
          cy="44"
          r="8"
          stroke="currentColor"
          strokeWidth="0.7"
          strokeDasharray="3 2"
        />
        <line
          x1="24"
          y1="26"
          x2="36"
          y2="20"
          stroke="#f2740d"
          strokeWidth="0.7"
        />
        <line
          x1="52"
          y1="20"
          x2="64"
          y2="26"
          stroke="currentColor"
          strokeWidth="0.6"
        />
        <line
          x1="80"
          y1="34"
          x2="88"
          y2="40"
          stroke="currentColor"
          strokeWidth="0.6"
        />
      </svg>
    ),
    overlay: {
      badge: "04",
      heading: "Track your growth.",
      body: "Your progress map shows every topic mastered, every concept still to explore — at a glance.",
    },
  },
];

/* ─────────────────────────────────────────────────────────────────────
   useIsMobile — SSR-safe, debounced resize listener
   Returns true when viewport width < 700px.
   Desktop (≥700px) is NEVER affected by this hook's return value.
───────────────────────────────────────────────────────────────────── */
function useIsMobile(breakpoint = 700) {
  const [mobile, setMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false,
  );
  useEffect(() => {
    let raf = 0;
    const fn = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() =>
        setMobile(window.innerWidth < breakpoint),
      );
    };
    window.addEventListener("resize", fn, { passive: true });
    return () => {
      window.removeEventListener("resize", fn);
      cancelAnimationFrame(raf);
    };
  }, [breakpoint]);
  return mobile;
}

/* ─────────────────────────────────────────────────────────────────────
   MOBILE CAROUSEL
   Pure touch/pointer swipe — no scroll hijacking, no sticky position.
   Works with momentum scrolling on iOS (touch-action: pan-y on the page).
───────────────────────────────────────────────────────────────────── */
function MobileCarousel() {
  const [active, setActive] = useState(0);
  const [exiting, setExiting] = useState<number | null>(null); // index of card sliding out
  const [dir, setDir] = useState<"left" | "right">("left"); // direction of travel

  const dragging = useRef(false);
  const lockAxis = useRef<"x" | "y" | null>(null);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const pausedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animating = useRef(false); // block double-fires during transition
  const THRESHOLD = 40;
  const INTERVAL_MS = 2500;
  const ANIM_MS = 420; // must be >= CSS transition duration

  /* ── Navigate to index i, going in direction d ────────────────────
     Wraps infinitely. Sets exiting = current, active = next so CSS
     classes produce the correct slide. On wrap (3→0 or 0→3) we skip
     the transition entirely by leaving exiting=null and just setting
     active, which snaps instantly.
  ─────────────────────────────────────────────────────────────────── */
  const navigate = useCallback(
    (next: number, d: "left" | "right", instant = false) => {
      if (animating.current) return;
      const n = ((next % panels.length) + panels.length) % panels.length;

      if (instant) {
        setExiting(null);
        setActive(n);
        return;
      }

      animating.current = true;
      const cur = activeRef.current; // snapshot before state update
      setDir(d);
      setExiting(cur); // slide cur OUT
      setActive(n); // bring n IN

      setTimeout(() => {
        setExiting(null);
        animating.current = false;
      }, ANIM_MS);
    },
    [],
  );

  /* ── Determine class for each card index ── */
  function cardClass(i: number): string {
    if (i === active && exiting !== i) return "active";
    if (i === exiting) return dir === "left" ? "exit-left" : "exit-right";
    return ""; // off-screen default (translateX right)
  }

  const activeRef = useRef(active);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  /* ── Auto-advance timer ── */
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!pausedRef.current) {
        const cur = activeRef.current;
        const next = (cur + 1) % panels.length;
        const isWrap = cur === panels.length - 1;
        navigate(next, "left", isWrap);
      }
    }, INTERVAL_MS);
  }, [navigate]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  /* ── Pointer / swipe events ── */
  const onPointerDown = (e: React.PointerEvent) => {
    pausedRef.current = true;
    dragging.current = true;
    lockAxis.current = null;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    dragging.current = false;
    lockAxis.current = null;
    pausedRef.current = false;
    startTimer();
    const dx = e.clientX - startXRef.current;
    if (Math.abs(dx) >= THRESHOLD) {
      const d = dx < 0 ? "left" : "right";
      const next = dx < 0 ? active + 1 : active - 1;
      const n = ((next % panels.length) + panels.length) % panels.length;
      const isWrap =
        (dx < 0 && active === panels.length - 1) || (dx > 0 && active === 0);
      navigate(n, d, isWrap);
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = Math.abs(e.clientX - startXRef.current);
    const dy = Math.abs(e.clientY - startYRef.current);
    if (!lockAxis.current && (dx > 4 || dy > 4)) {
      lockAxis.current = dx > dy ? "x" : "y";
    }
    if (lockAxis.current === "x") e.preventDefault();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      const next = (active + 1) % panels.length;
      navigate(next, "left", active === panels.length - 1);
      startTimer();
    }
    if (e.key === "ArrowLeft") {
      const next = (active - 1 + panels.length) % panels.length;
      navigate(next, "right", active === 0);
      startTimer();
    }
  };

  return (
    <section
      id="how-it-works"
      className="ss-mobile-carousel"
      aria-label="How it works"
    >
      {/* Eyebrow */}
      <div className="ss-mobile-eyebrow">
        <div className="eyebrow-rule" />
        <span className="eyebrow-text">How it works</span>
        <div className="eyebrow-rule" />
      </div>

      {/* Swipe region */}
      <div
        className="ss-mobile-track"
        role="region"
        aria-label={`Step ${active + 1} of ${panels.length}`}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerMove={onPointerMove}
        onPointerCancel={() => {
          dragging.current = false;
          lockAxis.current = null;
          pausedRef.current = false;
        }}
        onKeyDown={onKeyDown}
        style={{ touchAction: "pan-y" }}
      >
        {/* Stage — cards are absolutely positioned inside, each centred */}
        <div className="ss-mobile-stage">
          {panels.map((panel, i) => (
            <article
              key={i}
              className={`ss-mobile-card ${cardClass(i)}`}
              aria-hidden={i !== active}
              aria-label={panel.label}
            >
              <div className="ss-badge">{panel.overlay.badge}</div>
              <div className="ss-mobile-sketch-wrap">{panel.sketch}</div>
              <h2 className="ss-panel-title">{panel.title}</h2>
              <p className="ss-panel-body">{panel.body}</p>
            </article>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="ss-mobile-controls" aria-label="Carousel navigation">
        <button
          className="ss-mobile-arrow"
          onClick={() => {
            const n = (active - 1 + panels.length) % panels.length;
            navigate(n, "right", active === 0);
            startTimer();
          }}
          aria-label="Previous step"
        >
          <svg viewBox="0 0 16 16" width="16" fill="none">
            <path
              d="M10 3L5 8l5 5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div
          className="ss-dots"
          style={{
            position: "static",
            transform: "none",
            flexDirection: "row",
            gap: "0.45rem",
          }}
        >
          {panels.map((_, i) => (
            <button
              key={i}
              className={`ss-dot${i === active ? " active" : ""}`}
              onClick={() => {
                navigate(i, i > active ? "left" : "right", false);
                startTimer();
              }}
              aria-label={`Go to step ${i + 1}`}
              aria-current={i === active ? "true" : undefined}
            />
          ))}
        </div>

        <button
          className="ss-mobile-arrow"
          onClick={() => {
            const n = (active + 1) % panels.length;
            navigate(n, "left", active === panels.length - 1);
            startTimer();
          }}
          aria-label="Next step"
        >
          <svg viewBox="0 0 16 16" width="16" fill="none">
            <path
              d="M6 3l5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <p className="ss-mobile-counter" aria-hidden="true">
        {String(active + 1).padStart(2, "0")} /{" "}
        {String(panels.length).padStart(2, "0")}
      </p>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   DESKTOP SCROLL STORY — 100% UNCHANGED from original
───────────────────────────────────────────────────────────────────── */
function DesktopScrollStory() {
  useScrollStory("how-it-works");

  return (
    <section id="how-it-works" className="scroll-story">
      <div className="scroll-story__sticky">
        {/* Left: canvas + overlays */}
        <div className="scroll-story__visual" id="ss-visual">
          <canvas id="ss-canvas" />
          {panels.map((panel, i) => (
            <div
              key={i}
              className={`ss-overlay${i === 0 ? " active" : ""}`}
              id={`ss-ov-${i + 1}`}
            >
              <div className="ss-badge">{panel.overlay.badge}</div>
              <h3 className="ss-heading">{panel.overlay.heading}</h3>
              <p className="ss-body">{panel.overlay.body}</p>
            </div>
          ))}
          <div className="ss-dots" aria-hidden="true">
            {panels.map((_, i) => (
              <span
                key={i}
                className={`ss-dot${i === 0 ? " active" : ""}`}
                data-step={i}
              />
            ))}
          </div>
        </div>

        {/* Right: scroll panels */}
        <div className="scroll-story__panels">
          {panels.map((panel, i) => (
            <div
              key={i}
              className={`ss-panel${i === 0 ? " active" : ""}`}
              data-step={i}
            >
              <div className="section-label">{panel.label}</div>
              <h2 className="ss-panel-title">{panel.title}</h2>
              <p className="ss-panel-body">{panel.body}</p>
              {panel.sketch}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   EXPORT — routes to the right component, never mixes the two
───────────────────────────────────────────────────────────────────── */
export function ScrollStory() {
  const isMobile = useIsMobile(700);
  return isMobile ? <MobileCarousel /> : <DesktopScrollStory />;
}
