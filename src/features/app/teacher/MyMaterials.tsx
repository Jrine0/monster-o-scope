import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import {
  Search,
  ChevronDown,
  LayoutGrid,
  List,
  MoreVertical,
  Trash2,
  Edit3,
  Download,
  Clock,
  FileText,
  HelpCircle,
  BookOpen,
  StickyNote,
} from "lucide-react";
import { ease, fadeUpProps, staggerItemProps, duration } from "@/lib/animation";
import { useUIStore } from "@/stores/useUIStore";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { LucideIcon } from "lucide-react";

/* ── Material type ── */
interface Material {
  id: string;
  title: string;
  subject: string;
  cls: string;
  type: string;
  date: string;
  icon: LucideIcon;
  gradient: string;
}

/* ── Initial mock materials ── */
const INITIAL_MATERIALS: Material[] = [
  {
    id: "m1",
    title: "Atoms and Molecules — Lesson Plan",
    subject: "Chemistry",
    cls: "Class 9",
    type: "Lesson Plan",
    date: "28 Feb 2026",
    icon: FileText,
    gradient: "from-amber-600/40 to-orange-500/40",
  },
  {
    id: "m2",
    title: "Laws of Motion — Practice Questions",
    subject: "Physics",
    cls: "Class 11",
    type: "Practice Questions",
    date: "27 Feb 2026",
    icon: HelpCircle,
    gradient: "from-blue-600/40 to-cyan-500/40",
  },
  {
    id: "m3",
    title: "Polynomials — Summary Notes",
    subject: "Mathematics",
    cls: "Class 10",
    type: "Summary Notes",
    date: "26 Feb 2026",
    icon: StickyNote,
    gradient: "from-purple-600/40 to-pink-500/40",
  },
  {
    id: "m4",
    title: "Photosynthesis — Handout",
    subject: "Biology",
    cls: "Class 11",
    type: "Handout",
    date: "25 Feb 2026",
    icon: BookOpen,
    gradient: "from-emerald-600/40 to-teal-500/40",
  },
  {
    id: "m5",
    title: "Chemical Bonding — Lesson Plan",
    subject: "Chemistry",
    cls: "Class 11",
    type: "Lesson Plan",
    date: "24 Feb 2026",
    icon: FileText,
    gradient: "from-rose-600/40 to-red-500/40",
  },
  {
    id: "m6",
    title: "Quadratic Equations — Practice Questions",
    subject: "Mathematics",
    cls: "Class 10",
    type: "Practice Questions",
    date: "23 Feb 2026",
    icon: HelpCircle,
    gradient: "from-indigo-600/40 to-blue-500/40",
  },
  {
    id: "m7",
    title: "Diversity in Living Organisms — Summary Notes",
    subject: "Biology",
    cls: "Class 9",
    type: "Summary Notes",
    date: "22 Feb 2026",
    icon: StickyNote,
    gradient: "from-green-600/40 to-lime-500/40",
  },
  {
    id: "m8",
    title: "Thermodynamics — Lesson Plan",
    subject: "Physics",
    cls: "Class 11",
    type: "Lesson Plan",
    date: "21 Feb 2026",
    icon: FileText,
    gradient: "from-yellow-600/40 to-amber-500/40",
  },
];

const TYPES = ["All Types", "Lesson Plan", "Practice Questions", "Summary Notes", "Handout"] as const;
const SUBJECTS_FILTER = ["All Subjects", "Physics", "Chemistry", "Mathematics", "Biology"] as const;
const SORT_OPTIONS = ["Newest First", "Oldest First", "A-Z", "Z-A"] as const;

const TYPE_COLORS: Record<string, string> = {
  "Lesson Plan": "bg-orange-500/12 text-orange-400 border-orange-500/20",
  "Practice Questions": "bg-blue-500/12 text-blue-400 border-blue-500/20",
  "Summary Notes": "bg-emerald-500/12 text-emerald-400 border-emerald-500/20",
  Handout: "bg-purple-500/12 text-purple-400 border-purple-500/20",
};

/* ── Date parsing helper (parses "28 Feb 2026" format) ── */
function parseDateString(dateStr: string): number {
  return new Date(dateStr).getTime();
}

/* ── Sort helper ── */
function sortMaterials(materials: Material[], sortBy: string): Material[] {
  const sorted = [...materials];
  switch (sortBy) {
    case "Newest First":
      return sorted.sort((a, b) => parseDateString(b.date) - parseDateString(a.date));
    case "Oldest First":
      return sorted.sort((a, b) => parseDateString(a.date) - parseDateString(b.date));
    case "A-Z":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "Z-A":
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    default:
      return sorted;
  }
}

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

