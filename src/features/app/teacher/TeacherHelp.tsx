import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import {
  BookOpen,
  ChevronDown,
  MessageCircle,
  Mail,
  Sparkles,
  Upload,
  FolderOpen,
  HelpCircle,
} from "lucide-react";
import {
  fadeUpProps,
  staggerItemProps,
  ease,
  duration,
} from "@/lib/animation";

/* ── FAQ data ── */
const FAQ_ITEMS = [
  {
    question: "How do I generate content for a specific chapter?",
    answer:
      "Navigate to the Generate page from the top navigation. Select the class, subject, and enter the chapter or topic name. Choose the content types you need (Lesson Plan, Practice Questions, Handout, or Summary Notes), set the difficulty level, and click Generate. The AI will create NCERT-aligned content tailored to your specifications.",
  },
  {
    question: "Can I edit generated content before saving?",
    answer:
      "Yes! After content is generated, you can click the \"Edit\" button to open the Content Editor. The editor provides a split view with your editable content on the left and a live preview on the right. Use the formatting toolbar for bold, italic, headings, and lists. Click \"Save Changes\" when you are done.",
  },
  {
    question: "What file formats can I download?",
    answer:
      "Generated content can be downloaded in two formats: PDF (for printing or sharing digitally) and DOCX (for further editing in Microsoft Word or Google Docs). Both formats preserve the original formatting and structure of your content.",
  },
  {
    question: "How does the PDF upload feature work?",
    answer:
      "You can upload any PDF document (up to 25 MB) through the Upload PDF page. The system automatically detects chapters and sections within your document. Once uploaded, you can generate teaching materials directly from the PDF content, which helps when you want to create supplementary materials from textbooks or reference books.",
  },
  {
    question: "Is the content aligned with NCERT syllabus?",
    answer:
      "Yes, all generated content is aligned with the NCERT curriculum for Classes 9 through 12. The AI has been trained on NCERT textbooks, exemplar problems, and the CBSE curriculum framework. Each piece of content is tagged with the correct class, subject, and chapter for easy organisation.",
  },
  {
    question: "Can I generate content in Hindi?",
    answer:
      "Yes! When generating content, you can select Hindi as the language option. The AI generates content in Hindi that maintains the same educational quality and NCERT alignment. Hindi generation works best for Science and Mathematics content. You can also generate content in English and translate it later.",
  },
] as const;

const GETTING_STARTED_STEPS = [
  {
    icon: BookOpen,
    title: "Browse the Library",
    description: "Explore the Content Library to find pre-made NCERT-aligned materials for your classes. Filter by class, subject, and chapter.",
  },
  {
    icon: Sparkles,
    title: "Generate Content",
    description: "Use the Generate page to create custom lesson plans, practice questions, handouts, and summary notes for any NCERT topic.",
  },
  {
    icon: Upload,
    title: "Upload PDFs",
    description: "Upload your own PDF documents and let the AI generate teaching materials from them. Great for supplementary textbooks.",
  },
  {
    icon: FolderOpen,
    title: "Organise Materials",
    description: "Save generated content to My Materials. Edit, download, and manage all your teaching resources in one place.",
  },
] as const;

/* ── Floating particles ── */
const PARTICLES = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  left: `${6 + i * 12}%`,
  delay: i * 0.65,
  duration: 6 + Math.random() * 4,
  size: 2 + Math.random() * 1.5,
}));

