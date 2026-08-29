// QuizList.tsx — Edactly design system
// All logic, animation variants, counters from original preserved exactly.
// className tokens → Edactly CSS vars + Caveat/Lora/Courier Prime fonts.

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "@tanstack/react-router";
import {
  HelpCircle,
  CheckCircle2,
  Clock,
  ChevronRight,
  Calculator,
  Atom,
  FlaskConical,
  Leaf,
  BookOpen,
  Languages,
  RotateCcw,
} from "lucide-react";
import {
  staggerContainer,
  fadeUp,
  fadeUpProps,
  cardReveal,
  ease,
  duration,
} from "@/lib/animation";

const CAV: React.CSSProperties = {
  fontFamily: "var(--font-display, 'Caveat', cursive)",
};
const LOR: React.CSSProperties = {
  fontFamily: "var(--font-body, 'Lora', Georgia, serif)",
};
const COU: React.CSSProperties = {
  fontFamily: "var(--font-mono, 'Courier Prime', monospace)",
};
// Removed slanted CLIP_CARD - using standard rounded rectangles

/* ── Subject config (unchanged) ── */
const SUBJECTS = [
  { key: "all", label: "All", icon: BookOpen, color: "#f2740d" },
  {
    key: "mathematics",
    label: "Mathematics",
    icon: Calculator,
    color: "#3b82f6",
  },
  { key: "physics", label: "Physics", icon: Atom, color: "#a855f7" },
  {
    key: "chemistry",
    label: "Chemistry",
    icon: FlaskConical,
    color: "#22c55e",
  },
  { key: "biology", label: "Biology", icon: Leaf, color: "#ec4899" },
  { key: "english", label: "English", icon: BookOpen, color: "#f59e0b" },
  { key: "hindi", label: "Hindi", icon: Languages, color: "#f97316" },
] as const;

/* ── Mock quiz data (unchanged) ── */
const QUIZZES = [
  {
    id: "q-m1",
    chapter: "Real Numbers",
    subject: "mathematics",
    questions: 10,
    status: "completed" as const,
    score: 8,
  },
  {
    id: "q-m2",
    chapter: "Polynomials",
    subject: "mathematics",
    questions: 10,
    status: "completed" as const,
    score: 9,
  },
  {
    id: "q-m3",
    chapter: "Pair of Linear Equations",
    subject: "mathematics",
    questions: 10,
    status: "not_started" as const,
  },
  {
    id: "q-m4",
    chapter: "Quadratic Equations",
    subject: "mathematics",
    questions: 10,
    status: "completed" as const,
    score: 7,
  },
  {
    id: "q-p1",
    chapter: "Light \u2014 Reflection and Refraction",
    subject: "physics",
    questions: 10,
    status: "completed" as const,
    score: 9,
  },
  {
    id: "q-p2",
    chapter: "Electricity",
    subject: "physics",
    questions: 10,
    status: "not_started" as const,
  },
  {
    id: "q-p3",
    chapter: "Magnetic Effects of Electric Current",
    subject: "physics",
    questions: 10,
    status: "completed" as const,
    score: 6,
  },
  {
    id: "q-c1",
    chapter: "Chemical Reactions and Equations",
    subject: "chemistry",
    questions: 10,
    status: "completed" as const,
    score: 7,
  },
  {
    id: "q-c2",
    chapter: "Acids, Bases and Salts",
    subject: "chemistry",
    questions: 10,
    status: "not_started" as const,
  },
  {
    id: "q-b1",
    chapter: "Life Processes",
    subject: "biology",
    questions: 10,
    status: "completed" as const,
    score: 8,
  },
];

/* ── Animation variants (unchanged) ── */
const container = staggerContainer(0.06);
const item = fadeUp(12);
const cardItem = cardReveal(16, duration.normal);

/* ── Floating particles (unchanged) ── */
const PARTICLES = Array.from({ length: 7 }, (_, i) => ({
  id: i,
  left: `${10 + i * 13}%`,
  delay: i * 0.7,
  duration: 6 + (i % 3) * 2,
  size: 2,
}));

function getSubjectLabel(key: string) {
  return SUBJECTS.find((s) => s.key === key)?.label ?? key;
}
function getSubjectColor(key: string) {
  return SUBJECTS.find((s) => s.key === key)?.color ?? "#f2740d";
}

