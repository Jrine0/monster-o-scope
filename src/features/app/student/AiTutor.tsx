import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import {
  Send,
  Sparkles,
  BookOpen,
  Atom,
  Calculator,
  FlaskConical,
  Leaf,
  ChevronRight,
  Bot,
  User,
} from "lucide-react";
import {
  ease,
  fadeUpProps,
  staggerDelay,
  breatheLoop,
} from "@/lib/animation";

/* ── Mock conversation ── */
const INITIAL_MESSAGES: Array<{
  id: number;
  role: "tutor" | "student";
  text: string;
}> = [
  {
    id: 1,
    role: "tutor",
    text: "Hi Rahul! I\u2019m your AI tutor. What would you like to learn about today? You can ask me about any NCERT topic \u2014 I\u2019m here to help you understand, not just memorize.",
  },
];

const MOCK_REPLY = {
  id: 3,
  role: "tutor" as const,
  text: "Great question! Photosynthesis is the process by which green plants convert carbon dioxide and water into glucose and oxygen using sunlight.\n\nThe overall equation is:\n6CO\u2082 + 6H\u2082O \u2192 C\u2086H\u2081\u2082O\u2086 + 6O\u2082\n\nThe process happens in two stages:\n\n1. **Light-dependent reactions** \u2014 occur in the thylakoid membranes. Sunlight splits water molecules, releasing O\u2082 and producing ATP + NADPH.\n\n2. **Light-independent reactions (Calvin Cycle)** \u2014 occur in the stroma. CO\u2082 is fixed into glucose using the ATP and NADPH from step 1.\n\nThink of it like a factory: the light reactions are the power plant (generating energy), and the Calvin Cycle is the assembly line (building glucose).\n\nWould you like me to explain either stage in more detail?",
};

/* ── Suggested topics ── */
const SUGGESTED_TOPICS = [
  { icon: Atom, text: "Explain Newton\u2019s Third Law with examples", color: "#a855f7" },
  { icon: FlaskConical, text: "What is the difference between acids and bases?", color: "#22c55e" },
  { icon: Calculator, text: "How do I solve quadratic equations?", color: "#3b82f6" },
  { icon: Leaf, text: "Explain the process of photosynthesis", color: "#ec4899" },
];

/* ── Floating particles for warm light theme ── */
const PARTICLES = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  left: `${8 + i * 16}%`,
  delay: i * 0.9,
  duration: 7 + (i % 3) * 2,
  size: 2,
}));

/* ── Animated gradient border for avatar ── */
function AvatarOrb() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Rotating conic gradient border */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, #f2740d, #fb923c, #f59e0b, #f2740d, #a855f7, #6571f5, #f2740d)",
          animation: "spin-slow 6s linear infinite",
          filter: "blur(2px)",
        }}
      />
      {/* Pulsing glow */}
      <div
        className="absolute inset-[-8px] rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(circle, rgba(242,116,13,0.3) 0%, transparent 70%)",
          animation: "pulse-glow 3s ease-in-out infinite",
        }}
      />
      {/* Inner circle */}
      <div
        className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full"
        style={{
          background: "linear-gradient(135deg, #1c1a17 0%, #13110f 100%)",
          margin: "3px",
        }}
      >
        <motion.div {...breatheLoop(3.5)}>
          <Sparkles size={32} strokeWidth={1.5} className="text-orange-400" />
        </motion.div>
      </div>
    </div>
  );
}

