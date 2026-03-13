import { useState, useRef } from "react";
import { motion, AnimatePresence, cubicBezier } from "motion/react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Mail,
  Lock,
  IdCard,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import InputField from "@/components/input-field";

/* --- Import your configured store and API client --- */
import { useAuthStore } from "@/stores/useAuthStore";
import { apiClient } from "@/lib/api-client";

/* ------------------------------------------------------------------ */
/* Types & constants                                                  */
/* ------------------------------------------------------------------ */

type LoginMode = "teacher" | "student" | "admin";

const MODES: { key: LoginMode; label: string }[] = [
  { key: "teacher", label: "Teacher" },
  { key: "student", label: "Student" },
  { key: "admin", label: "Admin" },
];

/** Map user role to their portal root */
const ROLE_DASHBOARD: Record<LoginMode, string> = {
  admin: "/admin",
  teacher: "/teacher",
  student: "/student",
};

/* Unified Orange Theme Tokens */
const themeAccent = {
  color: "var(--color-orange-500)",
  glow: "0 0 24px rgba(242,116,13,0.15)",
  glowStrong: "0 0 32px rgba(242,116,13,0.25)",
  pillBg: "rgba(242,116,13,0.12)",
  pillBorder: "rgba(242,116,13,0.25)",
  bgClass: "bg-orange-500",
  hoverBgClass: "hover:bg-orange-600",
  errorGlow: "0 0 24px rgba(239,68,68,0.15)",
};

/* Animations */
const tabSpring = { type: "spring" as const, stiffness: 400, damping: 32 };
const easeGentle = cubicBezier(0.16, 1, 0.3, 1);

