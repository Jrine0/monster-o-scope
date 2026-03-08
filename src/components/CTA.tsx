export function CTA() {
  return (
    <section className="cta-section hatch" id="cta">
      <div style={{ position: "relative", zIndex: 10 }}>
        {/* DNA helix — left float */}
        <div aria-hidden="true" style={{ position: "absolute", left: "3rem", top: "50%", transform: "translateY(-50%) rotate(-2deg)", opacity: 0.42, pointerEvents: "none" }}>
          <svg viewBox="0 0 28 80" style={{ width: 44, height: 124 }} fill="none">
            <path d="M6 4 Q20 12 6 20 Q20 28 6 36 Q20 44 6 52 Q20 60 6 68 Q20 76 6 80" stroke="#f2740d" strokeWidth="0.8" />
            <path d="M22 4 Q8 12 22 20 Q8 28 22 36 Q8 44 22 52 Q8 60 22 68 Q8 76 22 80" stroke="#8a8d9a" strokeWidth="0.8" />
            {[12, 28, 44, 60].map((y) => (
              <line key={y} x1="6" y1={y} x2="22" y2={y} stroke="#8a8d9a" strokeWidth="0.5" />
            ))}
            <text x="0" y="88" fontFamily="Courier Prime,monospace" fontSize="4" fill="#8a8d9a">DNA</text>
          </svg>
        </div>

        {/* Newton's laws — right float */}
        <div aria-hidden="true" style={{ position: "absolute", right: "3rem", top: "50%", transform: "translateY(-50%) rotate(1.5deg)", opacity: 0.42, pointerEvents: "none", textAlign: "right" }}>
          <svg viewBox="0 0 64 72" style={{ width: 96, height: 108 }} fill="none">
            <text x="4" y="14" fontFamily="Courier Prime,monospace" fontSize="9" fill="#f2740d">F=ma</text>
            <line x1="8" y1="22" x2="56" y2="22" stroke="#8a8d9a" strokeWidth="0.7" />
            <path d="M50 18 L58 22 L50 26" stroke="#8a8d9a" strokeWidth="0.6" fill="none" />
            <rect x="20" y="28" width="24" height="16" stroke="#8a8d9a" strokeWidth="0.6" />
            <text x="26" y="39" fontFamily="Courier Prime,monospace" fontSize="5.5" fill="#8a8d9a">m</text>
            <line x1="4" y1="48" x2="60" y2="48" stroke="#8a8d9a" strokeWidth="0.5" />
            <text x="4" y="60" fontFamily="Courier Prime,monospace" fontSize="4" fill="#8a8d9a">1st law</text>
            <text x="4" y="68" fontFamily="Courier Prime,monospace" fontSize="4" fill="#8a8d9a">inertia</text>
          </svg>
        </div>

        <div className="section-label reveal">Section III — Begin</div>

        <h2 className="cta-title reveal">
          Start learning<br />differently.
        </h2>

        <p className="cta-sub reveal">
          Join thousands of educators and students already transforming their educational experience.
        </p>

        <div className="cta-buttons reveal">
          <a href="#" className="sketch-btn filled" style={{ transform: "rotate(-0.4deg)" }}>Create Free Account</a>
          <a href="#" className="sketch-btn" style={{ transform: "rotate(0.3deg)" }}>Schedule a Call</a>
        </div>

        <div className="cta-logo-rule reveal" aria-hidden="true">
          <svg viewBox="0 0 60 12" style={{ width: 60, height: 12 }} fill="none">
            <path d="M0 6 L52 6 M46 2 L56 6 L46 10" stroke="#ede9df" strokeWidth="0.9" />
          </svg>
          <span>schoolme</span>
          <svg viewBox="0 0 60 12" style={{ width: 60, height: 12, transform: "scaleX(-1)" }} fill="none">
            <path d="M0 6 L52 6 M46 2 L56 6 L46 10" stroke="#ede9df" strokeWidth="0.9" />
          </svg>
        </div>
      </div>
    </section>
  );
}
