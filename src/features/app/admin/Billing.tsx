import { motion } from "motion/react";
import {
  CreditCard,
  Users,
  GraduationCap,
  FileText,
  Download,
  CheckCircle2,
  Calendar,
  Zap,
  ArrowRight,
} from "lucide-react";
import {
  fadeUpProps,
  staggerContainer,
  slideIn,
  ease,
  duration,
  staggerDelay,
} from "@/lib/animation";
import AccentLine from "@/components/accent-line";

/* ── Mock data ── */
const PLAN = {
  name: "Professional",
  price: "₹12,999",
  period: "/month",
  renewalDate: "March 28, 2026",
  features: [
    "Up to 50 teachers",
    "Up to 1,000 students",
    "5,000 content generations/month",
    "AI Tutor enabled",
    "Priority support",
  ],
};

const USAGE_METRICS = [
  {
    label: "Teachers",
    used: 24,
    limit: 50,
    icon: Users,
    color: "orange",
  },
  {
    label: "Students",
    used: 486,
    limit: 1000,
    icon: GraduationCap,
    color: "orange",
  },
  {
    label: "Content Generated",
    used: 1847,
    limit: 5000,
    icon: FileText,
    color: "orange",
  },
] as const;

const INVOICES = [
  {
    id: "inv-1",
    date: "Feb 28, 2026",
    amount: "₹12,999",
    status: "paid" as const,
  },
  {
    id: "inv-2",
    date: "Jan 28, 2026",
    amount: "₹12,999",
    status: "paid" as const,
  },
  {
    id: "inv-3",
    date: "Dec 28, 2025",
    amount: "₹12,999",
    status: "paid" as const,
  },
  {
    id: "inv-4",
    date: "Nov 28, 2025",
    amount: "₹12,999",
    status: "paid" as const,
  },
  {
    id: "inv-5",
    date: "Oct 28, 2025",
    amount: "₹9,999",
    status: "paid" as const,
  },
] as const;

/* ── Animation ── */
const fadeIn = (delay: number) => fadeUpProps(12, delay, 0.4, ease.standard);
const invoiceContainerVariants = staggerContainer(staggerDelay.tight, 0.2, true);
const invoiceRowVariants = slideIn(-6, duration.fast, ease.standard);

