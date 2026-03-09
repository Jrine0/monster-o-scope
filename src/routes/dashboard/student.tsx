import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";

export const Route = createFileRoute("/dashboard/student")({
  component: StudentDashboard,
});

// ─── Tokens ───────────────────────────────────────────────────────────────────
const F = {
  head: "'DM Sans', 'Segoe UI', sans-serif",
  body: "'Inter', 'Segoe UI', sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
};
const C = {
  bg: "#0c0d10",
  surface: "#111318",
  surfaceB: "#181a21",
  border: "rgba(255,255,255,0.07)",
  borderHov: "rgba(255,255,255,0.13)",
  text: "#f0ede8",
  textSub: "#8b8d9b",
  textMuted: "#4e505f",
  orange: "#f2740d",
  orangeDim: "rgba(242,116,13,0.10)",
  orangeBdr: "rgba(242,116,13,0.28)",
  green: "#22c55e",
  greenDim: "rgba(34,197,94,0.10)",
  greenBdr: "rgba(34,197,94,0.28)",
  yellow: "#eab308",
  red: "#ef4444",
  redDim: "rgba(239,68,68,0.10)",
  blue: "#3b82f6",
  purple: "#a855f7",
  teal: "#14b8a6",
  pink: "#ec4899",
  amber: "#f59e0b",
};

const SUB_COLOR: Record<string, string> = {
  Mathematics: C.blue,
  Physics: C.purple,
  Chemistry: C.green,
  Biology: C.pink,
  English: C.amber,
  Hindi: C.teal,
};

type Page = "dashboard" | "materials" | "quizzes" | "tutor" | "results";

// ─── Data ────────────────────────────────────────────────────────────────────
const CHAPTERS: Record<
  string,
  {
    id: number;
    title: string;
    hasLesson: boolean;
    hasVideo: boolean;
    hasQuiz: boolean;
    score?: number;
  }[]
> = {
  Mathematics: [
    {
      id: 1,
      title: "Real Numbers",
      hasLesson: true,
      hasVideo: true,
      hasQuiz: true,
      score: 80,
    },
    {
      id: 2,
      title: "Polynomials",
      hasLesson: true,
      hasVideo: false,
      hasQuiz: true,
      score: 90,
    },
    {
      id: 3,
      title: "Pair of Linear Equations",
      hasLesson: true,
      hasVideo: true,
      hasQuiz: true,
      score: 70,
    },
    {
      id: 4,
      title: "Quadratic Equations",
      hasLesson: true,
      hasVideo: true,
      hasQuiz: true,
      score: 70,
    },
    {
      id: 5,
      title: "Arithmetic Progressions",
      hasLesson: true,
      hasVideo: false,
      hasQuiz: true,
    },
    {
      id: 6,
      title: "Triangles",
      hasLesson: true,
      hasVideo: true,
      hasQuiz: true,
    },
    {
      id: 7,
      title: "Coordinate Geometry",
      hasLesson: true,
      hasVideo: false,
      hasQuiz: true,
    },
    {
      id: 8,
      title: "Introduction to Trigonometry",
      hasLesson: true,
      hasVideo: true,
      hasQuiz: true,
    },
    {
      id: 9,
      title: "Some Applications of Trigonometry",
      hasLesson: true,
      hasVideo: false,
      hasQuiz: false,
    },
    {
      id: 10,
      title: "Circles",
      hasLesson: true,
      hasVideo: true,
      hasQuiz: true,
    },
    {
      id: 11,
      title: "Areas Related to Circles",
      hasLesson: true,
      hasVideo: false,
      hasQuiz: false,
    },
    {
      id: 12,
      title: "Surface Areas and Volumes",
      hasLesson: true,
      hasVideo: true,
      hasQuiz: true,
    },
    {
      id: 13,
      title: "Statistics",
      hasLesson: true,
      hasVideo: false,
      hasQuiz: true,
    },
    {
      id: 14,
      title: "Probability",
      hasLesson: true,
      hasVideo: true,
      hasQuiz: true,
    },
  ],
  Physics: [
    {
      id: 1,
      title: "Light — Reflection and Refraction",
      hasLesson: true,
      hasVideo: true,
      hasQuiz: true,
      score: 90,
    },
    {
      id: 2,
      title: "Human Eye and Colourful World",
      hasLesson: true,
      hasVideo: false,
      hasQuiz: true,
    },
    {
      id: 3,
      title: "Electricity",
      hasLesson: true,
      hasVideo: false,
      hasQuiz: false,
    },
    {
      id: 4,
      title: "Magnetic Effects of Electric Current",
      hasLesson: true,
      hasVideo: true,
      hasQuiz: true,
      score: 60,
    },
    {
      id: 5,
      title: "Sources of Energy",
      hasLesson: true,
      hasVideo: false,
      hasQuiz: true,
    },
  ],
  Chemistry: [
    {
      id: 1,
      title: "Chemical Reactions and Equations",
      hasLesson: true,
      hasVideo: true,
      hasQuiz: true,
      score: 70,
    },
    {
      id: 2,
      title: "Acids, Bases and Salts",
      hasLesson: true,
      hasVideo: false,
      hasQuiz: false,
    },
    {
      id: 3,
      title: "Metals and Non-metals",
      hasLesson: true,
      hasVideo: true,
      hasQuiz: true,
    },
    {
      id: 4,
      title: "Carbon and its Compounds",
      hasLesson: true,
      hasVideo: false,
      hasQuiz: true,
    },
    {
      id: 5,
      title: "Periodic Classification of Elements",
      hasLesson: true,
      hasVideo: true,
      hasQuiz: true,
    },
  ],
  Biology: [
    {
      id: 1,
      title: "Life Processes",
      hasLesson: true,
      hasVideo: true,
      hasQuiz: true,
      score: 80,
    },
    {
      id: 2,
      title: "Control and Coordination",
      hasLesson: true,
      hasVideo: false,
      hasQuiz: true,
    },
    {
      id: 3,
      title: "How do Organisms Reproduce?",
      hasLesson: true,
      hasVideo: true,
      hasQuiz: true,
    },
    {
      id: 4,
      title: "Heredity and Evolution",
      hasLesson: true,
      hasVideo: false,
      hasQuiz: true,
    },
    {
      id: 5,
      title: "Our Environment",
      hasLesson: true,
      hasVideo: false,
      hasQuiz: false,
    },
  ],
  English: [
    {
      id: 1,
      title: "A Letter to God",
      hasLesson: true,
      hasVideo: false,
      hasQuiz: true,
    },
    {
      id: 2,
      title: "Nelson Mandela",
      hasLesson: true,
      hasVideo: false,
      hasQuiz: false,
    },
    {
      id: 3,
      title: "Two Stories about Flying",
      hasLesson: true,
      hasVideo: false,
      hasQuiz: true,
    },
  ],
  Hindi: [
    {
      id: 1,
      title: "Surdas ke Pad",
      hasLesson: true,
      hasVideo: false,
      hasQuiz: false,
    },
    {
      id: 2,
      title: "Ram-Lakshman-Parshuram Samvad",
      hasLesson: true,
      hasVideo: false,
      hasQuiz: false,
    },
  ],
};

