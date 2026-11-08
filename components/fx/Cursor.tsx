"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useMediaQuery } from "@/lib/useMediaQuery";

type CursorState = {
  hover: boolean;
  label: string | null;
  down: boolean;
  hidden: boolean;
};

export default function Cursor() {
  const fine = useMediaQuery("(pointer: fine)");
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const enabled = fine && !reduce;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 420, damping: 36, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 420, damping: 36, mass: 0.6 });

  const [state, setState] = useState<CursorState>({
    hover: false,
    label: null,
    down: false,
    hidden: true,
  });

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      setState((s) => (s.hidden ? { ...s, hidden: false } : s));
    };
    const over = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.(
        "[data-cursor], a, button"
      );
      const label = el?.getAttribute("data-cursor") ?? null;
      setState((s) =>
        s.hover === !!el && s.label === label
          ? s
          : { ...s, hover: !!el, label }
      );
    };
    const down = () => setState((s) => ({ ...s, down: true }));
    const up = () => setState((s) => ({ ...s, down: false }));
    const leave = () => setState((s) => ({ ...s, hidden: true }));

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const size = state.label ? 104 : state.hover ? 64 : 34;

  return (
    <>
      {/* Point — suit la souris au pixel près */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[120] mix-blend-difference"
        style={{ x, y }}
      >
        <motion.div
          className="h-2 w-2 rounded-full bg-white"
          style={{ x: "-50%", y: "-50%" }}
          animate={{
            scale: state.label ? 0 : state.down ? 0.6 : 1,
            opacity: state.hidden ? 0 : 1,
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>

      {/* Anneau — inertie, grossit sur les éléments interactifs */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[119]"
        style={{ x: rx, y: ry }}
      >
        <motion.div
          className="flex items-center justify-center rounded-full border"
          style={{ x: "-50%", y: "-50%" }}
          animate={{
            width: size,
            height: size,
            backgroundColor: state.label
              ? "rgba(58,108,255,1)"
              : state.hover
                ? "rgba(32,51,108,0.14)"
                : "rgba(32,51,108,0)",
            borderColor: state.label
              ? "rgba(58,108,255,1)"
              : state.hover
                ? "rgba(32,51,108,0.75)"
                : "rgba(243,238,230,0.35)",
            scale: state.down ? 0.85 : 1,
            opacity: state.hidden ? 0 : 1,
          }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
        >
          <AnimatePresence>
            {state.label && (
              <motion.span
                key={state.label}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.2 }}
                className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-white"
              >
                {state.label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>
  );
}
