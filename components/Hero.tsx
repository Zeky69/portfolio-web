"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import RevealText from "@/components/fx/RevealText";
import Magnetic from "@/components/fx/Magnetic";
import { useIntroDone } from "@/lib/intro";
import { scrollToTarget } from "@/lib/lenis";
import { easeExpo } from "@/lib/animations";

export default function Hero() {
  const intro = useIntroDone();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, -160]);
  const fade = useTransform(scrollY, [0, 600], [1, 0]);

  const show = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: intro ? { opacity: 1, y: 0 } : {},
    transition: { duration: 1.1, ease: easeExpo, delay },
  });

  return (
    <section
      id="top"
      data-stage="halo"
      data-side="right"
      className="relative flex min-h-[100svh] flex-col justify-between px-5 pb-8 pt-28 sm:px-8 lg:px-12"
    >
      <motion.div style={{ y, opacity: fade }} className="mx-auto w-full max-w-[1600px] flex-1">
        <motion.p {...show(0.1)} className="label flex items-center gap-3 text-muted-light">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          Développeur Fullstack &amp; IA — Élève ingénieur UTT
        </motion.p>

        <h1
          className="mt-10 font-extrabold leading-[0.84] tracking-[-0.055em] sm:mt-14"
          style={{ fontVariationSettings: '"wdth" 78, "opsz" 96' }}
        >
          <span className="block text-[clamp(3.6rem,13.5vw,13rem)]">
            <RevealText text="Zekeriya" play={intro} delay={0.05} stagger={0.035} />
          </span>
          <span className="block text-[clamp(3.6rem,13.5vw,13rem)] text-accent">
            <RevealText text="Akburak" play={intro} delay={0.2} stagger={0.035} />
          </span>
        </h1>

        <motion.p
          {...show(0.55)}
          className="mt-10 max-w-[30ch] font-serif text-[clamp(1.6rem,2.8vw,2.6rem)] leading-[1.08] text-text"
        >
          Je construis des outils <em className="text-steel">qu&apos;on utilise vraiment</em> — apps macOS,
          sites en production, IA qui tourne en local.
        </motion.p>

        <motion.div {...show(0.7)} className="mt-10 flex flex-wrap items-center gap-3">
          <Magnetic strength={0.25}>
            <button
              onClick={() => scrollToTarget("#projets")}
              data-cursor="Go"
              className="group inline-flex items-center gap-3 rounded-full bg-accent-dark px-6 py-4 text-sm font-semibold text-text"
            >
              Voir les projets
              <ArrowDownRight size={16} className="transition-transform duration-500 ease-expo group-hover:rotate-[-45deg]" />
            </button>
          </Magnetic>
          <Magnetic strength={0.25}>
            <a
              href="https://github.com/Zeky69"
              target="_blank"
              rel="noopener noreferrer"
              className="glass group inline-flex items-center gap-3 rounded-full px-6 py-4 text-sm font-medium"
            >
              GitHub
              <ArrowUpRight size={16} className="transition-transform duration-500 ease-expo group-hover:rotate-45" />
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>

      <motion.div
        {...show(0.9)}
        className="mx-auto mt-16 grid w-full max-w-[1600px] grid-cols-2 items-end gap-6 border-t border-border pt-5 md:grid-cols-4"
      >
        <p className="label text-muted">
          Basé à<br />
          <span className="mt-2 block font-sans text-sm normal-case tracking-normal text-text">Troyes · Doubs</span>
        </p>
        <p className="label text-muted">
          Formation<br />
          <span className="mt-2 block font-sans text-sm normal-case tracking-normal text-text">BUT Info · École 42 · UTT</span>
        </p>
        <p className="label hidden text-muted md:block">
          En ce moment<br />
          <span className="mt-2 block font-sans text-sm normal-case tracking-normal text-text">Pastille v0.2 pour macOS</span>
        </p>
        <button
          onClick={() => scrollToTarget("#projets")}
          className="label flex items-center justify-end gap-3 text-muted transition-colors hover:text-text"
        >
          Défiler
          <span className="relative h-10 w-px overflow-hidden bg-border-hover">
            <span className="scroll-cue absolute inset-0 bg-accent" />
          </span>
        </button>
      </motion.div>
    </section>
  );
}