export function MyMaterials() {
  const [materials, setMaterials] = useState<Material[]>(INITIAL_MATERIALS);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [subjectFilter, setSubjectFilter] = useState("All Subjects");
  const [sortBy, setSortBy] = useState("Newest First");
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Material | null>(null);

  const navigate = useNavigate();
  const addToast = useUIStore((s) => s.addToast);

  const filtered = sortMaterials(
    materials.filter((m) => {
      if (typeFilter !== "All Types" && m.type !== typeFilter) return false;
      if (subjectFilter !== "All Subjects" && m.subject !== subjectFilter) return false;
      if (search && !m.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    }),
    sortBy,
  );

  /* ── Context menu actions ── */
  function handleEdit() {
    setOpenMenu(null);
    navigate({ to: "/teacher/materials" });
  }

  function handleDownload(material: Material) {
    setOpenMenu(null);
    addToast(`Downloading ${material.title}...`, "info");
  }

  function handleDeleteClick(material: Material) {
    setOpenMenu(null);
    setDeleteTarget(material);
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setMaterials((prev) => prev.filter((m) => m.id !== deleteTarget.id));
    addToast("Material deleted", "success");
    setDeleteTarget(null);
  }

  function handleDeleteCancel() {
    setDeleteTarget(null);
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
        className="flex items-center justify-between"
      >
        <div>
          <motion.h1
            className="text-display-md text-text-primary"
            initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: duration.slow, ease: ease.gentle }}
          >
            My Materials
          </motion.h1>
          <p className="mt-1 text-body-md text-text-secondary">
            {materials.length} saved materials
          </p>
          {/* Animated accent line */}
          <motion.div
            className="mt-3 h-px bg-gradient-to-r from-orange-500/60 via-orange-400/30 to-transparent"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "100%", opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: ease.gentle }}
          />
        </div>
      </motion.div>

      {/* Filter / Sort Bar */}
      <motion.div
        {...fadeUpProps(12, 0.08, 0.45)}
        className="flex flex-wrap items-center gap-3"
      >
        {/* Type filter */}
        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="appearance-none rounded-[var(--radius-md)] border border-border-subtle bg-bg-elevated px-4 py-2 pr-9 text-body-md text-text-primary outline-none transition-all hover:border-border-strong focus:border-orange-500/50 focus:shadow-[0_0_20px_rgba(242,116,13,0.08)]"
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" />
        </div>

        {/* Subject filter */}
        <div className="relative">
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="appearance-none rounded-[var(--radius-md)] border border-border-subtle bg-bg-elevated px-4 py-2 pr-9 text-body-md text-text-primary outline-none transition-all hover:border-border-strong focus:border-orange-500/50 focus:shadow-[0_0_20px_rgba(242,116,13,0.08)]"
          >
            {SUBJECTS_FILTER.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" />
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none rounded-[var(--radius-md)] border border-border-subtle bg-bg-elevated px-4 py-2 pr-9 text-body-md text-text-primary outline-none transition-all hover:border-border-strong focus:border-orange-500/50 focus:shadow-[0_0_20px_rgba(242,116,13,0.08)]"
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" />
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search materials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-[var(--radius-md)] border border-border-subtle bg-bg-elevated py-2 pl-9 pr-4 text-body-md text-text-primary placeholder:text-text-muted outline-none transition-all hover:border-border-strong focus:border-orange-500/50 focus:shadow-[0_0_20px_rgba(242,116,13,0.08)]"
          />
        </div>

        {/* View toggle */}
        <div className="flex gap-1 rounded-[var(--radius-md)] bg-bg-elevated p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`rounded-[var(--radius-sm)] p-1.5 transition-colors ${
              viewMode === "grid" ? "bg-bg-muted text-text-primary" : "text-text-muted hover:text-text-secondary"
            }`}
          >
            <LayoutGrid size={18} strokeWidth={1.5} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`rounded-[var(--radius-sm)] p-1.5 transition-colors ${
              viewMode === "list" ? "bg-bg-muted text-text-primary" : "text-text-muted hover:text-text-secondary"
            }`}
          >
            <List size={18} strokeWidth={1.5} />
          </button>
        </div>
      </motion.div>

      {/* Invisible overlay to close context menu when clicking outside */}
      {openMenu && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setOpenMenu(null)}
        />
      )}

      {/* Grid view */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((material, i) => (
            <motion.div
              key={material.id}
              {...staggerItemProps(0.12 + i * 0.05)}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3, ease: ease.gentle }}
              className="relative"
            >
              <Link
                to="/teacher/materials"
                className="group relative block overflow-hidden rounded-[var(--radius-lg)] border border-border-subtle bg-bg-surface transition-all duration-200 hover:border-orange-500/30 hover:shadow-[0_4px_24px_rgba(242,116,13,0.12)]"
              >
                {/* Card hover gradient glow overlay */}
                <div className="pointer-events-none absolute inset-0 rounded-[var(--radius-lg)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-orange-500/[0.04] via-transparent to-orange-500/[0.02] z-10" />

                {/* Thumbnail */}
                <div className={`h-24 rounded-t-[var(--radius-lg)] bg-gradient-to-br ${material.gradient} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.08),transparent)]" />
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-body-md font-medium text-text-primary group-hover:text-orange-400 transition-colors line-clamp-2">
                      {material.title}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenMenu(openMenu === material.id ? null : material.id);
                      }}
                      className="shrink-0 rounded-[var(--radius-sm)] p-1 text-text-muted hover:text-text-secondary hover:bg-bg-elevated transition-colors"
                    >
                      <MoreVertical size={16} />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`rounded-[var(--radius-sm)] border px-2 py-0.5 text-caption ${TYPE_COLORS[material.type] ?? ""}`}>
                      {material.type}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-caption text-text-muted">
                    <Clock size={12} strokeWidth={1.5} />
                    <span>{material.date}</span>
                  </div>
                </div>
              </Link>

              {/* Context menu */}
              {openMenu === material.id && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-2 top-28 z-20 w-40 rounded-[var(--radius-md)] border border-border-subtle bg-bg-elevated p-1 shadow-lg"
                >
                  <motion.button
                    whileHover={{ x: 2 }}
                    onClick={() => handleEdit()}
                    className="flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-body-sm text-text-secondary hover:bg-bg-muted hover:text-text-primary transition-colors"
                  >
                    <Edit3 size={14} strokeWidth={1.5} />
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ x: 2 }}
                    onClick={() => handleDownload(material)}
                    className="flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-body-sm text-text-secondary hover:bg-bg-muted hover:text-text-primary transition-colors"
                  >
                    <Download size={14} strokeWidth={1.5} />
                    Download
                  </motion.button>
                  <motion.button
                    whileHover={{ x: 2 }}
                    onClick={() => handleDeleteClick(material)}
                    className="flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-body-sm text-error hover:bg-error-muted transition-colors"
                  >
                    <Trash2 size={14} strokeWidth={1.5} />
                    Delete
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        /* List view */
        <div className="space-y-2">
          {filtered.map((material, i) => {
            const Icon = material.icon;
            return (
              <motion.div
                key={material.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.04, ease: ease.gentle }}
                whileHover={{ x: 4 }}
                className="relative"
              >
                <Link
                  to="/teacher/materials"
                  className="group relative flex items-center gap-4 overflow-hidden rounded-[var(--radius-md)] border border-border-subtle bg-bg-surface p-4 transition-all duration-200 hover:border-orange-500/30 hover:shadow-[0_4px_24px_rgba(242,116,13,0.12)]"
                >
                  {/* List item hover glow */}
                  <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-orange-500/[0.03] via-transparent to-transparent" />

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-bg-elevated text-text-secondary group-hover:text-orange-400 transition-colors">
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-body-md font-medium text-text-primary group-hover:text-orange-400 transition-colors truncate">
                      {material.title}
                    </h3>
                    <div className="mt-0.5 flex items-center gap-2 text-caption text-text-muted">
                      <span>{material.subject}</span>
                      <span className="h-1 w-1 rounded-full bg-text-muted" />
                      <span>{material.cls}</span>
                    </div>
                  </div>
                  <span className={`hidden rounded-[var(--radius-sm)] border px-2 py-0.5 text-caption sm:inline-block ${TYPE_COLORS[material.type] ?? ""}`}>
                    {material.type}
                  </span>
                  <span className="hidden text-caption text-text-muted md:inline-block">{material.date}</span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenMenu(openMenu === material.id ? null : material.id);
                    }}
                    className="shrink-0 rounded-[var(--radius-sm)] p-1 text-text-muted hover:text-text-secondary transition-colors"
                  >
                    <MoreVertical size={16} />
                  </button>
                </Link>

                {/* Context menu for list view */}
                {openMenu === material.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-2 top-14 z-20 w-40 rounded-[var(--radius-md)] border border-border-subtle bg-bg-elevated p-1 shadow-lg"
                  >
                    <motion.button
                      whileHover={{ x: 2 }}
                      onClick={() => handleEdit()}
                      className="flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-body-sm text-text-secondary hover:bg-bg-muted hover:text-text-primary transition-colors"
                    >
                      <Edit3 size={14} strokeWidth={1.5} />
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ x: 2 }}
                      onClick={() => handleDownload(material)}
                      className="flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-body-sm text-text-secondary hover:bg-bg-muted hover:text-text-primary transition-colors"
                    >
                      <Download size={14} strokeWidth={1.5} />
                      Download
                    </motion.button>
                    <motion.button
                      whileHover={{ x: 2 }}
                      onClick={() => handleDeleteClick(material)}
                      className="flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-body-sm text-error hover:bg-error-muted transition-colors"
                    >
                      <Trash2 size={14} strokeWidth={1.5} />
                      Delete
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

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
            <FileText size={40} strokeWidth={1} className="text-text-muted mb-3" />
          </motion.div>
          <p className="text-heading-3 text-text-secondary">No materials found</p>
          <p className="mt-1 text-body-sm text-text-muted">Try adjusting your filters.</p>
        </motion.div>
      )}

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Material"
        message={`Are you sure you want to delete "${deleteTarget?.title ?? ""}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}
