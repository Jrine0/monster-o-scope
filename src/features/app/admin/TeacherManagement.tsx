import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import {
  Plus,
  Upload,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Mail,
  ArrowUpDown,
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

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTeachers,
  createTeacher,
  updateTeacher,
  deactivateTeacher,
} from "./teachers.api";

/* ── Types ── */
interface Teacher {
  id: string;
  name: string;
  email: string;
  subject: string;
  classes: string;
  status: "active" | "invited";
  avatar: string;
}

/* ── Helpers ── */
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const INPUT_CLASS =
  "w-full rounded-md border border-border-subtle bg-bg-elevated py-2.5 px-3 text-body-sm text-text-primary outline-none transition-all focus:border-orange-500";

/* ── Animation ── */
const tableVariants = staggerContainer(staggerDelay.tight, 0, true);
const rowVariants = slideIn(-6, duration.fast, ease.standard);

/* ── Animated Background ── */
function AnimatedBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      aria-hidden
    >
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
          backgroundImage:
            "radial-gradient(circle, rgba(101,113,245,0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Floating particles */}
      {[...Array(7)].map((_, i) => (
        <motion.div
          key={`teacher-mgmt-particle-${i}`}
          className="absolute rounded-full"
          style={{
            width: i % 3 === 0 ? 3 : 2,
            height: i % 3 === 0 ? 3 : 2,
            left: `${10 + ((i * 12.5) % 80)}%`,
            top: `${30 + ((i * 9.1) % 50)}%`,
            background:
              i % 2 === 0 ? "rgba(101,113,245,0.6)" : "rgba(101,113,245,0.35)",
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

/* ── Teacher Form (shared between Add and Edit) ── */
interface TeacherFormData {
  name: string;
  email: string;
  subject: string;
  classes: string;
}

function TeacherForm({
  initial,
  onSubmit,
  submitLabel,
}: {
  initial: TeacherFormData;
  onSubmit: (data: TeacherFormData) => void;
  submitLabel: string;
}) {
  const [form, setForm] = useState<TeacherFormData>(initial);

  /* Reset form when initial values change (e.g. opening modal for a different teacher) */
  useEffect(() => {
    setForm(initial);
  }, [initial]);

  function handleChange(field: keyof TeacherFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-body-sm font-medium text-text-secondary">
          Name
        </label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className={INPUT_CLASS}
          placeholder="Full name"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-body-sm font-medium text-text-secondary">
          Email
        </label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className={INPUT_CLASS}
          placeholder="teacher@school.edu"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-body-sm font-medium text-text-secondary">
          Subject
        </label>
        <input
          type="text"
          required
          value={form.subject}
          onChange={(e) => handleChange("subject", e.target.value)}
          className={INPUT_CLASS}
          placeholder="e.g. Mathematics"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-body-sm font-medium text-text-secondary">
          Classes
        </label>
        <input
          type="text"
          required
          value={form.classes}
          onChange={(e) => handleChange("classes", e.target.value)}
          className={INPUT_CLASS}
          placeholder="e.g. 10-A, 10-B"
        />
      </div>
      <div className="flex justify-end gap-3 border-t border-border-subtle pt-4">
        <button
          type="submit"
          className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-orange-500 px-4 py-2.5 text-body-sm font-medium text-white shadow-sm transition-colors hover:bg-orange-600"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

/* ── More Actions Dropdown ── */
function MoreDropdown({
  open,
  onToggle,
  onClose,
}: {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const addToast = useUIStore((s) => s.addToast);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* Close dropdown when clicking outside */
  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onToggle}
        className="rounded-sm p-1.5 text-text-muted transition-colors hover:bg-bg-muted hover:text-text-secondary"
      >
        <MoreHorizontal size={14} strokeWidth={1.5} />
      </motion.button>

      {open && (
        <div className="absolute right-0 top-full z-30 mt-1 w-44 overflow-hidden rounded-md border border-border-subtle bg-bg-surface shadow-lg">
          <Link
            to="/admin/teachers"
            className="flex w-full items-center px-3 py-2 text-body-sm text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary"
            onClick={onClose}
            disabled={true}
          >
            View Details
          </Link>
          <button
            type="button"
            onClick={() => {
              addToast("Password reset link sent", "success");
              onClose();
            }}
            className="flex w-full cursor-pointer items-center px-3 py-2 text-body-sm text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary"
          >
            Reset Password
          </button>
          <button
            type="button"
            onClick={() => {
              addToast("Teacher account deactivated", "info");
              onClose();
            }}
            className="flex w-full cursor-pointer items-center px-3 py-2 text-body-sm text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary"
          >
            Deactivate
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Main Component ── */
export function TeacherManagement() {
  const addToast = useUIStore((s) => s.addToast);

  const queryClient = useQueryClient();

  
  /* UI state */
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [deletingTeacherId, setDeletingTeacherId] = useState<string | null>(
    null,
  );
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  
  const { data, isLoading } = useQuery({
    queryKey: ["teachers", searchQuery],
    queryFn: () => fetchTeachers(1, searchQuery),
  });

  const teachers: Teacher[] =
    data?.data?.map((t: any) => ({
      id: t.id,
      name: `${t.first_name} ${t.last_name}`,
      email: t.email,
      subject: "—",
      classes: "—",
      status: t.is_active ? "active" : "invited",
      avatar: getInitials(`${t.first_name} ${t.last_name}`),
    })) ?? [];

  const deletingTeacher = deletingTeacherId
    ? (teachers.find((t) => t.id === deletingTeacherId) ?? null)
    : null;

  /* ── Handlers ── */
  const createTeacherMutation = useMutation({
    mutationFn: createTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      addToast("Teacher added successfully", "success");
      setShowAddModal(false);
    },
  });

  function handleAddTeacher(data: TeacherFormData) {
    const [first_name, ...rest] = data.name.split(" ");

    createTeacherMutation.mutate({
      first_name,
      last_name: rest.join(" ") || "",
      email: data.email,
    });
  }

  const updateTeacherMutation = useMutation({
    mutationFn: ({ id, data }: any) => updateTeacher(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      addToast("Teacher updated successfully", "success");
      setEditingTeacher(null);
    },
  });

  function handleEditTeacher(data: TeacherFormData) {
    if (!editingTeacher) return;

    const [first_name, ...rest] = data.name.split(" ");

    updateTeacherMutation.mutate({
      id: editingTeacher.id,
      data: {
        first_name,
        last_name: rest.join(" "),
      },
    });
  }

  const deleteTeacherMutation = useMutation({
    mutationFn: deactivateTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      addToast("Teacher deactivated", "success");
      setDeletingTeacherId(null);
    },
  });

  function handleDeleteTeacher() {
    if (!deletingTeacherId) return;
    deleteTeacherMutation.mutate(deletingTeacherId);
  }

  if (isLoading) {
    return <div className="p-6 text-text-muted">Loading teachers...</div>;
  }

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
              <h1 className="text-heading-1 text-text-primary">Teachers</h1>
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 20,
                  delay: 0.2,
                }}
                className="inline-flex items-center rounded-full bg-orange-500/10 px-2.5 py-0.5 text-caption text-orange-400"
              >
                {teachers.length}
              </motion.span>
            </div>
            <AccentLine />
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-md border border-border-subtle bg-bg-surface px-4 py-2.5 text-body-sm font-medium text-text-secondary transition-colors hover:border-border-default hover:text-text-primary"
            >
              <Upload size={16} strokeWidth={1.5} />
              Upload CSV
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2.5 text-body-sm font-medium text-white shadow-sm transition-colors hover:bg-orange-600"
            >
              <Plus size={16} strokeWidth={1.5} />
              Add Teacher
            </motion.button>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div {...fadeUpProps(8, 0.1, 0.4, ease.standard)}>
          <div className="relative max-w-sm">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              placeholder="Search teachers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-border-subtle bg-bg-elevated py-2.5 pl-9 pr-4 text-body-sm text-text-primary placeholder:text-text-muted outline-none transition-all focus:border-orange-500 focus:shadow-[0_0_20px_rgba(101,113,245,0.08)]"
            />
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          {...fadeUpProps(12, 0.15, 0.45, ease.standard)}
          className="group/table overflow-hidden rounded-lg border border-border-subtle bg-bg-surface transition-all hover:shadow-[0_0_30px_rgba(101,113,245,0.04)]"
        >
          {/* Gradient glow overlay */}
          <div
            className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-500 group-hover/table:opacity-100"
            style={{
              background:
                "linear-gradient(135deg, rgba(101,113,245,0.02) 0%, transparent 60%)",
            }}
          />

          {/* Table header */}
          <div className="grid grid-cols-[2fr_2fr_1.2fr_1.5fr_100px_80px] gap-4 border-b border-border-subtle px-5 py-3">
            <div className="flex items-center gap-1">
              <span className="text-overline text-text-muted">Name</span>
              <ArrowUpDown size={12} className="text-text-muted" />
            </div>
            <span className="text-overline text-text-muted">Email</span>
            <span className="text-overline text-text-muted">Subject</span>
            <span className="text-overline text-text-muted">Classes</span>
            <span className="text-overline text-text-muted">Status</span>
            <span className="text-overline text-text-muted text-right">
              Actions
            </span>
          </div>

          {/* Table body */}
          <motion.div variants={tableVariants} initial="hidden" animate="show">
            {teachers.map((teacher) => (
              <motion.div
                key={teacher.id}
                variants={rowVariants}
                className="grid grid-cols-[2fr_2fr_1.2fr_1.5fr_100px_80px] items-center gap-4 border-b border-border-subtle px-5 py-3 last:border-b-0 transition-colors hover:bg-bg-elevated"
              >
                {/* Name + avatar */}
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500/15">
                    <span className="text-caption text-orange-400 font-semibold">
                      {teacher.avatar}
                    </span>
                  </div>
                  <Link
                    to="/admin/teachers"
                    className="text-body-md text-text-primary font-medium hover:text-orange-400 transition-colors truncate"
                    disabled={true}
                  >
                    {teacher.name}
                  </Link>
                </div>

                {/* Email */}
                <div className="flex items-center gap-1.5 text-body-sm text-text-secondary truncate">
                  <Mail size={13} className="shrink-0 text-text-muted" />
                  <span className="truncate">{teacher.email}</span>
                </div>

                {/* Subject */}
                <span className="text-body-sm text-text-secondary">
                  {teacher.subject}
                </span>

                {/* Classes */}
                <span className="text-body-sm text-text-secondary truncate">
                  {teacher.classes}
                </span>

                {/* Status */}
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-caption font-medium ${
                    teacher.status === "active"
                      ? "bg-success-muted text-success"
                      : "bg-info-muted text-info"
                  }`}
                >
                  {teacher.status === "active" ? "Active" : "Invited"}
                </motion.span>

                {/* Actions */}
                <div className="flex items-center justify-end gap-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setEditingTeacher(teacher)}
                    className="rounded-sm p-1.5 text-text-muted transition-colors hover:bg-bg-muted hover:text-text-secondary"
                  >
                    <Pencil size={14} strokeWidth={1.5} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setDeletingTeacherId(teacher.id)}
                    className="rounded-sm p-1.5 text-text-muted transition-colors hover:bg-error-muted hover:text-error"
                  >
                    <Trash2 size={14} strokeWidth={1.5} />
                  </motion.button>
                  <MoreDropdown
                    open={openDropdownId === teacher.id}
                    onToggle={() =>
                      setOpenDropdownId((prev) =>
                        prev === teacher.id ? null : teacher.id,
                      )
                    }
                    onClose={() => setOpenDropdownId(null)}
                  />
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
            Showing {teachers.length} of {teachers.length} teachers
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

      {/* ── Add Teacher Modal ── */}
      <FormModal
        open={showAddModal}
        title="Add Teacher"
        onClose={() => setShowAddModal(false)}
      >
        <TeacherForm
          initial={{ name: "", email: "", subject: "", classes: "" }}
          onSubmit={handleAddTeacher}
          submitLabel="Add Teacher"
        />
      </FormModal>

      {/* ── Edit Teacher Modal ── */}
      <FormModal
        open={editingTeacher !== null}
        title="Edit Teacher"
        onClose={() => setEditingTeacher(null)}
      >
        <TeacherForm
          initial={
            editingTeacher
              ? {
                  name: editingTeacher.name,
                  email: editingTeacher.email,
                  subject: editingTeacher.subject,
                  classes: editingTeacher.classes,
                }
              : { name: "", email: "", subject: "", classes: "" }
          }
          onSubmit={handleEditTeacher}
          submitLabel="Save Changes"
        />
      </FormModal>

      {/* ── Delete Confirm Dialog ── */}
      <ConfirmDialog
        open={deletingTeacher !== null}
        title="Delete Teacher"
        message={`Are you sure you want to remove ${deletingTeacher?.name ?? "this teacher"}? This action cannot be undone.`}
        variant="danger"
        confirmLabel="Delete"
        onConfirm={handleDeleteTeacher}
        onCancel={() => setDeletingTeacherId(null)}
      />
    </>
  );
}
