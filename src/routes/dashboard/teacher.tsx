import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/dashboard/teacher")({
  component: TeacherDashboard,
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
  blue: "#3b82f6",
  purple: "#a855f7",
  amber: "#f59e0b",
  red: "#ef4444",
  teal: "#14b8a6",
};

type TeacherPage =
  | "dashboard"
  | "generate"
  | "library"
  | "upload"
  | "materials"
  | "classes";

// ─── Data ─────────────────────────────────────────────────────────────────────
const RECENT_MATERIALS = [
  {
    id: "m1",
    title: "Laws of Motion — Worksheet",
    type: "Worksheet",
    subject: "Physics",
    cls: "Class 10-A",
    date: "2 hours ago",
  },
  {
    id: "m2",
    title: "Thermodynamics Quiz",
    type: "Quiz",
    subject: "Physics",
    cls: "Class 10-B",
    date: "Yesterday",
  },
  {
    id: "m3",
    title: "Quadratic Equations Practice Set",
    type: "Practice Set",
    subject: "Mathematics",
    cls: "Class 11-A",
    date: "2 days ago",
  },
  {
    id: "m4",
    title: "Electromagnetic Induction — Lesson Plan",
    type: "Lesson Plan",
    subject: "Physics",
    cls: "Class 10-A",
    date: "3 days ago",
  },
  {
    id: "m5",
    title: "Probability Basics — Handout",
    type: "Handout",
    subject: "Mathematics",
    cls: "Class 11-B",
    date: "4 days ago",
  },
];

const SUGGESTIONS = [
  {
    id: "s1",
    topic: "Wave Optics — Interference & Diffraction",
    subject: "Physics",
    reason: "Upcoming in Class 10-A syllabus",
    color: C.purple,
  },
  {
    id: "s2",
    topic: "Integration by Parts",
    subject: "Mathematics",
    reason: "Students scored low on last quiz",
    color: C.blue,
  },
  {
    id: "s3",
    topic: "Thermal Properties of Matter",
    subject: "Physics",
    reason: "Trending topic this month",
    color: C.orange,
  },
];

const WEEKLY_DATA = [
  { day: "M", v: 4 },
  { day: "T", v: 7 },
  { day: "W", v: 3 },
  { day: "T", v: 8 },
  { day: "F", v: 12 },
  { day: "S", v: 6 },
  { day: "S", v: 2 },
];

const TYPE_BADGE: Record<
  string,
  { bg: string; color: string; border: string }
> = {
  Worksheet: {
    bg: "rgba(242,116,13,0.10)",
    color: C.orange,
    border: "rgba(242,116,13,0.25)",
  },
  Quiz: {
    bg: "rgba(59,130,246,0.10)",
    color: C.blue,
    border: "rgba(59,130,246,0.25)",
  },
  "Lesson Plan": {
    bg: "rgba(34,197,94,0.10)",
    color: C.green,
    border: "rgba(34,197,94,0.25)",
  },
  "Practice Set": {
    bg: "rgba(168,85,247,0.10)",
    color: C.purple,
    border: "rgba(168,85,247,0.25)",
  },
  Handout: {
    bg: "rgba(245,158,11,0.10)",
    color: C.amber,
    border: "rgba(245,158,11,0.25)",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function greet() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}
function fmtDate() {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
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

function Tag({
  color,
  border,
  bg,
  children,
}: {
  color: string;
  border: string;
  bg: string;
  children: React.ReactNode;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontFamily: F.mono,
        fontSize: "0.62rem",
        fontWeight: 500,
        color,
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 4,
        padding: "0.1rem 0.45rem",
      }}
    >
      {children}
    </span>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function TopNav({
  page,
  setPage,
}: {
  page: TeacherPage;
  setPage: (p: TeacherPage) => void;
}) {
  const NAV: { id: TeacherPage; label: string }[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "generate", label: "Generate Content" },
    { id: "library", label: "Content Library" },
    { id: "classes", label: "My Classes" },
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
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <button
          onClick={() => setPage("generate")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            background: C.orange,
            color: "#fff",
            fontFamily: F.body,
            fontSize: "0.85rem",
            fontWeight: 600,
            border: "none",
            borderRadius: 7,
            padding: "0.45rem 1rem",
            cursor: "pointer",
          }}
        >
          <SparklesSvg color="#fff" size={13} /> Generate Content
        </button>
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
          }}
        >
          PJ
        </div>
      </div>
    </nav>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
