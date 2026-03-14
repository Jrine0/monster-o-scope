import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import {
  Play,
  Pause,
  Maximize2,
  Volume2,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  ListChecks,
  BookOpen,
} from "lucide-react";
import {
  ease,
  fadeUpProps,
  breatheLoop,
} from "@/lib/animation";

/* ── Mock video data ── */
const VIDEO = {
  id: "vid-p5-laws-of-motion",
  chapter: 5,
  subject: "Physics",
  title: "Laws of Motion \u2014 Visual Explanation",
  description:
    "This Manim animation walks you through Newton\u2019s three laws of motion with intuitive visual demonstrations. Watch how force, mass, and acceleration interact in real-world scenarios.",
  duration: "12:34",
  notes: [
    {
      timestamp: "0:00",
      title: "Introduction",
      text: "Overview of Newton\u2019s Laws and their significance in classical mechanics.",
    },
    {
      timestamp: "1:45",
      title: "First Law \u2014 Inertia",
      text: "A body at rest stays at rest, and a body in motion stays in motion unless acted upon by an external force. Demo: puck on ice.",
    },
    {
      timestamp: "4:12",
      title: "Second Law \u2014 F = ma",
      text: "Force equals mass times acceleration. Visual: applying different forces to different masses and observing acceleration changes.",
    },
    {
      timestamp: "7:30",
      title: "Third Law \u2014 Action-Reaction",
      text: "Every action has an equal and opposite reaction. Demo: rocket propulsion, walking, swimming.",
    },
    {
      timestamp: "9:50",
      title: "Conservation of Momentum",
      text: "Total momentum of an isolated system remains constant. Demo: two-ball collision with varying masses.",
    },
    {
      timestamp: "11:45",
      title: "Summary & Practice",
      text: "Quick recap of all three laws and their everyday applications. Recommended: attempt the practice quiz after watching.",
    },
  ],
  prevVideo: { id: "vid-p4", title: "Work, Energy and Power" },
  nextVideo: { id: "vid-p6", title: "Gravitation" },
};

/* ── Floating particles for warm light theme ── */
const PARTICLES = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  left: `${10 + i * 15}%`,
  delay: i * 1.0,
  duration: 7 + (i % 3) * 2,
  size: 2,
}));

