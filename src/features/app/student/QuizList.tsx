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

/* ── Subject config ── */
const SUBJECTS = [
  { key: "all", label: "All", icon: BookOpen, color: "#f2740d" },
  { key: "mathematics", label: "Mathematics", icon: Calculator, color: "#3b82f6" },
  { key: "physics", label: "Physics", icon: Atom, color: "#a855f7" },
  { key: "chemistry", label: "Chemistry", icon: FlaskConical, color: "#22c55e" },
  { key: "biology", label: "Biology", icon: Leaf, color: "#ec4899" },
  { key: "english", label: "English", icon: BookOpen, color: "#f59e0b" },
  { key: "hindi", label: "Hindi", icon: Languages, color: "#f97316" },
] as const;

/* ── Mock quiz data ── */
const QUIZZES = [
  { id: "q-m1", chapter: "Real Numbers", subject: "mathematics", questions: 10, status: "completed" as const, score: 8 },
  { id: "q-m2", chapter: "Polynomials", subject: "mathematics", questions: 10, status: "completed" as const, score: 9 },
  { id: "q-m3", chapter: "Pair of Linear Equations", subject: "mathematics", questions: 10, status: "not_started" as const },
  { id: "q-m4", chapter: "Quadratic Equations", subject: "mathematics", questions: 10, status: "completed" as const, score: 7 },
  { id: "q-p1", chapter: "Light \u2014 Reflection and Refraction", subject: "physics", questions: 10, status: "completed" as const, score: 9 },
  { id: "q-p2", chapter: "Electricity", subject: "physics", questions: 10, status: "not_started" as const },
  { id: "q-p3", chapter: "Magnetic Effects of Electric Current", subject: "physics", questions: 10, status: "completed" as const, score: 6 },
  { id: "q-c1", chapter: "Chemical Reactions and Equations", subject: "chemistry", questions: 10, status: "completed" as const, score: 7 },
  { id: "q-c2", chapter: "Acids, Bases and Salts", subject: "chemistry", questions: 10, status: "not_started" as const },
  { id: "q-b1", chapter: "Life Processes", subject: "biology", questions: 10, status: "completed" as const, score: 8 },
];

/* ── Animation variants ── */
const container = staggerContainer(0.06);
const item = fadeUp(12);
const cardItem = cardReveal(16, duration.normal);

/* ── Floating particles for warm light theme ── */
const PARTICLES = Array.from({ length: 7 }, (_, i) => ({
  id: i,
  left: `${10 + i * 13}%`,
  delay: i * 0.7,
  duration: 6 + (i % 3) * 2,
  size: 2,
}));

function getSubjectLabel(key: string): string {
  return SUBJECTS.find((s) => s.key === key)?.label ?? key;
}
function getSubjectColor(key: string): string {
  return SUBJECTS.find((s) => s.key === key)?.color ?? "#f2740d";
}

/* ── Animated counter hook ── */
function useAnimatedCounter(target: number, durationMs: number = 800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
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
  }, [target, durationMs]);
  return count;
}

function AnimatedStat({ label, value, color, isString }: { label: string; value: number | string; color: string; isString?: boolean }) {
  const numValue = typeof value === "number" ? value : 0;
  const animatedValue = useAnimatedCounter(numValue, 800);

  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: "0 4px 16px rgba(242,116,13,0.06)" }}
      className="flex items-center gap-4 rounded-xl border border-border-subtle p-4 transition-shadow"
      style={{ backgroundColor: "var(--color-portal-student-surface)" }}
    >
      <motion.div
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: color }}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <div>
        <p className="text-heading-2 text-text-primary">
          {isString ? value : animatedValue}
        </p>
        <p className="text-body-sm text-text-secondary">{label}</p>
      </div>
    </motion.div>
  );
}

