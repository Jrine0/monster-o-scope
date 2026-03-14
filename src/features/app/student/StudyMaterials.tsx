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

/* ── Subject config ── */
const SUBJECTS = [
  { key: "all", label: "All Subjects", icon: BookOpen, color: "#f2740d" },
  { key: "mathematics", label: "Mathematics", icon: Calculator, color: "#3b82f6" },
  { key: "physics", label: "Physics", icon: Atom, color: "#a855f7" },
  { key: "chemistry", label: "Chemistry", icon: FlaskConical, color: "#22c55e" },
  { key: "biology", label: "Biology", icon: Leaf, color: "#ec4899" },
  { key: "english", label: "English", icon: BookOpen, color: "#f59e0b" },
  { key: "hindi", label: "Hindi", icon: Languages, color: "#f97316" },
] as const;

/* ── Mock chapter data ── */
const CHAPTERS: Record<string, Array<{
  id: string;
  number: number;
  title: string;
  subject: string;
  hasLesson: boolean;
  hasVideo: boolean;
  hasQuiz: boolean;
}>> = {
  mathematics: [
    { id: "m1", number: 1, title: "Real Numbers", subject: "Mathematics", hasLesson: true, hasVideo: true, hasQuiz: true },
    { id: "m2", number: 2, title: "Polynomials", subject: "Mathematics", hasLesson: true, hasVideo: false, hasQuiz: true },
    { id: "m3", number: 3, title: "Pair of Linear Equations in Two Variables", subject: "Mathematics", hasLesson: true, hasVideo: true, hasQuiz: true },
    { id: "m4", number: 4, title: "Quadratic Equations", subject: "Mathematics", hasLesson: true, hasVideo: true, hasQuiz: true },
    { id: "m5", number: 5, title: "Arithmetic Progressions", subject: "Mathematics", hasLesson: true, hasVideo: false, hasQuiz: true },
    { id: "m6", number: 6, title: "Triangles", subject: "Mathematics", hasLesson: true, hasVideo: true, hasQuiz: true },
    { id: "m7", number: 7, title: "Coordinate Geometry", subject: "Mathematics", hasLesson: true, hasVideo: false, hasQuiz: true },
    { id: "m8", number: 8, title: "Introduction to Trigonometry", subject: "Mathematics", hasLesson: true, hasVideo: true, hasQuiz: true },
    { id: "m9", number: 9, title: "Some Applications of Trigonometry", subject: "Mathematics", hasLesson: true, hasVideo: false, hasQuiz: false },
    { id: "m10", number: 10, title: "Circles", subject: "Mathematics", hasLesson: true, hasVideo: true, hasQuiz: true },
  ],
  physics: [
    { id: "p1", number: 1, title: "Light \u2014 Reflection and Refraction", subject: "Physics", hasLesson: true, hasVideo: true, hasQuiz: true },
    { id: "p2", number: 2, title: "The Human Eye and the Colourful World", subject: "Physics", hasLesson: true, hasVideo: true, hasQuiz: true },
    { id: "p3", number: 3, title: "Electricity", subject: "Physics", hasLesson: true, hasVideo: true, hasQuiz: true },
    { id: "p4", number: 4, title: "Magnetic Effects of Electric Current", subject: "Physics", hasLesson: true, hasVideo: false, hasQuiz: true },
    { id: "p5", number: 5, title: "Sources of Energy", subject: "Physics", hasLesson: true, hasVideo: true, hasQuiz: true },
  ],
  chemistry: [
    { id: "c1", number: 1, title: "Chemical Reactions and Equations", subject: "Chemistry", hasLesson: true, hasVideo: true, hasQuiz: true },
    { id: "c2", number: 2, title: "Acids, Bases and Salts", subject: "Chemistry", hasLesson: true, hasVideo: true, hasQuiz: true },
    { id: "c3", number: 3, title: "Metals and Non-metals", subject: "Chemistry", hasLesson: true, hasVideo: false, hasQuiz: true },
    { id: "c4", number: 4, title: "Carbon and its Compounds", subject: "Chemistry", hasLesson: true, hasVideo: true, hasQuiz: true },
    { id: "c5", number: 5, title: "Periodic Classification of Elements", subject: "Chemistry", hasLesson: true, hasVideo: true, hasQuiz: true },
  ],
  biology: [
    { id: "b1", number: 1, title: "Life Processes", subject: "Biology", hasLesson: true, hasVideo: true, hasQuiz: true },
    { id: "b2", number: 2, title: "Control and Coordination", subject: "Biology", hasLesson: true, hasVideo: false, hasQuiz: true },
    { id: "b3", number: 3, title: "How do Organisms Reproduce?", subject: "Biology", hasLesson: true, hasVideo: true, hasQuiz: true },
    { id: "b4", number: 4, title: "Heredity and Evolution", subject: "Biology", hasLesson: true, hasVideo: true, hasQuiz: true },
  ],
  english: [
    { id: "e1", number: 1, title: "A Letter to God", subject: "English", hasLesson: true, hasVideo: false, hasQuiz: true },
    { id: "e2", number: 2, title: "Nelson Mandela: Long Walk to Freedom", subject: "English", hasLesson: true, hasVideo: true, hasQuiz: true },
    { id: "e3", number: 3, title: "Two Stories about Flying", subject: "English", hasLesson: true, hasVideo: false, hasQuiz: true },
  ],
  hindi: [
    { id: "h1", number: 1, title: "\u0938\u0942\u0930\u0926\u093E\u0938 \u0915\u0947 \u092A\u0926", subject: "Hindi", hasLesson: true, hasVideo: false, hasQuiz: true },
    { id: "h2", number: 2, title: "\u0930\u093E\u092E-\u0932\u0915\u094D\u0937\u094D\u092E\u0923 \u092A\u0930\u0936\u0941\u0930\u093E\u092E \u0938\u0902\u0935\u093E\u0926", subject: "Hindi", hasLesson: true, hasVideo: true, hasQuiz: true },
    { id: "h3", number: 3, title: "\u0938\u0935\u0948\u092F\u093E", subject: "Hindi", hasLesson: true, hasVideo: false, hasQuiz: false },
  ],
};

