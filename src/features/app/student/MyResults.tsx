// MyResults.tsx — Schoolme design system
// All logic, animation variants, filter state, animated counters from original preserved.
// className tokens → Schoolme CSS vars + Caveat/Lora/Courier Prime fonts.

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

const CAV: React.CSSProperties = { fontFamily: "Caveat, cursive" };
const LOR: React.CSSProperties = { fontFamily: "Lora, Georgia, serif" };
const COU: React.CSSProperties = { fontFamily: "Courier Prime, monospace" };
const CLIP_CARD =
  "polygon(0.3% 1%,1.5% 0%,99% 0.5%,100% 2%,99.7% 99%,98% 100%,0.5% 99.5%,0% 98%)";

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

/* ── Mock results (unchanged) ── */
const RESULTS = [
  {
    id: "r1",
    quiz: "Real Numbers",
    subject: "mathematics",
    score: 8,
    total: 10,
    date: "2 Mar 2026",
  },
  {
    id: "r2",
    quiz: "Light \u2014 Reflection and Refraction",
    subject: "physics",
    score: 9,
    total: 10,
    date: "1 Mar 2026",
  },
  {
    id: "r3",
    quiz: "Chemical Reactions and Equations",
    subject: "chemistry",
    score: 7,
    total: 10,
    date: "28 Feb 2026",
  },
  {
    id: "r4",
    quiz: "Polynomials",
    subject: "mathematics",
    score: 9,
    total: 10,
    date: "27 Feb 2026",
  },
  {
    id: "r5",
    quiz: "Life Processes",
    subject: "biology",
    score: 8,
    total: 10,
    date: "26 Feb 2026",
  },
  {
    id: "r6",
    quiz: "Quadratic Equations",
    subject: "mathematics",
    score: 7,
    total: 10,
    date: "25 Feb 2026",
  },
  {
    id: "r7",
    quiz: "Electricity",
    subject: "physics",
    score: 6,
    total: 10,
    date: "24 Feb 2026",
  },
  {
    id: "r8",
    quiz: "Acids, Bases and Salts",
    subject: "chemistry",
    score: 8,
    total: 10,
    date: "23 Feb 2026",
  },
  {
    id: "r9",
    quiz: "A Letter to God",
    subject: "english",
    score: 9,
    total: 10,
    date: "22 Feb 2026",
  },
  {
    id: "r10",
    quiz: "Magnetic Effects of Electric Current",
    subject: "physics",
    score: 6,
    total: 10,
    date: "21 Feb 2026",
  },
  {
    id: "r11",
    quiz: "Control and Coordination",
    subject: "biology",
    score: 5,
    total: 10,
    date: "20 Feb 2026",
  },
  {
    id: "r12",
    quiz: "Pair of Linear Equations",
    subject: "mathematics",
    score: 8,
    total: 10,
    date: "19 Feb 2026",
  },
];

/* ── Helpers (unchanged) ── */
function getSubjectAverages() {
  const map: Record<
    string,
    { total: number; count: number; color: string; label: string }
  > = {};
  for (const r of RESULTS) {
    const sub = SUBJECTS.find((s) => s.key === r.subject);
    if (!sub) continue;
    if (!map[r.subject])
      map[r.subject] = {
        total: 0,
        count: 0,
        color: sub.color,
        label: sub.label,
      };
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
function getSubjectColor(key: string) {
  return SUBJECTS.find((s) => s.key === key)?.color ?? "#f2740d";
}
function getSubjectLabel(key: string) {
  return SUBJECTS.find((s) => s.key === key)?.label ?? key;
}
function scoreColor(pct: number) {
  return pct >= 70 ? "#34d399" : pct >= 50 ? "#fb923c" : "#f87171";
}

/* ── Animation variants (unchanged) ── */
const container = staggerContainer(staggerDelay.tight + 0.01);
const item = fadeUp(10, 0.45);
const cardItem = cardReveal(12, duration.normal);

/* ── Animated counter (logic unchanged) ── */
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

/* ── Animated bar ── */
function AnimatedBar({ value, color }: { value: number; color: string }) {
  return (
    <div
      style={{
        height: 3,
        width: "100%",
        borderRadius: "999px",
        background: "var(--bg-elevated)",
        marginTop: "0.5rem",
        overflow: "hidden",
      }}
    >
      <motion.div
        style={{ height: "100%", background: color, borderRadius: "999px" }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ type: "spring", stiffness: 60, damping: 15, delay: 0.4 }}
      />
    </div>
  );
}

/* ── Eyebrow ── */
function Eyebrow({ label }: { label: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        marginBottom: "0.85rem",
      }}
    >
      <div
        style={{
          height: 1,
          width: "2rem",
          background: "var(--orange)",
          opacity: 0.5,
        }}
      />
      <span
        style={{
          ...COU,
          fontSize: "0.6rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--orange)",
          opacity: 0.85,
        }}
      >
        {label}
      </span>
    </div>
  );
}

