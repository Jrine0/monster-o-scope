const cards = [
  {
    annotation: "← core feature",
    number: "01 ───",
    title: "Adaptive Learning",
    body: "Dynamically adjusts curriculum pathways based on individual student performance metrics and learning velocity.",
    sketch: (
      <svg aria-hidden="true" viewBox="0 0 80 36" style={{ width: 110, height: 52, opacity: 0.5, marginBottom: "0.8rem", display: "block" }} fill="none">
        <line x1="4" y1="32" x2="76" y2="32" stroke="#8a8d9a" strokeWidth="0.6" />
        <line x1="4" y1="4" x2="4" y2="32" stroke="#8a8d9a" strokeWidth="0.6" />
        <path d="M4 30 Q20 28 32 20 Q44 12 60 8 Q68 6 76 6" stroke="#f2740d" strokeWidth="0.9" />
        <text x="6" y="35" fontFamily="Courier Prime,monospace" fontSize="4" fill="#8a8d9a">time</text>
      </svg>
    ),
  },
  {
    annotation: "← all-in-one",
    number: "02 ───",
    title: "Unified Dashboard",
    body: "Consolidates attendance, grades, communications, and scheduling into one coherent interface for every stakeholder.",
    sketch: (
      <svg aria-hidden="true" viewBox="0 0 80 40" style={{ width: 110, height: 58, opacity: 0.5, marginBottom: "0.8rem", display: "block" }} fill="none">
        <circle cx="28" cy="20" r="16" stroke="#8a8d9a" strokeWidth="0.7" />
        <circle cx="52" cy="20" r="16" stroke="#f2740d" strokeWidth="0.7" />
        <text x="14" y="22" fontFamily="Courier Prime,monospace" fontSize="4.5" fill="#8a8d9a">A</text>
        <text x="38" y="22" fontFamily="Courier Prime,monospace" fontSize="4.5" fill="#8a8d9a">∩</text>
        <text x="58" y="22" fontFamily="Courier Prime,monospace" fontSize="4.5" fill="#8a8d9a">B</text>
      </svg>
    ),
  },
  {
    annotation: "← data layer",
    number: "03 ───",
    title: "Analytics Engine",
    body: "Deep statistical insight into cohort performance, enabling data-driven pedagogical decisions at institutional scale.",
    sketch: (
      <svg aria-hidden="true" viewBox="0 0 80 40" style={{ width: 110, height: 58, opacity: 0.5, marginBottom: "0.8rem", display: "block" }} fill="none">
        <line x1="4" y1="36" x2="76" y2="36" stroke="#8a8d9a" strokeWidth="0.6" />
        {[[10,22,8,14],[24,14,8,22],[38,8,8,28],[52,18,8,18],[66,26,8,10]].map(([x,y,w,h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} stroke={i === 2 ? "#f2740d" : "#8a8d9a"} strokeWidth={i === 2 ? 0.7 : 0.6} />
        ))}
      </svg>
    ),
  },
];

