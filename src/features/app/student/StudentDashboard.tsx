// StudentDashboard.tsx — Tailwind CSS migration from inline styles
import { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import {
  Atom,
  Calculator,
  FlaskConical,
  BookOpen,
  TrendingUp,
  Flame,
  Trophy,
  ArrowRight,
  Sparkles,
  Play,
  Loader2,
} from "lucide-react";
import { ease, breatheLoop, pulseLoop } from "@/lib/animation";
import SmartLink from "@/components/smart-link";
import AccentLine from "@/components/accent-line";
import { fetchMe, type StudentUser } from "./api/student.api";

/* ── Mock data ── */
const CONTINUE_MATERIAL = {
  id: "phys-ch5",
  title: "Chapter 5: Laws of Motion",
  subject: "Physics",
  progress: 60,
  icon: Atom,
  color: "#a855f7",
  bg: "rgba(168,85,247,0.10)",
};

const STATS = [
  { label: "Quizzes Completed", value: 24, suffix: "", icon: Trophy, color: "#f2740d", bg: "rgba(242,116,13,0.10)", isStreak: false },
  { label: "Average Score", value: 76, suffix: "%", icon: TrendingUp, color: "#34d399", bg: "rgba(52,211,153,0.10)", isStreak: false },
  { label: "Day Streak", value: 5, suffix: "", icon: Flame, color: "#fb923c", bg: "rgba(251,146,60,0.10)", isStreak: true },
] as const;

const SUBJECTS = [
  { name: "Physics", icon: Atom, chapters: 12, completed: 7, color: "#a855f7", bg: "rgba(168,85,247,0.08)", border: "rgba(168,85,247,0.20)" },
  { name: "Mathematics", icon: Calculator, chapters: 14, completed: 8, color: "#3b82f6", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.20)" },
  { name: "Chemistry", icon: FlaskConical, chapters: 16, completed: 6, color: "#22c55e", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.20)" },
  { name: "English", icon: BookOpen, chapters: 10, completed: 7, color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.20)" },
] as const;

const MOTIVATIONAL_LINES = [
  "Every expert was once a beginner. Keep going!",
  "Small steps every day lead to big results.",
  "You're building something amazing, one chapter at a time.",
  "Consistency beats intensity. You've got this!",
  "The best time to learn is now.",
] as const;

function getGreeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

function getMotivationalLine() {
  return MOTIVATIONAL_LINES[new Date().getDate() % MOTIVATIONAL_LINES.length];
}

/* ── Animated background ── */
function StudentAnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute -top-28 right-[10%] h-[450px] w-[450px] rounded-full"
        style={{ background: "radial-gradient(circle,#f2740d 0%,transparent 70%)", filter: "blur(100px)", opacity: 0.05 }}
        animate={{ x: [0, 20, -15, 0], y: [0, -18, 12, 0], scale: [1, 1.04, 0.97, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-[8%] left-[5%] h-[350px] w-[350px] rounded-full"
        style={{ background: "radial-gradient(circle,#fb923c 0%,transparent 70%)", filter: "blur(100px)", opacity: 0.04 }}
        animate={{ x: [0, -15, 18, 0], y: [0, 15, -12, 0], scale: [1, 0.96, 1.03, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-[40%] left-1/2 h-[350px] w-[350px] -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(circle,#f2740d 0%,transparent 70%)", filter: "blur(120px)" }}
        animate={{ scale: [1, 1.18, 1], opacity: [0.02, 0.06, 0.02] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="absolute inset-0"
        style={{ backgroundImage: "radial-gradient(circle,rgba(242,116,13,0.032) 1px,transparent 1px)", backgroundSize: "32px 32px" }}
      />
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: i % 3 === 0 ? 3 : 2,
            height: i % 3 === 0 ? 3 : 2,
            left: `${12 + ((i * 7.9) % 76)}%`,
            top: `${22 + ((i * 9.1) % 56)}%`,
            background: i % 3 === 0 ? "rgba(242,116,13,0.4)" : i % 3 === 1 ? "rgba(251,146,60,0.3)" : "rgba(168,85,247,0.25)",
          }}
          animate={{ y: [0, -90 - i * 5], x: [0, i % 2 === 0 ? 12 : -12], opacity: [0, 0.55, 0] }}
          transition={{ duration: 5 + (i % 3) * 1.5, repeat: Infinity, delay: i * 0.45, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

/* ── Eyebrow ── */
function Eyebrow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <div className="h-px w-8 bg-orange opacity-50" />
      <span className="font-[Courier_Prime,monospace] text-[0.6rem] tracking-[0.2em] uppercase text-orange opacity-85">
        {label}
      </span>
      <div className="h-px flex-1 bg-border-subtle" />
    </div>
  );
}

/* ── Animated counter ── */
function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const controls = animate(count, target, { duration: 1.2, ease: ease.gentle });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => { controls.stop(); unsub(); };
  }, [count, rounded, target]);
  return <span>{display}{suffix}</span>;
}

/* ── Gradient orb ── */
function GradientOrb() {
  return (
    <div className="relative h-14 w-14 flex-shrink-0">
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: "radial-gradient(circle at 40% 40%,#f2740d,#fb923c 50%,#a855f7 100%)", filter: "blur(1px)" }}
        {...breatheLoop()}
      />
      <div
        className="absolute inset-0.5 rounded-full flex items-center justify-center bg-surface"
      >
        <Sparkles size={18} strokeWidth={1.5} className="text-orange" />
      </div>
    </div>
  );
}

/* ── Main ── */
export function StudentDashboard() {
  const greeting = getGreeting();
  const motivation = getMotivationalLine();
  const [user, setUser] = useState<StudentUser | null>(null);

  useEffect(() => {
    fetchMe().then(setUser).catch(() => {});
  }, []);

  return (
    <div className="relative flex flex-col gap-10 pb-20">
      <StudentAnimatedBackground />

      {/* Greeting */}
      <section>
        <h1 className="font-[Caveat,cursive] text-[clamp(2rem,4vw,3rem)] font-normal text-foreground leading-tight">
          {greeting}, {user ? user.first_name : <span className="inline-block"><Loader2 size={20} className="animate-spin inline" /></span>}
        </h1>
        <p className="font-[Lora,Georgia,serif] italic text-base text-muted-foreground mt-1">
          {user?.email ?? "Loading..."} &middot; Ready to learn something new?
        </p>
        <p className="font-[Lora,Georgia,serif] italic text-sm text-muted mt-2">
          {motivation}
        </p>
        <AccentLine />
      </section>

      {/* Continue learning */}
      <section>
        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.25, ease: ease.gentle }}>
          <SmartLink
            to="/student/materials"
            className="block relative overflow-hidden no-underline bg-surface border border-border rounded-xl"
          >
            <div className="flex items-center gap-6 p-8">
              <div
                className="flex items-center justify-center w-16 h-16 flex-shrink-0 rounded-[10px]"
                style={{ background: CONTINUE_MATERIAL.bg }}
              >
                <CONTINUE_MATERIAL.icon size={30} strokeWidth={1.5} style={{ color: CONTINUE_MATERIAL.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-[Courier_Prime,monospace] text-[0.6rem] tracking-[0.18em] uppercase text-muted mb-1">
                  Continue where you left off
                </p>
                <h2
                  className="font-[Caveat,cursive] text-[1.6rem] font-bold text-foreground truncate"
                  style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                >
                  {CONTINUE_MATERIAL.title}
                </h2>
                <p className="font-[Lora,Georgia,serif] italic text-sm text-muted-foreground mt-0.5">
                  {CONTINUE_MATERIAL.subject} &middot; {CONTINUE_MATERIAL.progress}% complete
                </p>
                <div className="mt-4 h-1.5 max-w-[400px] bg-elevated rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-orange"
                    initial={{ width: 0 }}
                    animate={{ width: `${CONTINUE_MATERIAL.progress}%` }}
                    transition={{ duration: 1, delay: 0.4, ease: ease.gentle }}
                  />
                </div>
              </div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-1 flex-shrink-0 font-[Caveat,cursive] text-[1.05rem] font-bold bg-orange text-[#07080d] px-4 py-2.5 rounded-lg"
              >
                <Play size={15} strokeWidth={2} /> Continue Learning
              </motion.div>
            </div>
          </SmartLink>
        </motion.div>
      </section>

      {/* Two-column grid */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-10">
        {/* LEFT */}
        <div className="flex flex-col gap-10">
          {/* Stats */}
          <section>
            <Eyebrow label="Your progress" />
            <div className="grid grid-cols-3 gap-4">
              {STATS.map((stat) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.25, ease: ease.gentle }}
                    className="bg-surface border border-border rounded-xl overflow-hidden"
                  >
                    <div className="flex flex-col gap-3 p-5 pt-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ background: stat.bg }}
                      >
                        {stat.isStreak ? (
                          <motion.div {...pulseLoop()}>
                            <Icon size={24} strokeWidth={1.5} style={{ color: stat.color }} />
                          </motion.div>
                        ) : (
                          <Icon size={24} strokeWidth={1.5} style={{ color: stat.color }} />
                        )}
                      </div>
                      <p className="font-[Caveat,cursive] text-[2.2rem] font-bold text-foreground leading-none">
                        <AnimatedNumber target={stat.value} suffix={stat.suffix} />
                      </p>
                      <p className="font-[Lora,Georgia,serif] italic text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Study Materials */}
          <section>
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-[Caveat,cursive] text-xl font-bold text-foreground">
                Study Materials
              </h2>
              <SmartLink
                to="/student/materials"
                className="inline-flex items-center gap-1 font-[Courier_Prime,monospace] text-[0.65rem] tracking-widest text-orange no-underline"
              >
                View all <ArrowRight size={12} />
              </SmartLink>
            </div>
            <Eyebrow label="by subject" />
            <div className="grid grid-cols-2 gap-3">
              {SUBJECTS.map((sub, i) => {
                const Icon = sub.icon;
                const pct = Math.round((sub.completed / sub.chapters) * 100);
                return (
                  <motion.div key={sub.name} whileHover={{ y: -4 }} transition={{ duration: 0.25, ease: ease.gentle }}>
                    <SmartLink
                      to="/student/materials"
                      className={`flex items-center gap-4 p-4 bg-surface no-underline rounded-lg border`}
                      style={{ borderColor: sub.border }}
                    >
                      <div
                        className="flex items-center justify-center w-11 h-11 flex-shrink-0 rounded-lg"
                        style={{ background: sub.bg }}
                      >
                        <Icon size={22} strokeWidth={1.5} style={{ color: sub.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-[Caveat,cursive] text-lg font-bold text-foreground">
                          {sub.name}
                        </h3>
                        <p className="font-[Courier_Prime,monospace] text-[0.58rem] text-muted tracking-wide mt-0.5">
                          {sub.completed}/{sub.chapters} chapters
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1 h-0.5 bg-elevated rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ background: sub.color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.8, delay: 0.5 + i * 0.1, ease: ease.gentle }}
                            />
                          </div>
                          <span className="font-[Courier_Prime,monospace] text-[0.55rem] text-muted w-7 text-right">
                            {pct}%
                          </span>
                        </div>
                      </div>
                    </SmartLink>
                  </motion.div>
                );
              })}
            </div>
          </section>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-10" />
      </div>

      {/* AI Tutor CTA */}
      <section>
        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.25, ease: ease.gentle }}>
          <SmartLink
            to="/student/tutor"
            className="block relative overflow-hidden no-underline bg-surface border border-orange-500/30 rounded-xl"
          >
            <div className="flex items-center gap-6 p-8">
              <GradientOrb />
              <div className="flex-1 min-w-0">
                <h2 className="font-[Caveat,cursive] text-xl font-bold text-foreground">
                  Need help? Ask Erudio AI
                </h2>
                <p className="font-[Lora,Georgia,serif] italic text-sm text-muted-foreground mt-1 max-w-[480px]">
                  Get instant explanations, solve doubts, and explore topics in depth with your personal AI tutor.
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-1 flex-shrink-0 bg-orange/10 border border-orange/30 text-orange font-[Caveat,cursive] text-[1.05rem] font-bold px-4 py-2.5 rounded-lg transition-all duration-200"
              >
                <Sparkles size={15} strokeWidth={2} /> Start a conversation
              </motion.div>
            </div>
          </SmartLink>
        </motion.div>
      </section>
    </div>
  );
}
