import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import {
  Plus,
  Upload,
  Search,
  Pencil,
  Trash2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ChevronDown,
  Hash,
} from "lucide-react";
import {
  staggerContainer,
  slideIn,
  fadeUpProps,
  ease,
  duration,
  staggerDelay,
} from "@/lib/animation";
import { useUIStore } from "@/stores/useUIStore";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FormModal } from "@/components/ui/form-modal";
import AccentLine from "@/components/accent-line";

/* ── Types ── */
interface Student {
  id: string;
  name: string;
  studentId: string;
  class: string;
  section: string;
  status: "active" | "inactive";
  avatar: string;
}

/* ── Initial mock data ── */
const INITIAL_STUDENTS: Student[] = [
  {
    id: "s1",
    name: "Aarav Sharma",
    studentId: "STU-2025-001",
    class: "10",
    section: "A",
    status: "active",
    avatar: "AS",
  },
  {
    id: "s2",
    name: "Diya Patel",
    studentId: "STU-2025-002",
    class: "10",
    section: "A",
    status: "active",
    avatar: "DP",
  },
  {
    id: "s3",
    name: "Vihaan Reddy",
    studentId: "STU-2025-003",
    class: "10",
    section: "B",
    status: "active",
    avatar: "VR",
  },
  {
    id: "s4",
    name: "Ananya Iyer",
    studentId: "STU-2025-004",
    class: "9",
    section: "A",
    status: "active",
    avatar: "AI",
  },
  {
    id: "s5",
    name: "Ishaan Gupta",
    studentId: "STU-2025-005",
    class: "9",
    section: "A",
    status: "inactive",
    avatar: "IG",
  },
  {
    id: "s6",
    name: "Saanvi Deshmukh",
    studentId: "STU-2025-006",
    class: "9",
    section: "B",
    status: "active",
    avatar: "SD",
  },
  {
    id: "s7",
    name: "Arjun Nair",
    studentId: "STU-2025-007",
    class: "8",
    section: "A",
    status: "active",
    avatar: "AN",
  },
  {
    id: "s8",
    name: "Myra Tiwari",
    studentId: "STU-2025-008",
    class: "8",
    section: "B",
    status: "active",
    avatar: "MT",
  },
  {
    id: "s9",
    name: "Reyansh Mehta",
    studentId: "STU-2025-009",
    class: "10",
    section: "B",
    status: "active",
    avatar: "RM",
  },
  {
    id: "s10",
    name: "Kavya Joshi",
    studentId: "STU-2025-010",
    class: "8",
    section: "A",
    status: "active",
    avatar: "KJ",
  },
];

const CLASS_OPTIONS = ["All Classes", "8", "9", "10"] as const;
const SECTION_OPTIONS = ["All Sections", "A", "B", "C"] as const;
const CLASS_FORM_OPTIONS = ["8", "9", "10"] as const;
const SECTION_FORM_OPTIONS = ["A", "B", "C"] as const;

/* ── Animation ── */
const tableVariants = staggerContainer(staggerDelay.tight, 0, true);
const rowVariants = slideIn(-6, duration.fast, ease.standard);

