/**
 * Shared animation primitives for the Erudio frontend.
 *
 * All Motion variant definitions, easing curves, duration tiers, and
 * stagger presets live here. Import from `@/lib/animation` — never
 * define animation variants inline in page components.
 *
 * The three easing curves mirror the CSS custom properties in
 * src/styles/index.css (--ease-gentle, --ease-spring, --ease-default).
 */
import type { Variants, Transition } from "motion/react";

// Motion's Easing type expects a mutable tuple, not readonly.
export type Easing = [number, number, number, number];

// ─── Easing Curves ───────────────────────────────────────────────────
// Match the CSS tokens: --ease-gentle, --ease-spring, --ease-default
export const ease = {
  /** Smooth deceleration with subtle overshoot — primary UI ease */
  gentle: [0.16, 1, 0.3, 1] as Easing,
  /** Pronounced elastic overshoot — charts, playful micro-interactions */
  spring: [0.34, 1.56, 0.64, 1] as Easing,
  /** Standard material-style ease — admin portal, restrained motion */
  standard: [0.25, 0.1, 0.25, 1] as Easing,
  /** Snappy ease-in-out — form field transitions, quick toggles */
  quick: [0.4, 0, 0.2, 1] as Easing,
};

// ─── Duration Tiers (seconds) ────────────────────────────────────────
export const duration = {
  /** Micro-interactions: tooltips, toggles, accordion */
  instant: 0.2,
  /** Table rows, quick reveals */
  fast: 0.3,
  /** Standard element animation — cards, sections, headers */
  normal: 0.5,
  /** Prominent reveals — page heroes, card grids */
  slow: 0.65,
  /** Dramatic entrances — landing page hero, full-screen reveals */
  dramatic: 0.8,
} as const;

// ─── Stagger Presets (seconds) ───────────────────────────────────────
export const staggerDelay = {
  /** Table rows — dense lists, fast succession */
  tight: 0.04,
  /** Default stagger — cards, grid items */
  normal: 0.08,
  /** Feature sections, pricing cards — more breathing room */
  relaxed: 0.12,
  /** Step-by-step sequences, testimonials */
  dramatic: 0.2,
} as const;

// ─── Reusable Transitions ────────────────────────────────────────────

/** Standard gentle transition — use for most UI animations */
export const gentleTransition: Transition = {
  duration: duration.normal,
  ease: ease.gentle,
};

/** Admin portal transition — slightly more restrained */
export const standardTransition: Transition = {
  duration: 0.4,
  ease: ease.standard,
};

/** Fast field-level transition — form inputs, toggles */
export const quickTransition: Transition = {
  duration: 0.22,
  ease: ease.quick,
};

// ─── Variant Factories ───────────────────────────────────────────────
// Functions that return Variants objects with configurable parameters.
// These cover the 90% case; one-off animations can still be defined inline.

/**
 * Stagger container — wraps children that use fadeUp/fadeIn/slideIn.
 *
 * @param stagger   - delay between each child (default: 0.08)
 * @param delay     - initial delay before first child (default: 0)
 * @param fadeParent - whether the parent itself fades in (default: false)
 */
export function staggerContainer(
  stagger: number = staggerDelay.normal,
  delay: number = 0,
  fadeParent = false,
): Variants {
  return {
    hidden: fadeParent ? { opacity: 0 } : {},
    show: {
      ...(fadeParent ? { opacity: 1 } : {}),
      transition: {
        ...(delay > 0 ? { delayChildren: delay } : {}),
        staggerChildren: stagger,
      },
    },
  };
}

/**
 * Fade-up — element rises from below while fading in.
 *
 * @param distance - Y offset in px (default: 20)
 * @param dur      - animation duration (default: duration.normal)
 * @param easing   - easing curve (default: ease.gentle)
 */
export function fadeUp(
  distance: number = 20,
  dur: number = duration.normal,
  easing: Easing = ease.gentle,
): Variants {
  return {
    hidden: { opacity: 0, y: distance },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: dur, ease: easing },
    },
  };
}

/**
 * Fade-in — pure opacity transition, no movement.
 *
 * @param dur   - animation duration (default: duration.normal)
 * @param easing - easing curve (default: ease.gentle)
 */
export function fadeIn(
  dur: number = duration.normal,
  easing: Easing = ease.gentle,
): Variants {
  return {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { duration: dur, ease: easing },
    },
  };
}

