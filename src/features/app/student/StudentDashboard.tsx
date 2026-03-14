import { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { Link } from "@tanstack/react-router";
import {
  Atom,
  Calculator,
  FlaskConical,
  BookOpen,
  ChevronRight,
  TrendingUp,
  Flame,
  Trophy,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Play,
} from "lucide-react";
import {
  ease,
  breatheLoop,
  pulseLoop,
} from "@/lib/animation";

/* ── Animated Background (Student - warm/light theme) ── */
function StudentAnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      {/* Warm orange blob - top right */}
      <motion.div
        className="absolute -top-28 right-[10%] h-[450px] w-[450px] rounded-full opacity-[0.05]"
        style={{
          background: "radial-gradient(circle, #f2740d 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
        animate={{
          x: [0, 20, -15, 0],
          y: [0, -18, 12, 0],
          scale: [1, 1.04, 0.97, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      />
      {/* Warm orange blob - bottom left */}
      <motion.div
        className="absolute bottom-[8%] left-[5%] h-[350px] w-[350px] rounded-full opacity-[0.04]"
        style={{
          background: "radial-gradient(circle, #fb923c 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
        animate={{
          x: [0, -15, 18, 0],
          y: [0, 15, -12, 0],
          scale: [1, 0.96, 1.03, 1],
        }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      />
      {/* Center pulse */}
      <motion.div
        className="absolute top-[40%] left-1/2 h-[350px] w-[350px] -translate-x-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, #f2740d 0%, transparent 70%)",
          filter: "blur(120px)",
        }}
        animate={{
          scale: [1, 1.18, 1],
          opacity: [0.02, 0.06, 0.02],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Dot grid pattern (lighter for warm bg) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(242,116,13,0.035) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Floating particles (warm tones) */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={`student-particle-${i}`}
          className="absolute rounded-full"
          style={{
            width: i % 3 === 0 ? 3 : 2,
            height: i % 3 === 0 ? 3 : 2,
            left: `${12 + ((i * 7.9) % 76)}%`,
            top: `${22 + ((i * 9.1) % 56)}%`,
            background: i % 3 === 0
              ? "rgba(242,116,13,0.4)"
              : i % 3 === 1
                ? "rgba(251,146,60,0.3)"
                : "rgba(168,85,247,0.25)",
          }}
          animate={{
            y: [0, -90 - i * 5],
            x: [0, i % 2 === 0 ? 12 : -12],
            opacity: [0, 0.55, 0],
          }}
          transition={{
            duration: 5 + (i % 3) * 1.5,
            repeat: Infinity,
            delay: i * 0.45,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

/* ── Accent line (warm orange for student) — now static ── */
function StudentAccentLine() {
  return (
    <div
      className="h-px mt-2"
      style={{
        background: "linear-gradient(to right, #f2740d, transparent)",
        width: "4rem",
      }}
    />
  );
}

/* ── Mock data ─────────────────────────────────────────────── */

const CONTINUE_MATERIAL = {
  id: "phys-ch5",
  title: "Chapter 5: Laws of Motion",
  subject: "Physics",
  progress: 60,
  icon: Atom,
  color: "#a855f7",
  bg: "rgba(168,85,247,0.10)",
};

const STATS = [
  { label: "Quizzes Completed", value: 24, suffix: "", icon: Trophy, color: "#f2740d", bg: "rgba(242,116,13,0.10)", isStreak: false },
  { label: "Average Score", value: 76, suffix: "%", icon: TrendingUp, color: "#34d399", bg: "rgba(52,211,153,0.10)", isStreak: false },
  { label: "Day Streak", value: 5, suffix: "", icon: Flame, color: "#fb923c", bg: "rgba(251,146,60,0.10)", isStreak: true },
] as const;

const SUBJECTS = [
  {
    name: "Physics",
    icon: Atom,
    chapters: 12,
    completed: 7,
    color: "#a855f7",
    bg: "rgba(168,85,247,0.08)",
    border: "rgba(168,85,247,0.20)",
  },
  {
    name: "Mathematics",
    icon: Calculator,
    chapters: 14,
    completed: 8,
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.20)",
  },
  {
    name: "Chemistry",
    icon: FlaskConical,
    chapters: 16,
    completed: 6,
    color: "#22c55e",
    bg: "rgba(34,197,94,0.08)",
    border: "rgba(34,197,94,0.20)",
  },
  {
    name: "English",
    icon: BookOpen,
    chapters: 10,
    completed: 7,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.20)",
  },
] as const;

const RECENT_QUIZZES = [
  {
    id: "q-101",
    name: "Laws of Motion",
    subject: "Physics",
    score: 90,
    date: "Today",
    passed: true,
  },
  {
    id: "q-98",
    name: "Chemical Bonding",
    subject: "Chemistry",
    score: 72,
    date: "Yesterday",
    passed: true,
  },
  {
    id: "q-95",
    name: "Quadratic Equations",
    subject: "Mathematics",
    score: 85,
    date: "2 days ago",
    passed: true,
  },
  {
    id: "q-91",
    name: "Comprehension Passage 4",
    subject: "English",
    score: 45,
    date: "3 days ago",
    passed: false,
  },
] as const;

const MOTIVATIONAL_LINES = [
  "Every expert was once a beginner. Keep going!",
  "Small steps every day lead to big results.",
  "You're building something amazing, one chapter at a time.",
  "Consistency beats intensity. You've got this!",
  "The best time to learn is now.",
] as const;

const QUIZ_SCORES = [72, 85, 68, 90, 45, 88] as const;
const QUIZ_LABELS = ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6"] as const;
const QUIZ_AVERAGE = Math.round(QUIZ_SCORES.reduce((a, b) => a + b, 0) / QUIZ_SCORES.length);

/* ── Helpers ───────────────────────────────────────────────── */

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getMotivationalLine(): string {
  const index = new Date().getDate() % MOTIVATIONAL_LINES.length;
  return MOTIVATIONAL_LINES[index];
}

function getBarColor(score: number): string {
  if (score >= 70) return "#34d399";
  if (score >= 50) return "#fbbf24";
  return "#f87171";
}

/* ── Animated counter ──────────────────────────────────────── */

function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(count, target, {
      duration: 1.2,
      ease: ease.gentle,
    });
    const unsubscribe = rounded.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [count, rounded, target]);

  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}

/* ── AI Tutor gradient orb ─────────────────────────────────── */

function GradientOrb() {
  return (
    <div className="relative h-14 w-14 shrink-0">
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle at 40% 40%, #f2740d, #fb923c 50%, #a855f7 100%)",
          filter: "blur(1px)",
        }}
        {...breatheLoop()}
      />
      <div
        className="absolute inset-[2px] rounded-full flex items-center justify-center"
        style={{ backgroundColor: "var(--color-portal-student-surface)" }}
      >
        <Sparkles size={18} strokeWidth={1.5} className="text-orange-400" />
      </div>
    </div>
  );
}

/* ── Quiz Performance Chart ───────────────────────────────── */

function QuizPerformanceChart() {
  const maxScore = 100;
  const maxBarHeight = 140;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: ease.gentle }}
      className="group relative overflow-hidden rounded-xl border border-border-subtle p-7 transition-colors duration-200 hover:border-orange-500/20 hover:shadow-glow-orange"
      style={{ backgroundColor: "var(--color-portal-student-surface)" }}
    >
      {/* Corner accent */}
      <div className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "radial-gradient(circle, rgba(242,116,13,0.12), transparent 70%)" }}
      />
      {/* Header */}
      <div className="relative flex items-start justify-between mb-8">
        <div>
          <h3 className="text-heading-2 text-text-primary">Quiz Performance</h3>
          <p className="text-body-sm text-text-muted mt-1">Last 6 attempts</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500/10 px-3 py-1.5 text-body-sm font-semibold text-orange-400 border border-orange-500/20">
          Average: {QUIZ_AVERAGE}%
        </span>
      </div>

      {/* Bar chart */}
      <div className="relative flex items-end justify-center gap-3" style={{ height: `${maxBarHeight + 40}px` }}>
        {QUIZ_SCORES.map((score, i) => {
          const barHeight = (score / maxScore) * maxBarHeight;
          const color = getBarColor(score);
          return (
            <div key={i} className="group/bar flex flex-col items-center gap-2">
              {/* Score label above bar */}
              <motion.span
                className="text-caption font-medium tabular-nums"
                style={{ color }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                {score}
              </motion.span>

              {/* Bar */}
              <div style={{ height: `${maxBarHeight}px`, width: "40px" }} className="relative">
                <motion.div
                  className="absolute bottom-0 left-0 right-0 rounded-t-md transition-opacity duration-200 group-hover/bar:opacity-100"
                  style={{
                    height: `${barHeight}px`,
                    backgroundColor: color,
                    originY: 1,
                    opacity: 0.85,
                  }}
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.7,
                    delay: 0.3 + i * 0.08,
                    ease: ease.spring,
                  }}
                />
                {/* Ghost bar for depth */}
                <div
                  className="absolute bottom-0 left-0 right-0 rounded-t-md"
                  style={{
                    height: `${barHeight}px`,
                    backgroundColor: color,
                    opacity: 0.15,
                  }}
                />
              </div>

              {/* Label below bar */}
              <span className="text-caption text-text-secondary">{QUIZ_LABELS[i]}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ── Main component ────────────────────────────────────────── */

export function StudentDashboard() {
  const greeting = getGreeting();
  const motivation = getMotivationalLine();

  return (
    <div className="relative space-y-10 pb-20">
      {/* ── Animated Background ── */}
      <StudentAnimatedBackground />

      {/* ── Greeting (full width) ── */}
      <section>
        <h1 className="text-display-md text-text-primary">
          {greeting}, Rahul
        </h1>
        <p className="mt-1 text-body-lg text-text-secondary">
          Class 10-A &middot; Ready to learn something new?
        </p>
        <p className="mt-2 text-body-sm text-text-muted italic">
          {motivation}
        </p>
        <StudentAccentLine />
      </section>

      {/* ── Continue Where You Left Off (full width, spacious) ── */}
      <section>
        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.25, ease: ease.gentle }}>
        <Link
          to="/student/materials"
          className="group relative block overflow-hidden rounded-xl border border-border-subtle transition-all duration-200 hover:border-orange-500/30 hover:shadow-glow-orange"
          style={{ backgroundColor: "var(--color-portal-student-surface)" }}
        >
          {/* Warm accent glow behind card */}
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-[0.04]"
            style={{ background: "radial-gradient(circle, #f2740d, transparent 70%)" }}
          />

          <div className="relative flex items-center gap-6 p-8">
            {/* Subject icon */}
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: CONTINUE_MATERIAL.bg }}
            >
              <CONTINUE_MATERIAL.icon
                size={32}
                strokeWidth={1.5}
                style={{ color: CONTINUE_MATERIAL.color }}
              />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <p className="text-overline text-text-muted mb-1.5">
                Continue where you left off
              </p>
              <h2 className="text-heading-2 text-text-primary truncate">
                {CONTINUE_MATERIAL.title}
              </h2>
              <p className="text-body-md text-text-secondary mt-1">
                {CONTINUE_MATERIAL.subject} &middot; {CONTINUE_MATERIAL.progress}% complete
              </p>

              {/* Progress bar */}
              <div className="mt-4 h-2 w-full max-w-md overflow-hidden rounded-full bg-bg-elevated">
                <motion.div
                  className="h-full rounded-full bg-orange-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${CONTINUE_MATERIAL.progress}%` }}
                  transition={{ duration: 1, delay: 0.4, ease: ease.gentle }}
                />
              </div>
            </div>

            {/* CTA */}
            <motion.div
              className="hidden shrink-0 sm:flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-body-md font-semibold text-white shadow-sm transition-all duration-200 group-hover:bg-orange-400 group-hover:shadow-glow-orange"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Play size={16} strokeWidth={2} />
              Continue Learning
            </motion.div>

            {/* Mobile chevron */}
            <ChevronRight
              size={20}
              strokeWidth={1.5}
              className="shrink-0 text-text-muted transition-transform duration-200 group-hover:translate-x-1 group-hover:text-orange-400 sm:hidden"
            />
          </div>
        </Link>
        </motion.div>
      </section>

      {/* ── Two-column grid: Left (Stats + Materials) | Right (Quiz Chart + Recent Quizzes) ── */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[55%_1fr]">
        {/* ── LEFT COLUMN ── */}
        <div className="space-y-10">
          {/* Stats Row */}
          <section className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25, ease: ease.gentle }}
                  className="group relative flex items-center gap-5 overflow-hidden rounded-xl border border-border-subtle p-6 transition-colors duration-200 hover:border-orange-500/20 hover:shadow-glow-orange"
                  style={{ backgroundColor: "var(--color-portal-student-surface)" }}
                >
                  {/* Corner accent blob */}
                  <div
                    className="pointer-events-none absolute -top-6 -right-6 h-20 w-20 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: `radial-gradient(circle, ${stat.color}20, transparent 70%)` }}
                  />
                  {/* Gradient glow overlay on hover */}
                  <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: `linear-gradient(135deg, ${stat.color}08, transparent 60%)` }}
                  />
                  <div
                    className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: stat.bg }}
                  >
                    {stat.isStreak ? (
                      <motion.div
                        {...pulseLoop()}
                      >
                        <Icon size={24} strokeWidth={1.5} style={{ color: stat.color }} />
                      </motion.div>
                    ) : (
                      <Icon size={24} strokeWidth={1.5} style={{ color: stat.color }} />
                    )}
                  </div>
                  <div className="relative">
                    <p className="text-[40px] font-display leading-none text-text-primary tabular-nums">
                      <AnimatedNumber target={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className="text-body-md text-text-secondary mt-1.5">{stat.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </section>

          {/* Study Materials */}
          <section>
            <div className="mb-1 flex items-center justify-between">
              <h2 className="text-heading-2 text-text-primary">
                Study Materials
              </h2>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/student/materials"
                  className="inline-flex items-center gap-1.5 text-body-sm font-medium text-orange-400 transition-colors hover:text-orange-300"
                >
                  View all
                  <ArrowRight size={14} strokeWidth={2} />
                </Link>
              </motion.div>
            </div>
            <StudentAccentLine />
            <div className="mb-4" />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {SUBJECTS.map((subject, i) => {
                const Icon = subject.icon;
                const progress = Math.round((subject.completed / subject.chapters) * 100);
                return (
                  <motion.div key={subject.name} whileHover={{ y: -4 }} transition={{ duration: 0.25, ease: ease.gentle }}>
                    <Link
                      to="/student/materials"
                      search={{ subject: subject.name }}
                      className="group flex items-center gap-5 rounded-xl border p-7 transition-all duration-200 hover:shadow-glow-orange hover:border-orange-500/20"
                      style={{
                        backgroundColor: "var(--color-portal-student-surface)",
                        borderColor: subject.border,
                      }}
                    >
                      {/* Colored left border accent */}
                      <div
                        className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full hidden"
                        style={{ backgroundColor: subject.color }}
                      />

                      {/* Icon */}
                      <div
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
                        style={{ backgroundColor: subject.bg }}
                      >
                        <Icon size={26} strokeWidth={1.5} style={{ color: subject.color }} />
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-heading-3 text-text-primary group-hover:text-orange-400 transition-colors">
                          {subject.name}
                        </h3>
                        <p className="text-body-md text-text-secondary mt-1">
                          {subject.completed} of {subject.chapters} chapters
                        </p>
                        {/* Inline progress */}
                        <div className="mt-3 flex items-center gap-3">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-bg-elevated">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: subject.color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{
                                duration: 0.8,
                                delay: 0.5 + i * 0.1,
                                ease: ease.gentle,
                              }}
                            />
                          </div>
                          <span className="text-caption text-text-muted tabular-nums w-8 text-right">
                            {progress}%
                          </span>
                        </div>
                      </div>

                      <ChevronRight
                        size={18}
                        strokeWidth={1.5}
                        className="shrink-0 text-text-muted transition-transform duration-200 group-hover:translate-x-1 group-hover:text-orange-400"
                      />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </section>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="space-y-10">
          {/* Quiz Performance Chart */}
          <QuizPerformanceChart />

          {/* Recent Quizzes */}
          <section>
            <div className="mb-1 flex items-center justify-between">
              <h2 className="text-heading-2 text-text-primary">
                Recent Quizzes
              </h2>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/student/results"
                  className="inline-flex items-center gap-1.5 text-body-sm font-medium text-orange-400 transition-colors hover:text-orange-300"
                >
                  View all
                  <ArrowRight size={14} strokeWidth={2} />
                </Link>
              </motion.div>
            </div>
            <StudentAccentLine />
            <div className="mb-4" />

            <div className="space-y-4">
              {RECENT_QUIZZES.map((quiz) => {
                const scoreColor = quiz.score >= 70 ? "#34d399" : quiz.score >= 50 ? "#fbbf24" : "#f87171";
                return (
                  <motion.div key={quiz.id} whileHover={{ x: 4 }} transition={{ duration: 0.2, ease: ease.gentle }}>
                    <Link
                      to="/student/quizzes"
                      className="group flex items-center gap-5 rounded-xl border border-border-subtle p-5 transition-all duration-200 hover:border-orange-500/20 hover:shadow-glow-orange"
                      style={{ backgroundColor: "var(--color-portal-student-surface)" }}
                    >
                      {/* Score circle */}
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
                        style={{ backgroundColor: `${scoreColor}15` }}
                      >
                        <span
                          className="text-heading-3 font-semibold tabular-nums"
                          style={{ color: scoreColor }}
                        >
                          {quiz.score}
                        </span>
                      </div>

                      {/* Quiz info */}
                      <div className="min-w-0 flex-1">
                        <p className="text-body-lg text-text-primary font-medium truncate group-hover:text-orange-400 transition-colors">
                          {quiz.name}
                        </p>
                        <p className="text-body-md text-text-secondary mt-0.5">
                          {quiz.subject} &middot; {quiz.date}
                        </p>
                      </div>

                      {/* Pass/Fail badge */}
                      <div className="flex shrink-0 items-center gap-1.5">
                        {quiz.passed ? (
                          <span className="inline-flex items-center gap-1 rounded-xl bg-emerald-500/10 px-3 py-1 text-body-sm font-semibold text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 size={14} strokeWidth={2} />
                            Pass
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-xl bg-red-500/10 px-3 py-1 text-body-sm font-semibold text-red-400 border border-red-500/20">
                            <XCircle size={14} strokeWidth={2} />
                            Fail
                          </span>
                        )}
                      </div>

                      <ChevronRight
                        size={16}
                        strokeWidth={1.5}
                        className="shrink-0 text-text-muted transition-transform duration-200 group-hover:translate-x-1 group-hover:text-orange-400"
                      />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      {/* ── AI Tutor CTA (full width) ── */}
      <section>
        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.25, ease: ease.gentle }}>
        <Link
          to="/student/tutor"
          className="group relative block overflow-hidden rounded-xl border border-orange-500/30 transition-all duration-200 hover:border-orange-500/30 hover:shadow-glow-orange"
          style={{ backgroundColor: "var(--color-portal-student-surface)" }}
        >
          {/* Background accent glow */}
          <div
            className="pointer-events-none absolute -left-12 -bottom-12 h-40 w-40 rounded-full opacity-[0.05]"
            style={{ background: "radial-gradient(circle, #f2740d, transparent 70%)" }}
          />
          <div
            className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-[0.04]"
            style={{ background: "radial-gradient(circle, #a855f7, transparent 70%)" }}
          />

          <div className="relative flex items-center gap-6 p-8">
            <GradientOrb />

            <div className="min-w-0 flex-1">
              <h2 className="text-heading-2 text-text-primary">
                Need help? Ask Erudio AI
              </h2>
              <p className="text-body-md text-text-secondary mt-1.5 max-w-lg">
                Get instant explanations, solve doubts, and explore topics in depth with your personal AI tutor.
              </p>
            </div>

            <motion.div
              className="hidden shrink-0 sm:flex items-center gap-2 rounded-xl border border-orange-500/40 bg-orange-500/10 px-6 py-3 text-body-md font-semibold text-orange-400 transition-all duration-200 group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500 group-hover:shadow-glow-orange"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Sparkles size={16} strokeWidth={2} />
              Start a conversation
            </motion.div>

            <ChevronRight
              size={20}
              strokeWidth={1.5}
              className="shrink-0 text-text-muted transition-transform duration-200 group-hover:translate-x-1 group-hover:text-orange-400 sm:hidden"
            />
          </div>
        </Link>
        </motion.div>
      </section>
    </div>
  );
}
