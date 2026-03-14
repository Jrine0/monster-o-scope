import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, ChevronLeft, X } from "lucide-react";
import { ease } from "@/lib/animation";

/* ── Mock quiz questions (NCERT Physics: Laws of Motion) ── */
const QUIZ = {
  id: "q-p5",
  chapter: "Laws of Motion",
  subject: "Physics",
  questions: [
    {
      id: 1,
      text: "Newton\u2019s first law of motion is also known as the law of:",
      options: ["Acceleration", "Inertia", "Action-Reaction", "Conservation"],
      correct: 1,
      explanation:
        "Newton\u2019s first law states that a body remains in its state of rest or uniform motion unless acted upon by an external force. This tendency is called inertia.",
    },
    {
      id: 2,
      text: "The SI unit of force is:",
      options: ["Joule", "Pascal", "Newton", "Watt"],
      correct: 2,
      explanation:
        "Force is measured in Newtons (N). 1 N = 1 kg \u00D7 1 m/s\u00B2, derived from Newton\u2019s second law F = ma.",
    },
    {
      id: 3,
      text: "If a body of mass 5 kg is acted upon by a force of 20 N, what is the acceleration produced?",
      options: ["2 m/s\u00B2", "4 m/s\u00B2", "10 m/s\u00B2", "100 m/s\u00B2"],
      correct: 1,
      explanation: "Using F = ma: a = F/m = 20/5 = 4 m/s\u00B2.",
    },
    {
      id: 4,
      text: "Which law of motion explains the recoil of a gun when a bullet is fired?",
      options: [
        "Newton\u2019s first law",
        "Newton\u2019s second law",
        "Newton\u2019s third law",
        "Law of conservation of energy",
      ],
      correct: 2,
      explanation:
        "The gun exerts a forward force on the bullet (action). The bullet exerts an equal and opposite force on the gun (reaction), causing recoil. This is Newton\u2019s third law.",
    },
    {
      id: 5,
      text: "Momentum is defined as the product of:",
      options: [
        "Mass and acceleration",
        "Force and velocity",
        "Mass and velocity",
        "Force and time",
      ],
      correct: 2,
      explanation: "Momentum (p) = mass (m) \u00D7 velocity (v). It is a vector quantity.",
    },
    {
      id: 6,
      text: "A ball of mass 0.5 kg moving at 10 m/s has a momentum of:",
      options: ["0.5 kg\u00B7m/s", "5 kg\u00B7m/s", "10 kg\u00B7m/s", "50 kg\u00B7m/s"],
      correct: 1,
      explanation: "p = mv = 0.5 \u00D7 10 = 5 kg\u00B7m/s.",
    },
    {
      id: 7,
      text: "The rate of change of momentum of a body is proportional to the:",
      options: [
        "Velocity of the body",
        "Acceleration of the body",
        "Applied force",
        "Mass of the body",
      ],
      correct: 2,
      explanation:
        "Newton\u2019s second law: the rate of change of momentum (dp/dt) is directly proportional to the applied force and takes place in the direction of the force.",
    },
    {
      id: 8,
      text: "Action and reaction forces act on:",
      options: [
        "The same body",
        "Different bodies",
        "The same body in the same direction",
        "Either the same or different bodies",
      ],
      correct: 1,
      explanation:
        "Action and reaction always act on two different bodies. This is why they don\u2019t cancel each other out.",
    },
    {
      id: 9,
      text: "The total momentum of two objects before and after collision remains the same. This is the law of:",
      options: [
        "Conservation of energy",
        "Conservation of momentum",
        "Newton\u2019s first law",
        "Newton\u2019s second law",
      ],
      correct: 1,
      explanation:
        "The law of conservation of momentum states that the total momentum of an isolated system remains constant if no external force acts on it.",
    },
    {
      id: 10,
      text: "A 1000 kg car is moving at 20 m/s. The brakes apply a force of 5000 N. How long does it take to stop?",
      options: ["2 s", "4 s", "5 s", "10 s"],
      correct: 1,
      explanation:
        "Deceleration a = F/m = 5000/1000 = 5 m/s\u00B2. Time to stop: v = u \u2212 at, so t = u/a = 20/5 = 4 s.",
    },
  ],
};

