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
  Loader2,
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
import {
  listAccessedContent,
  type StudentAccessedContent,
} from "./api/student.api";

const SUBJECTS = [
  { key: "all", label: "All", icon: BookOpen, color: "#f2740d" },
  { key: "mathematics", label: "Mathematics", icon: Calculator, color: "#3b82f6" },
  { key: "physics", label: "Physics", icon: Atom, color: "#a855f7" },
  { key: "chemistry", label: "Chemistry", icon: FlaskConical, color: "#22c55e" },
  { key: "biology", label: "Biology", icon: Leaf, color: "#ec4899" },
  { key: "english", label: "English", icon: BookOpen, color: "#f59e0b" },
  { key: "hindi", label: "Hindi", icon: Languages, color: "#f97316" },
] as const;

function getSubjectColor(key: string) {
  return SUBJECTS.find((s) => s.key === key)?.color ?? "#f2740d";
}

function getSubjectLabel(key: string) {
  return SUBJECTS.find((s) => s.key === key)?.label ?? key;
}

function scoreColor(pct: number) {
  return pct >= 70 ? "#34d399" : pct >= 50 ? "#fb923c" : "#f87171";
}

const container = staggerContainer(staggerDelay.tight + 0.01);
const cardItem = cardReveal(12, duration.normal);

function useAnimatedCounter(target: number, ms = 800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let v = 0;
    const inc = target / (ms / 16);
    const t = setInterval(() => {
      v += inc;
      if (v >= target) {
        setCount(target);
        clearInterval(t);
      } else setCount(Math.floor(v));
    }, 16);
    return () => clearInterval(t);
  }, [target, ms]);
  return count;
}