/**
 * Card reveal — rises with subtle scale for elevated elements.
 *
 * @param distance - Y offset in px (default: 32)
 * @param dur      - animation duration (default: duration.slow)
 * @param easing   - easing curve (default: ease.gentle)
 */
export function cardReveal(
  distance: number = 32,
  dur: number = duration.slow,
  easing: Easing = ease.gentle,
): Variants {
  return {
    hidden: { opacity: 0, y: distance, scale: 0.97 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: dur, ease: easing },
    },
  };
}

/**
 * Scale-in — grows from a smaller size while fading in.
 *
 * @param from  - initial scale (default: 0.92)
 * @param dur   - animation duration (default: duration.slow)
 * @param easing - easing curve (default: ease.gentle)
 */
export function scaleIn(
  from: number = 0.92,
  dur: number = duration.slow,
  easing: Easing = ease.gentle,
): Variants {
  return {
    hidden: { opacity: 0, scale: from },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: dur, ease: easing },
    },
  };
}

/**
 * Slide-in — horizontal slide (tables, list rows).
 *
 * @param distance - X offset in px (default: -12, negative = from left)
 * @param dur      - animation duration (default: duration.fast)
 * @param easing   - easing curve (default: ease.gentle)
 */
export function slideIn(
  distance: number = -12,
  dur: number = duration.fast,
  easing: Easing = ease.gentle,
): Variants {
  return {
    hidden: { opacity: 0, x: distance },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: dur, ease: easing },
    },
  };
}

/**
 * Bar grow — vertical scale for chart bars. Accepts custom delay.
 *
 * @param dur   - animation duration (default: 0.6)
 * @param easing - easing curve (default: ease.spring for bounce)
 */
export function barGrow(
  dur: number = 0.6,
  easing: Easing = ease.spring,
): Variants {
  return {
    hidden: { scaleY: 0 },
    show: (delay: number) => ({
      scaleY: 1,
      transition: { duration: dur, ease: easing, delay },
    }),
  };
}

// ─── Inline Prop Helpers ─────────────────────────────────────────────
// For components that use initial/animate/transition props directly
// instead of variants (e.g. single elements not in a stagger group).

/**
 * Spread onto a motion component for a simple fade-up entrance.
 *
 * Usage: `<motion.div {...fadeUpProps()} />`
 *
 * @param distance - Y offset in px (default: 12)
 * @param delay    - delay before animation starts (default: 0)
 * @param dur      - animation duration (default: duration.normal)
 * @param easing   - easing curve (default: ease.gentle)
 */
export function fadeUpProps(
  distance: number = 12,
  delay: number = 0,
  dur: number = duration.normal,
  easing: Easing = ease.gentle,
) {
  return {
    initial: { opacity: 0, y: distance },
    animate: { opacity: 1, y: 0 },
    transition: { duration: dur, delay, ease: easing },
  };
}

/**
 * Spread onto a motion component for a staggered list item.
 *
 * Usage: `<motion.div {...staggerItemProps(0.12 + i * 0.05)} />`
 *
 * @param delay    - computed delay for this item's position
 * @param distance - Y offset in px (default: 20)
 * @param dur      - animation duration (default: 0.45)
 * @param easing   - easing curve (default: ease.gentle)
 */
export function staggerItemProps(
  delay: number,
  distance: number = 20,
  dur: number = 0.45,
  easing: Easing = ease.gentle,
) {
  return {
    initial: { opacity: 0, y: distance },
    animate: { opacity: 1, y: 0 },
    transition: { duration: dur, delay, ease: easing },
  };
}

/**
 * Micro-interaction presets for whileHover/whileTap.
 *
 * Usage: `<motion.button {...tap} />`
 */
export const tap = {
  whileHover: { scale: 1.01 },
  whileTap: { scale: 0.98 },
} as const;

export const tapSubtle = {
  whileHover: { scale: 1.005 },
  whileTap: { scale: 0.995 },
} as const;

/**
 * Infinite pulse — for loading indicators, emphasis, streaks.
 *
 * @param intensity - max scale (default: 1.15)
 * @param dur       - cycle duration (default: 1.6)
 */
export function pulseLoop(intensity = 1.15, dur = 1.6) {
  return {
    animate: { scale: [1, intensity, 1] },
    transition: { duration: dur, repeat: Infinity, ease: "easeInOut" as const },
  };
}

/**
 * Breathing glow — for AI/ambient elements.
 *
 * @param dur - cycle duration (default: 3)
 */
export function breatheLoop(dur = 3) {
  return {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.8, 1, 0.8],
    },
    transition: {
      duration: dur,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  };
}
