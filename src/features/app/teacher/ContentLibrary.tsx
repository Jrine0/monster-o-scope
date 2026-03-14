import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import {
  Search,
  ChevronDown,
  FileText,
  HelpCircle,
  BookOpen,
  ClipboardList,
  StickyNote,
} from "lucide-react";
import { ease, fadeUpProps, staggerItemProps, duration } from "@/lib/animation";

/* ── Mock NCERT content ── */
const CONTENT_ITEMS = [
  { id: "1", title: "Chapter 3: Atoms and Molecules", subject: "Chemistry", cls: "Class 9", type: "Lesson Plan", icon: FileText },
  { id: "2", title: "Chapter 5: Laws of Motion", subject: "Physics", cls: "Class 11", type: "Lesson Plan", icon: FileText },
  { id: "3", title: "Chapter 2: Polynomials", subject: "Mathematics", cls: "Class 10", type: "Practice Questions", icon: HelpCircle },
  { id: "4", title: "Chapter 7: Diversity in Living Organisms", subject: "Biology", cls: "Class 9", type: "Handout", icon: BookOpen },
  { id: "5", title: "Chapter 1: Chemical Reactions and Equations", subject: "Chemistry", cls: "Class 10", type: "Quiz", icon: ClipboardList },
  { id: "6", title: "Chapter 4: Motion in a Plane", subject: "Physics", cls: "Class 11", type: "Summary Notes", icon: StickyNote },
  { id: "7", title: "Chapter 8: Quadrilaterals", subject: "Mathematics", cls: "Class 9", type: "Practice Questions", icon: HelpCircle },
  { id: "8", title: "Chapter 13: Photosynthesis in Higher Plants", subject: "Biology", cls: "Class 11", type: "Lesson Plan", icon: FileText },
  { id: "9", title: "Chapter 6: Thermodynamics", subject: "Physics", cls: "Class 11", type: "Summary Notes", icon: StickyNote },
  { id: "10", title: "Chapter 3: Matrices", subject: "Mathematics", cls: "Class 12", type: "Lesson Plan", icon: FileText },
  { id: "11", title: "Chapter 2: Acids, Bases and Salts", subject: "Chemistry", cls: "Class 10", type: "Practice Questions", icon: HelpCircle },
  { id: "12", title: "Chapter 5: Morphology of Flowering Plants", subject: "Biology", cls: "Class 11", type: "Handout", icon: BookOpen },
] as const;

const CLASSES = ["All Classes", "Class 9", "Class 10", "Class 11", "Class 12"] as const;
const SUBJECTS = ["All Subjects", "Physics", "Chemistry", "Mathematics", "Biology"] as const;

const TYPE_COLORS: Record<string, string> = {
  "Lesson Plan": "bg-orange-500/12 text-orange-400 border-orange-500/20",
  "Practice Questions": "bg-blue-500/12 text-blue-400 border-blue-500/20",
  "Summary Notes": "bg-emerald-500/12 text-emerald-400 border-emerald-500/20",
  Handout: "bg-purple-500/12 text-purple-400 border-purple-500/20",
  Quiz: "bg-rose-500/12 text-rose-400 border-rose-500/20",
};

const SUBJECT_COLORS: Record<string, string> = {
  Physics: "bg-blue-500/10 text-blue-400",
  Chemistry: "bg-amber-500/10 text-amber-400",
  Mathematics: "bg-purple-500/10 text-purple-400",
  Biology: "bg-emerald-500/10 text-emerald-400",
};

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