/* ── Animated Background ── */
function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      {/* orange blob - top right */}
      <motion.div
        className="absolute -top-32 right-[10%] h-[500px] w-[500px] rounded-full opacity-[0.07]"
        style={{
          background: "radial-gradient(circle, #6571f5 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
        animate={{
          x: [0, 25, -20, 0],
          y: [0, -20, 15, 0],
          scale: [1, 1.05, 0.97, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      />
      {/* orange blob - bottom left */}
      <motion.div
        className="absolute bottom-[10%] left-[5%] h-[400px] w-[400px] rounded-full opacity-[0.06]"
        style={{
          background: "radial-gradient(circle, #6571f5 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
        animate={{
          x: [0, -15, 20, 0],
          y: [0, 20, -15, 0],
          scale: [1, 0.96, 1.04, 1],
        }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      />

      {/* Dot grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(101,113,245,0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`billing-particle-${i}`}
          className="absolute rounded-full"
          style={{
            width: i % 3 === 0 ? 3 : 2,
            height: i % 3 === 0 ? 3 : 2,
            left: `${10 + ((i * 14.2) % 78)}%`,
            top: `${30 + ((i * 9.8) % 50)}%`,
            background: i % 2 === 0
              ? "rgba(101,113,245,0.6)"
              : "rgba(101,113,245,0.35)",
          }}
          animate={{
            y: [0, -85 - i * 9],
            x: [0, i % 2 === 0 ? 10 : -10],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: 5 + (i % 4) * 1.5,
            repeat: Infinity,
            delay: i * 0.55,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}


export function BillingPage() {
  return (
    <>
      <AnimatedBackground />
      <div className="relative space-y-8">
        {/* Header */}
        <motion.div {...fadeIn(0)}>
          <motion.h1
            initial={{ opacity: 0, y: -8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.4, ease: ease.standard }}
            className="text-heading-1 text-text-primary"
          >
            Subscription & Billing
          </motion.h1>
          <p className="text-body-md text-text-secondary mt-1">
            Manage your plan, track usage, and view invoices.
          </p>
          <AccentLine />
        </motion.div>

        {/* Current plan card */}
        <motion.div
          {...fadeIn(0.08)}
          whileHover={{ y: -4, boxShadow: "0 8px 30px rgba(101,113,245,0.08)" }}
          className="relative overflow-hidden rounded-lg border border-orange-500/30 bg-bg-surface"
        >
          {/* Glow effect */}
          <motion.div
            className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-orange-500/5 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative flex flex-col gap-6 p-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  className="flex h-10 w-10 items-center justify-center rounded-md bg-orange-500/10"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Zap size={20} className="text-orange-400" strokeWidth={1.5} />
                </motion.div>
                <div>
                  <span className="text-overline text-orange-400">Current Plan</span>
                  <h2 className="text-heading-2 text-text-primary">
                    {PLAN.name}
                  </h2>
                </div>
              </div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-display-md text-text-primary">
                  {PLAN.price}
                </span>
                <span className="text-body-md text-text-muted">{PLAN.period}</span>
              </div>
              <ul className="space-y-2">
                {PLAN.features.map((feature, i) => (
                  <motion.li
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.06, duration: 0.3 }}
                    className="flex items-center gap-2 text-body-sm text-text-secondary"
                  >
                    <CheckCircle2
                      size={14}
                      className="text-success shrink-0"
                      strokeWidth={1.5}
                    />
                    {feature}
                  </motion.li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-start gap-3 sm:items-end">
              <div className="flex items-center gap-2 text-body-sm text-text-muted">
                <Calendar size={14} strokeWidth={1.5} />
                <span>Renews on {PLAN.renewalDate}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 rounded-md border border-orange-500/30 bg-orange-500/10 px-4 py-2.5 text-body-sm font-medium text-orange-400 transition-colors hover:bg-orange-500/20"
              >
                Upgrade Plan
                <ArrowRight size={14} />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Usage metrics */}
        <motion.div {...fadeIn(0.16)}>
          <h2 className="text-heading-3 text-text-primary mb-4">Usage</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {USAGE_METRICS.map((metric) => {
              const Icon = metric.icon;
              const percentage = Math.round((metric.used / metric.limit) * 100);
              return (
                <motion.div
                  key={metric.label}
                  whileHover={{ y: -4, boxShadow: "0 8px 30px rgba(101,113,245,0.08)" }}
                  transition={{ duration: 0.2 }}
                  className="rounded-lg border border-border-subtle bg-bg-surface p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Icon
                        size={16}
                        className="text-text-muted"
                        strokeWidth={1.5}
                      />
                      <span className="text-body-sm text-text-secondary">
                        {metric.label}
                      </span>
                    </div>
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.3 }}
                      className="text-caption text-text-muted"
                    >
                      {percentage}%
                    </motion.span>
                  </div>
                  <div className="flex items-baseline gap-1.5 mb-3">
                    <span className="text-heading-2 text-text-primary">
                      {metric.used.toLocaleString()}
                    </span>
                    <span className="text-body-sm text-text-muted">
                      / {metric.limit.toLocaleString()}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-elevated">
                    <motion.div
                      className={`h-full rounded-full ${
                        percentage > 80 ? "bg-warning" : "bg-orange-500"
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{
                        duration: 0.8,
                        delay: 0.3,
                        ease: ease.standard,
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Invoice history */}
        <motion.div {...fadeIn(0.24)}>
          <h2 className="text-heading-3 text-text-primary mb-4">
            Invoice History
          </h2>
          <motion.div
            whileHover={{ boxShadow: "0 8px 30px rgba(101,113,245,0.04)" }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden rounded-lg border border-border-subtle bg-bg-surface"
          >
            {/* Table header */}
            <div className="grid grid-cols-[1fr_120px_100px_80px] gap-4 border-b border-border-subtle px-5 py-3">
              <span className="text-overline text-text-muted">Date</span>
              <span className="text-overline text-text-muted">Amount</span>
              <span className="text-overline text-text-muted">Status</span>
              <span className="text-overline text-text-muted text-right">
                Invoice
              </span>
            </div>

            {/* Table rows */}
            <motion.div
              variants={invoiceContainerVariants}
              initial="hidden"
              animate="show"
            >
              {INVOICES.map((invoice) => (
                <motion.div
                  key={invoice.id}
                  variants={invoiceRowVariants}
                  className="grid grid-cols-[1fr_120px_100px_80px] items-center gap-4 border-b border-border-subtle px-5 py-3.5 last:border-b-0 transition-colors hover:bg-bg-elevated"
                >
                  <div className="flex items-center gap-2">
                    <CreditCard
                      size={14}
                      className="text-text-muted shrink-0"
                      strokeWidth={1.5}
                    />
                    <span className="text-body-md text-text-primary">
                      {invoice.date}
                    </span>
                  </div>
                  <span className="text-body-sm text-text-primary font-medium">
                    {invoice.amount}
                  </span>
                  <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="inline-flex w-fit items-center rounded-full bg-success-muted px-2.5 py-0.5 text-caption font-medium text-success"
                  >
                    Paid
                  </motion.span>
                  <div className="text-right">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="rounded-sm p-1.5 text-text-muted transition-colors hover:bg-bg-muted hover:text-text-secondary"
                    >
                      <Download size={14} strokeWidth={1.5} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
