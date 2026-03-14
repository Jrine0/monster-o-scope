import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Eye,
  Shield,
  Bot,
  BookOpen,
  AlertTriangle,
  Info,
  Lock,
} from "lucide-react";
import {
  staggerContainer,
  fadeUp,
  ease,
  staggerDelay,
} from "@/lib/animation";
import AccentLine from "@/components/accent-line";

/* ── Feature definitions ── */
const FEATURES = [
  {
    id: "eye-tracking",
    title: "Eye Tracking",
    description:
      "Track student gaze patterns during proctored tests for integrity monitoring. Uses the device camera to detect attention and focus.",
    icon: Eye,
    enabled: false,
    disabled: false,
    phase: null as string | null,
    warning: {
      type: "warning" as const,
      title: "DPDP Act 2023 Compliance Required",
      message:
        "Enabling eye tracking collects biometric data from minors. Under India's Digital Personal Data Protection Act 2023, this requires explicit, informed parental consent for every student. Ensure your school has collected signed consent forms before enabling.",
    },
  },
  {
    id: "anti-cheat",
    title: "Anti-Cheat Mode",
    description:
      "Full-screen lockdown with tab-switch detection and auto-flagging during proctored tests. Monitors student browser behaviour for integrity violations.",
    icon: Shield,
    enabled: false,
    disabled: true,
    phase: "Phase 2",
    warning: null,
  },
  {
    id: "ai-tutor",
    title: "AI Tutor",
    description:
      "3D AI-powered tutor with voice interaction for student self-study. Provides contextual explanations, answers questions, and generates visual aids.",
    icon: Bot,
    enabled: true,
    disabled: false,
    phase: null,
    warning: null,
  },
  {
    id: "practice-quizzes",
    title: "Practice Quizzes",
    description:
      "Self-paced practice quizzes for each NCERT chapter. 10 MCQs per chapter with immediate feedback and explanations. No anti-cheat or timer.",
    icon: BookOpen,
    enabled: true,
    disabled: false,
    phase: null,
    warning: null,
  },
] as const;