const QUIZ_LIST = [
  {
    id: "q1",
    title: "Real Numbers",
    subject: "Mathematics",
    done: true,
    score: 8,
    pass: true,
  },
  {
    id: "q2",
    title: "Polynomials",
    subject: "Mathematics",
    done: true,
    score: 9,
    pass: true,
  },
  {
    id: "q3",
    title: "Pair of Linear Equations",
    subject: "Mathematics",
    done: false,
  },
  {
    id: "q4",
    title: "Quadratic Equations",
    subject: "Mathematics",
    done: true,
    score: 7,
    pass: true,
  },
  {
    id: "q5",
    title: "Light — Reflection and Refraction",
    subject: "Physics",
    done: true,
    score: 9,
    pass: true,
  },
  { id: "q6", title: "Electricity", subject: "Physics", done: false },
  {
    id: "q7",
    title: "Magnetic Effects of Electric Current",
    subject: "Physics",
    done: true,
    score: 6,
    pass: false,
  },
  {
    id: "q8",
    title: "Chemical Reactions and Equations",
    subject: "Chemistry",
    done: true,
    score: 7,
    pass: true,
  },
  {
    id: "q9",
    title: "Acids, Bases and Salts",
    subject: "Chemistry",
    done: false,
  },
  {
    id: "q10",
    title: "Life Processes",
    subject: "Biology",
    done: true,
    score: 8,
    pass: true,
  },
];

const RESULT_LIST = [
  {
    id: "r1",
    title: "Real Numbers",
    subject: "Mathematics",
    score: 8,
    date: "2 Mar 2026",
  },
  {
    id: "r2",
    title: "Light — Reflection and Refraction",
    subject: "Physics",
    score: 9,
    date: "1 Mar 2026",
  },
  {
    id: "r3",
    title: "Chemical Reactions and Equations",
    subject: "Chemistry",
    score: 7,
    date: "28 Feb 2026",
  },
  {
    id: "r4",
    title: "Polynomials",
    subject: "Mathematics",
    score: 9,
    date: "27 Feb 2026",
  },
  {
    id: "r5",
    title: "Life Processes",
    subject: "Biology",
    score: 8,
    date: "26 Feb 2026",
  },
  {
    id: "r6",
    title: "Quadratic Equations",
    subject: "Mathematics",
    score: 7,
    date: "25 Feb 2026",
  },
  {
    id: "r7",
    title: "Electricity",
    subject: "Physics",
    score: 6,
    date: "24 Feb 2026",
  },
];

const SUBJECT_STATS = [
  { name: "Mathematics", avg: 80, quizzes: 4, color: C.blue },
  { name: "Physics", avg: 70, quizzes: 3, color: C.purple },
  { name: "Chemistry", avg: 75, quizzes: 2, color: C.green },
  { name: "Biology", avg: 65, quizzes: 2, color: C.pink },
  { name: "English", avg: 90, quizzes: 1, color: C.amber },
];

const TUTOR_CONTEXT = [
  { subject: "Physics", chapter: "Laws of Motion" },
  { subject: "Chemistry", chapter: "Chemical Reactions" },
  { subject: "Mathematics", chapter: "Quadratic Equations" },
  { subject: "Biology", chapter: "Life Processes" },
];

const TUTOR_SUGGESTIONS = [
  { text: "Explain Newton's Third Law with examples", color: C.purple },
  { text: "What is the difference between acids and bases?", color: C.green },
  { text: "How do I solve quadratic equations?", color: C.blue },
  { text: "Explain the process of photosynthesis", color: C.pink },
];

const PERF_SCORES = [72, 85, 68, 90, 45, 88];
const PERF_LABELS = ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function greet() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}
function scoreColor(s: number) {
  return s >= 70 ? C.green : s >= 50 ? C.yellow : C.red;
}
function scoreColorDim(s: number) {
  return s >= 70
    ? "rgba(34,197,94,0.12)"
    : s >= 50
      ? "rgba(234,179,8,0.12)"
      : "rgba(239,68,68,0.12)";
}

