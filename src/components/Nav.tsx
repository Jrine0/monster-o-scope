import { useTheme } from "next-themes";
import { useNavScroll } from "@/hooks/useNavScroll";

export function Nav() {
  const { scrolled, navState } = useNavScroll();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  return (
    <nav
      id="main-nav"
      className={[
        "main-nav",
        scrolled ? "scrolled" : "",
        navState === "hidden" ? "nav-hidden" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <a href="#" className="nav-logo">
        SchoolMe
      </a>

      <div className="nav-links">
        <a href="#features">Platform</a>
        <a href="#features">Features</a>
        <a href="#cta">Pricing</a>
        <a href="#cta">About</a>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
        <button
          className="theme-toggle"
          aria-label="Toggle light/dark mode"
          title="Toggle theme"
          onClick={() => setTheme(isDark ? "light" : "dark")}
        >
          {isDark ? (
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="5"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              {[
                ["12", "1", "12", "3"],
                ["12", "21", "12", "23"],
                ["4.22", "4.22", "5.64", "5.64"],
                ["18.36", "18.36", "19.78", "19.78"],
                ["1", "12", "3", "12"],
                ["21", "12", "23", "12"],
                ["4.22", "19.78", "5.64", "18.36"],
                ["18.36", "5.64", "19.78", "4.22"],
              ].map(([x1, y1, x2, y2], i) => (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              ))}
            </svg>
          )}
        </button>

        <a
          href="#"
          className="sketch-btn"
          style={{ fontSize: "0.95rem", padding: "0.45rem 1.2rem" }}
        >
          Sign in
        </a>
      </div>
    </nav>
  );
}
