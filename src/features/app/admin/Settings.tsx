// SettingsPage.tsx — Edactly design system
// All logic from original preserved exactly.
// Added: functional theme toggle (next-themes) + font family picker (data-font on <html>).
// className tokens → Edactly CSS vars + Caveat/Lora/Courier Prime fonts.

import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import {
  School,
  Bell,
  Globe,
  Upload,
  Save,
  ChevronRight,
  ToggleLeft,
  Image,
  MapPin,
  ChevronDown,
  Sun,
  Moon,
  Type,
} from "lucide-react";
import { fadeUpProps, ease } from "@/lib/animation";
import { useTheme } from "next-themes";

/* ── Font shorthand tokens (referencing CSS vars so font scheme changes propagate) ── */
const CAV: React.CSSProperties = {
  fontFamily: "var(--font-display, 'Caveat', cursive)",
};
const LOR: React.CSSProperties = {
  fontFamily: "var(--font-body, 'Lora', Georgia, serif)",
};
const COU: React.CSSProperties = {
  fontFamily: "var(--font-mono, 'Courier Prime', monospace)",
};
const CLIP_CARD =
  "polygon(0.3% 1%,1.5% 0%,99% 0.5%,100% 2%,99.7% 99%,98% 100%,0.5% 99.5%,0% 98%)";
const CLIP_SM = "polygon(1% 0%,100% 1%,99% 100%,0% 99%)";
const CLIP_BTN =
  "polygon(0.5% 8%,1.5% 0%,99% 1%,100% 7%,99.5% 93%,98% 100%,1% 99%,0% 92%)";

/* ── Font schemes (matches CSS data-font attributes) ── */
type FontScheme = "default" | "scholar" | "clean";
const FONT_OPTIONS: {
  key: FontScheme;
  label: string;
  display: string;
  body: string;
  mono: string;
}[] = [
  {
    key: "default",
    label: "Edactly",
    display: "Caveat",
    body: "Lora",
    mono: "Courier Prime",
  },
  {
    key: "scholar",
    label: "Scholar",
    display: "Merriweather",
    body: "Source Serif 4",
    mono: "IBM Plex Mono",
  },
  {
    key: "clean",
    label: "Clean",
    display: "Inter",
    body: "Crimson Pro",
    mono: "JetBrains Mono",
  },
];

/* ── Mock data (unchanged) ── */
const NOTIFICATION_SETTINGS = [
  {
    id: "new-teacher",
    label: "New teacher added",
    description: "Receive an email when a new teacher account is created",
    defaultOn: true,
  },
  {
    id: "new-student",
    label: "New student added",
    description: "Receive an email when a new student account is created",
    defaultOn: false,
  },
  {
    id: "billing",
    label: "Billing alerts",
    description: "Get notified about upcoming renewals and payment issues",
    defaultOn: true,
  },
  {
    id: "usage",
    label: "Usage warnings",
    description: "Alert when usage reaches 80% of plan limits",
    defaultOn: true,
  },
  {
    id: "system",
    label: "System updates",
    description: "Receive updates about new features and maintenance",
    defaultOn: true,
  },
] as const;

const TIMEZONES = [
  "Asia/Kolkata (IST, UTC+5:30)",
  "Asia/Dubai (GST, UTC+4:00)",
  "Asia/Singapore (SGT, UTC+8:00)",
  "Europe/London (GMT, UTC+0:00)",
  "America/New_York (EST, UTC-5:00)",
] as const;

