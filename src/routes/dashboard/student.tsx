import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";

export const Route = createFileRoute("/dashboard/student")({
  component: StudentDashboard,
});

// ─── Design tokens ────────────────────────────────────────────────────────────
const F = {
  head: "'DM Sans', 'Segoe UI', sans-serif",
  body: "'Inter', 'Segoe UI', sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
};

const C = {
  bg: "#09090f",
  surface: "#0e0f17",
  surfaceAlt: "#131420",
  border: "rgba(255,255,255,0.07)",
  borderMed: "rgba(255,255,255,0.13)",
  text: "#f0ede8",
  textSub: "#8b8d9b",
  textMuted: "#555769",
  orange: "#f2740d",
  orangeDim: "rgba(242,116,13,0.1)",
  orangeBorder: "rgba(242,116,13,0.28)",
  green: "#22c55e",
  yellow: "#eab308",
  red: "#ef4444",
  blue: "#3b82f6",
  purple: "#a855f7",
  teal: "#14b8a6",
  pink: "#ec4899",
};

// ─── Types ────────────────────────────────────────────────────────────────────
type Page =
  | "home"
  | "subjects"
  | "ai-teacher"
  | "videos"
  | "quizzes"
  | "notes"
  | "settings";

interface Subject {
  id: string;
  name: string;
  pct: number;
  color: string;
  chapter: string;
  lastStudied: string;
  totalTopics: number;
  doneTopics: number;
}
interface Note {
  id: number;
  subject: string;
  title: string;
  body: string;
  date: string;
  tag: string;
  pinned?: boolean;
}
interface Quiz {
  id: number;
  subject: string;
  score: number;
  total: number;
  date: string;
  duration: string;
  topics: string[];
}
interface Activity {
  id: number;
  type: "quiz" | "video" | "note" | "lesson";
  label: string;
  sub: string;
  time: string;
  meta?: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────
const SUBJECTS: Subject[] = [
  {
    id: "maths",
    name: "Mathematics",
    pct: 72,
    color: C.orange,
    chapter: "Quadratic Equations",
    lastStudied: "Today",
    totalTopics: 24,
    doneTopics: 17,
  },
  {
    id: "physics",
    name: "Physics",
    pct: 58,
    color: C.blue,
    chapter: "Laws of Motion",
    lastStudied: "Yesterday",
    totalTopics: 20,
    doneTopics: 12,
  },
  {
    id: "chem",
    name: "Chemistry",
    pct: 43,
    color: C.teal,
    chapter: "Periodic Table",
    lastStudied: "Mon",
    totalTopics: 22,
    doneTopics: 9,
  },
  {
    id: "bio",
    name: "Biology",
    pct: 85,
    color: C.green,
    chapter: "Cell Division",
    lastStudied: "Today",
    totalTopics: 18,
    doneTopics: 15,
  },
  {
    id: "eng",
    name: "English",
    pct: 67,
    color: C.pink,
    chapter: "Essay Writing",
    lastStudied: "Sun",
    totalTopics: 16,
    doneTopics: 11,
  },
  {
    id: "hist",
    name: "History",
    pct: 31,
    color: C.purple,
    chapter: "World War II",
    lastStudied: "Last week",
    totalTopics: 20,
    doneTopics: 6,
  },
];

const NOTES: Note[] = [
  {
    id: 1,
    subject: "Mathematics",
    title: "Discriminant formula",
    body: "b²–4ac determines nature of roots. D>0 → two real roots, D=0 → one repeated root, D<0 → no real roots.",
    date: "Today, 2:14 PM",
    tag: "Formula",
    pinned: true,
  },
  {
    id: 2,
    subject: "Physics",
    title: "Newton's Second Law",
    body: "F = ma. Net force equals mass times acceleration. Direction of acceleration always matches direction of net force.",
    date: "Yesterday, 4:30 PM",
    tag: "Law",
  },
  {
    id: 3,
    subject: "Biology",
    title: "Mitosis vs Meiosis",
    body: "Mitosis → 2 identical daughter cells (diploid). Meiosis → 4 haploid cells. Involves crossing over in Prophase I.",
    date: "Mon, 10:00 AM",
    tag: "Comparison",
  },
  {
    id: 4,
    subject: "English",
    title: "PEEL structure",
    body: "Point → Evidence → Explain → Link. Every body paragraph needs all four. Link must connect back to the question.",
    date: "Sun, 6:45 PM",
    tag: "Technique",
  },
  {
    id: 5,
    subject: "Chemistry",
    title: "Periodic trends",
    body: "Electronegativity and ionisation energy increase across a period (left→right) and decrease down a group.",
    date: "Sat, 3:20 PM",
    tag: "Trend",
  },
];

const QUIZZES: Quiz[] = [
  {
    id: 1,
    subject: "Mathematics",
    score: 18,
    total: 20,
    date: "Today",
    duration: "12 min",
    topics: ["Quadratic Equations", "Factoring"],
  },
  {
    id: 2,
    subject: "Physics",
    score: 14,
    total: 20,
    date: "Yesterday",
    duration: "18 min",
    topics: ["Newton's Laws", "Friction"],
  },
  {
    id: 3,
    subject: "Biology",
    score: 19,
    total: 20,
    date: "Mon",
    duration: "9 min",
    topics: ["Cell Division", "Mitosis"],
  },
  {
    id: 4,
    subject: "Chemistry",
    score: 11,
    total: 20,
    date: "Sun",
    duration: "22 min",
    topics: ["Periodic Table", "Bonding"],
  },
];

const ACTIVITY: Activity[] = [
  {
    id: 1,
    type: "quiz",
    label: "Completed quiz",
    sub: "Mathematics · 18/20",
    time: "2 hours ago",
    meta: "90%",
  },
  {
    id: 2,
    type: "lesson",
    label: "Studied with AI Teacher",
    sub: "Physics · Laws of Motion",
    time: "4 hours ago",
    meta: "34 min",
  },
  {
    id: 3,
    type: "video",
    label: "Watched lesson video",
    sub: "Biology · Cell Division",
    time: "Yesterday",
    meta: "6:48",
  },
  {
    id: 4,
    type: "note",
    label: "Saved session note",
    sub: "Mathematics",
    time: "Yesterday",
  },
  {
    id: 5,
    type: "quiz",
    label: "Completed quiz",
    sub: "Biology · 19/20",
    time: "Mon",
    meta: "95%",
  },
];

const VIDEOS = [
  {
    id: 1,
    title: "Quadratic Formula — Visual Proof",
    subject: "Mathematics",
    duration: "8:24",
    generated: true,
    date: "Today",
  },
  {
    id: 2,
    title: "Newton's Laws in Real Life",
    subject: "Physics",
    duration: "11:05",
    generated: true,
    date: "Yesterday",
  },
  {
    id: 3,
    title: "Mitosis Step-by-Step",
    subject: "Biology",
    duration: "6:48",
    generated: false,
    date: "Mon",
  },
  {
    id: 4,
    title: "Periodic Table Explained",
    subject: "Chemistry",
    duration: "14:22",
    generated: true,
    date: "Sun",
  },
];

// ─── Reusable style helpers ───────────────────────────────────────────────────
function card(extra?: React.CSSProperties): React.CSSProperties {
  return {
    background: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    padding: "1.25rem 1.5rem",
    ...extra,
  };
}
function tag(color = C.orange): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    fontFamily: F.mono,
    fontSize: "0.65rem",
    fontWeight: 500,
    letterSpacing: "0.04em",
    color,
    background: `${color}18`,
    border: `1px solid ${color}30`,
    borderRadius: 4,
    padding: "0.15rem 0.5rem",
  };
}
function label(): React.CSSProperties {
  return {
    fontFamily: F.mono,
    fontSize: "0.68rem",
    fontWeight: 500,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: C.textSub,
  };
}
function progressBar(
  pct: number,
  color: string,
  h = 4,
): { track: React.CSSProperties; fill: React.CSSProperties } {
  return {
    track: {
      height: h,
      background: "rgba(255,255,255,0.07)",
      borderRadius: h,
      overflow: "hidden",
    },
    fill: {
      height: "100%",
      width: `${pct}%`,
      background: color,
      borderRadius: h,
      transition: "width 0.6s ease",
    },
  };
}
const BTN = {
  primary: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    fontFamily: F.body,
    fontSize: "0.85rem",
    fontWeight: 500,
    background: C.orange,
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "0.55rem 1.1rem",
    cursor: "pointer",
    transition: "opacity 0.15s",
  } as React.CSSProperties,
  ghost: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    fontFamily: F.body,
    fontSize: "0.85rem",
    fontWeight: 400,
    background: "transparent",
    color: C.textSub,
    border: `1px solid ${C.border}`,
    borderRadius: 6,
    padding: "0.5rem 1rem",
    cursor: "pointer",
    transition: "all 0.15s",
  } as React.CSSProperties,
};

