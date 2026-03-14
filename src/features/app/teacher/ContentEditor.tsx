import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Undo2,
  Redo2,
  Save,
  X,
  Eye,
  Pencil,
} from "lucide-react";
import { fadeUpProps, ease, duration } from "@/lib/animation";

/* ── Mock content ── */
const INITIAL_CONTENT = `Lesson Plan: Atoms and Molecules

Learning Objectives
By the end of this lesson, students will be able to understand the basic concepts of atoms and molecules as proposed by Dalton, differentiate between atoms and molecules, and calculate molecular masses using atomic mass units.

Introduction (15 minutes)
Begin with a thought experiment: "If you keep dividing a piece of gold, what is the smallest piece you can get that is still gold?" This leads to the concept of atoms as the fundamental building blocks of matter.

Key concepts to cover:
- Dalton's atomic theory and its key postulates
- The law of conservation of mass (Lavoisier)
- The law of constant proportions (Proust)
- Atoms vs molecules: definitions and differences

Core Content (25 minutes)
Introduce the modern atomic theory. Explain that atoms of the same element have identical properties. Discuss how atoms combine in fixed ratios to form molecules and compounds.

Use water (H\u2082O) and carbon dioxide (CO\u2082) as examples.

Cover the concept of atomic mass unit (amu) and relative atomic masses. Walk through calculating molecular mass by summing atomic masses.

Example: H\u2082O = 2(1) + 16 = 18 amu

Activity (10 minutes)
Students work in pairs to calculate the molecular mass of five given compounds: NaCl, CaCO\u2083, H\u2082SO\u2084, CH\u2084, and C\u2086H\u2081\u2082O\u2086.

Wrap-up & Assessment (10 minutes)
Quick recap quiz with 5 MCQs covering the key concepts. Assign NCERT exercise questions 1-8 from Chapter 3 as homework.`;

const TOOLBAR_GROUPS = [
  [
    { icon: Bold, label: "Bold" },
    { icon: Italic, label: "Italic" },
  ],
  [
    { icon: Heading1, label: "Heading 1" },
    { icon: Heading2, label: "Heading 2" },
  ],
  [
    { icon: List, label: "Bullet List" },
    { icon: ListOrdered, label: "Numbered List" },
  ],
  [
    { icon: Undo2, label: "Undo" },
    { icon: Redo2, label: "Redo" },
  ],
] as const;

/* ── Floating particles ── */
const PARTICLES = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  left: `${12 + i * 14}%`,
  delay: i * 0.9,
  duration: 7 + Math.random() * 3,
  size: 2 + Math.random() * 1,
}));