/* ── Animated counter (unchanged) ── */
function useAnimatedCounter(target: number, durationMs = 800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let v = 0;
    const inc = target / (durationMs / 16);
    const t = setInterval(() => {
      v += inc;
      if (v >= target) {
        setCount(target);
        clearInterval(t);
      } else setCount(Math.floor(v));
    }, 16);
    return () => clearInterval(t);
  }, [target, durationMs]);
  return count;
}

/* ── Stat card ── */
function AnimatedStat({
  label,
  value,
  color,
  isString,
}: {
  label: string;
  value: number | string;
  color: string;
  isString?: boolean;
}) {
  const numVal = typeof value === "number" ? value : 0;
  const animated = useAnimatedCounter(numVal);
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: ease.gentle }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "1rem",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "12px",
      }}
    >
      <motion.div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: color,
          flexShrink: 0,
        }}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <div>
        <p
          style={{
            ...CAV,
            fontSize: "1.55rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            lineHeight: 1,
          }}
        >
          {isString ? value : animated}
        </p>
        <p
          style={{
            ...LOR,
            fontStyle: "italic",
            fontSize: "0.8rem",
            color: "var(--text-secondary)",
            marginTop: 2,
          }}
        >
          {label}
        </p>
      </div>
    </motion.div>
  );
}