/* ── Toggle component (logic unchanged) ── */
function Toggle({ defaultChecked = false }: { defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => setChecked(!checked)}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        width: 44,
        height: 24,
        borderRadius: "999px",
        border: "none",
        cursor: "pointer",
        background: checked ? "var(--orange)" : "var(--bg-elevated)",
        transition: "background 0.2s",
        flexShrink: 0,
      }}
    >
      <motion.span
        style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "white",
          boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
          display: "inline-block",
        }}
        animate={{ x: checked ? 24 : 4 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

/* ── Animated background (adapted to orange, Edactly palette) ── */
function AnimatedBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      aria-hidden
    >
      <motion.div
        className="absolute -top-32 right-[10%] h-[450px] w-[450px] rounded-full"
        style={{
          background: "radial-gradient(circle,#f2740d 0%,transparent 70%)",
          filter: "blur(100px)",
          opacity: 0.05,
        }}
        animate={{
          x: [0, 25, -20, 0],
          y: [0, -20, 15, 0],
          scale: [1, 1.05, 0.97, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-[10%] left-[5%] h-[380px] w-[380px] rounded-full"
        style={{
          background: "radial-gradient(circle,#fb923c 0%,transparent 70%)",
          filter: "blur(100px)",
          opacity: 0.04,
        }}
        animate={{
          x: [0, -15, 20, 0],
          y: [0, 20, -15, 0],
          scale: [1, 0.96, 1.04, 1],
        }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle,rgba(242,116,13,0.032) 1px,transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: i % 3 === 0 ? 3 : 2,
            height: i % 3 === 0 ? 3 : 2,
            left: `${14 + ((i * 12.8) % 72)}%`,
            top: `${28 + ((i * 10.5) % 52)}%`,
            background:
              i % 2 === 0 ? "rgba(242,116,13,0.5)" : "rgba(251,146,60,0.35)",
          }}
          animate={{
            y: [0, -80 - i * 10],
            x: [0, i % 2 === 0 ? 8 : -8],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: 5 + (i % 4) * 1.5,
            repeat: Infinity,
            delay: i * 0.6,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

/* ── Section card wrapper ── */
function SettingsCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        clipPath: CLIP_CARD,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}

/* ── Section header row ── */
function CardHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        padding: "0.85rem 1.25rem",
        borderBottom: "1px solid var(--border-subtle)",
        background: "var(--bg-elevated)",
      }}
    >
      {icon}
      <h2
        style={{
          ...CAV,
          fontSize: "1.25rem",
          fontWeight: 700,
          color: "var(--text-primary)",
        }}
      >
        {title}
      </h2>
    </div>
  );
}

/* ── Label ── */
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      style={{
        display: "block",
        ...LOR,
        fontStyle: "italic",
        fontSize: "0.82rem",
        color: "var(--text-secondary)",
        marginBottom: "0.5rem",
      }}
    >
      {children}
    </label>
  );
}

/* ── Shared input style ── */
const inputStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 520,
  ...LOR,
  fontSize: "0.9rem",
  color: "var(--text-primary)",
  background: "var(--bg-elevated)",
  border: "1px solid var(--border-default)",
  padding: "0.65rem 1rem",
  outline: "none",
  clipPath: CLIP_SM,
  transition: "border-color 0.18s, box-shadow 0.18s",
};

const fadeIn = (delay: number) => fadeUpProps(12, delay, 0.4, ease.standard);

