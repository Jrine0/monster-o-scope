import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "@tanstack/react-router";
import {
  TrendingUp,
  TrendingDown,
  Calculator,
  Atom,
  FlaskConical,
  Leaf,
  BookOpen,
  Languages,
  ChevronRight,
  BarChart3,
} from "lucide-react";
import {
  staggerContainer,
  fadeUp,
  fadeUpProps,
  staggerDelay,
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

/* ── Mock results ── */
const RESULTS = [
  { id: "r1", quiz: "Real Numbers", subject: "mathematics", score: 8, total: 10, date: "2 Mar 2026" },
  { id: "r2", quiz: "Light \u2014 Reflection and Refraction", subject: "physics", score: 9, total: 10, date: "1 Mar 2026" },
  { id: "r3", quiz: "Chemical Reactions and Equations", subject: "chemistry", score: 7, total: 10, date: "28 Feb 2026" },
  { id: "r4", quiz: "Polynomials", subject: "mathematics", score: 9, total: 10, date: "27 Feb 2026" },
  { id: "r5", quiz: "Life Processes", subject: "biology", score: 8, total: 10, date: "26 Feb 2026" },
  { id: "r6", quiz: "Quadratic Equations", subject: "mathematics", score: 7, total: 10, date: "25 Feb 2026" },
  { id: "r7", quiz: "Electricity", subject: "physics", score: 6, total: 10, date: "24 Feb 2026" },
  { id: "r8", quiz: "Acids, Bases and Salts", subject: "chemistry", score: 8, total: 10, date: "23 Feb 2026" },
  { id: "r9", quiz: "A Letter to God", subject: "english", score: 9, total: 10, date: "22 Feb 2026" },
  { id: "r10", quiz: "Magnetic Effects of Electric Current", subject: "physics", score: 6, total: 10, date: "21 Feb 2026" },
  { id: "r11", quiz: "Control and Coordination", subject: "biology", score: 5, total: 10, date: "20 Feb 2026" },
  { id: "r12", quiz: "Pair of Linear Equations", subject: "mathematics", score: 8, total: 10, date: "19 Feb 2026" },
];

/* ── Subject average calculator ── */
function getSubjectAverages() {
  const map: Record<string, { total: number; count: number; color: string; label: string }> = {};
  for (const r of RESULTS) {
    const sub = SUBJECTS.find((s) => s.key === r.subject);
    if (!sub) continue;
    if (!map[r.subject]) {
      map[r.subject] = { total: 0, count: 0, color: sub.color, label: sub.label };
    }
    map[r.subject].total += r.score;
    map[r.subject].count += 1;
  }
  return Object.entries(map).map(([key, val]) => ({
    key,
    label: val.label,
    color: val.color,
    average: Math.round((val.total / val.count) * 10),
    quizCount: val.count,
  }));
}

/* ── Animation variants ── */
const container = staggerContainer(staggerDelay.tight + 0.01);
const item = fadeUp(10, 0.45);
const cardItem = cardReveal(12, duration.normal);

/* ── Floating particles for warm light theme ── */
const PARTICLES = Array.from({ length: 7 }, (_, i) => ({
  id: i,
  left: `${10 + i * 13}%`,
  delay: i * 0.8,
  duration: 6 + (i % 3) * 2,
  size: 2,
}));

function getSubjectColor(key: string): string {
  return SUBJECTS.find((s) => s.key === key)?.color ?? "#f2740d";
}
function getSubjectLabel(key: string): string {
  return SUBJECTS.find((s) => s.key === key)?.label ?? key;
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

/* ── Animated progress bar for subject averages ── */
function AnimatedBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-1 w-full rounded-full bg-bg-elevated mt-2 overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{
          type: "spring",
          stiffness: 60,
          damping: 15,
          delay: 0.4,
        }}
      />
    </div>
  );
}

