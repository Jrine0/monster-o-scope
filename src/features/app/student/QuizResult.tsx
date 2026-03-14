import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  XCircle,
  ChevronDown,
  RotateCcw,
  ArrowLeft,
  Trophy,
} from "lucide-react";
import { ease, fadeUpProps, staggerDelay } from "@/lib/animation";

/* ── Mock quiz result data ── */
const RESULT = {
  quizId: "q-p5",
  chapter: "Laws of Motion",
  subject: "Physics",
  score: 8,
  total: 10,
  questions: [
    {
      id: 1,
      text: "Newton\u2019s first law of motion is also known as the law of:",
      options: ["Acceleration", "Inertia", "Action-Reaction", "Conservation"],
      selected: 1,
      correct: 1,
      explanation: "Newton\u2019s first law states that a body remains in its state of rest or uniform motion unless acted upon by an external force. This tendency is called inertia.",
    },
    {
      id: 2,
      text: "The SI unit of force is:",
      options: ["Joule", "Pascal", "Newton", "Watt"],
      selected: 2,
      correct: 2,
      explanation: "Force is measured in Newtons (N). 1 N = 1 kg \u00D7 1 m/s\u00B2.",
    },
    {
      id: 3,
      text: "If a body of mass 5 kg is acted upon by a force of 20 N, what is the acceleration?",
      options: ["2 m/s\u00B2", "4 m/s\u00B2", "10 m/s\u00B2", "100 m/s\u00B2"],
      selected: 0,
      correct: 1,
      explanation: "Using F = ma: a = F/m = 20/5 = 4 m/s\u00B2. The correct answer is 4 m/s\u00B2.",
    },
    {
      id: 4,
      text: "Which law explains the recoil of a gun when a bullet is fired?",
      options: ["Newton\u2019s first law", "Newton\u2019s second law", "Newton\u2019s third law", "Conservation of energy"],
      selected: 2,
      correct: 2,
      explanation: "The gun exerts a forward force on the bullet (action), and the bullet exerts an equal and opposite force on the gun (reaction). This is Newton\u2019s third law.",
    },
    {
      id: 5,
      text: "Momentum is defined as the product of:",
      options: ["Mass and acceleration", "Force and velocity", "Mass and velocity", "Force and time"],
      selected: 2,
      correct: 2,
      explanation: "Momentum (p) = mass (m) \u00D7 velocity (v).",
    },
    {
      id: 6,
      text: "A ball of mass 0.5 kg moving at 10 m/s has a momentum of:",
      options: ["0.5 kg\u00B7m/s", "5 kg\u00B7m/s", "10 kg\u00B7m/s", "50 kg\u00B7m/s"],
      selected: 1,
      correct: 1,
      explanation: "p = mv = 0.5 \u00D7 10 = 5 kg\u00B7m/s.",
    },
    {
      id: 7,
      text: "The rate of change of momentum is proportional to the:",
      options: ["Velocity", "Acceleration", "Applied force", "Mass"],
      selected: 2,
      correct: 2,
      explanation: "Newton\u2019s second law: dp/dt is directly proportional to the applied force.",
    },
    {
      id: 8,
      text: "Action and reaction forces act on:",
      options: ["The same body", "Different bodies", "Same body, same direction", "Either"],
      selected: 0,
      correct: 1,
      explanation: "Action and reaction always act on two different bodies \u2014 they don\u2019t cancel each other.",
    },
    {
      id: 9,
      text: "Total momentum before and after collision remains the same. This is:",
      options: ["Conservation of energy", "Conservation of momentum", "First law", "Second law"],
      selected: 1,
      correct: 1,
      explanation: "The law of conservation of momentum states that total momentum is constant in an isolated system.",
    },
    {
      id: 10,
      text: "A 1000 kg car at 20 m/s brakes with 5000 N. Time to stop?",
      options: ["2 s", "4 s", "5 s", "10 s"],
      selected: 1,
      correct: 1,
      explanation: "a = F/m = 5 m/s\u00B2. Time = v/a = 20/5 = 4 s.",
    },
  ],
};

/* ── Floating particles for warm light theme ── */
const PARTICLES = Array.from({ length: 7 }, (_, i) => ({
  id: i,
  left: `${10 + i * 13}%`,
  delay: i * 0.8,
  duration: 6 + (i % 3) * 2,
  size: 2,
}));

