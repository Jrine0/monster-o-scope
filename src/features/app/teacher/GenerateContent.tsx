import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import {
  Sparkles,
  Upload,
  ChevronDown,
  Lightbulb,
  BookOpen,
  FileText,
  HelpCircle,
  StickyNote,
} from "lucide-react";
import { ease, fadeUpProps, duration } from "@/lib/animation";

/* ── Constants ── */
const CLASSES = ["Class 9", "Class 10", "Class 11", "Class 12"] as const;
const SUBJECTS = ["Physics", "Chemistry", "Mathematics", "Biology", "History", "Geography", "English"] as const;

const CONTENT_TYPES = [
  { id: "lesson-plan", label: "Lesson Plan", icon: FileText },
  { id: "practice-questions", label: "Practice Questions", icon: HelpCircle },
  { id: "handout", label: "Handout", icon: BookOpen },
  { id: "summary-notes", label: "Summary Notes", icon: StickyNote },
] as const;

const DIFFICULTY_LEVELS = ["Easy", "Medium", "Hard"] as const;
const LANGUAGES = ["English", "Hindi"] as const;

const TIPS = [
  "Be specific with your topic — \"Photosynthesis in C3 plants\" generates better content than just \"Photosynthesis\".",
  "Selecting multiple content types generates a cohesive set of materials for the same topic.",
  "For practice questions, specify the difficulty level to match your students' readiness.",
  "Hindi translations work best for Science and Mathematics content.",
] as const;

/* ── Floating particle for page background ── */
function FloatingParticle({ delay, x, size }: { delay: number; x: number; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        bottom: -10,
        background: `radial-gradient(circle, rgba(242,116,13,${0.18 + Math.random() * 0.15}), transparent)`,
      }}
      initial={{ opacity: 0, y: 0 }}
      animate={{
        opacity: [0, 0.7, 0],
        y: [-10, -200 - Math.random() * 120],
        x: [0, (Math.random() - 0.5) * 50],
      }}
      transition={{
        duration: 5 + Math.random() * 4,
        delay,
        repeat: Infinity,
        ease: "easeOut",
      }}
    />
  );
}

