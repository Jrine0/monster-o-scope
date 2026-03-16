// StudentDashboard.tsx — Schoolme design system
// All logic, animations, motion variants from original preserved exactly.
// className tokens (text-display-md, bg-card, color-portal-student-surface, etc.)
// replaced with Schoolme CSS vars + Caveat/Lora/Courier Prime fonts.

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
import { ease, breatheLoop, pulseLoop } from "@/lib/animation";

/* ── Fonts shorthand ── */
const CAV: React.CSSProperties = { fontFamily: "Caveat, cursive" };
const LOR: React.CSSProperties = { fontFamily: "Lora, Georgia, serif" };
const COU: React.CSSProperties = { fontFamily: "Courier Prime, monospace" };
const CLIP_CARD =
  "polygon(0.3% 1%,1.5% 0%,99% 0.5%,100% 2%,99.7% 99%,98% 100%,0.5% 99.5%,0% 98%)";
const CLIP_BTN =
  "polygon(0.5% 8%,1.5% 0%,99% 1%,100% 7%,99.5% 93%,98% 100%,1% 99%,0% 92%)";

/* ── Animated background (warm orange — identical logic, Schoolme colours) ── */
function StudentAnimatedBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      aria-hidden
    >
      <motion.div
        className="absolute -top-28 right-[10%] h-[450px] w-[450px] rounded-full"
        style={{
          background: "radial-gradient(circle,#f2740d 0%,transparent 70%)",
          filter: "blur(100px)",
          opacity: 0.05,
        }}
        animate={{
          x: [0, 20, -15, 0],
          y: [0, -18, 12, 0],
          scale: [1, 1.04, 0.97, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-[8%] left-[5%] h-[350px] w-[350px] rounded-full"
        style={{
          background: "radial-gradient(circle,#fb923c 0%,transparent 70%)",
          filter: "blur(100px)",
          opacity: 0.04,
        }}
        animate={{
          x: [0, -15, 18, 0],
          y: [0, 15, -12, 0],
          scale: [1, 0.96, 1.03, 1],
        }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-[40%] left-1/2 h-[350px] w-[350px] -translate-x-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle,#f2740d 0%,transparent 70%)",
          filter: "blur(120px)",
        }}
        animate={{ scale: [1, 1.18, 1], opacity: [0.02, 0.06, 0.02] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle,rgba(242,116,13,0.032) 1px,transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: i % 3 === 0 ? 3 : 2,
            height: i % 3 === 0 ? 3 : 2,
            left: `${12 + ((i * 7.9) % 76)}%`,
            top: `${22 + ((i * 9.1) % 56)}%`,
            background:
              i % 3 === 0
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

/* ── Accent divider ── */
function AccentLine() {
  return (
    <div
      style={{
        height: 1,
        marginTop: "0.5rem",
        width: "4rem",
        background: "linear-gradient(to right,var(--orange),transparent)",
      }}
    />
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
        marginBottom: "0.5rem",
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
      <div style={{ height: 1, flex: 1, background: "var(--border-subtle)" }} />
    </div>
  );
}

/* ── Mock data (unchanged) ── */
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
  {
    label: "Quizzes Completed",
    value: 24,
    suffix: "",
    icon: Trophy,
    color: "#f2740d",
    bg: "rgba(242,116,13,0.10)",
    isStreak: false,
  },
  {
    label: "Average Score",
    value: 76,
    suffix: "%",
    icon: TrendingUp,
    color: "#34d399",
    bg: "rgba(52,211,153,0.10)",
    isStreak: false,
  },
  {
    label: "Day Streak",
    value: 5,
    suffix: "",
    icon: Flame,
    color: "#fb923c",
    bg: "rgba(251,146,60,0.10)",
    isStreak: true,
  },
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
const QUIZ_AVERAGE = Math.round(
  QUIZ_SCORES.reduce((a, b) => a + b, 0) / QUIZ_SCORES.length,
);

function getGreeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}
function getMotivationalLine() {
  return MOTIVATIONAL_LINES[new Date().getDate() % MOTIVATIONAL_LINES.length];
}
function getBarColor(s: number) {
  return s >= 70 ? "#34d399" : s >= 50 ? "#fbbf24" : "#f87171";
}

/* ── Animated counter (logic unchanged) ── */
function AnimatedNumber({
  target,
  suffix = "",
}: {
  target: number;
  suffix?: string;
}) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const controls = animate(count, target, {
      duration: 1.2,
      ease: ease.gentle,
    });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [count, rounded, target]);
  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}

/* ── Gradient orb (logic unchanged) ── */
function GradientOrb() {
  return (
    <div style={{ position: "relative", height: 56, width: 56, flexShrink: 0 }}>
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 40% 40%,#f2740d,#fb923c 50%,#a855f7 100%)",
          filter: "blur(1px)",
        }}
        {...breatheLoop()}
      />
      <div
        style={{
          position: "absolute",
          inset: 2,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-surface)",
        }}
      >
        <Sparkles size={18} strokeWidth={1.5} color="var(--orange)" />
      </div>
    </div>
  );
}