// ─── Reusable primitives ──────────────────────────────────────────────────────
function Card({
  style,
  children,
  hover,
  onClick,
}: {
  style?: React.CSSProperties;
  children: React.ReactNode;
  hover?: boolean;
  onClick?: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => hover && setHov(true)}
      onMouseLeave={() => hover && setHov(false)}
      style={{
        background: C.surface,
        border: `1px solid ${hov ? C.borderHov : C.border}`,
        borderRadius: 12,
        transition: "border-color 0.18s, transform 0.18s, box-shadow 0.18s",
        transform: hov ? "translateY(-2px)" : "none",
        boxShadow: hov ? "0 8px 32px rgba(0,0,0,0.35)" : "none",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Pill({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        background: active ? C.orange : C.surfaceB,
        color: active ? "#fff" : C.textSub,
        fontFamily: F.body,
        fontSize: "0.82rem",
        fontWeight: active ? 600 : 400,
        border: `1px solid ${active ? C.orange : C.border}`,
        borderRadius: 20,
        padding: "0.3rem 0.85rem",
        cursor: "pointer",
        transition: "all 0.15s",
      }}
    >
      {children}
    </button>
  );
}

function ProgressBar({
  pct,
  color,
  h = 4,
}: {
  pct: number;
  color: string;
  h?: number;
}) {
  return (
    <div
      style={{
        height: h,
        background: "rgba(255,255,255,0.07)",
        borderRadius: h,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${Math.min(pct, 100)}%`,
          background: color,
          borderRadius: h,
          transition: "width 0.7s ease",
        }}
      />
    </div>
  );
}

function SubjectDot({ subject, size = 8 }: { subject: string; size?: number }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: SUB_COLOR[subject] ?? C.textSub,
        display: "inline-block",
        flexShrink: 0,
      }}
    />
  );
}

function Tag({
  color,
  children,
}: {
  color: string;
  children: React.ReactNode;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontFamily: F.mono,
        fontSize: "0.62rem",
        fontWeight: 500,
        color,
        background: `${color}15`,
        border: `1px solid ${color}30`,
        borderRadius: 4,
        padding: "0.1rem 0.45rem",
      }}
    >
      {children}
    </span>
  );
}

// ─── Animated background ──────────────────────────────────────────────────────
function AnimBg() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 0,
      }}
      aria-hidden
    >
      <div
        style={{
          position: "absolute",
          top: "-8%",
          right: "6%",
          width: 540,
          height: 540,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(242,116,13,0.055) 0%, transparent 68%)",
          filter: "blur(90px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "4%",
          left: "4%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(168,85,247,0.04) 0%, transparent 70%)",
          filter: "blur(90px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(242,116,13,0.025) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
}

// ─── Top Nav ─────────────────────────────────────────────────────────────────
function TopNav({ page, setPage }: { page: Page; setPage: (p: Page) => void }) {
  const NAV: { id: Page; label: string }[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "materials", label: "Study Materials" },
    { id: "quizzes", label: "Practice Quizzes" },
    { id: "tutor", label: "AI Tutor" },
    { id: "results", label: "My Results" },
  ];

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(12,13,16,0.94)",
        borderBottom: `1px solid ${C.border}`,
        backdropFilter: "blur(14px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 2.5rem",
        height: 52,
      }}
    >
      <a
        href="/"
        style={{
          fontFamily: F.head,
          fontSize: "1.05rem",
          fontWeight: 700,
          color: C.text,
          textDecoration: "none",
          fontStyle: "italic",
        }}
      >
        SchoolMe
      </a>
      <div style={{ display: "flex", alignItems: "center" }}>
        {NAV.map((l) => (
          <button
            key={l.id}
            onClick={() => setPage(l.id)}
            style={{
              fontFamily: F.body,
              fontSize: "0.875rem",
              fontWeight: page === l.id ? 600 : 400,
              color: page === l.id ? C.text : C.textSub,
              background: "transparent",
              border: "none",
              borderBottom: `2px solid ${page === l.id ? C.orange : "transparent"}`,
              padding: "0.45rem 0.9rem",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {l.label}
          </button>
        ))}
      </div>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: C.orange,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: F.head,
          fontSize: "0.75rem",
          fontWeight: 700,
          color: "#fff",
          flexShrink: 0,
        }}
      >
        RK
      </div>
    </nav>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
function StudentDashboard() {
  const [page, setPage] = useState<Page>("dashboard");
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text }}>
      <style>{`
        *{box-sizing:border-box}body{margin:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:4px}
        input,textarea,select{outline:none;color-scheme:dark}
        input::placeholder,textarea::placeholder{color:${C.textMuted}}
        button:focus-visible{outline:2px solid ${C.orange};outline-offset:2px}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:.3;transform:scale(1)}50%{opacity:.7;transform:scale(1.06)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes barIn{from{transform:scaleY(0)}to{transform:scaleY(1)}}
        .page{animation:fadeUp 0.22s ease forwards}
      `}</style>
      <AnimBg />
      <div style={{ position: "relative", zIndex: 1 }}>
        <TopNav page={page} setPage={setPage} />
        <div
          className="page"
          key={page}
          style={{ padding: "2rem 2.5rem", maxWidth: 1100, margin: "0 auto" }}
        >
          {page === "dashboard" && <PageDashboard setPage={setPage} />}
          {page === "materials" && <PageMaterials />}
          {page === "quizzes" && <PageQuizzes />}
          {page === "tutor" && <PageTutor />}
          {page === "results" && <PageResults />}
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE: DASHBOARD — Bento grid
// ═════════════════════════════════════════════════════════════════════════════
function PageDashboard({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Greeting */}
      <div>
        <h1
          style={{
            fontFamily: F.head,
            fontSize: "1.85rem",
            fontWeight: 700,
            color: C.text,
            margin: "0 0 0.25rem",
          }}
        >
          {greet()}, Jrine
        </h1>
        <p
          style={{
            fontFamily: F.body,
            fontSize: "0.9rem",
            color: C.textSub,
            margin: 0,
          }}
        >
          Class 10-A &nbsp;·&nbsp; Ready to learn something new?
        </p>
        <p
          style={{
            fontFamily: F.body,
            fontSize: "0.82rem",
            color: C.textMuted,
            margin: "0.25rem 0 0",
            fontStyle: "italic",
          }}
        >
          The best time to learn is now.
        </p>
        <div
          style={{
            height: 1,
            width: "4rem",
            background: `linear-gradient(to right, ${C.orange}, transparent)`,
            marginTop: "0.6rem",
          }}
        />
      </div>

      {/* Continue banner */}
      <Card
        hover
        style={{
          padding: "1.4rem 1.75rem",
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
        }}
        onClick={() => setPage("materials")}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 300,
            height: "100%",
            background:
              "radial-gradient(ellipse at right, rgba(242,116,13,0.06), transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 12,
              background: "rgba(168,85,247,0.12)",
              border: "1px solid rgba(168,85,247,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg viewBox="0 0 24 24" width="24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke={C.purple}
                strokeWidth="1.5"
              />
              <path d="M12 6a4 4 0 100 0" stroke={C.purple} strokeWidth="1.4" />
              <path
                d="M8 12c0 2.21 1.79 4 4 4s4-1.79 4-4"
                stroke={C.purple}
                strokeWidth="1.4"
              />
              <circle cx="9" cy="11" r="1.2" fill={C.purple} />
              <circle cx="15" cy="11" r="1.2" fill={C.purple} />
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontFamily: F.body,
                fontSize: "0.72rem",
                fontWeight: 500,
                color: C.textMuted,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                margin: "0 0 0.25rem",
              }}
            >
              Continue where you left off
            </p>
            <h2
              style={{
                fontFamily: F.head,
                fontSize: "1.1rem",
                fontWeight: 600,
                color: C.text,
                margin: "0 0 0.2rem",
              }}
            >
              Chapter 5: Laws of Motion
            </h2>
            <p
              style={{
                fontFamily: F.body,
                fontSize: "0.82rem",
                color: C.textSub,
                margin: "0 0 0.75rem",
              }}
            >
              Physics &nbsp;·&nbsp; 60% complete
            </p>
            <div style={{ maxWidth: 320 }}>
              <ProgressBar pct={60} color={C.orange} h={6} />
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPage("materials");
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              background: C.orange,
              color: "#fff",
              fontFamily: F.body,
              fontSize: "0.875rem",
              fontWeight: 600,
              border: "none",
              borderRadius: 8,
              padding: "0.6rem 1.25rem",
              cursor: "pointer",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            <svg viewBox="0 0 12 12" width="12" fill="none">
              <path d="M2 2l9 4-9 4V2z" fill="#fff" />
            </svg>
            Continue Learning
          </button>
        </div>
      </Card>

      {/* Bento row 1: 3 stat tiles + Quiz chart */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1.6fr",
          gap: "1rem",
        }}
      >
        {[
          {
            v: "24",
            label: "Quizzes Completed",
            color: C.orange,
            icon: <TrophySvg color={C.orange} />,
          },
          {
            v: "76%",
            label: "Average Score",
            color: C.green,
            icon: <TrendSvg color={C.green} />,
          },
          {
            v: "5",
            label: "Day Streak",
            color: C.amber,
            icon: <FlameSvg color={C.amber} />,
          },
        ].map((st, i) => (
          <Card key={i} style={{ padding: "1.3rem 1.4rem" }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 8,
                background: `${st.color}12`,
                border: `1px solid ${st.color}22`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "0.85rem",
              }}
            >
              {st.icon}
            </div>
            <div
              style={{
                fontFamily: F.head,
                fontSize: "2rem",
                fontWeight: 700,
                color: C.text,
                lineHeight: 1,
                marginBottom: "0.35rem",
              }}
            >
              {st.v}
            </div>
            <div
              style={{
                fontFamily: F.body,
                fontSize: "0.8rem",
                color: C.textSub,
              }}
            >
              {st.label}
            </div>
          </Card>
        ))}

        {/* Quiz performance chart — bento tile */}
        <Card hover style={{ padding: "1.3rem 1.4rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "0.75rem",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: F.body,
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: C.text,
                }}
              >
                Quiz Performance
              </div>
              <div
                style={{
                  fontFamily: F.body,
                  fontSize: "0.72rem",
                  color: C.textMuted,
                  marginTop: 2,
                }}
              >
                Last 6 attempts
              </div>
            </div>
            <Tag color={C.orange}>
              Avg:{" "}
              {Math.round(
                PERF_SCORES.reduce((a, b) => a + b, 0) / PERF_SCORES.length,
              )}
              %
            </Tag>
          </div>
          <MiniBarChart scores={PERF_SCORES} labels={PERF_LABELS} />
        </Card>
      </div>

      {/* Bento row 2: Study materials (left) + Recent quizzes (right) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          gap: "1rem",
        }}
      >
        {/* Study materials */}
        <Card style={{ padding: "1.3rem 1.4rem" }}>
          <SectionHead
            title="Study Materials"
            action="View all"
            onAction={() => setPage("materials")}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.7rem",
              marginTop: "1rem",
            }}
          >
            {[
              { name: "Physics", chapters: 12, done: 7, color: C.purple },
              { name: "Mathematics", chapters: 14, done: 8, color: C.blue },
              { name: "Chemistry", chapters: 16, done: 6, color: C.green },
              { name: "English", chapters: 10, done: 7, color: C.amber },
            ].map((s) => (
              <SubjectTile
                key={s.name}
                {...s}
                onClick={() => setPage("materials")}
              />
            ))}
          </div>
        </Card>

        {/* Recent quizzes */}
        <Card style={{ padding: "1.3rem 1.4rem" }}>
          <SectionHead
            title="Recent Quizzes"
            action="View all"
            onAction={() => setPage("results")}
          />
          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            {[
              {
                score: 90,
                name: "Laws of Motion",
                subject: "Physics",
                date: "Today",
                pass: true,
              },
              {
                score: 72,
                name: "Chemical Bonding",
                subject: "Chemistry",
                date: "Yesterday",
                pass: true,
              },
              {
                score: 85,
                name: "Quadratic Equations",
                subject: "Mathematics",
                date: "2 days ago",
                pass: true,
              },
              {
                score: 45,
                name: "Comprehension Passage",
                subject: "English",
                date: "3 days ago",
                pass: false,
              },
            ].map((q, i) => (
              <QuizRow key={i} {...q} onClick={() => setPage("results")} />
            ))}
          </div>
        </Card>
      </div>

      {/* AI Tutor CTA */}
      <Card
        hover
        style={{
          padding: "1.4rem 1.75rem",
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
        }}
        onClick={() => setPage("tutor")}
      >
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: 200,
            height: 200,
            background:
              "radial-gradient(circle, rgba(242,116,13,0.06), transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 180,
            height: 180,
            background:
              "radial-gradient(circle, rgba(168,85,247,0.05), transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: "1.25rem",
          }}
        >
          <OrbIcon />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2
              style={{
                fontFamily: F.head,
                fontSize: "1.05rem",
                fontWeight: 600,
                color: C.text,
                margin: "0 0 0.35rem",
              }}
            >
              Need help? Ask Erudio AI
            </h2>
            <p
              style={{
                fontFamily: F.body,
                fontSize: "0.85rem",
                color: C.textSub,
                margin: 0,
                maxWidth: 480,
              }}
            >
              Get instant explanations, solve doubts, and explore topics in
              depth with your personal AI tutor.
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPage("tutor");
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.45rem",
              background: C.orangeDim,
              color: C.orange,
              fontFamily: F.body,
              fontSize: "0.875rem",
              fontWeight: 600,
              border: `1px solid ${C.orangeBdr}`,
              borderRadius: 8,
              padding: "0.6rem 1.25rem",
              cursor: "pointer",
              flexShrink: 0,
              whiteSpace: "nowrap",
              transition: "all 0.15s",
            }}
          >
            <SparklesSvg color={C.orange} />
            Start a conversation
          </button>
        </div>
      </Card>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE: STUDY MATERIALS
// ═════════════════════════════════════════════════════════════════════════════
function PageMaterials() {
  const subjects = Object.keys(CHAPTERS);
  const [active, setActive] = useState("Mathematics");
  const [search, setSearch] = useState("");
  const chapters = CHAPTERS[active].filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <h1
          style={{
            fontFamily: F.head,
            fontSize: "1.65rem",
            fontWeight: 700,
            color: C.text,
            margin: "0 0 0.25rem",
          }}
        >
          Study Materials
        </h1>
        <p
          style={{
            fontFamily: F.body,
            fontSize: "0.875rem",
            color: C.textSub,
            margin: 0,
          }}
        >
          Browse NCERT chapters by subject
        </p>
      </div>

      {/* Search */}
      <div style={{ position: "relative" }}>
        <svg
          style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            opacity: 0.4,
          }}
          viewBox="0 0 16 16"
          width="14"
          fill="none"
        >
          <circle cx="7" cy="7" r="5" stroke={C.textSub} strokeWidth="1.3" />
          <path
            d="M11 11l3 3"
            stroke={C.textSub}
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search chapters…"
          style={{
            width: "100%",
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            padding: "0.65rem 1rem 0.65rem 2.4rem",
            color: C.text,
            fontFamily: F.body,
            fontSize: "0.875rem",
          }}
        />
      </div>

      {/* Subject filter */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <Pill
          active={active === "All Subjects"}
          onClick={() => setActive("All Subjects")}
        >
          <svg viewBox="0 0 12 12" width="10" fill="none">
            <rect
              x="1"
              y="1"
              width="4"
              height="4"
              rx="0.8"
              stroke="currentColor"
              strokeWidth="1"
            />
            <rect
              x="7"
              y="1"
              width="4"
              height="4"
              rx="0.8"
              stroke="currentColor"
              strokeWidth="1"
            />
            <rect
              x="1"
              y="7"
              width="4"
              height="4"
              rx="0.8"
              stroke="currentColor"
              strokeWidth="1"
            />
            <rect
              x="7"
              y="7"
              width="4"
              height="4"
              rx="0.8"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
          All Subjects
        </Pill>
        {subjects.map((s) => (
          <Pill key={s} active={active === s} onClick={() => setActive(s)}>
            <SubjectDot subject={s} size={6} /> {s}
          </Pill>
        ))}
      </div>

      {/* Chapters list */}
      <Card style={{ overflow: "hidden" }}>
        {chapters.map((ch, i) => (
          <ChapterRow
            key={ch.id}
            num={ch.id}
            title={ch.title}
            hasLesson={ch.hasLesson}
            hasVideo={ch.hasVideo}
            hasQuiz={ch.hasQuiz}
            score={ch.score}
            last={i === chapters.length - 1}
          />
        ))}
        {chapters.length === 0 && (
          <div
            style={{
              padding: "2.5rem",
              textAlign: "center",
              fontFamily: F.body,
              fontSize: "0.875rem",
              color: C.textMuted,
            }}
          >
            No chapters match your search.
          </div>
        )}
      </Card>
    </div>
  );
}

function ChapterRow({
  num,
  title,
  hasLesson,
  hasVideo,
  hasQuiz,
  score,
  last,
}: {
  num: number;
  title: string;
  hasLesson: boolean;
  hasVideo: boolean;
  hasQuiz: boolean;
  score?: number;
  last: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "1rem 1.4rem",
        borderBottom: last ? "none" : `1px solid ${C.border}`,
        background: hov ? C.surfaceB : "transparent",
        transition: "background 0.15s",
        cursor: "pointer",
      }}
    >
      <span
        style={{
          fontFamily: F.mono,
          fontSize: "0.75rem",
          color: C.textMuted,
          width: 22,
          flexShrink: 0,
          textAlign: "right",
        }}
      >
        {num}
      </span>
      <span
        style={{
          fontFamily: F.body,
          fontSize: "0.9rem",
          fontWeight: 500,
          color: hov ? C.text : C.text,
          flex: 1,
          minWidth: 0,
        }}
      >
        {title}
      </span>
      <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
        {hasLesson && <ChipIcon label="Lesson" color={C.textMuted} />}
        {hasVideo && <ChipIcon label="Video" color={C.textMuted} />}
        {hasQuiz && <ChipIcon label="Quiz" color={C.textMuted} />}
      </div>
      {score !== undefined ? (
        <button
          style={{
            background: C.orange,
            color: "#fff",
            fontFamily: F.body,
            fontSize: "0.8rem",
            fontWeight: 600,
            border: "none",
            borderRadius: 6,
            padding: "0.3rem 0.75rem",
            cursor: "pointer",
          }}
        >
          Practice Quiz
        </button>
      ) : hasQuiz ? (
        <button
          style={{
            background: C.orange,
            color: "#fff",
            fontFamily: F.body,
            fontSize: "0.8rem",
            fontWeight: 600,
            border: "none",
            borderRadius: 6,
            padding: "0.3rem 0.75rem",
            cursor: "pointer",
          }}
        >
          Practice Quiz
        </button>
      ) : (
        <div style={{ width: 100 }} />
      )}
      <svg
        viewBox="0 0 16 16"
        width="14"
        fill="none"
        style={{
          flexShrink: 0,
          color: hov ? C.orange : C.textMuted,
          transition: "color 0.15s",
        }}
      >
        <path
          d="M6 4l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function ChipIcon({ label, color }: { label: string; color: string }) {
  return (
    <span
      style={{
        fontFamily: F.body,
        fontSize: "0.72rem",
        color,
        background: `${color}15`,
        border: `1px solid ${color}20`,
        borderRadius: 4,
        padding: "0.1rem 0.4rem",
      }}
    >
      {label}
    </span>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE: PRACTICE QUIZZES
// ═════════════════════════════════════════════════════════════════════════════
function PageQuizzes() {
  const subjects = [
    "All",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "Hindi",
  ];
  const [filter, setFilter] = useState("All");
  const done = QUIZ_LIST.filter((q) => q.done).length;
  const avgScore = Math.round(
    (QUIZ_LIST.filter((q) => q.done && q.score).reduce(
      (a, q) => a + (q.score ?? 0),
      0,
    ) /
      QUIZ_LIST.filter((q) => q.done && q.score).length) *
      10,
  );
  const filtered =
    filter === "All"
      ? QUIZ_LIST
      : QUIZ_LIST.filter((q) => q.subject === filter);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <h1
          style={{
            fontFamily: F.head,
            fontSize: "1.65rem",
            fontWeight: 700,
            color: C.text,
            margin: "0 0 0.25rem",
          }}
        >
          Practice Quizzes
        </h1>
        <p
          style={{
            fontFamily: F.body,
            fontSize: "0.875rem",
            color: C.textSub,
            margin: 0,
          }}
        >
          Test your knowledge with NCERT chapter quizzes
        </p>
      </div>

      {/* 3 stat pills */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1px",
          background: C.border,
          borderRadius: 10,
          overflow: "hidden",
          border: `1px solid ${C.border}`,
        }}
      >
        {[
          { label: "Total Quizzes", value: QUIZ_LIST.length, color: C.orange },
          { label: "Completed", value: done, color: C.green },
          { label: "Average Score", value: `${avgScore}%`, color: C.blue },
        ].map((st, i) => (
          <div
            key={i}
            style={{
              background: C.surface,
              padding: "1rem 1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: st.color,
                flexShrink: 0,
              }}
            />
            <div>
              <div
                style={{
                  fontFamily: F.head,
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: st.color,
                  lineHeight: 1,
                }}
              >
                {st.value}
              </div>
              <div
                style={{
                  fontFamily: F.body,
                  fontSize: "0.75rem",
                  color: C.textSub,
                  marginTop: 2,
                }}
              >
                {st.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Subject filter */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {subjects.map((s) => (
          <Pill key={s} active={filter === s} onClick={() => setFilter(s)}>
            {s !== "All" && <SubjectDot subject={s} size={6} />} {s}
          </Pill>
        ))}
      </div>

      {/* Quiz list */}
      <Card style={{ overflow: "hidden" }}>
        {filtered.map((q, i) => {
          const [hov, setHov] = useState(false);
          return (
            <div
              key={q.id}
              onMouseEnter={() => setHov(true)}
              onMouseLeave={() => setHov(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1rem 1.4rem",
                borderBottom:
                  i < filtered.length - 1 ? `1px solid ${C.border}` : "none",
                background: hov ? C.surfaceB : "transparent",
                transition: "background 0.15s",
                cursor: "pointer",
              }}
            >
              {/* Status icon */}
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: q.done
                    ? q.pass
                      ? C.greenDim
                      : C.redDim
                    : C.orangeDim,
                  border: `1px solid ${q.done ? (q.pass ? C.greenBdr : "rgba(239,68,68,0.25)") : C.orangeBdr}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {q.done ? (
                  q.pass ? (
                    <svg viewBox="0 0 12 12" width="11" fill="none">
                      <path
                        d="M2 6l3 3 5-5"
                        stroke={C.green}
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 12 12" width="11" fill="none">
                      <circle
                        cx="6"
                        cy="6"
                        r="4.5"
                        stroke={C.red}
                        strokeWidth="1.2"
                      />
                      <path
                        d="M4 8a2.5 2.5 0 014 0"
                        stroke={C.red}
                        strokeWidth="1"
                      />
                      <circle cx="4.5" cy="5" r=".8" fill={C.red} />
                      <circle cx="7.5" cy="5" r=".8" fill={C.red} />
                    </svg>
                  )
                ) : (
                  <svg viewBox="0 0 12 12" width="11" fill="none">
                    <circle
                      cx="6"
                      cy="6"
                      r="4.5"
                      stroke={C.orange}
                      strokeWidth="1.2"
                    />
                    <path
                      d="M4 5a1.8 1.8 0 013 .5"
                      stroke={C.orange}
                      strokeWidth="1"
                      strokeLinecap="round"
                    />
                    <circle cx="4.5" cy="7" r=".8" fill={C.orange} />
                    <circle cx="7.5" cy="7" r=".8" fill={C.orange} />
                  </svg>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: F.body,
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    color: C.text,
                  }}
                >
                  {q.title}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    marginTop: "0.2rem",
                  }}
                >
                  <SubjectDot subject={q.subject} size={6} />
                  <span
                    style={{
                      fontFamily: F.body,
                      fontSize: "0.75rem",
                      color: SUB_COLOR[q.subject] ?? C.textSub,
                    }}
                  >
                    {q.subject}
                  </span>
                  <span
                    style={{
                      fontFamily: F.body,
                      fontSize: "0.72rem",
                      color: C.textMuted,
                    }}
                  >
                    · 10 MCQs
                  </span>
                  {q.done && q.score && (
                    <span
                      style={{
                        fontFamily: F.mono,
                        fontSize: "0.72rem",
                        color: scoreColor(q.score * 10),
                      }}
                    >
                      · Score: {q.score}/10
                    </span>
                  )}
                </div>
              </div>
              {q.done ? (
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    background: "transparent",
                    color: C.textSub,
                    fontFamily: F.body,
                    fontSize: "0.8rem",
                    border: `1px solid ${C.border}`,
                    borderRadius: 6,
                    padding: "0.3rem 0.75rem",
                    cursor: "pointer",
                  }}
                >
                  <svg viewBox="0 0 12 12" width="10" fill="none">
                    <path
                      d="M2 6C2 3.8 3.8 2 6 2a4 4 0 014 4"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M10 4v2.5H7.5"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Retake
                </button>
              ) : (
                <button
                  style={{
                    background: C.orange,
                    color: "#fff",
                    fontFamily: F.body,
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    border: "none",
                    borderRadius: 6,
                    padding: "0.3rem 0.9rem",
                    cursor: "pointer",
                  }}
                >
                  Start Quiz
                </button>
              )}
              <svg
                viewBox="0 0 16 16"
                width="14"
                fill="none"
                style={{
                  flexShrink: 0,
                  color: hov ? C.orange : C.textMuted,
                  transition: "color 0.15s",
                }}
              >
                <path
                  d="M6 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE: AI TUTOR
// ═════════════════════════════════════════════════════════════════════════════
function PageTutor() {
  const [msgs, setMsgs] = useState([
    {
      from: "ai",
      text: "Hi Jrine! What would you like to learn about today?\n\nI can explain concepts, solve problems, and help you prepare for exams.",
    },
  ]);
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<"intro" | "chat">("intro");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const send = (text?: string) => {
    const msg = text ?? input;
    if (!msg.trim()) return;
    setPhase("chat");
    setMsgs((m) => [
      ...m,
      { from: "user", text: msg },
      {
        from: "ai",
        text: "That's a great question! Let me walk you through it step by step.\n\nFirst, let's understand the core concept, then we'll look at an example that makes it concrete.",
      },
    ]);
    setInput("");
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "280px 1fr",
        gap: "1.25rem",
        height: "calc(100vh - 6rem)",
        maxHeight: 820,
      }}
    >
      {/* Left: context panel */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          overflowY: "auto",
        }}
      >
        <Card style={{ padding: "1rem 1.1rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.75rem",
            }}
          >
            <svg viewBox="0 0 16 16" width="14" fill="none">
              <rect
                x="1"
                y="3"
                width="10"
                height="10"
                rx="1.5"
                stroke={C.orange}
                strokeWidth="1.2"
              />
              <path
                d="M11 6.5l4-2v7l-4-2V6.5z"
                stroke={C.orange}
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </svg>
            <span
              style={{
                fontFamily: F.body,
                fontSize: "0.82rem",
                fontWeight: 600,
                color: C.text,
              }}
            >
              Study Context
            </span>
          </div>
          <p
            style={{
              fontFamily: F.body,
              fontSize: "0.78rem",
              color: C.textMuted,
              margin: "0 0 0.85rem",
              lineHeight: 1.55,
            }}
          >
            Open a study material or video, then ask Erudio for help. The tutor
            will know what you're studying.
          </p>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}
          >
            {TUTOR_CONTEXT.map((c, i) => {
              const [hov, setHov] = useState(false);
              return (
                <div
                  key={i}
                  onMouseEnter={() => setHov(true)}
                  onMouseLeave={() => setHov(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.6rem 0.75rem",
                    background: hov ? C.surfaceB : "rgba(255,255,255,0.02)",
                    border: `1px solid ${C.border}`,
                    borderRadius: 7,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: F.body,
                        fontSize: "0.7rem",
                        color: C.textMuted,
                        marginBottom: 2,
                      }}
                    >
                      {c.subject}
                    </div>
                    <div
                      style={{
                        fontFamily: F.body,
                        fontSize: "0.83rem",
                        fontWeight: 500,
                        color: C.text,
                      }}
                    >
                      {c.chapter}
                    </div>
                  </div>
                  <svg
                    viewBox="0 0 16 16"
                    width="13"
                    fill="none"
                    style={{ color: C.textMuted }}
                  >
                    <path
                      d="M6 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Right: chat area */}
      <Card
        style={{
          display: "flex",
          flexDirection: "column",
          padding: 0,
          overflow: "hidden",
        }}
      >
        {phase === "intro" ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem",
              gap: "1.5rem",
            }}
          >
            {/* Orb */}
            <div style={{ position: "relative", width: 88, height: 88 }}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: `conic-gradient(${C.orange}, ${C.purple}, ${C.orange})`,
                  padding: 2,
                  animation: "spin 4s linear infinite",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    background: C.surface,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SparklesSvg color={C.orange} size={28} />
                </div>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <h2
                style={{
                  fontFamily: F.head,
                  fontSize: "1.35rem",
                  fontWeight: 700,
                  color: C.text,
                  margin: "0 0 0.5rem",
                }}
              >
                Hi Jrine! What would you like to learn about today?
              </h2>
              <p
                style={{
                  fontFamily: F.body,
                  fontSize: "0.875rem",
                  color: C.textSub,
                  margin: 0,
                }}
              >
                I can explain concepts, solve problems, and help you prepare for
                exams.
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.6rem",
                width: "100%",
                maxWidth: 560,
              }}
            >
              {TUTOR_SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => send(s.text)}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.6rem",
                    padding: "0.85rem 1rem",
                    background: C.surfaceB,
                    border: `1px solid ${C.border}`,
                    borderRadius: 10,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "border-color 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = C.borderHov)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = C.border)
                  }
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      background: `${s.color}12`,
                      border: `1px solid ${s.color}25`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: s.color,
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontFamily: F.body,
                      fontSize: "0.82rem",
                      color: C.textSub,
                      lineHeight: 1.4,
                    }}
                  >
                    {s.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {msgs.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "0.65rem",
                  justifyContent: m.from === "user" ? "flex-end" : "flex-start",
                }}
              >
                {m.from === "ai" && (
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: C.orangeDim,
                      border: `1px solid ${C.orangeBdr}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    <SparklesSvg color={C.orange} size={12} />
                  </div>
                )}
                <div
                  style={{
                    maxWidth: "72%",
                    padding: "0.7rem 1rem",
                    background: m.from === "user" ? C.orangeDim : C.surfaceB,
                    border: `1px solid ${m.from === "user" ? C.orangeBdr : C.border}`,
                    borderRadius:
                      m.from === "user"
                        ? "12px 12px 2px 12px"
                        : "2px 12px 12px 12px",
                    fontFamily: F.body,
                    fontSize: "0.875rem",
                    color: C.text,
                    lineHeight: 1.65,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
        {/* Input */}
        <div
          style={{
            padding: "1rem 1.25rem",
            borderTop: `1px solid ${C.border}`,
            display: "flex",
            gap: "0.6rem",
            background: C.surface,
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="Ask me anything…"
            style={{
              flex: 1,
              background: C.surfaceB,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: "0.6rem 0.9rem",
              color: C.text,
              fontFamily: F.body,
              fontSize: "0.875rem",
            }}
            onFocus={(e) => (e.target.style.borderColor = C.borderHov)}
            onBlur={(e) => (e.target.style.borderColor = C.border)}
          />
          <button
            onClick={() => send()}
            style={{
              width: 38,
              height: 38,
              borderRadius: 8,
              background: C.orange,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg viewBox="0 0 16 16" width="14" fill="none">
              <path
                d="M2 8h12M10 4l4 4-4 4"
                stroke="#fff"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </Card>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE: MY RESULTS
// ═════════════════════════════════════════════════════════════════════════════
function PageResults() {
  const subjects = [
    "All",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
  ];
  const [filter, setFilter] = useState("All");
  const filtered =
    filter === "All"
      ? RESULT_LIST
      : RESULT_LIST.filter((r) => r.subject === filter);
  const overall = Math.round(
    (RESULT_LIST.reduce((a, r) => a + r.score, 0) / RESULT_LIST.length) * 10,
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <h1
          style={{
            fontFamily: F.head,
            fontSize: "1.65rem",
            fontWeight: 700,
            color: C.text,
            margin: "0 0 0.25rem",
          }}
        >
          My Results
        </h1>
        <p
          style={{
            fontFamily: F.body,
            fontSize: "0.875rem",
            color: C.textSub,
            margin: 0,
          }}
        >
          Track your quiz performance across subjects
        </p>
      </div>

      {/* Stat cards — bento grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.3fr 1fr 1fr 1fr 1fr",
          gap: "0.85rem",
        }}
      >
        {/* Overall — larger */}
        <Card style={{ padding: "1.1rem 1.3rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            <svg viewBox="0 0 14 14" width="12" fill="none">
              <path
                d="M7 2l1.3 2.7 3 .4-2.2 2.1.5 3-2.6-1.4L4.4 10l.5-3L2.7 5.1l3-.4L7 2z"
                stroke={C.orange}
                strokeWidth="1.1"
                fill={C.orange}
              />
            </svg>
            <span
              style={{
                fontFamily: F.body,
                fontSize: "0.72rem",
                fontWeight: 600,
                color: C.orange,
              }}
            >
              Overall
            </span>
          </div>
          <div
            style={{
              fontFamily: F.head,
              fontSize: "2.2rem",
              fontWeight: 700,
              color: C.text,
              lineHeight: 1,
              marginBottom: "0.25rem",
            }}
          >
            {overall}%
          </div>
          <div
            style={{
              fontFamily: F.body,
              fontSize: "0.75rem",
              color: C.textMuted,
              marginBottom: "0.75rem",
            }}
          >
            {RESULT_LIST.length} quizzes
          </div>
          <ProgressBar pct={overall} color={C.orange} h={3} />
        </Card>

        {/* Per-subject */}
        {SUBJECT_STATS.slice(0, 4).map((s) => (
          <Card key={s.name} style={{ padding: "1.1rem 1.2rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                marginBottom: "0.5rem",
              }}
            >
              <SubjectDot subject={s.name} size={7} />
              <span
                style={{
                  fontFamily: F.body,
                  fontSize: "0.72rem",
                  fontWeight: 500,
                  color: s.color,
                }}
              >
                {s.name}
              </span>
            </div>
            <div
              style={{
                fontFamily: F.head,
                fontSize: "1.75rem",
                fontWeight: 700,
                color: C.text,
                lineHeight: 1,
                marginBottom: "0.25rem",
              }}
            >
              {s.avg}%
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                marginBottom: "0.7rem",
              }}
            >
              <svg viewBox="0 0 12 12" width="10" fill="none">
                <path
                  d="M2 8l2.5-3L7 7l3-5"
                  stroke={scoreColor(s.avg)}
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                style={{
                  fontFamily: F.body,
                  fontSize: "0.7rem",
                  color: C.textMuted,
                }}
              >
                {s.quizzes} quizzes
              </span>
            </div>
            <ProgressBar pct={s.avg} color={s.color} h={3} />
          </Card>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {subjects.map((s) => (
          <Pill key={s} active={filter === s} onClick={() => setFilter(s)}>
            {s !== "All" && <SubjectDot subject={s} size={6} />} {s}
          </Pill>
        ))}
      </div>

      {/* Results table */}
      <Card style={{ overflow: "hidden" }}>
        {/* Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 160px 120px 120px",
            padding: "0.65rem 1.4rem",
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          {["QUIZ", "SUBJECT", "SCORE", "DATE"].map((h) => (
            <span
              key={h}
              style={{
                fontFamily: F.mono,
                fontSize: "0.63rem",
                fontWeight: 500,
                color: C.textMuted,
                letterSpacing: "0.07em",
              }}
            >
              {h}
            </span>
          ))}
        </div>
        {filtered.map((r, i) => {
          const [hov, setHov] = useState(false);
          const pct = r.score * 10;
          const col = scoreColor(pct);
          return (
            <div
              key={r.id}
              onMouseEnter={() => setHov(true)}
              onMouseLeave={() => setHov(false)}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 160px 120px 120px",
                padding: "0.9rem 1.4rem",
                borderBottom:
                  i < filtered.length - 1 ? `1px solid ${C.border}` : "none",
                background: hov ? C.surfaceB : "transparent",
                transition: "background 0.15s",
                cursor: "pointer",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontFamily: F.body,
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: C.text,
                }}
              >
                {r.title}
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.45rem",
                }}
              >
                <SubjectDot subject={r.subject} size={7} />
                <span
                  style={{
                    fontFamily: F.body,
                    fontSize: "0.82rem",
                    color: SUB_COLOR[r.subject] ?? C.textSub,
                  }}
                >
                  {r.subject}
                </span>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: F.mono,
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    color: col,
                  }}
                >
                  {r.score}/10
                </div>
                <div
                  style={{
                    fontFamily: F.body,
                    fontSize: "0.7rem",
                    color: C.textMuted,
                  }}
                >
                  {pct}%
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontFamily: F.body,
                    fontSize: "0.8rem",
                    color: C.textMuted,
                  }}
                >
                  {r.date}
                </span>
                <svg
                  viewBox="0 0 16 16"
                  width="14"
                  fill="none"
                  style={{
                    color: hov ? C.orange : C.textMuted,
                    transition: "color 0.15s",
                  }}
                >
                  <path
                    d="M6 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SMALL COMPONENTS
// ═════════════════════════════════════════════════════════════════════════════

function SectionHead({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <span
        style={{
          fontFamily: F.body,
          fontSize: "0.9rem",
          fontWeight: 600,
          color: C.text,
        }}
      >
        {title}
      </span>
      {action && (
        <button
          onClick={onAction}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            background: "none",
            border: "none",
            fontFamily: F.body,
            fontSize: "0.8rem",
            color: C.orange,
            cursor: "pointer",
          }}
        >
          {action}
          <svg viewBox="0 0 12 12" width="10" fill="none">
            <path
              d="M2 6h8M7 3l3 3-3 3"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

function SubjectTile({
  name,
  chapters,
  done,
  color,
  onClick,
}: {
  name: string;
  chapters: number;
  done: number;
  color: string;
  onClick: () => void;
}) {
  const pct = Math.round((done / chapters) * 100);
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "0.85rem 1rem",
        background: hov ? C.surfaceB : "rgba(255,255,255,0.02)",
        border: `1px solid ${hov ? C.borderHov : C.border}`,
        borderRadius: 10,
        cursor: "pointer",
        transition: "all 0.15s",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "0.5rem",
        }}
      >
        <span
          style={{
            fontFamily: F.body,
            fontSize: "0.875rem",
            fontWeight: 500,
            color: hov ? C.orange : C.text,
            transition: "color 0.15s",
          }}
        >
          {name}
        </span>
        <svg
          viewBox="0 0 16 16"
          width="13"
          fill="none"
          style={{
            color: hov ? C.orange : C.textMuted,
            transition: "color 0.15s",
          }}
        >
          <path
            d="M6 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div
        style={{
          fontFamily: F.body,
          fontSize: "0.75rem",
          color: C.textMuted,
          marginBottom: "0.5rem",
        }}
      >
        {done} of {chapters} chapters
      </div>
      <ProgressBar pct={pct} color={color} h={3} />
      <div
        style={{
          fontFamily: F.mono,
          fontSize: "0.65rem",
          color,
          marginTop: "0.3rem",
          textAlign: "right",
        }}
      >
        {pct}%
      </div>
    </div>
  );
}

function QuizRow({
  score,
  name,
  subject,
  date,
  pass,
  onClick,
}: {
  score: number;
  name: string;
  subject: string;
  date: string;
  pass: boolean;
  onClick: () => void;
}) {
  const col = scoreColor(score);
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.85rem",
        padding: "0.65rem 0.85rem",
        background: hov ? C.surfaceB : "rgba(255,255,255,0.02)",
        border: `1px solid ${hov ? C.borderHov : C.border}`,
        borderRadius: 8,
        cursor: "pointer",
        transition: "all 0.15s",
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: "50%",
          background: scoreColorDim(score),
          border: `1px solid ${col}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: F.head,
            fontSize: "0.88rem",
            fontWeight: 700,
            color: col,
          }}
        >
          {score}
        </span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: F.body,
            fontSize: "0.875rem",
            fontWeight: 500,
            color: C.text,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontFamily: F.body,
            fontSize: "0.72rem",
            color: C.textMuted,
            marginTop: 2,
          }}
        >
          {subject} · {date}
        </div>
      </div>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.25rem",
          fontFamily: F.body,
          fontSize: "0.72rem",
          fontWeight: 600,
          color: pass ? C.green : C.red,
          background: pass ? C.greenDim : C.redDim,
          border: `1px solid ${pass ? C.greenBdr : "rgba(239,68,68,0.25)"}`,
          borderRadius: 20,
          padding: "0.15rem 0.55rem",
          flexShrink: 0,
        }}
      >
        {pass ? (
          <svg viewBox="0 0 10 10" width="9" fill="none">
            <path
              d="M2 5l2 2 4-4"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 10 10" width="9" fill="none">
            <path
              d="M3 3l4 4M7 3l-4 4"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
        )}
        {pass ? "Pass" : "Fail"}
      </span>
      <svg
        viewBox="0 0 16 16"
        width="13"
        fill="none"
        style={{
          color: hov ? C.orange : C.textMuted,
          flexShrink: 0,
          transition: "color 0.15s",
        }}
      >
        <path
          d="M6 4l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function MiniBarChart({
  scores,
  labels,
}: {
  scores: readonly number[];
  labels: readonly string[];
}) {
  const max = Math.max(...scores);
  const maxH = 68;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: "0.35rem",
        height: maxH + 28,
      }}
    >
      {scores.map((s, i) => {
        const h = (s / max) * maxH;
        const col = scoreColor(s);
        return (
          <div
            key={i}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
            }}
          >
            <span
              style={{ fontFamily: F.mono, fontSize: "0.58rem", color: col }}
            >
              {s}
            </span>
            <div
              style={{
                width: "100%",
                height: maxH,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: h,
                  background: col,
                  borderRadius: "3px 3px 0 0",
                  opacity: 0.85,
                  transformOrigin: "bottom",
                  animation: "barIn 0.6s ease forwards",
                }}
              />
            </div>
            <span
              style={{
                fontFamily: F.mono,
                fontSize: "0.58rem",
                color: C.textMuted,
              }}
            >
              {labels[i]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Icon components ──────────────────────────────────────────────────────────
function OrbIcon() {
  return (
    <div style={{ position: "relative", width: 52, height: 52, flexShrink: 0 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: `radial-gradient(circle at 40% 40%, ${C.orange}, #fb923c 50%, ${C.purple} 100%)`,
          filter: "blur(1px)",
          animation: "pulse 3s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 2,
          borderRadius: "50%",
          background: C.surface,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SparklesSvg color={C.orange} size={20} />
      </div>
    </div>
  );
}

function SparklesSvg({ color, size = 14 }: { color: string; size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="none">
      <path
        d="M8 2v3M8 11v3M2 8h3M11 8h3M4.2 4.2l2.1 2.1M9.7 9.7l2.1 2.1M4.2 11.8l2.1-2.1M9.7 6.3l2.1-2.1"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <circle cx="8" cy="8" r="1.5" fill={color} />
    </svg>
  );
}

function TrophySvg({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 16 16" width="16" fill="none">
      <path d="M4 2h8v5a4 4 0 01-8 0V2z" stroke={color} strokeWidth="1.2" />
      <path
        d="M4 4H2a2 2 0 002 4M12 4h2a2 2 0 01-2 4"
        stroke={color}
        strokeWidth="1.2"
      />
      <path
        d="M8 11v2M6 13h4"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TrendSvg({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 16 16" width="16" fill="none">
      <path
        d="M2 10l4-4 3 3 5-6"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 4h2v2"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FlameSvg({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 16 16" width="16" fill="none">
      <path
        d="M8 14c-3 0-5-2-5-5 0-3 2-5 3-7 1 2 1 3 2 3 1 0 1-2 2-2 1 3 2 4 2 6 0 3-2 5-4 5z"
        stroke={color}
        strokeWidth="1.2"
        fill={`${color}20`}
      />
    </svg>
  );
}
