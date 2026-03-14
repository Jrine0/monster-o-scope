import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Download,
  FileText,
  Edit3,
  BookOpen,
  GraduationCap,
  Layers,
  Tag,
} from "lucide-react";
import { ease, fadeUpProps, staggerItemProps, duration } from "@/lib/animation";

/* ── Mock data ── */
const ITEM = {
  id: "1",
  title: "Atoms and Molecules",
  subject: "Chemistry",
  cls: "Class 9",
  chapter: "Chapter 3",
  type: "Lesson Plan",
};

const RELATED = [
  { id: "2", title: "Chemical Reactions and Equations", subject: "Chemistry", cls: "Class 10" },
  { id: "3", title: "Structure of the Atom", subject: "Chemistry", cls: "Class 9" },
  { id: "4", title: "Periodic Classification of Elements", subject: "Chemistry", cls: "Class 10" },
] as const;

const META_ITEMS = [
  { label: "Subject", value: ITEM.subject, icon: BookOpen, color: "text-amber-400 bg-amber-500/10" },
  { label: "Class", value: ITEM.cls, icon: GraduationCap, color: "text-blue-400 bg-blue-500/10" },
  { label: "Chapter", value: ITEM.chapter, icon: Layers, color: "text-purple-400 bg-purple-500/10" },
  { label: "Type", value: ITEM.type, icon: Tag, color: "text-orange-400 bg-orange-500/10" },
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

export function LibraryItemDetail() {
  return (
    <div className="relative space-y-8">
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
        {Array.from({ length: 6 }).map((_, i) => (
          <FloatingParticle
            key={i}
            delay={i * 1.3}
            x={10 + (i * 14) % 80}
            size={2 + (i % 3)}
          />
        ))}
      </div>

      {/* Back link */}
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, ease: ease.gentle }}
      >
        <Link
          to="/teacher/library"
          className="inline-flex items-center gap-1.5 text-body-sm font-medium text-text-secondary hover:text-orange-400 transition-colors"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          Back to Library
        </Link>
      </motion.div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <motion.h1
            {...fadeUpProps()}
            className="text-display-md text-text-primary"
            initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: duration.slow, ease: ease.gentle }}
          >
            {ITEM.title}
          </motion.h1>

          {/* Animated accent line */}
          <motion.div
            className="mt-3 h-px bg-gradient-to-r from-orange-500/60 via-orange-400/30 to-transparent"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "100%", opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: ease.gentle }}
          />

          {/* Metadata row */}
          <motion.div
            {...fadeUpProps(12, 0.08, 0.45)}
            className="mt-4 flex flex-wrap gap-3"
          >
            {META_ITEMS.map((meta, i) => {
              const Icon = meta.icon;
              return (
                <motion.div
                  key={meta.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.15 + i * 0.06, ease: ease.gentle }}
                  whileHover={{ y: -2, scale: 1.02 }}
                  className="flex items-center gap-2 rounded-[var(--radius-sm)] border border-border-subtle bg-bg-elevated px-3 py-1.5 transition-colors hover:border-orange-500/20"
                >
                  <div className={`flex h-5 w-5 items-center justify-center rounded-[var(--radius-xs)] ${meta.color}`}>
                    <Icon size={12} strokeWidth={1.5} />
                  </div>
                  <span className="text-caption text-text-muted">{meta.label}:</span>
                  <span className="text-body-sm font-medium text-text-primary">{meta.value}</span>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Preview area */}
          <motion.div
            {...fadeUpProps(16, 0.18)}
            className="group relative mt-8 overflow-hidden rounded-[var(--radius-lg)] border border-border-subtle bg-bg-surface p-8 transition-all duration-300 hover:border-orange-500/20"
            whileHover={{ y: -2 }}
          >
            {/* Card hover glow */}
            <div className="pointer-events-none absolute inset-0 rounded-[var(--radius-lg)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-orange-500/[0.02] via-transparent to-orange-500/[0.01]" />

            <div className="mx-auto max-w-[680px] space-y-6" style={{ lineHeight: "1.75" }}>
              <h2 className="text-heading-1 text-text-primary">
                Lesson Plan: Atoms and Molecules
              </h2>

              <div className="space-y-2">
                <h3 className="text-heading-2 text-text-primary">Learning Objectives</h3>
                <p className="text-body-lg text-text-secondary">
                  By the end of this lesson, students will be able to understand the basic concepts
                  of atoms and molecules as proposed by Dalton, differentiate between atoms and
                  molecules, and calculate molecular masses using atomic mass units.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-heading-2 text-text-primary">Introduction (15 minutes)</h3>
                <p className="text-body-lg text-text-secondary">
                  Begin with a thought experiment: &ldquo;If you keep dividing a piece of gold,
                  what is the smallest piece you can get that is still gold?&rdquo; This leads to
                  the concept of atoms as the fundamental building blocks of matter.
                </p>
                <ul className="list-disc space-y-1.5 pl-6 text-body-lg text-text-secondary">
                  <li>Dalton&rsquo;s atomic theory and its key postulates</li>
                  <li>The law of conservation of mass (Lavoisier)</li>
                  <li>The law of constant proportions (Proust)</li>
                  <li>Atoms vs molecules: definitions and differences</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-heading-2 text-text-primary">Core Content (25 minutes)</h3>
                <p className="text-body-lg text-text-secondary">
                  Introduce the modern atomic theory. Explain that atoms of the same element have
                  identical properties. Discuss how atoms combine in fixed ratios to form molecules
                  and compounds. Use water (H&#8322;O) and carbon dioxide (CO&#8322;) as examples.
                </p>
                <p className="text-body-lg text-text-secondary">
                  Cover the concept of atomic mass unit (amu) and relative atomic masses as listed
                  in the NCERT table. Walk through calculating molecular mass by summing atomic
                  masses (example: H&#8322;O = 2(1) + 16 = 18 amu).
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-heading-2 text-text-primary">Activity (10 minutes)</h3>
                <p className="text-body-lg text-text-secondary">
                  Students work in pairs to calculate the molecular mass of five given compounds:
                  NaCl, CaCO&#8323;, H&#8322;SO&#8324;, CH&#8324;, and C&#8326;H&#8321;&#8322;O&#8326;.
                  Compare answers as a class.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-heading-2 text-text-primary">Wrap-up & Assessment (10 minutes)</h3>
                <p className="text-body-lg text-text-secondary">
                  Quick recap quiz with 5 MCQs covering the key concepts. Assign NCERT exercise
                  questions 1-8 from Chapter 3 as homework.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Action bar */}
          <motion.div
            {...fadeUpProps(12, 0.28, 0.4)}
            className="mt-6 flex flex-wrap gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-[var(--radius-md)] bg-orange-500 px-5 py-2.5 text-body-md font-medium text-white transition-all duration-200 hover:bg-orange-600 hover:shadow-glow-orange"
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-orange-400/20 via-transparent to-orange-400/20" />
              <Download size={18} strokeWidth={1.5} />
              Download PDF
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-border-strong bg-bg-elevated px-5 py-2.5 text-body-md font-medium text-text-primary transition-colors duration-200 hover:bg-bg-muted"
            >
              <FileText size={18} strokeWidth={1.5} />
              Download DOCX
            </motion.button>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/teacher/materials"
                className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-orange-500/30 bg-orange-500/8 px-5 py-2.5 text-body-md font-medium text-orange-400 transition-colors duration-200 hover:bg-orange-500/15"
              >
                <Edit3 size={18} strokeWidth={1.5} />
                Customise
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: ease.gentle }}
          className="w-full shrink-0 space-y-4 lg:w-72"
        >
          <h3 className="text-heading-3 text-text-primary">Related Items</h3>
          {RELATED.map((item, i) => (
            <motion.div
              key={item.id}
              {...staggerItemProps(0.35 + i * 0.07, 10, 0.35)}
              whileHover={{ y: -4, x: 0 }}
              transition={{ duration: 0.3, ease: ease.gentle }}
            >
              <Link
                to="/teacher/library"
                className="group relative block overflow-hidden rounded-[var(--radius-md)] border border-border-subtle bg-bg-surface p-4 transition-all duration-200 hover:border-orange-500/30 hover:shadow-[0_4px_24px_rgba(242,116,13,0.12)]"
              >
                {/* Card hover gradient glow overlay */}
                <div className="pointer-events-none absolute inset-0 rounded-[var(--radius-md)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-orange-500/[0.04] via-transparent to-orange-500/[0.02]" />
                <h4 className="text-body-md font-medium text-text-primary group-hover:text-orange-400 transition-colors line-clamp-2">
                  {item.title}
                </h4>
                <div className="mt-1.5 flex items-center gap-2 text-caption text-text-muted">
                  <span>{item.subject}</span>
                  <span className="h-1 w-1 rounded-full bg-text-muted" />
                  <span>{item.cls}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.aside>
      </div>
    </div>
  );
}