export function ContentEditor() {
  const [content, setContent] = useState(INITIAL_CONTENT);
  const [activeView, setActiveView] = useState<"split" | "editor" | "preview">("split");

  /* Parse content into rendered preview */
  function renderPreview() {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];

    lines.forEach((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) {
        elements.push(<div key={i} className="h-4" />);
      } else if (i === 0 || (trimmed.length < 60 && !trimmed.startsWith("-") && !trimmed.startsWith("Example"))) {
        /* Treat short lines as headings (simplified heuristic) */
        if (i === 0) {
          elements.push(
            <h2 key={i} className="text-heading-1 text-text-primary mt-2">
              {trimmed}
            </h2>
          );
        } else if (trimmed.match(/^\w.*\(\d+ minutes?\)$/i) || trimmed.match(/^(Learning|Key|Core|Activity|Wrap)/)) {
          elements.push(
            <h3 key={i} className="text-heading-2 text-text-primary mt-6 mb-1">
              {trimmed}
            </h3>
          );
        } else {
          elements.push(
            <p key={i} className="text-body-lg text-text-secondary">
              {trimmed}
            </p>
          );
        }
      } else if (trimmed.startsWith("- ")) {
        elements.push(
          <li key={i} className="text-body-lg text-text-secondary ml-6 list-disc">
            {trimmed.slice(2)}
          </li>
        );
      } else {
        elements.push(
          <p key={i} className="text-body-lg text-text-secondary">
            {trimmed}
          </p>
        );
      }
    });

    return elements;
  }

  return (
    <div className="relative space-y-4">
      {/* ── Animated background ── */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Gradient blob */}
        <motion.div
          className="absolute -top-32 -right-40 h-[480px] w-[480px] rounded-full opacity-[0.04]"
          style={{
            background: "radial-gradient(circle, #f27410 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
          animate={{
            scale: [1, 1.12, 1],
            x: [0, 20, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-32 h-[380px] w-[380px] rounded-full opacity-[0.03]"
          style={{
            background: "radial-gradient(circle, #f27410 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -18, 0],
            y: [0, 12, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, #f27410 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Floating particles */}
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-orange-400"
            style={{
              width: p.size,
              height: p.size,
              left: p.left,
              bottom: "-4px",
            }}
            animate={{
              y: [0, -550],
              opacity: [0, 0.5, 0.35, 0],
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

      {/* Header */}
      <motion.div
        {...fadeUpProps()}
        className="flex items-center justify-between"
      >
        <div>
          {/* Animated accent line */}
          <motion.div
            className="mb-3 h-px bg-gradient-to-r from-orange-500/60 via-orange-400/20 to-transparent"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "8rem", opacity: 1 }}
            transition={{ duration: duration.slow, delay: 0.2, ease: ease.gentle }}
          />
          <h1 className="text-heading-1 text-text-primary">Content Editor</h1>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex gap-1 rounded-[var(--radius-md)] bg-bg-elevated p-1">
            {[
              { id: "editor" as const, icon: Pencil, label: "Editor" },
              { id: "split" as const, icon: Eye, label: "Split" },
              { id: "preview" as const, icon: Eye, label: "Preview" },
            ].map((view) => {
              const Icon = view.icon;
              return (
                <motion.button
                  key={view.id}
                  onClick={() => setActiveView(view.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`rounded-[var(--radius-sm)] px-3 py-1.5 text-caption font-medium transition-colors ${
                    activeView === view.id
                      ? "bg-bg-muted text-text-primary"
                      : "text-text-muted hover:text-text-secondary"
                  }`}
                  title={view.label}
                >
                  {view.id === "split" ? "Split" : <Icon size={14} strokeWidth={1.5} />}
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Toolbar */}
      <motion.div
        {...fadeUpProps(8, 0.08, 0.4)}
        whileHover={{ boxShadow: "0 4px 20px rgba(242,116,16,0.04)" }}
        className="flex items-center gap-1 rounded-[var(--radius-md)] border border-border-subtle bg-bg-surface p-2"
      >
        {TOOLBAR_GROUPS.map((group, gi) => (
          <div key={gi} className="flex items-center gap-0.5">
            {group.map((tool) => {
              const Icon = tool.icon;
              return (
                <motion.button
                  key={tool.label}
                  title={tool.label}
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(242,116,16,0.06)" }}
                  whileTap={{ scale: 0.92 }}
                  className="rounded-[var(--radius-sm)] p-2 text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition-colors"
                >
                  <Icon size={16} strokeWidth={1.5} />
                </motion.button>
              );
            })}
            {gi < TOOLBAR_GROUPS.length - 1 && (
              <div className="mx-1 h-5 w-px bg-border-subtle" />
            )}
          </div>
        ))}
      </motion.div>

      {/* Editor + Preview */}
      <motion.div
        {...fadeUpProps(16, 0.15)}
        className={`grid gap-4 ${
          activeView === "split"
            ? "grid-cols-2"
            : "grid-cols-1"
        }`}
        style={{ minHeight: "60vh" }}
      >
        {/* Editor pane */}
        {(activeView === "split" || activeView === "editor") && (
          <motion.div
            whileHover={{ boxShadow: "0 4px 30px rgba(242,116,16,0.04)" }}
            transition={{ duration: 0.25, ease: ease.gentle }}
            className="rounded-[var(--radius-lg)] border border-border-subtle bg-bg-surface overflow-hidden"
          >
            <div className="border-b border-border-subtle px-4 py-2">
              <span className="text-caption text-text-muted font-medium">Editor</span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="h-full w-full resize-none bg-transparent p-6 text-body-md text-text-primary font-mono outline-none placeholder:text-text-muted focus:shadow-[0_0_20px_rgba(242,116,13,0.08)]"
              style={{ minHeight: "55vh", lineHeight: "1.7" }}
              spellCheck={false}
            />
          </motion.div>
        )}

        {/* Preview pane */}
        {(activeView === "split" || activeView === "preview") && (
          <motion.div
            whileHover={{ boxShadow: "0 4px 30px rgba(242,116,16,0.04)" }}
            transition={{ duration: 0.25, ease: ease.gentle }}
            className="rounded-[var(--radius-lg)] border border-border-subtle bg-bg-surface overflow-hidden"
          >
            <div className="border-b border-border-subtle px-4 py-2">
              <span className="text-caption text-text-muted font-medium">Preview</span>
            </div>
            <div
              className="overflow-y-auto p-6 space-y-1"
              style={{ maxHeight: "60vh", lineHeight: "1.75" }}
            >
              {renderPreview()}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Bottom action bar */}
      <motion.div
        {...fadeUpProps(12, 0.25, 0.4)}
        className="flex items-center justify-between"
      >
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            to="/teacher/materials"
            className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-border-subtle px-5 py-2.5 text-body-md font-medium text-text-secondary transition-colors hover:text-text-primary hover:bg-bg-elevated"
          >
            <X size={18} strokeWidth={1.5} />
            Cancel
          </Link>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-orange-500 px-5 py-2.5 text-body-md font-medium text-white transition-all duration-200 hover:bg-orange-600 hover:shadow-glow-orange"
        >
          <Save size={18} strokeWidth={1.5} />
          Save Changes
        </motion.button>
      </motion.div>
    </div>
  );
}