/* ── Option labels ── */
const OPTION_LABELS = ["A", "B", "C", "D"];

/* ── Floating particles for warm light theme ── */
const PARTICLES = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  left: `${12 + i * 14}%`,
  delay: i * 0.9,
  duration: 7 + (i % 3) * 2,
  size: 2,
}));

export function PracticeQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [direction, setDirection] = useState<1 | -1>(1);

  const total = QUIZ.questions.length;
  const question = QUIZ.questions[currentQuestion];
  const selectedOption = selectedOptions[currentQuestion];
  const progress = ((currentQuestion + 1) / total) * 100;
  const answeredCount = Object.keys(selectedOptions).length;

  const selectOption = useCallback(
    (optionIndex: number) => {
      setSelectedOptions((prev) => ({ ...prev, [currentQuestion]: optionIndex }));
    },
    [currentQuestion],
  );

  const goNext = useCallback(() => {
    if (currentQuestion < total - 1) {
      setDirection(1);
      setCurrentQuestion((prev) => prev + 1);
    }
  }, [currentQuestion, total]);

  const goPrev = useCallback(() => {
    if (currentQuestion > 0) {
      setDirection(-1);
      setCurrentQuestion((prev) => prev - 1);
    }
  }, [currentQuestion]);

  const goToQuestion = useCallback(
    (index: number) => {
      setDirection(index > currentQuestion ? 1 : -1);
      setCurrentQuestion(index);
    },
    [currentQuestion],
  );

  const isLastQuestion = currentQuestion === total - 1;
  const allAnswered = answeredCount === total;

  return (
    <div className="relative min-h-[calc(100dvh-76px)] flex flex-col">
      {/* ── Animated background blob (warm light theme) ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full opacity-[0.05]"
          style={{
            background: "radial-gradient(circle, #f2740d 0%, #fb923c 40%, transparent 70%)",
            filter: "blur(100px)",
          }}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.05, 0.06, 0.05],
          }}
          transition={{
            duration: 8,
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

      {/* ── Top bar ── */}
      <motion.div
        initial={{ opacity: 0, y: -8, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.4, ease: ease.gentle }}
        className="relative flex items-center justify-between mb-2"
      >
        <div>
          <p className="text-overline text-orange-500">{QUIZ.subject}</p>
          <h1 className="text-heading-2 text-text-primary">{QUIZ.chapter}</h1>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            to="/student/quizzes"
            className="flex items-center gap-1 rounded-lg border border-border-subtle px-3 py-1.5 text-body-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <X size={16} strokeWidth={1.5} />
            Exit Quiz
          </Link>
        </motion.div>
      </motion.div>

      {/* ── Progress bar with spring animation ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="relative mb-8"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-body-sm text-text-secondary">
            Question {currentQuestion + 1} of {total}
          </span>
          <span className="text-body-sm text-text-muted">
            {answeredCount} answered
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-elevated">
          <motion.div
            className="h-full rounded-full bg-orange-500"
            animate={{ width: `${progress}%` }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              mass: 0.8,
            }}
          />
        </div>
        {/* Animated accent glow on progress */}
        <motion.div
          className="absolute bottom-0 h-1.5 rounded-full"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(242,116,13,0.3), transparent)",
            filter: "blur(4px)",
          }}
          animate={{ width: `${progress}%` }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            mass: 0.8,
          }}
        />
      </motion.div>

      {/* ── Question area ── */}
      <div className="relative flex-1 flex flex-col items-center max-w-[720px] mx-auto w-full">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentQuestion}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40, filter: "blur(4px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: direction * -40, filter: "blur(4px)" }}
            transition={{ duration: 0.3, ease: ease.gentle }}
            className="w-full"
          >
            {/* Question text */}
            <h2 className="text-display-sm text-text-primary mb-8 text-center leading-snug">
              {question.text}
            </h2>

            {/* Options grid with stagger and hover effects */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {question.options.map((option, i) => {
                const isSelected = selectedOption === i;
                return (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.35, ease: ease.gentle }}
                    onClick={() => selectOption(i)}
                    whileHover={{ y: -3, boxShadow: isSelected ? "0 4px 20px rgba(242,116,13,0.12)" : "0 4px 16px rgba(0,0,0,0.04)" }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative flex items-start gap-3 rounded-xl border-2 p-5 text-left transition-all duration-200 overflow-hidden ${
                      isSelected
                        ? "border-orange-500 shadow-glow-orange"
                        : "border-border-subtle hover:border-border-default"
                    }`}
                    style={{
                      backgroundColor: isSelected
                        ? "rgba(242,116,13,0.08)"
                        : "var(--color-portal-student-surface)",
                    }}
                  >
                    {/* Warm glow on selected */}
                    {isSelected && (
                      <motion.div
                        className="pointer-events-none absolute inset-0 rounded-xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                          background: "radial-gradient(ellipse at 50% 50%, rgba(242,116,13,0.06) 0%, transparent 70%)",
                        }}
                      />
                    )}
                    {/* Option label */}
                    <span
                      className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-body-sm font-semibold transition-colors ${
                        isSelected
                          ? "bg-orange-500 text-text-inverse"
                          : "bg-bg-elevated text-text-secondary"
                      }`}
                    >
                      {OPTION_LABELS[i]}
                    </span>
                    <span
                      className={`relative z-10 text-body-lg pt-0.5 transition-colors ${
                        isSelected ? "text-text-primary" : "text-text-secondary"
                      }`}
                    >
                      {option}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── Navigation buttons with micro-interactions ── */}
        <div className="flex items-center justify-between w-full mt-10 gap-4">
          <motion.button
            onClick={goPrev}
            disabled={currentQuestion === 0}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 rounded-xl border border-border-subtle px-5 py-3 text-body-md font-medium text-text-secondary transition-all duration-200 hover:border-border-default hover:text-text-primary disabled:opacity-30 disabled:pointer-events-none"
            style={{ backgroundColor: "var(--color-portal-student-surface)" }}
          >
            <ChevronLeft size={18} strokeWidth={1.5} />
            Previous
          </motion.button>

          {isLastQuestion && allAnswered ? (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/student/quizzes"
                className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-body-md font-semibold text-text-inverse transition-all duration-200 hover:bg-orange-400 hover:shadow-glow-orange"
              >
                Submit Quiz
                <ChevronRight size={18} strokeWidth={1.5} />
              </Link>
            </motion.div>
          ) : (
            <motion.button
              onClick={goNext}
              disabled={selectedOption === undefined || isLastQuestion}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-body-md font-semibold text-text-inverse transition-all duration-200 hover:bg-orange-400 hover:shadow-glow-orange disabled:opacity-40 disabled:pointer-events-none"
            >
              Next
              <ChevronRight size={18} strokeWidth={1.5} />
            </motion.button>
          )}
        </div>

        {/* ── Question dots with animation ── */}
        <div className="flex items-center justify-center gap-2 mt-8 mb-6 flex-wrap">
          {QUIZ.questions.map((_, i) => {
            const isActive = i === currentQuestion;
            const isAnswered = selectedOptions[i] !== undefined;
            return (
              <motion.button
                key={i}
                onClick={() => goToQuestion(i)}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                animate={isActive ? { scale: [1.25, 1.35, 1.25] } : {}}
                transition={isActive ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" } : { duration: 0.15 }}
                className={`h-3 w-3 rounded-full transition-all duration-200 ${
                  isActive
                    ? "bg-orange-500 scale-125 shadow-glow-orange"
                    : isAnswered
                      ? "bg-orange-500/50 hover:bg-orange-500/70"
                      : "bg-bg-elevated hover:bg-bg-muted"
                }`}
                aria-label={`Go to question ${i + 1}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
