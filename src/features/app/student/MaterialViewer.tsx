import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  MessageCircle,
  Bookmark,
  Share2,
} from "lucide-react";
import {
  fadeUpProps,
  ease,
} from "@/lib/animation";
import { useUIStore } from "@/stores/useUIStore";

/* ── Mock lesson content ── */
const MATERIAL = {
  id: "p5-laws-of-motion",
  chapter: 5,
  subject: "Physics",
  title: "Laws of Motion",
  subtitle: "NCERT Class 11 Physics \u2014 Chapter 5",
  content: [
    {
      type: "heading" as const,
      text: "Newton\u2019s First Law of Motion",
    },
    {
      type: "paragraph" as const,
      text: "Every body continues in its state of rest, or of uniform motion in a straight line, unless compelled to change that state by forces impressed upon it. This law is often referred to as the law of inertia.",
    },
    {
      type: "keyterm" as const,
      term: "Inertia",
      definition:
        "The property of a body by virtue of which it resists any change in its state of rest or uniform motion. Inertia is directly proportional to the mass of the body.",
    },
    {
      type: "paragraph" as const,
      text: "Consider a book lying on a table. It remains at rest because the net external force on it is zero. The gravitational force pulling it downward is exactly balanced by the normal force exerted by the table upward. If we push the book, it will move \u2014 the net force is no longer zero.",
    },
    {
      type: "heading" as const,
      text: "Newton\u2019s Second Law of Motion",
    },
    {
      type: "paragraph" as const,
      text: "The rate of change of momentum of a body is directly proportional to the applied force, and takes place in the direction in which the force acts.",
    },
    {
      type: "formula" as const,
      text: "F = ma",
      caption: "where F is force in Newtons, m is mass in kg, and a is acceleration in m/s\u00B2",
    },
    {
      type: "paragraph" as const,
      text: "This is perhaps the most important equation in classical mechanics. Force is not needed to keep an object moving \u2014 it is needed to change the velocity of an object. A net force acting on a body produces acceleration in the direction of the force.",
    },
    {
      type: "keyterm" as const,
      term: "Momentum",
      definition:
        "The momentum p of a body is defined as the product of its mass m and velocity v: p = mv. It is a vector quantity having the same direction as the velocity.",
    },
    {
      type: "heading" as const,
      text: "Newton\u2019s Third Law of Motion",
    },
    {
      type: "paragraph" as const,
      text: "To every action, there is always an equal and opposite reaction. When two bodies interact, the forces on the two bodies are always equal in magnitude and opposite in direction.",
    },
    {
      type: "paragraph" as const,
      text: "A familiar example: when you walk, your foot pushes backward on the ground (action), and the ground pushes your foot forward (reaction). The reaction force is what propels you forward. Similarly, when a gun fires a bullet, the forward force on the bullet is equal and opposite to the recoil force on the gun.",
    },
    {
      type: "keyterm" as const,
      term: "Action-Reaction Pair",
      definition:
        "Forces always occur in pairs. The action and reaction forces act on two different objects, not on the same object. This is why they do not cancel each other out.",
    },
    {
      type: "heading" as const,
      text: "Conservation of Momentum",
    },
    {
      type: "paragraph" as const,
      text: "The total momentum of an isolated system (a system with no external force) is conserved. This means the total momentum before an interaction is equal to the total momentum after the interaction.",
    },
    {
      type: "formula" as const,
      text: "m\u2081u\u2081 + m\u2082u\u2082 = m\u2081v\u2081 + m\u2082v\u2082",
      caption: "Conservation of linear momentum in a two-body system",
    },
  ],
  prevChapter: { id: "p4-work-energy-power", title: "Work, Energy and Power" },
  nextChapter: { id: "p6-circular-motion", title: "System of Particles and Rotational Motion" },
};


/* ── Floating particles for warm light theme ── */
const PARTICLES = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  left: `${10 + i * 15}%`,
  delay: i * 1.0,
  duration: 7 + (i % 3) * 2,
  size: 2,
}));

