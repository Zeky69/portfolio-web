import type { Variants } from "framer-motion";

// ─── Ease curves ────────────────────────────────────────────────────────────
export const easeExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const easeInOut: [number, number, number, number] = [0.4, 0, 0.2, 1];

// ─── Basic variants ─────────────────────────────────────────────────────────
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: easeExpo },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: easeExpo },
  },
};

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -50, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: easeExpo },
  },
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: 50, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: easeExpo },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: easeExpo },
  },
};

// ─── Stagger container ───────────────────────────────────────────────────────
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

// ─── Character animation ────────────────────────────────────────────────────
export const charReveal: Variants = {
  hidden: { opacity: 0, y: 60, rotateX: -80 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.55,
      delay: i * 0.04,
      ease: easeExpo,
    },
  }),
};

// ─── Clip-path reveal ───────────────────────────────────────────────────────
export const clipReveal: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0)" },
  visible: {
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: 0.8, ease: easeExpo },
  },
};

// ─── Timeline line draw ─────────────────────────────────────────────────────
export const drawLine: Variants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: 1.2, ease: easeInOut },
  },
};