export function ContentLibrary() {
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [search, setSearch] = useState("");

  const filtered = CONTENT_ITEMS.filter((item) => {
    if (selectedClass !== "All Classes" && item.cls !== selectedClass) return false;
    if (selectedSubject !== "All Subjects" && item.subject !== selectedSubject) return false;
    if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

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
          Content Library
        </motion.h1>
        <p className="mt-1 text-body-md text-text-secondary">
          Browse NCERT-aligned content by class, subject, and chapter.
        </p>
        {/* Animated accent line */}
        <motion.div
          className="mt-3 h-px bg-gradient-to-r from-orange-500/60 via-orange-400/30 to-transparent"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "100%", opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: ease.gentle }}
        />
      </motion.div>

      {/* Filter Bar */}
      <motion.div
        {...fadeUpProps(12, 0.1, 0.45)}
        className="flex flex-wrap items-center gap-3"
      >
        {/* Class dropdown */}
        <div className="relative">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="appearance-none rounded-[var(--radius-md)] border border-border-subtle bg-bg-elevated px-4 py-2 pr-9 text-body-md text-text-primary outline-none transition-all hover:border-border-strong focus:border-orange-500/50 focus:shadow-[0_0_20px_rgba(242,116,13,0.08)]"
          >
            {CLASSES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" />
        </div>

        {/* Subject dropdown */}
        <div className="relative">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="appearance-none rounded-[var(--radius-md)] border border-border-subtle bg-bg-elevated px-4 py-2 pr-9 text-body-md text-text-primary outline-none transition-all hover:border-border-strong focus:border-orange-500/50 focus:shadow-[0_0_20px_rgba(242,116,13,0.08)]"
          >
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" />
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search chapters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-[var(--radius-md)] border border-border-subtle bg-bg-elevated py-2 pl-9 pr-4 text-body-md text-text-primary placeholder:text-text-muted outline-none transition-all hover:border-border-strong focus:border-orange-500/50 focus:shadow-[0_0_20px_rgba(242,116,13,0.08)]"
          />
        </div>
      </motion.div>

      {/* Results count */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2, ease: ease.gentle }}
        className="text-body-sm text-text-muted"
      >
        {filtered.length} items
      </motion.p>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              {...staggerItemProps(0.15 + i * 0.05)}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3, ease: ease.gentle }}
            >
              <Link
                to="/teacher/library/$id"
                params={{ id: item.id }}
                className="group relative flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border-subtle bg-bg-surface p-5 transition-all duration-200 hover:border-orange-500/30 hover:shadow-[0_4px_24px_rgba(242,116,13,0.12)]"
              >
                {/* Card hover gradient glow overlay */}
                <div className="pointer-events-none absolute inset-0 rounded-[var(--radius-lg)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-orange-500/[0.04] via-transparent to-orange-500/[0.02]" />

                {/* Icon + Type */}
                <div className="mb-4 flex items-start justify-between">
                  <motion.div
                    className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-bg-elevated text-text-secondary group-hover:text-orange-400 transition-colors"
                    whileHover={{ rotate: [0, -8, 8, 0], scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Icon size={20} strokeWidth={1.5} />
                  </motion.div>
                  <span className={`rounded-[var(--radius-sm)] border px-2 py-0.5 text-caption ${TYPE_COLORS[item.type] ?? "bg-bg-muted text-text-secondary border-border-subtle"}`}>
                    {item.type}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-heading-3 text-text-primary group-hover:text-orange-400 transition-colors line-clamp-2">
                  {item.title}
                </h3>

                {/* Meta */}
                <div className="mt-3 flex items-center gap-2">
                  <span className={`rounded-[var(--radius-sm)] px-2 py-0.5 text-caption ${SUBJECT_COLORS[item.subject] ?? "bg-bg-muted text-text-secondary"}`}>
                    {item.subject}
                  </span>
                  <span className="text-caption text-text-muted">{item.cls}</span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: ease.gentle }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <BookOpen size={40} strokeWidth={1} className="text-text-muted mb-3" />
          </motion.div>
          <p className="text-heading-3 text-text-secondary">No content found</p>
          <p className="mt-1 text-body-sm text-text-muted">Try adjusting your filters or search term.</p>
        </motion.div>
      )}
    </div>
  );
}
