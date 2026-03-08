export function Footer() {
  return (
    <footer>
      <div className="footer-row">
        <span className="footer-logo">Schoolme</span>
        <span className="annotation" style={{ opacity: 0.26, fontSize: "0.75rem" }}>◇ education management platform ◇</span>
        <span className="footer-copy">© 2025</span>
      </div>
      <div aria-hidden="true">
        <svg viewBox="0 0 400 16" style={{ width: 260, height: 14, opacity: 0.13 }} fill="none">
          <path d="M0 8 L175 8 M225 8 L400 8" stroke="#ede9df" strokeWidth="0.8" />
          <polygon points="200,3 208,8 200,13 192,8" stroke="#ede9df" strokeWidth="0.8" />
        </svg>
      </div>
    </footer>
  );
}
