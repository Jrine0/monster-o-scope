// StudentProfile.tsx — react-hook-form + zod migration
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import {
  Hash,
  Mail,
  School,
  Lock,
  Eye,
  EyeOff,
  Check,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import {
  ease,
  cardReveal,
  staggerContainer,
  duration,
} from "@/lib/animation";
import { changePasswordSchema, type ChangePasswordFormData } from "./schemas/profile.schemas";
import { fetchMe, type StudentUser } from "./api/student.api";
import { useAuthStore } from "@/stores/useAuthStore";

/* ── Floating particles ── */
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
  const [user, setUser] = useState<StudentUser | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);

  const school = useAuthStore((s) => s.school);

  useEffect(() => {
    fetchMe()
      .then(setUser)
      .catch(() => setUserError("Failed to load profile."))
      .finally(() => setUserLoading(false));
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onPasswordSubmit = async (data: ChangePasswordFormData) => {
    try {
      // TODO: wire up PATCH /v1/students/me/password once backend adds endpoint
      console.log("Password change:", data);
      setPasswordSaved(true);
      setTimeout(() => setPasswordSaved(false), 3000);
      reset();
    } catch {
      // handle API error
    }
  };

  const avatarInitials = user
    ? `${user.first_name[0] ?? ""}${user.last_name[0] ?? ""}`.toUpperCase()
    : "";

  return (
    <div className="relative max-w-[640px] mx-auto space-y-8 pb-12">
      {/* ── Animated background blob ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-32 left-1/3 h-[400px] w-[400px] rounded-full opacity-[0.05]"
          style={{
            background: "radial-gradient(circle, #f2740d 0%, #fb923c 40%, transparent 70%)",
            filter: "blur(100px)",
          }}
          animate={{ x: [0, 20, -15, 0], y: [0, -15, 10, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -right-20 h-[350px] w-[350px] rounded-full opacity-[0.04]"
          style={{
            background: "radial-gradient(circle, #fb923c 0%, #f59e0b 40%, transparent 70%)",
            filter: "blur(100px)",
          }}
          animate={{ x: [0, -20, 15, 0], y: [0, 20, -10, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
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
            animate={{ y: [0, -500, -1000], opacity: [0, 0.2, 0] }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.6, ease: ease.gentle }}
      >
        <h1 className="font-[Caveat,cursive] text-[clamp(2rem,5vw,3rem)] font-normal text-[var(--text-primary)] leading-tight">
          Profile
        </h1>
        <p className="font-[Lora,Georgia,serif] italic text-base text-[var(--text-secondary)] mt-1">
          Your student account details
        </p>
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

      {/* ── Profile card ── */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: ease.gentle }}
        whileHover={{ y: -3 }}
        className="relative rounded-xl border border-[var(--border-subtle)] p-6 overflow-hidden transition-shadow"
        style={{ backgroundColor: "var(--bg-surface)" }}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 hover:opacity-100"
          style={{
            background: "radial-gradient(ellipse at 30% 30%, rgba(242,116,13,0.04) 0%, transparent 70%)",
          }}
        />

        {/* Avatar + Name */}
        <div className="relative z-10 flex items-center gap-5 mb-6">
          {userLoading ? (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-orange-500/15 border border-orange-500/20">
              <Loader2 size={24} className="animate-spin" style={{ color: "var(--orange)" }} />
            </div>
          ) : userError ? (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
              <AlertCircle size={24} style={{ color: "#f87171" }} />
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-orange-500/15 border border-orange-500/20"
            >
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={avatarInitials}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <span
                  className="font-[Caveat,cursive] text-2xl font-bold"
                  style={{ color: "var(--orange)" }}
                >
                  {avatarInitials}
                </span>
              )}
            </motion.div>
          )}
          <div>
            {userLoading ? (
              <>
                <div
                  className="h-6 w-40 rounded animate-pulse mb-1"
                  style={{ background: "var(--bg-elevated)" }}
                />
                <div
                  className="h-4 w-24 rounded animate-pulse"
                  style={{ background: "var(--bg-elevated)" }}
                />
              </>
            ) : userError ? (
              <div className="flex items-center gap-2">
                <AlertCircle size={16} style={{ color: "#f87171" }} />
                <span className="text-sm text-red-400">{userError}</span>
                <button
                  onClick={() => {
                    setUserLoading(true);
                    setUserError(null);
                    fetchMe()
                      .then(setUser)
                      .catch(() => setUserError("Failed to load profile."))
                      .finally(() => setUserLoading(false));
                  }}
                  className="flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 transition-colors"
                >
                  <RefreshCw size={12} /> Retry
                </button>
              </div>
            ) : (
              <>
                <h2 className="font-[Caveat,cursive] text-2xl font-bold text-[var(--text-primary)]">
                  {user?.first_name} {user?.last_name}
                </h2>
                <p className="text-sm text-[var(--text-secondary)]">
                  {user?.roles?.length ? user?.roles?.map((r) => r.charAt(0).toUpperCase() + r.slice(1)).join(", ") : "Student"}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="h-px bg-[var(--border-subtle)] mb-5" />

        {/* Info grid */}
        <motion.div
          variants={profileInfoContainer}
          initial="hidden"
          animate="show"
          className="relative z-10 space-y-4"
        >
          {[
            { icon: Hash, label: "Student ID", value: user?.student_id ?? "—", isMono: true },
            { icon: Mail, label: "Email", value: user?.email ?? "—", isMono: false },
            { icon: School, label: "School", value: school?.school_name ?? user?.school_id ?? "—", isMono: false },
          ].map((field) => {
            const Icon = field.icon;
            return (
              <motion.div key={field.label} variants={profileInfoItem} className="flex items-start gap-3">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: "var(--bg-elevated)" }}
                >
                  <Icon size={16} strokeWidth={1.5} style={{ color: "var(--text-muted)" }} />
                </motion.div>
                <div>
                  <p className="text-xs text-[var(--text-muted)]">{field.label}</p>
                  <p className={`text-sm text-[var(--text-primary)] ${field.isMono ? "font-mono" : ""}`}>
                    {userLoading ? (
                      <span className="inline-block h-4 w-32 rounded animate-pulse" style={{ background: "var(--bg-elevated)" }} />
                    ) : (
                      field.value
                    )}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* ── Change Password ── */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: ease.gentle }}
        whileHover={{ y: -3 }}
        className="relative rounded-xl border border-[var(--border-subtle)] p-6 overflow-hidden transition-shadow"
        style={{ backgroundColor: "var(--bg-surface)" }}
      >
        <h2 className="font-[Caveat,cursive] text-xl font-bold text-[var(--text-primary)] mb-1">
          Change Password
        </h2>
        <p className="text-xs text-[var(--text-secondary)] mb-5">
          Update your login password. Contact your school admin if you forget it.
        </p>

        <form onSubmit={handleSubmit(onPasswordSubmit)} noValidate className="space-y-4">
          {/* Current password */}
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4, ease: ease.gentle }}
          >
            <label className="text-xs text-[var(--text-secondary)] font-medium mb-1.5 block">
              Current Password
            </label>
            <div className="relative">
              <div
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--text-muted)" }}
              >
                <Lock size={16} strokeWidth={1.5} />
              </div>
              <input
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Enter current password"
                autoComplete="current-password"
                className="w-full rounded-lg border bg-[var(--bg-elevated)] py-3 pl-10 pr-10 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition-colors focus:border-orange-500/40"
                style={{
                  borderColor: errors.currentPassword ? "#f87171" : "var(--border-default)",
                }}
                {...register("currentPassword")}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: "var(--text-muted)" }}
              >
                {showCurrentPassword ? (
                  <EyeOff size={16} strokeWidth={1.5} />
                ) : (
                  <Eye size={16} strokeWidth={1.5} />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="mt-1 text-xs" style={{ color: "#f87171" }}>{errors.currentPassword.message}</p>
            )}
          </motion.div>

          {/* New password */}
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.38, duration: 0.4, ease: ease.gentle }}
          >
            <label className="text-xs text-[var(--text-secondary)] font-medium mb-1.5 block">
              New Password
            </label>
            <div className="relative">
              <div
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--text-muted)" }}
              >
                <Lock size={16} strokeWidth={1.5} />
              </div>
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Min 8 chars, uppercase + number"
                autoComplete="new-password"
                className="w-full rounded-lg border bg-[var(--bg-elevated)] py-3 pl-10 pr-10 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition-colors focus:border-orange-500/40"
                style={{
                  borderColor: errors.newPassword ? "#f87171" : "var(--border-default)",
                }}
                {...register("newPassword")}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: "var(--text-muted)" }}
              >
                {showNewPassword ? (
                  <EyeOff size={16} strokeWidth={1.5} />
                ) : (
                  <Eye size={16} strokeWidth={1.5} />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-1 text-xs" style={{ color: "#f87171" }}>{errors.newPassword.message}</p>
            )}
          </motion.div>

          {/* Confirm password */}
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.46, duration: 0.4, ease: ease.gentle }}
          >
            <label className="text-xs text-[var(--text-secondary)] font-medium mb-1.5 block">
              Confirm New Password
            </label>
            <div className="relative">
              <div
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--text-muted)" }}
              >
                <Lock size={16} strokeWidth={1.5} />
              </div>
              <input
                type="password"
                placeholder="Repeat new password"
                autoComplete="new-password"
                className="w-full rounded-lg border bg-[var(--bg-elevated)] py-3 pl-10 pr-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition-colors focus:border-orange-500/40"
                style={{
                  borderColor: errors.confirmPassword ? "#f87171" : "var(--border-default)",
                }}
                {...register("confirmPassword")}
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs" style={{ color: "#f87171" }}>{errors.confirmPassword.message}</p>
            )}
          </motion.div>

          {/* Submit */}
          <motion.div
            className="pt-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.54, duration: 0.4, ease: ease.gentle }}
          >
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={!isSubmitting ? { scale: 1.02 } : {}}
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              className="flex items-center gap-2 rounded-lg px-5 py-2.5 font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "#f2740d",
                color: "#07080d",
              }}
            >
              {passwordSaved ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <Check size={18} strokeWidth={1.5} />
                </motion.div>
              ) : null}
              {passwordSaved ? "Password Updated" : isSubmitting ? "Updating..." : "Update Password"}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
