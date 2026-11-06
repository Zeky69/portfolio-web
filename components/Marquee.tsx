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

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

function Row({
  items,
  baseVelocity,
}: {
  items: string[];
  baseVelocity: number;
}) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 4], { clamp: false });
  const skew = useTransform(smooth, [-2500, 0, 2500], [7, 0, -7]);
  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`);
  const dir = useRef(1);

  useAnimationFrame((_, delta) => {
    let move = dir.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    move += dir.current * move * f;
    baseX.set(baseX.get() + move);
  });

  return (
    <div className="flex overflow-hidden whitespace-nowrap">
      <motion.div className="flex shrink-0 gap-0" style={{ x, skewX: skew }}>
        {Array.from({ length: 4 }).map((_, copy) => (
          <span key={copy} className="flex shrink-0 items-center" aria-hidden={copy > 0}>
            {items.map((item, i) => (
              <span key={item} className="flex items-center">
                <span
                  className={`px-6 text-[clamp(2.6rem,7.5vw,6.5rem)] font-semibold leading-[1.05] tracking-[-0.045em] ${
                    i % 2 ? "text-outline" : "text-text"
                  }`}
                >
                  {item}
                </span>
                <svg width="22" height="22" viewBox="0 0 24 24" className="shrink-0 text-accent" aria-hidden>
                  <path
                    d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function Marquee() {
  return (
    <section
      aria-label="Technologies"
      className="relative overflow-hidden border-y border-border py-10 sm:py-14"
    >
      <Row
        items={["Python", "TypeScript", "PyTorch", "LangChain", "FastAPI", "React", "Vue.js", "PostgreSQL"]}
        baseVelocity={-2.2}
      />
      <Row
        items={["C", "Java", "TensorFlow", "Ollama", "Docker", "Socket.IO", "React Native", "Redis"]}
        baseVelocity={2.2}
      />
    </section>
  );
}