/* ── Animated counter hook ── */
function useAnimatedCounter(target: number, durationMs: number = 1200, delay: number = 500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      let start = 0;
      const increment = target / (durationMs / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, durationMs, delay]);
  return count;
}

/* ── Score ring SVG ── */
function ScoreRing({ score, total }: { score: number; total: number }) {
  const pct = score / total;
  const radius = 80;
  const stroke = 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct);

  const color = pct >= 0.7 ? "#34d399" : pct >= 0.5 ? "#fb923c" : "#f87171";
  const bgColor = pct >= 0.7 ? "rgba(52,211,153,0.08)" : pct >= 0.5 ? "rgba(251,146,60,0.08)" : "rgba(248,113,113,0.08)";

  const animatedScore = useAnimatedCounter(score, 800, 600);

  return (
    <div className="relative flex flex-col items-center">
      {/* Ambient glow behind ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
          filter: "blur(20px)",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1.2 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
      <svg width={radius * 2 + stroke * 2} height={radius * 2 + stroke * 2} className="relative z-10">
        {/* Background circle */}
        <circle
          cx={radius + stroke}
          cy={radius + stroke}
          r={radius}
          fill={bgColor}
          stroke="var(--color-bg-elevated)"
          strokeWidth={stroke}
        />
        {/* Animated score arc */}
        <motion.circle
          cx={radius + stroke}
          cy={radius + stroke}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, delay: 0.3, ease: ease.gentle }}
          style={{
            transform: "rotate(-90deg)",
            transformOrigin: "center",
          }}
        />
      </svg>
      {/* Score text with animated counter */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5, ease: ease.gentle }}
          className="text-display-xl"
          style={{ color }}
        >
          {animatedScore}/{total}
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-body-sm text-text-secondary"
        >
          {Math.round(pct * 100)}% correct
        </motion.span>
      </div>
    </div>
  );
}

