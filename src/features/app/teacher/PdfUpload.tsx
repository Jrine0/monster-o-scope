import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import {
  Upload,
  FileText,
  X,
  Sparkles,
  CheckCircle2,
  File,
} from "lucide-react";
import {
  fadeUpProps,
  staggerItemProps,
  ease,
  duration,
} from "@/lib/animation";

type UploadState = "idle" | "uploading" | "uploaded";

/* ── Floating particles ── */
const PARTICLES = Array.from({ length: 7 }, (_, i) => ({
  id: i,
  left: `${10 + i * 13}%`,
  delay: i * 0.7,
  duration: 6 + Math.random() * 4,
  size: 2 + Math.random() * 1.5,
}));

export function PdfUpload() {
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);

  function simulateUpload() {
    setUploadState("uploading");
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadState("uploaded");
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    simulateUpload();
  }

  function resetUpload() {
    setUploadState("idle");
    setProgress(0);
  }

  return (
    <div className="relative space-y-6">
      {/* ── Animated background ── */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Gradient blob */}
        <motion.div
          className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full opacity-[0.04]"
          style={{
            background: "radial-gradient(circle, #f27410 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
          animate={{
            scale: [1, 1.15, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full opacity-[0.03]"
          style={{
            background: "radial-gradient(circle, #f27410 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -20, 0],
            y: [0, 20, 0],
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
              y: [0, -600],
              opacity: [0, 0.6, 0.4, 0],
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
      >
        {/* Animated accent line */}
        <motion.div
          className="mb-4 h-px bg-gradient-to-r from-orange-500/60 via-orange-400/20 to-transparent"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "8rem", opacity: 1 }}
          transition={{ duration: duration.slow, delay: 0.2, ease: ease.gentle }}
        />
        <h1 className="text-display-md text-text-primary">Upload PDF</h1>
        <p className="mt-1 text-body-md text-text-secondary">
          Upload a PDF document and generate teaching materials from it.
        </p>
      </motion.div>

      {/* Drop zone */}
      <motion.div
        {...fadeUpProps(16, 0.1)}
      >
        <AnimatePresence mode="wait">
          {uploadState === "idle" && (
            <motion.div
              key="dropzone"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{ y: -4, boxShadow: "0 8px 40px rgba(242,116,16,0.06)" }}
              transition={{ duration: 0.25, ease: ease.gentle }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={simulateUpload}
              className={`relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[var(--radius-xl)] border-2 border-dashed p-16 transition-all duration-200 ${
                dragOver
                  ? "border-orange-500 bg-orange-500/5 shadow-glow-orange"
                  : "border-border-strong bg-bg-surface hover:border-orange-500/40 hover:bg-bg-elevated"
              }`}
            >
              {/* Gradient glow overlay on hover */}
              <div className="pointer-events-none absolute inset-0 rounded-[var(--radius-xl)] bg-gradient-to-br from-orange-500/[0.02] via-transparent to-orange-500/[0.01] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <motion.div
                animate={dragOver ? { scale: 1.1, y: -4 } : { scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/10"
              >
                {/* Breathing icon animation */}
                <motion.div
                  animate={{ scale: [1, 1.08, 1], opacity: [0.9, 1, 0.9] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Upload size={28} strokeWidth={1.5} className="text-orange-400" />
                </motion.div>
              </motion.div>
              <p className="text-heading-3 text-text-primary">
                Drop your PDF here
              </p>
              <p className="mt-1 text-body-sm text-text-secondary">
                or <span className="text-orange-400 font-medium">click to browse</span>
              </p>
              <p className="mt-3 text-caption text-text-muted">
                Supports PDF files up to 25 MB
              </p>
            </motion.div>
          )}

          {uploadState === "uploading" && (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center rounded-[var(--radius-xl)] border border-border-subtle bg-bg-surface p-16"
            >
              {/* File icon with pulse */}
              <motion.div
                className="relative mb-6"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-[var(--radius-lg)] bg-orange-500/10">
                  <FileText size={28} strokeWidth={1.5} className="text-orange-400" />
                </div>
                {/* Spinning ring */}
                <motion.div
                  className="absolute -inset-2 rounded-[var(--radius-xl)] border-2 border-transparent border-t-orange-500/50"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>

              <p className="text-heading-3 text-text-primary mb-1">Uploading...</p>
              <p className="text-body-sm text-text-muted mb-6">NCERT_Class9_Chemistry.pdf</p>

              {/* Progress bar */}
              <div className="w-full max-w-xs">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-muted">
                  <motion.div
                    className="h-full rounded-full bg-orange-500"
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    transition={{ duration: 0.2, ease: "linear" }}
                  />
                </div>
                <p className="mt-2 text-center text-caption text-text-muted">
                  {Math.min(Math.round(progress), 100)}%
                </p>
              </div>
            </motion.div>
          )}

          {uploadState === "uploaded" && (
            <motion.div
              key="uploaded"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-[var(--radius-xl)] border border-border-subtle bg-bg-surface p-8"
            >
              {/* Success icon */}
              <div className="flex items-center justify-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15"
                >
                  <CheckCircle2 size={24} strokeWidth={1.5} className="text-emerald-400" />
                </motion.div>
              </div>

              {/* File info card */}
              <motion.div
                whileHover={{ y: -4, boxShadow: "0 8px 30px rgba(242,116,16,0.06)" }}
                transition={{ duration: 0.25, ease: ease.gentle }}
                className="mx-auto max-w-md rounded-[var(--radius-lg)] border border-border-subtle bg-bg-elevated p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-red-500/10">
                    <File size={22} strokeWidth={1.5} className="text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-body-md font-medium text-text-primary truncate">
                      NCERT_Class9_Chemistry.pdf
                    </p>
                    <div className="mt-1 flex items-center gap-3 text-caption text-text-muted">
                      <span>4.2 MB</span>
                      <span className="h-1 w-1 rounded-full bg-text-muted" />
                      <span>32 pages</span>
                      <span className="h-1 w-1 rounded-full bg-text-muted" />
                      <span>Uploaded just now</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="rounded-[var(--radius-sm)] bg-emerald-500/12 px-2 py-0.5 text-caption text-emerald-400">
                        Ready
                      </span>
                      <span className="text-caption text-text-muted">
                        Chapters detected: 5
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={resetUpload}
                    className="shrink-0 rounded-[var(--radius-sm)] p-1.5 text-text-muted hover:text-text-secondary hover:bg-bg-muted transition-colors"
                  >
                    <X size={16} strokeWidth={1.5} />
                  </button>
                </div>

                {/* Detected chapters preview */}
                <div className="mt-4 space-y-1.5">
                  <p className="text-caption font-medium text-text-muted">Detected Chapters</p>
                  {[
                    "Chapter 1: Matter in Our Surroundings",
                    "Chapter 2: Is Matter Around Us Pure?",
                    "Chapter 3: Atoms and Molecules",
                    "Chapter 4: Structure of the Atom",
                    "Chapter 5: The Fundamental Unit of Life",
                  ].map((chapter, i) => (
                    <motion.div
                      key={i}
                      {...staggerItemProps(0.15 + i * 0.06, 10, 0.35)}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2, ease: ease.gentle }}
                      className="flex items-center gap-2 rounded-[var(--radius-sm)] bg-bg-surface px-3 py-1.5 text-body-sm text-text-secondary"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500/12 text-caption font-semibold text-orange-400">
                        {i + 1}
                      </span>
                      {chapter}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Generate button */}
              <div className="mt-8 flex justify-center">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/teacher/generate"
                    className="inline-flex items-center gap-2.5 rounded-[var(--radius-md)] bg-orange-500 px-6 py-3 text-body-md font-semibold text-white transition-all duration-200 hover:bg-orange-600 hover:shadow-glow-orange-strong"
                  >
                    <motion.div
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Sparkles size={18} strokeWidth={1.5} />
                    </motion.div>
                    Generate from PDF
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
