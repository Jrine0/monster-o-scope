// StudentSidebar.tsx — Schoolme design system sidebar for student portal
// position:fixed so Lenis smooth-scroll on html/body doesn't affect it

import { Link, useLocation } from "@tanstack/react-router";
import {
  Book,
  GraduationCapIcon,
  LayoutDashboardIcon,
  NotebookText,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSidebar } from "./SidebarContext";
import { useState, useRef, useEffect } from "react";

const CAV: React.CSSProperties = { fontFamily: "Caveat, cursive" };
const COU: React.CSSProperties = { fontFamily: "Courier Prime, monospace" };

const navItems = [
  { name: "Dashboard", to: "/student", icon: LayoutDashboardIcon },
  { name: "Study Materials", to: "/student/materials", icon: Book },
  { name: "AI Tutor", to: "/student/tutor", icon: GraduationCapIcon },
  { name: "My Results", to: "/student/results", icon: NotebookText },
] as const;

const footerItems = [
  { name: "Settings", to: "/student/settings", icon: Settings },
  { name: "Profile", to: "/student/profile", icon: User },
] as const;

export function StudentSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: isCollapsed ? 72 : 240,
        height: "100dvh",
        backgroundColor: "var(--bg-deep)",
        borderRight: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        zIndex: 50,
        overflow: "hidden",
        boxSizing: "border-box",
        transition: "width 0.3s ease",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "space-between",
          padding: isCollapsed ? "1rem 0.5rem" : "1rem 1.25rem",
          borderBottom: "1px solid var(--border-subtle)",
          flexShrink: 0,
          minHeight: 56,
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "var(--orange)",
              display: "flex",
              flexShrink: 0,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                ...CAV,
                fontSize: "1.1rem",
                color: "#07080d",
                fontWeight: 700,
              }}
            >
              V
            </span>
          </div>
          {!isCollapsed && (
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
          )}
        </div>
        {/* Collapse toggle button in header */}
        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              width: 28,
              height: 28,
              borderRadius: "6px",
              backgroundColor: "transparent",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--text-secondary)",
            }}
            title="Collapse sidebar"
          >
            <ChevronLeft size={18} strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {isCollapsed && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "0.5rem",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              width: 28,
              height: 28,
              borderRadius: "6px",
              backgroundColor: "transparent",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--text-secondary)",
            }}
            title="Expand sidebar"
          >
            <ChevronRight size={18} strokeWidth={1.5} />
          </button>
        </div>
      )}

      {/* ── Nav Items ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
          padding: isCollapsed ? "0.75rem 0.25rem" : "1rem 0.75rem",
          boxSizing: "border-box",
        }}
      >
        <span
          style={{
            ...COU,
            fontSize: "0.55rem",
            letterSpacing: "0.12em",
            color: "var(--text-muted)",
            paddingLeft: isCollapsed ? "0" : "0.5rem",
            marginBottom: "0.35rem",
            textAlign: isCollapsed ? "center" : "left",
          }}
        >
          {isCollapsed ? "" : "GENERAL"}
        </span>

        {navItems.map(({ name, to, icon: Icon }) => {
          const isActive = currentPath === to;
          return (
            <Link
              key={name}
              to={to}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: isCollapsed ? "center" : "flex-start",
                gap: isCollapsed ? 0 : "0.6rem",
                padding: isCollapsed ? "0.6rem" : "0.5rem 0.75rem",
                borderRadius: "0.5rem",
                textDecoration: "none",
                background: isActive ? "var(--bg-surface)" : "transparent",
                color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                fontFamily: "Caveat, cursive",
                fontSize: isCollapsed ? "0" : "0.95rem",
                fontWeight: isActive ? 600 : 400,
                transition: "background 0.15s ease, color 0.15s ease",
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLAnchorElement).style.background = "var(--bg-elevated)";
              }}
              onMouseLeave={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
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
              {!isCollapsed && <span>{name}</span>}
            </Link>
          );
        })}
      </div>

      {/* ── Footer ── */}
      <div
        style={{
          borderTop: "1px solid var(--border-subtle)",
          padding: isCollapsed ? "0.75rem 0.5rem" : "1rem",
          display: "flex",
          flexDirection: "column",
          gap: isCollapsed ? "0.5rem" : "0.75rem",
          flexShrink: 0,
          marginTop: "auto",
          boxSizing: "border-box",
        }}
      >
        {/* Footer links */}
        {isCollapsed ? (
          // Collapsed mode: only show profile icon with dropdown
          <div ref={dropdownRef} style={{ position: "relative", display: "flex", justifyContent: "center" }}>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-default)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <User size={18} strokeWidth={1.5} style={{ color: "var(--text-secondary)" }} />
            </button>
            {/* Dropdown — uses position:fixed to the right of the profile button */}
            {showProfileDropdown && (
              <div
                style={{
                  position: "fixed",
                  left: "calc(72px + 0.5rem)",
                  bottom: "1rem",
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-default)",
                  borderRadius: "8px",
                  padding: "0.75rem",
                  minWidth: 160,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  zIndex: 100,
                }}
              >
                {/* Name and Class */}
                <div style={{ padding: "0.5rem", borderBottom: "1px solid var(--border-subtle)", marginBottom: "0.5rem" }}>
                  <div style={{ ...CAV, fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)" }}>Rahul Kumar</div>
                  <div style={{ ...COU, fontSize: "0.55rem", color: "var(--text-muted)", letterSpacing: "0.05em" }}>Class 10-A</div>
                </div>
                {/* Settings Link */}
                <Link
                  to="/student/settings"
                  onClick={() => setShowProfileDropdown(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.5rem",
                    borderRadius: "6px",
                    textDecoration: "none",
                    color: "var(--text-secondary)",
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-elevated)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <Settings size={14} strokeWidth={1.5} />
                  <span style={{ ...COU, fontSize: "0.6rem", letterSpacing: "0.03em" }}>Settings</span>
                </Link>
                {/* Profile Link */}
                <Link
                  to="/student/profile"
                  onClick={() => setShowProfileDropdown(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.5rem",
                    borderRadius: "6px",
                    textDecoration: "none",
                    color: "var(--text-secondary)",
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-elevated)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <User size={14} strokeWidth={1.5} />
                  <span style={{ ...COU, fontSize: "0.6rem", letterSpacing: "0.03em" }}>Profile</span>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* User info — only shown when expanded */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                justifyContent: "flex-start",
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
                <User
                  size={16}
                  strokeWidth={1.5}
                  style={{ color: "var(--text-secondary)" }}
                />
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
            {/* Expanded mode: show both Settings and Profile */}
            <div
            style={{
              display: "flex",
              gap: "0.5rem",
              justifyContent: "stretch",
            }}
          >
            {footerItems.map((item) => {
              const isActive = currentPath === item.to;
              const Icon = item.icon;
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
                    border: isActive ? "1px solid var(--border-default)" : "1px solid var(--border-subtle)",
                    borderRadius: "0.5rem",
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  <Icon
                    size={16}
                    strokeWidth={1.5}
                    style={{
                      color: isActive ? "var(--orange)" : "var(--text-secondary)",
                    }}
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
          </>
        )}
      </div>
    </aside>
  );
}
