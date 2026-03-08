import { useScrollStory } from "@/hooks/useScrollStory";

const panels = [
  {
    label: "How it works — step 01",
    title: (<>Every chapter.<br />Every class.</>),
    body: "The full NCERT syllabus — Classes 1 through 10 — structured exactly as your school follows it. No hunting, no confusion.",
    sketch: (
      <svg aria-hidden="true" viewBox="0 0 110 64" className="ss-sketch" fill="none">
        {[[4,8,14,48,"#f2740d"],[22,14,14,42,"currentColor"],[40,6,14,50,"currentColor"],[58,18,14,38,"currentColor"],[76,10,14,46,"#f2740d"],[94,22,12,34,"currentColor"]].map(([x,y,w,h,stroke], i) => (
          <rect key={i} x={x as number} y={y as number} width={w as number} height={h as number} rx="1" stroke={stroke as string} strokeWidth={stroke === "#f2740d" ? 0.9 : 0.7} />
        ))}
        <line x1="2" y1="58" x2="108" y2="58" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
        <text x="6" y="62" fontFamily="Courier Prime,monospace" fontSize="4.5" fill="currentColor" opacity="0.5">cl.1</text>
        <text x="78" y="62" fontFamily="Courier Prime,monospace" fontSize="4.5" fill="currentColor" opacity="0.5">cl.10</text>
      </svg>
    ),
    overlay: { badge: "01", heading: "Pick your subject.", body: "Maths, Science, History, English — every NCERT chapter from Class 1 to 10, organised the way your textbook is." },
  },
  {
    label: "How it works — step 02",
    title: (<>See it.<br />Understand it.</>),
    body: "Photosynthesis, the water cycle, Pythagoras — illustrated with diagrams and step-by-step breakdowns you can actually follow.",
    sketch: (
      <svg aria-hidden="true" viewBox="0 0 110 72" className="ss-sketch" fill="none">
        <circle cx="55" cy="32" r="18" stroke="#f2740d" strokeWidth="0.9" />
        <path d="M47 50 L47 58 Q55 64 63 58 L63 50 Z" stroke="currentColor" strokeWidth="0.7" />
        <line x1="55" y1="4" x2="55" y2="10" stroke="currentColor" strokeWidth="0.7" />
        <line x1="29" y1="32" x2="23" y2="32" stroke="currentColor" strokeWidth="0.7" />
        <line x1="81" y1="32" x2="87" y2="32" stroke="currentColor" strokeWidth="0.7" />
        <text x="38" y="70" fontFamily="Courier Prime,monospace" fontSize="4.5" fill="currentColor" opacity="0.5">visual learning</text>
      </svg>
    ),
    overlay: { badge: "02", heading: "Watch it come alive.", body: "Concepts explained through diagrams, animations and worked examples — not walls of text." },
  },
  {
    label: "How it works — step 03",
    title: (<>Practice.<br />No pressure.</>),
    body: "Quizzes that feel like a conversation. Instant hints, not just \"wrong — try again.\" Build confidence one question at a time.",
    sketch: (
      <svg aria-hidden="true" viewBox="0 0 110 60" className="ss-sketch" fill="none">
        <rect x="4" y="4" width="10" height="10" rx="1" stroke="#f2740d" strokeWidth="0.9" />
        <path d="M6 9 L8 12 L13 6" stroke="#f2740d" strokeWidth="0.9" />
        <line x1="20" y1="9" x2="96" y2="9" stroke="currentColor" strokeWidth="0.6" />
        <rect x="4" y="22" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="0.7" />
        <line x1="20" y1="27" x2="80" y2="27" stroke="currentColor" strokeWidth="0.6" />
        <rect x="4" y="40" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="0.7" />
        <line x1="20" y1="45" x2="88" y2="45" stroke="currentColor" strokeWidth="0.6" />
        <text x="4" y="58" fontFamily="Courier Prime,monospace" fontSize="4.5" fill="currentColor" opacity="0.5">adaptive quiz</text>
      </svg>
    ),
    overlay: { badge: "03", heading: "Test yourself.", body: "Chapter-end quizzes adapt to where you are. Get it right, move forward. Get it wrong, understand why." },
  },
  {
    label: "How it works — step 04",
    title: (<>Your map.<br />Your pace.</>),
    body: "Every topic you've mastered lights up. See exactly where you are, what's next, and how far you've come.",
    sketch: (
      <svg aria-hidden="true" viewBox="0 0 110 60" className="ss-sketch" fill="none">
        <circle cx="16" cy="30" r="8" stroke="#f2740d" strokeWidth="0.9" />
        <circle cx="44" cy="16" r="8" stroke="#f2740d" strokeWidth="0.9" />
        <circle cx="72" cy="30" r="8" stroke="currentColor" strokeWidth="0.7" strokeDasharray="3 2" />
        <circle cx="96" cy="44" r="8" stroke="currentColor" strokeWidth="0.7" strokeDasharray="3 2" />
        <line x1="24" y1="26" x2="36" y2="20" stroke="#f2740d" strokeWidth="0.7" />
        <line x1="52" y1="20" x2="64" y2="26" stroke="currentColor" strokeWidth="0.6" />
        <line x1="80" y1="34" x2="88" y2="40" stroke="currentColor" strokeWidth="0.6" />
      </svg>
    ),
    overlay: { badge: "04", heading: "Track your growth.", body: "Your progress map shows every topic mastered, every concept still to explore — at a glance." },
  },
];

export function ScrollStory() {
  useScrollStory("how-it-works");

  return (
    <section id="how-it-works" className="scroll-story">
      <div className="scroll-story__sticky">
        {/* Left: canvas + overlays */}
        <div className="scroll-story__visual" id="ss-visual">
          <canvas id="ss-canvas" />
          {panels.map((panel, i) => (
            <div key={i} className={`ss-overlay${i === 0 ? " active" : ""}`} id={`ss-ov-${i + 1}`}>
              <div className="ss-badge">{panel.overlay.badge}</div>
              <h3 className="ss-heading">{panel.overlay.heading}</h3>
              <p className="ss-body">{panel.overlay.body}</p>
            </div>
          ))}
          <div className="ss-dots" aria-hidden="true">
            {panels.map((_, i) => (
              <span key={i} className={`ss-dot${i === 0 ? " active" : ""}`} data-step={i} />
            ))}
          </div>
        </div>

        {/* Right: scroll panels */}
        <div className="scroll-story__panels">
          {panels.map((panel, i) => (
            <div key={i} className={`ss-panel${i === 0 ? " active" : ""}`} data-step={i}>
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