/* ── Generate heading slug for anchor IDs ── */
function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/* ── Render content block ── */
function ContentBlock({ block, index }: { block: (typeof MATERIAL.content)[number]; index: number }) {
  switch (block.type) {
    case "heading":
      return (
        <motion.h2
          id={toSlug(block.text)}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 + index * 0.04, ease: ease.gentle }}
          className="font-display text-[24px] leading-[32px] tracking-[-0.01em] text-text-primary mt-10 mb-4 scroll-mt-8"
        >
          {block.text}
        </motion.h2>
      );
    case "paragraph":
      return (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 + index * 0.04, ease: ease.gentle }}
          className="text-body-lg text-text-secondary leading-[1.8] mb-4"
        >
          {block.text}
        </motion.p>
      );
    case "keyterm":
      return (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 + index * 0.04, ease: ease.gentle }}
          whileHover={{ y: -2 }}
          className="my-6 rounded-xl border-l-2 border-orange-800 p-5"
          style={{ backgroundColor: "rgba(242,116,13,0.06)" }}
        >
          <p className="text-heading-3 text-orange-400 mb-1">
            {"term" in block ? block.term : ""}
          </p>
          <p className="text-body-lg text-text-secondary leading-[1.7]">
            {"definition" in block ? block.definition : ""}
          </p>
        </motion.div>
      );
    case "formula":
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 + index * 0.04, ease: ease.gentle }}
          className="my-6 flex flex-col items-center gap-2"
        >
          <motion.div
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(242,116,13,0.08)" }}
            className="rounded-xl px-8 py-5 border border-border-subtle transition-shadow"
            style={{ backgroundColor: "var(--color-portal-student-surface)" }}
          >
            <p className="font-mono text-[22px] text-text-primary text-center tracking-wide">
              {block.text}
            </p>
          </motion.div>
          {"caption" in block && block.caption && (
            <p className="text-body-sm text-text-muted italic text-center">{block.caption}</p>
          )}
        </motion.div>
      );
    default:
      return null;
  }
}

