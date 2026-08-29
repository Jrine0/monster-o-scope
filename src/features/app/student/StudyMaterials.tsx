import { useState, useEffect } from "react";
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
  ChevronRight,
  Search,
  Loader2,
} from "lucide-react";
import {
  staggerContainer,
  fadeUp,
  fadeUpProps,
  cardReveal,
  ease,
  duration,
} from "@/lib/animation";
import {
  fetchLibraryStructure,
  type GradeTree,
  type ChapterSummary,
} from "./api/student.api";

const SUBJECT_ICONS: Record<string, React.ElementType> = {
  mathematics: Calculator,
  physics: Atom,
  chemistry: FlaskConical,
  biology: Leaf,
  english: BookOpen,
  hindi: Languages,
};

const SUBJECT_COLORS: Record<string, string> = {
  mathematics: "#3b82f6",
  physics: "#a855f7",
  chemistry: "#22c55e",
  biology: "#ec4899",
  english: "#f59e0b",
  hindi: "#f97316",
};

const ALL_SUBJECTS: Array<{ key: string; label: string; color: string }> = [
  { key: "all", label: "All Subjects", color: "#f2740d" },
  ...Object.entries(SUBJECT_COLORS).map(([key, color]) => ({
    key,
    label: key.charAt(0).toUpperCase() + key.slice(1),
    color,
  })),
];

function buildFlatChapterList(grades: GradeTree[]) {
  return grades.flatMap((g) =>
    g.subjects.flatMap((s) =>
      s.chapters.map((ch) => ({
        ...ch,
        subject: s.subject,
        grade: g.grade,
      })),
    ),
  );
}

const container = staggerContainer(0.06);
const cardItem = cardReveal(16, duration.normal);

export function StudyMaterials() {
  const [activeSubject, setActiveSubject] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [grades, setGrades] = useState<GradeTree[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLibraryStructure()
      .then(setGrades)
      .catch(() => setError("Failed to load study materials."))
      .finally(() => setLoading(false));
  }, []);

  const allChapters = buildFlatChapterList(grades);

  const filtered = allChapters.filter((ch) => {
    const matchesSubject =
      activeSubject === "all" ||
      ch.subject.toLowerCase() === activeSubject.toLowerCase();
    const matchesSearch = searchQuery
      ? ch.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesSubject && matchesSearch;
  });

  const grouped = filtered.reduce<Record<string, ChapterSummary[]>>((acc, ch) => {
    if (!acc[ch.subject]) acc[ch.subject] = [];
    acc[ch.subject].push(ch);
    return acc;
  }, {});

  const activeColor =
    ALL_SUBJECTS.find((s) => s.key === activeSubject)?.color ?? "#f2740d";

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
          className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle,#f2740d 0%,#fb923c 40%,transparent 70%)",
            filter: "blur(100px)",
            opacity: 0.05,
          }}
          animate={{ x: [0, 30, -20, 0], y: [0, -20, 15, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full"
          style={{
            background: "radial-gradient(circle,#fb923c 0%,#f59e0b 40%,transparent 70%)",
            filter: "blur(100px)",
            opacity: 0.04,
          }}
          animate={{ x: [0, -25, 20, 0], y: [0, 25, -15, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
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
          style={{
            fontSize: "clamp(2rem,5vw,3rem)",
            color: "var(--text-primary)",
            lineHeight: 1,
          }}
        >
          Study Materials
        </h1>
        <p
          className="font-[Lora,Georgia,serif] italic"
          style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginTop: "0.4rem" }}
        >
          Browse NCERT chapters by subject
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

      {/* Search */}
      <motion.div {...fadeUpProps(8, 0.1, 0.4)} style={{ position: "relative" }}>
        <Search
          size={17}
          strokeWidth={1.5}
          style={{
            position: "absolute",
            left: "0.9rem",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            color: "var(--text-muted)",
          }}
        />
        <input
          type="text"
          placeholder="Search chapters…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl px-10 py-[0.7rem] outline-none transition-all"
          style={{
            fontFamily: "Lora, Georgia, serif",
            fontSize: "0.9rem",
            color: "var(--text-primary)",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-default)",
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
        className="flex gap-1 overflow-x-auto pb-1"
      >
        {ALL_SUBJECTS.map((sub) => {
          const isActive = sub.key === activeSubject;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const Icon = (SUBJECT_ICONS[sub.key] ?? BookOpen) as any;
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
                padding: "0.38rem 0.85rem",
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
              <Icon size={14} strokeWidth={1.5} />
              {sub.label}
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
          className="flex flex-col gap-3"
        >
          {filtered.length === 0 && (
            <motion.div variants={fadeUp(12)} style={{ textAlign: "center", padding: "4rem 0" }}>
              <p className="font-[Caveat,cursive] text-2xl" style={{ color: "var(--text-muted)" }}>
                No chapters found
              </p>
            </motion.div>
          )}

          {Object.entries(grouped).map(([subject, chapters]) => (
            <div key={subject} className="flex flex-col gap-2">
              {activeSubject === "all" && (
                <p
                  className="font-[Courier_Prime,monospace] px-1 pt-1"
                  style={{
                    fontSize: "0.6rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: SUBJECT_COLORS[subject.toLowerCase()] ?? "var(--text-muted)",
                  }}
                >
                  {subject}
                </p>
              )}
              {chapters.map((ch) => (
                <motion.div
                  key={ch.id}
                  variants={cardItem}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-3 rounded-xl border p-3 transition-all"
                  style={{
                    background: "var(--bg-surface)",
                    borderColor: "var(--border-subtle)",
                  }}
                >
                  {/* Chapter number */}
                  <div
                    className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-md font-[Caveat,cursive] text-lg font-bold"
                    style={{
                      background: `${activeColor}18`,
                      color: activeColor,
                    }}
                  >
                    {ch.chapter_number}
                  </div>

                  {/* Title + subtopics count */}
                  <div className="min-w-0 flex-1">
                    <Link
                      to="/student/materials"
                      className="block overflow-hidden text-ellipsis whitespace-nowrap font-[Caveat,cursive] text-lg font-bold no-underline"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {ch.title}
                    </Link>
                    <div className="mt-0.5 flex items-center gap-2">
                      {ch.subtopics?.length > 0 && (
                        <span
                          className="flex items-center gap-0.5 font-[Courier_Prime,monospace]"
                          style={{ fontSize: "0.56rem", color: "var(--text-secondary)" }}
                        >
                          <FileText size={11} strokeWidth={1.5} />
                          {ch.subtopics.length} lesson{ch.subtopics.length !== 1 ? "s" : ""}
                        </span>
                      )}
                      {ch.description && (
                        <span
                          className="font-[Courier_Prime,monospace] truncate"
                          style={{ fontSize: "0.56rem", color: "var(--text-muted)", maxWidth: 200 }}
                        >
                          {ch.description}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-2">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Link
                        to="/student/quizzes"
                        className="inline-block rounded-full px-3 py-1 no-underline transition-all"
                        style={{
                          fontFamily: "Courier Prime, monospace",
                          fontSize: "0.62rem",
                          letterSpacing: "0.08em",
                          background: "rgba(242,116,13,0.10)",
                          border: "1px solid rgba(242,116,13,0.28)",
                          color: "var(--orange)",
                        }}
                      >
                        Practice Quiz
                      </Link>
                    </motion.div>
                    <Link to="/student/materials" style={{ color: "var(--text-muted)", display: "flex" }}>
                      <ChevronRight size={18} strokeWidth={1.5} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
