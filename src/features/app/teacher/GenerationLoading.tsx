import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { ease, fadeUpProps } from "@/lib/animation";

/* ── Steps ── */
const STEPS = [
  { label: "Analyzing topic", duration: 3000 },
  { label: "Generating content", duration: 5000 },
  { label: "Creating questions", duration: 4000 },
  { label: "Formatting output", duration: 3000 },
] as const;

const TOTAL_DURATION = STEPS.reduce((sum, s) => sum + s.duration, 0);

/* ── Floating particle ── */
function Particle({ delay, x, size }: { delay: number; x: number; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        bottom: -10,
        background: `radial-gradient(circle, rgba(242,116,13,${0.15 + Math.random() * 0.2}), transparent)`,
      }}
      initial={{ opacity: 0, y: 0 }}
      animate={{
        opacity: [0, 0.8, 0],
        y: [-20, -180 - Math.random() * 100],
        x: [0, (Math.random() - 0.5) * 60],
      }}
      transition={{
        duration: 4 + Math.random() * 3,
        delay,
        repeat: Infinity,
        ease: "easeOut",
      }}
    />
  );
}

/* ── Orbiting dot ── */
function OrbitDot({ delay, radius, duration }: { delay: number; radius: number; duration: number }) {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{ width: radius * 2, height: radius * 2, marginLeft: -radius, marginTop: -radius }}
      animate={{ rotate: 360 }}
      transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
    >
      <motion.div
        className="absolute top-0 left-1/2 -ml-1 h-2 w-2 rounded-full bg-orange-500/40"
        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

/* ── Floating page-level particle for background ── */
function FloatingParticle({ delay, x, size }: { delay: number; x: number; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        bottom: -10,
        background: `radial-gradient(circle, rgba(242,116,13,${0.18 + Math.random() * 0.15}), transparent)`,
      }}
      initial={{ opacity: 0, y: 0 }}
      animate={{
        opacity: [0, 0.7, 0],
        y: [-10, -200 - Math.random() * 120],
        x: [0, (Math.random() - 0.5) * 50],
      }}
      transition={{
        duration: 5 + Math.random() * 4,
        delay,
        repeat: Infinity,
        ease: "easeOut",
      }}
    />
  );
}