export function GenerateContent() {
  const [activeTab, setActiveTab] = useState<"topic" | "pdf">("topic");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState("Medium");
  const [language, setLanguage] = useState("English");

  function toggleType(id: string) {
    setSelectedTypes((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  }

  return (
    <div className="relative space-y-6">
      {/* ── Animated page background ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Orange gradient blob */}
        <motion.div
          className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, rgba(242,116,13,0.6), transparent 70%)", filter: "blur(100px)" }}
          animate={{ scale: [1, 1.15, 1], x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, rgba(242,116,13,0.5), transparent 70%)", filter: "blur(100px)" }}
          animate={{ scale: [1, 1.1, 1], x: [0, -20, 0], y: [0, 15, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Dot grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(242,116,13,0.8) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Floating particles */}
        {Array.from({ length: 7 }).map((_, i) => (
          <FloatingParticle
            key={i}
            delay={i * 1.2}
            x={8 + (i * 13) % 84}
            size={2 + (i % 3)}
          />
        ))}
      </div>

      {/* Header */}
      <motion.div
        {...fadeUpProps()}
      >
        <motion.h1
          className="text-display-md text-text-primary"
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: duration.slow, ease: ease.gentle }}
        >
          Generate Content
        </motion.h1>
        <p className="mt-1 text-body-md text-text-secondary">
          Create NCERT-aligned teaching materials powered by AI.
        </p>
        {/* Animated accent line */}
        <motion.div
          className="mt-3 h-px bg-gradient-to-r from-orange-500/60 via-orange-400/30 to-transparent"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "100%", opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: ease.gentle }}
        />
      </motion.div>

      {/* Tabs */}
      <motion.div
        {...fadeUpProps(12, 0.08, 0.45)}
        className="flex gap-1 rounded-[var(--radius-md)] bg-bg-elevated p-1 w-fit"
      >
        <button
          onClick={() => setActiveTab("topic")}
          className={`relative rounded-[var(--radius-sm)] px-4 py-2 text-body-md font-medium transition-colors ${
            activeTab === "topic"
              ? "text-text-primary"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          {activeTab === "topic" && (
            <motion.div
              layoutId="generate-tab-bg"
              className="absolute inset-0 rounded-[var(--radius-sm)] bg-bg-muted"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            <motion.span
              animate={activeTab === "topic" ? { rotate: [0, 15, -15, 0], scale: [1, 1.15, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              <Sparkles size={16} strokeWidth={1.5} />
            </motion.span>
            From Topic
          </span>
        </button>
        <Link
          to="/teacher/generate"
          onClick={() => setActiveTab("pdf")}
          className={`relative rounded-[var(--radius-sm)] px-4 py-2 text-body-md font-medium transition-colors ${
            activeTab === "pdf"
              ? "text-text-primary"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          {activeTab === "pdf" && (
            <motion.div
              layoutId="generate-tab-bg"
              className="absolute inset-0 rounded-[var(--radius-sm)] bg-bg-muted"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            <Upload size={16} strokeWidth={1.5} />
            From PDF
          </span>
        </Link>
      </motion.div>

      {/* Main content */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Form */}
        <motion.div
          {...fadeUpProps(16, 0.15)}
          className="flex-1 space-y-6"
        >
          <motion.div
            className="group relative rounded-[var(--radius-lg)] border border-border-subtle bg-bg-surface p-6 space-y-6 transition-all duration-300"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3, ease: ease.gentle }}
          >
            {/* Card hover gradient glow overlay */}
            <div className="pointer-events-none absolute inset-0 rounded-[var(--radius-lg)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-orange-500/[0.03] via-transparent to-orange-500/[0.02]" />

            {/* Class selector */}
            <div className="space-y-2">
              <label className="text-body-sm font-medium text-text-primary">Class</label>
              <div className="relative">
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full appearance-none rounded-[var(--radius-md)] border border-border-subtle bg-bg-elevated px-4 py-2.5 pr-9 text-body-md text-text-primary outline-none transition-all hover:border-border-strong focus:border-orange-500/50 focus:shadow-[0_0_20px_rgba(242,116,13,0.08)]"
                >
                  <option value="">Select class...</option>
                  {CLASSES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" />
              </div>
            </div>

            {/* Subject selector */}
            <div className="space-y-2">
              <label className="text-body-sm font-medium text-text-primary">Subject</label>
              <div className="relative">
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full appearance-none rounded-[var(--radius-md)] border border-border-subtle bg-bg-elevated px-4 py-2.5 pr-9 text-body-md text-text-primary outline-none transition-all hover:border-border-strong focus:border-orange-500/50 focus:shadow-[0_0_20px_rgba(242,116,13,0.08)]"
                >
                  <option value="">Select subject...</option>
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" />
              </div>
            </div>

            {/* Chapter / Topic input */}
            <div className="space-y-2">
              <label className="text-body-sm font-medium text-text-primary">Chapter / Topic</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Photosynthesis in Higher Plants"
                className="w-full rounded-[var(--radius-md)] border border-border-subtle bg-bg-elevated px-4 py-2.5 text-body-md text-text-primary placeholder:text-text-muted outline-none transition-all hover:border-border-strong focus:border-orange-500/50 focus:shadow-[0_0_20px_rgba(242,116,13,0.08)]"
              />
            </div>

            {/* Content type checkboxes */}
            <div className="space-y-3">
              <label className="text-body-sm font-medium text-text-primary">Content Type</label>
              <div className="grid grid-cols-2 gap-3">
                {CONTENT_TYPES.map((type, i) => {
                  const Icon = type.icon;
                  const isSelected = selectedTypes.includes(type.id);
                  return (
                    <motion.button
                      key={type.id}
                      onClick={() => toggleType(type.id)}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.2 + i * 0.06, ease: ease.gentle }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-3 rounded-[var(--radius-md)] border p-3 text-left transition-all duration-200 ${
                        isSelected
                          ? "border-orange-500/40 bg-orange-500/8 text-orange-400 shadow-glow-orange"
                          : "border-border-subtle bg-bg-elevated text-text-secondary hover:border-border-strong hover:text-text-primary"
                      }`}
                    >
                      <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[var(--radius-xs)] border transition-colors ${
                        isSelected
                          ? "border-orange-500 bg-orange-500"
                          : "border-border-strong bg-transparent"
                      }`}>
                        {isSelected && (
                          <motion.svg
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 25 }}
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                          >
                            <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </motion.svg>
                        )}
                      </div>
                      <Icon size={16} strokeWidth={1.5} />
                      <span className="text-body-sm font-medium">{type.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Difficulty level */}
            <div className="space-y-3">
              <label className="text-body-sm font-medium text-text-primary">Difficulty Level</label>
              <div className="flex gap-2">
                {DIFFICULTY_LEVELS.map((level) => (
                  <motion.button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`rounded-[var(--radius-full)] px-4 py-1.5 text-body-sm font-medium transition-all duration-200 ${
                      difficulty === level
                        ? "bg-orange-500 text-white shadow-sm"
                        : "border border-border-subtle bg-bg-elevated text-text-secondary hover:border-border-strong hover:text-text-primary"
                    }`}
                  >
                    {level}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div className="space-y-3">
              <label className="text-body-sm font-medium text-text-primary">Language</label>
              <div className="flex gap-2">
                {LANGUAGES.map((lang) => (
                  <motion.button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`rounded-[var(--radius-full)] px-4 py-1.5 text-body-sm font-medium transition-all duration-200 ${
                      language === lang
                        ? "bg-orange-500 text-white shadow-sm"
                        : "border border-border-subtle bg-bg-elevated text-text-secondary hover:border-border-strong hover:text-text-primary"
                    }`}
                  >
                    {lang}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Generate button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/teacher/generate"
              className="group relative inline-flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-[var(--radius-md)] bg-orange-500 px-6 py-3.5 text-body-lg font-semibold text-white transition-all duration-200 hover:bg-orange-600 hover:shadow-glow-orange-strong sm:w-auto"
            >
              {/* Button hover glow */}
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-orange-400/20 via-transparent to-orange-400/20" />
              <Sparkles size={20} strokeWidth={1.5} />
              Generate
            </Link>
          </motion.div>
        </motion.div>

        {/* Tip card */}
        <motion.aside
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: ease.gentle }}
          className="w-full shrink-0 lg:w-80"
        >
          <motion.div
            className="group relative rounded-[var(--radius-lg)] border border-orange-500/20 bg-orange-500/5 p-6 transition-all duration-300"
            whileHover={{ y: -4, borderColor: "rgba(242,116,13,0.35)" }}
          >
            {/* Hover glow overlay */}
            <div className="pointer-events-none absolute inset-0 rounded-[var(--radius-lg)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-orange-500/[0.04] via-transparent to-orange-500/[0.02]" />

            <div className="mb-4 flex items-center gap-2">
              <motion.div
                className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] bg-orange-500/15"
                animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Lightbulb size={18} strokeWidth={1.5} className="text-orange-400" />
              </motion.div>
              <h3 className="text-heading-3 text-orange-400">Tips for better results</h3>
            </div>
            <ul className="space-y-3">
              {TIPS.map((tip, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.35 + i * 0.07, ease: ease.gentle }}
                  className="flex gap-2.5 text-body-sm text-text-secondary"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500/12 text-caption text-orange-400 font-semibold">
                    {i + 1}
                  </span>
                  {tip}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.aside>
      </div>
    </div>
  );
}
