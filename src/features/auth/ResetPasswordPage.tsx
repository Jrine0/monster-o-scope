import { useState, useMemo } from "react";
import { motion, cubicBezier } from "motion/react";
import { Link } from "@tanstack/react-router";
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { Input } from "@/components/ui/input";

/* --- Animation Constants --- */
const easeGentle =  cubicBezier(0.16, 1, 0.3, 1);
const durationSlow = 0.8;

const fadeUpProps = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: easeGentle },
};

/* --- Theme Constants --- */
const themeAccent = {
  glow: "0 0 24px rgba(242,116,13,0.15)",
  glowStrong: "0 0 32px rgba(242,116,13,0.22)",
};

/* Password Strength Logic */
function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Weak", color: "#ef4444" }; // red-500
  if (score <= 2) return { score, label: "Fair", color: "#f59e0b" }; // amber-500
  if (score <= 3) return { score, label: "Good", color: "var(--color-orange-500)" };
  return { score, label: "Strong", color: "#10b981" }; // emerald-500
}

export function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setotp] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const strength = useMemo(() => getPasswordStrength(newPassword), [newPassword]);
  const passwordsMatch = confirmPassword.length > 0 && newPassword === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!passwordsMatch || strength.score < 2) return;
    
    apiClient.post("/auth/reset-password", {
      email,
      new_password: newPassword,
      code: otp
    })
  };

  /* ------------------------------------------------------------------ */
  /* SUCCESS STATE VIEW                                                 */
  /* ------------------------------------------------------------------ */
  if (submitted) {
    return (
      <motion.div {...fadeUpProps} className="space-y-6 text-center">
        {/* Success icon — spring entrance with breathing glow pulse */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
          className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-full"
          style={{ backgroundColor: "rgba(16, 185, 129, 0.1)" }} // emerald bg
        >
          {/* Radiating pulse ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: "rgba(16, 185, 129, 0.06)" }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <CheckCircle size={28} strokeWidth={1.5} className="text-emerald-500" />
          </motion.div>
        </motion.div>

        <div>
          {/* Dramatic word reveal heading */}
          <motion.h1
            className="text-3xl font-display font-normal text-foreground"
            variants={{
              hidden: {},
              show: { transition: { delayChildren: 0.3, staggerChildren: 0.08 } },
            }}
            initial="hidden"
            animate="show"
          >
            {"Password reset".split(" ").map((word, i) => (
              <motion.span
                key={i}
                className="inline-block mr-2"
                variants={{
                  hidden: { opacity: 0, y: 16, scale: 0.9, filter: "blur(6px)" },
                  show: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: "blur(0px)",
                    transition: { duration: durationSlow, ease: easeGentle },
                  },
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          {/* Animated accent line */}
          <motion.div
            className="mx-auto mt-3 h-px bg-linear-to-r from-transparent via-emerald-500/60 to-transparent"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 80, opacity: 0.5 }}
            transition={{ delay: 0.7, duration: 0.7, ease: easeGentle }}
          />

          <motion.p
            className="text-sm text-muted-foreground mt-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Your password has been updated successfully.
          </motion.p>
        </div>

        {/* Sign In button with micro-interactions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.45 }}
          className="pt-2"
        >
          <motion.div
            whileHover={{ scale: 1.02, boxShadow: themeAccent.glowStrong }}
            whileTap={{ scale: 0.98 }}
            className="inline-block w-full"
          >
            <Link
              to="/login"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 text-sm font-semibold text-white transition-all duration-200 hover:bg-orange-600"
            >
              Back to Sign In
              <motion.span
                className="inline-flex"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              >
                <ArrowRight size={16} strokeWidth={2} />
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  /* ------------------------------------------------------------------ */
  /* DEFAULT FORM VIEW                                                  */
  /* ------------------------------------------------------------------ */
  return (
    <motion.div {...fadeUpProps} className="space-y-6">
      {/* Heading */}
      <div className="text-center">
        <motion.h1
          className="text-3xl font-display font-normal text-foreground"
          variants={{
            hidden: {},
            show: { transition: { delayChildren: 0.1, staggerChildren: 0.08 } },
          }}
          initial="hidden"
          animate="show"
        >
          {"Reset password".split(" ").map((word, i) => (
            <motion.span
              key={i}
              className="inline-block mr-2"
              variants={{
                hidden: { opacity: 0, y: 20, scale: 0.9, filter: "blur(8px)" },
                show: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  filter: "blur(0px)",
                  transition: { duration: durationSlow, ease: easeGentle },
                },
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Animated accent line */}
        <motion.div
          className="mx-auto mt-3 h-px bg-linear-to-r from-transparent via-orange-500/60 to-transparent"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 80, opacity: 0.5 }}
          transition={{ delay: 0.5, duration: 0.7, ease: easeGentle }}
        />

        <motion.p
          className="text-sm text-muted-foreground mt-3"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5, ease: easeGentle }}
        >
          Choose a strong password for your account.
        </motion.p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* New password field */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.45, ease: easeGentle }}
        >
          <label className="text-sm text-muted-foreground font-medium mb-1.5 block">
            New password
          </label>
          <div className="relative">
            <motion.span
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Lock size={16} strokeWidth={1.5} />
            </motion.span>
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
              minLength={8}
              className="flex h-12 w-full rounded-md border bg-background pl-10 pr-10 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground outline-none transition-all duration-200 border-input focus-visible:border-orange-500"
              style={{ boxShadow: "none" }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = themeAccent.glow;
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showNew ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
            </button>
          </div>

          {/* Strength indicator */}
          {newPassword.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-3 space-y-2"
            >
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((level) => (
                  <motion.div
                    key={level}
                    className="h-1 flex-1 rounded-full bg-muted"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.2, delay: level * 0.05 }}
                  >
                    <motion.div 
                      className="h-full rounded-full w-full origin-left"
                      style={{
                        backgroundColor: level <= strength.score ? strength.color : "transparent",
                      }}
                      layout
                    />
                  </motion.div>
                ))}
              </div>
              <p className="text-xs font-medium" style={{ color: strength.color }}>
                {strength.label}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Confirm password field */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.45, ease: easeGentle }}
        >
          <label className="text-sm text-muted-foreground font-medium mb-1.5 block">
            Confirm password
          </label>
          <div className="relative">
            <motion.span
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <Lock size={16} strokeWidth={1.5} />
            </motion.span>
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your password"
              required
              className={`flex h-12 w-full rounded-md border bg-background pl-10 pr-10 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground outline-none transition-all duration-200 ${
                passwordsMismatch
                  ? "border-destructive focus-visible:ring-destructive/30"
                  : passwordsMatch
                    ? "border-emerald-500 focus-visible:ring-emerald-500/30"
                    : "border-input focus-visible:border-orange-500"
              }`}
              style={{ boxShadow: "none" }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = passwordsMismatch 
                  ? "0 0 24px rgba(239,68,68,0.15)"
                  : themeAccent.glow;
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirm ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
            </button>
          </div>
          {passwordsMismatch && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-destructive mt-1.5"
            >
              Passwords do not match
            </motion.p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.45, ease: easeGentle }}
        >
          <label className="text-sm text-muted-foreground font-medium mb-1.5 block">
            E-mail
          </label>
          <div className="relative">
            <motion.span
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <Lock size={16} strokeWidth={1.5} />
            </motion.span>
            <Input
              type={"email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your E-mail"
              required
              className={`flex h-12 w-full rounded-md border bg-background pl-10 pr-10 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground outline-none transition-all duration-200 ${
                "border-input focus-visible:border-orange-500"
              }`}
              style={{ boxShadow: "none" }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = themeAccent.glow;
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.45, ease: easeGentle }}
        >
          <label className="text-sm text-muted-foreground font-medium mb-1.5 block">
            OTP
          </label>
          <div className="relative">
            <motion.span
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <Lock size={16} strokeWidth={1.5} />
            </motion.span>
            <Input
              type={"text"}
              value={otp}
              onChange={(e) => setotp(e.target.value)}
              placeholder="Enter your OTP"
              required
              className={`flex h-12 w-full rounded-md border bg-background pl-10 pr-10 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground outline-none transition-all duration-200 ${
                "border-input focus-visible:border-orange-500"
              }`}
              style={{ boxShadow: "none" }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = themeAccent.glow;
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>
        </motion.div>

        {/* Submit button */}
        <motion.button
          type="submit"
          disabled={!passwordsMatch || strength.score < 2}
          className="group mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-orange-500 text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600"
          whileHover={passwordsMatch && strength.score >= 2 ? { scale: 1.02, boxShadow: themeAccent.glowStrong } : {}}
          whileTap={passwordsMatch && strength.score >= 2 ? { scale: 0.98 } : {}}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.45, ease: easeGentle }}
        >
          Reset Password
          <motion.span
            className="inline-flex"
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          >
            <ArrowRight size={16} strokeWidth={2} />
          </motion.span>
        </motion.button>
      </form>
    </motion.div>
  );
}