/* ── Animation variants ── */
const container = staggerContainer(0.06);
const item = fadeUp(12);
const cardItem = cardReveal(16, duration.normal);

/* ── Floating particles for warm light theme ── */
const PARTICLES = Array.from({ length: 7 }, (_, i) => ({
  id: i,
  left: `${12 + i * 13}%`,
  delay: i * 0.8,
  duration: 6 + (i % 3) * 2,
  size: 2,
}));

export function StudyMaterials() {
  const [activeSubject, setActiveSubject] = useState<string>("mathematics");
  const [searchQuery, setSearchQuery] = useState("");

  const allChapters = activeSubject === "all"
    ? Object.values(CHAPTERS).flat()
    : CHAPTERS[activeSubject] ?? [];

  const filteredChapters = searchQuery
    ? allChapters.filter((ch) =>
        ch.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allChapters;

  const activeColor = SUBJECTS.find((s) => s.key === activeSubject)?.color ?? "#f2740d";

  return (
    <div className="relative space-y-6 pb-12">
      {/* ── Animated background blob (warm light theme) ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full opacity-[0.05]"
          style={{
            background: "radial-gradient(circle, #f2740d 0%, #fb923c 40%, transparent 70%)",
            filter: "blur(100px)",
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 15, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full opacity-[0.04]"
          style={{
            background: "radial-gradient(circle, #fb923c 0%, #f59e0b 40%, transparent 70%)",
            filter: "blur(100px)",
          }}
          animate={{
            x: [0, -25, 20, 0],
            y: [0, 25, -15, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Light dot grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, #f2740d 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* ── Floating particles ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              left: p.left,
              bottom: -10,
              backgroundColor: "#f2740d",
              opacity: 0,
            }}
            animate={{
              y: [0, -600, -1200],
              opacity: [0, 0.25, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* ── Header with blur entrance ── */}
      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.6, ease: ease.gentle }}
      >
        <h1 className="text-display-md text-text-primary">Study Materials</h1>
        <p className="text-body-lg text-text-secondary mt-1">
          Browse NCERT chapters by subject
        </p>
        {/* Animated accent line */}
        <motion.div
          className="h-px mt-4"
          style={{
            background: "linear-gradient(90deg, transparent, #f2740d, #fb923c, transparent)",
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: ease.gentle }}
        />
      </motion.div>

      {/* ── Search bar ── */}
      <motion.div
        {...fadeUpProps(8, 0.1, 0.4)}
        className="relative"
      >
        <Search
          size={18}
          strokeWidth={1.5}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
        />
        <input
          type="text"
          placeholder="Search chapters..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-border-default bg-bg-elevated pl-11 pr-4 py-3 text-body-lg text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-orange-500/40"
          style={{ backgroundColor: "#1c1a17" }}
        />
      </motion.div>

      {/* ── Subject filter tabs with micro-interactions ── */}
      <motion.div
        {...fadeUpProps(0, 0.15, 0.4)}
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-none"
        style={{ scrollbarWidth: "none" }}
      >
        {SUBJECTS.map((subject) => {
          const isActive = subject.key === activeSubject;
          const Icon = subject.icon;
          return (
            <motion.button
              key={subject.key}
              onClick={() => setActiveSubject(subject.key)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-body-sm font-medium transition-all duration-200 ${
                isActive
                  ? "border-transparent text-text-inverse"
                  : "border-border-subtle text-text-secondary hover:text-text-primary hover:border-border-default"
              }`}
              style={
                isActive
                  ? { backgroundColor: subject.color }
                  : { backgroundColor: "transparent" }
              }
            >
              <Icon size={16} strokeWidth={1.5} />
              {subject.label}
            </motion.button>
          );
        })}
      </motion.div>

      {/* ── Chapter List with card hover effects ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubject + searchQuery}
          variants={container}
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          className="space-y-3"
        >
          {filteredChapters.length === 0 && (
            <motion.div variants={item} className="text-center py-16">
              <p className="text-display-sm text-text-muted">No chapters found</p>
            </motion.div>
          )}
          {filteredChapters.map((chapter) => (
            <motion.div key={chapter.id} variants={cardItem} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
              <div
                className="group relative flex items-center gap-4 rounded-xl border border-border-subtle p-5 transition-all duration-200 hover:shadow-glow-orange hover:border-orange-500/20 overflow-hidden"
                style={{ backgroundColor: "var(--color-portal-student-surface)" }}
              >
                {/* Warm glow overlay on hover */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: "radial-gradient(ellipse at 50% 0%, rgba(242,116,13,0.04) 0%, transparent 70%)",
                  }}
                />

                {/* Chapter number */}
                <div
                  className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-heading-3 font-semibold"
                  style={{ backgroundColor: `${activeColor}15`, color: activeColor }}
                >
                  {chapter.number}
                </div>

                {/* Title + material type badges */}
                <div className="relative z-10 min-w-0 flex-1">
                  <Link
                    to="/student/materials/$id"
                    params={{ id: chapter.id }}
                    className="text-body-lg text-text-primary font-medium hover:text-orange-400 transition-colors truncate block"
                  >
                    {chapter.title}
                  </Link>
                  <div className="flex items-center gap-3 mt-1.5">
                    {chapter.subject !== "all" && activeSubject === "all" && (
                      <span className="text-caption text-text-muted">{chapter.subject}</span>
                    )}
                    <div className="flex items-center gap-2">
                      {chapter.hasLesson && (
                        <span className="flex items-center gap-1 text-caption text-text-secondary">
                          <FileText size={12} strokeWidth={1.5} />
                          Lesson
                        </span>
                      )}
                      {chapter.hasVideo && (
                        <span className="flex items-center gap-1 text-caption text-text-secondary">
                          <Play size={12} strokeWidth={1.5} />
                          Video
                        </span>
                      )}
                      {chapter.hasQuiz && (
                        <span className="flex items-center gap-1 text-caption text-text-secondary">
                          <HelpCircle size={12} strokeWidth={1.5} />
                          Quiz
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions with button micro-interactions */}
                <div className="relative z-10 flex items-center gap-2 shrink-0">
                  {chapter.hasQuiz && (
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Link
                        to="/student/quiz/$id"
                        params={{ id: chapter.id }}
                        className="rounded-lg border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-body-sm font-medium text-orange-400 transition-all duration-200 hover:bg-orange-500 hover:text-text-inverse"
                      >
                        Practice Quiz
                      </Link>
                    </motion.div>
                  )}
                  <Link
                    to="/student/materials/$id"
                    params={{ id: chapter.id }}
                    className="text-text-muted hover:text-text-primary transition-colors"
                  >
                    <ChevronRight size={20} strokeWidth={1.5} />
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