export function QuizList() {
  const [activeSubject, setActiveSubject] = useState<string>("all");

  const filtered =
    activeSubject === "all"
      ? QUIZZES
      : QUIZZES.filter((q) => q.subject === activeSubject);

  const completedCount = QUIZZES.filter((q) => q.status === "completed").length;
  const avgScore =
    QUIZZES.filter((q) => q.status === "completed").reduce(
      (acc, q) => acc + (q.score ?? 0),
      0,
    ) / (completedCount || 1);

  return (
    <div className="relative space-y-6 pb-12">
      {/* ── Animated background blob (warm light theme) ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-20 h-[500px] w-[500px] rounded-full opacity-[0.05]"
          style={{
            background: "radial-gradient(circle, #f2740d 0%, #fb923c 40%, transparent 70%)",
            filter: "blur(100px)",
          }}
          animate={{
            x: [0, 25, -15, 0],
            y: [0, -15, 10, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full opacity-[0.04]"
          style={{
            background: "radial-gradient(circle, #fb923c 0%, #f59e0b 40%, transparent 70%)",
            filter: "blur(100px)",
          }}
          animate={{
            x: [0, -20, 15, 0],
            y: [0, 20, -10, 0],
          }}
          transition={{
            duration: 24,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
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

      {/* ── Header with blur entrance ── */}
      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.6, ease: ease.gentle }}
      >
        <h1 className="text-display-md text-text-primary">Practice Quizzes</h1>
        <p className="text-body-lg text-text-secondary mt-1">
          Test your knowledge with NCERT chapter quizzes
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

      {/* ── Stats bar with animated counters ── */}
      <motion.div
        {...fadeUpProps(8, 0.1, 0.4)}
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        <AnimatedStat label="Total Quizzes" value={QUIZZES.length} color="#f2740d" />
        <AnimatedStat label="Completed" value={completedCount} color="#34d399" />
        <AnimatedStat label="Average Score" value={`${Math.round(avgScore)}/10`} color="#60a5fa" isString />
      </motion.div>

      {/* ── Subject filter with micro-interactions ── */}
      <motion.div
        {...fadeUpProps(0, 0.15, 0.4)}
        className="flex gap-2 overflow-x-auto pb-2"
        style={{ scrollbarWidth: "none" }}
      >
        {SUBJECTS.map((subject) => {
          const isActive = subject.key === activeSubject;
          const Icon = subject.icon;
          return (
            <motion.button
              key={subject.key}
              onClick={() => setActiveSubject(subject.key)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-body-sm font-medium transition-all duration-200 ${
                isActive
                  ? "border-transparent text-text-inverse"
                  : "border-border-subtle text-text-secondary hover:text-text-primary hover:border-border-default"
              }`}
              style={isActive ? { backgroundColor: subject.color } : undefined}
            >
              <Icon size={16} strokeWidth={1.5} />
              {subject.label}
            </motion.button>
          );
        })}
      </motion.div>

      {/* ── Quiz cards with hover effects ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubject}
          variants={container}
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          className="space-y-3"
        >
          {filtered.length === 0 && (
            <motion.div variants={item} className="py-16 text-center">
              <p className="text-display-sm text-text-muted">No quizzes for this subject</p>
            </motion.div>
          )}
          {filtered.map((quiz) => {
            const subjectColor = getSubjectColor(quiz.subject);
            const isCompleted = quiz.status === "completed";
            const scoreColor =
              quiz.score != null
                ? quiz.score >= 7
                  ? "#34d399"
                  : quiz.score >= 5
                    ? "#fb923c"
                    : "#f87171"
                : undefined;

            return (
              <motion.div key={quiz.id} variants={cardItem} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                <div
                  className="group relative flex items-center gap-4 rounded-xl border border-border-subtle p-5 transition-all duration-200 hover:shadow-glow-orange hover:border-orange-500/20 overflow-hidden"
                  style={{ backgroundColor: "var(--color-portal-student-surface)" }}
                >
                  {/* Warm glow overlay on hover */}
                  <div
                    className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background: "radial-gradient(ellipse at 50% 0%, rgba(242,116,13,0.04) 0%, transparent 70%)",
                    }}
                  />

                  {/* Status icon with animation */}
                  <div
                    className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: isCompleted
                        ? `${scoreColor}15`
                        : `${subjectColor}15`,
                    }}
                  >
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 12 }}
                      >
                        <CheckCircle2
                          size={22}
                          strokeWidth={1.5}
                          style={{ color: scoreColor }}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <HelpCircle
                          size={22}
                          strokeWidth={1.5}
                          style={{ color: subjectColor }}
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* Quiz info */}
                  <div className="relative z-10 min-w-0 flex-1">
                    <p className="text-body-lg text-text-primary font-medium truncate">
                      {quiz.chapter}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span
                        className="text-caption font-medium"
                        style={{ color: subjectColor }}
                      >
                        {getSubjectLabel(quiz.subject)}
                      </span>
                      <span className="flex items-center gap-1 text-caption text-text-muted">
                        <Clock size={11} strokeWidth={1.5} />
                        {quiz.questions} MCQs
                      </span>
                      {isCompleted && quiz.score != null && (
                        <span
                          className="text-caption font-semibold"
                          style={{ color: scoreColor }}
                        >
                          Score: {quiz.score}/{quiz.questions}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action with button micro-interactions */}
                  <div className="relative z-10 flex items-center gap-2 shrink-0">
                    {isCompleted ? (
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Link
                          to="/student/quiz/$id"
                          params={{ id: quiz.id }}
                          className="flex items-center gap-1.5 rounded-lg border border-border-default bg-transparent px-3 py-1.5 text-body-sm font-medium text-text-secondary transition-all duration-200 hover:border-orange-500/30 hover:text-orange-400"
                        >
                          <RotateCcw size={14} strokeWidth={1.5} />
                          Retake
                        </Link>
                      </motion.div>
                    ) : (
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Link
                          to="/student/quiz/$id"
                          params={{ id: quiz.id }}
                          className="rounded-lg bg-orange-500 px-4 py-1.5 text-body-sm font-semibold text-text-inverse transition-all duration-200 hover:bg-orange-400 hover:shadow-glow-orange"
                        >
                          Start Quiz
                        </Link>
                      </motion.div>
                    )}
                    <Link
                      to="/student/quiz/$id/result"
                      params={{ id: quiz.id }}
                      className={`text-text-muted hover:text-text-primary transition-colors ${
                        !isCompleted ? "pointer-events-none opacity-0" : ""
                      }`}
                    >
                      <ChevronRight size={18} strokeWidth={1.5} />
                    </Link>
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
