"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUp } from "lucide-react";
import LocalClock from "@/components/fx/LocalClock";
import { scrollToTarget } from "@/lib/lenis";

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  // Le nom se "remplit" de gauche à droite à mesure qu'on atteint le bas
  const clip = useTransform(scrollYProgress, [0.15, 0.95], ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]);
  const y = useTransform(scrollYProgress, [0, 1], ["40%", "0%"]);

  return (
    <footer ref={ref} className="relative overflow-hidden border-t border-border px-5 pt-14 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-8 font-mono text-xs text-muted sm:grid-cols-4">
          <div>
            <p className="mb-2 text-text">Zekeriya Akburak</p>
            <p>Développeur Fullstack &amp; IA</p>
          </div>
          <div>
            <p className="mb-2 text-text">Heure locale</p>
            <p>
              Troyes, FR — <LocalClock />
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <a href="https://github.com/Zeky69" target="_blank" rel="noopener noreferrer" className="w-fit text-text transition-colors hover:text-accent-light">
              GitHub ↗
            </a>
            <a href="mailto:zek.akburak@gmail.com" className="w-fit transition-colors hover:text-text">
              Email ↗
            </a>
          </div>
          <div className="sm:text-right">
            <button
              type="button"
              onClick={() => scrollToTarget(0)}
              className="group inline-flex items-center gap-2 text-text"
            >
              Haut de page
              <span className="grid h-8 w-8 place-items-center rounded-full border border-border-hover transition-all duration-500 ease-expo group-hover:-translate-y-1 group-hover:border-accent group-hover:bg-accent">
                <ArrowUp size={14} />
              </span>
            </button>
          </div>
        </div>

        <motion.div style={{ y }} className="relative mt-16 select-none" aria-hidden>
          <p className="text-outline whitespace-nowrap text-center text-[19.5vw] font-semibold leading-[0.78] tracking-[-0.065em]">
            AKBURAK
          </p>
          <motion.p
            style={{ clipPath: clip }}
            className="absolute inset-0 whitespace-nowrap bg-gradient-to-r from-accent via-accent-light to-ice bg-clip-text text-center text-[19.5vw] font-semibold leading-[0.78] tracking-[-0.065em] text-transparent"
          >
            AKBURAK
          </motion.p>
        </motion.div>

        <div className="flex justify-between border-t border-border py-5 font-mono text-[11px] text-muted">
          <span>© 2026</span>
          <span>Conçu &amp; codé par Zekeriya</span>
        </div>
      </div>
    </footer>
  );
}
