import { motion } from "motion/react";
import React from "react";

export default function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full">
      {/* Corner accent blob — top-right of card */}
      <motion.div
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(242,116,13,0.12), transparent 70%)",
          filter: "blur(20px)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="relative rounded-2xl border border-border/30 bg-card/80 p-8 sm:p-10 backdrop-blur-xl"
        animate={{
          boxShadow: [
            "0 0 60px rgba(0,0,0,0.4), 0 0 80px rgba(242,116,13,0.03)",
            "0 0 60px rgba(0,0,0,0.4), 0 0 100px rgba(242,116,13,0.07)",
            "0 0 60px rgba(0,0,0,0.4), 0 0 80px rgba(242,116,13,0.03)",
          ],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        {children}
      </motion.div>

      {/* Glow under card — purely orange instead of orange-to-indigo */}
      <motion.div
        className="absolute -bottom-6 left-1/2 -z-10 h-24 w-[80%] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "linear-gradient(90deg, var(--color-orange-600), var(--color-orange-400))",
        }}
        animate={{
          opacity: [0.15, 0.25, 0.15],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