export function LoginPage() {
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);

  /* Bring in Zustand actions */
  const setSession = useAuthStore((s) => s.setSession);

  const [mode, setMode] = useState<LoginMode>("teacher");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  /* Form field state */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [studentId, setStudentId] = useState("");

  /* Submission state */
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---- Read form values (handles browser autofill) ----------------- */
  function getFormValues() {
    const form = formRef.current;
    if (!form) return { identity: email || studentId, pass: password };

    const identityInput = form.querySelector<HTMLInputElement>(
      mode === "student" ? 'input[type="text"]' : 'input[type="email"]',
    );
    const passInput =
      form.querySelector<HTMLInputElement>('input[type="password"]') ??
      form.querySelector<HTMLInputElement>(
        'input[type="text"][placeholder="Enter your password"]',
      );

    return {
      identity:
        identityInput?.value?.trim() ??
        (mode === "student" ? studentId : email).trim(),
      pass: passInput?.value ?? password,
    };
  }

  function validate(identity: string, pass: string): string | null {
    if (mode === "student") {
      if (!identity) return "Student ID is required";
    } else {
      if (!identity) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identity))
        return "Please enter a valid email address";
    }
    if (!pass) return "Password is required";
    if (pass.length < 6) return "Password must be at least 6 characters";
    return null;
  }

  /* ---- Submit Flow (Connected to Vyasa API) --------------- */
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const { identity, pass } = getFormValues();

    const validationError = validate(identity, pass);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      /* * 1. Structure the payload.
       * (Check your Swagger UI to see if the API expects `email` vs `username`.
       * If FastAPI expects OAuth2 Form Data, you may need to map this to `username`.)
       */
      const payload =
        mode === "student"
          ? { student_id: identity, password: pass }
          : { email: identity, password: pass }; // Change "email" to "username" if your FastAPI requires it

      /* 2. Make the API request */
      const response = await apiClient.post("/auth/login", payload);

      /* * 3. Extract the token and user.
       * Note: Your apiClient interceptor automatically unwraps the { data: ... } envelope,
       * so response.data directly contains the inner object.
       */
      const { access_token, user } = response.data;

      /* 4. Save to Zustand store */
      setSession(access_token, user);

      /* 5. Navigate to the appropriate portal */
      const destination = ROLE_DASHBOARD[mode] ?? "/teacher";
      navigate({ to: destination });
    } catch (err: any) {
      /* Leverage the ApiRequestError created in your api-client interceptor */
      if (err.apiError) {
        setError(err.apiError.message);
      } else if (err.response?.data?.detail) {
      /* Fallback for standard FastAPI validation errors (422 Unprocessable Entity) */
        setError(
          typeof err.response.data.detail === "string"
            ? err.response.data.detail
            : "Invalid fields provided.",
        );
      } else {
      /* Fallback for network or unknown errors */
        setError("Invalid credentials or server error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: easeGentle }}
      className="space-y-6"
    >
      {/* ---- Heading ---- */}
      <div className="text-center">
        <motion.h1
          className="font-display text-3xl font-normal text-foreground"
          variants={{
            hidden: {},
            show: { transition: { delayChildren: 0.1, staggerChildren: 0.08 } },
          }}
          initial="hidden"
          animate="show"
        >
          {"Welcome back".split(" ").map((word, i) => (
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
                  transition: { duration: 0.8, ease: easeGentle },
                },
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        <motion.div
          className="mx-auto mt-3 h-px bg-linear-to-r from-transparent via-orange-500/60 to-transparent"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 100, opacity: 0.5 }}
          transition={{ delay: 0.5, duration: 0.7, ease: easeGentle }}
        />

        <motion.p
          className="mt-3 text-sm text-muted-foreground"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: easeGentle }}
        >
          Sign in to continue to Vyasa
        </motion.p>
      </div>

      {/* ---- Three-way pill toggle ---- */}
      <motion.div
        className="relative flex rounded-full bg-muted/50 p-1 border border-border/50"
        initial={{ opacity: 0, y: 10, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.25, duration: 0.5, ease: easeGentle }}
      >
        {MODES.map((m) => {
          const isActive = mode === m.key;
          return (
            <button
              key={m.key}
              type="button"
              disabled={isLoading}
              onClick={() => {
                setMode(m.key);
                setShowPassword(false);
                setError(null);
              }}
              className={`relative z-10 flex-1 rounded-full py-2.5 text-sm font-semibold transition-colors duration-200 ${
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground/80"
              } ${isLoading ? "cursor-not-allowed opacity-60" : ""}`}
            >
              {m.label}
              {isActive && (
                <motion.div
                  layoutId="login-mode-indicator"
                  className="absolute inset-0 rounded-full -z-10"
                  style={{
                    backgroundColor: themeAccent.pillBg,
                    border: `1px solid ${themeAccent.pillBorder}`,
                  }}
                  transition={tabSpring}
                />
              )}
            </button>
          );
        })}
      </motion.div>

      {/* ---- Error message ---- */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.25, ease: easeGentle }}
            className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- Form ---- */}
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* Identity field */}
            {mode === "student" ? (
              <InputField
                label="Student ID"
                icon={<IdCard size={18} strokeWidth={1.5} />}
                type="text"
                value={studentId}
                onChange={setStudentId}
                placeholder="Enter your student ID"
                disabled={isLoading}
                hasError={!!error && !studentId.trim()}
              />
            ) : (
              <InputField
                label="Email address"
                icon={<Mail size={18} strokeWidth={1.5} />}
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="you@school.edu"
                disabled={isLoading}
                hasError={!!error && !email.trim()}
              />
            )}

            {/* Password field */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                Password
              </label>
              <div className="relative">
                <motion.span
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Lock size={18} strokeWidth={1.5} />
                </motion.span>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  className={`flex h-12 w-full rounded-md border bg-background pl-10 pr-11 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground outline-none transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
                    error && !password
                      ? "border-destructive focus-visible:ring-destructive/30"
                      : "border-input focus-visible:border-orange-500"
                  }`}
                  onFocus={(e) => {
                    e.currentTarget.style.boxShadow =
                      error && !password
                        ? themeAccent.errorGlow
                        : themeAccent.glow;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-150 hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff size={18} strokeWidth={1.5} />
                  ) : (
                    <Eye size={18} strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Remember me / Forgot password */}
        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 select-none">
            <button
              type="button"
              role="checkbox"
              aria-checked={rememberMe}
              onClick={() => setRememberMe((prev) => !prev)}
              className={`flex size-4.5 items-center justify-center rounded border transition-all duration-150 ${
                rememberMe
                  ? "border-orange-500 bg-orange-500 text-primary-foreground"
                  : "border-input bg-background hover:border-orange-500/50"
              }`}
            >
              {rememberMe && <Check size={12} strokeWidth={2.5} />}
            </button>
            <span className="text-sm text-muted-foreground">Remember me</span>
          </label>

          <AnimatePresence>
            {mode !== "student" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
              >
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium transition-colors duration-150 text-orange-500 hover:text-orange-400"
                >
                  Forgot password?
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Submit button */}
        <motion.button
          type="submit"
          disabled={isLoading}
          className={`group flex h-12 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold text-white transition-colors duration-200 ${themeAccent.bgClass} ${themeAccent.hoverBgClass} ${
            isLoading ? "cursor-not-allowed opacity-80" : ""
          }`}
          whileHover={
            isLoading ? {} : { scale: 1.02, boxShadow: themeAccent.glowStrong }
          }
          whileTap={isLoading ? {} : { scale: 0.98 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign in
              <motion.span
                className="inline-flex"
                animate={{ x: [0, 3, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2,
                }}
              >
                <ArrowRight size={16} strokeWidth={2.5} />
              </motion.span>
            </>
          )}
        </motion.button>
      </form>

      {/* Footer note */}
      <motion.p
        className="text-center text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        Don&apos;t have an account?{" "}
        <span className="text-foreground font-medium">Contact your admin</span>
      </motion.p>
    </motion.div>
  );
}
