import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import {
  Send,
  Sparkles,
  BookOpen,
  ChevronRight,
  Bot,
  User,
  ArrowLeft,
  FileText,
} from "lucide-react";
import {
  ease,
  fadeUpProps,
  breatheLoop,
} from "@/lib/animation";

/* ── Mock topic context (Physics: Laws of Motion) ── */
const TOPIC = {
  id: "p5",
  subject: "Physics",
  chapter: "Chapter 5: Laws of Motion",
  description:
    "Newton\u2019s three laws of motion, inertia, force, acceleration, momentum, conservation of momentum.",
  keyPoints: [
    "Newton\u2019s First Law \u2014 Law of Inertia",
    "F = ma (Second Law)",
    "Action-Reaction pairs (Third Law)",
    "Conservation of Momentum",
    "Impulse and its applications",
  ],
};

/* ── Suggested questions as chips ── */
const SUGGESTED_QUESTIONS = [
  "What is the difference between mass and weight?",
  "Explain conservation of momentum with an example",
  "Why do action-reaction forces not cancel each other?",
  "How does F = ma apply to a car accelerating?",
  "What happens to momentum in an explosion?",
];

/* ── Initial conversation ── */
const INITIAL_MESSAGES: Array<{
  id: number;
  role: "tutor" | "student";
  text: string;
}> = [
  {
    id: 1,
    role: "tutor",
    text: "I see you\u2019re studying Chapter 5: Laws of Motion. This is one of the most important chapters in Physics \u2014 it forms the foundation for everything from gravitation to fluid mechanics.\n\nWhat questions do you have? I can explain any concept, walk through numerical problems, or help you understand the real-world applications.",
  },
];

const MOCK_REPLIES: Record<string, string> = {
  default:
    "That\u2019s a great question about Laws of Motion! Let me explain...\n\nNewton\u2019s laws describe the relationship between a body and the forces acting upon it, and the body\u2019s motion in response to those forces.\n\nThe key insight is that force is not what keeps an object moving \u2014 it\u2019s what changes the motion. An object in motion will stay in motion unless a force acts on it (First Law).\n\nWould you like me to go deeper into any specific aspect?",
  "What is the difference between mass and weight?":
    "Great question! Mass and weight are related but fundamentally different:\n\n**Mass** is the amount of matter in an object. It\u2019s an intrinsic property \u2014 your mass is the same whether you\u2019re on Earth, the Moon, or floating in space. Measured in kilograms (kg).\n\n**Weight** is the gravitational force acting on that mass: W = mg. It depends on where you are. On Earth, g \u2248 9.8 m/s\u00B2. On the Moon, g \u2248 1.6 m/s\u00B2.\n\nSo if your mass is 60 kg:\n\u2022 Weight on Earth = 60 \u00D7 9.8 = 588 N\n\u2022 Weight on Moon = 60 \u00D7 1.6 = 96 N\n\nYour mass didn\u2019t change \u2014 but you feel much lighter on the Moon because gravity is weaker there.\n\nShall I explain how this connects to Newton\u2019s Second Law?",
  "Why do action-reaction forces not cancel each other?":
    "This is one of the most common confusions in physics! Here\u2019s the key:\n\n**Action-reaction forces act on DIFFERENT objects**, not on the same object.\n\nExample: When you push a wall:\n\u2022 You push the wall with force F (action) \u2192 acts on the wall\n\u2022 The wall pushes you back with force F (reaction) \u2192 acts on you\n\nThese forces are equal in magnitude but act on different bodies. For forces to cancel (produce zero net force), they must act on the **same** object.\n\nThink of it this way: when you stand on the ground, the ground pushes you up (normal force). If the ground\u2019s push and your weight canceled, you\u2019d have zero force on you \u2014 which is actually correct! That\u2019s why you\u2019re not accelerating. But those are **not** an action-reaction pair. The action-reaction pair would be:\n\u2022 You pull the Earth down (gravity on Earth due to you)\n\u2022 Earth pulls you down (your weight)\n\nWant me to draw out more examples?",
};

/* ── Floating particles for warm light theme ── */
const PARTICLES = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  left: `${10 + i * 15}%`,
  delay: i * 0.9,
  duration: 7 + (i % 3) * 2,
  size: 2,
}));

