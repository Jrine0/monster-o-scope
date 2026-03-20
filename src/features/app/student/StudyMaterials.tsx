// StudyMaterials.tsx — Schoolme design system
// All logic, animation variants, filter state from original preserved exactly.
// className tokens → Schoolme inline CSS vars + Caveat/Lora/Courier Prime.

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "@tanstack/react-router";
import {
  Calculator,
  Atom,
  FlaskConical,
  Leaf,
  BookOpen,
  Languages,
  FileText,
  Play,
  HelpCircle,
  ChevronRight,
  Search,
} from "lucide-react";
import {
  staggerContainer,
  fadeUp,
  fadeUpProps,
  cardReveal,
  ease,
  duration,
} from "@/lib/animation";

const CAV: React.CSSProperties = { fontFamily: "Caveat, cursive" };
const LOR: React.CSSProperties = { fontFamily: "Lora, Georgia, serif" };
const COU: React.CSSProperties = { fontFamily: "Courier Prime, monospace" };
// Removed slanted CLIP_CARD - using standard rounded rectangles

/* ── Subject config (unchanged) ── */
const SUBJECTS = [
  { key: "all", label: "All Subjects", icon: BookOpen, color: "#f2740d" },
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

/* ── Mock chapter data (unchanged) ── */
const CHAPTERS: Record<
  string,
  Array<{
    id: string;
    number: number;
    title: string;
    subject: string;
    hasLesson: boolean;
    hasVideo: boolean;
    hasQuiz: boolean;
  }>
> = {
  mathematics: [
    {
      id: "m1",
      number: 1,
      title: "Real Numbers",
      subject: "Mathematics",
      hasLesson: true,
      hasVideo: true,
      hasQuiz: true,
    },
    {
      id: "m2",
      number: 2,
      title: "Polynomials",
      subject: "Mathematics",
      hasLesson: true,
      hasVideo: false,
      hasQuiz: true,
    },
    {
      id: "m3",
      number: 3,
      title: "Pair of Linear Equations in Two Variables",
      subject: "Mathematics",
      hasLesson: true,
      hasVideo: true,
      hasQuiz: true,
    },
    {
      id: "m4",
      number: 4,
      title: "Quadratic Equations",
      subject: "Mathematics",
      hasLesson: true,
      hasVideo: true,
      hasQuiz: true,
    },
    {
      id: "m5",
      number: 5,
      title: "Arithmetic Progressions",
      subject: "Mathematics",
      hasLesson: true,
      hasVideo: false,
      hasQuiz: true,
    },
    {
      id: "m6",
      number: 6,
      title: "Triangles",
      subject: "Mathematics",
      hasLesson: true,
      hasVideo: true,
      hasQuiz: true,
    },
    {
      id: "m7",
      number: 7,
      title: "Coordinate Geometry",
      subject: "Mathematics",
      hasLesson: true,
      hasVideo: false,
      hasQuiz: true,
    },
    {
      id: "m8",
      number: 8,
      title: "Introduction to Trigonometry",
      subject: "Mathematics",
      hasLesson: true,
      hasVideo: true,
      hasQuiz: true,
    },
    {
      id: "m9",
      number: 9,
      title: "Some Applications of Trigonometry",
      subject: "Mathematics",
      hasLesson: true,
      hasVideo: false,
      hasQuiz: false,
    },
    {
      id: "m10",
      number: 10,
      title: "Circles",
      subject: "Mathematics",
      hasLesson: true,
      hasVideo: true,
      hasQuiz: true,
    },
  ],
  physics: [
    {
      id: "p1",
      number: 1,
      title: "Light \u2014 Reflection and Refraction",
      subject: "Physics",
      hasLesson: true,
      hasVideo: true,
      hasQuiz: true,
    },
    {
      id: "p2",
      number: 2,
      title: "The Human Eye and the Colourful World",
      subject: "Physics",
      hasLesson: true,
      hasVideo: true,
      hasQuiz: true,
    },
    {
      id: "p3",
      number: 3,
      title: "Electricity",
      subject: "Physics",
      hasLesson: true,
      hasVideo: true,
      hasQuiz: true,
    },
    {
      id: "p4",
      number: 4,
      title: "Magnetic Effects of Electric Current",
      subject: "Physics",
      hasLesson: true,
      hasVideo: false,
      hasQuiz: true,
    },
    {
      id: "p5",
      number: 5,
      title: "Sources of Energy",
      subject: "Physics",
      hasLesson: true,
      hasVideo: true,
      hasQuiz: true,
    },
  ],
  chemistry: [
    {
      id: "c1",
      number: 1,
      title: "Chemical Reactions and Equations",
      subject: "Chemistry",
      hasLesson: true,
      hasVideo: true,
      hasQuiz: true,
    },
    {
      id: "c2",
      number: 2,
      title: "Acids, Bases and Salts",
      subject: "Chemistry",
      hasLesson: true,
      hasVideo: true,
      hasQuiz: true,
    },
    {
      id: "c3",
      number: 3,
      title: "Metals and Non-metals",
      subject: "Chemistry",
      hasLesson: true,
      hasVideo: false,
      hasQuiz: true,
    },
    {
      id: "c4",
      number: 4,
      title: "Carbon and its Compounds",
      subject: "Chemistry",
      hasLesson: true,
      hasVideo: true,
      hasQuiz: true,
    },
    {
      id: "c5",
      number: 5,
      title: "Periodic Classification of Elements",
      subject: "Chemistry",
      hasLesson: true,
      hasVideo: true,
      hasQuiz: true,
    },
  ],
  biology: [
    {
      id: "b1",
      number: 1,
      title: "Life Processes",
      subject: "Biology",
      hasLesson: true,
      hasVideo: true,
      hasQuiz: true,
    },
    {
      id: "b2",
      number: 2,
      title: "Control and Coordination",
      subject: "Biology",
      hasLesson: true,
      hasVideo: false,
      hasQuiz: true,
    },
    {
      id: "b3",
      number: 3,
      title: "How do Organisms Reproduce?",
      subject: "Biology",
      hasLesson: true,
      hasVideo: true,
      hasQuiz: true,
    },
    {
      id: "b4",
      number: 4,
      title: "Heredity and Evolution",
      subject: "Biology",
      hasLesson: true,
      hasVideo: true,
      hasQuiz: true,
    },
  ],
  english: [
    {
      id: "e1",
      number: 1,
      title: "A Letter to God",
      subject: "English",
      hasLesson: true,
      hasVideo: false,
      hasQuiz: true,
    },
    {
      id: "e2",
      number: 2,
      title: "Nelson Mandela: Long Walk to Freedom",
      subject: "English",
      hasLesson: true,
      hasVideo: true,
      hasQuiz: true,
    },
    {
      id: "e3",
      number: 3,
      title: "Two Stories about Flying",
      subject: "English",
      hasLesson: true,
      hasVideo: false,
      hasQuiz: true,
    },
  ],
  hindi: [
    {
      id: "h1",
      number: 1,
      title: "\u0938\u0942\u0930\u0926\u093E\u0938 \u0915\u0947 \u092A\u0926",
      subject: "Hindi",
      hasLesson: true,
      hasVideo: false,
      hasQuiz: true,
    },
    {
      id: "h2",
      number: 2,
      title:
        "\u0930\u093E\u092E-\u0932\u0915\u094D\u0937\u094D\u092E\u0923 \u092A\u0930\u0936\u0941\u0930\u093E\u092E \u0938\u0902\u0935\u093E\u0926",
      subject: "Hindi",
      hasLesson: true,
      hasVideo: true,
      hasQuiz: true,
    },
    {
      id: "h3",
      number: 3,
      title: "\u0938\u0935\u0948\u092F\u093E",
      subject: "Hindi",
      hasLesson: true,
      hasVideo: false,
      hasQuiz: false,
    },
  ],
};

/* ── Animation variants (unchanged) ── */
const container = staggerContainer(0.06);
const item = fadeUp(12);
const cardItem = cardReveal(16, duration.normal);

/* ── Eyebrow ── */
function Eyebrow({ label }: { label: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        marginBottom: "1rem",
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

export function StudyMaterials() {
  const [activeSubject, setActiveSubject] = useState("mathematics");
  const [searchQuery, setSearchQuery] = useState("");

  const allChapters =
    activeSubject === "all"
      ? Object.values(CHAPTERS).flat()
      : (CHAPTERS[activeSubject] ?? []);
  const filtered = searchQuery
    ? allChapters.filter((ch) =>
        ch.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : allChapters;
  const activeColor =
    SUBJECTS.find((s) => s.key === activeSubject)?.color ?? "var(--orange)";

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
          className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle,#f2740d 0%,#fb923c 40%,transparent 70%)",
            filter: "blur(100px)",
            opacity: 0.05,
          }}
          animate={{ x: [0, 30, -20, 0], y: [0, -20, 15, 0] }}
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
          animate={{ x: [0, -25, 20, 0], y: [0, 25, -15, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
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
          Study Materials
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
          Browse NCERT chapters by subject
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

      {/* Search */}
      <motion.div
        {...fadeUpProps(8, 0.1, 0.4)}
        style={{ position: "relative" }}
      >
        <Search
          size={17}
          strokeWidth={1.5}
          color="var(--text-muted)"
          style={{
            position: "absolute",
            left: "0.9rem",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
          }}
        />
        <input
          type="text"
          placeholder="Search chapters…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            ...LOR,
            fontSize: "0.9rem",
            color: "var(--text-primary)",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-default)",
            padding: "0.7rem 1rem 0.7rem 2.6rem",
            outline: "none",
            borderRadius: "12px",
            transition: "border-color 0.18s, box-shadow 0.18s",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "rgba(242,116,13,0.45)";
            e.currentTarget.style.boxShadow = "0 0 18px rgba(242,116,13,0.08)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--border-default)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
      </motion.div>

      {/* Subject filter */}
      <motion.div
        {...fadeUpProps(0, 0.15, 0.4)}
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
                gap: "0.35rem",
                ...COU,
                fontSize: "0.65rem",
                letterSpacing: "0.08em",
                padding: "0.38rem 0.85rem",
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
              <Icon size={14} strokeWidth={1.5} /> {sub.label}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Chapter list */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubject + searchQuery}
          variants={container}
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}
        >
          {filtered.length === 0 && (
            <motion.div
              variants={item}
              style={{ textAlign: "center", padding: "4rem 0" }}
            >
              <p
                style={{ ...CAV, fontSize: "2rem", color: "var(--text-muted)" }}
              >
                No chapters found
              </p>
            </motion.div>
          )}

          {filtered.map((ch) => (
            <motion.div
              key={ch.id}
              variants={cardItem}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.85rem",
                  padding: "1rem 1.1rem",
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-subtle)",
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "12px",
                }}
              >
                {/* Chapter number */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 42,
                    height: 42,
                    flexShrink: 0,
                    background: `${activeColor}18`,
                    borderRadius: 6,
                    ...CAV,
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: activeColor,
                  }}
                >
                  {ch.number}
                </div>

                {/* Title + badges */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link
                    to="/student/materials"
                    style={{
                      ...CAV,
                      fontSize: "1.05rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      textDecoration: "none",
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {ch.title}
                  </Link>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginTop: "0.2rem",
                    }}
                  >
                    {activeSubject === "all" && (
                      <span
                        style={{
                          ...COU,
                          fontSize: "0.56rem",
                          letterSpacing: "0.08em",
                          color: "var(--text-muted)",
                        }}
                      >
                        {ch.subject}
                      </span>
                    )}
                    {ch.hasLesson && (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.2rem",
                          ...COU,
                          fontSize: "0.56rem",
                          color: "var(--text-secondary)",
                        }}
                      >
                        <FileText size={11} strokeWidth={1.5} /> Lesson
                      </span>
                    )}
                    {ch.hasVideo && (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.2rem",
                          ...COU,
                          fontSize: "0.56rem",
                          color: "var(--text-secondary)",
                        }}
                      >
                        <Play size={11} strokeWidth={1.5} /> Video
                      </span>
                    )}
                    {ch.hasQuiz && (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.2rem",
                          ...COU,
                          fontSize: "0.56rem",
                          color: "var(--text-secondary)",
                        }}
                      >
                        <HelpCircle size={11} strokeWidth={1.5} /> Quiz
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    flexShrink: 0,
                  }}
                >
                  {ch.hasQuiz && (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to="/student/quizzes"
                        style={{
                          ...COU,
                          fontSize: "0.62rem",
                          letterSpacing: "0.08em",
                          background: "rgba(242,116,13,0.10)",
                          border: "1px solid rgba(242,116,13,0.28)",
                          color: "var(--orange)",
                          padding: "0.3rem 0.7rem",
                          textDecoration: "none",
                          borderRadius: "999px",
                          display: "inline-block",
                          transition: "all 0.18s",
                        }}
                      >
                        Practice Quiz
                      </Link>
                    </motion.div>
                  )}
                  <Link
                    to="/student/materials"
                    style={{ color: "var(--text-muted)", display: "flex" }}
                  >
                    <ChevronRight size={18} strokeWidth={1.5} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