export function MaterialViewer() {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const addToast = useUIStore((s) => s.addToast);

  /* ── Extract headings for Table of Contents ── */
  const headings = useMemo(
    () =>
      MATERIAL.content
        .filter((block) => block.type === "heading")
        .map((block) => ({
          text: block.text,
          slug: toSlug(block.text),
        })),
    [],
  );

  function handleBookmark() {
    const next = !isBookmarked;
    setIsBookmarked(next);
    addToast(next ? "Bookmarked!" : "Bookmark removed", "info");
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    addToast("Link copied to clipboard!", "success");
  }

  function scrollToHeading(slug: string) {
    const el = document.getElementById(slug);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div className="relative pb-16">
      {/* ── Animated background blob (warm light theme) ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full opacity-[0.05]"
          style={{
            background: "radial-gradient(circle, #f2740d 0%, #fb923c 40%, transparent 70%)",
            filter: "blur(100px)",
          }}
          animate={{
            x: [0, 20, -15, 0],
            y: [0, -15, 10, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 -left-32 h-[350px] w-[350px] rounded-full opacity-[0.04]"
          style={{
            background: "radial-gradient(circle, #fb923c 0%, #f59e0b 40%, transparent 70%)",
            filter: "blur(100px)",
          }}
          animate={{
            x: [0, 15, -10, 0],
            y: [0, 20, -15, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Light dot grid */}
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

      {/* ── Breadcrumb ── */}
      <motion.div
        initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.4, ease: ease.gentle }}
        className="relative flex items-center gap-2 text-body-sm text-text-muted mb-6"
      >
        <Link
          to="/student/materials"
          className="hover:text-text-secondary transition-colors"
        >
          Study Materials
        </Link>
        <ChevronRight size={14} strokeWidth={1.5} />
        <span className="text-text-secondary">{MATERIAL.subject}</span>
        <ChevronRight size={14} strokeWidth={1.5} />
        <span className="text-text-primary">Chapter {MATERIAL.chapter}</span>
      </motion.div>

      {/* ── Article header with blur entrance ── */}
      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.6, delay: 0.1, ease: ease.gentle }}
        className="relative max-w-[680px] mx-auto mb-8 lg:ml-64 lg:mr-auto"
      >
        <p className="text-overline text-orange-500 mb-3">{MATERIAL.subtitle}</p>
        <h1 className="text-display-lg text-text-primary mb-4">{MATERIAL.title}</h1>
        <div className="flex items-center gap-4 text-body-sm text-text-muted">
          <span className="flex items-center gap-1.5">
            <BookOpen size={14} strokeWidth={1.5} />
            15 min read
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBookmark}
            className={`flex items-center gap-1.5 transition-colors ${
              isBookmarked ? "text-orange-400" : "hover:text-text-secondary"
            }`}
          >
            <Bookmark
              size={14}
              strokeWidth={1.5}
              fill={isBookmarked ? "currentColor" : "none"}
            />
            {isBookmarked ? "Bookmarked" : "Bookmark"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="flex items-center gap-1.5 hover:text-text-secondary transition-colors"
          >
            <Share2 size={14} strokeWidth={1.5} />
            Share
          </motion.button>
        </div>
        {/* Animated accent line */}
        <motion.div
          className="h-px mt-6"
          style={{
            background: "linear-gradient(90deg, transparent, #f2740d, #fb923c, transparent)",
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: ease.gentle }}
        />
      </motion.div>

      {/* ── Sticky Table of Contents sidebar (large screens only) ── */}
      <aside className="hidden lg:block fixed top-32 left-8 w-52 z-20">
        <motion.nav
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: ease.gentle }}
          className="space-y-1"
        >
          <p className="text-overline text-text-muted mb-3 px-3">On this page</p>
          {headings.map((heading) => (
            <button
              key={heading.slug}
              onClick={() => scrollToHeading(heading.slug)}
              className="block w-full text-left rounded-[var(--radius-sm)] px-3 py-1.5 text-body-sm text-text-muted hover:text-text-primary hover:bg-black/5 transition-colors truncate"
            >
              {heading.text}
            </button>
          ))}
        </motion.nav>
      </aside>

      {/* ── Content body with staggered content blocks ── */}
      <motion.article
        {...fadeUpProps(12, 0.2)}
        className="relative max-w-[680px] mx-auto lg:ml-64 lg:mr-auto"
      >
        {MATERIAL.content.map((block, i) => (
          <ContentBlock key={i} block={block} index={i} />
        ))}
      </motion.article>

      {/* ── Ask Erudio contextual prompt with hover effect ── */}
      <motion.div
        {...fadeUpProps(12, 0.3)}
        className="relative max-w-[680px] mx-auto mt-12 lg:ml-64 lg:mr-auto"
      >
        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
          <Link
            to="/student/tutor/$topicId"
            params={{ topicId: MATERIAL.id }}
            className="group relative flex items-center gap-4 rounded-xl border border-orange-500/20 p-5 transition-all duration-200 hover:shadow-glow-orange hover:border-orange-500/30 overflow-hidden"
            style={{ backgroundColor: "rgba(242,116,13,0.06)" }}
          >
            {/* Hover glow overlay */}
            <div
              className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background: "radial-gradient(ellipse at 30% 50%, rgba(242,116,13,0.06) 0%, transparent 70%)",
              }}
            />
            <motion.div
              className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-500/15"
              animate={{ scale: [1, 1.06, 1], opacity: [0.9, 1, 0.9] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <MessageCircle size={22} strokeWidth={1.5} className="text-orange-400" />
            </motion.div>
            <div className="relative z-10">
              <p className="text-heading-3 text-text-primary">
                Have questions about Laws of Motion?
              </p>
              <p className="text-body-sm text-text-secondary mt-0.5">
                Ask Erudio \u2014 your AI tutor can explain concepts, solve problems, and more
              </p>
            </div>
            <ChevronRight
              size={20}
              strokeWidth={1.5}
              className="relative z-10 ml-auto shrink-0 text-text-muted transition-transform duration-200 group-hover:translate-x-1 group-hover:text-orange-400"
            />
          </Link>
        </motion.div>
      </motion.div>

      {/* ── Chapter navigation with hover effects ── */}
      <motion.div
        {...fadeUpProps(12, 0.35)}
        className="relative max-w-[680px] mx-auto mt-10 flex items-stretch gap-4 lg:ml-64 lg:mr-auto"
      >
        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }} className="flex-1">
          <Link
            to="/student/materials/$id"
            params={{ id: MATERIAL.prevChapter.id }}
            className="group flex h-full items-center gap-3 rounded-xl border border-border-subtle p-5 transition-all duration-200 hover:border-border-default hover:shadow-sm"
            style={{ backgroundColor: "var(--color-portal-student-surface)" }}
          >
            <ChevronLeft
              size={20}
              strokeWidth={1.5}
              className="shrink-0 text-text-muted transition-transform duration-200 group-hover:-translate-x-1"
            />
            <div className="min-w-0">
              <p className="text-caption text-text-muted">Previous Chapter</p>
              <p className="text-body-md text-text-primary font-medium truncate mt-0.5">
                {MATERIAL.prevChapter.title}
              </p>
            </div>
          </Link>
        </motion.div>
        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }} className="flex-1">
          <Link
            to="/student/materials/$id"
            params={{ id: MATERIAL.nextChapter.id }}
            className="group flex h-full items-center justify-end gap-3 rounded-xl border border-border-subtle p-5 transition-all duration-200 hover:border-border-default hover:shadow-sm"
            style={{ backgroundColor: "var(--color-portal-student-surface)" }}
          >
            <div className="min-w-0 text-right">
              <p className="text-caption text-text-muted">Next Chapter</p>
              <p className="text-body-md text-text-primary font-medium truncate mt-0.5">
                {MATERIAL.nextChapter.title}
              </p>
            </div>
            <ChevronRight
              size={20}
              strokeWidth={1.5}
              className="shrink-0 text-text-muted transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