/* ── Animated gradient border for avatar ── */
function AvatarOrb({ size = "md" }: { size?: "sm" | "md" }) {
  const dim = size === "md" ? "h-20 w-20" : "h-14 w-14";
  const iconSize = size === "md" ? 28 : 20;
  return (
    <div className="relative flex items-center justify-center">
      <div
        className={`absolute inset-0 rounded-full`}
        style={{
          background:
            "conic-gradient(from 0deg, #f2740d, #fb923c, #f59e0b, #f2740d, #a855f7, #6571f5, #f2740d)",
          animation: "spin-slow 6s linear infinite",
          filter: "blur(2px)",
        }}
      />
      <div
        className="absolute inset-[-6px] rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(242,116,13,0.3) 0%, transparent 70%)",
          animation: "pulse-glow 3s ease-in-out infinite",
        }}
      />
      <div
        className={`relative z-10 flex ${dim} items-center justify-center rounded-full`}
        style={{
          background: "linear-gradient(135deg, #1c1a17 0%, #13110f 100%)",
          margin: "3px",
        }}
      >
        <motion.div {...breatheLoop(3.5)}>
          <Sparkles size={iconSize} strokeWidth={1.5} className="text-orange-400" />
        </motion.div>
      </div>
    </div>
  );
}

export function AiTutorTopic() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const trimmed = text.trim();

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "student" as const, text: trimmed },
    ]);
    setInput("");
    setIsTyping(true);

    const reply = MOCK_REPLIES[trimmed] ?? MOCK_REPLIES["default"];

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "tutor" as const, text: reply },
      ]);
    }, 1800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="relative flex h-[calc(100dvh-76px)] flex-col lg:flex-row gap-6">
      {/* ── Animated background blob (warm light theme) ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-32 right-1/4 h-[400px] w-[400px] rounded-full opacity-[0.05]"
          style={{
            background: "radial-gradient(circle, #f2740d 0%, #fb923c 40%, transparent 70%)",
            filter: "blur(100px)",
          }}
          animate={{
            x: [0, 25, -15, 0],
            y: [0, -20, 10, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full opacity-[0.04]"
          style={{
            background: "radial-gradient(circle, #fb923c 0%, #f59e0b 40%, transparent 70%)",
            filter: "blur(100px)",
          }}
          animate={{
            x: [0, -15, 20, 0],
            y: [0, 15, -10, 0],
          }}
          transition={{
            duration: 18,
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

      {/* ── Left: Chapter context panel ── */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: ease.gentle }}
        className="relative hidden lg:flex lg:w-[360px] shrink-0 flex-col rounded-xl border border-border-subtle overflow-hidden"
        style={{ backgroundColor: "var(--color-portal-student-surface)" }}
      >
        {/* Header */}
        <div className="border-b border-border-subtle p-5">
          <Link
            to="/student/tutor"
            className="flex items-center gap-1.5 text-body-sm text-text-muted hover:text-text-secondary transition-colors mb-3"
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            Back to Tutor
          </Link>
          <div className="flex items-center gap-3">
            <motion.div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10"
              animate={{ rotate: [0, 3, -3, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <BookOpen size={20} strokeWidth={1.5} className="text-purple-400" />
            </motion.div>
            <div>
              <p className="text-overline text-orange-500">{TOPIC.subject}</p>
              <h2 className="text-heading-3 text-text-primary">{TOPIC.chapter}</h2>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="p-5 border-b border-border-subtle">
          <p className="text-body-sm text-text-secondary leading-relaxed">
            {TOPIC.description}
          </p>
        </div>

        {/* Key points with stagger */}
        <div className="p-5 flex-1 overflow-y-auto">
          <h3 className="text-heading-4 text-text-primary mb-3 flex items-center gap-2">
            <FileText size={14} strokeWidth={1.5} className="text-text-muted" />
            Key Topics
          </h3>
          <ul className="space-y-2">
            {TOPIC.keyPoints.map((point, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08, duration: 0.4, ease: ease.gentle }}
                className="flex items-start gap-2"
              >
                <motion.div
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500/50"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, delay: i * 0.3, repeat: Infinity, ease: "easeInOut" }}
                />
                <span className="text-body-sm text-text-secondary">{point}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* View Material link */}
        <div className="border-t border-border-subtle p-4">
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Link
              to="/student/materials"
              className="group flex items-center gap-2 rounded-lg border border-border-subtle px-4 py-2.5 text-body-sm font-medium text-text-secondary transition-all duration-200 hover:border-border-default hover:text-text-primary w-full justify-center"
            >
              <BookOpen size={16} strokeWidth={1.5} />
              View Study Material
              <ChevronRight
                size={14}
                strokeWidth={1.5}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Right: Chat area ── */}
      <motion.div
        {...fadeUpProps(12, 0.1)}
        className="relative flex flex-1 flex-col min-h-0"
      >
        {/* ── Top bar with mini avatar ── */}
        <motion.div
          initial={{ opacity: 0, y: -8, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.5, ease: ease.gentle }}
          className="flex items-center gap-3 mb-4"
        >
          <AvatarOrb size="sm" />
          <div>
            <h2 className="text-heading-3 text-text-primary">Erudio AI Tutor</h2>
            <p className="text-body-sm text-text-secondary">
              Helping you with {TOPIC.chapter}
            </p>
          </div>
        </motion.div>

        {/* ── Messages ── */}
        <div className="flex-1 overflow-y-auto pb-4 space-y-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: ease.gentle }}
              className={`flex gap-3 ${msg.role === "student" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  msg.role === "tutor" ? "bg-orange-500/15" : "bg-bg-elevated"
                }`}
              >
                {msg.role === "tutor" ? (
                  <Bot size={16} strokeWidth={1.5} className="text-orange-400" />
                ) : (
                  <User size={16} strokeWidth={1.5} className="text-text-secondary" />
                )}
              </div>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                  msg.role === "student"
                    ? "rounded-tr-md bg-orange-500/15 text-text-primary"
                    : "rounded-tl-md border border-border-subtle"
                }`}
                style={
                  msg.role === "tutor"
                    ? { backgroundColor: "var(--color-portal-student-surface)" }
                    : undefined
                }
              >
                <p className="text-body-lg leading-[1.7] whitespace-pre-line">{msg.text}</p>
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500/15">
                <Bot size={16} strokeWidth={1.5} className="text-orange-400" />
              </div>
              <div
                className="rounded-2xl rounded-tl-md border border-border-subtle px-5 py-4"
                style={{ backgroundColor: "var(--color-portal-student-surface)" }}
              >
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((dot) => (
                    <motion.div
                      key={dot}
                      className="h-2 w-2 rounded-full bg-orange-400"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: dot * 0.2,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Suggested question chips with micro-interactions ── */}
        {messages.length <= 2 && (
          <motion.div
            {...fadeUpProps(6, 0.4)}
            className="shrink-0 flex gap-2 overflow-x-auto pb-3"
            style={{ scrollbarWidth: "none" }}
          >
            {SUGGESTED_QUESTIONS.map((q, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => sendMessage(q)}
                className="shrink-0 rounded-full border border-border-subtle px-4 py-2 text-body-sm text-text-secondary transition-all duration-200 hover:border-orange-500/20 hover:text-orange-400 hover:bg-orange-500/5"
              >
                {q}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* ── Input area with micro-interactions ── */}
        <motion.form
          {...fadeUpProps(12, 0.2)}
          onSubmit={handleSubmit}
          className="shrink-0 flex items-center gap-3 rounded-xl border border-border-subtle p-3"
          style={{ backgroundColor: "var(--color-portal-student-surface)" }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Laws of Motion..."
            className="flex-1 bg-transparent text-body-lg text-text-primary placeholder:text-text-muted outline-none"
          />
          <motion.button
            type="submit"
            disabled={!input.trim() || isTyping}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500 text-text-inverse transition-all duration-200 hover:bg-orange-400 hover:shadow-glow-orange disabled:opacity-40 disabled:pointer-events-none"
          >
            <Send size={18} strokeWidth={1.5} />
          </motion.button>
        </motion.form>
      </motion.div>

      {/* ── Inline keyframe styles ── */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.08); }
        }
      `}</style>
    </div>
  );
}
