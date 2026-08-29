// StudentSidebar.tsx — Tailwind CSS migration from inline styles
import { useLocation } from "@tanstack/react-router";
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
import SmartLink from "@/components/smart-link";

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setShowProfileDropdown(false);
  }, [location.pathname]);

  return (
    <aside
      className={`
        fixed top-0 left-0 h-dvh flex flex-col z-50 overflow-hidden
        border-r border-border bg-deep transition-[width] duration-300 ease-in-out
        ${isCollapsed ? "w-[72px]" : "w-60"}
      `}
    >
      {/* Header */}
      <div
        className={`
          flex items-center border-b border-border flex-shrink-0 min-h-14 box-border
          ${isCollapsed ? "justify-center px-1 py-3" : "justify-between px-5 py-3"}
        `}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-orange flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-bold text-[#07080d] font-[Caveat,cursive] leading-none">
              V
            </span>
          </div>
          {!isCollapsed && (
            <span className="font-[Caveat,cursive] text-xl font-bold text-foreground -rotate-0.5 whitespace-nowrap">
              Edactly
            </span>
          )}
        </div>
        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-7 h-7 rounded-md bg-transparent border-none flex items-center justify-center cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
            title="Collapse sidebar"
          >
            <ChevronLeft size={18} strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {isCollapsed && (
        <div className="flex justify-center p-2 border-b border-border">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-7 h-7 rounded-md bg-transparent border-none flex items-center justify-center cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
            title="Expand sidebar"
          >
            <ChevronRight size={18} strokeWidth={1.5} />
          </button>
        </div>
      )}

      {/* Nav Items */}
      <div
        className={`
          flex flex-col gap-1 box-border
          ${isCollapsed ? "p-2 px-1" : "p-4 px-3"}
        `}
      >
        <span
          className={`
            font-[Courier_Prime,monospace] text-[0.55rem] tracking-widest text-muted uppercase
            ${isCollapsed ? "text-center mb-1" : "pl-2 mb-1"}
          `}
        >
          {isCollapsed ? "" : "GENERAL"}
        </span>

        {navItems.map(({ name, to, icon: Icon }) => {
          const isActive = currentPath === to;
          return (
            <SmartLink
              key={name}
              to={to}
              className={`
                flex items-center no-underline rounded-lg transition-colors duration-150
                font-[Caveat,cursive] text-base
                ${isCollapsed ? "justify-center p-2.5" : "px-3 py-2"}
                ${isActive
                  ? "bg-surface text-foreground font-semibold"
                  : "text-muted-foreground hover:bg-elevated"
                }
              `}
            >
              <Icon
                size={18}
                strokeWidth={1.5}
                className={`flex-shrink-0 ${isActive ? "text-orange" : "text-muted-foreground"}`}
              />
              {!isCollapsed && <span>{name}</span>}
            </SmartLink>
          );
        })}
      </div>

      {/* Footer */}
      <div
        className={`
          border-t border-border flex flex-col flex-shrink-0 mt-auto box-border
          ${isCollapsed ? "p-2 gap-2" : "p-4 gap-3"}
        `}
      >
        {isCollapsed ? (
          <div ref={dropdownRef} className="relative flex justify-center">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="w-9 h-9 rounded-full bg-elevated border border-border flex items-center justify-center cursor-pointer transition-all hover:border-foreground/20"
            >
              <User size={18} strokeWidth={1.5} className="text-muted-foreground" />
            </button>
            {showProfileDropdown && (
              <div className="fixed left-[calc(72px+0.5rem)] bottom-4 bg-surface border border-border rounded-lg p-3 min-w-40 shadow-lg z-100">
                <div className="p-2 border-b border-border-subtle mb-2">
                  <div className="font-[Caveat,cursive] text-base font-semibold text-foreground">Rahul Kumar</div>
                  <div className="font-[Courier_Prime,monospace] text-[0.55rem] text-muted tracking-wide">Class 10-A</div>
                </div>
                <SmartLink
                  to="/student/settings"
                  className="flex items-center gap-2 p-2 rounded-md no-underline text-muted-foreground hover:bg-elevated transition-colors"
                >
                  <Settings size={14} strokeWidth={1.5} />
                  <span className="font-[Courier_Prime,monospace] text-[0.6rem] tracking-wide">Settings</span>
                </SmartLink>
                <SmartLink
                  to="/student/profile"
                  className="flex items-center gap-2 p-2 rounded-md no-underline text-muted-foreground hover:bg-elevated transition-colors"
                >
                  <User size={14} strokeWidth={1.5} />
                  <span className="font-[Courier_Prime,monospace] text-[0.6rem] tracking-wide">Profile</span>
                </SmartLink>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* User info */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-elevated border border-border flex items-center justify-center flex-shrink-0">
                <User size={16} strokeWidth={1.5} className="text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <div className="font-[Caveat,cursive] text-base font-semibold text-foreground truncate overflow-hidden text-ellipsis whitespace-nowrap">
                  Rahul Kumar
                </div>
                <div className="font-[Courier_Prime,monospace] text-[0.55rem] text-muted tracking-wide truncate overflow-hidden text-ellipsis whitespace-nowrap">
                  Class 10-A
                </div>
              </div>
            </div>
            {/* Settings and Profile */}
            <div className="flex gap-2">
              {footerItems.map((item) => {
                const isActive = currentPath === item.to;
                const Icon = item.icon;
                return (
                  <SmartLink
                    key={item.name}
                    to={item.to}
                    className={`
                      flex-1 flex items-center justify-center gap-1 p-2 no-underline rounded-lg transition-all duration-200
                      ${isActive
                        ? "bg-surface border border-border"
                        : "border border-border-subtle"
                      }
                    `}
                  >
                    <Icon
                      size={16}
                      strokeWidth={1.5}
                      className={isActive ? "text-orange" : "text-muted-foreground"}
                    />
                    <span
                      className={`
                        font-[Courier_Prime,monospace] text-[0.55rem] tracking-wide
                        ${isActive ? "text-foreground" : "text-muted-foreground"}
                      `}
                    >
                      {item.name}
                    </span>
                  </SmartLink>
                );
              })}
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