/* ── Animated Background ── */
function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      {/* orange blob - top right */}
      <motion.div
        className="absolute -top-32 right-[10%] h-125 w-125 rounded-full opacity-[0.07]"
        style={{
          background: "radial-gradient(circle, #6571f5 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
        animate={{
          x: [0, 25, -20, 0],
          y: [0, -20, 15, 0],
          scale: [1, 1.05, 0.97, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      />
      {/* orange blob - bottom left */}
      <motion.div
        className="absolute bottom-[10%] left-[5%] h-100 w-100 rounded-full opacity-[0.06]"
        style={{
          background: "radial-gradient(circle, #6571f5 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
        animate={{
          x: [0, -15, 20, 0],
          y: [0, 20, -15, 0],
          scale: [1, 0.96, 1.04, 1],
        }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      />

      {/* Dot grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(101,113,245,0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Floating particles */}
      {[...Array(7)].map((_, i) => (
        <motion.div
          key={`student-mgmt-particle-${i}`}
          className="absolute rounded-full"
          style={{
            width: i % 3 === 0 ? 3 : 2,
            height: i % 3 === 0 ? 3 : 2,
            left: `${8 + ((i * 11.3) % 82)}%`,
            top: `${32 + ((i * 8.7) % 48)}%`,
            background: i % 2 === 0
              ? "rgba(101,113,245,0.6)"
              : "rgba(101,113,245,0.35)",
          }}
          animate={{
            y: [0, -90 - i * 8],
            x: [0, i % 2 === 0 ? 12 : -12],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: 5 + (i % 4) * 1.5,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

/* ── Helper: generate initials from name ── */
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/* ── Helper: generate next student ID ── */
let idCounter = 11;
function nextId(): string {
  const num = idCounter++;
  return `STU-2025-${String(num).padStart(3, "0")}`;
}

export function StudentManagement() {
  const addToast = useUIStore((s) => s.addToast);

  /* ── Student state ── */
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);

  /* ── Search & filters ── */
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("All Classes");
  const [sectionFilter, setSectionFilter] = useState("All Sections");
  const [currentPage] = useState(1);

  /* ── Add modal ── */
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    studentId: "",
    class: "8",
    section: "A",
  });

  /* ── Edit modal ── */
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Student | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    studentId: "",
    class: "8",
    section: "A",
  });

  /* ── Delete dialog ── */
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);

  /* ── More dropdown ── */
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* Close dropdown on outside click */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdownId(null);
      }
    }
    if (openDropdownId) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdownId]);

  /* ── Handlers ── */
  function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newStudent: Student = {
      id: `s${Date.now()}`,
      name: addForm.name.trim(),
      studentId: addForm.studentId.trim() || nextId(),
      class: addForm.class,
      section: addForm.section,
      status: "active",
      avatar: getInitials(addForm.name.trim()),
    };
    setStudents((prev) => [...prev, newStudent]);
    addToast("Student added successfully", "success");
    setAddModalOpen(false);
    setAddForm({ name: "", studentId: "", class: "8", section: "A" });
  }

  function openEdit(student: Student) {
    setEditTarget(student);
    setEditForm({
      name: student.name,
      studentId: student.studentId,
      class: student.class,
      section: student.section,
    });
    setEditModalOpen(true);
  }

  function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editTarget) return;
    setStudents((prev) =>
      prev.map((s) =>
        s.id === editTarget.id
          ? {
              ...s,
              name: editForm.name.trim(),
              studentId: editForm.studentId.trim(),
              class: editForm.class,
              section: editForm.section,
              avatar: getInitials(editForm.name.trim()),
            }
          : s,
      ),
    );
    addToast("Student updated", "success");
    setEditModalOpen(false);
    setEditTarget(null);
  }

  function openDelete(student: Student) {
    setDeleteTarget(student);
    setDeleteDialogOpen(true);
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setStudents((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    addToast("Student removed", "success");
    setDeleteDialogOpen(false);
    setDeleteTarget(null);
  }

  function handleDeleteCancel() {
    setDeleteDialogOpen(false);
    setDeleteTarget(null);
  }

  /* ── Filtering ── */
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass =
      classFilter === "All Classes" || s.class === classFilter;
    const matchesSection =
      sectionFilter === "All Sections" || s.section === sectionFilter;
    return matchesSearch && matchesClass && matchesSection;
  });

  /* ── Shared form field styles ── */
  const inputClassName =
    "w-full rounded-md border border-border-subtle bg-bg-elevated py-2.5 px-3 text-body-sm text-text-primary outline-none transition-all focus:border-orange-500";
  const selectClassName =
    "w-full appearance-none rounded-md border border-border-subtle bg-bg-elevated py-2.5 px-3 text-body-sm text-text-primary outline-none transition-all focus:border-orange-500";

  return (
    <>
      <AnimatedBackground />
      <div className="relative space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.4, ease: ease.standard }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-heading-1 text-text-primary">Students</h1>
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.2 }}
                className="inline-flex items-center rounded-full bg-orange-500/10 px-2.5 py-0.5 text-caption text-orange-400"
              >
                {students.length}
              </motion.span>
            </div>
            <AccentLine />
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => addToast("CSV upload feature coming soon", "info")}
              className="inline-flex items-center gap-2 rounded-md border border-border-subtle bg-bg-surface px-4 py-2.5 text-body-sm font-medium text-text-secondary transition-colors hover:border-border-default hover:text-text-primary"
            >
              <Upload size={16} strokeWidth={1.5} />
              Upload CSV
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setAddModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2.5 text-body-sm font-medium text-white shadow-sm transition-colors hover:bg-orange-600"
            >
              <Plus size={16} strokeWidth={1.5} />
              Add Student
            </motion.button>
          </div>
        </motion.div>

        {/* Filters row */}
        <motion.div
          {...fadeUpProps(8, 0.1, 0.4, ease.standard)}
          className="flex flex-wrap items-center gap-3"
        >
          <div className="relative max-w-sm flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-border-subtle bg-bg-elevated py-2.5 pl-9 pr-4 text-body-sm text-text-primary placeholder:text-text-muted outline-none transition-all focus:border-orange-500 focus:shadow-[0_0_20px_rgba(101,113,245,0.08)]"
            />
          </div>

          {/* Class filter */}
          <div className="relative">
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="appearance-none rounded-md border border-border-subtle bg-bg-elevated py-2.5 pl-3 pr-9 text-body-sm text-text-secondary outline-none transition-all focus:border-orange-500 focus:shadow-[0_0_20px_rgba(101,113,245,0.08)]"
            >
              {CLASS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === "All Classes" ? opt : `Class ${opt}`}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
          </div>

          {/* Section filter */}
          <div className="relative">
            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="appearance-none rounded-md border border-border-subtle bg-bg-elevated py-2.5 pl-3 pr-9 text-body-sm text-text-secondary outline-none transition-all focus:border-orange-500 focus:shadow-[0_0_20px_rgba(101,113,245,0.08)]"
            >
              {SECTION_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === "All Sections" ? opt : `Section ${opt}`}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          {...fadeUpProps(12, 0.15, 0.45, ease.standard)}
          className="group/table overflow-hidden rounded-lg border border-border-subtle bg-bg-surface transition-all hover:shadow-[0_0_30px_rgba(101,113,245,0.04)]"
        >
          {/* Gradient glow overlay */}
          <div className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-500 group-hover/table:opacity-100"
            style={{
              background: "linear-gradient(135deg, rgba(101,113,245,0.02) 0%, transparent 60%)",
            }}
          />

          {/* Table header */}
          <div className="grid grid-cols-[2fr_1.5fr_80px_80px_100px_80px] gap-4 border-b border-border-subtle px-5 py-3">
            <div className="flex items-center gap-1">
              <span className="text-overline text-text-muted">Name</span>
              <ArrowUpDown size={12} className="text-text-muted" />
            </div>
            <span className="text-overline text-text-muted">Student ID</span>
            <span className="text-overline text-text-muted">Class</span>
            <span className="text-overline text-text-muted">Section</span>
            <span className="text-overline text-text-muted">Status</span>
            <span className="text-overline text-text-muted text-right">
              Actions
            </span>
          </div>

          {/* Table body */}
          <motion.div variants={tableVariants} initial="hidden" animate="show">
            {filteredStudents.map((student) => (
              <motion.div
                key={student.id}
                variants={rowVariants}
                className="grid grid-cols-[2fr_1.5fr_80px_80px_100px_80px] items-center gap-4 border-b border-border-subtle px-5 py-3 last:border-b-0 transition-colors hover:bg-bg-elevated"
              >
                {/* Name + avatar */}
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500/15">
                    <span className="text-caption text-orange-400 font-semibold">
                      {student.avatar}
                    </span>
                  </div>
                  <span className="text-body-md text-text-primary font-medium truncate">
                    {student.name}
                  </span>
                </div>

                {/* Student ID */}
                <div className="flex items-center gap-1.5 text-body-sm text-text-secondary">
                  <Hash size={13} className="shrink-0 text-text-muted" />
                  <span className="font-mono text-body-sm">{student.studentId}</span>
                </div>

                {/* Class */}
                <span className="text-body-sm text-text-secondary text-center">
                  {student.class}
                </span>

                {/* Section */}
                <span className="text-body-sm text-text-secondary text-center">
                  {student.section}
                </span>

                {/* Status */}
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-caption font-medium ${
                    student.status === "active"
                      ? "bg-success-muted text-success"
                      : "bg-bg-muted text-text-muted"
                  }`}
                >
                  {student.status === "active" ? "Active" : "Inactive"}
                </motion.span>

                {/* Actions */}
                <div className="flex items-center justify-end gap-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => openEdit(student)}
                    className="rounded-sm p-1.5 text-text-muted transition-colors hover:bg-bg-muted hover:text-text-secondary"
                  >
                    <Pencil size={14} strokeWidth={1.5} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => openDelete(student)}
                    className="rounded-sm p-1.5 text-text-muted transition-colors hover:bg-error-muted hover:text-error"
                  >
                    <Trash2 size={14} strokeWidth={1.5} />
                  </motion.button>
                  <div className="relative" ref={openDropdownId === student.id ? dropdownRef : undefined}>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                        setOpenDropdownId((prev) =>
                          prev === student.id ? null : student.id,
                        )
                      }
                      className="rounded-sm p-1.5 text-text-muted transition-colors hover:bg-bg-muted hover:text-text-secondary"
                    >
                      <MoreHorizontal size={14} strokeWidth={1.5} />
                    </motion.button>

                    {/* Dropdown menu */}
                    {openDropdownId === student.id && (
                      <div className="absolute right-0 top-full z-30 mt-1 w-44 overflow-hidden rounded-md border border-border-subtle bg-bg-surface shadow-lg">
                        <button
                          type="button"
                          onClick={() => {
                            addToast("Student detail view coming soon", "info");
                            setOpenDropdownId(null);
                          }}
                          className="w-full px-3 py-2 text-left text-body-sm text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary"
                        >
                          View Details
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            addToast("Password has been reset", "success");
                            setOpenDropdownId(null);
                          }}
                          className="w-full px-3 py-2 text-left text-body-sm text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary"
                        >
                          Reset Password
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            addToast("Student account deactivated", "info");
                            setOpenDropdownId(null);
                          }}
                          className="w-full px-3 py-2 text-left text-body-sm text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary"
                        >
                          Deactivate
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Pagination */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="flex items-center justify-between"
        >
          <p className="text-body-sm text-text-muted">
            Showing {filteredStudents.length} of {students.length} students
          </p>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled
              className="inline-flex items-center gap-1 rounded-md border border-border-subtle bg-bg-surface px-3 py-1.5 text-body-sm text-text-muted disabled:opacity-40"
            >
              <ChevronLeft size={14} />
              Previous
            </motion.button>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-orange-500/10 text-body-sm text-orange-400 font-medium">
              {currentPage}
            </span>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-1 rounded-md border border-border-subtle bg-bg-surface px-3 py-1.5 text-body-sm text-text-secondary transition-colors hover:border-border-default hover:text-text-primary"
            >
              Next
              <ChevronRight size={14} />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* ── Add Student Modal ── */}
      <FormModal
        open={addModalOpen}
        title="Add Student"
        onClose={() => setAddModalOpen(false)}
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-body-sm font-medium text-text-secondary">
              Name
            </label>
            <input
              type="text"
              required
              value={addForm.name}
              onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Full name"
              className={inputClassName}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-body-sm font-medium text-text-secondary">
              Student ID
            </label>
            <input
              type="text"
              value={addForm.studentId}
              onChange={(e) => setAddForm((f) => ({ ...f, studentId: e.target.value }))}
              placeholder="Auto-generated if empty"
              className={inputClassName}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-body-sm font-medium text-text-secondary">
                Class
              </label>
              <select
                value={addForm.class}
                onChange={(e) => setAddForm((f) => ({ ...f, class: e.target.value }))}
                className={selectClassName}
              >
                {CLASS_FORM_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    Class {opt}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-body-sm font-medium text-text-secondary">
                Section
              </label>
              <select
                value={addForm.section}
                onChange={(e) => setAddForm((f) => ({ ...f, section: e.target.value }))}
                className={selectClassName}
              >
                {SECTION_FORM_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    Section {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 border-t border-border-subtle pt-4">
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="rounded-md border border-border-default bg-transparent px-4 py-2 text-body-sm font-semibold text-text-secondary transition-colors hover:bg-bg-elevated"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-orange-500 px-4 py-2 text-body-sm font-semibold text-white transition-colors hover:bg-orange-600"
            >
              Add Student
            </button>
          </div>
        </form>
      </FormModal>

      {/* ── Edit Student Modal ── */}
      <FormModal
        open={editModalOpen}
        title="Edit Student"
        onClose={() => {
          setEditModalOpen(false);
          setEditTarget(null);
        }}
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-body-sm font-medium text-text-secondary">
              Name
            </label>
            <input
              type="text"
              required
              value={editForm.name}
              onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Full name"
              className={inputClassName}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-body-sm font-medium text-text-secondary">
              Student ID
            </label>
            <input
              type="text"
              required
              value={editForm.studentId}
              onChange={(e) => setEditForm((f) => ({ ...f, studentId: e.target.value }))}
              placeholder="Student ID"
              className={inputClassName}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-body-sm font-medium text-text-secondary">
                Class
              </label>
              <select
                value={editForm.class}
                onChange={(e) => setEditForm((f) => ({ ...f, class: e.target.value }))}
                className={selectClassName}
              >
                {CLASS_FORM_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    Class {opt}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-body-sm font-medium text-text-secondary">
                Section
              </label>
              <select
                value={editForm.section}
                onChange={(e) => setEditForm((f) => ({ ...f, section: e.target.value }))}
                className={selectClassName}
              >
                {SECTION_FORM_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    Section {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 border-t border-border-subtle pt-4">
            <button
              type="button"
              onClick={() => {
                setEditModalOpen(false);
                setEditTarget(null);
              }}
              className="rounded-md border border-border-default bg-transparent px-4 py-2 text-body-sm font-semibold text-text-secondary transition-colors hover:bg-bg-elevated"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-orange-500 px-4 py-2 text-body-sm font-semibold text-white transition-colors hover:bg-orange-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </FormModal>

      {/* ── Delete Confirm Dialog ── */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Remove Student"
        message={
          deleteTarget
            ? `Are you sure you want to remove ${deleteTarget.name}? This action cannot be undone.`
            : ""
        }
        confirmLabel="Remove"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </>
  );
}
