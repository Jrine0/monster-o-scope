import { useState } from "react";
import { motion, cubicBezier } from "motion/react";
import { Link } from "@tanstack/react-router";
import { Mail, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { apiClient } from "@/lib/api-client";

/* --- Animation Constants --- */
const easeGentle = cubicBezier(0.16, 1, 0.3, 1);
const durationSlow = 0.8;

const fadeUpProps = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: easeGentle },
};

/* --- Unified Orange Theme Glows --- */
const themeAccent = {
  glow: "0 0 24px rgba(242,116,13,0.15)",
  glowStrong: "0 0 32px rgba(242,116,13,0.22)",
};

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();

    apiClient
      .post("/auth/forgot-password", {
        email,
      })
      .then((res) => (res.status == 200 ? setSubmitted(true) : undefined));
  };

  /* ------------------------------------------------------------------ */
  /* SUCCESS STATE VIEW                                                 */
  /* ------------------------------------------------------------------ */
  if (submitted) {
    return (
      <motion.div {...fadeUpProps} className="space-y-6 text-center">
        {/* Success icon — spring entrance with breathing glow */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: 0.1,
          }}
          className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-full"
          style={{ backgroundColor: "rgba(242, 116, 13, 0.1)" }}
        >
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: "rgba(242, 116, 13, 0.06)" }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <CheckCircle
              size={28}
              strokeWidth={1.5}
              className="text-orange-500"
            />
          </motion.div>
        </motion.div>

        <div>
          {/* Dramatic word reveal heading */}
          <motion.h1
            className="text-3xl font-display font-normal text-foreground"
            variants={{
              hidden: {},
              show: {
                transition: { delayChildren: 0.3, staggerChildren: 0.08 },
              },
            }}
            initial="hidden"
            animate="show"
          >
            {"Check your email".split(" ").map((word, i) => (
              <motion.span
                key={i}
                className="inline-block mr-2"
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 16,
                    scale: 0.9,
                    filter: "blur(6px)",
                  },
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
            transition={{ delay: 0.7, duration: 0.7, ease: easeGentle }}
          />

          <motion.p
            className="text-sm text-muted-foreground mt-3 leading-relaxed"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            We sent a password reset link to{" "}
            <span className="text-foreground font-medium">{email}</span>.
            <br />
            The link will expire in 30 minutes.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-orange-500 transition-colors hover:text-orange-400"
          >
            <ArrowLeft size={14} strokeWidth={2} />
            Back to login
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  /* ------------------------------------------------------------------ */
  /* DEFAULT FORM VIEW                                                  */
  /* ------------------------------------------------------------------ */
  return (
    <motion.div {...fadeUpProps} className="space-y-6">
      {/* Heading — dramatic word reveal */}
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
          {"Forgot password".split(" ").map((word, i) => (
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
          Enter your email and we&apos;ll send a reset link.
        </motion.p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.45, ease: easeGentle }}
        >
          <label className="text-sm text-muted-foreground font-medium mb-1.5 block">
            Email
          </label>
          <div className="relative">
            {/* Icon with breathing animation */}
            <motion.span
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Mail size={16} strokeWidth={1.5} />
            </motion.span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@school.edu"
              required
              className="flex h-12 w-full rounded-md border bg-background pl-10 pr-4 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground outline-none transition-all duration-200 border-input focus-visible:border-orange-500"
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

        {/* Button — enhanced micro-interactions */}
        <motion.button
          type="submit"
          className="group flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-orange-500 text-sm font-semibold text-white transition-all duration-200 hover:bg-orange-600"
          whileHover={{ scale: 1.02, boxShadow: themeAccent.glowStrong }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.45, ease: easeGentle }}
        >
          Send Reset Link
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
            <ArrowRight size={16} strokeWidth={2} />
          </motion.span>
        </motion.button>
      </form>

      {/* Back link */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.4 }}
      >
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm font-medium text-orange-500 transition-colors hover:text-orange-400"
        >
          <ArrowLeft size={14} strokeWidth={2} />
          Back to login
        </Link>
      </motion.div>
    </motion.div>
  );
}
