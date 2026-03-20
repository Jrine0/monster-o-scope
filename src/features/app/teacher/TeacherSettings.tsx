// TeacherSettings.tsx — Teacher settings page
// Uses Schoolme design system with Caveat/Lora/Courier Prime fonts

import { useState } from "react";
import { motion } from "motion/react";
import {
  Bell,
  Moon,
  Sun,
  Lock,
  BookOpen,
  Users,
  GraduationCap,
} from "lucide-react";
import { useTheme } from "next-themes";
import { ease } from "@/lib/animation";

/* ── Fonts shorthand ── */
const CAV: React.CSSProperties = { fontFamily: "Caveat, cursive" };
const LOR: React.CSSProperties = { fontFamily: "Lora, Georgia, serif" };
const COU: React.CSSProperties = { fontFamily: "Courier Prime, monospace" };
const CLIP_CARD =
  "polygon(0.3% 1%,1.5% 0%,99% 0.5%,100% 2%,99.7% 99%,98% 100%,0.5% 99.5%,0% 98%)";

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

/* ── Main component ── */
export function TeacherSettings() {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState({
    push: true,
    email: true,
    students: false,
    theme: theme || "dark",
  });

  const updateSetting = (key: string, value: boolean | string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    if (key === "theme" && typeof value === "string") {
      setTheme(value);
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
          Manage your teaching preferences
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

      {/* Notifications Section */}
      <motion.section
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
          <Bell size={16} strokeWidth={1.5} color="var(--orange)" />
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
            Notifications
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <motion.div
            whileHover={{ y: -2 }}
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
            <div>
              <p style={{ ...CAV, fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                Push Notifications
              </p>
              <p style={{ ...LOR, fontStyle: "italic", fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                Receive alerts for student activity
              </p>
            </div>
            <ToggleSwitch enabled={settings.push} onChange={(v) => updateSetting("push", v)} />
          </motion.div>
          <motion.div
            whileHover={{ y: -2 }}
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
            <div>
              <p style={{ ...CAV, fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                Email Reports
              </p>
              <p style={{ ...LOR, fontStyle: "italic", fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                Weekly digest of class performance
              </p>
            </div>
            <ToggleSwitch enabled={settings.email} onChange={(v) => updateSetting("email", v)} />
          </motion.div>
        </div>
      </motion.section>

      {/* Appearance Section */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.75rem",
          }}
        >
          <Sun size={16} strokeWidth={1.5} color="var(--orange)" />
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
            Appearance
          </span>
        </div>
        <motion.div
          whileHover={{ y: -2 }}
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
          <div>
            <p style={{ ...CAV, fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>
              Theme
            </p>
            <p style={{ ...LOR, fontStyle: "italic", fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
              Choose your preferred look
            </p>
          </div>
          <ThemeSelector currentTheme={settings.theme} onChange={(v) => updateSetting("theme", v)} />
        </motion.div>
      </motion.section>

      {/* Class Management Section */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.75rem",
          }}
        >
          <Users size={16} strokeWidth={1.5} color="var(--orange)" />
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
            Class Management
          </span>
        </div>
        <motion.div
          whileHover={{ y: -2 }}
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
          <div>
            <p style={{ ...CAV, fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>
              Student Enrollments
            </p>
            <p style={{ ...LOR, fontStyle: "italic", fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
              Allow students to self-enroll
            </p>
          </div>
          <ToggleSwitch enabled={settings.students} onChange={(v) => updateSetting("students", v)} />
        </motion.div>
      </motion.section>

      {/* App info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{ textAlign: "center", padding: "1rem" }}
      >
        <p style={{ ...COU, fontSize: "0.58rem", letterSpacing: "0.15em", color: "var(--text-muted)" }}>
          Vyasa v1.0 &middot; Schoolme Platform
        </p>
      </motion.div>
    </div>
  );
}
