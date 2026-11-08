"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

const WORDS = ["Pastille", "42 Rank", "WallChange", "RAG", "TheRightOne", "Call Me Maybe"];

/** Bande couleur braise, texturée, qui défile plus vite quand on scrolle. */
export default function Band() {
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 300 });
  const factor = useTransform(smooth, [-2000, 0, 2000], [-4, 1, 4], { clamp: false });
  const dir = useRef(1);

  useAnimationFrame((_, delta) => {
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    let v = base.get() - dir.current * 2.2 * (delta / 1000) * (1 + Math.abs(f));
    if (v < -50) v += 50;
    if (v > 0) v -= 50;
    base.set(v);
  });
  const x = useTransform(base, (v) => `${v}%`);

  const row = (
    <span className="flex shrink-0 items-center">
      {WORDS.map((w) => (
        <span key={w} className="flex items-center">
          <span className="px-6 sm:px-10">{w}</span>
          <svg viewBox="0 0 24 24" className="h-[0.5em] w-[0.5em] shrink-0" aria-hidden>
            <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" fill="currentColor" />
          </svg>
        </span>
      ))}
    </span>
  );

  return (
    <div data-stage="scatter" data-dim="0.25" className="relative z-10 -my-6 overflow-hidden py-14">
      <div className="textured -rotate-2 scale-[1.04] overflow-hidden bg-accent py-5 text-bg shadow-[0_30px_80px_-30px_rgba(116,227,201,0.45)] sm:py-7">
        <motion.div
          style={{ x }}
          className="flex w-max whitespace-nowrap text-[clamp(2.4rem,7vw,6.5rem)] font-extrabold leading-none tracking-[-0.045em]"
        >
          {row}
          {row}
        </motion.div>
      </div>
    </div>
  );
}
