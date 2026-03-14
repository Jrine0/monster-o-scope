import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Sparkles,
  BookOpen,
  Upload,
  Clock,
  GraduationCap,
  FileText,
  Zap,
  ArrowRight,
  TrendingUp,
  Users,
  Atom,
  Sigma,
  FlaskConical,
  BrainCircuit,
} from "lucide-react";
import { ease } from "@/lib/animation";

/* ── Animated Background ── */
function TeacherAnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      {/* Orange blob - top right */}
      <motion.div
        className="absolute -top-32 right-[12%] h-[500px] w-[500px] rounded-full opacity-[0.06]"
        style={{
          background: "radial-gradient(circle, var(--color-orange-500) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
        animate={{
          x: [0, 25, -20, 0],
          y: [0, -20, 15, 0],
          scale: [1, 1.05, 0.97, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      />
      {/* Orange blob - bottom left */}
      <motion.div
        className="absolute bottom-[5%] left-[8%] h-[400px] w-[400px] rounded-full opacity-[0.05]"
        style={{
          background: "radial-gradient(circle, var(--color-orange-400) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
        animate={{
          x: [0, -18, 22, 0],
          y: [0, 18, -12, 0],
          scale: [1, 0.96, 1.04, 1],
        }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      />
      {/* Center pulse */}
      <motion.div
        className="absolute top-[35%] left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, var(--color-orange-400) 0%, transparent 70%)",
          filter: "blur(120px)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.03, 0.07, 0.03],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Dot grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(242,116,13,0.03) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`teacher-particle-${i}`}
          className="absolute rounded-full"
          style={{
            width: i % 3 === 0 ? 3 : 2,
            height: i % 3 === 0 ? 3 : 2,
            left: `${10 + ((i * 7.1) % 80)}%`,
            top: `${20 + ((i * 8.7) % 60)}%`,
            background: i % 2 === 0
              ? "rgba(242,116,13,0.5)"
              : "rgba(251,146,60,0.35)",
          }}
          animate={{
            y: [0, -100 - i * 6],
            x: [0, i % 2 === 0 ? 15 : -15],
            opacity: [0, 0.65, 0],
          }}
          transition={{
            duration: 5 + (i % 4) * 1.5,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

/* ── Static accent line ── */
function OrangeAccentLine() {
  return (
    <div
      className="h-px mt-2"
      style={{
        width: "4rem",
        background: "linear-gradient(to right, var(--color-orange-500), transparent)",
      }}
    />
  );
}

/* ── Greeting helper ── */
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/* ── Mock data ── */
const STATS = [
  {
    label: "Classes",
    value: "4",
    description: "Physics 10-A, 10-B, Math 11-A, 11-B",
    icon: GraduationCap,
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-400",
  },
  {
    label: "Materials Created",
    value: "87",
    description: "Worksheets, quizzes & lesson plans",
    icon: FileText,
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-400",
  },
  {
    label: "Generated This Week",
    value: "12",
    description: "+3 from last week",
    icon: Zap,
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-400",
    trend: "+33%",
  },
  {
    label: "Student Engagement",
    value: "94%",
    description: "Across all classes",
    icon: Users,
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-400",
    trend: "+2%",
  },
] as const;

const QUICK_ACTIONS = [
  {
    label: "Generate Content",
    description: "Create worksheets, quizzes & plans with AI",
    to: "/teacher/generate",
    icon: Sparkles,
  },
  {
    label: "Upload PDF",
    description: "Import existing materials to your library",
    to: "/teacher/generate",
    icon: Upload,
  },
  {
    label: "Browse Library",
    description: "Explore NCERT-aligned content across subjects",
    to: "/teacher/library",
    icon: BookOpen,
  },
] as const;

const TYPE_STYLES: Record<string, string> = {
  Worksheet: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Quiz: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Lesson Plan": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Practice Set": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Handout: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const RECENT_MATERIALS = [
  {
    id: "m-001",
    title: "Laws of Motion — Worksheet",
    type: "Worksheet",
    subject: "Physics",
    cls: "Class 10-A",
    date: "2 hours ago",
  },
  {
    id: "m-002",
    title: "Thermodynamics Quiz",
    type: "Quiz",
    subject: "Physics",
    cls: "Class 10-B",
    date: "Yesterday",
  },
  {
    id: "m-003",
    title: "Quadratic Equations Practice Set",
    type: "Practice Set",
    subject: "Mathematics",
    cls: "Class 11-A",
    date: "2 days ago",
  },
  {
    id: "m-004",
    title: "Electromagnetic Induction — Lesson Plan",
    type: "Lesson Plan",
    subject: "Physics",
    cls: "Class 10-A",
    date: "3 days ago",
  },
  {
    id: "m-005",
    title: "Probability Basics — Handout",
    type: "Handout",
    subject: "Mathematics",
    cls: "Class 11-B",
    date: "4 days ago",
  },
] as const;

const SUGGESTIONS = [
  {
    id: "s-001",
    topic: "Wave Optics — Interference & Diffraction",
    subject: "Physics",
    reason: "Upcoming in Class 10-A syllabus",
    icon: Atom,
  },
  {
    id: "s-002",
    topic: "Integration by Parts",
    subject: "Mathematics",
    reason: "Students scored low on last quiz",
    icon: Sigma,
  },
  {
    id: "s-003",
    topic: "Thermal Properties of Matter",
    subject: "Physics",
    reason: "Trending topic this month",
    icon: FlaskConical,
  },
] as const;

/* ── Weekly Activity data ── */
const WEEKLY_DATA = [
  { day: "M", value: 4 },
  { day: "T", value: 7 },
  { day: "W", value: 3 },
  { day: "T", value: 8 },
  { day: "F", value: 12 },
  { day: "S", value: 6 },
  { day: "S", value: 2 },
] as const;

const WEEKLY_MAX = Math.max(...WEEKLY_DATA.map((d) => d.value));
const WEEKLY_TOTAL = WEEKLY_DATA.reduce((sum, d) => sum + d.value, 0);
const BAR_MAX_HEIGHT = 160;

/* ── Date formatter ── */
function getFormattedDate(): string {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/* ── Component ── */
export function TeacherDashboard() {
  const greeting = getGreeting();

  return (
    <div className="relative space-y-10 pb-16">
      {/* ── Animated Background ── */}
      <TeacherAnimatedBackground />

      {/* ── 1. Greeting + Generate Content CTA ── */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[40px] leading-tight text-text-primary font-display tracking-tight">
            {greeting}, Priya
          </h1>
          <p className="mt-2 text-body-md text-text-secondary">
            Here&apos;s what&apos;s happening with your content today.
          </p>
          <OrangeAccentLine />
        </div>
        <div className="flex items-center gap-4">
          <p className="hidden text-body-md text-text-muted sm:block">
            {getFormattedDate()}
          </p>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/teacher/generate"
              className="inline-flex items-center gap-2.5 rounded-[var(--radius-md)] bg-orange-500 px-6 py-3 text-body-md font-semibold text-white shadow-lg shadow-orange-500/20 transition-all duration-200 hover:bg-orange-400 hover:shadow-xl hover:shadow-orange-500/25"
            >
              <Sparkles size={18} strokeWidth={2} />
              Generate Content
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ── 2. Quick Actions Row ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.label}
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={action.to}
                className="group relative flex items-center gap-4 overflow-hidden rounded-xl border border-border-subtle bg-bg-surface px-5 py-4 transition-all duration-200 hover:border-orange-500/30 hover:shadow-glow-orange"
              >
                {/* Corner accent blob */}
                <div
                  className="pointer-events-none absolute -top-6 -right-6 h-16 w-16 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: "radial-gradient(circle, rgba(242,116,13,0.15), transparent 70%)" }}
                />
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-orange-500/10">
                  <Icon
                    size={20}
                    strokeWidth={1.5}
                    className="text-orange-400 transition-colors duration-150 group-hover:text-orange-300"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-heading-3 text-text-primary transition-colors duration-150 group-hover:text-orange-400">
                    {action.label}
                  </h3>
                  <p className="mt-0.5 text-caption text-text-secondary">
                    {action.description}
                  </p>
                </div>
                <ArrowRight
                  size={16}
                  strokeWidth={2}
                  className="shrink-0 text-text-muted opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5"
                />
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* ── 3. Two-column: Recent Materials (left ~60%) + Suggested Content (right ~40%) ── */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_0.65fr]">
        {/* LEFT — Recent Materials */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-heading-2 text-text-primary">
              Recent Materials
            </h2>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/teacher/materials"
                className="inline-flex items-center gap-1.5 text-body-sm font-medium text-orange-400 transition-colors hover:text-orange-300"
              >
                View all
                <ArrowRight size={14} strokeWidth={2} />
              </Link>
            </motion.div>
          </div>
          <OrangeAccentLine />
          <div className="mb-4" />

          <div className="flex flex-col gap-2">
            {RECENT_MATERIALS.map((material) => (
              <motion.div
                key={material.id}
                whileHover={{ x: 4 }}
              >
                <Link
                  to="/teacher/materials"
                  className="group flex items-center gap-4 rounded-[var(--radius-md)] border border-border-subtle bg-bg-surface px-6 py-5 transition-all duration-200 hover:border-orange-500/20 hover:bg-bg-elevated"
                >
                  {/* Icon */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-bg-elevated">
                    <FileText
                      size={18}
                      strokeWidth={1.5}
                      className="text-text-muted transition-colors duration-150 group-hover:text-orange-400"
                    />
                  </div>

                  {/* Title + meta */}
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-body-md font-medium text-text-primary transition-colors duration-150 group-hover:text-orange-400">
                      {material.title}
                    </h3>
                    <div className="mt-1 flex items-center gap-2 text-body-sm text-text-secondary">
                      <span>{material.subject}</span>
                      <span className="h-1 w-1 rounded-full bg-text-muted" />
                      <span>{material.cls}</span>
                    </div>
                  </div>

                  {/* Type badge */}
                  <span
                    className={`shrink-0 rounded-[var(--radius-xs)] border px-2 py-0.5 text-caption font-semibold ${TYPE_STYLES[material.type] ?? "bg-bg-muted text-text-secondary border-border-subtle"}`}
                  >
                    {material.type}
                  </span>

                  {/* Date */}
                  <span className="hidden shrink-0 items-center gap-1.5 text-caption text-text-muted sm:inline-flex">
                    <Clock size={12} strokeWidth={1.5} />
                    {material.date}
                  </span>

                  {/* Arrow */}
                  <ArrowRight
                    size={16}
                    strokeWidth={2}
                    className="shrink-0 text-text-muted opacity-0 transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0.5"
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT — Suggested Content */}
        <div>
          <div className="mb-1 flex items-center gap-2">
            <BrainCircuit
              size={20}
              strokeWidth={1.5}
              className="text-orange-400"
            />
            <h2 className="text-heading-2 text-text-primary">
              Suggested Content
            </h2>
          </div>
          <OrangeAccentLine />
          <p className="mt-3 mb-4 text-body-sm text-text-secondary">
            AI-recommended topics based on your syllabus and student performance.
          </p>

          <div className="flex flex-col gap-4">
            {SUGGESTIONS.map((suggestion) => {
              const Icon = suggestion.icon;
              return (
                <motion.div
                  key={suggestion.id}
                  whileHover={{ y: -3 }}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border-subtle bg-bg-surface p-6 transition-colors duration-200 hover:border-orange-500/20 hover:shadow-glow-orange"
                >
                  {/* Corner accent */}
                  <div
                    className="pointer-events-none absolute -top-6 -right-6 h-20 w-20 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: "radial-gradient(circle, rgba(242,116,13,0.12), transparent 70%)" }}
                  />
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-orange-500/10">
                      <Icon
                        size={20}
                        strokeWidth={1.5}
                        className="text-orange-400"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-heading-3 text-text-primary">
                        {suggestion.topic}
                      </h3>
                      <div className="mt-1 flex items-center gap-2 text-body-sm text-text-secondary">
                        <span>{suggestion.subject}</span>
                        <span className="h-1 w-1 rounded-full bg-text-muted" />
                        <span className="text-caption text-text-muted">
                          {suggestion.reason}
                        </span>
                      </div>
                    </div>
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      to="/teacher/generate"
                      className="relative mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-orange-500/30 bg-orange-500/8 px-4 py-2 text-body-sm font-semibold text-orange-400 transition-all duration-200 hover:bg-orange-500/15 hover:border-orange-500/50 hover:shadow-[0_0_16px_rgba(242,116,13,0.08)]"
                    >
                      <Sparkles size={14} strokeWidth={2} />
                      Generate
                    </Link>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 4. Stats + Weekly Activity (bottom row) ── */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_0.65fr]">
        {/* LEFT — Stat cards 2x2 */}
        <div className="grid grid-cols-2 gap-5">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-xl border border-border-subtle bg-bg-surface p-7 transition-colors duration-200 hover:border-orange-500/20 hover:shadow-glow-orange"
              >
                {/* Corner accent blob */}
                <div
                  className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: "radial-gradient(circle, rgba(242,116,13,0.15), transparent 70%)" }}
                />
                {/* Gradient glow overlay on hover */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: "linear-gradient(135deg, rgba(242,116,13,0.04), transparent 60%)" }}
                />

                <div className="relative flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-[var(--radius-sm)] ${stat.iconBg}`}
                  >
                    <Icon
                      size={22}
                      strokeWidth={1.5}
                      className={stat.iconColor}
                    />
                  </div>
                  {"trend" in stat && stat.trend && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-caption font-semibold text-emerald-400">
                      <TrendingUp size={12} strokeWidth={2} />
                      {stat.trend}
                    </span>
                  )}
                </div>
                <p className="relative mt-5 text-[44px] font-display leading-none tracking-tight text-text-primary">
                  {stat.value}
                </p>
                <p className="relative mt-2 text-body-sm font-medium text-text-secondary">
                  {stat.label}
                </p>
                <p className="relative mt-1 text-caption text-text-muted">
                  {stat.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* RIGHT — Weekly Activity chart */}
        <motion.div
          whileHover={{ y: -4 }}
          className="group relative flex flex-col overflow-hidden rounded-xl border border-border-subtle bg-bg-surface p-7 transition-colors duration-200 hover:border-orange-500/20 hover:shadow-glow-orange"
        >
          {/* Corner accent */}
          <div
            className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: "radial-gradient(circle, rgba(242,116,13,0.12), transparent 70%)" }}
          />
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-heading-2 text-text-primary">
                Weekly Activity
              </h3>
              <p className="mt-1 text-body-sm text-text-secondary">
                Materials generated this week
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 px-3 py-1.5 text-caption font-semibold text-orange-400">
              <Zap size={12} strokeWidth={2} />
              {WEEKLY_TOTAL} this week
            </span>
          </div>

          {/* Bar chart */}
          <div className="mt-auto flex items-end justify-between gap-3 px-2 pt-8">
            {WEEKLY_DATA.map((entry, i) => {
              const barHeight = (entry.value / WEEKLY_MAX) * BAR_MAX_HEIGHT;
              return (
                <div
                  key={`${entry.day}-${i}`}
                  className="group flex flex-1 flex-col items-center gap-2"
                >
                  {/* Value label on hover */}
                  <span className="text-caption font-semibold text-orange-400 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                    {entry.value}
                  </span>

                  {/* Bar */}
                  <motion.div
                    className="w-full rounded-t-md bg-gradient-to-t from-orange-500 to-orange-400"
                    style={{
                      height: barHeight,
                      transformOrigin: "bottom",
                    }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{
                      duration: 0.7,
                      delay: 0.4 + i * 0.07,
                      ease: ease.spring,
                    }}
                  />

                  {/* Day label */}
                  <span className="text-caption font-medium text-text-muted">
                    {entry.day}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