export function TeacherHelp() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function toggleFaq(index: number) {
    setOpenFaq((prev) => (prev === index ? null : index));
  }

  return (
    <div className="relative space-y-10 max-w-3xl">
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
              y: [0, -650],
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
        <h1 className="text-display-md text-text-primary">
          Help & Tutorials
        </h1>
        <p className="mt-1 text-body-md text-text-secondary">
          Learn how to make the most of Erudio for your classroom.
        </p>
      </motion.div>

      {/* Getting Started */}
      <motion.div
        {...fadeUpProps(16, 0.1)}
        className="space-y-4"
      >
        <h2 className="text-heading-2 text-text-primary">Getting Started</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {GETTING_STARTED_STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={i}
                {...staggerItemProps(0.15 + i * 0.07, 16)}
                whileHover={{ y: -4, boxShadow: "0 8px 40px rgba(242,116,16,0.06)" }}
                transition={{ duration: 0.25, ease: ease.gentle }}
                className="relative overflow-hidden rounded-[var(--radius-lg)] border border-border-subtle bg-bg-surface p-5"
              >
                {/* Gradient glow overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-orange-500/[0.02] via-transparent to-orange-500/[0.01] opacity-0 transition-opacity duration-300 hover:opacity-100" />
                <div className="relative flex items-start gap-4">
                  <motion.div
                    animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
                    transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-orange-500/10"
                  >
                    <Icon size={20} strokeWidth={1.5} className="text-orange-400" />
                  </motion.div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500/15 text-caption font-semibold text-orange-400">
                        {i + 1}
                      </span>
                      <h3 className="text-heading-3 text-text-primary">{step.title}</h3>
                    </div>
                    <p className="mt-1.5 text-body-sm text-text-secondary">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* FAQ Accordion */}
      <motion.div
        {...fadeUpProps(16, 0.25)}
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          {/* Breathing help icon */}
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <HelpCircle size={20} strokeWidth={1.5} className="text-text-muted" />
          </motion.div>
          <h2 className="text-heading-2 text-text-primary">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-2">
          {FAQ_ITEMS.map((item, i) => (
            <motion.div
              key={i}
              {...staggerItemProps(0.3 + i * 0.05, 10, 0.35)}
              whileHover={{ y: -2, boxShadow: "0 4px 20px rgba(242,116,16,0.04)" }}
              transition={{ duration: 0.2, ease: ease.gentle }}
              className="rounded-[var(--radius-md)] border border-border-subtle bg-bg-surface overflow-hidden"
            >
              <motion.button
                onClick={() => toggleFaq(i)}
                whileTap={{ scale: 0.995 }}
                className="flex w-full items-center justify-between gap-4 p-4 text-left transition-colors hover:bg-bg-elevated"
              >
                <span className="text-body-md font-medium text-text-primary">
                  {item.question}
                </span>
                <motion.div
                  animate={{ rotate: openFaq === i ? 180 : 0 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  className="shrink-0"
                >
                  <ChevronDown size={18} strokeWidth={1.5} className="text-text-muted" />
                </motion.div>
              </motion.button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-border-subtle px-4 pb-4 pt-3">
                      <p className="text-body-md text-text-secondary" style={{ lineHeight: "1.7" }}>
                        {item.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Contact Support */}
      <motion.div
        {...fadeUpProps(16, 0.4)}
        whileHover={{ y: -4, boxShadow: "0 8px 40px rgba(242,116,16,0.08)" }}
        transition={{ duration: 0.25, ease: ease.gentle }}
        className="relative overflow-hidden rounded-[var(--radius-lg)] border border-orange-500/20 bg-orange-500/5 p-6"
      >
        {/* Gradient glow overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-orange-500/[0.03] via-transparent to-transparent" />
        <div className="relative flex items-start gap-4">
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-orange-500/15"
          >
            <MessageCircle size={22} strokeWidth={1.5} className="text-orange-400" />
          </motion.div>
          <div className="flex-1">
            <h3 className="text-heading-2 text-text-primary">Need more help?</h3>
            <p className="mt-1 text-body-md text-text-secondary">
              Our support team is available Monday to Saturday, 9 AM to 6 PM IST. We typically respond within 2 hours.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <motion.a
                href="mailto:support@erudio.in"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-orange-500 px-4 py-2 text-body-sm font-medium text-white transition-all duration-200 hover:bg-orange-600 hover:shadow-glow-orange"
              >
                <Mail size={16} strokeWidth={1.5} />
                Email Support
              </motion.a>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-border-strong bg-bg-elevated px-4 py-2 text-body-sm font-medium text-text-primary transition-colors hover:bg-bg-muted"
              >
                <MessageCircle size={16} strokeWidth={1.5} />
                Live Chat
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
