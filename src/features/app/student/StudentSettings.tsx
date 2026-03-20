// StudentSettings.tsx — Student settings page
// Uses Schoolme design system with Caveat/Lora/Courier Prime fonts

import { useState } from "react";
import { motion } from "motion/react";
import {
  Bell,
  Moon,
  Sun,
  Lock,
  Monitor,
} from "lucide-react";
import { useTheme } from "next-themes";
import { ease } from "@/lib/animation";

/* ── Fonts shorthand ── */
const CAV: React.CSSProperties = { fontFamily: "Caveat, cursive" };
const LOR: React.CSSProperties = { fontFamily: "Lora, Georgia, serif" };
const COU: React.CSSProperties = { fontFamily: "Courier Prime, monospace" };
const CLIP_CARD =
  "polygon(0.3% 1%,1.5% 0%,99% 0.5%,100% 2%,99.7% 99%,98% 100%,0.5% 99.5%,0% 98%)";

/* ── Mock settings data ── */
const SETTINGS_SECTIONS = [
  {
    id: "notifications",
    title: "Notifications",
    icon: Bell,
    settings: [
      {
        id: "push",
        label: "Push Notifications",
        description: "Receive notifications for new quizzes and messages",
        type: "toggle",
        defaultValue: true,
      },
      {
        id: "email",
        label: "Email Updates",
        description: "Get weekly progress reports via email",
        type: "toggle",
        defaultValue: false,
      },
      {
        id: "sound",
        label: "Sound Effects",
        description: "Play sounds for quiz completion and achievements",
        type: "toggle",
        defaultValue: true,
      },
    ],
  },
  {
    id: "appearance",
    title: "Appearance",
    icon: Monitor,
    settings: [
      {
        id: "theme",
        label: "Theme",
        description: "Choose your preferred color scheme",
        type: "theme",
        defaultValue: "dark",
      },
      {
        id: "fontScheme",
        label: "Font Style",
        description: "Choose your preferred typography",
        type: "font",
        defaultValue: "schoolme",
      },
    ],
  },
  {
    id: "privacy",
    title: "Privacy & Security",
    icon: Lock,
    settings: [
      {
        id: "change-password",
        label: "Change Password",
        description: "Update your account password",
        type: "action",
        defaultValue: false,
      },
    ],
  },
] as const;