/* ── Quiz Performance Chart (logic + motion unchanged) ── */
function QuizPerformanceChart() {
  const maxBarH = 140;
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: ease.gentle }}
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-default)",
        padding: "1.75rem",
        clipPath: CLIP_CARD,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Hover glow — rendered via CSS hover below, or just omit; keeping structure */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "2rem",
        }}
      >
        <div>
          <h3
            style={{
              ...CAV,
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              lineHeight: 1,
            }}
          >
            Quiz Performance
          </h3>
          <p
            style={{
              ...LOR,
              fontStyle: "italic",
              fontSize: "0.82rem",
              color: "var(--text-secondary)",
              marginTop: 4,
            }}
          >
            Last 6 attempts
          </p>
        </div>
        <span
          style={{
            ...COU,
            fontSize: "0.62rem",
            letterSpacing: "0.1em",
            background: "rgba(242,116,13,0.10)",
            border: "1px solid rgba(242,116,13,0.22)",
            color: "var(--orange)",
            padding: "0.3rem 0.7rem",
            borderRadius: "999px",
          }}
        >
          avg {QUIZ_AVERAGE}%
        </span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: "0.75rem",
          height: `${maxBarH + 40}px`,
        }}
      >
        {QUIZ_SCORES.map((score, i) => {
          const barH = (score / 100) * maxBarH;
          const col = getBarColor(score);
          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <motion.span
                style={{ ...COU, fontSize: "0.58rem", color: col }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                {score}
              </motion.span>
              <div style={{ height: maxBarH, width: 40, position: "relative" }}>
                <motion.div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    borderRadius: "3px 3px 0 0",
                    backgroundColor: col,
                    opacity: 0.88,
                  }}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${barH}px` }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.7,
                    delay: 0.3 + i * 0.08,
                    ease: ease.spring,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: `${barH}px`,
                    backgroundColor: col,
                    opacity: 0.14,
                    borderRadius: "3px 3px 0 0",
                  }}
                />
              </div>
              <span
                style={{
                  ...COU,
                  fontSize: "0.58rem",
                  color: "var(--text-secondary)",
                }}
              >
                {QUIZ_LABELS[i]}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ── Main ── */
export function StudentDashboard() {
  const greeting = getGreeting();
  const motivation = getMotivationalLine();

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "2.5rem",
        paddingBottom: "5rem",
      }}
    >
      <StudentAnimatedBackground />

      {/* Greeting */}
      <section>
        <h1
          style={{
            ...CAV,
            fontSize: "clamp(2rem,4vw,3rem)",
            fontWeight: 400,
            color: "var(--text-primary)",
            lineHeight: 1.1,
          }}
        >
          {greeting}, Rahul
        </h1>
        <p
          style={{
            ...LOR,
            fontStyle: "italic",
            fontSize: "1rem",
            color: "var(--text-secondary)",
            marginTop: "0.35rem",
          }}
        >
          Class 10-A &middot; Ready to learn something new?
        </p>
        <p
          style={{
            ...LOR,
            fontStyle: "italic",
            fontSize: "0.82rem",
            color: "var(--text-muted)",
            marginTop: "0.5rem",
          }}
        >
          {motivation}
        </p>
        <AccentLine />
      </section>

      {/* Continue learning */}
      <section>
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.25, ease: ease.gentle }}
        >
          <Link
            to="/student/materials"
            style={{
              display: "block",
              position: "relative",
              overflow: "hidden",
              textDecoration: "none",
              background: "var(--bg-surface)",
              border: "1px solid var(--border-default)",
              clipPath: CLIP_CARD,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.5rem",
                padding: "2rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 64,
                  height: 64,
                  flexShrink: 0,
                  background: CONTINUE_MATERIAL.bg,
                  borderRadius: 10,
                }}
              >
                <CONTINUE_MATERIAL.icon
                  size={30}
                  strokeWidth={1.5}
                  style={{ color: CONTINUE_MATERIAL.color }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    ...COU,
                    fontSize: "0.6rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    marginBottom: "0.35rem",
                  }}
                >
                  Continue where you left off
                </p>
                <h2
                  style={{
                    ...CAV,
                    fontSize: "1.6rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {CONTINUE_MATERIAL.title}
                </h2>
                <p
                  style={{
                    ...LOR,
                    fontStyle: "italic",
                    fontSize: "0.88rem",
                    color: "var(--text-secondary)",
                    marginTop: "0.2rem",
                  }}
                >
                  {CONTINUE_MATERIAL.subject} · {CONTINUE_MATERIAL.progress}%
                  complete
                </p>
                <div
                  style={{
                    marginTop: "1rem",
                    height: 6,
                    maxWidth: 400,
                    background: "var(--bg-elevated)",
                    borderRadius: "999px",
                    overflow: "hidden",
                  }}
                >
                  <motion.div
                    style={{
                      height: "100%",
                      background: "var(--orange)",
                      borderRadius: "999px",
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${CONTINUE_MATERIAL.progress}%` }}
                    transition={{ duration: 1, delay: 0.4, ease: ease.gentle }}
                  />
                </div>
              </div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  flexShrink: 0,
                  ...CAV,
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  background: "var(--orange)",
                  color: "#07080d",
                  padding: "0.65rem 1.4rem",
                  clipPath: CLIP_BTN,
                }}
              >
                <Play size={15} strokeWidth={2} /> Continue Learning
              </motion.div>
            </div>
          </Link>
        </motion.div>
      </section>

      {/* Two-column grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,340px),1fr))",
          gap: "2.5rem",
        }}
      >
        {/* LEFT */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}
        >
          {/* Stats */}
          <section>
            <Eyebrow label="Your progress" />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: "1rem",
              }}
            >
              {STATS.map((stat) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.25, ease: ease.gentle }}
                    style={{
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border-default)",
                      clipPath: CLIP_CARD,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.75rem",
                        padding: "1.25rem 1rem",
                      }}
                    >
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          background: stat.bg,
                          borderRadius: 8,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {stat.isStreak ? (
                          <motion.div {...pulseLoop()}>
                            <Icon
                              size={24}
                              strokeWidth={1.5}
                              style={{ color: stat.color }}
                            />
                          </motion.div>
                        ) : (
                          <Icon
                            size={24}
                            strokeWidth={1.5}
                            style={{ color: stat.color }}
                          />
                        )}
                      </div>
                      <p
                        style={{
                          ...CAV,
                          fontSize: "2.2rem",
                          fontWeight: 700,
                          color: "var(--text-primary)",
                          lineHeight: 1,
                        }}
                      >
                        <AnimatedNumber
                          target={stat.value}
                          suffix={stat.suffix}
                        />
                      </p>
                      <p
                        style={{
                          ...LOR,
                          fontStyle: "italic",
                          fontSize: "0.78rem",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {stat.label}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Study Materials */}
          <section>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "0.35rem",
              }}
            >
              <h2
                style={{
                  ...CAV,
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                }}
              >
                Study Materials
              </h2>
              <Link
                to="/student/materials"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  ...COU,
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  color: "var(--orange)",
                  textDecoration: "none",
                }}
              >
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <Eyebrow label="by subject" />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.85rem",
              }}
            >
              {SUBJECTS.map((sub, i) => {
                const Icon = sub.icon;
                const pct = Math.round((sub.completed / sub.chapters) * 100);
                return (
                  <motion.div
                    key={sub.name}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.25, ease: ease.gentle }}
                  >
                    <Link
                      to="/student/materials"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        padding: "1.1rem",
                        background: "var(--bg-surface)",
                        border: `1px solid ${sub.border}`,
                        textDecoration: "none",
                        clipPath: CLIP_BTN,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 44,
                          height: 44,
                          flexShrink: 0,
                          background: sub.bg,
                          borderRadius: 8,
                        }}
                      >
                        <Icon
                          size={22}
                          strokeWidth={1.5}
                          style={{ color: sub.color }}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3
                          style={{
                            ...CAV,
                            fontSize: "1.1rem",
                            fontWeight: 700,
                            color: "var(--text-primary)",
                          }}
                        >
                          {sub.name}
                        </h3>
                        <p
                          style={{
                            ...COU,
                            fontSize: "0.58rem",
                            letterSpacing: "0.08em",
                            color: "var(--text-muted)",
                            marginTop: 2,
                          }}
                        >
                          {sub.completed}/{sub.chapters} chapters
                        </p>
                        <div
                          style={{
                            marginTop: "0.4rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.4rem",
                          }}
                        >
                          <div
                            style={{
                              flex: 1,
                              height: 3,
                              background: "var(--bg-elevated)",
                              borderRadius: "999px",
                              overflow: "hidden",
                            }}
                          >
                            <motion.div
                              style={{
                                height: "100%",
                                background: sub.color,
                                borderRadius: "999px",
                              }}
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{
                                duration: 0.8,
                                delay: 0.5 + i * 0.1,
                                ease: ease.gentle,
                              }}
                            />
                          </div>
                          <span
                            style={{
                              ...COU,
                              fontSize: "0.55rem",
                              color: "var(--text-muted)",
                              width: 28,
                              textAlign: "right",
                            }}
                          >
                            {pct}%
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </section>
        </div>

        {/* RIGHT */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}
        >
          <QuizPerformanceChart />

          <section>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "0.35rem",
              }}
            >
              <h2
                style={{
                  ...CAV,
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                }}
              >
                Recent Quizzes
              </h2>
              <Link
                to="/student/results"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  ...COU,
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  color: "var(--orange)",
                  textDecoration: "none",
                }}
              >
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <Eyebrow label="latest attempts" />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.6rem",
              }}
            >
              {RECENT_QUIZZES.map((quiz) => {
                const sc =
                  quiz.score >= 70
                    ? "#34d399"
                    : quiz.score >= 50
                      ? "#fbbf24"
                      : "#f87171";
                return (
                  <motion.div
                    key={quiz.id}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2, ease: ease.gentle }}
                  >
                    <Link
                      to="/student/quizzes"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        padding: "0.9rem 1rem",
                        background: "var(--bg-surface)",
                        border: "1px solid var(--border-subtle)",
                        textDecoration: "none",
                        clipPath: CLIP_CARD,
                      }}
                    >
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: `${sc}18`,
                          borderRadius: "50%",
                        }}
                      >
                        <span
                          style={{
                            ...CAV,
                            fontSize: "1.1rem",
                            fontWeight: 700,
                            color: sc,
                          }}
                        >
                          {quiz.score}
                        </span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            ...CAV,
                            fontSize: "1rem",
                            fontWeight: 700,
                            color: "var(--text-primary)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {quiz.name}
                        </p>
                        <p
                          style={{
                            ...COU,
                            fontSize: "0.58rem",
                            letterSpacing: "0.08em",
                            color: "var(--text-muted)",
                            marginTop: 2,
                          }}
                        >
                          {quiz.subject} · {quiz.date}
                        </p>
                      </div>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          ...COU,
                          fontSize: "0.6rem",
                          letterSpacing: "0.08em",
                          background: quiz.passed
                            ? "rgba(52,211,153,0.10)"
                            : "rgba(248,113,113,0.10)",
                          color: quiz.passed ? "#34d399" : "#f87171",
                          border: `1px solid ${quiz.passed ? "rgba(52,211,153,0.22)" : "rgba(248,113,113,0.22)"}`,
                          padding: "0.2rem 0.55rem",
                          borderRadius: "999px",
                          flexShrink: 0,
                        }}
                      >
                        {quiz.passed ? (
                          <CheckCircle2 size={11} />
                        ) : (
                          <XCircle size={11} />
                        )}
                        {quiz.passed ? "Pass" : "Fail"}
                      </span>
                      <ChevronRight
                        size={15}
                        strokeWidth={1.5}
                        color="var(--text-muted)"
                      />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      {/* AI Tutor CTA */}
      <section>
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.25, ease: ease.gentle }}
        >
          <Link
            to="/student/tutor"
            style={{
              display: "block",
              position: "relative",
              overflow: "hidden",
              textDecoration: "none",
              background: "var(--bg-surface)",
              border: "1px solid rgba(242,116,13,0.28)",
              clipPath: CLIP_CARD,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.5rem",
                padding: "2rem",
              }}
            >
              <GradientOrb />
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2
                  style={{
                    ...CAV,
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                  }}
                >
                  Need help? Ask Erudio AI
                </h2>
                <p
                  style={{
                    ...LOR,
                    fontStyle: "italic",
                    fontSize: "0.88rem",
                    color: "var(--text-secondary)",
                    marginTop: "0.35rem",
                    maxWidth: 480,
                  }}
                >
                  Get instant explanations, solve doubts, and explore topics in
                  depth with your personal AI tutor.
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  flexShrink: 0,
                  background: "rgba(242,116,13,0.10)",
                  border: "1px solid rgba(242,116,13,0.30)",
                  color: "var(--orange)",
                  ...CAV,
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  padding: "0.65rem 1.4rem",
                  clipPath: CLIP_BTN,
                  transition: "all 0.2s",
                }}
              >
                <Sparkles size={15} strokeWidth={2} /> Start a conversation
              </motion.div>
            </div>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