function AnimatedBar({ value, color }: { value: number; color: string }) {
  return (
    <div
      className="mt-2 h-[3px] w-full overflow-hidden rounded-full"
      style={{ background: "var(--bg-elevated)" }}
    >
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ type: "spring", stiffness: 60, damping: 15, delay: 0.4 }}
      />
    </div>
  );
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function MyResults() {
  const [activeSubject, setActiveSubject] = useState("all");
  const [results, setResults] = useState<StudentAccessedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listAccessedContent({ source_type: "quiz", per_page: 50 })
      .then((res) => setResults(res.data))
      .catch(() => setError("Failed to load results."))
      .finally(() => setLoading(false));
  }, []);

  // Compute quiz items from accessed content
  const quizItems = results.filter((r) => r.library_item || r.material);

  // Normalize to display format
  const displayItems = quizItems.map((r) => {
    const item = r.library_item ?? r.material!;
    // Try to derive score from progress
    const progress = r.progress as { score?: number; total?: number } | null;
    const score = progress?.score ?? 0;
    const total = progress?.total ?? 10;
    // Extract subject from subtopic_title or title
    const title = item.title;
    const subtopicTitle = "subtopic_title" in item ? item.subtopic_title : null;
    const subject = subtopicTitle?.split(" ")[0]?.toLowerCase() ?? "mathematics";
    const matchedSubject = SUBJECTS.find(
      (s) => s.key !== "all" && title.toLowerCase().includes(s.key.toLowerCase()),
    )?.key ?? subject;
    return {
      id: r.access_id,
      quiz: title,
      subject: matchedSubject,
      score,
      total,
      date: formatDate(r.last_accessed_at),
    };
  });

  const filtered =
    activeSubject === "all"
      ? displayItems
      : displayItems.filter((r) => r.subject === activeSubject);

  // Compute averages
  function getSubjectAverages() {
    const map: Record<string, { total: number; count: number; color: string; label: string }> = {};
    for (const r of displayItems) {
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
      average: val.count ? Math.round((val.total / val.count) * 10) : 0,
      quizCount: val.count,
    }));
  }

  const subjectAverages = getSubjectAverages();
  const overallAvg =
    displayItems.length
      ? Math.round((displayItems.reduce((a, r) => a + (r.score / r.total) * 100, 0) / displayItems.length) * 10)
      : 0;
  const animatedOverall = useAnimatedCounter(overallAvg);

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: 320 }}>
        <Loader2 size={28} className="animate-spin" style={{ color: "var(--orange)" }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 pt-12" style={{ color: "var(--text-muted)" }}>
        <p className="font-[Caveat,cursive] text-2xl">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-full px-5 py-2 text-sm transition-colors"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-default)",
            color: "var(--text-secondary)",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-12" style={{ position: "relative" }}>
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-32 -right-20 h-[500px] w-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle,#f2740d 0%,#fb923c 40%,transparent 70%)",
            filter: "blur(100px)",
            opacity: 0.05,
          }}
          animate={{ x: [0, 25, -15, 0], y: [0, -15, 10, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full"
          style={{
            background: "radial-gradient(circle,#fb923c 0%,#f59e0b 40%,transparent 70%)",
            filter: "blur(100px)",
            opacity: 0.04,
          }}
          animate={{ x: [0, -20, 15, 0], y: [0, 25, -15, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle,#f2740d 1px,transparent 1px)",
            backgroundSize: "32px 32px",
            opacity: 0.03,
          }}
        />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.6, ease: ease.gentle }}
      >
        <h1
          className="font-[Caveat,cursive] font-normal"
          style={{ fontSize: "clamp(2rem,5vw,3rem)", color: "var(--text-primary)", lineHeight: 1 }}
        >
          My Results
        </h1>
        <p
          className="font-[Lora,Georgia,serif] italic"
          style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginTop: "0.4rem" }}
        >
          Track your quiz performance across subjects
        </p>
        <motion.div
          style={{
            height: 1,
            marginTop: "1rem",
            background: "linear-gradient(90deg,transparent,#f2740d,#fb923c,transparent)",
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: ease.gentle }}
        />
      </motion.div>

      {/* Average score cards */}
      <motion.div
        {...fadeUpProps(8, 0.1, 0.4)}
        className="grid gap-3"
        style={{ gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))" }}
      >
        {/* Overall */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.25, ease: ease.gentle }}
          className="col-span-2 flex flex-col gap-2 rounded-xl p-4"
          style={{
            background: "rgba(242,116,13,0.06)",
            border: "1px solid rgba(242,116,13,0.22)",
          }}
        >
          <div className="flex items-center gap-1">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <BarChart3 size={15} strokeWidth={1.5} style={{ color: "var(--orange)" }} />
            </motion.div>
            <span
              className="font-[Courier_Prime,monospace]"
              style={{ fontSize: "0.58rem", letterSpacing: "0.1em", color: "var(--orange)" }}
            >
              Overall
            </span>
          </div>
          <p className="font-[Caveat,cursive] text-4xl font-bold" style={{ color: "var(--text-primary)", lineHeight: 1 }}>
            {animatedOverall}%
          </p>
          <p className="font-[Lora,Georgia,serif] italic" style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
            {displayItems.length} quizzes
          </p>
          <AnimatedBar value={overallAvg} color="var(--orange)" />
        </motion.div>

        {/* Per subject */}
        {subjectAverages.map((sa, i) => (
          <motion.div
            key={sa.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.08, duration: 0.4, ease: ease.gentle }}
            whileHover={{ y: -4 }}
            className="flex flex-col gap-2 rounded-xl p-3"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div className="flex items-center gap-1">
              <motion.div
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ background: sa.color }}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, delay: i * 0.3, repeat: Infinity, ease: "easeInOut" }}
              />
              <span
                className="font-[Courier_Prime,monospace] truncate"
                style={{ fontSize: "0.55rem", letterSpacing: "0.08em", color: "var(--text-muted)" }}
              >
                {sa.label}
              </span>
            </div>
            <p className="font-[Caveat,cursive] text-2xl font-bold" style={{ color: "var(--text-primary)", lineHeight: 1 }}>
              {sa.average}%
            </p>
            <div className="flex items-center gap-1">
              {sa.average >= 75 ? (
                <TrendingUp size={12} strokeWidth={1.5} style={{ color: "#34d399" }} />
              ) : (
                <TrendingDown size={12} strokeWidth={1.5} style={{ color: "#f87171" }} />
              )}
              <span
                className="font-[Courier_Prime,monospace]"
                style={{ fontSize: "0.56rem", letterSpacing: "0.06em", color: "var(--text-secondary)" }}
              >
                {sa.quizCount} quiz{sa.quizCount > 1 ? "zes" : ""}
              </span>
            </div>
            <AnimatedBar value={sa.average} color={sa.color} />
          </motion.div>
        ))}
      </motion.div>

      {/* Subject filter */}
      <motion.div {...fadeUpProps(0, 0.2)} className="flex gap-1 overflow-x-auto pb-1">
        {SUBJECTS.map((sub) => {
          const isActive = sub.key === activeSubject;
          const Icon = sub.icon;
          return (
            <motion.button
              key={sub.key}
              onClick={() => setActiveSubject(sub.key)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="flex shrink-0 cursor-pointer items-center gap-1 rounded-full border transition-all"
              style={{
                fontFamily: "Courier Prime, monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.08em",
                padding: "0.38rem 0.8rem",
                borderColor: isActive ? "transparent" : "var(--border-subtle)",
                background: isActive ? sub.color : "transparent",
                color:
                  isActive
                    ? sub.color === "#f2740d"
                      ? "#07080d"
                      : "white"
                    : "var(--text-secondary)",
              }}
            >
              <Icon size={13} strokeWidth={1.5} />
              {sub.label}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Results list */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubject}
          variants={container}
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
        >
          {/* Table header */}
          <div
            className="mb-1 grid gap-4 px-4 py-1"
            style={{ gridTemplateColumns: "5fr 2fr 2fr 2fr 1fr" }}
          >
            {["Quiz", "Subject", "Score", "Date", ""].map((h, i) => (
              <span
                key={i}
                className="font-[Courier_Prime,monospace]"
                style={{
                  fontSize: "0.58rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  textAlign: i >= 2 && i < 4 ? "right" : "left",
                }}
              >
                {h}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            {filtered.length === 0 && (
              <motion.div variants={fadeUp(10, 0.45)} style={{ textAlign: "center", padding: "4rem 0" }}>
                <p className="font-[Caveat,cursive] text-2xl" style={{ color: "var(--text-muted)" }}>
                  No results yet
                </p>
              </motion.div>
            )}
            {filtered.map((r) => {
              const pct = r.total > 0 ? (r.score / r.total) * 100 : 0;
              const sc = scoreColor(pct);
              const subc = getSubjectColor(r.subject);
              return (
                <motion.div key={r.id} variants={cardItem} whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                  <Link
                    to="/student/quizzes"
                    className="grid items-center gap-4 rounded-xl border p-3 no-underline"
                    style={{
                      gridTemplateColumns: "5fr 2fr 2fr 2fr 1fr",
                      background: "var(--bg-surface)",
                      borderColor: "var(--border-subtle)",
                    }}
                  >
                    {/* Quiz name */}
                    <p
                      className="font-[Caveat,cursive] truncate font-bold"
                      style={{ fontSize: "1.05rem", color: "var(--text-primary)" }}
                    >
                      {r.quiz}
                    </p>

                    {/* Subject */}
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 shrink-0 rounded-full" style={{ background: subc }} />
                      <span
                        className="font-[Courier_Prime,monospace] truncate"
                        style={{ fontSize: "0.62rem", letterSpacing: "0.06em", color: "var(--text-secondary)" }}
                      >
                        {getSubjectLabel(r.subject)}
                      </span>
                    </div>

                    {/* Score */}
                    <div style={{ textAlign: "right" }}>
                      <span className="font-[Caveat,cursive] text-lg font-bold" style={{ color: sc }}>
                        {r.score}/{r.total}
                      </span>
                      <p
                        className="font-[Courier_Prime,monospace]"
                        style={{ fontSize: "0.56rem", letterSpacing: "0.08em", color: "var(--text-muted)" }}
                      >
                        {pct}%
                      </p>
                    </div>

                    {/* Date */}
                    <span
                      className="font-[Courier_Prime,monospace] text-right"
                      style={{ fontSize: "0.62rem", letterSpacing: "0.06em", color: "var(--text-muted)" }}
                    >
                      {r.date}
                    </span>

                    {/* Chevron */}
                    <div className="flex justify-end">
                      <ChevronRight size={16} strokeWidth={1.5} style={{ color: "var(--text-muted)" }} />
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