export function Features() {
  return (
    <section className="features" id="features">
      <div className="container">
        <div style={{ position: "relative" }}>
          {/* Left margin sketch */}
          <div aria-hidden="true" style={{ position: "absolute", left: "-1rem", top: 0, opacity: 0.5, pointerEvents: "none", transform: "rotate(-1.5deg)" }}>
            <svg viewBox="0 0 56 72" style={{ width: 84, height: 108 }} fill="none">
              {/* Periodic table grid */}
              {[
                [1,1],[15,1],[29,1],[43,1],
                [1,15],[15,15],[29,15],[43,15],
                [1,29],[15,29],[29,29],[43,29],
              ].map(([x,y], i) => (
                <rect key={i} x={x} y={y} width="12" height="12" stroke={i === 6 ? "#f2740d" : "#8a8d9a"} strokeWidth={i === 6 ? 0.7 : 0.6} />
              ))}
              {[["H",5,10],["He",19,10],["Li",33,10],["Be",47,10],["B",5,24],["C",19,24],["N",33,24],["O",47,24],["F",5,38],["Ne",18,38],["Na",33,38],["Mg",47,38]].map(([label,x,y], i) => (
                <text key={i} x={x as number} y={y as number} fontFamily="Courier Prime,monospace" fontSize="5" fill={label === "N" ? "#f2740d" : "#8a8d9a"}>{label as string}</text>
              ))}
            </svg>
          </div>

          {/* Right margin sketch */}
          <div aria-hidden="true" style={{ position: "absolute", right: "-1rem", top: 0, opacity: 0.5, pointerEvents: "none", transform: "rotate(1.2deg)" }}>
            <svg viewBox="0 0 64 60" style={{ width: 96, height: 90 }} fill="none">
              <line x1="4" y1="32" x2="60" y2="32" stroke="#8a8d9a" strokeWidth="0.7" />
              <line x1="32" y1="8" x2="32" y2="52" stroke="#8a8d9a" strokeWidth="0.7" />
              <path d="M6 52 Q32 8 58 52" stroke="#f2740d" strokeWidth="0.8" />
              <circle cx="14" cy="32" r="1.5" stroke="#8a8d9a" strokeWidth="0.6" />
              <circle cx="50" cy="32" r="1.5" stroke="#8a8d9a" strokeWidth="0.6" />
              <text x="8" y="44" fontFamily="Courier Prime,monospace" fontSize="4.5" fill="#8a8d9a">α</text>
              <text x="44" y="44" fontFamily="Courier Prime,monospace" fontSize="4.5" fill="#8a8d9a">β</text>
            </svg>
          </div>

          <div className="text-center mb-8 reveal" style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div className="section-label">Section II — Features</div>
            <h2 className="section-title">Built for educators.</h2>
          </div>
        </div>

        {/* Sketch divider */}
        <div className="sketch-divider reveal">
          <div className="line">
            <svg viewBox="0 0 300 8" style={{ width: "100%", height: 8 }} fill="none">
              <path d="M0 4 Q30 2 60 4 Q90 6 120 4 Q150 2 180 4 Q210 6 240 4 Q270 2 300 4" stroke="#ede9df" strokeWidth="1" opacity="0.32" />
            </svg>
          </div>
          <div className="label">feature set α</div>
          <div className="line">
            <svg viewBox="0 0 300 8" style={{ width: "100%", height: 8 }} fill="none">
              <path d="M0 4 Q30 6 60 4 Q90 2 120 4 Q150 6 180 4 Q210 2 240 4 Q270 6 300 4" stroke="#ede9df" strokeWidth="1" opacity="0.32" />
            </svg>
          </div>
        </div>

        {/* Cards */}
        <div className="features-grid">
          {cards.map((card, i) => (
            <div key={i} className="sketch-card relative reveal" style={{ marginTop: "1.5rem", transitionDelay: `${i * 0.12}s` }}>
              <span className="card-annotation">{card.annotation}</span>
              <div className="card-number">{card.number}</div>
              {card.sketch}
              <h3 className="card-title">{card.title}</h3>
              <p className="card-body">{card.body}</p>
              <svg className="card-corner" viewBox="0 0 20 20" width="14" height="14" fill="none" aria-hidden="true">
                <path d="M10 1 L19 10 L10 19 L1 10 Z" stroke="#ede9df" strokeWidth="1" />
              </svg>
            </div>
          ))}
        </div>

        {/* Decorative geometry bar */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "5rem" }} aria-hidden="true">
          <svg viewBox="0 0 600 60" style={{ width: "100%", maxWidth: 480, height: 40, opacity: 0.16 }} fill="none">
            <path d="M0 30 Q150 20 300 30 Q450 40 600 30" stroke="#ede9df" strokeWidth="0.8" />
            <circle cx="300" cy="30" r="5" stroke="#ede9df" strokeWidth="0.8" />
            <circle cx="300" cy="30" r="10" stroke="#ede9df" strokeWidth="0.4" />
            <circle cx="300" cy="30" r="18" stroke="#ede9df" strokeWidth="0.3" strokeDasharray="3 4" />
          </svg>
        </div>
      </div>
    </section>
  );
}
