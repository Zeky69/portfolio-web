"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { introAlreadyDone, setIntroDone } from "@/lib/intro";
import { getLenis } from "@/lib/lenis";
import { easeCurtain, easeExpo } from "@/lib/animations";

const WORDS = ["Développeur", "Fullstack", "& IA"];

export default function Preloader() {
  const [visible, setVisible] = useState(() => !introAlreadyDone());
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const root = document.documentElement;
    root.classList.add("is-loading");
    if (!window.location.hash) window.scrollTo(0, 0);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduce ? 250 : 1700;
    const start = performance.now();
    let raf = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      // Accélère, ralentit, puis "accroche" à 100
      const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      setCount(Math.round(eased * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        timeout = setTimeout(() => {
          setVisible(false);
          setIntroDone();
        }, reduce ? 0 : 220);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
    };
  }, [visible]);

  const release = () => {
    document.documentElement.classList.remove("is-loading");
    getLenis()?.start();
  };

  const word = WORDS[Math.min(WORDS.length - 1, Math.floor(count / 34))];

  return (
    <AnimatePresence onExitComplete={release}>
      {visible && (
        <motion.div
          key="preloader"
          className="preloader fixed inset-0 z-[110] flex flex-col justify-between bg-bg px-5 py-6 sm:px-8 lg:px-12"
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 1, ease: easeCurtain }}
          aria-live="polite"
          aria-label="Chargement du portfolio"
        >
          <div className="flex items-center justify-between font-mono text-xs text-muted">
            <span>Zekeriya Akburak</span>
            <span>Portfolio — 2026</span>
          </div>

          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={word}
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                exit={{ y: "-100%", transition: { duration: 0.22, ease: easeCurtain } }}
                transition={{ duration: 0.4, ease: easeExpo }}
                className="text-[clamp(2.5rem,9vw,8rem)] font-semibold leading-none tracking-[-0.05em] text-text"
              >
                {word}
              </motion.p>
            </AnimatePresence>
          </div>

          <div>
            <div className="mb-4 flex items-end justify-between">
              <span className="font-mono text-xs text-muted">Chargement</span>
              <span className="tabular text-[clamp(3rem,10vw,9rem)] font-semibold leading-[0.8] tracking-[-0.06em] text-text">
                {String(count).padStart(3, "0")}
              </span>
            </div>
            <div className="h-px w-full bg-border">
              <div
                className="h-px origin-left bg-gradient-to-r from-accent to-ice"
                style={{ transform: `scaleX(${count / 100})` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