export function MyResults() {
  const [activeSubject, setActiveSubject] = useState("all");

  const filtered =
    activeSubject === "all"
      ? RESULTS
      : RESULTS.filter((r) => r.subject === activeSubject);
  const subjectAverages = getSubjectAverages();
  const overallAvg = RESULTS.length
    ? Math.round(
        (RESULTS.reduce((a, r) => a + r.score, 0) / RESULTS.length) * 10,
      )
    : 0;
  const animatedOverall = useAnimatedCounter(overallAvg);

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
          className="absolute -top-32 -right-20 h-[500px] w-[500px] rounded-full"
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
          className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(circle,#fb923c 0%,#f59e0b 40%,transparent 70%)",
            filter: "blur(100px)",
            opacity: 0.04,
          }}
          animate={{ x: [0, -20, 15, 0], y: [0, 25, -15, 0] }}
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
          My Results
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
          Track your quiz performance across subjects
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

      {/* Average score cards */}
      <motion.div
        {...fadeUpProps(8, 0.1, 0.4)}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))",
          gap: "0.75rem",
        }}
      >
        {/* Overall */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.25, ease: ease.gentle }}
          style={{
            gridColumn: "span 2",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            padding: "1rem",
            background: "rgba(242,116,13,0.06)",
            border: "1px solid rgba(242,116,13,0.22)",
            clipPath: CLIP_CARD,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <BarChart3 size={15} strokeWidth={1.5} color="var(--orange)" />
            </motion.div>
            <span
              style={{
                ...COU,
                fontSize: "0.58rem",
                letterSpacing: "0.1em",
                color: "var(--orange)",
              }}
            >
              Overall
            </span>
          </div>
          <p
            style={{
              ...CAV,
              fontSize: "2rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              lineHeight: 1,
            }}
          >
            {animatedOverall}%
          </p>
          <p
            style={{
              ...LOR,
              fontStyle: "italic",
              fontSize: "0.78rem",
              color: "var(--text-secondary)",
            }}
          >
            {RESULTS.length} quizzes
          </p>
          <AnimatedBar value={overallAvg} color="var(--orange)" />
        </motion.div>

        {/* Per subject */}
        {subjectAverages.map((sa, i) => (
          <motion.div
            key={sa.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.2 + i * 0.08,
              duration: 0.4,
              ease: ease.gentle,
            }}
            whileHover={{ y: -4 }}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.4rem",
              padding: "0.85rem",
              background: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              clipPath: CLIP_CARD,
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}
            >
              <motion.div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: sa.color,
                  flexShrink: 0,
                }}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{
                  duration: 2,
                  delay: i * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <span
                style={{
                  ...COU,
                  fontSize: "0.55rem",
                  letterSpacing: "0.08em",
                  color: "var(--text-muted)",
                }}
              >
                {sa.label}
              </span>
            </div>
            <p
              style={{
                ...CAV,
                fontSize: "1.55rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                lineHeight: 1,
              }}
            >
              {sa.average}%
            </p>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
            >
              {sa.average >= 75 ? (
                <TrendingUp size={12} strokeWidth={1.5} color="#34d399" />
              ) : (
                <TrendingDown size={12} strokeWidth={1.5} color="#f87171" />
              )}
              <span
                style={{
                  ...COU,
                  fontSize: "0.56rem",
                  letterSpacing: "0.06em",
                  color: "var(--text-secondary)",
                }}
              >
                {sa.quizCount} quiz{sa.quizCount > 1 ? "zes" : ""}
              </span>
            </div>
            <AnimatedBar value={sa.average} color={sa.color} />
          </motion.div>
        ))}
      </motion.div>

      {/* Subject filter */}
      <motion.div
        {...fadeUpProps(0, 0.2)}
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
                gap: "0.3rem",
                ...COU,
                fontSize: "0.65rem",
                letterSpacing: "0.08em",
                padding: "0.38rem 0.8rem",
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
              <Icon size={13} strokeWidth={1.5} /> {sub.label}
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
            style={{
              display: "grid",
              gridTemplateColumns: "5fr 2fr 2fr 2fr 1fr",
              gap: "1rem",
              padding: "0.4rem 1rem 0.6rem",
              marginBottom: "0.25rem",
            }}
          >
            {["Quiz", "Subject", "Score", "Date", ""].map((h, i) => (
              <span
                key={i}
                style={{
                  ...COU,
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

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {filtered.length === 0 && (
              <motion.div
                variants={item}
                style={{ textAlign: "center", padding: "4rem 0" }}
              >
                <p
                  style={{
                    ...CAV,
                    fontSize: "2rem",
                    color: "var(--text-muted)",
                  }}
                >
                  No results yet
                </p>
              </motion.div>
            )}
            {filtered.map((r) => {
              const pct = (r.score / r.total) * 100;
              const sc = scoreColor(pct);
              const subc = getSubjectColor(r.subject);
              return (
                <motion.div
                  key={r.id}
                  variants={cardItem}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    to="/student/quizzes"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "5fr 2fr 2fr 2fr 1fr",
                      alignItems: "center",
                      gap: "1rem",
                      padding: "0.85rem 1rem",
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border-subtle)",
                      textDecoration: "none",
                      clipPath: CLIP_CARD,
                    }}
                  >
                    {/* Quiz name */}
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
                      {r.quiz}
                    </p>

                    {/* Subject */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: subc,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          ...COU,
                          fontSize: "0.62rem",
                          letterSpacing: "0.06em",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {getSubjectLabel(r.subject)}
                      </span>
                    </div>

                    {/* Score */}
                    <div style={{ textAlign: "right" }}>
                      <span
                        style={{
                          ...CAV,
                          fontSize: "1.1rem",
                          fontWeight: 700,
                          color: sc,
                        }}
                      >
                        {r.score}/{r.total}
                      </span>
                      <p
                        style={{
                          ...COU,
                          fontSize: "0.56rem",
                          letterSpacing: "0.08em",
                          color: "var(--text-muted)",
                        }}
                      >
                        {pct}%
                      </p>
                    </div>

                    {/* Date */}
                    <span
                      style={{
                        ...COU,
                        fontSize: "0.62rem",
                        letterSpacing: "0.06em",
                        color: "var(--text-muted)",
                        textAlign: "right",
                      }}
                    >
                      {r.date}
                    </span>

                    {/* Chevron */}
                    <div
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <ChevronRight
                        size={16}
                        strokeWidth={1.5}
                        color="var(--text-muted)"
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
