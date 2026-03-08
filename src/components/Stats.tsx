const stats = [
  { value: "12k+", label: "Students", rotate: "-0.5deg" },
  { value: "340+", label: "Institutions", rotate: "0.4deg" },
  { value: "98%", label: "Satisfaction", rotate: "-0.3deg" },
  { value: "4yr", label: "Track Record", rotate: "0.6deg" },
];

export function Stats() {
  return (
    <section style={{ position: "relative", zIndex: 10, padding: "5rem 1.5rem", background: "rgba(13, 15, 23, 0.45)" }} className="hatch">
      <div className="container">
        <div aria-hidden="true" style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.5rem", opacity: 0.45, pointerEvents: "none" }}>
          <svg viewBox="0 0 120 40" style={{ width: 180, height: 60 }} fill="none">
            <line x1="4" y1="34" x2="116" y2="34" stroke="#8a8d9a" strokeWidth="0.6" />
            <path d="M4 34 Q20 34 30 30 Q44 14 60 8 Q76 14 90 30 Q100 34 116 34" stroke="#f2740d" strokeWidth="0.9" />
            <line x1="60" y1="8" x2="60" y2="34" stroke="#8a8d9a" strokeWidth="0.5" strokeDasharray="2 2" />
            <text x="56" y="38" fontFamily="Courier Prime,monospace" fontSize="4" fill="#8a8d9a">μ</text>
            <text x="2" y="12" fontFamily="Courier Prime,monospace" fontSize="4" fill="#8a8d9a">normal dist.</text>
          </svg>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "2rem", textAlign: "center" }}>
          {stats.map((stat, i) => (
            <div key={i} className="reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div style={{ fontFamily: '"Caveat", cursive', fontSize: "3.5rem", color: "#ede9df", transform: `rotate(${stat.rotate})`, display: "inline-block" }}>
                {stat.value}
              </div>
              <div style={{ fontFamily: '"Courier Prime", monospace', fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#8a8d9a", opacity: 0.5, marginTop: "0.3rem" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
