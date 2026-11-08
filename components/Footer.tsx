"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { scrollToTarget } from "@/lib/lenis";

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["40%", "0%"]);

  return (
    <footer ref={ref} data-stage="scatter" data-dim="0.3" className="relative z-10 overflow-clip">
      <div className="paint rounded-t-[28px] px-5 pt-10 sm:rounded-t-[40px] sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-start justify-between gap-6 text-sm font-medium">
          <p>© {new Date().getFullYear()} Zekeriya Akburak — conçu et codé à la main.</p>
          <div className="flex gap-6">
            <a href="https://github.com/Zeky69" target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
              GitHub
            </a>
            <a href="mailto:zek.akburak@gmail.com" className="underline-offset-4 hover:underline">
              E-mail
            </a>
            <button onClick={() => scrollToTarget("#top")} className="underline-offset-4 hover:underline">
              Haut de page ↑
            </button>
          </div>
        </div>
        <motion.p
          style={{ y, fontVariationSettings: '"wdth" 75' }}
          aria-hidden
          className="mx-auto mt-6 max-w-[1600px] select-none whitespace-nowrap text-center text-[19.5vw] font-extrabold leading-[0.78] tracking-[-0.06em]"
        >
          AKBURAK
        </motion.p>
      </div>
    </footer>
  );
}
