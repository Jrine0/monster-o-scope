import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import {
  CheckCircle2,
  Download,
  Save,
  Edit3,
  FileText,
  HelpCircle,
  BookOpen,
  BarChart3,
  BookMarked,
  GraduationCap,
  Loader2,
  RefreshCw,
  Check,
} from "lucide-react";
import { ease, fadeUpProps, staggerItemProps, duration } from "@/lib/animation";
import { useUIStore } from "@/stores/useUIStore";

/* ── Celebration particle ── */
function CelebrationParticle({ delay, x, color }: { delay: number; x: number; color: string }) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: 6,
        height: 6,
        left: `${x}%`,
        top: "40%",
        backgroundColor: color,
      }}
      initial={{ opacity: 1, scale: 1 }}
      animate={{
        opacity: [1, 0.8, 0],
        scale: [0, 1, 0.5],
        y: [0, -120 - Math.random() * 80],
        x: [(Math.random() - 0.5) * 200],
      }}
      transition={{
        duration: 1.2 + Math.random() * 0.6,
        delay,
        ease: "easeOut",
      }}
    />
  );
}

const PARTICLE_COLORS = [
  "var(--color-orange-400)",
  "var(--color-orange-500)",
  "var(--color-success)",
  "var(--color-warning)",
  "#fb923c",
  "#fdba74",
  "#34d399",
];

const TABS = [
  { id: "lesson-plan", label: "Lesson Plan", icon: FileText },
  { id: "questions", label: "Questions", icon: HelpCircle },
  { id: "handout", label: "Handout", icon: BookOpen },
] as const;