export function MyResults() {
  const [activeSubject, setActiveSubject] = useState<string>("all");

  const filtered =
    activeSubject === "all"
      ? RESULTS
      : RESULTS.filter((r) => r.subject === activeSubject);

  const subjectAverages = getSubjectAverages();
  const overallAverage = RESULTS.length
    ? Math.round(
        (RESULTS.reduce((acc, r) => acc + r.score, 0) / RESULTS.length) * 10,
      )
    : 0;

  const animatedOverall = useAnimatedCounter(overallAverage, 800);

  return (
    <div className="relative space-y-6 pb-12">
      {/* ── Animated background blob (warm light theme) ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-32 -right-20 h-[500px] w-[500px] rounded-full opacity-[0.05]"
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
          className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full opacity-[0.04]"
          style={{
            background: "radial-gradient(circle, #fb923c 0%, #f59e0b 40%, transparent 70%)",
            filter: "blur(100px)",
          }}
          animate={{
            x: [0, -20, 15, 0],
            y: [0, 25, -15, 0],
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
        <h1 className="text-display-md text-text-primary">My Results</h1>
        <p className="text-body-lg text-text-secondary mt-1">
          Track your quiz performance across subjects
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

      {/* ── Average score cards with animated counters and progress bars ── */}
      <motion.div
        {...fadeUpProps(8, 0.1, 0.4)}
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
      >
        {/* Overall */}
        <motion.div
          whileHover={{ y: -4, boxShadow: "0 4px 20px rgba(242,116,13,0.08)" }}
          className="col-span-2 sm:col-span-1 flex flex-col gap-2 rounded-xl border border-orange-500/20 p-5 transition-shadow"
          style={{ backgroundColor: "rgba(242,116,13,0.06)" }}
        >
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <BarChart3 size={16} strokeWidth={1.5} className="text-orange-400" />
            </motion.div>
            <span className="text-caption text-orange-400">Overall</span>
          </div>
          <p className="text-heading-1 text-text-primary">{animatedOverall}%</p>
          <p className="text-body-sm text-text-secondary">{RESULTS.length} quizzes</p>
          <AnimatedBar value={overallAverage} color="#f2740d" />
        </motion.div>

        {/* Per subject with hover effects */}
        {subjectAverages.map((sa, i) => (
          <motion.div
            key={sa.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.08, duration: 0.4, ease: ease.gentle }}
            whileHover={{ y: -4, boxShadow: "0 4px 16px rgba(0,0,0,0.04)" }}
            className="flex flex-col gap-2 rounded-xl border border-border-subtle p-4 transition-shadow"
            style={{ backgroundColor: "var(--color-portal-student-surface)" }}
          >
            <div className="flex items-center gap-2">
              <motion.div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: sa.color }}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, delay: i * 0.3, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="text-caption text-text-muted">{sa.label}</span>
            </div>
            <p className="text-heading-2 text-text-primary">{sa.average}%</p>
            <div className="flex items-center gap-1">
              {sa.average >= 75 ? (
                <TrendingUp size={12} strokeWidth={1.5} className="text-success" />
              ) : (
                <TrendingDown size={12} strokeWidth={1.5} className="text-error" />
              )}
              <span className="text-body-sm text-text-secondary">
                {sa.quizCount} quiz{sa.quizCount > 1 ? "zes" : ""}
              </span>
            </div>
            <AnimatedBar value={sa.average} color={sa.color} />
          </motion.div>
        ))}
      </motion.div>

      {/* ── Subject filter with micro-interactions ── */}
      <motion.div
        {...fadeUpProps(0, 0.2)}
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

      {/* ── Results table / list with card hover effects ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubject}
          variants={container}
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
        >
          {/* ── Table header (desktop) ── */}
          <div className="hidden sm:grid grid-cols-12 gap-4 px-5 pb-2 text-overline text-text-muted">
            <span className="col-span-5">Quiz</span>
            <span className="col-span-2">Subject</span>
            <span className="col-span-2 text-right">Score</span>
            <span className="col-span-2 text-right">Date</span>
            <span className="col-span-1" />
          </div>

          <div className="space-y-2">
            {filtered.length === 0 && (
              <motion.div variants={item} className="py-16 text-center">
                <p className="text-display-sm text-text-muted">No results yet</p>
              </motion.div>
            )}
            {filtered.map((r) => {
              const pct = (r.score / r.total) * 100;
              const scoreColor = pct >= 70 ? "#34d399" : pct >= 50 ? "#fb923c" : "#f87171";
              const subjectColor = getSubjectColor(r.subject);

              return (
                <motion.div key={r.id} variants={cardItem} whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                  <Link
                    to="/student/quiz/$id/result"
                    params={{ id: r.id }}
                    className="group relative grid grid-cols-12 items-center gap-4 rounded-xl border border-border-subtle p-4 sm:px-5 transition-all duration-200 hover:border-border-default overflow-hidden"
                    style={{ backgroundColor: "var(--color-portal-student-surface)" }}
                  >
                    {/* Warm glow overlay on hover */}
                    <div
                      className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{
                        background: "radial-gradient(ellipse at 50% 0%, rgba(242,116,13,0.03) 0%, transparent 70%)",
                      }}
                    />

                    {/* Quiz name */}
                    <div className="relative z-10 col-span-12 sm:col-span-5">
                      <p className="text-body-lg text-text-primary font-medium truncate">
                        {r.quiz}
                      </p>
                      <p className="text-body-sm text-text-muted sm:hidden">
                        {getSubjectLabel(r.subject)} &middot; {r.date}
                      </p>
                    </div>

                    {/* Subject (desktop) */}
                    <div className="relative z-10 hidden sm:flex col-span-2 items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: subjectColor }}
                      />
                      <span className="text-body-sm text-text-secondary">
                        {getSubjectLabel(r.subject)}
                      </span>
                    </div>

                    {/* Score */}
                    <div className="relative z-10 hidden sm:block col-span-2 text-right">
                      <span
                        className="text-heading-3 font-semibold"
                        style={{ color: scoreColor }}
                      >
                        {r.score}/{r.total}
                      </span>
                      <p className="text-caption text-text-muted">{pct}%</p>
                    </div>

                    {/* Date (desktop) */}
                    <span className="relative z-10 hidden sm:block col-span-2 text-right text-body-sm text-text-muted">
                      {r.date}
                    </span>

                    {/* Mobile score + chevron */}
                    <div className="relative z-10 col-span-12 sm:col-span-1 flex items-center justify-between sm:justify-end">
                      <span
                        className="text-heading-3 font-semibold sm:hidden"
                        style={{ color: scoreColor }}
                      >
                        {r.score}/{r.total}
                      </span>
                      <ChevronRight
                        size={18}
                        strokeWidth={1.5}
                        className="text-text-muted transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