/* ── Toggle component ── */
function FeatureToggle({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200 ${
        disabled
          ? "cursor-not-allowed bg-bg-muted opacity-40"
          : checked
            ? "bg-orange-500 cursor-pointer"
            : "bg-bg-muted cursor-pointer hover:bg-border-strong"
      }`}
    >
      <motion.span
        className={`inline-block h-5 w-5 rounded-full shadow-xs ${
          disabled ? "bg-text-muted" : "bg-white"
        }`}
        animate={{ x: checked ? 24 : 4 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

/* ── Animation ── */
const containerVariants = staggerContainer(staggerDelay.normal, 0, true);
const cardVariants = fadeUp(12, 0.4, ease.standard);

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
      {[...Array(7)].map((_, i) => (
        <motion.div
          key={`feature-toggles-particle-${i}`}
          className="absolute rounded-full"
          style={{
            width: i % 3 === 0 ? 3 : 2,
            height: i % 3 === 0 ? 3 : 2,
            left: `${9 + ((i * 11.7) % 80)}%`,
            top: `${30 + ((i * 9.3) % 48)}%`,
            background: i % 2 === 0
              ? "rgba(101,113,245,0.6)"
              : "rgba(101,113,245,0.35)",
          }}
          animate={{
            y: [0, -88 - i * 8],
            x: [0, i % 2 === 0 ? 11 : -11],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: 5 + (i % 4) * 1.5,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

export function FeatureTogglesPage() {
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({
    "eye-tracking": false,
    "anti-cheat": false,
    "ai-tutor": true,
    "practice-quizzes": true,
  });

  const handleToggle = (id: string, value: boolean) => {
    setToggleStates((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <>
      <AnimatedBackground />
      <div className="relative space-y-6">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: ease.standard }}
        >
          <Link
            to="/admin/settings"
            className="inline-flex items-center gap-1.5 text-body-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft size={16} strokeWidth={1.5} />
            Back to Settings
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -4, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.4, delay: 0.05, ease: ease.standard }}
        >
          <h1 className="text-heading-1 text-text-primary">Feature Toggles</h1>
          <p className="text-body-md text-text-secondary mt-1">
            Enable or disable platform features for your school. Some features
            require additional compliance steps before activation.
          </p>
          <AccentLine />
        </motion.div>

        {/* Feature cards */}
        <motion.div
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            const isEnabled = toggleStates[feature.id] ?? feature.enabled;
            const isDisabled = feature.disabled;

            return (
              <motion.div
                key={feature.id}
                variants={cardVariants}
                whileHover={!isDisabled ? { y: -4, boxShadow: "0 8px 30px rgba(101,113,245,0.08)" } : undefined}
                className={`group relative overflow-hidden rounded-lg border bg-bg-surface transition-colors ${
                  isDisabled
                    ? "border-border-subtle opacity-60"
                    : "border-border-subtle hover:border-border-default"
                }`}
              >
                {/* Gradient glow overlay on hover */}
                {!isDisabled && (
                  <div className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background: "linear-gradient(135deg, rgba(101,113,245,0.02) 0%, transparent 60%)",
                    }}
                  />
                )}

                <div className="relative flex items-start gap-4 p-5">
                  {/* Icon */}
                  <motion.div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${
                      isEnabled && !isDisabled
                        ? "bg-orange-500/10"
                        : "bg-bg-elevated"
                    }`}
                    animate={isEnabled && !isDisabled ? {
                      scale: [1, 1.08, 1],
                      opacity: [0.9, 1, 0.9],
                    } : undefined}
                    transition={isEnabled && !isDisabled ? {
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    } : undefined}
                  >
                    <Icon
                      size={20}
                      className={
                        isEnabled && !isDisabled
                          ? "text-orange-400"
                          : "text-text-muted"
                      }
                      strokeWidth={1.5}
                    />
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-heading-3 text-text-primary">
                        {feature.title}
                      </h3>
                      {feature.phase && (
                        <motion.span
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 20 }}
                          className="inline-flex items-center gap-1 rounded-full bg-bg-muted px-2.5 py-0.5 text-caption text-text-muted"
                        >
                          <Lock size={10} strokeWidth={2} />
                          {feature.phase}
                        </motion.span>
                      )}
                    </div>
                    <p className="text-body-sm text-text-secondary mt-1">
                      {feature.description}
                    </p>
                  </div>

                  {/* Toggle */}
                  <div className="shrink-0 pt-0.5">
                    <FeatureToggle
                      checked={isEnabled}
                      onChange={(val) => handleToggle(feature.id, val)}
                      disabled={isDisabled}
                    />
                  </div>
                </div>

                {/* Warning banner */}
                {feature.warning && isEnabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-border-subtle"
                  >
                    <div
                      className={`flex items-start gap-3 px-5 py-4 ${
                        feature.warning.type === "warning"
                          ? "bg-warning-muted/50"
                          : "bg-info-muted/50"
                      }`}
                    >
                      {feature.warning.type === "warning" ? (
                        <motion.div
                          animate={{
                            scale: [1, 1.15, 1],
                          }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <AlertTriangle
                            size={18}
                            className="text-warning shrink-0 mt-0.5"
                            strokeWidth={1.5}
                          />
                        </motion.div>
                      ) : (
                        <Info
                          size={18}
                          className="text-info shrink-0 mt-0.5"
                          strokeWidth={1.5}
                        />
                      )}
                      <div>
                        <p
                          className={`text-body-sm font-medium ${
                            feature.warning.type === "warning"
                              ? "text-warning"
                              : "text-info"
                          }`}
                        >
                          {feature.warning.title}
                        </p>
                        <p className="text-body-sm text-text-secondary mt-0.5">
                          {feature.warning.message}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Info banner for disabled features */}
                {isDisabled && (
                  <div className="border-t border-border-subtle">
                    <div className="flex items-center gap-2 bg-bg-elevated/50 px-5 py-3">
                      <Info
                        size={14}
                        className="text-text-muted shrink-0"
                        strokeWidth={1.5}
                      />
                      <p className="text-body-sm text-text-muted">
                        This feature is not yet available. It will be enabled in a
                        future update.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </>
  );
}