/* ── Animated background ── */
function SettingsBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute -top-32 right-[10%] h-[450px] w-[450px] rounded-full"
        style={{
          background: "radial-gradient(circle,#f2740d 0%,transparent 70%)",
          filter: "blur(100px)",
          opacity: 0.05,
        }}
        animate={{
          x: [0, 20, -15, 0],
          y: [0, -18, 12, 0],
          scale: [1, 1.04, 0.97, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-[8%] left-[5%] h-[350px] w-[350px] rounded-full"
        style={{
          background: "radial-gradient(circle,#fb923c 0%,transparent 70%)",
          filter: "blur(100px)",
          opacity: 0.04,
        }}
        animate={{
          x: [0, -15, 18, 0],
          y: [0, 15, -12, 0],
          scale: [1, 0.96, 1.03, 1],
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
    </div>
  );
}

/* ── Toggle switch component ── */
function ToggleSwitch({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      style={{
        width: 48,
        height: 26,
        borderRadius: "999px",
        background: enabled ? "var(--orange)" : "var(--bg-elevated)",
        border: `1px solid ${enabled ? "var(--orange)" : "var(--border-default)"}`,
        cursor: "pointer",
        position: "relative",
        transition: "all 0.2s ease",
        flexShrink: 0,
      }}
    >
      <motion.div
        animate={{ x: enabled ? 22 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: enabled ? "#07080d" : "var(--text-muted)",
          position: "absolute",
          top: 2,
        }}
      />
    </button>
  );
}

/* ── Theme selector component ── */
function ThemeSelector({
  currentTheme,
  onChange,
}: {
  currentTheme: string;
  onChange: (v: string) => void;
}) {
  const themes = [
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
  ];

  return (
    <div style={{ display: "flex", gap: "0.75rem" }}>
      {themes.map((t) => {
        const isActive = currentTheme === t.id;
        const Icon = t.icon;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.6rem 1rem",
              background: isActive ? "var(--orange)" : "var(--bg-surface)",
              border: `1px solid ${isActive ? "var(--orange)" : "var(--border-subtle)"}`,
              borderRadius: "8px",
              cursor: "pointer",
              color: isActive ? "#07080d" : "var(--text-secondary)",
              transition: "all 0.2s ease",
            }}
          >
            <Icon size={16} strokeWidth={1.5} />
            <span style={{ ...COU, fontSize: "0.65rem", letterSpacing: "0.05em" }}>
              {t.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ── Font selector component ── */
function FontSelector({
  currentFont,
  onChange,
}: {
  currentFont: string;
  onChange: (v: string) => void;
}) {
  const fonts = [
    { id: "schoolme", label: "Schoolme", displayFont: "Caveat", bodyFont: "Lora" },
    { id: "modern", label: "Modern", displayFont: "Instrument Serif", bodyFont: "Figtree" },
    { id: "scholar", label: "Scholar", displayFont: "Merriweather", bodyFont: "Source Serif 4" },
    { id: "clean", label: "Clean", displayFont: "Inter", bodyFont: "Crimson Pro" },
  ];

  return (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      {fonts.map((f) => {
        const isActive = currentFont === f.id;
        return (
          <button
            key={f.id}
            onClick={() => onChange(f.id)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "0.15rem",
              padding: "0.6rem 0.85rem",
              background: isActive ? "var(--orange)" : "var(--bg-surface)",
              border: `1px solid ${isActive ? "var(--orange)" : "var(--border-subtle)"}`,
              borderRadius: "8px",
              cursor: "pointer",
              color: isActive ? "#07080d" : "var(--text-secondary)",
              transition: "all 0.2s ease",
              minWidth: "90px",
            }}
          >
            <span style={{
              fontFamily: f.id === "schoolme" ? "Caveat, cursive" :
                          f.id === "modern" ? '"Instrument Serif", Georgia, serif' :
                          f.id === "scholar" ? '"Merriweather", Georgia, serif' :
                          '"Inter", system-ui, sans-serif',
              fontSize: "1rem",
              fontWeight: 600,
              lineHeight: 1,
            }}>
              {f.label}
            </span>
            <span style={{
              ...COU,
              fontSize: "0.5rem",
              letterSpacing: "0.05em",
              opacity: 0.7,
            }}>
              {f.bodyFont}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ── Settings item ── */
function SettingsItem({
  setting,
  value,
  onChange,
}: {
  setting: (typeof SETTINGS_SECTIONS)[number]["settings"][number];
  value: boolean | string;
  onChange: (v: boolean | string) => void;
}) {
  const isToggle = setting.type === "toggle";
  const isTheme = setting.type === "theme";
  const isFont = setting.type === "font";
  const isAction = setting.type === "action";

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem 1.25rem",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        clipPath: CLIP_CARD,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            ...CAV,
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "var(--text-primary)",
          }}
        >
          {setting.label}
        </p>
        <p
          style={{
            ...LOR,
            fontStyle: "italic",
            fontSize: "0.78rem",
            color: "var(--text-secondary)",
            marginTop: "0.2rem",
          }}
        >
          {setting.description}
        </p>
      </div>
      <div style={{ marginLeft: "1rem", flexShrink: 0 }}>
        {isToggle && (
          <ToggleSwitch enabled={value as boolean} onChange={onChange as (v: boolean) => void} />
        )}
        {isTheme && (
          <ThemeSelector currentTheme={value as string} onChange={onChange as (v: string) => void} />
        )}
        {isFont && (
          <FontSelector currentFont={value as string} onChange={onChange as (v: string) => void} />
        )}
        {isAction && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.5rem 1rem",
              background: "var(--orange)",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              color: "#07080d",
              ...CAV,
              fontSize: "0.95rem",
              fontWeight: 700,
            }}
          >
            Change
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

/* ── Main component ── */
export function StudentSettings() {
  const { theme, setTheme } = useTheme();

  // Get current font scheme from document
  const getCurrentFontScheme = () => {
    if (typeof document !== "undefined") {
      const dataFont = document.documentElement.getAttribute("data-font");
      return dataFont || "schoolme";
    }
    return "schoolme";
  };

  const [settings, setSettings] = useState({
    push: true,
    email: false,
    sound: true,
    theme: theme || "dark",
    fontScheme: getCurrentFontScheme(),
  });

  const updateSetting = (key: string, value: boolean | string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    if (key === "theme" && typeof value === "string") {
      setTheme(value);
    }
    if (key === "fontScheme" && typeof value === "string") {
      document.documentElement.setAttribute("data-font", value);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        paddingBottom: "3rem",
      }}
    >
      <SettingsBackground />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.6, ease: ease.gentle }}
      >
        <h1
          style={{
            ...CAV,
            fontSize: "clamp(2rem,5vw,3rem)",
            fontWeight: 400,
            color: "var(--text-primary)",
            lineHeight: 1,
          }}
        >
          Settings
        </h1>
        <p
          style={{
            ...LOR,
            fontStyle: "italic",
            fontSize: "0.95rem",
            color: "var(--text-secondary)",
            marginTop: "0.4rem",
          }}
        >
          Customize your learning experience
        </p>
        <motion.div
          style={{
            height: 1,
            marginTop: "1rem",
            background: "linear-gradient(90deg,transparent,#f2740d,#fb923c,transparent)",
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: ease.gentle }}
        />
      </motion.div>

      {/* Settings sections */}
      {SETTINGS_SECTIONS.map((section) => {
        const Icon = section.icon;
        return (
          <motion.section
            key={section.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.75rem",
              }}
            >
              <Icon size={16} strokeWidth={1.5} color="var(--orange)" />
              <span
                style={{
                  ...COU,
                  fontSize: "0.6rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--orange)",
                  opacity: 0.85,
                }}
              >
                {section.title}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {section.settings.map((setting) => (
                <SettingsItem
                  key={setting.id}
                  setting={setting}
                  value={settings[setting.id as keyof typeof settings]}
                  onChange={(v) => updateSetting(setting.id, v)}
                />
              ))}
            </div>
          </motion.section>
        );
      })}

      {/* App info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          textAlign: "center",
          padding: "1rem",
        }}
      >
        <p
          style={{
            ...COU,
            fontSize: "0.58rem",
            letterSpacing: "0.15em",
            color: "var(--text-muted)",
          }}
        >
          Vyasa v1.0 &middot; Schoolme Platform
        </p>
      </motion.div>
    </div>
  );
}
