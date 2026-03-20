// StudentSidebar.tsx — Schoolme design system sidebar for student portal
// Uses CSS variables, Caveat/Lora/Courier Prime fonts, wobbly clip-path borders

import { Link, useLocation } from "@tanstack/react-router";
import {
  Book,
  GraduationCapIcon,
  LayoutDashboardIcon,
  ListChecksIcon,
  NotebookText,
  Settings,
  User,
} from "lucide-react";

/* ── Fonts shorthand ── */
const CAV: React.CSSProperties = { fontFamily: "Caveat, cursive" };
const LOR: React.CSSProperties = { fontFamily: "Lora, Georgia, serif" };
const COU: React.CSSProperties = { fontFamily: "Courier Prime, monospace" };

const CLIP_SIDEBAR_ITEM =
  "polygon(0.5% 8%, 1.5% 0%, 99% 1%, 100% 7%, 99.5% 93%, 98% 100%, 1% 99%, 0% 92%)";

/* ── Sidebar config for student ── */
const sidebarConfig = {
  groups: [
    {
      name: "GENERAL",
      items: [
        { name: "Dashboard", to: "/student", icon: LayoutDashboardIcon },
        { name: "Study Materials", to: "/student/materials", icon: Book },
        { name: "Practice Quizzes", to: "/student/quizzes", icon: ListChecksIcon },
        { name: "AI Tutor", to: "/student/tutor", icon: GraduationCapIcon },
        { name: "My Results", to: "/student/results", icon: NotebookText },
      ],
    },
  ],
};

const footerItems = [
  { name: "Settings", to: "/student/settings" },
  { name: "Profile", to: "/student/profile" },
];

/* ── Fixed-width sidebar component ── */
export function StudentSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 240,
        height: "100vh",
        background: "var(--bg-deep)",
        borderRight: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        zIndex: 600,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem 1.25rem",
          borderBottom: "1px solid var(--border-subtle)",
          minHeight: 56,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Logo */}
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "var(--orange)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ ...CAV, fontSize: "1.1rem", color: "#07080d", fontWeight: 700 }}>V</span>
          </div>
          <span
            style={{
              ...CAV,
              fontSize: "1.35rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              transform: "rotate(-0.5deg)",
              display: "inline-block",
              whiteSpace: "nowrap",
            }}
          >
            Vyasa
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "1rem 0.75rem" }}>
        {sidebarConfig.groups.map((group) => (
          <div key={group.name} style={{ marginBottom: "1.5rem" }}>
            <div
              style={{
                ...COU,
                fontSize: "0.58rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--orange)",
                opacity: 0.85,
                padding: "0 0.5rem",
                marginBottom: "0.75rem",
              }}
            >
              {group.name}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              {group.items.map((item) => {
                const isActive =
                  currentPath === item.to ||
                  (item.to !== "/student" && currentPath.startsWith(item.to));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.to}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.7rem 0.85rem",
                      background: isActive ? "var(--bg-surface)" : "transparent",
                      border: `1px solid ${isActive ? "var(--border-default)" : "transparent"}`,
                      textDecoration: "none",
                      clipPath: CLIP_SIDEBAR_ITEM,
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Icon
                      size={18}
                      strokeWidth={1.5}
                      style={{
                        color: isActive ? "var(--orange)" : "var(--text-secondary)",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        ...LOR,
                        fontStyle: "italic",
                        fontSize: "0.85rem",
                        color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div
        style={{
          borderTop: "1px solid var(--border-subtle)",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        {/* User info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-default)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <User size={16} strokeWidth={1.5} style={{ color: "var(--text-secondary)" }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                ...CAV,
                fontSize: "1rem",
                fontWeight: 600,
                color: "var(--text-primary)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Rahul Kumar
            </div>
            <div
              style={{
                ...COU,
                fontSize: "0.55rem",
                color: "var(--text-muted)",
                letterSpacing: "0.05em",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Class 10-A
            </div>
          </div>
        </div>

        {/* Footer links */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {footerItems.map((item) => {
            const isActive = currentPath === item.to;
            const Icon = item.name === "Settings" ? Settings : User;
            return (
              <Link
                key={item.name}
                to={item.to}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                  padding: "0.5rem",
                  background: isActive ? "var(--bg-surface)" : "transparent",
                  border: `1px solid ${isActive ? "var(--border-default)" : "var(--border-subtle)"}`,
                  textDecoration: "none",
                  clipPath: CLIP_SIDEBAR_ITEM,
                  transition: "all 0.2s ease",
                }}
              >
                <Icon
                  size={14}
                  strokeWidth={1.5}
                  style={{ color: isActive ? "var(--orange)" : "var(--text-secondary)" }}
                />
                <span
                  style={{
                    ...COU,
                    fontSize: "0.55rem",
                    letterSpacing: "0.05em",
                    color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                  }}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}