import { motion } from "motion/react";
import { useState } from "react";
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Check,
} from "lucide-react";
import {
  fadeUpProps,
  staggerItemProps,
  ease,
  duration,
} from "@/lib/animation";

/* ── Types ── */
type NotificationType = "generation" | "system" | "welcome";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

/* ── Mock data ── */
const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "generation",
    title: "Content generation complete",
    message: "Your lesson plan for \"Atoms and Molecules\" (Class 9 Chemistry) is ready to review.",
    timestamp: "2 minutes ago",
    read: false,
  },
  {
    id: "n2",
    type: "generation",
    title: "Practice questions ready",
    message: "15 practice questions for \"Laws of Motion\" (Class 11 Physics) have been generated.",
    timestamp: "1 hour ago",
    read: false,
  },
  {
    id: "n3",
    type: "system",
    title: "System maintenance scheduled",
    message: "Erudio will undergo scheduled maintenance on Sunday, 8 March 2026 from 2:00 AM to 4:00 AM IST.",
    timestamp: "3 hours ago",
    read: false,
  },
  {
    id: "n4",
    type: "welcome",
    title: "Welcome to Erudio!",
    message: "Your teacher account has been set up by the school admin. Start by exploring the Content Library or generating your first lesson plan.",
    timestamp: "1 day ago",
    read: true,
  },
  {
    id: "n5",
    type: "generation",
    title: "Summary notes generated",
    message: "Summary notes for \"Polynomials\" (Class 10 Mathematics) are ready for download.",
    timestamp: "2 days ago",
    read: true,
  },
  {
    id: "n6",
    type: "system",
    title: "New feature: Hindi language support",
    message: "You can now generate content in Hindi. Select the language option when generating content.",
    timestamp: "3 days ago",
    read: true,
  },
  {
    id: "n7",
    type: "generation",
    title: "Handout ready",
    message: "Your handout for \"Photosynthesis in Higher Plants\" (Class 11 Biology) has been generated successfully.",
    timestamp: "5 days ago",
    read: true,
  },
];

const TYPE_CONFIG: Record<NotificationType, { icon: typeof CheckCircle2; color: string; bg: string; border: string }> = {
  generation: {
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
  },
  system: {
    icon: AlertCircle,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
  },
  welcome: {
    icon: Sparkles,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
  },
};

/* ── Floating particles ── */
const PARTICLES = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  left: `${10 + i * 15}%`,
  delay: i * 0.8,
  duration: 7 + Math.random() * 3,
  size: 2 + Math.random() * 1,
}));

export function TeacherNotifications() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function toggleRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  }

  return (
    <div className="relative space-y-6 max-w-2xl">
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
            scale: [1, 1.12, 1],
            x: [0, 25, 0],
            y: [0, -18, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 h-[380px] w-[380px] rounded-full opacity-[0.03]"
          style={{
            background: "radial-gradient(circle, #f27410 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -15, 0],
            y: [0, 15, 0],
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
              opacity: [0, 0.5, 0.35, 0],
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
        className="flex items-center justify-between"
      >
        <div>
          {/* Animated accent line */}
          <motion.div
            className="mb-3 h-px bg-gradient-to-r from-orange-500/60 via-orange-400/20 to-transparent"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "8rem", opacity: 1 }}
            transition={{ duration: duration.slow, delay: 0.2, ease: ease.gentle }}
          />
          <div className="flex items-center gap-3">
            {/* Breathing bell icon */}
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Bell size={22} strokeWidth={1.5} className="text-orange-400" />
            </motion.div>
            <h1 className="text-display-md text-text-primary">Notifications</h1>
          </div>
          {unreadCount > 0 && (
            <p className="mt-1 text-body-md text-text-secondary">
              {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <motion.button
            onClick={markAllRead}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-border-subtle px-4 py-2 text-body-sm font-medium text-text-secondary transition-colors hover:text-text-primary hover:bg-bg-elevated"
          >
            <Check size={16} strokeWidth={1.5} />
            Mark all as read
          </motion.button>
        )}
      </motion.div>

      {/* Notification list */}
      <div className="space-y-2">
        {notifications.map((notification, i) => {
          const config = TYPE_CONFIG[notification.type];
          const Icon = config.icon;

          return (
            <motion.button
              key={notification.id}
              {...staggerItemProps(0.08 + i * 0.04, 12, 0.4)}
              whileHover={{ y: -2, boxShadow: "0 4px 20px rgba(242,116,16,0.04)" }}
              onClick={() => toggleRead(notification.id)}
              className={`group flex w-full items-start gap-4 rounded-[var(--radius-md)] border p-4 text-left transition-all duration-200 ${
                notification.read
                  ? "border-border-subtle bg-bg-surface hover:border-border-strong"
                  : `border-l-2 ${config.border} border-t border-r border-b border-t-border-subtle border-r-border-subtle border-b-border-subtle bg-bg-elevated hover:bg-bg-muted`
              }`}
            >
              {/* Icon */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2, ease: ease.gentle }}
                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] ${config.bg}`}
              >
                <Icon size={18} strokeWidth={1.5} className={config.color} />
              </motion.div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className={`text-body-md transition-colors ${
                    notification.read
                      ? "text-text-secondary font-medium"
                      : "text-text-primary font-semibold"
                  }`}>
                    {notification.title}
                  </h3>
                  {!notification.read && (
                    <motion.span
                      animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="mt-1.5 flex h-2 w-2 shrink-0 rounded-full bg-orange-500"
                    />
                  )}
                </div>
                <p className="mt-0.5 text-body-sm text-text-muted line-clamp-2">
                  {notification.message}
                </p>
                <p className="mt-1.5 text-caption text-text-muted">
                  {notification.timestamp}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Empty state */}
      {notifications.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Bell size={40} strokeWidth={1} className="text-text-muted mb-3" />
          </motion.div>
          <p className="text-heading-3 text-text-secondary">No notifications</p>
          <p className="mt-1 text-body-sm text-text-muted">You&apos;re all caught up!</p>
        </motion.div>
      )}
    </div>
  );
}
