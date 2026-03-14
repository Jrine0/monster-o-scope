import { useState } from "react";
import { motion } from "motion/react";
import {
  User,
  School,
  Hash,
  Lock,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";
import {
  ease,
  cardReveal,
  staggerContainer,
  duration,
} from "@/lib/animation";

/* ── Mock student data ── */
const STUDENT = {
  name: "Rahul Kumar",
  studentId: "STU-2024-0042",
  class: "10-A",
  school: "Delhi Public School, Mathura Road",
  email: "rahul.kumar@student.dps.edu",
  joined: "August 2024",
};

/* ── Floating particles for warm light theme ── */
const PARTICLES = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  left: `${12 + i * 15}%`,
  delay: i * 1.0,
  duration: 7 + (i % 3) * 2,
  size: 2,
}));

/* ── Animation variants ── */
const profileInfoContainer = staggerContainer(0.08, 0.3);
const profileInfoItem = cardReveal(12, duration.fast);

export function StudentProfile() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 3000);
  };

  return (
    <div className="relative max-w-[640px] mx-auto space-y-8 pb-12">
      {/* ── Animated background blob (warm light theme) ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-32 left-1/3 h-[400px] w-[400px] rounded-full opacity-[0.05]"
          style={{
            background: "radial-gradient(circle, #f2740d 0%, #fb923c 40%, transparent 70%)",
            filter: "blur(100px)",
          }}
          animate={{
            x: [0, 20, -15, 0],
            y: [0, -15, 10, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -right-20 h-[350px] w-[350px] rounded-full opacity-[0.04]"
          style={{
            background: "radial-gradient(circle, #fb923c 0%, #f59e0b 40%, transparent 70%)",
            filter: "blur(100px)",
          }}
          animate={{
            x: [0, -20, 15, 0],
            y: [0, 20, -10, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(circle, #f2740d 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* ── Floating particles ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              left: p.left,
              bottom: -10,
              backgroundColor: "#f2740d",
              opacity: 0,
            }}
            animate={{
              y: [0, -500, -1000],
              opacity: [0, 0.2, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* ── Header with blur entrance ── */}
      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.6, ease: ease.gentle }}
      >
        <h1 className="text-display-md text-text-primary">Profile</h1>
        <p className="text-body-lg text-text-secondary mt-1">
          Your student account details
        </p>
        {/* Animated accent line */}
        <motion.div
          className="h-px mt-4"
          style={{
            background: "linear-gradient(90deg, transparent, #f2740d, #fb923c, transparent)",
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: ease.gentle }}
        />
      </motion.div>

      {/* ── Profile card with hover effect ── */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: ease.gentle }}
        whileHover={{ y: -3, boxShadow: "0 4px 20px rgba(242,116,13,0.06)" }}
        className="relative rounded-xl border border-border-subtle p-6 overflow-hidden transition-shadow"
        style={{ backgroundColor: "var(--color-portal-student-surface)" }}
      >
        {/* Hover glow overlay */}
        <div
          className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 hover:opacity-100"
          style={{
            background: "radial-gradient(ellipse at 30% 30%, rgba(242,116,13,0.04) 0%, transparent 70%)",
          }}
        />

        {/* Avatar + Name */}
        <div className="relative z-10 flex items-center gap-5 mb-6">
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-orange-500/15 border border-orange-500/20"
          >
            <span className="text-heading-1 text-orange-400 font-semibold">RK</span>
          </motion.div>
          <div>
            <h2 className="text-heading-1 text-text-primary">{STUDENT.name}</h2>
            <p className="text-body-md text-text-secondary">{STUDENT.class}</p>
          </div>
        </div>

        <div className="h-px bg-border-subtle mb-5" />

        {/* Info grid with stagger */}
        <motion.div
          variants={profileInfoContainer}
          initial="hidden"
          animate="show"
          className="relative z-10 space-y-4"
        >
          {[
            { icon: Hash, label: "Student ID", value: STUDENT.studentId, isMono: true },
            { icon: School, label: "School", value: STUDENT.school },
            { icon: User, label: "Class", value: STUDENT.class },
          ].map((field) => {
            const Icon = field.icon;
            return (
              <motion.div
                key={field.label}
                variants={profileInfoItem}
                className="flex items-start gap-3"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bg-elevated"
                >
                  <Icon size={16} strokeWidth={1.5} className="text-text-muted" />
                </motion.div>
                <div>
                  <p className="text-body-sm text-text-muted">{field.label}</p>
                  <p className={`text-body-md text-text-primary ${field.isMono ? "font-mono" : ""}`}>
                    {field.value}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* ── Change Password with hover effect ── */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: ease.gentle }}
        whileHover={{ y: -3, boxShadow: "0 4px 20px rgba(242,116,13,0.06)" }}
        className="relative rounded-xl border border-border-subtle p-6 overflow-hidden transition-shadow"
        style={{ backgroundColor: "var(--color-portal-student-surface)" }}
      >
        <h2 className="text-heading-2 text-text-primary mb-1">Change Password</h2>
        <p className="text-body-sm text-text-secondary mb-5">
          Update your login password. Contact your school admin if you forget it.
        </p>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {/* Current password */}
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4, ease: ease.gentle }}
          >
            <label className="text-body-sm text-text-secondary font-medium mb-1.5 block">
              Current Password
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                <Lock size={16} strokeWidth={1.5} />
              </div>
              <input
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Enter current password"
                className="w-full rounded-lg border border-border-default bg-bg-elevated py-3 pl-10 pr-10 text-body-md text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-orange-500/40"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
              >
                {showCurrentPassword ? (
                  <EyeOff size={16} strokeWidth={1.5} />
                ) : (
                  <Eye size={16} strokeWidth={1.5} />
                )}
              </button>
            </div>
          </motion.div>

          {/* New password */}
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.38, duration: 0.4, ease: ease.gentle }}
          >
            <label className="text-body-sm text-text-secondary font-medium mb-1.5 block">
              New Password
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                <Lock size={16} strokeWidth={1.5} />
              </div>
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                className="w-full rounded-lg border border-border-default bg-bg-elevated py-3 pl-10 pr-10 text-body-md text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-orange-500/40"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
              >
                {showNewPassword ? (
                  <EyeOff size={16} strokeWidth={1.5} />
                ) : (
                  <Eye size={16} strokeWidth={1.5} />
                )}
              </button>
            </div>
          </motion.div>

          {/* Confirm password */}
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.46, duration: 0.4, ease: ease.gentle }}
          >
            <label className="text-body-sm text-text-secondary font-medium mb-1.5 block">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                <Lock size={16} strokeWidth={1.5} />
              </div>
              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full rounded-lg border border-border-default bg-bg-elevated py-3 pl-10 pr-4 text-body-md text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-orange-500/40"
              />
            </div>
          </motion.div>

          {/* Submit with micro-interaction */}
          <motion.div
            className="pt-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.54, duration: 0.4, ease: ease.gentle }}
          >
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-body-md font-semibold text-text-inverse transition-all duration-200 hover:bg-orange-400 hover:shadow-glow-orange"
            >
              {passwordSaved ? (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <Check size={18} strokeWidth={1.5} />
                  </motion.div>
                  Password Updated
                </>
              ) : (
                "Update Password"
              )}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