// ─────────────────────────────────────────────────────────────────────────────
// ROOT LAYOUT
// ─────────────────────────────────────────────────────────────────────────────
function StudentDashboard() {
  const [page, setPage] = useState<Page>("home");
  const overall = Math.round(
    SUBJECTS.reduce((a, s) => a + s.pct, 0) / SUBJECTS.length,
  );

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: C.bg,
        color: C.text,
      }}
    >
      <style>{`
        *{box-sizing:border-box}body{margin:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:4px}
        input,textarea,select{outline:none;color-scheme:dark}
        input::placeholder,textarea::placeholder{color:${C.textMuted}}
        button:focus-visible{outline:2px solid ${C.orange};outline-offset:2px}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:.4;transform:scale(1)}50%{opacity:.8;transform:scale(1.06)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        .page{animation:fadeUp 0.2s ease forwards}
      `}</style>

      {/* Sidebar */}
      <aside
        style={{
          width: 232,
          flexShrink: 0,
          background: C.surface,
          borderRight: `1px solid ${C.border}`,
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            padding: "1.25rem 1.25rem 1rem",
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <a
            href="/"
            style={{
              fontFamily: F.head,
              fontSize: "1.15rem",
              fontWeight: 700,
              color: C.text,
              textDecoration: "none",
              display: "block",
              marginBottom: "0.2rem",
            }}
          >
            SchoolMe
          </a>
          <span style={{ ...label(), color: C.orange, fontSize: "0.6rem" }}>
            Student Portal
          </span>
        </div>

        <nav
          style={{
            padding: "0.75rem",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          {(
            [
              "home",
              "subjects",
              "ai-teacher",
              "videos",
              "quizzes",
              "notes",
              "settings",
            ] as Page[]
          ).map((id) => {
            const active = page === id;
            return (
              <button
                key={id}
                onClick={() => setPage(id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.65rem",
                  padding: "0.575rem 0.75rem",
                  background: active ? C.orangeDim : "transparent",
                  border: `1px solid ${active ? C.orangeBorder : "transparent"}`,
                  borderRadius: 6,
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                  transition: "all 0.15s",
                }}
              >
                <span
                  style={{
                    color: active ? C.orange : C.textMuted,
                    display: "flex",
                    flexShrink: 0,
                  }}
                >
                  <NavIcon id={id} />
                </span>
                <span
                  style={{
                    fontFamily: F.body,
                    fontSize: "0.875rem",
                    fontWeight: active ? 600 : 400,
                    color: active ? C.text : C.textSub,
                  }}
                >
                  {id === "home"
                    ? "Home"
                    : id === "subjects"
                      ? "My Subjects"
                      : id === "ai-teacher"
                        ? "AI Teacher"
                        : id === "videos"
                          ? "Video Studio"
                          : id === "quizzes"
                            ? "Quizzes"
                            : id === "notes"
                              ? "Notes"
                              : "Settings"}
                </span>
              </button>
            );
          })}
        </nav>

        <div
          style={{
            margin: "0 0.75rem 1rem",
            padding: "0.875rem",
            background: C.surfaceAlt,
            border: `1px solid ${C.border}`,
            borderRadius: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              marginBottom: "0.75rem",
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: C.orangeDim,
                border: `2px solid ${C.orange}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: F.head,
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  color: C.orange,
                }}
              >
                A
              </span>
            </div>
            <div>
              <div
                style={{
                  fontFamily: F.body,
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: C.text,
                  lineHeight: 1.2,
                }}
              >
                Arjun S.
              </div>
              <div
                style={{
                  fontFamily: F.body,
                  fontSize: "0.72rem",
                  color: C.textMuted,
                }}
              >
                Class X · Science
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.3rem",
            }}
          >
            <span style={{ ...label(), fontSize: "0.58rem" }}>Overall</span>
            <span
              style={{
                fontFamily: F.mono,
                fontSize: "0.68rem",
                fontWeight: 600,
                color: C.orange,
              }}
            >
              {overall}%
            </span>
          </div>
          <div style={progressBar(overall, C.orange).track}>
            <div style={progressBar(overall, C.orange).fill} />
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: "auto", padding: "2rem 2.25rem" }}>
        <div className="page" key={page}>
          {page === "home" && <PageHome setPage={setPage} />}
          {page === "subjects" && <PageSubjects setPage={setPage} />}
          {page === "ai-teacher" && <PageAITeacher />}
          {page === "videos" && <PageVideos />}
          {page === "quizzes" && <PageQuizzes />}
          {page === "notes" && <PageNotes />}
          {page === "settings" && <PageSettings />}
        </div>
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE: HOME
// ─────────────────────────────────────────────────────────────────────────────
function PageHome({ setPage }: { setPage: (p: Page) => void }) {
  const h = new Date().getHours();
  const greeting =
    h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      <div>
        <h1
          style={{
            fontFamily: F.head,
            fontSize: "1.65rem",
            fontWeight: 700,
            color: C.text,
            margin: "0 0 0.3rem",
          }}
        >
          {greeting}, Arjun.
        </h1>
        <p
          style={{
            fontFamily: F.body,
            fontSize: "0.875rem",
            color: C.textSub,
            margin: 0,
          }}
        >
          Wednesday ·{" "}
          <span style={{ color: C.text }}>3 subjects due this week</span> ·
          Streak:{" "}
          <span style={{ color: C.orange, fontWeight: 600 }}>12 days 🔥</span>
        </p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "1rem",
        }}
      >
        {[
          {
            label: "Lessons Done",
            value: "47",
            sub: "this month",
            color: C.orange,
          },
          {
            label: "Quiz Accuracy",
            value: "84%",
            sub: "average score",
            color: C.green,
          },
          {
            label: "Study Streak",
            value: "12",
            sub: "days running",
            color: C.yellow,
          },
          {
            label: "Hours Logged",
            value: "38",
            sub: "this semester",
            color: C.blue,
          },
        ].map((st, i) => (
          <div key={i} style={card()}>
            <div
              style={{
                fontFamily: F.head,
                fontSize: "1.8rem",
                fontWeight: 700,
                color: st.color,
                lineHeight: 1,
                marginBottom: "0.35rem",
              }}
            >
              {st.value}
            </div>
            <div
              style={{
                fontFamily: F.body,
                fontSize: "0.85rem",
                fontWeight: 500,
                color: C.text,
                marginBottom: "0.15rem",
              }}
            >
              {st.label}
            </div>
            <div
              style={{
                fontFamily: F.body,
                fontSize: "0.72rem",
                color: C.textMuted,
              }}
            >
              {st.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Continue + Activity */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: "1.25rem",
        }}
      >
        <div style={card()}>
          <SHead title="Continue Learning" />
          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.6rem",
            }}
          >
            {SUBJECTS.slice(0, 4).map((sub) => (
              <button
                key={sub.id}
                onClick={() => setPage("subjects")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.9rem",
                  padding: "0.7rem 0.9rem",
                  background: C.surfaceAlt,
                  border: `1px solid ${C.border}`,
                  borderRadius: 6,
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                  transition: "border-color 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = C.borderMed)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = C.border)
                }
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 6,
                    background: `${sub.color}12`,
                    border: `1px solid ${sub.color}25`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <BookSvg color={sub.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.25rem",
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
                      {sub.name}
                    </span>
                    <span
                      style={{
                        fontFamily: F.mono,
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        color: sub.color,
                      }}
                    >
                      {sub.pct}%
                    </span>
                  </div>
                  <div style={progressBar(sub.pct, sub.color, 3).track}>
                    <div style={progressBar(sub.pct, sub.color, 3).fill} />
                  </div>
                  <div
                    style={{
                      fontFamily: F.body,
                      fontSize: "0.72rem",
                      color: C.textMuted,
                      marginTop: "0.25rem",
                    }}
                  >
                    {sub.chapter}
                  </div>
                </div>
                <ChevR />
              </button>
            ))}
          </div>
        </div>

        <div style={card()}>
          <SHead title="Recent Activity" />
          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {ACTIVITY.map((a, i) => (
              <div
                key={a.id}
                style={{
                  display: "flex",
                  gap: "0.7rem",
                  padding: "0.55rem 0",
                  borderBottom:
                    i < ACTIVITY.length - 1 ? `1px solid ${C.border}` : "none",
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 6,
                    background: aColor(a.type, "18"),
                    border: `1px solid ${aColor(a.type, "30")}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  <AIco type={a.type} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: F.body,
                      fontSize: "0.82rem",
                      fontWeight: 500,
                      color: C.text,
                      marginBottom: "0.1rem",
                    }}
                  >
                    {a.label}
                  </div>
                  <div
                    style={{
                      fontFamily: F.body,
                      fontSize: "0.72rem",
                      color: C.textMuted,
                    }}
                  >
                    {a.sub}
                    {a.meta && ` · ${a.meta}`}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: F.body,
                    fontSize: "0.68rem",
                    color: C.textMuted,
                    whiteSpace: "nowrap",
                    paddingTop: 2,
                  }}
                >
                  {a.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Due this week */}
      <div style={card()}>
        <SHead title="Due This Week" />
        <div
          style={{
            marginTop: "1rem",
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: "0.75rem",
          }}
        >
          {[
            {
              subject: "Chemistry",
              task: "Chapter Quiz",
              due: "Thu",
              urgent: true,
            },
            {
              subject: "History",
              task: "Revision — WW2",
              due: "Fri",
              urgent: false,
            },
            {
              subject: "English",
              task: "Essay Draft",
              due: "Sat",
              urgent: false,
            },
          ].map((d, i) => {
            const sub = SUBJECTS.find((s) => s.name === d.subject)!;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.85rem",
                  padding: "0.75rem 1rem",
                  background: C.surfaceAlt,
                  border: `1px solid ${d.urgent ? "rgba(239,68,68,0.2)" : C.border}`,
                  borderRadius: 6,
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: F.body,
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: C.text,
                      marginBottom: "0.15rem",
                    }}
                  >
                    {d.subject}
                  </div>
                  <div
                    style={{
                      fontFamily: F.body,
                      fontSize: "0.75rem",
                      color: C.textMuted,
                    }}
                  >
                    {d.task}
                  </div>
                </div>
                <span
                  style={{
                    ...tag(d.urgent ? C.red : C.textMuted),
                    marginLeft: "auto",
                    fontSize: "0.62rem",
                  }}
                >
                  {d.due}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE: MY SUBJECTS
// ─────────────────────────────────────────────────────────────────────────────
function PageSubjects({ setPage }: { setPage: (p: Page) => void }) {
  const [sel, setSel] = useState<string | null>(null);
  const s = SUBJECTS.find((s) => s.id === sel);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <PHead
        title="My Subjects"
        sub="Track progress across all subjects and jump into any chapter."
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "1rem",
        }}
      >
        {SUBJECTS.map((sub) => (
          <button
            key={sub.id}
            onClick={() => setSel(sub.id === sel ? null : sub.id)}
            style={{
              ...card(),
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
              border: `1px solid ${sel === sub.id ? sub.color + "45" : C.border}`,
              background: sel === sub.id ? `${sub.color}06` : C.surface,
              transition: "all 0.15s",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: `${sub.color}12`,
                  border: `1px solid ${sub.color}25`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BookSvg color={sub.color} size={18} />
              </div>
              <span style={tag(sub.color)}>
                {sub.doneTopics}/{sub.totalTopics} topics
              </span>
            </div>
            <div
              style={{
                fontFamily: F.body,
                fontSize: "1rem",
                fontWeight: 600,
                color: C.text,
                marginBottom: "0.2rem",
              }}
            >
              {sub.name}
            </div>
            <div
              style={{
                fontFamily: F.body,
                fontSize: "0.78rem",
                color: C.textMuted,
                marginBottom: "0.85rem",
              }}
            >
              {sub.chapter}
            </div>
            <div style={progressBar(sub.pct, sub.color).track}>
              <div style={progressBar(sub.pct, sub.color).fill} />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "0.5rem",
              }}
            >
              <span
                style={{
                  fontFamily: F.body,
                  fontSize: "0.72rem",
                  color: C.textMuted,
                }}
              >
                Last: {sub.lastStudied.toLowerCase()}
              </span>
              <span
                style={{
                  fontFamily: F.mono,
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  color: sub.color,
                }}
              >
                {sub.pct}%
              </span>
            </div>
          </button>
        ))}
      </div>

      {s && (
        <div style={{ ...card(), borderColor: `${s.color}30` }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1.25rem",
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: F.head,
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: C.text,
                  margin: "0 0 0.2rem",
                }}
              >
                {s.name}
              </h2>
              <p
                style={{
                  fontFamily: F.body,
                  fontSize: "0.8rem",
                  color: C.textMuted,
                  margin: 0,
                }}
              >
                Current chapter: {s.chapter}
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.6rem" }}>
              <button onClick={() => setPage("ai-teacher")} style={BTN.primary}>
                Study with AI Teacher
              </button>
              <button onClick={() => setPage("quizzes")} style={BTN.ghost}>
                Take a Quiz
              </button>
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: "1rem",
            }}
          >
            {[
              { l: "Progress", v: `${s.pct}%`, c: s.color },
              {
                l: "Topics Done",
                v: `${s.doneTopics}/${s.totalTopics}`,
                c: C.text,
              },
              { l: "Last Quiz", v: "90%", c: C.green },
              { l: "Time Spent", v: "6.2 hrs", c: C.text },
            ].map((st, i) => (
              <div
                key={i}
                style={{
                  background: C.surfaceAlt,
                  border: `1px solid ${C.border}`,
                  borderRadius: 6,
                  padding: "0.85rem 1rem",
                }}
              >
                <div
                  style={{
                    fontFamily: F.head,
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    color: st.c,
                    marginBottom: "0.2rem",
                  }}
                >
                  {st.v}
                </div>
                <div style={label()}>{st.l}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE: AI TEACHER
// ─────────────────────────────────────────────────────────────────────────────
function PageAITeacher() {
  const [msgs, setMsgs] = useState([
    {
      from: "ai",
      text: "Hello! I'm Dr. Vyasa, your personal AI tutor. Which subject would you like to work on today?",
    },
    { from: "user", text: "Can you explain quadratic equations?" },
    {
      from: "ai",
      text: "Of course! A quadratic equation has the form ax² + bx + c = 0, where a ≠ 0.\n\nThe goal is to find values of x that satisfy this equation. Three main methods:\n1. Factoring\n2. Completing the square\n3. The quadratic formula: x = (−b ± √(b²−4ac)) / 2a\n\nShall we start with a worked example?",
    },
  ]);
  const [input, setInput] = useState("");
  const [subject, setSubject] = useState("Mathematics");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const send = () => {
    if (!input.trim()) return;
    setMsgs((m) => [
      ...m,
      { from: "user", text: input },
      {
        from: "ai",
        text: "Great question. Let me break that down step by step with a concrete example you can follow along.",
      },
    ]);
    setInput("");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
        height: "calc(100vh - 4rem)",
        maxHeight: 820,
      }}
    >
      <PHead
        title="AI Teacher"
        sub="Your personal tutor — available 24/7. Ask anything, explore any topic."
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "260px 1fr",
          gap: "1.25rem",
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* Left panel */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            overflowY: "auto",
          }}
        >
          {/* Avatar */}
          <div
            style={{
              ...card(),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
              textAlign: "center",
            }}
          >
            <div style={{ position: "relative", width: 88, height: 88 }}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  border: `1px solid ${C.orange}28`,
                  animation: "spin 10s linear infinite",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 6,
                  borderRadius: "50%",
                  border: `1px solid ${C.orange}15`,
                  animation: "spin 16s linear infinite reverse",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 12,
                  borderRadius: "50%",
                  background: C.orangeDim,
                  border: `1px solid ${C.orangeBorder}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg viewBox="0 0 36 36" width="34" fill="none">
                  <circle
                    cx="18"
                    cy="12"
                    r="7"
                    stroke={C.orange}
                    strokeWidth="1.2"
                  />
                  <path
                    d="M6 32 Q18 26 30 32"
                    stroke={C.orange}
                    strokeWidth="1.2"
                    fill="none"
                  />
                  <circle cx="15.5" cy="11" r="1.3" fill={C.orange} />
                  <circle cx="20.5" cy="11" r="1.3" fill={C.orange} />
                  <path
                    d="M15.5 15 Q18 17 20.5 15"
                    stroke={C.orange}
                    strokeWidth="0.9"
                    fill="none"
                  />
                </svg>
              </div>
              <div
                style={{
                  position: "absolute",
                  inset: -4,
                  borderRadius: "50%",
                  border: `1px solid ${C.orange}10`,
                  animation: "pulse 2.5s ease-in-out infinite",
                }}
              />
            </div>
            <div>
              <div
                style={{
                  fontFamily: F.body,
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: C.text,
                  marginBottom: "0.15rem",
                }}
              >
                Dr. Vyasa
              </div>
              <div style={{ ...label(), color: C.orange }}>
                AI Educator · v2.1
              </div>
            </div>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
            >
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: C.green,
                  boxShadow: `0 0 6px ${C.green}`,
                }}
              />
              <span
                style={{
                  fontFamily: F.body,
                  fontSize: "0.78rem",
                  color: C.textSub,
                }}
              >
                Online · Session active
              </span>
            </div>
          </div>

          {/* Subject */}
          <div style={card()}>
            <div style={{ ...label(), marginBottom: "0.65rem" }}>
              Active Subject
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.3rem",
              }}
            >
              {SUBJECTS.slice(0, 4).map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSubject(sub.name)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    padding: "0.4rem 0.6rem",
                    background:
                      subject === sub.name ? `${sub.color}10` : "transparent",
                    border: `1px solid ${subject === sub.name ? sub.color + "30" : "transparent"}`,
                    borderRadius: 5,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: sub.color,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: F.body,
                      fontSize: "0.83rem",
                      color: subject === sub.name ? C.text : C.textSub,
                    }}
                  >
                    {sub.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick prompts */}
          <div style={card()}>
            <div style={{ ...label(), marginBottom: "0.65rem" }}>
              Quick Prompts
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.35rem",
              }}
            >
              {[
                "Explain current chapter",
                "Give me practice problems",
                "Generate a lesson video",
                "Quiz me on this topic",
              ].map((a) => (
                <button
                  key={a}
                  onClick={() => setInput(a)}
                  style={{
                    ...BTN.ghost,
                    justifyContent: "flex-start",
                    padding: "0.4rem 0.65rem",
                    fontSize: "0.78rem",
                    borderRadius: 5,
                    textAlign: "left",
                  }}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat */}
        <div
          style={{
            ...card(),
            padding: 0,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "0.875rem 1.25rem",
              borderBottom: `1px solid ${C.border}`,
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: C.green,
              }}
            />
            <span
              style={{
                fontFamily: F.body,
                fontSize: "0.875rem",
                fontWeight: 600,
                color: C.text,
              }}
            >
              Session — {subject}
            </span>
            <span style={{ ...label(), marginLeft: "auto" }}>
              14 min elapsed
            </span>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "1.25rem",
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
                      border: `1px solid ${C.orangeBorder}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    <svg viewBox="0 0 14 14" width="11" fill="none">
                      <circle
                        cx="7"
                        cy="5"
                        r="3"
                        stroke={C.orange}
                        strokeWidth="1"
                      />
                      <path
                        d="M2 12 Q7 9 12 12"
                        stroke={C.orange}
                        strokeWidth="1"
                        fill="none"
                      />
                    </svg>
                  </div>
                )}
                <div
                  style={{
                    maxWidth: "75%",
                    padding: "0.65rem 0.9rem",
                    background: m.from === "user" ? C.orangeDim : C.surfaceAlt,
                    border: `1px solid ${m.from === "user" ? C.orangeBorder : C.border}`,
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

          <div
            style={{
              padding: "0.875rem 1.25rem",
              borderTop: `1px solid ${C.border}`,
              display: "flex",
              gap: "0.6rem",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
              placeholder={`Ask about ${subject}…`}
              style={{
                flex: 1,
                background: C.surfaceAlt,
                border: `1px solid ${C.border}`,
                borderRadius: 6,
                padding: "0.55rem 0.875rem",
                color: C.text,
                fontFamily: F.body,
                fontSize: "0.875rem",
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => (e.target.style.borderColor = C.borderMed)}
              onBlur={(e) => (e.target.style.borderColor = C.border)}
            />
            <button
              onClick={send}
              style={{ ...BTN.primary, borderRadius: 6, flexShrink: 0 }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE: VIDEO STUDIO
// ─────────────────────────────────────────────────────────────────────────────
function PageVideos() {
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState<"prompt" | "document" | "topic">("prompt");
  const [dur, setDur] = useState("3 min");
  const [subFilter, setSubFilter] = useState("All");

  const subjects = ["All", ...SUBJECTS.map((s) => s.name)];
  const filtered =
    subFilter === "All"
      ? VIDEOS
      : VIDEOS.filter((v) => v.subject === subFilter);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      <PHead
        title="Video Studio"
        sub="Generate personalised lesson videos from a prompt, topic, or document upload."
      />

      <div style={card()}>
        <h2
          style={{
            fontFamily: F.head,
            fontSize: "1.05rem",
            fontWeight: 600,
            color: C.text,
            margin: "0 0 1.1rem",
          }}
        >
          Generate New Video
        </h2>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
          {(["prompt", "document", "topic"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                padding: "0.4rem 0.9rem",
                background: mode === m ? C.orangeDim : "transparent",
                border: `1px solid ${mode === m ? C.orangeBorder : C.border}`,
                borderRadius: 6,
                cursor: "pointer",
                fontFamily: F.body,
                fontSize: "0.82rem",
                fontWeight: mode === m ? 600 : 400,
                color: mode === m ? C.orange : C.textSub,
                textTransform: "capitalize",
              }}
            >
              {m}
            </button>
          ))}
        </div>
        {mode === "prompt" && (
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            placeholder="e.g. Explain the water cycle with animations showing evaporation, condensation, and precipitation…"
            style={{
              width: "100%",
              background: C.surfaceAlt,
              border: `1px solid ${C.border}`,
              borderRadius: 6,
              padding: "0.75rem",
              color: C.text,
              fontFamily: F.body,
              fontSize: "0.875rem",
              lineHeight: 1.6,
              resize: "vertical",
              transition: "border-color 0.15s",
            }}
            onFocus={(e) => (e.target.style.borderColor = C.borderMed)}
            onBlur={(e) => (e.target.style.borderColor = C.border)}
          />
        )}
        {mode === "document" && (
          <div
            style={{
              height: 110,
              background: C.surfaceAlt,
              border: `2px dashed ${C.border}`,
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.6rem",
              cursor: "pointer",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLDivElement).style.borderColor =
                C.borderMed)
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLDivElement).style.borderColor = C.border)
            }
          >
            <svg viewBox="0 0 16 16" width="16" fill="none">
              <path
                d="M8 10V3M5 6l3-3 3 3"
                stroke={C.textMuted}
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 12h10"
                stroke={C.textMuted}
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
            <span
              style={{
                fontFamily: F.body,
                fontSize: "0.875rem",
                color: C.textSub,
              }}
            >
              Drop a PDF or document here, or click to upload
            </span>
          </div>
        )}
        {mode === "topic" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.75rem",
            }}
          >
            {[
              {
                placeholder: "Select subject…",
                opts: SUBJECTS.map((s) => s.name),
              },
              {
                placeholder: "Select chapter…",
                opts: [
                  "Quadratic Equations",
                  "Laws of Motion",
                  "Cell Division",
                  "Periodic Table",
                ],
              },
            ].map((sel, i) => (
              <select
                key={i}
                style={{
                  background: C.surfaceAlt,
                  border: `1px solid ${C.border}`,
                  borderRadius: 6,
                  padding: "0.55rem 0.75rem",
                  color: C.text,
                  fontFamily: F.body,
                  fontSize: "0.875rem",
                }}
              >
                <option>{sel.placeholder}</option>
                {sel.opts.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            ))}
          </div>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={label()}>Duration</span>
            {["60 sec", "3 min", "10 min"].map((d) => (
              <button
                key={d}
                onClick={() => setDur(d)}
                style={{
                  padding: "0.28rem 0.6rem",
                  background: dur === d ? C.orangeDim : "transparent",
                  border: `1px solid ${dur === d ? C.orangeBorder : C.border}`,
                  borderRadius: 4,
                  cursor: "pointer",
                  fontFamily: F.mono,
                  fontSize: "0.68rem",
                  color: dur === d ? C.orange : C.textMuted,
                }}
              >
                {d}
              </button>
            ))}
          </div>
          <button style={BTN.primary}>Generate Video →</button>
        </div>
      </div>

      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <SHead title="Your Library" />
          <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setSubFilter(sub)}
                style={{
                  padding: "0.25rem 0.6rem",
                  background: subFilter === sub ? C.orangeDim : "transparent",
                  border: `1px solid ${subFilter === sub ? C.orangeBorder : C.border}`,
                  borderRadius: 4,
                  cursor: "pointer",
                  fontFamily: F.body,
                  fontSize: "0.75rem",
                  color: subFilter === sub ? C.orange : C.textMuted,
                }}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: "1rem",
          }}
        >
          {filtered.map((v) => {
            const sub = SUBJECTS.find((s) => s.name === v.subject);
            const col = sub?.color || C.orange;
            return (
              <div
                key={v.id}
                style={{
                  ...card({ padding: 0, overflow: "hidden" }),
                  cursor: "pointer",
                  transition: "border-color 0.15s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.borderColor =
                    C.borderMed)
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.borderColor =
                    C.border)
                }
              >
                <div
                  style={{
                    height: 108,
                    background: `${col}0c`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "rgba(0,0,0,0.55)",
                      border: `1px solid ${col}45`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg viewBox="0 0 12 12" width="11" fill="none">
                      <path d="M2.5 2l8 4-8 4V2z" fill={col} />
                    </svg>
                  </div>
                  <span
                    style={{
                      position: "absolute",
                      bottom: 7,
                      right: 8,
                      fontFamily: F.mono,
                      fontSize: "0.62rem",
                      color: C.textSub,
                      background: "rgba(0,0,0,0.55)",
                      padding: "0.1rem 0.3rem",
                      borderRadius: 3,
                    }}
                  >
                    {v.duration}
                  </span>
                  {v.generated && (
                    <span
                      style={{
                        position: "absolute",
                        top: 7,
                        left: 8,
                        ...tag(C.orange),
                        fontSize: "0.58rem",
                      }}
                    >
                      AI
                    </span>
                  )}
                </div>
                <div style={{ padding: "0.8rem 0.9rem" }}>
                  <div
                    style={{
                      fontFamily: F.body,
                      fontSize: "0.83rem",
                      fontWeight: 500,
                      color: C.text,
                      marginBottom: "0.3rem",
                      lineHeight: 1.35,
                    }}
                  >
                    {v.title}
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span
                      style={{
                        fontFamily: F.body,
                        fontSize: "0.7rem",
                        color: C.textMuted,
                      }}
                    >
                      {v.subject}
                    </span>
                    <span
                      style={{
                        fontFamily: F.body,
                        fontSize: "0.7rem",
                        color: C.textMuted,
                      }}
                    >
                      {v.date}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE: QUIZZES
// ─────────────────────────────────────────────────────────────────────────────
function PageQuizzes() {
  const [active, setActive] = useState(false);
  const [qi, setQi] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const QS = [
    {
      q: "What is the discriminant of ax²+bx+c=0?",
      opts: ["b²–2ac", "b²–4ac", "2b–4ac", "b+4ac"],
      ans: 1,
    },
    {
      q: "If the discriminant is negative, the roots are:",
      opts: [
        "Two real roots",
        "One real root",
        "Complex/imaginary roots",
        "Equal roots",
      ],
      ans: 2,
    },
    {
      q: "Which method writes ax²+bx+c as a(x–p)(x–q)?",
      opts: ["Completing the square", "The formula", "Factoring", "Graphing"],
      ans: 2,
    },
  ];

  if (active) {
    const q = QS[qi];
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          maxWidth: 680,
          margin: "0 auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            onClick={() => {
              setActive(false);
              setQi(0);
              setSel(null);
              setDone(false);
            }}
            style={BTN.ghost}
          >
            ← Exit Quiz
          </button>
          <span style={label()}>Mathematics · Quadratic Equations</span>
          <span style={{ ...label(), marginLeft: "auto" }}>
            Q {qi + 1} / {QS.length}
          </span>
        </div>
        <div style={progressBar(((qi + 1) / QS.length) * 100, C.orange).track}>
          <div
            style={progressBar(((qi + 1) / QS.length) * 100, C.orange).fill}
          />
        </div>
        <div style={card()}>
          <p
            style={{
              fontFamily: F.body,
              fontSize: "1rem",
              fontWeight: 500,
              color: C.text,
              lineHeight: 1.55,
              marginBottom: "1.5rem",
              marginTop: 0,
            }}
          >
            {q.q}
          </p>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}
          >
            {q.opts.map((opt, i) => {
              let bg = C.surfaceAlt,
                border = C.border,
                color = C.text;
              if (done) {
                if (i === q.ans) {
                  bg = "rgba(34,197,94,0.1)";
                  border = "rgba(34,197,94,0.3)";
                  color = C.green;
                } else if (i === sel) {
                  bg = "rgba(239,68,68,0.1)";
                  border = "rgba(239,68,68,0.3)";
                  color = C.red;
                }
              } else if (sel === i) {
                bg = C.orangeDim;
                border = C.orangeBorder;
                color = C.orange;
              }
              return (
                <button
                  key={i}
                  onClick={() => !done && setSel(i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.85rem",
                    padding: "0.75rem 1rem",
                    background: bg,
                    border: `1px solid ${border}`,
                    borderRadius: 6,
                    cursor: done ? "default" : "pointer",
                    textAlign: "left",
                    fontFamily: F.body,
                    fontSize: "0.875rem",
                    color,
                    transition: "all 0.15s",
                    width: "100%",
                  }}
                >
                  <span
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: `${border}25`,
                      border: `1px solid ${border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: F.mono,
                      fontSize: "0.68rem",
                      flexShrink: 0,
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
          {done && (
            <div
              style={{
                marginTop: "1rem",
                padding: "0.75rem 1rem",
                background:
                  sel === q.ans
                    ? "rgba(34,197,94,0.08)"
                    : "rgba(239,68,68,0.08)",
                border: `1px solid ${sel === q.ans ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
                borderRadius: 6,
              }}
            >
              <p
                style={{
                  fontFamily: F.body,
                  fontSize: "0.85rem",
                  color: sel === q.ans ? C.green : C.red,
                  margin: 0,
                }}
              >
                {sel === q.ans ? "✓ Correct! " : "✗ Incorrect. "}
                <span style={{ color: C.textSub }}>
                  The discriminant b²−4ac determines the nature of roots.
                </span>
              </p>
            </div>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "1.25rem",
            }}
          >
            {!done ? (
              <button
                onClick={() => sel !== null && setDone(true)}
                style={{ ...BTN.primary, opacity: sel === null ? 0.5 : 1 }}
                disabled={sel === null}
              >
                Check Answer
              </button>
            ) : qi < QS.length - 1 ? (
              <button
                onClick={() => {
                  setQi((i) => i + 1);
                  setSel(null);
                  setDone(false);
                }}
                style={BTN.primary}
              >
                Next Question →
              </button>
            ) : (
              <button
                onClick={() => {
                  setActive(false);
                  setQi(0);
                  setSel(null);
                  setDone(false);
                }}
                style={BTN.primary}
              >
                Finish Quiz ✓
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      <PHead
        title="Quizzes"
        sub="Test your knowledge. Adaptive questions adjust to your level as you improve."
      />

      <div style={card()}>
        <h2
          style={{
            fontFamily: F.head,
            fontSize: "1.05rem",
            fontWeight: 600,
            color: C.text,
            margin: "0 0 1rem",
          }}
        >
          Start a Quiz
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: "0.85rem",
          }}
        >
          {SUBJECTS.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setActive(true)}
              style={{
                ...card({ padding: "0.875rem 1rem" }),
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s",
                width: "100%",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  `${sub.color}45`;
                (e.currentTarget as HTMLButtonElement).style.background =
                  `${sub.color}05`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  C.border;
                (e.currentTarget as HTMLButtonElement).style.background =
                  C.surface;
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.65rem",
                }}
              >
                <span
                  style={{
                    fontFamily: F.body,
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    color: C.text,
                  }}
                >
                  {sub.name}
                </span>
                <svg viewBox="0 0 12 12" width="10" fill="none">
                  <path d="M2.5 2l8 4-8 4V2z" fill={sub.color} />
                </svg>
              </div>
              <div
                style={{
                  fontFamily: F.body,
                  fontSize: "0.75rem",
                  color: C.textMuted,
                  marginBottom: "0.6rem",
                }}
              >
                {sub.chapter}
              </div>
              <div style={progressBar(sub.pct, sub.color, 3).track}>
                <div style={progressBar(sub.pct, sub.color, 3).fill} />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "0.4rem",
                }}
              >
                <span
                  style={{
                    fontFamily: F.body,
                    fontSize: "0.7rem",
                    color: C.textMuted,
                  }}
                >
                  20 questions
                </span>
                <span
                  style={{
                    fontFamily: F.mono,
                    fontSize: "0.65rem",
                    color: sub.color,
                  }}
                >
                  {sub.pct}%
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div style={card()}>
        <SHead title="Quiz History" />
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "1rem",
          }}
        >
          <thead>
            <tr>
              {[
                "Subject",
                "Topics",
                "Score",
                "Accuracy",
                "Duration",
                "Date",
                "",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    ...label(),
                    textAlign: "left",
                    padding: "0 1rem 0.65rem 0",
                    borderBottom: `1px solid ${C.border}`,
                    fontWeight: 500,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {QUIZZES.map((q) => {
              const pct = Math.round((q.score / q.total) * 100);
              const col = pct >= 90 ? C.green : pct >= 70 ? C.yellow : C.red;
              return (
                <tr
                  key={q.id}
                  style={{ borderBottom: `1px solid ${C.border}` }}
                >
                  <td
                    style={{
                      padding: "0.7rem 1rem 0.7rem 0",
                      fontFamily: F.body,
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: C.text,
                    }}
                  >
                    {q.subject}
                  </td>
                  <td style={{ padding: "0.7rem 1rem 0.7rem 0" }}>
                    <div style={{ display: "flex", gap: "0.3rem" }}>
                      {q.topics.map((t) => (
                        <span
                          key={t}
                          style={{ ...tag(C.textMuted), fontSize: "0.6rem" }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "0.7rem 1rem 0.7rem 0",
                      fontFamily: F.mono,
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: col,
                    }}
                  >
                    {q.score}/{q.total}
                  </td>
                  <td style={{ padding: "0.7rem 1rem 0.7rem 0" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <div
                        style={{ width: 52, ...progressBar(pct, col, 3).track }}
                      >
                        <div style={progressBar(pct, col, 3).fill} />
                      </div>
                      <span
                        style={{
                          fontFamily: F.mono,
                          fontSize: "0.7rem",
                          color: col,
                        }}
                      >
                        {pct}%
                      </span>
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "0.7rem 1rem 0.7rem 0",
                      fontFamily: F.body,
                      fontSize: "0.78rem",
                      color: C.textMuted,
                    }}
                  >
                    {q.duration}
                  </td>
                  <td
                    style={{
                      padding: "0.7rem 1rem 0.7rem 0",
                      fontFamily: F.body,
                      fontSize: "0.78rem",
                      color: C.textMuted,
                    }}
                  >
                    {q.date}
                  </td>
                  <td style={{ padding: "0.7rem 0" }}>
                    <button
                      onClick={() => setActive(true)}
                      style={{
                        ...BTN.ghost,
                        padding: "0.3rem 0.65rem",
                        fontSize: "0.75rem",
                        borderRadius: 4,
                      }}
                    >
                      Retry
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE: NOTES
// ─────────────────────────────────────────────────────────────────────────────
function PageNotes() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<number | null>(null);
  const subjects = ["All", ...Array.from(new Set(NOTES.map((n) => n.subject)))];
  const filtered = NOTES.filter(
    (n) =>
      (filter === "All" || n.subject === filter) &&
      (n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.body.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
        <PHead
          title="Notes"
          sub="Your saved session notes and personal annotations, all in one place."
        />
        <button
          style={{ ...BTN.primary, flexShrink: 0, marginBottom: "0.25rem" }}
        >
          + New Note
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
          <svg
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              opacity: 0.4,
            }}
            viewBox="0 0 16 16"
            width="14"
            fill="none"
          >
            <circle cx="7" cy="7" r="5" stroke={C.textSub} strokeWidth="1.2" />
            <path
              d="M11 11l3 3"
              stroke={C.textSub}
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes…"
            style={{
              width: "100%",
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 6,
              padding: "0.5rem 0.75rem 0.5rem 2rem",
              color: C.text,
              fontFamily: F.body,
              fontSize: "0.875rem",
            }}
          />
        </div>
        <div style={{ display: "flex", gap: "0.35rem" }}>
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setFilter(sub)}
              style={{
                padding: "0.35rem 0.7rem",
                borderRadius: 5,
                cursor: "pointer",
                background: filter === sub ? C.orangeDim : "transparent",
                border: `1px solid ${filter === sub ? C.orangeBorder : C.border}`,
                fontFamily: F.body,
                fontSize: "0.78rem",
                color: filter === sub ? C.orange : C.textMuted,
              }}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "1rem",
        }}
      >
        {filtered.map((n) => {
          const sub = SUBJECTS.find((s) => s.name === n.subject);
          const isEd = editing === n.id;
          return (
            <div
              key={n.id}
              style={{
                ...card({
                  borderTopWidth: 2,
                  borderTopColor: sub?.color || C.orange,
                }),
                display: "flex",
                flexDirection: "column",
                gap: "0.65rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "0.5rem",
                }}
              >
                <div>
                  {n.pinned && (
                    <span
                      style={{
                        ...tag(C.yellow),
                        fontSize: "0.58rem",
                        marginBottom: "0.35rem",
                        display: "inline-flex",
                      }}
                    >
                      Pinned
                    </span>
                  )}
                  <h3
                    style={{
                      fontFamily: F.body,
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: C.text,
                      margin: 0,
                      lineHeight: 1.3,
                    }}
                  >
                    {n.title}
                  </h3>
                </div>
                <button
                  onClick={() => setEditing(isEd ? null : n.id)}
                  style={{
                    ...BTN.ghost,
                    padding: "0.22rem 0.5rem",
                    fontSize: "0.72rem",
                    borderRadius: 4,
                    flexShrink: 0,
                  }}
                >
                  {isEd ? "Done" : "Edit"}
                </button>
              </div>
              {isEd ? (
                <textarea
                  defaultValue={n.body}
                  rows={4}
                  style={{
                    background: C.surfaceAlt,
                    border: `1px solid ${C.borderMed}`,
                    borderRadius: 5,
                    padding: "0.55rem 0.7rem",
                    color: C.text,
                    fontFamily: F.body,
                    fontSize: "0.82rem",
                    lineHeight: 1.6,
                    resize: "vertical",
                    width: "100%",
                  }}
                />
              ) : (
                <p
                  style={{
                    fontFamily: F.body,
                    fontSize: "0.82rem",
                    color: C.textSub,
                    margin: 0,
                    lineHeight: 1.65,
                  }}
                >
                  {n.body}
                </p>
              )}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: "auto",
                }}
              >
                <div style={{ display: "flex", gap: "0.35rem" }}>
                  <span style={tag(sub?.color || C.orange)}>{n.subject}</span>
                  <span style={tag(C.textMuted)}>{n.tag}</span>
                </div>
                <span
                  style={{
                    fontFamily: F.body,
                    fontSize: "0.68rem",
                    color: C.textMuted,
                  }}
                >
                  {n.date}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE: SETTINGS
// ─────────────────────────────────────────────────────────────────────────────
function PageSettings() {
  const [name, setName] = useState("Arjun Sharma");
  const [email, setEmail] = useState("arjun@schoolme.app");
  const [cls, setCls] = useState("Class X");
  const [goal, setGoal] = useState(45);
  const [notifs, setNotifs] = useState({
    quiz: true,
    streak: true,
    weekly: false,
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.75rem",
        maxWidth: 660,
      }}
    >
      <PHead
        title="Settings"
        sub="Manage your profile, learning preferences, and notifications."
      />

      <div style={card()}>
        <SHead title="Profile" />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.25rem",
            margin: "1.25rem 0",
          }}
        >
          <div
            style={{
              width: 62,
              height: 62,
              borderRadius: "50%",
              background: C.orangeDim,
              border: `2px solid ${C.orange}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: F.head,
                fontSize: "1.4rem",
                fontWeight: 700,
                color: C.orange,
              }}
            >
              A
            </span>
          </div>
          <div>
            <div
              style={{
                fontFamily: F.body,
                fontSize: "1rem",
                fontWeight: 600,
                color: C.text,
                marginBottom: "0.15rem",
              }}
            >
              Arjun Sharma
            </div>
            <div
              style={{
                fontFamily: F.body,
                fontSize: "0.78rem",
                color: C.textMuted,
              }}
            >
              Class X · Science stream
            </div>
          </div>
          <button style={{ ...BTN.ghost, marginLeft: "auto" }}>
            Change Photo
          </button>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          {(
            [
              { l: "Full Name", v: name, s: setName },
              { l: "Email", v: email, s: setEmail },
            ] as { l: string; v: string; s: (v: string) => void }[]
          ).map((f) => (
            <div key={f.l}>
              <label
                style={{ ...label(), display: "block", marginBottom: "0.4rem" }}
              >
                {f.l}
              </label>
              <input
                value={f.v}
                onChange={(e) => f.s(e.target.value)}
                style={{
                  width: "100%",
                  background: C.surfaceAlt,
                  border: `1px solid ${C.border}`,
                  borderRadius: 6,
                  padding: "0.55rem 0.75rem",
                  color: C.text,
                  fontFamily: F.body,
                  fontSize: "0.875rem",
                }}
              />
            </div>
          ))}
          <div>
            <label
              style={{ ...label(), display: "block", marginBottom: "0.4rem" }}
            >
              Class
            </label>
            <select
              value={cls}
              onChange={(e) => setCls(e.target.value)}
              style={{
                width: "100%",
                background: C.surfaceAlt,
                border: `1px solid ${C.border}`,
                borderRadius: 6,
                padding: "0.55rem 0.75rem",
                color: C.text,
                fontFamily: F.body,
                fontSize: "0.875rem",
              }}
            >
              {Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`).map(
                (c) => (
                  <option key={c}>{c}</option>
                ),
              )}
            </select>
          </div>
        </div>
      </div>

      <div style={card()}>
        <SHead title="Daily Study Goal" />
        <div style={{ marginTop: "1.25rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.65rem",
            }}
          >
            <span
              style={{
                fontFamily: F.body,
                fontSize: "0.875rem",
                color: C.text,
              }}
            >
              Target study time per day
            </span>
            <span
              style={{
                fontFamily: F.mono,
                fontSize: "0.9rem",
                fontWeight: 600,
                color: C.orange,
              }}
            >
              {goal} min
            </span>
          </div>
          <input
            type="range"
            min={10}
            max={180}
            step={5}
            value={goal}
            onChange={(e) => setGoal(+e.target.value)}
            style={{ width: "100%", accentColor: C.orange, cursor: "pointer" }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "0.25rem",
            }}
          >
            <span
              style={{
                fontFamily: F.body,
                fontSize: "0.72rem",
                color: C.textMuted,
              }}
            >
              10 min
            </span>
            <span
              style={{
                fontFamily: F.body,
                fontSize: "0.72rem",
                color: C.textMuted,
              }}
            >
              180 min
            </span>
          </div>
        </div>
      </div>

      <div style={card()}>
        <SHead title="Active Subjects" />
        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {SUBJECTS.map((sub, i) => (
            <div
              key={sub.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.85rem",
                padding: "0.65rem 0",
                borderBottom:
                  i < SUBJECTS.length - 1 ? `1px solid ${C.border}` : "none",
              }}
            >
              <div
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: sub.color,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: F.body,
                  fontSize: "0.875rem",
                  flex: 1,
                  color: C.text,
                }}
              >
                {sub.name}
              </span>
              <span
                style={{
                  fontFamily: F.body,
                  fontSize: "0.75rem",
                  color: C.textMuted,
                }}
              >
                {sub.chapter}
              </span>
              <input
                type="checkbox"
                defaultChecked
                style={{
                  accentColor: C.orange,
                  width: 15,
                  height: 15,
                  cursor: "pointer",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div style={card()}>
        <SHead title="Notifications" />
        <div style={{ marginTop: "0.75rem" }}>
          {[
            {
              k: "quiz" as const,
              l: "Quiz reminders",
              s: "Get notified when a quiz is due",
            },
            {
              k: "streak" as const,
              l: "Streak alerts",
              s: "Don't break your study streak",
            },
            {
              k: "weekly" as const,
              l: "Weekly progress report",
              s: "Summary of your week, every Sunday",
            },
          ].map((n, i, arr) => (
            <div
              key={n.k}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "0.85rem 0",
                borderBottom:
                  i < arr.length - 1 ? `1px solid ${C.border}` : "none",
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: F.body,
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: C.text,
                    marginBottom: "0.15rem",
                  }}
                >
                  {n.l}
                </div>
                <div
                  style={{
                    fontFamily: F.body,
                    fontSize: "0.75rem",
                    color: C.textMuted,
                  }}
                >
                  {n.s}
                </div>
              </div>
              <button
                onClick={() => setNotifs((v) => ({ ...v, [n.k]: !v[n.k] }))}
                style={{
                  width: 42,
                  height: 24,
                  borderRadius: 12,
                  border: "none",
                  cursor: "pointer",
                  background: notifs[n.k] ? C.orange : "rgba(255,255,255,0.1)",
                  position: "relative",
                  transition: "background 0.2s",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 3,
                    left: notifs[n.k] ? "calc(100% - 20px)" : 3,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "#fff",
                    transition: "left 0.2s",
                  }}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        style={{
          ...BTN.primary,
          alignSelf: "flex-start",
          padding: "0.6rem 1.5rem",
        }}
      >
        Save Changes
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SMALL SHARED COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function PHead({ title, sub }: { title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: "0.25rem" }}>
      <h1
        style={{
          fontFamily: F.head,
          fontSize: "1.5rem",
          fontWeight: 700,
          color: C.text,
          margin: "0 0 0.3rem",
        }}
      >
        {title}
      </h1>
      {sub && (
        <p
          style={{
            fontFamily: F.body,
            fontSize: "0.875rem",
            color: C.textSub,
            margin: 0,
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}
function SHead({
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
          fontSize: "0.875rem",
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
            ...BTN.ghost,
            padding: "0.25rem 0.6rem",
            fontSize: "0.78rem",
            borderRadius: 4,
          }}
        >
          {action}
        </button>
      )}
    </div>
  );
}
function BookSvg({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="none">
      <rect
        x="2"
        y="2"
        width="12"
        height="12"
        rx="2"
        stroke={color}
        strokeWidth="1.2"
      />
      <path
        d="M5 6h6M5 9h4"
        stroke={color}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}
function ChevR() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="13"
      height="13"
      fill="none"
      style={{ flexShrink: 0, color: C.textMuted }}
    >
      <path
        d="M6 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function aColor(type: string, alpha: string) {
  const m: Record<string, string> = {
    quiz: C.green,
    video: C.blue,
    note: C.yellow,
    lesson: C.orange,
  };
  return (m[type] || C.orange) + alpha;
}
function AIco({ type }: { type: string }) {
  const col =
    { quiz: C.green, video: C.blue, note: C.yellow, lesson: C.orange }[type] ||
    C.orange;
  return (
    <svg viewBox="0 0 12 12" width="10" height="10" fill="none">
      {type === "quiz" && (
        <path
          d="M2 6h8M6 2v8"
          stroke={col}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      )}
      {type === "video" && <path d="M2 2l9 4-9 4V2z" fill={col} />}
      {type === "note" && (
        <>
          <rect
            x="1.5"
            y="1.5"
            width="9"
            height="9"
            rx="1"
            stroke={col}
            strokeWidth="0.9"
          />
          <path
            d="M3.5 4.5h5M3.5 7h3"
            stroke={col}
            strokeWidth="0.9"
            strokeLinecap="round"
          />
        </>
      )}
      {type === "lesson" && (
        <>
          <circle cx="6" cy="4" r="2.5" stroke={col} strokeWidth="1" />
          <path d="M2 10 Q6 8 10 10" stroke={col} strokeWidth="1" fill="none" />
        </>
      )}
    </svg>
  );
}
function NavIcon({ id }: { id: Page }) {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="none">
      {id === "home" && (
        <path
          d="M2 7l6-5 6 5v7H10V9H6v5H2V7z"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
      )}
      {id === "subjects" && (
        <>
          <rect
            x="2"
            y="2"
            width="12"
            height="12"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.1"
          />
          <path
            d="M5 6h6M5 9h4"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </>
      )}
      {id === "ai-teacher" && (
        <>
          <rect
            x="2"
            y="5"
            width="12"
            height="9"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.1"
          />
          <circle cx="5.5" cy="9.5" r="1.2" fill="currentColor" />
          <circle cx="10.5" cy="9.5" r="1.2" fill="currentColor" />
          <path
            d="M8 2v3M6 14v1M10 14v1"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </>
      )}
      {id === "videos" && (
        <>
          <rect
            x="1"
            y="3"
            width="10"
            height="10"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.1"
          />
          <path
            d="M11 6.5l4-2v7l-4-2V6.5z"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
        </>
      )}
      {id === "quizzes" && (
        <>
          <circle
            cx="8"
            cy="8"
            r="6.5"
            stroke="currentColor"
            strokeWidth="1.1"
          />
          <path
            d="M6 6a2 2 0 114 0c0 1.5-2 1.5-2 3"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
          <circle cx="8" cy="12" r=".8" fill="currentColor" />
        </>
      )}
      {id === "notes" && (
        <>
          <path
            d="M3 2h7l3 3v9H3V2z"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
          <path
            d="M10 2v3h3M5 7h6M5 10h4"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </>
      )}
      {id === "settings" && (
        <>
          <circle
            cx="8"
            cy="8"
            r="2.5"
            stroke="currentColor"
            strokeWidth="1.1"
          />
          <path
            d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}