export function GenerationLoading() {
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);

  /* Step progression */
  useEffect(() => {
    let elapsed = 0;
    const interval = setInterval(() => {
      elapsed += 100;

      /* Calculate which step we're in */
      let cumulative = 0;
      for (let i = 0; i < STEPS.length; i++) {
        cumulative += STEPS[i].duration;
        if (elapsed < cumulative) {
          setActiveStep(i);
          break;
        }
        if (i === STEPS.length - 1) {
          setActiveStep(STEPS.length);
        }
      }

      /* Overall progress */
      const pct = Math.min((elapsed / TOTAL_DURATION) * 100, 100);
      setProgress(pct);

      if (elapsed >= TOTAL_DURATION) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  /* Remaining time */
  const elapsedMs = (progress / 100) * TOTAL_DURATION;
  const remainingSeconds = Math.max(0, Math.ceil((TOTAL_DURATION - elapsedMs) / 1000));

  return (
    <div className="relative flex min-h-[70vh] items-center justify-center">
      {/* ── Animated page background ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Orange gradient blob */}
        <motion.div
          className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, rgba(242,116,13,0.6), transparent 70%)", filter: "blur(100px)" }}
          animate={{ scale: [1, 1.2, 1], x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, rgba(242,116,13,0.5), transparent 70%)", filter: "blur(100px)" }}
          animate={{ scale: [1, 1.15, 1], x: [0, -25, 0], y: [0, 20, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Dot grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(242,116,13,0.8) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Floating page particles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <FloatingParticle
            key={`bg-${i}`}
            delay={i * 1.0}
            x={6 + (i * 12) % 88}
            size={2 + (i % 3)}
          />
        ))}
      </div>

      <div className="relative w-full max-w-lg">
        {/* Background glow */}
        <motion.div
          className="absolute inset-0 -m-24 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(242,116,13,0.15), transparent 70%)" }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating particles */}
        <div className="pointer-events-none absolute inset-0 -m-16 overflow-hidden">
          {Array.from({ length: 14 }).map((_, i) => (
            <Particle
              key={i}
              delay={i * 0.6}
              x={10 + (i * 6.5) % 80}
              size={3 + (i % 4) * 2}
            />
          ))}
        </div>

        {/* Orbiting dots */}
        <div className="pointer-events-none absolute inset-0">
          <OrbitDot delay={0} radius={140} duration={12} />
          <OrbitDot delay={3} radius={120} duration={9} />
          <OrbitDot delay={6} radius={160} duration={15} />
        </div>

        {/* Content card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: ease.gentle }}
          className="group relative rounded-[var(--radius-xl)] border border-border-subtle bg-bg-surface p-8 shadow-lg"
        >
          {/* Card hover glow */}
          <div className="pointer-events-none absolute inset-0 rounded-[var(--radius-xl)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-orange-500/[0.03] via-transparent to-orange-500/[0.02]" />

          {/* Title */}
          <motion.h1
            className="text-display-md text-text-primary text-center italic"
            {...fadeUpProps(12, 0.2, 0.6)}
          >
            Crafting your lesson plan...
          </motion.h1>

          <motion.p
            className="mt-2 text-body-sm text-text-muted text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Atoms and Molecules &middot; Class 9 Chemistry
          </motion.p>

          {/* Animated accent line */}
          <motion.div
            className="mx-auto mt-4 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "60%", opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: ease.gentle }}
          />

          {/* Progress bar */}
          <motion.div
            className="mt-8 h-1.5 w-full overflow-hidden rounded-full bg-bg-muted"
            initial={{ opacity: 0, scaleX: 0.8 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, var(--color-orange-600), var(--color-orange-400), var(--color-orange-500))",
                backgroundSize: "200% 100%",
              }}
              animate={{
                width: `${progress}%`,
                backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
              }}
              transition={{
                width: { duration: 0.3, ease: "linear" },
                backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" },
              }}
            />
          </motion.div>

          {/* Steps */}
          <div className="mt-8 space-y-0">
            {STEPS.map((step, i) => {
              const isCompleted = i < activeStep;
              const isActive = i === activeStep && activeStep < STEPS.length;
              const isPending = i > activeStep;

              return (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, delay: 0.6 + i * 0.1, ease: ease.gentle }}
                  className="flex items-center gap-4 py-3"
                >
                  {/* Step indicator */}
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center">
                    <AnimatePresence mode="wait">
                      {isCompleted ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 25 }}
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15"
                        >
                          <Check size={14} strokeWidth={2.5} className="text-emerald-400" />
                        </motion.div>
                      ) : isActive ? (
                        <motion.div
                          key="active"
                          className="relative flex h-7 w-7 items-center justify-center"
                        >
                          {/* Pulsing ring */}
                          <motion.div
                            className="absolute inset-0 rounded-full border-2 border-orange-500/30"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          />
                          {/* Second pulsing ring offset */}
                          <motion.div
                            className="absolute inset-0 rounded-full border border-orange-500/20"
                            animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
                            transition={{ duration: 2.5, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
                          />
                          {/* Inner dot */}
                          <motion.div
                            className="h-3 w-3 rounded-full bg-orange-500"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="pending"
                          className="h-2.5 w-2.5 rounded-full bg-bg-muted"
                        />
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Label */}
                  <span
                    className={`text-body-md transition-colors duration-300 ${
                      isCompleted
                        ? "text-emerald-400 font-medium"
                        : isActive
                          ? "text-text-primary font-medium"
                          : isPending
                            ? "text-text-muted"
                            : "text-text-secondary"
                    }`}
                  >
                    {step.label}
                  </span>

                  {/* Active shimmer */}
                  {isActive && (
                    <motion.div
                      className="ml-auto flex items-center gap-1.5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.span
                        className="h-1 w-1 rounded-full bg-orange-500"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
                      />
                      <motion.span
                        className="h-1 w-1 rounded-full bg-orange-500"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.span
                        className="h-1 w-1 rounded-full bg-orange-500"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                      />
                    </motion.div>
                  )}

                  {/* Completed timestamp feel */}
                  {isCompleted && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="ml-auto text-caption text-emerald-400/60"
                    >
                      Done
                    </motion.span>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Estimated time */}
          <motion.div
            className="mt-6 flex items-center justify-center gap-2 text-body-sm text-text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1 }}
          >
            <motion.div
              className="h-1 w-1 rounded-full bg-text-muted"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span>
              {progress >= 100
                ? "Almost there..."
                : `Estimated ${remainingSeconds}s remaining`}
            </span>
          </motion.div>

          {/* Decorative corner accents */}
          <div className="absolute -top-px -left-px h-4 w-4 border-t-2 border-l-2 border-orange-500/30 rounded-tl-[var(--radius-xl)]" />
          <div className="absolute -top-px -right-px h-4 w-4 border-t-2 border-r-2 border-orange-500/30 rounded-tr-[var(--radius-xl)]" />
          <div className="absolute -bottom-px -left-px h-4 w-4 border-b-2 border-l-2 border-orange-500/30 rounded-bl-[var(--radius-xl)]" />
          <div className="absolute -bottom-px -right-px h-4 w-4 border-b-2 border-r-2 border-orange-500/30 rounded-br-[var(--radius-xl)]" />
        </motion.div>
      </div>
    </div>
  );
}
