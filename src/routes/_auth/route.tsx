import AuthCard from "@/features/auth/AuthCard";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { motion } from "motion/react";

export const Route = createFileRoute("/_auth")({
  component: AuthLayout,
});

const PARTICLES = [...Array(14)].map((_, i) => ({
  id: i,
  size: i % 4 === 0 ? 5 : 3,
  left: `${6 + ((i * 7.3) % 88)}%`,
  top: `${25 + ((i * 8.1) % 55)}%`,
  color:
    i % 3 === 0
      ? "var(--color-orange-500)"
      : i % 3 === 1
        ? "var(--color-orange-400)"
        : "var(--color-text-muted)",
  yTravel: -100 - i * 6,
  xDrift: i % 2 === 0 ? 15 : -15,
  xReturn: i % 2 === 0 ? -8 : 8,
  duration: 6 + (i % 4) * 1.5,
  delay: i * 0.4,
}));

function AuthLayout() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 bg-deepest overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        {/* Primary orange blob — top right */}
        <motion.div
          className="absolute -top-[10%] right-[0%] h-150 w-150 rounded-full"
          style={{
            background:
              "radial-gradient(circle, var(--color-orange-500) 0%, transparent 60%)",
            filter: "blur(80px)", // Reduced blur for a more solid core
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -25, 15, 0],
            scale: [1, 1.1, 0.95, 1],
            opacity: [0.25, 0.45, 0.25],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />

        {/* Secondary orange blob — bottom left */}
        <motion.div
          className="absolute -bottom-[10%] left-[0%] h-125 w-125 rounded-full"
          style={{
            background:
              "radial-gradient(circle, var(--color-orange-600) 0%, transparent 60%)",
            filter: "blur(80px)",
          }}
          animate={{
            x: [0, -25, 20, 0],
            y: [0, 20, -15, 0],
            scale: [1, 0.9, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />

        {/* Center orange pulse */}
        <motion.div
          className="absolute top-[35%] left-1/2 h-150 w-150 -translate-x-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, var(--color-orange-400) 0%, transparent 60%)",
            filter: "blur(100px)",
          }}
          animate={{
            scale: [0.9, 1.25, 0.9],
            opacity: [0.15, 0.35, 0.15], // Was 0.03, now highly visible
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* ── Floating particles ── */}
        {PARTICLES.map((p) => (
          <motion.div
            key={`auth-particle-${p.id}`}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              left: p.left,
              top: p.top,
              background: p.color,
            }}
            animate={{
              y: [0, p.yTravel],
              x: [0, p.xDrift, p.xReturn],
              opacity: [0, 0.85, 0], // Increased max particle opacity
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

      <div className="z-10 w-full max-w-115">
        {/* Logo Placement */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold tracking-tight text-foreground">
            Vyasa
          </h1>
        </div>

        <AuthCard>
          <Outlet />
        </AuthCard>
      </div>

      <p className="z-10 mt-8 text-sm text-muted-foreground font-medium">
        &copy; {new Date().getFullYear()} Vyasa Platform
      </p>
    </div>
  );
}