/* ── Main ── */
export function SettingsPage() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  // Font scheme — reads current data-font attr as initial state
  const [fontScheme, setFontScheme] = useState<FontScheme>(() => {
    if (typeof document === "undefined") return "default";
    return (
      (document.documentElement.getAttribute("data-font") as FontScheme) ??
      "default"
    );
  });

  const applyFont = (scheme: FontScheme) => {
    setFontScheme(scheme);
    if (scheme === "default") {
      document.documentElement.removeAttribute("data-font");
    } else {
      document.documentElement.setAttribute("data-font", scheme);
    }
    localStorage.setItem("schoolme-font", scheme);
  };

  void isDark; // theme toggle available if needed

  return (
    <>
      <AnimatedBackground />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: "1.75rem",
        }}
      >
        {/* Header */}
        <motion.div {...fadeIn(0)}>
          <motion.h1
            initial={{ opacity: 0, y: -8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.4, ease: ease.standard }}
            style={{
              ...CAV,
              fontSize: "clamp(2rem,4vw,3rem)",
              fontWeight: 400,
              color: "var(--text-primary)",
              lineHeight: 1,
            }}
          >
            School Settings
          </motion.h1>
          <p
            style={{
              ...LOR,
              fontStyle: "italic",
              fontSize: "0.95rem",
              color: "var(--text-secondary)",
              marginTop: "0.4rem",
            }}
          >
            Configure your school profile, notifications, and preferences.
          </p>
          <div
            style={{
              height: 1,
              marginTop: "1rem",
              background: "linear-gradient(90deg,var(--orange),transparent)",
              opacity: 0.4,
              width: "5rem",
            }}
          />
        </motion.div>

        {/* Feature Toggles link */}
        <motion.div {...fadeIn(0.05)}>
          <Link
            to="/admin/settings/features"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1rem 1.25rem",
              textDecoration: "none",
              background: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              clipPath: CLIP_CARD,
              transition: "border-color 0.2s",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}
            >
              <motion.div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  background: "rgba(242,116,13,0.10)",
                  borderRadius: 8,
                }}
                animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <ToggleLeft size={20} strokeWidth={1.5} color="var(--orange)" />
              </motion.div>
              <div>
                <p
                  style={{
                    ...CAV,
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                  }}
                >
                  Feature Toggles
                </p>
                <p
                  style={{
                    ...COU,
                    fontSize: "0.6rem",
                    letterSpacing: "0.1em",
                    color: "var(--text-muted)",
                    marginTop: 2,
                  }}
                >
                  Enable or disable platform features for your school
                </p>
              </div>
            </div>
            <ChevronRight
              size={18}
              strokeWidth={1.5}
              color="var(--text-muted)"
            />
          </Link>
        </motion.div>

        {/* ── Appearance ── Theme + Font ── */}
        <motion.div {...fadeIn(0.08)}>
          <SettingsCard>
            <CardHeader
              icon={<Type size={17} strokeWidth={1.5} color="var(--orange)" />}
              title="Appearance"
            />
            <div
              style={{
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              {/* Theme toggle */}
              <div>
                <FieldLabel>Colour theme</FieldLabel>
                <div
                  style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}
                >
                  {(
                    [
                      {
                        key: "dark",
                        label: "Dark",
                        icon: <Moon size={14} strokeWidth={1.5} />,
                      },
                      {
                        key: "light",
                        label: "Light",
                        icon: <Sun size={14} strokeWidth={1.5} />,
                      },
                    ] as const
                  ).map((opt) => {
                    const isActive = opt.key === (isDark ? "dark" : "light");
                    return (
                      <motion.button
                        key={opt.key}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setTheme(opt.key)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.45rem",
                          ...COU,
                          fontSize: "0.68rem",
                          letterSpacing: "0.1em",
                          padding: "0.5rem 1rem",
                          cursor: "pointer",
                          border: "1px solid",
                          borderColor: isActive
                            ? "var(--orange)"
                            : "var(--border-default)",
                          background: isActive
                            ? "rgba(242,116,13,0.10)"
                            : "var(--bg-elevated)",
                          color: isActive
                            ? "var(--orange)"
                            : "var(--text-secondary)",
                          clipPath: CLIP_SM,
                          transition: "all 0.18s",
                        }}
                      >
                        {opt.icon} {opt.label}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Font family picker */}
              <div>
                <FieldLabel>Font family</FieldLabel>
                <p
                  style={{
                    ...LOR,
                    fontStyle: "italic",
                    fontSize: "0.78rem",
                    color: "var(--text-muted)",
                    marginBottom: "0.85rem",
                  }}
                >
                  Changes the display and body typeface across the platform.
                </p>
                <div
                  style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}
                >
                  {FONT_OPTIONS.map((opt) => {
                    const isActive = fontScheme === opt.key;
                    return (
                      <motion.button
                        key={opt.key}
                        whileHover={{ y: -3 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => applyFont(opt.key)}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.3rem",
                          padding: "0.85rem 1.1rem",
                          cursor: "pointer",
                          background: isActive
                            ? "rgba(242,116,13,0.07)"
                            : "var(--bg-elevated)",
                          border: "1px solid",
                          borderColor: isActive
                            ? "var(--orange)"
                            : "var(--border-default)",
                          clipPath: CLIP_CARD,
                          transition: "all 0.18s",
                          minWidth: 120,
                        }}
                      >
                        {/* Scheme name */}
                        <span
                          style={{
                            ...COU,
                            fontSize: "0.6rem",
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                            color: isActive
                              ? "var(--orange)"
                              : "var(--text-muted)",
                          }}
                        >
                          {opt.label}
                        </span>
                        {/* Display font preview */}
                        <span
                          style={{
                            fontFamily: `"${opt.display}", ${opt.key === "clean" ? "system-ui, sans-serif" : "Georgia, serif"}`,
                            fontSize: "1.1rem",
                            fontWeight: opt.key === "clean" ? 600 : 400,
                            color: "var(--text-primary)",
                            lineHeight: 1.2,
                          }}
                        >
                          Aa
                        </span>
                        {/* Font names */}
                        <span
                          style={{
                            ...COU,
                            fontSize: "0.55rem",
                            letterSpacing: "0.06em",
                            color: "var(--text-muted)",
                            opacity: 0.7,
                            lineHeight: 1.4,
                          }}
                        >
                          {opt.display}
                          <br />
                          {opt.body}
                        </span>
                        {/* Active dot */}
                        {isActive && (
                          <div
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: "var(--orange)",
                              marginTop: 2,
                            }}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          </SettingsCard>
        </motion.div>

        {/* School Profile */}
        <motion.div {...fadeIn(0.1)}>
          <SettingsCard>
            <CardHeader
              icon={
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <School size={17} strokeWidth={1.5} color="var(--orange)" />
                </motion.div>
              }
              title="School Profile"
            />
            <div
              style={{
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              {/* School name */}
              <div>
                <FieldLabel>School Name</FieldLabel>
                <input
                  type="text"
                  defaultValue="Delhi Public School, Vasant Kunj"
                  style={inputStyle}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "rgba(242,116,13,0.45)";
                    e.currentTarget.style.boxShadow =
                      "0 0 18px rgba(242,116,13,0.08)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-default)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Address */}
              <div>
                <FieldLabel>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.35rem",
                    }}
                  >
                    <MapPin size={12} strokeWidth={1.5} /> Address
                  </span>
                </FieldLabel>
                <textarea
                  defaultValue={
                    "Sector B, Pocket 5, Vasant Kunj, New Delhi — 110070"
                  }
                  rows={3}
                  style={{ ...inputStyle, resize: "none" as const }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "rgba(242,116,13,0.45)";
                    e.currentTarget.style.boxShadow =
                      "0 0 18px rgba(242,116,13,0.08)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-default)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Logo upload */}
              <div>
                <FieldLabel>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.35rem",
                    }}
                  >
                    <Image size={12} strokeWidth={1.5} /> School Logo
                  </span>
                </FieldLabel>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    maxWidth: 520,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 76,
                      height: 76,
                      flexShrink: 0,
                      border: "1px dashed var(--border-strong)",
                      background: "var(--bg-elevated)",
                      borderRadius: 8,
                    }}
                  >
                    <School
                      size={24}
                      strokeWidth={1.5}
                      color="var(--text-muted)"
                    />
                  </div>
                  <div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        ...COU,
                        fontSize: "0.65rem",
                        letterSpacing: "0.1em",
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border-default)",
                        color: "var(--text-secondary)",
                        padding: "0.5rem 0.9rem",
                        cursor: "pointer",
                        clipPath: CLIP_SM,
                        transition: "all 0.18s",
                      }}
                    >
                      <Upload size={13} strokeWidth={1.5} /> Upload Logo
                    </motion.button>
                    <p
                      style={{
                        ...COU,
                        fontSize: "0.58rem",
                        letterSpacing: "0.08em",
                        color: "var(--text-muted)",
                        marginTop: "0.5rem",
                      }}
                    >
                      PNG or SVG, max 2 MB. Recommended: 256×256 px.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </SettingsCard>
        </motion.div>

        {/* Notifications */}
        <motion.div {...fadeIn(0.18)}>
          <SettingsCard>
            <CardHeader
              icon={
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatDelay: 3,
                  }}
                >
                  <Bell size={17} strokeWidth={1.5} color="var(--orange)" />
                </motion.div>
              }
              title="Notifications"
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              {NOTIFICATION_SETTINGS.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.2 + i * 0.05,
                    duration: 0.3,
                    ease: ease.standard,
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "1rem 1.25rem",
                    borderBottom:
                      i < NOTIFICATION_SETTINGS.length - 1
                        ? "1px solid var(--border-subtle)"
                        : "none",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      "var(--bg-elevated)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      "transparent")
                  }
                >
                  <div style={{ marginRight: "1rem" }}>
                    <p
                      style={{
                        ...LOR,
                        fontSize: "0.9rem",
                        color: "var(--text-primary)",
                      }}
                    >
                      {s.label}
                    </p>
                    <p
                      style={{
                        ...COU,
                        fontSize: "0.58rem",
                        letterSpacing: "0.06em",
                        color: "var(--text-muted)",
                        marginTop: 2,
                      }}
                    >
                      {s.description}
                    </p>
                  </div>
                  <Toggle defaultChecked={s.defaultOn} />
                </motion.div>
              ))}
            </div>
          </SettingsCard>
        </motion.div>

        {/* Display / Timezone */}
        <motion.div {...fadeIn(0.26)}>
          <SettingsCard>
            <CardHeader
              icon={
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Globe size={17} strokeWidth={1.5} color="var(--orange)" />
                </motion.div>
              }
              title="Display"
            />
            <div style={{ padding: "1.25rem" }}>
              <FieldLabel>Timezone</FieldLabel>
              <div style={{ position: "relative", maxWidth: 380 }}>
                <select
                  defaultValue={TIMEZONES[0]}
                  style={{
                    ...inputStyle,
                    maxWidth: 380,
                    appearance: "none",
                    paddingRight: "2.2rem",
                    cursor: "pointer",
                  }}
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={13}
                  strokeWidth={1.5}
                  color="var(--text-muted)"
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                  }}
                />
              </div>
            </div>
          </SettingsCard>
        </motion.div>

        {/* Save */}
        <motion.div
          {...fadeIn(0.32)}
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              ...CAV,
              fontSize: "1.05rem",
              fontWeight: 700,
              background: "var(--orange)",
              color: "#07080d",
              border: "none",
              cursor: "pointer",
              padding: "0.65rem 1.75rem",
              clipPath: CLIP_BTN,
              transition: "background 0.15s",
            }}
          >
            <Save size={16} strokeWidth={1.5} /> Save Changes
          </motion.button>
        </motion.div>
      </div>
    </>
  );
}