export function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<"notes" | "chapters">("notes");

  return (
    <div className="relative pb-12">
      {/* ── Animated background blob (warm light theme) ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-32 -right-20 h-[500px] w-[500px] rounded-full opacity-[0.05]"
          style={{
            background: "radial-gradient(circle, #f2740d 0%, #fb923c 40%, transparent 70%)",
            filter: "blur(100px)",
          }}
          animate={{
            x: [0, 25, -15, 0],
            y: [0, -15, 10, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 h-[350px] w-[350px] rounded-full opacity-[0.04]"
          style={{
            background: "radial-gradient(circle, #fb923c 0%, #f59e0b 40%, transparent 70%)",
            filter: "blur(100px)",
          }}
          animate={{
            x: [0, -20, 15, 0],
            y: [0, 20, -10, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(circle, #f2740d 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* ── Floating particles ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              left: p.left,
              bottom: -10,
              backgroundColor: "#f2740d",
              opacity: 0,
            }}
            animate={{
              y: [0, -500, -1000],
              opacity: [0, 0.2, 0],
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

      {/* ── Breadcrumb with fade entrance ── */}
      <motion.div
        initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.4, ease: ease.gentle }}
        className="relative flex items-center gap-2 text-body-sm text-text-muted mb-4"
      >
        <Link
          to="/student/materials"
          className="hover:text-text-secondary transition-colors"
        >
          Study Materials
        </Link>
        <ChevronRight size={14} strokeWidth={1.5} />
        <span className="text-text-secondary">{VIDEO.subject}</span>
        <ChevronRight size={14} strokeWidth={1.5} />
        <span className="text-text-primary">Chapter {VIDEO.chapter}</span>
      </motion.div>

      {/* ── Main content: Video + Notes split ── */}
      <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* ── Video area (left / top) ── */}
        <div className="lg:col-span-3 space-y-4">
          {/* Video player placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: ease.gentle }}
            className="relative aspect-video w-full overflow-hidden rounded-xl border border-border-subtle"
            style={{ backgroundColor: "#0d0b09" }}
          >
            {/* Gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(242,116,13,0.06) 0%, transparent 70%)",
              }}
            />

            {/* Play button with micro-interaction */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute inset-0 flex items-center justify-center group"
            >
              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 shadow-lg transition-shadow duration-200 group-hover:shadow-glow-orange-strong"
              >
                {isPlaying ? (
                  <Pause size={28} strokeWidth={1.5} className="text-text-inverse" />
                ) : (
                  <Play
                    size={28}
                    strokeWidth={1.5}
                    className="text-text-inverse ml-1"
                  />
                )}
              </motion.div>
            </button>

            {/* Bottom controls bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-4 pb-3 pt-8">
              {/* Progress bar with spring animation */}
              <div className="relative mb-2 h-1 w-full overflow-hidden rounded-full bg-white/20">
                <motion.div
                  className="h-full rounded-full bg-orange-500"
                  animate={{ width: isPlaying ? "35%" : "0%" }}
                  transition={{
                    type: "spring",
                    stiffness: 80,
                    damping: 20,
                  }}
                />
                {/* Progress glow */}
                {isPlaying && (
                  <motion.div
                    className="absolute top-0 h-full rounded-full"
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(242,116,13,0.5), transparent)",
                      filter: "blur(3px)",
                    }}
                    animate={{ width: "35%" }}
                    transition={{
                      type: "spring",
                      stiffness: 80,
                      damping: 20,
                    }}
                  />
                )}
              </div>
              <div className="flex items-center justify-between text-body-sm text-white/80">
                <span>{isPlaying ? "4:12" : "0:00"} / {VIDEO.duration}</span>
                <div className="flex items-center gap-3">
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="hover:text-white transition-colors">
                    <Volume2 size={18} strokeWidth={1.5} />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="hover:text-white transition-colors">
                    <Maximize2 size={18} strokeWidth={1.5} />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Video title + description with blur entrance */}
          <motion.div
            initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.5, delay: 0.2, ease: ease.gentle }}
          >
            <h1 className="text-display-md text-text-primary">{VIDEO.title}</h1>
            <p className="text-body-lg text-text-secondary mt-2 leading-[1.7]">
              {VIDEO.description}
            </p>
            {/* Animated accent line */}
            <motion.div
              className="h-px mt-4"
              style={{
                background: "linear-gradient(90deg, transparent, #f2740d, #fb923c, transparent)",
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5, ease: ease.gentle }}
            />
          </motion.div>

          {/* Ask Erudio CTA with hover effect */}
          <motion.div
            {...fadeUpProps(8, 0.25, 0.4)}
          >
            <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
              <Link
                to="/student/tutor"
                className="group relative inline-flex items-center gap-2 rounded-xl border border-orange-500/20 px-4 py-3 text-body-md font-medium text-orange-400 transition-all duration-200 hover:shadow-glow-orange hover:border-orange-500/30 overflow-hidden"
                style={{ backgroundColor: "rgba(242,116,13,0.06)" }}
              >
                {/* Hover glow */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: "radial-gradient(ellipse at 20% 50%, rgba(242,116,13,0.06) 0%, transparent 70%)",
                  }}
                />
                <motion.div {...breatheLoop(3)} className="relative z-10">
                  <MessageCircle size={18} strokeWidth={1.5} />
                </motion.div>
                <span className="relative z-10">Ask Erudio about this video</span>
                <ChevronRight
                  size={16}
                  strokeWidth={1.5}
                  className="relative z-10 transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>
            </motion.div>
          </motion.div>

          {/* ── Navigation with hover effects ── */}
          <motion.div
            {...fadeUpProps(8, 0.3, 0.4)}
            className="flex items-stretch gap-4 pt-4"
          >
            <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }} className="flex-1">
              <Link
                to="/student/tutor"
                className="group flex h-full items-center gap-3 rounded-xl border border-border-subtle p-4 transition-all duration-200 hover:border-border-default hover:shadow-sm"
                style={{ backgroundColor: "var(--color-portal-student-surface)" }}
              >
                <ChevronLeft
                  size={18}
                  strokeWidth={1.5}
                  className="shrink-0 text-text-muted transition-transform duration-200 group-hover:-translate-x-1"
                />
                <div className="min-w-0">
                  <p className="text-caption text-text-muted">Previous</p>
                  <p className="text-body-sm text-text-primary font-medium truncate">
                    {VIDEO.prevVideo.title}
                  </p>
                </div>
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }} className="flex-1">
              <Link
                to="/student/tutor"
                className="group flex h-full items-center justify-end gap-3 rounded-xl border border-border-subtle p-4 transition-all duration-200 hover:border-border-default hover:shadow-sm"
                style={{ backgroundColor: "var(--color-portal-student-surface)" }}
              >
                <div className="min-w-0 text-right">
                  <p className="text-caption text-text-muted">Next</p>
                  <p className="text-body-sm text-text-primary font-medium truncate">
                    {VIDEO.nextVideo.title}
                  </p>
                </div>
                <ChevronRight
                  size={18}
                  strokeWidth={1.5}
                  className="shrink-0 text-text-muted transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Notes panel (right / bottom) ── */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: ease.gentle }}
          className="lg:col-span-2"
        >
          <div
            className="rounded-xl border border-border-subtle overflow-hidden sticky top-[76px]"
            style={{ backgroundColor: "var(--color-portal-student-surface)" }}
          >
            {/* Tabs with micro-interactions */}
            <div className="flex border-b border-border-subtle">
              {(["notes", "chapters"] as const).map((tab) => (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  whileHover={{ backgroundColor: "rgba(242,116,13,0.03)" }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-body-sm font-medium transition-colors ${
                    activeTab === tab
                      ? "text-orange-400 border-b-2 border-orange-500"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {tab === "notes" ? (
                    <ListChecks size={16} strokeWidth={1.5} />
                  ) : (
                    <BookOpen size={16} strokeWidth={1.5} />
                  )}
                  {tab === "notes" ? "Key Points" : "Chapters"}
                </motion.button>
              ))}
            </div>

            {/* Notes list with stagger and hover */}
            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
              {VIDEO.notes.map((note, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
                  whileHover={{ x: 3, backgroundColor: "rgba(242,116,13,0.03)" }}
                  className="w-full text-left group rounded-lg p-2 -m-2 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className="shrink-0 mt-0.5 rounded-md bg-orange-500/10 px-2 py-0.5 text-caption text-orange-400 font-mono"
                    >
                      {note.timestamp}
                    </motion.span>
                    <div className="min-w-0">
                      <p className="text-body-md text-text-primary font-medium group-hover:text-orange-400 transition-colors">
                        {note.title}
                      </p>
                      <p className="text-body-sm text-text-secondary mt-0.5 leading-relaxed">
                        {note.text}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
