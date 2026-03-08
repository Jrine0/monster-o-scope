import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { useNavScroll } from "@/hooks/useNavScroll";

export function Nav() {
  const { scrolled, navState } = useNavScroll();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme !== "light";
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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

        {/* Sign-in dropdown */}
        <div ref={menuRef} style={{ position: "relative" }}>
          <button
            className="sketch-btn"
            style={{ fontSize: "0.95rem", padding: "0.45rem 1.2rem" }}
            onClick={() => setMenuOpen((v) => !v)}
          >
            Sign in
          </button>

          {/* Dropdown */}
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 0.6rem)",
              right: 0,
              minWidth: 200,
              background: "rgba(7,8,13,0.96)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(237,233,223,0.10)",
              padding: "0.5rem",
              zIndex: 700,
              pointerEvents: menuOpen ? "auto" : "none",
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateY(0)" : "translateY(-8px)",
              transition: "opacity 0.22s ease, transform 0.22s ease",
            }}
          >
            {/* Top label */}
            <div
              style={{
                padding: "0.4rem 0.75rem 0.65rem",
                borderBottom: "1px solid rgba(237,233,223,0.06)",
                marginBottom: "0.35rem",
              }}
            >
              <span
                style={{
                  fontFamily: "Courier Prime,monospace",
                  fontSize: "0.55rem",
                  color: "#8a8d9a",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                Sign in as
              </span>
            </div>

            <a
              href="/dashboard/student"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.7rem",
                padding: "0.6rem 0.75rem",
                textDecoration: "none",
                color: "#ede9df",
                borderRadius: "1px",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(242,116,13,0.08)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <span style={{ fontSize: "1.1rem" }}>🎒</span>
              <div>
                <div
                  style={{
                    fontFamily: "Caveat,cursive",
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    lineHeight: 1.1,
                  }}
                >
                  Student
                </div>
                <div
                  style={{
                    fontFamily: "Courier Prime,monospace",
                    fontSize: "0.54rem",
                    color: "#8a8d9a",
                    marginTop: "0.1rem",
                  }}
                >
                  Learn at your own pace
                </div>
              </div>
              <svg
                style={{ marginLeft: "auto", opacity: 0.35 }}
                viewBox="0 0 16 16"
                width="12"
                fill="none"
              >
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="#ede9df"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            <a
              href="/dashboard/teacher"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.7rem",
                padding: "0.6rem 0.75rem",
                textDecoration: "none",
                color: "#ede9df",
                borderRadius: "1px",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(242,116,13,0.08)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <span style={{ fontSize: "1.1rem" }}>🎓</span>
              <div>
                <div
                  style={{
                    fontFamily: "Caveat,cursive",
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    lineHeight: 1.1,
                  }}
                >
                  Teacher
                </div>
                <div
                  style={{
                    fontFamily: "Courier Prime,monospace",
                    fontSize: "0.54rem",
                    color: "#8a8d9a",
                    marginTop: "0.1rem",
                  }}
                >
                  Manage your classroom
                </div>
              </div>
              <svg
                style={{ marginLeft: "auto", opacity: 0.35 }}
                viewBox="0 0 16 16"
                width="12"
                fill="none"
              >
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="#ede9df"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