function TeacherDashboard() {
  const [page, setPage] = useState<TeacherPage>("dashboard");
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text }}>
      <style>{`
        *{box-sizing:border-box}body{margin:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:4px}
        input,textarea,select{outline:none;color-scheme:dark}
        input::placeholder,textarea::placeholder{color:${C.textMuted}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes barIn{from{transform:scaleY(0)}to{transform:scaleY(1)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .page{animation:fadeUp 0.22s ease forwards}
      `}</style>
      {/* Background */}
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
            width: 500,
            height: 500,
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
            width: 380,
            height: 380,
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
      <div style={{ position: "relative", zIndex: 1 }}>
        <TopNav page={page} setPage={setPage} />
        <div
          className="page"
          key={page}
          style={{ padding: "2rem 2.5rem", maxWidth: 1100, margin: "0 auto" }}
        >
          {page === "dashboard" && <PageDashboard setPage={setPage} />}
          {page === "generate" && <PageGenerate />}
          {page === "library" && <PageLibrary />}
          {page === "classes" && <PageClasses />}
          {page === "upload" && <PageUpload />}
          {page === "materials" && <PageMaterialDetail />}
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE: DASHBOARD
// ═════════════════════════════════════════════════════════════════════════════
function PageDashboard({ setPage }: { setPage: (p: TeacherPage) => void }) {
  const weeklyMax = Math.max(...WEEKLY_DATA.map((d) => d.v));
  const weeklyTotal = WEEKLY_DATA.reduce((s, d) => s + d.v, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Greeting row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
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
            Here's what's happening with your content today.
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
        <p
          style={{
            fontFamily: F.body,
            fontSize: "0.82rem",
            color: C.textMuted,
          }}
        >
          {fmtDate()}
        </p>
      </div>

      {/* Quick actions */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "1rem",
        }}
      >
        {[
          {
            label: "Generate Content",
            sub: "Create worksheets, quizzes & plans with AI",
            page: "generate" as TeacherPage,
            icon: <SparklesSvg color={C.orange} size={18} />,
          },
          {
            label: "Upload PDF",
            sub: "Import existing materials to your library",
            page: "upload" as TeacherPage,
            icon: <UploadSvg />,
          },
          {
            label: "Browse Library",
            sub: "Explore NCERT-aligned content",
            page: "library" as TeacherPage,
            icon: <LibSvg />,
          },
        ].map((a, i) => {
          const [hov, setHov] = useState(false);
          return (
            <div
              key={i}
              onClick={() => setPage(a.page)}
              onMouseEnter={() => setHov(true)}
              onMouseLeave={() => setHov(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.875rem",
                padding: "0.875rem 1.1rem",
                background: C.surface,
                border: `1px solid ${hov ? C.borderHov : C.border}`,
                borderRadius: 12,
                cursor: "pointer",
                transition: "all 0.15s",
                transform: hov ? "translateY(-2px)" : "none",
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 8,
                  background: C.orangeDim,
                  border: `1px solid ${C.orangeBdr}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {a.icon}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: F.body,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: hov ? C.orange : C.text,
                    transition: "color 0.15s",
                  }}
                >
                  {a.label}
                </div>
                <div
                  style={{
                    fontFamily: F.body,
                    fontSize: "0.72rem",
                    color: C.textMuted,
                    marginTop: 2,
                  }}
                >
                  {a.sub}
                </div>
              </div>
              <svg
                viewBox="0 0 16 16"
                width="13"
                fill="none"
                style={{
                  marginLeft: "auto",
                  color: hov ? C.orange : C.textMuted,
                  transition: "color 0.15s",
                  flexShrink: 0,
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
      </div>

      {/* Bento row: Recent Materials (left) + Suggested (right) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr",
          gap: "1rem",
        }}
      >
        {/* Recent materials */}
        <Card style={{ padding: "1.3rem 1.4rem" }}>
          <SHead
            title="Recent Materials"
            action="View all"
            onAction={() => setPage("library")}
          />
          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.4rem",
            }}
          >
            {RECENT_MATERIALS.map((m) => {
              const [hov, setHov] = useState(false);
              const badge = TYPE_BADGE[m.type] ?? {
                bg: C.orangeDim,
                color: C.orange,
                border: C.orangeBdr,
              };
              return (
                <div
                  key={m.id}
                  onMouseEnter={() => setHov(true)}
                  onMouseLeave={() => setHov(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.875rem",
                    padding: "0.7rem 0.9rem",
                    background: hov ? C.surfaceB : "rgba(255,255,255,0.02)",
                    border: `1px solid ${hov ? C.borderHov : C.border}`,
                    borderRadius: 8,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 7,
                      background: C.surfaceB,
                      border: `1px solid ${C.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <DocSvg color={hov ? C.orange : C.textMuted} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: F.body,
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: hov ? C.orange : C.text,
                        transition: "color 0.15s",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {m.title}
                    </div>
                    <div
                      style={{
                        fontFamily: F.body,
                        fontSize: "0.72rem",
                        color: C.textMuted,
                        marginTop: 2,
                      }}
                    >
                      {m.subject} · {m.cls}
                    </div>
                  </div>
                  <Tag color={badge.color} bg={badge.bg} border={badge.border}>
                    {m.type}
                  </Tag>
                  <span
                    style={{
                      fontFamily: F.body,
                      fontSize: "0.72rem",
                      color: C.textMuted,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <svg viewBox="0 0 12 12" width="10" fill="none">
                      <circle
                        cx="6"
                        cy="6"
                        r="4.5"
                        stroke="currentColor"
                        strokeWidth="1"
                      />
                      <path
                        d="M6 3.5v2.7l1.5 1.5"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                      />
                    </svg>
                    {m.date}
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
            })}
          </div>
        </Card>

        {/* Suggested content */}
        <Card style={{ padding: "1.3rem 1.4rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.25rem",
            }}
          >
            <svg viewBox="0 0 16 16" width="15" fill="none">
              <path
                d="M8 2a6 6 0 100 12A6 6 0 008 2z"
                stroke={C.orange}
                strokeWidth="1.2"
              />
              <path
                d="M8 5v3l2 2"
                stroke={C.orange}
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              style={{
                fontFamily: F.body,
                fontSize: "0.9rem",
                fontWeight: 600,
                color: C.text,
              }}
            >
              Suggested Content
            </span>
          </div>
          <p
            style={{
              fontFamily: F.body,
              fontSize: "0.78rem",
              color: C.textMuted,
              margin: "0.25rem 0 1rem",
            }}
          >
            AI-recommended topics based on your syllabus and student
            performance.
          </p>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {SUGGESTIONS.map((s) => {
              const [hov, setHov] = useState(false);
              return (
                <div
                  key={s.id}
                  onMouseEnter={() => setHov(true)}
                  onMouseLeave={() => setHov(false)}
                  style={{
                    padding: "0.875rem 1rem",
                    background: hov ? C.surfaceB : "rgba(255,255,255,0.02)",
                    border: `1px solid ${hov ? C.borderHov : C.border}`,
                    borderRadius: 10,
                    transition: "all 0.15s",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.7rem",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 7,
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
                    <div>
                      <div
                        style={{
                          fontFamily: F.body,
                          fontSize: "0.85rem",
                          fontWeight: 500,
                          color: C.text,
                        }}
                      >
                        {s.topic}
                      </div>
                      <div
                        style={{
                          fontFamily: F.body,
                          fontSize: "0.72rem",
                          color: C.textMuted,
                          marginTop: 2,
                        }}
                      >
                        {s.subject} · {s.reason}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setPage("generate")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.4rem",
                      width: "100%",
                      padding: "0.35rem",
                      background: C.orangeDim,
                      border: `1px solid ${C.orangeBdr}`,
                      borderRadius: 6,
                      fontFamily: F.body,
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: C.orange,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    <SparklesSvg color={C.orange} size={11} /> Generate
                  </button>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Bento row: Stats 2×2 + Weekly chart */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr",
          gap: "1rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          {[
            {
              label: "Classes",
              value: "4",
              desc: "Physics 10-A, 10-B, Math 11-A, 11-B",
              color: C.orange,
            },
            {
              label: "Materials Created",
              value: "87",
              desc: "Worksheets, quizzes & lesson plans",
              color: C.blue,
            },
            {
              label: "Generated This Week",
              value: "12",
              desc: "+3 from last week",
              color: C.teal,
              trend: "+33%",
            },
            {
              label: "Student Engagement",
              value: "94%",
              desc: "Across all classes",
              color: C.green,
              trend: "+2%",
            },
          ].map((st, i) => (
            <Card
              key={i}
              hover
              style={{
                padding: "1.3rem 1.4rem",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "0.85rem",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: `${st.color}12`,
                    border: `1px solid ${st.color}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: st.color,
                    }}
                  />
                </div>
                {st.trend && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 3,
                      fontFamily: F.mono,
                      fontSize: "0.62rem",
                      fontWeight: 600,
                      color: C.green,
                      background: C.greenDim,
                      border: "1px solid rgba(34,197,94,0.25)",
                      borderRadius: 10,
                      padding: "0.15rem 0.45rem",
                    }}
                  >
                    <svg viewBox="0 0 10 10" width="8" fill="none">
                      <path
                        d="M2 7l3-4 3 2 2-4"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {st.trend}
                  </span>
                )}
              </div>
              <div
                style={{
                  fontFamily: F.head,
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: C.text,
                  lineHeight: 1,
                  marginBottom: "0.3rem",
                }}
              >
                {st.value}
              </div>
              <div
                style={{
                  fontFamily: F.body,
                  fontSize: "0.82rem",
                  fontWeight: 500,
                  color: C.textSub,
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
                {st.desc}
              </div>
            </Card>
          ))}
        </div>

        {/* Weekly chart */}
        <Card
          style={{
            padding: "1.3rem 1.4rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
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
                Weekly Activity
              </div>
              <div
                style={{
                  fontFamily: F.body,
                  fontSize: "0.72rem",
                  color: C.textMuted,
                  marginTop: 2,
                }}
              >
                Materials generated this week
              </div>
            </div>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontFamily: F.mono,
                fontSize: "0.62rem",
                fontWeight: 600,
                color: C.orange,
                background: C.orangeDim,
                border: `1px solid ${C.orangeBdr}`,
                borderRadius: 10,
                padding: "0.15rem 0.5rem",
              }}
            >
              <svg viewBox="0 0 10 10" width="9" fill="none">
                <path
                  d="M5 1v4M1 5h8M5 9l3-3H2l3 3z"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {weeklyTotal} this week
            </span>
          </div>
          <WeeklyChart data={WEEKLY_DATA} max={weeklyMax} />
        </Card>
      </div>
    </div>
  );
}

function WeeklyChart({ data, max }: { data: typeof WEEKLY_DATA; max: number }) {
  const maxH = 100;
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: "0.4rem",
        paddingTop: "0.5rem",
      }}
    >
      {data.map((d, i) => {
        const h = (d.v / max) * maxH;
        return (
          <div
            key={i}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span
              style={{
                fontFamily: F.mono,
                fontSize: "0.58rem",
                color: C.orange,
                opacity: 0,
                transition: "opacity 0.15s",
              }}
              className="bar-label"
            >
              {d.v}
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
                  background: `linear-gradient(to top, ${C.orange}, #fb923c)`,
                  borderRadius: "3px 3px 0 0",
                  transformOrigin: "bottom",
                  animation: `barIn 0.6s ease ${0.35 + i * 0.06}s both`,
                }}
              />
            </div>
            <span
              style={{
                fontFamily: F.mono,
                fontSize: "0.6rem",
                color: C.textMuted,
              }}
            >
              {d.day}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE: GENERATE CONTENT
// ═════════════════════════════════════════════════════════════════════════════
function PageGenerate() {
  const [type, setType] = useState("Worksheet");
  const [subject, setSubject] = useState("Physics");
  const [cls, setCls] = useState("Class 10-A");
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("Standard");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        maxWidth: 780,
      }}
    >
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
          Generate Content
        </h1>
        <p
          style={{
            fontFamily: F.body,
            fontSize: "0.875rem",
            color: C.textSub,
            margin: 0,
          }}
        >
          Create worksheets, quizzes, and lesson plans with AI in seconds.
        </p>
      </div>

      <Card style={{ padding: "1.5rem 1.75rem" }}>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          {/* Type selector */}
          <div>
            <label
              style={{
                fontFamily: F.mono,
                fontSize: "0.68rem",
                fontWeight: 500,
                color: C.textMuted,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "0.6rem",
              }}
            >
              Content Type
            </label>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {[
                "Worksheet",
                "Quiz",
                "Lesson Plan",
                "Practice Set",
                "Handout",
              ].map((t) => (
                <Pill key={t} active={type === t} onClick={() => setType(t)}>
                  {t}
                </Pill>
              ))}
            </div>
          </div>

          {/* Subject + Class */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            {[
              {
                l: "Subject",
                v: subject,
                s: setSubject,
                opts: [
                  "Physics",
                  "Mathematics",
                  "Chemistry",
                  "Biology",
                  "English",
                  "Hindi",
                ],
              },
              {
                l: "Class",
                v: cls,
                s: setCls,
                opts: ["Class 10-A", "Class 10-B", "Class 11-A", "Class 11-B"],
              },
            ].map((f) => (
              <div key={f.l}>
                <label
                  style={{
                    fontFamily: F.mono,
                    fontSize: "0.68rem",
                    fontWeight: 500,
                    color: C.textMuted,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  {f.l}
                </label>
                <select
                  value={f.v}
                  onChange={(e) => f.s(e.target.value)}
                  style={{
                    width: "100%",
                    background: C.surfaceB,
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    padding: "0.6rem 0.75rem",
                    color: C.text,
                    fontFamily: F.body,
                    fontSize: "0.875rem",
                  }}
                >
                  {f.opts.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {/* Topic */}
          <div>
            <label
              style={{
                fontFamily: F.mono,
                fontSize: "0.68rem",
                fontWeight: 500,
                color: C.textMuted,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "0.5rem",
              }}
            >
              Topic / Chapter
            </label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Laws of Motion, Quadratic Equations…"
              style={{
                width: "100%",
                background: C.surfaceB,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: "0.6rem 0.75rem",
                color: C.text,
                fontFamily: F.body,
                fontSize: "0.875rem",
              }}
              onFocus={(e) => (e.target.style.borderColor = C.borderHov)}
              onBlur={(e) => (e.target.style.borderColor = C.border)}
            />
          </div>

          {/* Level */}
          <div>
            <label
              style={{
                fontFamily: F.mono,
                fontSize: "0.68rem",
                fontWeight: 500,
                color: C.textMuted,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "0.6rem",
              }}
            >
              Difficulty
            </label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {["Easy", "Standard", "Challenging", "Exam-Level"].map((l) => (
                <Pill key={l} active={level === l} onClick={() => setLevel(l)}>
                  {l}
                </Pill>
              ))}
            </div>
          </div>

          <button
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              background: C.orange,
              color: "#fff",
              fontFamily: F.body,
              fontSize: "0.9rem",
              fontWeight: 600,
              border: "none",
              borderRadius: 9,
              padding: "0.75rem",
              cursor: "pointer",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <SparklesSvg color="#fff" size={16} /> Generate {type}
          </button>
        </div>
      </Card>

      {/* Recent */}
      <div>
        <div
          style={{
            fontFamily: F.body,
            fontSize: "0.9rem",
            fontWeight: 600,
            color: C.text,
            marginBottom: "0.85rem",
          }}
        >
          Recently Generated
        </div>
        <Card style={{ overflow: "hidden" }}>
          {RECENT_MATERIALS.slice(0, 3).map((m, i) => {
            const badge = TYPE_BADGE[m.type] ?? {
              bg: C.orangeDim,
              color: C.orange,
              border: C.orangeBdr,
            };
            const [hov, setHov] = useState(false);
            return (
              <div
                key={m.id}
                onMouseEnter={() => setHov(true)}
                onMouseLeave={() => setHov(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.875rem",
                  padding: "0.875rem 1.2rem",
                  borderBottom: i < 2 ? `1px solid ${C.border}` : "none",
                  background: hov ? C.surfaceB : "transparent",
                  transition: "background 0.15s",
                  cursor: "pointer",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: F.body,
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: hov ? C.orange : C.text,
                      transition: "color 0.15s",
                    }}
                  >
                    {m.title}
                  </div>
                  <div
                    style={{
                      fontFamily: F.body,
                      fontSize: "0.72rem",
                      color: C.textMuted,
                      marginTop: 2,
                    }}
                  >
                    {m.subject} · {m.cls}
                  </div>
                </div>
                <Tag color={badge.color} bg={badge.bg} border={badge.border}>
                  {m.type}
                </Tag>
                <span
                  style={{
                    fontFamily: F.body,
                    fontSize: "0.72rem",
                    color: C.textMuted,
                  }}
                >
                  {m.date}
                </span>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE: CONTENT LIBRARY
// ═════════════════════════════════════════════════════════════════════════════
function PageLibrary() {
  const [filter, setFilter] = useState("All");
  const types = [
    "All",
    "Worksheet",
    "Quiz",
    "Lesson Plan",
    "Practice Set",
    "Handout",
  ];
  const filtered =
    filter === "All"
      ? RECENT_MATERIALS
      : RECENT_MATERIALS.filter((m) => m.type === filter);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
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
            Content Library
          </h1>
          <p
            style={{
              fontFamily: F.body,
              fontSize: "0.875rem",
              color: C.textSub,
              margin: 0,
            }}
          >
            All your generated and uploaded materials
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              background: C.surfaceB,
              color: C.textSub,
              fontFamily: F.body,
              fontSize: "0.82rem",
              border: `1px solid ${C.border}`,
              borderRadius: 7,
              padding: "0.45rem 0.9rem",
              cursor: "pointer",
            }}
          >
            <UploadSvg /> Upload
          </button>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              background: C.orange,
              color: "#fff",
              fontFamily: F.body,
              fontSize: "0.82rem",
              fontWeight: 600,
              border: "none",
              borderRadius: 7,
              padding: "0.45rem 0.9rem",
              cursor: "pointer",
            }}
          >
            <SparklesSvg color="#fff" size={13} /> Generate
          </button>
        </div>
      </div>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {types.map((t) => (
          <Pill key={t} active={filter === t} onClick={() => setFilter(t)}>
            {t}
          </Pill>
        ))}
      </div>
      <Card style={{ overflow: "hidden" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 120px 120px 100px 80px 80px",
            padding: "0.6rem 1.2rem",
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          {["TITLE", "SUBJECT", "CLASS", "TYPE", "DATE", ""].map((h) => (
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
        {filtered.map((m, i) => {
          const badge = TYPE_BADGE[m.type] ?? {
            bg: C.orangeDim,
            color: C.orange,
            border: C.orangeBdr,
          };
          const [hov, setHov] = useState(false);
          return (
            <div
              key={m.id}
              onMouseEnter={() => setHov(true)}
              onMouseLeave={() => setHov(false)}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 120px 120px 100px 80px 80px",
                padding: "0.85rem 1.2rem",
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
                  color: hov ? C.orange : C.text,
                  transition: "color 0.15s",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  paddingRight: "1rem",
                }}
              >
                {m.title}
              </span>
              <span
                style={{
                  fontFamily: F.body,
                  fontSize: "0.82rem",
                  color: C.textSub,
                }}
              >
                {m.subject}
              </span>
              <span
                style={{
                  fontFamily: F.body,
                  fontSize: "0.82rem",
                  color: C.textSub,
                }}
              >
                {m.cls}
              </span>
              <Tag color={badge.color} bg={badge.bg} border={badge.border}>
                {m.type}
              </Tag>
              <span
                style={{
                  fontFamily: F.body,
                  fontSize: "0.75rem",
                  color: C.textMuted,
                }}
              >
                {m.date}
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
          );
        })}
      </Card>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE: MY CLASSES
// ═════════════════════════════════════════════════════════════════════════════
function PageClasses() {
  const classes = [
    {
      name: "Physics 10-A",
      students: 32,
      engagement: 94,
      color: C.purple,
      avg: 78,
    },
    {
      name: "Physics 10-B",
      students: 29,
      engagement: 88,
      color: C.blue,
      avg: 72,
    },
    {
      name: "Mathematics 11-A",
      students: 35,
      engagement: 91,
      color: C.orange,
      avg: 81,
    },
    {
      name: "Mathematics 11-B",
      students: 30,
      engagement: 85,
      color: C.teal,
      avg: 69,
    },
  ];
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
          My Classes
        </h1>
        <p
          style={{
            fontFamily: F.body,
            fontSize: "0.875rem",
            color: C.textSub,
            margin: 0,
          }}
        >
          Overview of all your classes and student performance.
        </p>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: "1rem",
        }}
      >
        {classes.map((c) => (
          <Card key={c.name} hover style={{ padding: "1.4rem 1.5rem" }}>
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
                  width: 42,
                  height: 42,
                  borderRadius: 10,
                  background: `${c.color}12`,
                  border: `1px solid ${c.color}25`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg viewBox="0 0 18 18" width="18" fill="none">
                  <path
                    d="M9 2L2 6l7 4 7-4-7-4z"
                    stroke={c.color}
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 12l7 4 7-4"
                    stroke={c.color}
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 9l7 4 7-4"
                    stroke={c.color}
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span
                style={{
                  fontFamily: F.mono,
                  fontSize: "0.65rem",
                  color: C.green,
                  background: C.greenDim,
                  border: "1px solid rgba(34,197,94,0.25)",
                  borderRadius: 10,
                  padding: "0.15rem 0.5rem",
                }}
              >
                {c.engagement}% engaged
              </span>
            </div>
            <div
              style={{
                fontFamily: F.head,
                fontSize: "1.05rem",
                fontWeight: 600,
                color: C.text,
                marginBottom: "0.25rem",
              }}
            >
              {c.name}
            </div>
            <div
              style={{
                fontFamily: F.body,
                fontSize: "0.78rem",
                color: C.textMuted,
                marginBottom: "1rem",
              }}
            >
              {c.students} students
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.4rem",
              }}
            >
              <span
                style={{
                  fontFamily: F.body,
                  fontSize: "0.75rem",
                  color: C.textSub,
                }}
              >
                Class Average
              </span>
              <span
                style={{
                  fontFamily: F.mono,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: c.color,
                }}
              >
                {c.avg}%
              </span>
            </div>
            <ProgressBar pct={c.avg} color={c.color} h={4} />
          </Card>
        ))}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// STUB PAGES
// ═════════════════════════════════════════════════════════════════════════════
function PageUpload() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        maxWidth: 640,
      }}
    >
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
          Upload PDF
        </h1>
        <p
          style={{
            fontFamily: F.body,
            fontSize: "0.875rem",
            color: C.textSub,
            margin: 0,
          }}
        >
          Import existing materials to your library.
        </p>
      </div>
      <Card
        style={{
          padding: "2.5rem",
          textAlign: "center",
          border: `2px dashed ${C.border}`,
          background: "transparent",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 12,
            background: C.orangeDim,
            border: `1px solid ${C.orangeBdr}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1rem",
          }}
        >
          <UploadSvg size={24} />
        </div>
        <div
          style={{
            fontFamily: F.body,
            fontSize: "0.9rem",
            fontWeight: 500,
            color: C.text,
            marginBottom: "0.35rem",
          }}
        >
          Drop a PDF here, or click to browse
        </div>
        <div
          style={{
            fontFamily: F.body,
            fontSize: "0.78rem",
            color: C.textMuted,
          }}
        >
          Supports PDF files up to 50MB
        </div>
      </Card>
    </div>
  );
}

function PageMaterialDetail() {
  return (
    <div
      style={{
        fontFamily: F.body,
        fontSize: "0.875rem",
        color: C.textSub,
        padding: "2rem",
        textAlign: "center",
      }}
    >
      Material detail view coming soon.
    </div>
  );
}

// ─── Shared helpers ────────────────────────────────────────────────────────────
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
function DocSvg({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 14 14" width="13" fill="none">
      <path
        d="M3 1h5l3 3v9H3V1z"
        stroke={color}
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path
        d="M8 1v3h3M5 6h4M5 8.5h3"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}
function UploadSvg({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="none">
      <path
        d="M8 10V3M5 6l3-3 3 3"
        stroke={C.orange}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 12h10"
        stroke={C.orange}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
function LibSvg() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none">
      <rect
        x="1"
        y="2"
        width="4"
        height="12"
        rx="1"
        stroke={C.orange}
        strokeWidth="1.2"
      />
      <rect
        x="6"
        y="2"
        width="4"
        height="12"
        rx="1"
        stroke={C.orange}
        strokeWidth="1.2"
      />
      <path
        d="M11 5l4 1-2.5 10L11 15V5z"
        stroke={C.orange}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
