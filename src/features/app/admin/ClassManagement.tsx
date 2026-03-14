import { motion } from "motion/react";
import {
  Plus,
  Users,
  GraduationCap,
  BookOpen,
  MoreHorizontal,
} from "lucide-react";
import { staggerContainer, cardReveal, ease } from "@/lib/animation";
import AccentLine from "@/components/accent-line";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchClasses, createClass } from "./classes.api";

/* ── Animation ── */
const containerVariants = staggerContainer(0.06, 0, true);
const cardVariants = cardReveal(16, 0.4, ease.standard);

/* ── Animated Background ── */
function AnimatedBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      aria-hidden
    >
      {/* orange blob - top right */}
      <motion.div
        className="absolute -top-32 right-[10%] h-[500px] w-[500px] rounded-full opacity-[0.07]"
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
        className="absolute bottom-[10%] left-[5%] h-[400px] w-[400px] rounded-full opacity-[0.06]"
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
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`class-mgmt-particle-${i}`}
          className="absolute rounded-full"
          style={{
            width: i % 3 === 0 ? 3 : 2,
            height: i % 3 === 0 ? 3 : 2,
            left: `${6 + ((i * 10.8) % 86)}%`,
            top: `${26 + ((i * 9.5) % 54)}%`,
            background:
              i % 2 === 0 ? "rgba(101,113,245,0.6)" : "rgba(101,113,245,0.35)",
          }}
          animate={{
            y: [0, -95 - i * 7],
            x: [0, i % 2 === 0 ? 14 : -14],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: 5 + (i % 4) * 1.5,
            repeat: Infinity,
            delay: i * 0.45,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

export function ClassManagement() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["classes"],
    queryFn: () => fetchClasses(1),
  });

  const classes: {
    id: string;
    name: string;
    teacher: string;
    teacherAvatar: string;
    studentCount: number;
    subjects: string[];
    color: string;
  }[] =
    data?.data?.map((c: any) => ({
      id: c.id,
      name: c.name,
      teacher: c.teacher_name ?? "Unassigned",
      teacherAvatar: c.teacher_name
        ? c.teacher_name
            .split(" ")
            .map((p: string) => p[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
        : "--",
      studentCount: 0, // backend does not provide this yet
      subjects: [c.subject],
      color: "orange",
    })) ?? [];

  const createClassMutation = useMutation({
    mutationFn: createClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });

  if (isLoading) {
    return <div className="p-6 text-text-muted">Loading classes...</div>;
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
              <h1 className="text-heading-1 text-text-primary">Classes</h1>
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
                {classes.length}
              </motion.span>
            </div>
            <AccentLine />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() =>
              createClassMutation.mutate({
                name: "New Class",
                grade: 10,
                subject: "Mathematics",
              })
            }
            className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2.5 text-body-sm font-medium text-white shadow-sm transition-colors hover:bg-orange-600"
          >
            <Plus size={16} strokeWidth={1.5} />
            Create Class
          </motion.button>
        </motion.div>

        {/* Class grid */}
        <motion.div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {classes.map((cls) => (
            <motion.div
              key={cls.id}
              variants={cardVariants}
              whileHover={{
                y: -4,
                boxShadow: "0 8px 30px rgba(101,113,245,0.08)",
              }}
              className="group relative overflow-hidden rounded-lg border border-border-subtle bg-bg-surface p-5 transition-all hover:border-border-default"
            >
              {/* Gradient glow overlay on hover */}
              <div
                className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(101,113,245,0.03) 0%, transparent 60%)",
                }}
              />

              {/* Card header */}
              <div className="relative flex items-start justify-between">
                <h3 className="text-heading-3 text-text-primary">{cls.name}</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="rounded-sm p-1 text-text-muted opacity-0 transition-all group-hover:opacity-100 hover:bg-bg-muted hover:text-text-secondary"
                >
                  <MoreHorizontal size={16} strokeWidth={1.5} />
                </motion.button>
              </div>

              {/* Teacher */}
              <div className="relative mt-3 flex items-center gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500/15">
                  <span
                    className="text-caption text-orange-400 font-semibold"
                    style={{ fontSize: "10px" }}
                  >
                    {cls.teacherAvatar}
                  </span>
                </div>
                <div>
                  <p className="text-body-sm text-text-primary font-medium">
                    {cls.teacher}
                  </p>
                  <p className="text-caption text-text-muted">Class Teacher</p>
                </div>
              </div>

              {/* Stats */}
              <div className="relative mt-4 flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-body-sm text-text-secondary">
                  <GraduationCap
                    size={14}
                    className="text-text-muted"
                    strokeWidth={1.5}
                  />
                  <span>{cls.studentCount} students</span>
                </div>
                <div className="flex items-center gap-1.5 text-body-sm text-text-secondary">
                  <BookOpen
                    size={14}
                    className="text-text-muted"
                    strokeWidth={1.5}
                  />
                  <span>{cls.subjects.length} subjects</span>
                </div>
              </div>

              {/* Subjects */}
              <div className="relative mt-3 flex flex-wrap gap-1.5">
                {cls.subjects.map((subject) => (
                  <motion.span
                    key={subject}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="rounded-full bg-bg-elevated px-2.5 py-0.5 text-caption text-text-secondary"
                  >
                    {subject}
                  </motion.span>
                ))}
              </div>

              {/* Card footer */}
              <div className="relative mt-4 flex items-center gap-2 border-t border-border-subtle pt-3">
                <Users
                  size={14}
                  className="text-text-muted"
                  strokeWidth={1.5}
                />
                <span className="text-body-sm text-text-muted">
                  Manage class
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </>
  );
}
