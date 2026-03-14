import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import {
  ArrowLeft,
  Download,
  FileText,
  Edit3,
  Clock,
  BookOpen,
  GraduationCap,
  Layers,
  Tag,
  History,
  Eye,
} from "lucide-react";
import { ease, fadeUpProps, duration } from "@/lib/animation";

/* ── Mock data ── */
const MATERIAL = {
  id: "m1",
  title: "Atoms and Molecules — Lesson Plan",
  subject: "Chemistry",
  cls: "Class 9",
  chapter: "Chapter 3",
  type: "Lesson Plan",
  createdAt: "28 Feb 2026",
  updatedAt: "1 Mar 2026",
};

const VERSIONS = [
  { id: "v3", label: "v3 — Current", date: "1 Mar 2026", author: "Priya Sharma" },
  { id: "v2", label: "v2 — Minor edits", date: "28 Feb 2026", author: "Priya Sharma" },
  { id: "v1", label: "v1 — Generated", date: "28 Feb 2026", author: "AI Generated" },
] as const;

const META_ITEMS = [
  { label: "Subject", value: MATERIAL.subject, icon: BookOpen, color: "text-amber-400 bg-amber-500/10" },
  { label: "Class", value: MATERIAL.cls, icon: GraduationCap, color: "text-blue-400 bg-blue-500/10" },
  { label: "Chapter", value: MATERIAL.chapter, icon: Layers, color: "text-purple-400 bg-purple-500/10" },
  { label: "Type", value: MATERIAL.type, icon: Tag, color: "text-orange-400 bg-orange-500/10" },
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

export function MaterialDetail() {
  const [activeTab, setActiveTab] = useState<"preview" | "history">("preview");

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
          to="/teacher/materials"
          className="inline-flex items-center gap-1.5 text-body-sm font-medium text-text-secondary hover:text-orange-400 transition-colors"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          Back to My Materials
        </Link>
      </motion.div>

      {/* Title + meta */}
      <motion.div
        {...fadeUpProps()}
      >
        <motion.h1
          className="text-display-md text-text-primary"
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: duration.slow, ease: ease.gentle }}
        >
          {MATERIAL.title}
        </motion.h1>
        <div className="mt-2 flex items-center gap-3 text-body-sm text-text-muted">
          <span className="flex items-center gap-1.5">
            <Clock size={14} strokeWidth={1.5} />
            Created {MATERIAL.createdAt}
          </span>
          <span className="h-1 w-1 rounded-full bg-text-muted" />
          <span>Updated {MATERIAL.updatedAt}</span>
        </div>
        {/* Animated accent line */}
        <motion.div
          className="mt-3 h-px bg-gradient-to-r from-orange-500/60 via-orange-400/30 to-transparent"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "100%", opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: ease.gentle }}
        />
      </motion.div>

      {/* Meta badges */}
      <motion.div
        {...fadeUpProps(12, 0.08, 0.45)}
        className="flex flex-wrap gap-3"
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

      {/* Tabs */}
      <motion.div
        {...fadeUpProps(12, 0.12, 0.45)}
        className="flex gap-1 rounded-[var(--radius-md)] bg-bg-elevated p-1 w-fit"
      >
        {[
          { id: "preview" as const, label: "Preview", icon: Eye },
          { id: "history" as const, label: "Version History", icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative rounded-[var(--radius-sm)] px-4 py-2 text-body-md font-medium transition-colors ${
                isActive ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="material-detail-tab"
                  className="absolute inset-0 rounded-[var(--radius-sm)] bg-bg-muted"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon size={16} strokeWidth={1.5} />
                {tab.label}
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* Tab content */}
      {activeTab === "preview" ? (
        <motion.div
          key="preview"
          {...fadeUpProps(12, 0, 0.4)}
          className="group relative overflow-hidden rounded-[var(--radius-lg)] border border-border-subtle bg-bg-surface p-8 transition-all duration-300 hover:border-orange-500/20"
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
                Students will understand Dalton&rsquo;s atomic theory, differentiate between atoms,
                molecules, elements, and compounds, and calculate molecular masses using atomic mass
                units as per NCERT Class 9 Science Chapter 3.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-heading-2 text-text-primary">Introduction (15 minutes)</h3>
              <p className="text-body-lg text-text-secondary">
                Begin by asking: &ldquo;If you keep dividing a grain of sugar, what is the smallest
                piece you can get?&rdquo; Introduce the historical development from Kanada and
                Democritus to Dalton. Explain the laws of chemical combination.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-heading-2 text-text-primary">Core Content (25 minutes)</h3>
              <ul className="list-disc space-y-1.5 pl-6 text-body-lg text-text-secondary">
                <li>Dalton&rsquo;s atomic theory: key postulates and modern modifications</li>
                <li>Atoms: the building blocks of matter. Size, mass, and symbols</li>
                <li>Molecules: atoms bonded together. Atomicity of common molecules</li>
                <li>Ions: cations and anions, polyatomic ions with examples</li>
                <li>Chemical formulae of common compounds using criss-cross method</li>
                <li>Molecular mass calculation with worked examples</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-heading-2 text-text-primary">Practice Activity (10 minutes)</h3>
              <p className="text-body-lg text-text-secondary">
                Students work in pairs to write chemical formulae and calculate molecular masses
                for five compounds: aluminium oxide, sodium hydroxide, magnesium chloride, calcium
                carbonate, and sulphuric acid.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-heading-2 text-text-primary">Assessment (10 minutes)</h3>
              <p className="text-body-lg text-text-secondary">
                Quick quiz: 5 MCQs + 2 short-answer questions covering the key concepts.
                Assign NCERT in-text questions and exercise problems 1-10 as homework.
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="history"
          {...fadeUpProps(12, 0, 0.4)}
          className="space-y-3"
        >
          {VERSIONS.map((version, i) => (
            <motion.div
              key={version.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: i * 0.07, ease: ease.gentle }}
              whileHover={{ x: 4 }}
              className={`flex items-center gap-4 rounded-[var(--radius-md)] border p-4 transition-all duration-200 ${
                i === 0
                  ? "border-orange-500/30 bg-orange-500/5"
                  : "border-border-subtle bg-bg-surface hover:border-border-strong hover:shadow-[0_2px_12px_rgba(242,116,13,0.06)]"
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bg-elevated">
                <motion.div
                  animate={i === 0 ? { rotate: [0, 10, -10, 0] } : {}}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <History size={18} strokeWidth={1.5} className={i === 0 ? "text-orange-400" : "text-text-muted"} />
                </motion.div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-body-md font-medium text-text-primary">{version.label}</p>
                <p className="text-caption text-text-muted">
                  {version.date} &middot; {version.author}
                </p>
              </div>
              {i === 0 && (
                <span className="rounded-[var(--radius-full)] bg-orange-500/12 px-2.5 py-0.5 text-caption font-medium text-orange-400">
                  Current
                </span>
              )}
              {i > 0 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="text-body-sm text-text-secondary hover:text-orange-400 transition-colors"
                >
                  Restore
                </motion.button>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Action bar */}
      <motion.div
        {...fadeUpProps(12, 0.2, 0.4)}
        className="flex flex-wrap gap-3"
      >
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            to="/teacher/editor/$id"
            params={{ id: MATERIAL.id }}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-[var(--radius-md)] bg-orange-500 px-5 py-2.5 text-body-md font-medium text-white transition-all duration-200 hover:bg-orange-600 hover:shadow-glow-orange"
          >
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-orange-400/20 via-transparent to-orange-400/20" />
            <Edit3 size={18} strokeWidth={1.5} />
            Edit
          </Link>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-border-strong bg-bg-elevated px-5 py-2.5 text-body-md font-medium text-text-primary transition-colors duration-200 hover:bg-bg-muted"
        >
          <Download size={18} strokeWidth={1.5} />
          Download PDF
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-border-subtle bg-transparent px-5 py-2.5 text-body-md font-medium text-text-secondary transition-colors duration-200 hover:text-text-primary hover:bg-bg-elevated"
        >
          <FileText size={18} strokeWidth={1.5} />
          Download DOCX
        </motion.button>
      </motion.div>
    </div>
  );
}
