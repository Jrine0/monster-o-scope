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
} from "lucide-react";
import { fadeUpProps, ease } from "@/lib/animation";
import AccentLine from "@/components/accent-line";

/* ── Mock data ── */
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

/* ── Toggle component ── */
function Toggle({
  defaultChecked = false,
}: {
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => setChecked(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ${
        checked ? "bg-orange-500" : "bg-bg-muted"
      }`}
    >
      <motion.span
        className="inline-block h-4 w-4 rounded-full bg-white shadow-xs"
        animate={{ x: checked ? 24 : 4 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

/* ── Animation ── */
const fadeIn = (delay: number) => fadeUpProps(12, delay, 0.4, ease.standard);

/* ── Animated Background ── */
function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      {/* orange blob - top right */}
      <motion.div
        className="absolute -top-32 right-[10%] h-125 w-125 rounded-full opacity-[0.07]"
        style={{
          background: "radial-gradient(circle, #6571f5 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
        animate={{
          x: [0, 25, -20, 0],
          y: [0, -20, 15, 0],
          scale: [1, 1.05, 0.97, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      />
      {/* orange blob - bottom left */}
      <motion.div
        className="absolute bottom-[10%] left-[5%] h-100 w-100 rounded-full opacity-[0.06]"
        style={{
          background: "radial-gradient(circle, #6571f5 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
        animate={{
          x: [0, -15, 20, 0],
          y: [0, 20, -15, 0],
          scale: [1, 0.96, 1.04, 1],
        }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      />

      {/* Dot grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(101,113,245,0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`settings-particle-${i}`}
          className="absolute rounded-full"
          style={{
            width: i % 3 === 0 ? 3 : 2,
            height: i % 3 === 0 ? 3 : 2,
            left: `${14 + ((i * 12.8) % 72)}%`,
            top: `${28 + ((i * 10.5) % 52)}%`,
            background: i % 2 === 0
              ? "rgba(101,113,245,0.6)"
              : "rgba(101,113,245,0.35)",
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

export function SettingsPage() {
  return (
    <>
      <AnimatedBackground />
      <div className="relative space-y-8">
        {/* Header */}
        <motion.div {...fadeIn(0)}>
          <motion.h1
            initial={{ opacity: 0, y: -8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.4, ease: ease.standard }}
            className="text-heading-1 text-text-primary"
          >
            School Settings
          </motion.h1>
          <p className="text-body-md text-text-secondary mt-1">
            Configure your school profile, notifications, and preferences.
          </p>
          <AccentLine />
        </motion.div>

        {/* Feature Toggles link */}
        <motion.div {...fadeIn(0.05)}>
          <Link
            to="/admin/settings/features"
            className="flex items-center justify-between rounded-lg border border-border-subtle bg-bg-surface p-4 transition-all hover:border-border-default hover:shadow-[0_0_30px_rgba(101,113,245,0.06)] group"
          >
            <div className="flex items-center gap-3">
              <motion.div
                className="flex h-10 w-10 items-center justify-center rounded-md bg-orange-500/10"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <ToggleLeft
                  size={20}
                  className="text-orange-400"
                  strokeWidth={1.5}
                />
              </motion.div>
              <div>
                <p className="text-body-md text-text-primary font-medium">
                  Feature Toggles
                </p>
                <p className="text-body-sm text-text-muted">
                  Enable or disable platform features for your school
                </p>
              </div>
            </div>
            <ChevronRight
              size={18}
              className="text-text-muted group-hover:text-text-secondary transition-colors"
            />
          </Link>
        </motion.div>

        {/* School Profile */}
        <motion.div
          {...fadeIn(0.1)}
          className="rounded-lg border border-border-subtle bg-bg-surface transition-all hover:shadow-[0_0_30px_rgba(101,113,245,0.04)]"
        >
          <div className="flex items-center gap-2 border-b border-border-subtle px-5 py-4">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <School size={18} className="text-orange-400" strokeWidth={1.5} />
            </motion.div>
            <h2 className="text-heading-3 text-text-primary">School Profile</h2>
          </div>
          <div className="space-y-5 p-5">
            {/* School name */}
            <div>
              <label className="text-body-sm text-text-secondary font-medium mb-1.5 block">
                School Name
              </label>
              <input
                type="text"
                defaultValue="Delhi Public School, Vasant Kunj"
                className="w-full max-w-lg rounded-md border border-border-subtle bg-bg-elevated px-4 py-2.5 text-body-md text-text-primary outline-none transition-all focus:border-orange-500 focus:shadow-[0_0_20px_rgba(101,113,245,0.08)]"
              />
            </div>

            {/* Address */}
            <div>
              <label className="text-body-sm text-text-secondary font-medium mb-1.5 block">
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} strokeWidth={1.5} />
                  Address
                </span>
              </label>
              <textarea
                defaultValue="Sector B, Pocket 5, Vasant Kunj, New Delhi -- 110070"
                rows={3}
                className="w-full max-w-lg rounded-md border border-border-subtle bg-bg-elevated px-4 py-2.5 text-body-md text-text-primary outline-none transition-all focus:border-orange-500 focus:shadow-[0_0_20px_rgba(101,113,245,0.08)] resize-none"
              />
            </div>

            {/* Logo upload */}
            <div>
              <label className="text-body-sm text-text-secondary font-medium mb-1.5 block">
                <span className="flex items-center gap-1.5">
                  <Image size={13} strokeWidth={1.5} />
                  School Logo
                </span>
              </label>
              <div className="flex max-w-lg items-center gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-dashed border-border-default bg-bg-elevated">
                  <School size={24} className="text-text-muted" strokeWidth={1.5} />
                </div>
                <div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 rounded-md border border-border-subtle bg-bg-elevated px-4 py-2 text-body-sm text-text-secondary transition-colors hover:border-border-default hover:text-text-primary"
                  >
                    <Upload size={14} strokeWidth={1.5} />
                    Upload Logo
                  </motion.button>
                  <p className="text-caption text-text-muted mt-1.5">
                    PNG or SVG, max 2 MB. Recommended: 256 x 256px.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          {...fadeIn(0.18)}
          className="rounded-lg border border-border-subtle bg-bg-surface transition-all hover:shadow-[0_0_30px_rgba(101,113,245,0.04)]"
        >
          <div className="flex items-center gap-2 border-b border-border-subtle px-5 py-4">
            <motion.div
              animate={{
                rotate: [0, 15, -15, 0],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 3 }}
            >
              <Bell size={18} className="text-orange-400" strokeWidth={1.5} />
            </motion.div>
            <h2 className="text-heading-3 text-text-primary">Notifications</h2>
          </div>
          <div className="divide-y divide-border-subtle">
            {NOTIFICATION_SETTINGS.map((setting, i) => (
              <motion.div
                key={setting.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.05, duration: 0.3, ease: ease.standard }}
                className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-bg-elevated/50"
              >
                <div className="mr-4">
                  <p className="text-body-md text-text-primary">{setting.label}</p>
                  <p className="text-body-sm text-text-muted mt-0.5">
                    {setting.description}
                  </p>
                </div>
                <Toggle defaultChecked={setting.defaultOn} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Display */}
        <motion.div
          {...fadeIn(0.26)}
          className="rounded-lg border border-border-subtle bg-bg-surface transition-all hover:shadow-[0_0_30px_rgba(101,113,245,0.04)]"
        >
          <div className="flex items-center gap-2 border-b border-border-subtle px-5 py-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Globe size={18} className="text-orange-400" strokeWidth={1.5} />
            </motion.div>
            <h2 className="text-heading-3 text-text-primary">Display</h2>
          </div>
          <div className="p-5">
            <div>
              <label className="text-body-sm text-text-secondary font-medium mb-1.5 block">
                Timezone
              </label>
              <div className="relative max-w-sm">
                <select
                  defaultValue={TIMEZONES[0]}
                  className="w-full appearance-none rounded-md border border-border-subtle bg-bg-elevated px-4 py-2.5 text-body-md text-text-primary outline-none transition-all focus:border-orange-500 focus:shadow-[0_0_20px_rgba(101,113,245,0.08)]"
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Save button */}
        <motion.div {...fadeIn(0.32)} className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-6 py-2.5 text-body-sm font-medium text-white shadow-sm transition-colors hover:bg-orange-600"
          >
            <Save size={16} strokeWidth={1.5} />
            Save Changes
          </motion.button>
        </motion.div>
      </div>
    </>
  );
}