export function AiTutor() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      role: "student" as const,
      text: text.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { ...MOCK_REPLY, id: Date.now() + 1 }]);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestedTopic = (text: string) => {
    sendMessage(text);
  };

  const showWelcome = messages.length <= 1;

  return (
    <div className="relative flex h-[calc(100dvh-76px)] flex-col lg:flex-row gap-6">
      {/* ── Animated background blob (warm light theme) ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-32 left-1/2 h-[400px] w-[400px] rounded-full opacity-[0.05]"
          style={{
            background: "radial-gradient(circle, #f2740d 0%, #fb923c 40%, transparent 70%)",
            filter: "blur(100px)",
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 15, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 h-[350px] w-[350px] rounded-full opacity-[0.04]"
          style={{
            background: "radial-gradient(circle, #fb923c 0%, #f59e0b 40%, transparent 70%)",
            filter: "blur(100px)",
          }}
          animate={{
            x: [0, -20, 15, 0],
            y: [0, 20, -10, 0],
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

      {/* ── Left: Context area ── */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: ease.gentle }}
        className="relative hidden lg:flex lg:w-[340px] shrink-0 flex-col rounded-xl border border-border-subtle overflow-hidden"
        style={{ backgroundColor: "var(--color-portal-student-surface)" }}
      >
        <div className="border-b border-border-subtle p-5">
          <h2 className="text-heading-3 text-text-primary flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <BookOpen size={18} strokeWidth={1.5} className="text-orange-400" />
            </motion.div>
            Study Context
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <p className="text-body-sm text-text-muted">
            Open a study material or video, then ask Erudio for help. The tutor will know what you\u2019re studying.
          </p>
          <div className="space-y-3">
            {[
              { label: "Physics", chapter: "Laws of Motion", id: "p5" },
              { label: "Chemistry", chapter: "Chemical Reactions", id: "c1" },
              { label: "Mathematics", chapter: "Quadratic Equations", id: "m4" },
              { label: "Biology", chapter: "Life Processes", id: "b1" },
            ].map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.4, ease: ease.gentle }}
                whileHover={{ x: 3 }}
              >
                <Link
                  to="/student/tutor/$topicId"
                  params={{ topicId: item.id }}
                  className="group flex items-center gap-3 rounded-lg border border-border-subtle p-3 transition-all duration-200 hover:border-border-default hover:bg-orange-500/[0.03]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-caption text-text-muted">{item.label}</p>
                    <p className="text-body-sm text-text-primary font-medium truncate">
                      {item.chapter}
                    </p>
                  </div>
                  <ChevronRight
                    size={14}
                    strokeWidth={1.5}
                    className="shrink-0 text-text-muted transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Right: Chat area ── */}
      <motion.div
        {...fadeUpProps(12, 0.1)}
        className="relative flex flex-1 flex-col min-h-0"
      >
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto pb-4 space-y-1">
          {/* ── Welcome state with avatar ── */}
          {showWelcome && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: ease.gentle }}
              className="flex flex-col items-center justify-center gap-6 pt-8 pb-6"
            >
              <AvatarOrb />
              <div className="text-center max-w-md">
                <motion.h2
                  initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.5, delay: 0.2, ease: ease.gentle }}
                  className="text-display-sm text-text-primary mb-2"
                >
                  Hi Rahul! What would you like to learn about today?
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-body-md text-text-secondary"
                >
                  I can explain concepts, solve problems, and help you prepare for exams.
                </motion.p>
              </div>

              {/* Suggested topics with stagger + hover */}
              <div className="grid grid-cols-1 gap-3 w-full max-w-lg sm:grid-cols-2">
                {SUGGESTED_TOPICS.map((topic, i) => {
                  const Icon = topic.icon;
                  return (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * staggerDelay.normal }}
                      whileHover={{ y: -3, boxShadow: "0 4px 16px rgba(242,116,13,0.08)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSuggestedTopic(topic.text)}
                      className="group relative flex items-start gap-3 rounded-xl border border-border-subtle p-4 text-left transition-all duration-200 hover:border-orange-500/20 overflow-hidden"
                      style={{ backgroundColor: "var(--color-portal-student-surface)" }}
                    >
                      {/* Warm glow on hover */}
                      <div
                        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        style={{
                          background: "radial-gradient(ellipse at 20% 50%, rgba(242,116,13,0.04) 0%, transparent 70%)",
                        }}
                      />
                      <div
                        className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${topic.color}15` }}
                      >
                        <Icon size={16} strokeWidth={1.5} style={{ color: topic.color }} />
                      </div>
                      <span className="relative z-10 text-body-sm text-text-secondary group-hover:text-text-primary transition-colors leading-snug">
                        {topic.text}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ── Messages ── */}
          {!showWelcome && (
            <div className="space-y-4 pt-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, ease: ease.gentle }}
                  className={`flex gap-3 ${msg.role === "student" ? "flex-row-reverse" : ""}`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      msg.role === "tutor"
                        ? "bg-orange-500/15"
                        : "bg-bg-elevated"
                    }`}
                  >
                    {msg.role === "tutor" ? (
                      <Bot size={16} strokeWidth={1.5} className="text-orange-400" />
                    ) : (
                      <User size={16} strokeWidth={1.5} className="text-text-secondary" />
                    )}
                  </div>

                  {/* Message bubble */}
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
                    <p className="text-body-lg leading-[1.7] whitespace-pre-line">
                      {msg.text}
                    </p>
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
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ── Input area with micro-interactions ── */}
        <motion.form
          {...fadeUpProps(12, 0.2)}
          onSubmit={handleSubmit}
          className="shrink-0 flex items-center gap-3 rounded-xl border border-border-subtle p-3"
          style={{ backgroundColor: "var(--color-portal-student-surface)" }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
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