export function QuizList() {
  const [activeSubject, setActiveSubject] = useState("all");

  const filtered =
    activeSubject === "all"
      ? QUIZZES
      : QUIZZES.filter((q) => q.subject === activeSubject);
  const completedCount = QUIZZES.filter((q) => q.status === "completed").length;
  const avgScore =
    QUIZZES.filter((q) => q.status === "completed").reduce(
      (a, q) => a + (q.score ?? 0),
      0,
    ) / (completedCount || 1);

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        paddingBottom: "3rem",
      }}
    >
      {/* Background blob */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-20 h-[500px] w-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle,#f2740d 0%,#fb923c 40%,transparent 70%)",
            filter: "blur(100px)",
            opacity: 0.05,
          }}
          animate={{ x: [0, 25, -15, 0], y: [0, -15, 10, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(circle,#fb923c 0%,#f59e0b 40%,transparent 70%)",
            filter: "blur(100px)",
            opacity: 0.04,
          }}
          animate={{ x: [0, -20, 15, 0], y: [0, 20, -10, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle,#f2740d 1px,transparent 1px)",
            backgroundSize: "32px 32px",
            opacity: 0.03,
          }}
        />
      </div>

      {/* Particles */}
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
            animate={{ y: [0, -600, -1200], opacity: [0, 0.25, 0] }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

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
          Practice Quizzes
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
          Test your knowledge with NCERT chapter quizzes
        </p>
        <motion.div
          style={{
            height: 1,
            marginTop: "1rem",
            background:
              "linear-gradient(90deg,transparent,#f2740d,#fb923c,transparent)",
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: ease.gentle }}
        />
      </motion.div>

      {/* Stats */}
      <motion.div
        {...fadeUpProps(8, 0.1, 0.4)}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
          gap: "0.85rem",
        }}
      >
        <AnimatedStat
          label="Total Quizzes"
          value={QUIZZES.length}
          color="#f2740d"
        />
        <AnimatedStat
          label="Completed"
          value={completedCount}
          color="#34d399"
        />
        <AnimatedStat
          label="Average Score"
          value={`${Math.round(avgScore)}/10`}
          color="#60a5fa"
          isString
        />
      </motion.div>

      {/* Subject filter */}
      <motion.div
        {...fadeUpProps(0, 0.15, 0.4)}
        style={{
          display: "flex",
          gap: "0.4rem",
          overflowX: "auto",
          paddingBottom: "0.25rem",
        }}
      >
        {SUBJECTS.map((sub) => {
          const isActive = sub.key === activeSubject;
          const Icon = sub.icon;
          return (
            <motion.button
              key={sub.key}
              onClick={() => setActiveSubject(sub.key)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "flex",
                flexShrink: 0,
                alignItems: "center",
                gap: "0.35rem",
                ...COU,
                fontSize: "0.65rem",
                letterSpacing: "0.08em",
                padding: "0.38rem 0.85rem",
                cursor: "pointer",
                border: "1px solid",
                borderColor: isActive ? "transparent" : "var(--border-subtle)",
                background: isActive ? sub.color : "transparent",
                color: isActive
                  ? sub.color === "#f2740d"
                    ? "#07080d"
                    : "white"
                  : "var(--text-secondary)",
                borderRadius: "999px",
                transition: "all 0.18s",
              }}
            >
              <Icon size={14} strokeWidth={1.5} /> {sub.label}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Quiz cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubject}
          variants={container}
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}
        >
          {filtered.length === 0 && (
            <motion.div
              variants={item}
              style={{ textAlign: "center", padding: "4rem 0" }}
            >
              <p
                style={{
                  ...CAV,
                  fontSize: "1.8rem",
                  color: "var(--text-muted)",
                }}
              >
                No quizzes for this subject
              </p>
            </motion.div>
          )}

          {filtered.map((quiz) => {
            const subjectColor = getSubjectColor(quiz.subject);
            const isCompleted = quiz.status === "completed";
            const scoreCol =
              quiz.score != null
                ? quiz.score >= 7
                  ? "#34d399"
                  : quiz.score >= 5
                    ? "#fb923c"
                    : "#f87171"
                : undefined;

            return (
              <motion.div
                key={quiz.id}
                variants={cardItem}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1.1rem",
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border-subtle)",
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: "12px",
                  }}
                >
                  {/* Status icon */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 44,
                      height: 44,
                      flexShrink: 0,
                      borderRadius: 8,
                      background: isCompleted
                        ? `${scoreCol}18`
                        : `${subjectColor}18`,
                    }}
                  >
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 12,
                        }}
                      >
                        <CheckCircle2
                          size={22}
                          strokeWidth={1.5}
                          style={{ color: scoreCol }}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <HelpCircle
                          size={22}
                          strokeWidth={1.5}
                          style={{ color: subjectColor }}
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        ...CAV,
                        fontSize: "1.05rem",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {quiz.chapter}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        marginTop: "0.2rem",
                      }}
                    >
                      <span
                        style={{
                          ...COU,
                          fontSize: "0.62rem",
                          letterSpacing: "0.06em",
                          fontWeight: 600,
                          color: subjectColor,
                        }}
                      >
                        {getSubjectLabel(quiz.subject)}
                      </span>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.2rem",
                          ...COU,
                          fontSize: "0.58rem",
                          letterSpacing: "0.05em",
                          color: "var(--text-muted)",
                        }}
                      >
                        <Clock size={11} strokeWidth={1.5} /> {quiz.questions}{" "}
                        MCQs
                      </span>
                      {isCompleted && quiz.score != null && (
                        <span
                          style={{
                            ...COU,
                            fontSize: "0.62rem",
                            fontWeight: 700,
                            color: scoreCol,
                          }}
                        >
                          Score: {quiz.score}/{quiz.questions}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      flexShrink: 0,
                    }}
                  >
                    {isCompleted ? (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link
                          to="/student/quizzes"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.35rem",
                            ...COU,
                            fontSize: "0.62rem",
                            letterSpacing: "0.08em",
                            background: "transparent",
                            border: "1px solid var(--border-default)",
                            color: "var(--text-secondary)",
                            padding: "0.3rem 0.7rem",
                            textDecoration: "none",
                            borderRadius: "999px",
                            transition: "all 0.18s",
                          }}
                        >
                          <RotateCcw size={13} strokeWidth={1.5} /> Retake
                        </Link>
                      </motion.div>
                    ) : (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link
                          to="/student/quizzes"
                          style={{
                            ...CAV,
                            fontSize: "0.95rem",
                            fontWeight: 700,
                            background: "var(--orange)",
                            color: "#07080d",
                            padding: "0.35rem 0.9rem",
                            textDecoration: "none",
                            borderRadius: "8px",
                            display: "inline-block",
                            transition: "background 0.15s",
                          }}
                        >
                          Start Quiz
                        </Link>
                      </motion.div>
                    )}
                    {isCompleted && (
                      <Link
                        to="/student/quizzes"
                        style={{ color: "var(--text-muted)", display: "flex" }}
                      >
                        <ChevronRight size={18} strokeWidth={1.5} />
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