const QUALITY_INDICATORS = [
  { label: "Word Count", value: "1,240", icon: BookMarked },
  { label: "Reading Level", value: "Grade 9", icon: GraduationCap },
  { label: "NCERT Alignment", value: "96%", icon: BarChart3 },
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

export function GenerationResult() {
  const [activeTab, setActiveTab] = useState("lesson-plan");
  const [showParticles, setShowParticles] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const addToast = useUIStore((s) => s.addToast);

  useEffect(() => {
    const timer = setTimeout(() => setShowParticles(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  function handleDownloadPdf() {
    if (isDownloading) return;
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      addToast("PDF downloaded successfully", "success");
    }, 1500);
  }

  function handleSave() {
    if (isSaved) return;
    setIsSaved(true);
    addToast("Saved to My Materials!", "success");
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

      {/* Celebration particles */}
      {showParticles && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {Array.from({ length: 28 }).map((_, i) => (
            <CelebrationParticle
              key={i}
              delay={i * 0.04}
              x={20 + (i * 2.5) % 60}
              color={PARTICLE_COLORS[i % PARTICLE_COLORS.length]}
            />
          ))}
        </div>
      )}

      {/* Success header */}
      <motion.div
        {...fadeUpProps(20, 0, 0.6)}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.2 }}
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <CheckCircle2 size={28} strokeWidth={1.5} className="text-emerald-400" />
          </motion.div>
        </motion.div>
        <motion.h1
          className="text-display-md text-text-primary"
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: duration.slow, delay: 0.1, ease: ease.gentle }}
        >
          Your content is ready
        </motion.h1>
        <p className="mt-1 text-body-md text-text-secondary">
          Atoms and Molecules &middot; Class 9 Chemistry
        </p>
        {/* Animated accent line */}
        <motion.div
          className="mx-auto mt-3 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "40%", opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: ease.gentle }}
        />
      </motion.div>

      {/* Quality indicators */}
      <motion.div
        {...fadeUpProps(12, 0.15, 0.45)}
        className="mx-auto flex max-w-md justify-center gap-6"
      >
        {QUALITY_INDICATORS.map((indicator, i) => {
          const Icon = indicator.icon;
          return (
            <motion.div
              key={indicator.label}
              {...staggerItemProps(0.25 + i * 0.08, 10, 0.35)}
              whileHover={{ y: -4, scale: 1.05 }}
              transition={{ duration: 0.3, ease: ease.gentle }}
              className="flex flex-col items-center gap-1 text-center"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, delay: i * 0.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Icon size={16} strokeWidth={1.5} className="text-text-muted" />
              </motion.div>
              <span className="text-heading-3 text-text-primary">{indicator.value}</span>
              <span className="text-caption text-text-muted">{indicator.label}</span>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Tabs */}
      <motion.div
        {...fadeUpProps(12, 0.25, 0.45)}
        className="flex gap-1 rounded-[var(--radius-md)] bg-bg-elevated p-1 w-fit mx-auto"
      >
        {TABS.map((tab) => {
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
                  layoutId="result-tab-bg"
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

      {/* Content preview */}
      <motion.div
        {...fadeUpProps(16, 0.3)}
        className="group relative overflow-hidden rounded-[var(--radius-lg)] border border-border-subtle bg-bg-surface p-8 transition-all duration-300 hover:border-orange-500/20"
        whileHover={{ y: -2 }}
      >
        {/* Card hover glow */}
        <div className="pointer-events-none absolute inset-0 rounded-[var(--radius-lg)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-orange-500/[0.02] via-transparent to-orange-500/[0.01]" />

        <div className="mx-auto max-w-[680px] space-y-6" style={{ lineHeight: "1.75" }}>
          {activeTab === "lesson-plan" && (
            <motion.div
              key="lesson-plan"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
            >
              <h2 className="text-heading-1 text-text-primary">
                Lesson Plan: Atoms and Molecules
              </h2>
              <div className="space-y-2">
                <h3 className="text-heading-2 text-text-primary">Learning Objectives</h3>
                <p className="text-body-lg text-text-secondary">
                  Students will understand the fundamental concepts of atoms and molecules,
                  differentiate between elements and compounds, and calculate molecular masses
                  using atomic mass units as per NCERT Class 9 Science Chapter 3.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-heading-2 text-text-primary">Introduction (15 min)</h3>
                <p className="text-body-lg text-text-secondary">
                  Open with a discussion: &ldquo;What is the smallest piece of matter?&rdquo;
                  Introduce Dalton&rsquo;s atomic theory. Explain the laws of chemical combination
                  &mdash; conservation of mass and constant proportions.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-heading-2 text-text-primary">Core Teaching (25 min)</h3>
                <ul className="list-disc space-y-1.5 pl-6 text-body-lg text-text-secondary">
                  <li>Define atoms, molecules, elements, and compounds with NCERT examples</li>
                  <li>Explain chemical formulae and how atoms combine in fixed ratios</li>
                  <li>Introduce atomic mass unit (amu) and the concept of relative atomic mass</li>
                  <li>Walk through molecular mass calculation: H&#8322;O = 2(1) + 16 = 18 amu</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="text-heading-2 text-text-primary">Activity (10 min)</h3>
                <p className="text-body-lg text-text-secondary">
                  Pair activity: Students calculate molecular mass of NaCl, CaCO&#8323;,
                  H&#8322;SO&#8324;, CH&#8324;, and C&#8326;H&#8321;&#8322;O&#8326;.
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === "questions" && (
            <motion.div
              key="questions"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
            >
              <h2 className="text-heading-1 text-text-primary">
                Practice Questions: Atoms and Molecules
              </h2>

              {[
                {
                  q: "What are the postulates of Dalton's atomic theory?",
                  type: "Short Answer",
                },
                {
                  q: "Calculate the molecular mass of calcium carbonate (CaCO\u2083). Given: Ca = 40, C = 12, O = 16.",
                  type: "Numerical",
                },
                {
                  q: "Which of the following correctly represents a molecule of an element?\n(a) H\u2082O  (b) CO\u2082  (c) O\u2082  (d) NaCl",
                  type: "MCQ",
                },
                {
                  q: "Differentiate between atoms and molecules with two examples each.",
                  type: "Long Answer",
                },
                {
                  q: "What is the atomicity of ozone (O\u2083)?",
                  type: "Short Answer",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.06, ease: ease.gentle }}
                  whileHover={{ y: -2, borderColor: "rgba(242,116,13,0.25)" }}
                  className="rounded-[var(--radius-md)] border border-border-subtle bg-bg-elevated p-4 space-y-2 transition-all duration-200"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500/12 text-caption font-semibold text-orange-400">
                      {i + 1}
                    </span>
                    <span className="rounded-[var(--radius-sm)] bg-bg-muted px-2 py-0.5 text-caption text-text-muted">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-body-md text-text-primary whitespace-pre-line">{item.q}</p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === "handout" && (
            <motion.div
              key="handout"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
            >
              <h2 className="text-heading-1 text-text-primary">
                Student Handout: Atoms and Molecules
              </h2>
              <div className="rounded-[var(--radius-md)] border-l-2 border-orange-500 bg-orange-500/5 p-4">
                <p className="text-body-lg text-text-secondary italic">
                  &ldquo;The smallest particle of an element that maintains its chemical identity
                  is called an atom.&rdquo; &mdash; NCERT Science, Class 9
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-heading-2 text-text-primary">Key Definitions</h3>
                <ul className="space-y-2 text-body-lg text-text-secondary">
                  <li><strong className="text-text-primary">Atom:</strong> The smallest particle of an element that can take part in a chemical reaction.</li>
                  <li><strong className="text-text-primary">Molecule:</strong> The smallest particle of a substance that can exist independently and retain all the properties of that substance.</li>
                  <li><strong className="text-text-primary">Ion:</strong> A charged atom or group of atoms formed by the loss or gain of electrons.</li>
                  <li><strong className="text-text-primary">Chemical Formula:</strong> A symbolic representation of the composition of a molecule.</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="text-heading-2 text-text-primary">Quick Reference Table</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-body-md">
                    <thead>
                      <tr className="border-b border-border-subtle text-left text-text-muted">
                        <th className="pb-2 pr-4 font-medium">Molecule</th>
                        <th className="pb-2 pr-4 font-medium">Formula</th>
                        <th className="pb-2 font-medium">Molecular Mass</th>
                      </tr>
                    </thead>
                    <tbody className="text-text-secondary">
                      <tr className="border-b border-border-subtle/50">
                        <td className="py-2 pr-4">Water</td>
                        <td className="py-2 pr-4">H&#8322;O</td>
                        <td className="py-2">18 amu</td>
                      </tr>
                      <tr className="border-b border-border-subtle/50">
                        <td className="py-2 pr-4">Carbon Dioxide</td>
                        <td className="py-2 pr-4">CO&#8322;</td>
                        <td className="py-2">44 amu</td>
                      </tr>
                      <tr className="border-b border-border-subtle/50">
                        <td className="py-2 pr-4">Sodium Chloride</td>
                        <td className="py-2 pr-4">NaCl</td>
                        <td className="py-2">58.5 amu</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">Calcium Carbonate</td>
                        <td className="py-2 pr-4">CaCO&#8323;</td>
                        <td className="py-2">100 amu</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Action bar */}
      <motion.div
        {...fadeUpProps(12, 0.4, 0.4)}
        className="flex flex-wrap items-center justify-center gap-3"
      >
        {/* Save to My Materials */}
        <motion.div whileHover={{ scale: isSaved ? 1 : 1.02 }} whileTap={{ scale: isSaved ? 1 : 0.98 }}>
          <button
            onClick={handleSave}
            disabled={isSaved}
            className={`group relative inline-flex items-center gap-2 overflow-hidden rounded-[var(--radius-md)] px-5 py-2.5 text-body-md font-medium transition-all duration-200 ${
              isSaved
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 cursor-default"
                : "bg-orange-500 text-white hover:bg-orange-600 hover:shadow-glow-orange"
            }`}
          >
            {!isSaved && (
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-orange-400/20 via-transparent to-orange-400/20" />
            )}
            {isSaved ? (
              <Check size={18} strokeWidth={1.5} />
            ) : (
              <Save size={18} strokeWidth={1.5} />
            )}
            {isSaved ? "Saved" : "Save to My Materials"}
          </button>
        </motion.div>

        {/* Regenerate */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            to="/teacher/generate"
            className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-border-strong bg-bg-elevated px-5 py-2.5 text-body-md font-medium text-text-primary transition-colors duration-200 hover:bg-bg-muted"
          >
            <RefreshCw size={18} strokeWidth={1.5} />
            Regenerate
          </Link>
        </motion.div>

        {/* Download PDF */}
        <motion.button
          whileHover={{ scale: isDownloading ? 1 : 1.02 }}
          whileTap={{ scale: isDownloading ? 1 : 0.98 }}
          onClick={handleDownloadPdf}
          disabled={isDownloading}
          className={`inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-border-strong bg-bg-elevated px-5 py-2.5 text-body-md font-medium text-text-primary transition-colors duration-200 ${
            isDownloading ? "opacity-70 cursor-not-allowed" : "hover:bg-bg-muted"
          }`}
        >
          {isDownloading ? (
            <Loader2 size={18} strokeWidth={1.5} className="animate-spin" />
          ) : (
            <Download size={18} strokeWidth={1.5} />
          )}
          {isDownloading ? "Downloading..." : "Download PDF"}
        </motion.button>

        {/* Edit */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            to="/teacher/materials"
            className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-border-subtle bg-transparent px-5 py-2.5 text-body-md font-medium text-text-secondary transition-colors duration-200 hover:text-text-primary hover:bg-bg-elevated"
          >
            <Edit3 size={18} strokeWidth={1.5} />
            Edit
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