export function QuizResult() {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  const pct = RESULT.score / RESULT.total;
  const resultMessage =
    pct >= 0.8
      ? "Excellent work!"
      : pct >= 0.6
        ? "Good effort!"
        : "Keep practicing!";

  return (
    <div className="relative space-y-8 pb-12">
      {/* ── Animated background blob (warm light theme) ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full opacity-[0.06]"
          style={{
            background: "radial-gradient(circle, #f2740d 0%, #fb923c 40%, transparent 70%)",
            filter: "blur(100px)",
          }}
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.06, 0.08, 0.06],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full opacity-[0.04]"
          style={{
            background: "radial-gradient(circle, #fb923c 0%, #f59e0b 40%, transparent 70%)",
            filter: "blur(100px)",
          }}
          animate={{
            x: [0, -20, 15, 0],
            y: [0, 15, -10, 0],
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
              y: [0, -600, -1200],
              opacity: [0, 0.25, 0],
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

      {/* ── Score section with blur entrance ── */}
      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.6, ease: ease.gentle }}
        className="relative flex flex-col items-center gap-4 pt-4"
      >
        <div className="flex items-center gap-2 text-body-sm text-text-muted">
          <span>{RESULT.subject}</span>
          <span>&middot;</span>
          <span>{RESULT.chapter}</span>
        </div>

        <ScoreRing score={RESULT.score} total={RESULT.total} />

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, delay: 1, repeat: Infinity, repeatDelay: 3 }}
          >
            <Trophy size={20} strokeWidth={1.5} className="text-orange-400" />
          </motion.div>
          <span className="text-display-sm text-text-primary">{resultMessage}</span>
        </motion.div>

        {/* Animated accent line */}
        <motion.div
          className="h-px w-48 mt-2"
          style={{
            background: "linear-gradient(90deg, transparent, #f2740d, #fb923c, transparent)",
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1, ease: ease.gentle }}
        />
      </motion.div>

      {/* ── Action buttons with micro-interactions ── */}
      <motion.div
        {...fadeUpProps(8, 1)}
        className="relative flex items-center justify-center gap-4"
      >
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            to="/student/quizzes"
            className="flex items-center gap-2 rounded-xl border border-orange-500/30 bg-orange-500/10 px-5 py-3 text-body-md font-medium text-orange-400 transition-all duration-200 hover:bg-orange-500 hover:text-text-inverse"
          >
            <RotateCcw size={18} strokeWidth={1.5} />
            Retake Quiz
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            to="/student/quizzes"
            className="flex items-center gap-2 rounded-xl border border-border-subtle px-5 py-3 text-body-md font-medium text-text-secondary transition-all duration-200 hover:border-border-default hover:text-text-primary"
            style={{ backgroundColor: "var(--color-portal-student-surface)" }}
          >
            <ArrowLeft size={18} strokeWidth={1.5} />
            Back to Quizzes
          </Link>
        </motion.div>
      </motion.div>

      {/* ── Answer review with stagger ── */}
      <motion.div
        {...fadeUpProps(12, 1.1)}
        className="relative"
      >
        <h2 className="text-heading-2 text-text-primary mb-4">Answer Review</h2>
        <div className="space-y-3">
          {RESULT.questions.map((q, i) => {
            const isCorrect = q.selected === q.correct;
            const isExpanded = expandedQuestion === i;
            const statusColor = isCorrect ? "#34d399" : "#f87171";

            return (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.15 + i * staggerDelay.tight }}
                whileHover={{ y: -2 }}
                className="rounded-xl border border-border-subtle overflow-hidden transition-shadow hover:shadow-sm"
                style={{ backgroundColor: "var(--color-portal-student-surface)" }}
              >
                {/* Question header */}
                <button
                  onClick={() => setExpandedQuestion(isExpanded ? null : i)}
                  className="flex w-full items-center gap-4 p-5 text-left"
                >
                  {/* Status icon with entrance animation */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 12, delay: 1.2 + i * staggerDelay.tight }}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${statusColor}15` }}
                  >
                    {isCorrect ? (
                      <CheckCircle2 size={20} strokeWidth={1.5} style={{ color: statusColor }} />
                    ) : (
                      <XCircle size={20} strokeWidth={1.5} style={{ color: statusColor }} />
                    )}
                  </motion.div>

                  <div className="min-w-0 flex-1">
                    <p className="text-body-sm text-text-muted">Question {i + 1}</p>
                    <p className="text-body-lg text-text-primary truncate">{q.text}</p>
                  </div>

                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0 text-text-muted"
                  >
                    <ChevronDown size={18} strokeWidth={1.5} />
                  </motion.div>
                </button>

                {/* Expanded details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: ease.gentle }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border-subtle px-5 pb-5 pt-4 space-y-3">
                        {/* Options */}
                        {q.options.map((opt, optIdx) => {
                          const isSelected = optIdx === q.selected;
                          const isAnswer = optIdx === q.correct;
                          let optBg = "transparent";
                          let optBorder = "var(--color-border-subtle)";
                          let optText = "var(--color-text-secondary)";
                          if (isAnswer) {
                            optBg = "rgba(52,211,153,0.08)";
                            optBorder = "rgba(52,211,153,0.3)";
                            optText = "#34d399";
                          } else if (isSelected && !isAnswer) {
                            optBg = "rgba(248,113,113,0.08)";
                            optBorder = "rgba(248,113,113,0.3)";
                            optText = "#f87171";
                          }

                          return (
                            <motion.div
                              key={optIdx}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: optIdx * 0.06, duration: 0.3 }}
                              className="flex items-center gap-3 rounded-lg border px-4 py-2.5"
                              style={{
                                backgroundColor: optBg,
                                borderColor: optBorder,
                              }}
                            >
                              <span
                                className="text-body-sm font-semibold"
                                style={{ color: optText }}
                              >
                                {String.fromCharCode(65 + optIdx)}.
                              </span>
                              <span
                                className="text-body-md"
                                style={{ color: optText }}
                              >
                                {opt}
                              </span>
                              {isAnswer && (
                                <CheckCircle2
                                  size={16}
                                  strokeWidth={1.5}
                                  className="ml-auto shrink-0"
                                  style={{ color: "#34d399" }}
                                />
                              )}
                              {isSelected && !isAnswer && (
                                <XCircle
                                  size={16}
                                  strokeWidth={1.5}
                                  className="ml-auto shrink-0"
                                  style={{ color: "#f87171" }}
                                />
                              )}
                            </motion.div>
                          );
                        })}

                        {/* Explanation */}
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="rounded-lg border-l-2 border-orange-800 p-4 mt-2"
                          style={{ backgroundColor: "rgba(242,116,13,0.05)" }}
                        >
                          <p className="text-body-sm text-text-secondary leading-relaxed">
                            <span className="text-orange-400 font-medium">Explanation: </span>
                            {q.explanation}
                          </p>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
