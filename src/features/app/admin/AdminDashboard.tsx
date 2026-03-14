import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import {
  Users,
  GraduationCap,
  BookOpen,
  FileText,
  TrendingUp,
  ArrowUpRight,
  UserPlus,
  School,
  BarChart3,
  Clock,
  ArrowRight,
  Plus,
  ChevronUp,
} from "lucide-react";
import { ease } from "@/lib/animation";
import AccentLine from "@/components/accent-line";

/* ── Helpers ── */

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatDate(): string {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/* ── Mock Data ── */

const STATS = [
  {
    label: "Total Teachers",
    value: "42",
    icon: Users,
    change: "+12%",
    changeLabel: "from last month",
    up: true,
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-400",
  },
  {
    label: "Total Students",
    value: "486",
    icon: GraduationCap,
    change: "+8%",
    changeLabel: "from last month",
    up: true,
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-400",
  },
  {
    label: "Active Classes",
    value: "24",
    icon: School,
    change: "",
    changeLabel: "across all grades",
    up: true,
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-400",
  },
  {
    label: "Materials Generated",
    value: "1,247",
    icon: FileText,
    change: "+23%",
    changeLabel: "this month",
    up: true,
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-400",
  },
] as const;

const GENERATION_DATA = [
  { month: "Sep", value: 120 },
  { month: "Oct", value: 185 },
  { month: "Nov", value: 210 },
  { month: "Dec", value: 290 },
  { month: "Jan", value: 345 },
  { month: "Feb", value: 420 },
] as const;

const RECENT_ACTIVITY = [
  {
    id: 1,
    teacher: "Priya Sharma",
    action: "Generated worksheet",
    subject: "Physics",
    date: "Today, 9:42 AM",
    avatar: "PS",
  },
  {
    id: 2,
    teacher: "Rahul Verma",
    action: "Created quiz",
    subject: "Mathematics",
    date: "Today, 9:15 AM",
    avatar: "RV",
  },
  {
    id: 3,
    teacher: "Anita Gupta",
    action: "Uploaded PDF",
    subject: "Hindi",
    date: "Today, 8:50 AM",
    avatar: "AG",
  },
  {
    id: 4,
    teacher: "Vikram Singh",
    action: "Generated lesson plan",
    subject: "Chemistry",
    date: "Yesterday, 4:30 PM",
    avatar: "VS",
  },
  {
    id: 5,
    teacher: "Meera Joshi",
    action: "Created quiz",
    subject: "Biology",
    date: "Yesterday, 3:15 PM",
    avatar: "MJ",
  },
  {
    id: 6,
    teacher: "Suresh Patel",
    action: "Generated worksheet",
    subject: "English",
    date: "Yesterday, 1:45 PM",
    avatar: "SP",
  },
] as const;

const QUICK_ACTIONS = [
  { label: "Add Teacher", icon: UserPlus, to: "/admin/teachers" as const, variant: "primary" as const },
  { label: "Add Student", icon: Plus, to: "/admin/students" as const, variant: "primary" as const },
  { label: "Create Class", icon: School, to: "/admin/classes" as const, variant: "secondary" as const },
  { label: "View Reports", icon: BarChart3, to: "/admin" as const, variant: "secondary" as const },
] as const;

/* ── Animated Background ── */
function AdminAnimatedBackground() {
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
      {/* Subtle center pulse */}
      <motion.div
        className="absolute top-[40%] left-1/2 h-100 w-100 -translate-x-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, #6571f5 0%, transparent 70%)",
          filter: "blur(120px)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.03, 0.08, 0.03],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
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
      {[...Array(14)].map((_, i) => (
        <motion.div
          key={`admin-particle-${i}`}
          className="absolute rounded-full"
          style={{
            width: i % 3 === 0 ? 3 : 2,
            height: i % 3 === 0 ? 3 : 2,
            left: `${8 + ((i * 6.7) % 84)}%`,
            top: `${25 + ((i * 8.3) % 55)}%`,
            background: i % 2 === 0
              ? "rgba(101,113,245,0.6)"
              : "rgba(101,113,245,0.35)",
          }}
          animate={{
            y: [0, -100 - i * 7],
            x: [0, i % 2 === 0 ? 15 : -15],
            opacity: [0, 0.7, 0],
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

/* ── Chart Component ── */

function AreaChart() {
  const maxValue = Math.max(...GENERATION_DATA.map((d) => d.value));
  const padding = 8;
  const width = 400;
  const height = 160;
  const graphWidth = width - padding * 2;
  const graphHeight = height - padding * 2;

  const points = GENERATION_DATA.map((d, i) => ({
    x: padding + (i / (GENERATION_DATA.length - 1)) * graphWidth,
    y: padding + graphHeight - (d.value / maxValue) * graphHeight,
  }));

  // Build smooth curve using cubic bezier
  let linePath = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx1 = prev.x + (curr.x - prev.x) * 0.4;
    const cpx2 = curr.x - (curr.x - prev.x) * 0.4;
    linePath += ` C ${cpx1} ${prev.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`;
  }

  const areaPath =
    linePath +
    ` L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return (
    <div className="relative">
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-caption text-text-muted pr-2">
        <span>{maxValue}</span>
        <span>{Math.round(maxValue / 2)}</span>
        <span>0</span>
      </div>
      <div className="ml-10">
        <svg viewBox={`0 0 ${width} ${height + 24}`} className="w-full h-56">
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-orange-500)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--color-orange-500)" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {/* Horizontal grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <line
              key={ratio}
              x1={padding}
              y1={padding + graphHeight * ratio}
              x2={width - padding}
              y2={padding + graphHeight * ratio}
              stroke="var(--color-border-subtle)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}
          {/* Area fill */}
          <motion.path
            d={areaPath}
            fill="url(#areaGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
          {/* Line */}
          <motion.path
            d={linePath}
            fill="none"
            stroke="var(--color-orange-500)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: ease.standard, delay: 0.2 }}
          />
          {/* Data points */}
          {points.map((point, i) => (
            <motion.circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="var(--color-bg-surface)"
              stroke="var(--color-orange-500)"
              strokeWidth="2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }}
            />
          ))}
          {/* X-axis labels */}
          {GENERATION_DATA.map((d, i) => (
            <text
              key={d.month}
              x={points[i].x}
              y={height + 18}
              textAnchor="middle"
              className="fill-text-secondary"
              style={{ fontSize: "11px" }}
            >
              {d.month}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}

/* ── Main Dashboard ── */

export function AdminDashboard() {
  return (
    <div className="relative space-y-8">
      {/* ── Animated Background ── */}
      <AdminAnimatedBackground />

      {/* ── Row 1: Greeting (left) + Quick Actions (right) ── */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        {/* Greeting */}
        <div className="min-w-0">
          <h1 className="text-display-md text-text-primary">
            {getGreeting()}, Admin
          </h1>
          <p className="text-body-md text-text-secondary mt-1.5">
            Here&apos;s what&apos;s happening at Delhi Public School today.
          </p>
          <AccentLine />
        </div>

        {/* Quick Actions + Date */}
        <div className="flex flex-col items-end gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2 rounded-lg border border-border-subtle bg-bg-surface px-4 py-2">
            <Clock size={14} className="text-text-muted" strokeWidth={1.5} />
            <span className="text-body-sm text-text-secondary">{formatDate()}</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.label}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    to={action.to}
                    className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-body-sm font-medium transition-all duration-150 ${
                      action.variant === "primary"
                        ? "bg-orange-500 text-white hover:bg-orange-400 shadow-sm hover:shadow-[0_0_24px_rgba(101,113,245,0.2)]"
                        : "border border-border-subtle text-text-secondary hover:border-border-default hover:text-text-primary bg-bg-surface"
                    }`}
                  >
                    <Icon size={14} strokeWidth={1.5} />
                    {action.label}
                    <ArrowUpRight
                      size={12}
                      strokeWidth={1.5}
                      className={
                        action.variant === "primary"
                          ? "text-white/60"
                          : "text-text-muted"
                      }
                    />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Row 2: Compact Stat Cards ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25, ease: ease.gentle }}
              className="group relative min-w-0 overflow-hidden rounded-xl border border-border-subtle bg-bg-surface p-5 transition-colors duration-200 hover:border-orange-500/30 hover:shadow-glow-orange"
            >
              {/* Corner accent blob */}
              <div
                className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: "radial-gradient(circle, rgba(255, 165, 0, 0.2), transparent 70%)" }}
              />
              {/* Gradient glow overlay on hover */}
              <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: "linear-gradient(135deg, rgba(101,113,245,0.04), transparent 60%)" }}
              />

              <div className="relative flex items-start justify-between">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.iconBg}`}>
                  <Icon size={18} className={stat.iconColor} strokeWidth={1.5} />
                </div>
                {stat.change && (
                  <div className="flex items-center gap-1 rounded-full bg-success-muted px-2 py-0.5">
                    <ChevronUp size={12} className="text-success" />
                    <span className="text-caption text-success">{stat.change}</span>
                  </div>
                )}
              </div>
              <div className="relative mt-3.5">
                <p className="text-heading-1 text-text-primary tabular-nums">
                  {stat.value}
                </p>
                <p className="text-body-sm text-text-secondary mt-0.5">
                  {stat.label}
                </p>
                {stat.changeLabel && (
                  <p className="text-caption text-text-muted mt-0.5">{stat.changeLabel}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Row 3: Recent Activity (left ~60%) + Content Generation Chart (right ~40%) ── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[3fr_2fr]">
        {/* Recent Activity Table */}
        <div className="relative rounded-xl border border-border-subtle bg-bg-surface overflow-hidden transition-colors duration-200 hover:border-orange-500/15">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10">
                <BookOpen size={16} className="text-orange-400" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-heading-3 text-text-primary">
                  Recent Activity
                </h2>
                <p className="text-caption text-text-muted">Latest teacher actions</p>
                <div
                  className="h-px mt-1 w-12"
                  style={{ background: "linear-gradient(to right, orange, transparent)" }}
                />
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/admin"
                className="text-body-sm text-orange-400 hover:text-orange-300 inline-flex items-center gap-1 transition-colors"
              >
                View all
                <ArrowRight size={14} strokeWidth={1.5} />
              </Link>
            </motion.div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-[1fr_150px_120px_130px] gap-3 px-6 py-3 border-b border-border-subtle bg-bg-elevated/50">
            <span className="text-overline text-text-muted">TEACHER</span>
            <span className="text-overline text-text-muted">ACTION</span>
            <span className="text-overline text-text-muted">SUBJECT</span>
            <span className="text-overline text-text-muted text-right">DATE</span>
          </div>

          {/* Table Body */}
          <div>
            {RECENT_ACTIVITY.map((row, index) => (
              <div
                key={row.id}
                className={`grid grid-cols-[1fr_150px_120px_130px] items-center gap-3 px-6 py-3.5 border-b border-border-subtle last:border-b-0 transition-colors hover:bg-bg-elevated ${
                  index % 2 === 1 ? "bg-bg-elevated/30" : ""
                }`}
              >
                {/* Teacher */}
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500/15 text-caption font-medium text-orange-300">
                    {row.avatar}
                  </div>
                  <span className="text-body-md text-text-primary truncate">
                    {row.teacher}
                  </span>
                </div>

                {/* Action */}
                <span className="text-body-sm text-text-secondary truncate">
                  {row.action}
                </span>

                {/* Subject */}
                <span className="inline-flex items-center">
                  <span className="rounded-md bg-bg-elevated px-2.5 py-1 text-caption text-text-secondary">
                    {row.subject}
                  </span>
                </span>

                {/* Date */}
                <span className="text-body-sm text-text-muted text-right truncate">
                  {row.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Content Generation Area Chart */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.25, ease: ease.gentle }}
          className="group relative overflow-hidden rounded-xl border border-border-subtle bg-bg-surface p-6 transition-colors duration-200 hover:border-orange-500/20 hover:shadow-glow-orange"
        >
          {/* Corner accent */}
          <div className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: "radial-gradient(circle, rgba(255, 165, 0, 0.12), transparent 70%)" }}
          />
          <div className="relative flex items-center justify-between mb-6">
            <div>
              <h2 className="text-heading-3 text-text-primary">Content Generation</h2>
              <p className="text-caption text-text-muted mt-0.5">
                Materials generated per month
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-success">
              <TrendingUp size={16} strokeWidth={1.5} />
              <span className="text-caption font-medium">+250%</span>
            </div>
          </div>
          <AreaChart />
        </motion.div>
      </div>
    </div>
  );
}
