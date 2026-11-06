"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  type MotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import NeuralField from "@/components/fx/NeuralField";
import Magnetic from "@/components/fx/Magnetic";
import LocalClock from "@/components/fx/LocalClock";
import { useIntroDone } from "@/lib/intro";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { easeExpo } from "@/lib/animations";

const ROLES = ["raisonnent", "parlent", "tournent en local", "tiennent en prod"];

/**
 * Nom géant : les lettres montent depuis un masque à l'intro,
 * puis leur graisse réagit à la proximité du curseur (Geist variable).
 */
function ProximityName({ play, xs }: { play: boolean; xs: MotionValue<string>[] }) {
  const letters = useRef<(HTMLSpanElement | null)[]>([]);
  const fine = useMediaQuery("(pointer: fine)");
  const lines = [
    { text: "ZEKERIYA", align: "justify-start" },
    { text: "AKBURAK", align: "justify-end" },
  ];

  useEffect(() => {
    if (!fine) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let mx = -9999;
    let my = -9999;
    let dirty = true;
    let raf = 0;
    const BASE = 680;
    const MIN = 150;
    const RADIUS = 300;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dirty = true;
    };
    const onLeave = () => {
      mx = -9999;
      my = -9999;
      dirty = true;
    };
    const onScroll = () => {
      dirty = true;
    };
    const tick = () => {
      if (dirty) {
        dirty = false;
        for (const el of letters.current) {
          if (!el) continue;
          const r = el.getBoundingClientRect();
          const d = Math.hypot(mx - (r.left + r.width / 2), my - (r.top + r.height / 2));
          const k = Math.max(0, 1 - d / RADIUS);
          const e = k * k * (3 - 2 * k);
          el.style.fontWeight = String(Math.round(BASE - e * (BASE - MIN)));
        }
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [fine]);

  let n = 0;
  return (
    <h1 className="select-none text-text" aria-label="Zekeriya Akburak">
      {lines.map((line, li) => (
        <motion.span
          key={line.text}
          aria-hidden
          className={`flex ${line.align} overflow-hidden text-[clamp(3.6rem,15.5vw,16.5rem)] leading-[0.82] tracking-[-0.055em]`}
          style={{ fontWeight: 680, x: xs[li] }}
        >
          {Array.from(line.text).map((c) => {
            const i = n++;
            return (
              <motion.span
                key={i}
                className="inline-block pb-[0.06em]"
                initial={{ y: "105%" }}
                animate={play ? { y: "0%" } : { y: "105%" }}
                transition={{ duration: 1.2, ease: easeExpo, delay: 0.05 + i * 0.045 }}
              >
                <span
                  ref={(el) => {
                    letters.current[i] = el;
                  }}
                  className="inline-block transition-[font-weight] duration-150"
                >
                  {c}
                </span>
              </motion.span>
            );
          })}
        </motion.span>
      ))}
    </h1>
  );
}

function RotatingWord() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % ROLES.length), 2400);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="relative inline-flex overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={ROLES[i]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.7, ease: easeExpo }}
          className="inline-block whitespace-nowrap bg-gradient-to-r from-accent-light to-ice bg-clip-text text-transparent"
        >
          {ROLES[i]}.
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Hero() {
  const play = useIntroDone();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const nameY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const line1X = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const line2X = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const fieldY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  const show = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: play ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    transition: { duration: 1, ease: easeExpo, delay },
  });

  return (
    <section
      id="hero"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* Réseau neuronal interactif */}
      <motion.div
        className="absolute inset-0"
        style={{ y: fieldY }}
        initial={{ opacity: 0 }}
        animate={{ opacity: play ? 1 : 0 }}
        transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
      >
        <NeuralField className="h-full w-full" />
      </motion.div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-bg via-bg/70 to-transparent" />

      <motion.div
        style={{ opacity: fade, scale }}
        className="relative z-10 flex flex-1 flex-col px-5 pb-8 pt-28 sm:px-8 lg:px-12"
      >
        {/* Méta */}
        <motion.div
          {...show(0.5)}
          className="grid grid-cols-2 gap-4 font-mono text-[11px] text-muted sm:grid-cols-3"
        >
          <span>Portfolio — 2026</span>
          <span className="hidden text-center sm:block">
            Développeur Fullstack &amp; IA
          </span>
          <span className="text-right">
            Troyes, FR · <LocalClock className="text-text" />
          </span>
        </motion.div>

        {/* Nom */}
        <motion.div style={{ y: nameY }} className="my-auto py-10">
          <ProximityName play={play} xs={[line1X, line2X]} />
        </motion.div>

        {/* Bas du hero */}
        <div className="grid items-end gap-10 md:grid-cols-12">
          <motion.p
            {...show(0.75)}
            className="text-[clamp(1.25rem,2.2vw,1.9rem)] leading-[1.2] tracking-[-0.02em] text-muted-light md:col-span-7"
          >
            Élève ingénieur à l&apos;UTT. Je construis des systèmes qui{" "}
            <RotatingWord />
          </motion.p>

          <motion.div
            {...show(0.9)}
            className="flex flex-wrap items-center gap-3 md:col-span-5 md:justify-end"
          >
            <Magnetic>
              <a
                href="#projects"
                data-cursor="Go"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-text px-6 py-4 text-sm font-medium text-bg"
              >
                <span className="absolute inset-0 translate-y-full rounded-full bg-accent transition-transform duration-500 ease-expo group-hover:translate-y-0" />
                <span className="relative transition-colors duration-500 group-hover:text-white">
                  Voir les projets
                </span>
                <ArrowDownRight
                  size={16}
                  className="relative transition-all duration-500 ease-expo group-hover:-rotate-45 group-hover:text-white"
                />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#contact"
                className="group inline-flex items-center gap-3 rounded-full border border-border-hover px-6 py-4 text-sm font-medium text-text transition-colors duration-300 hover:border-accent-light"
              >
                Me contacter
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-500 ease-expo group-hover:rotate-45"
                />
              </a>
            </Magnetic>
          </motion.div>
        </div>

        <motion.div
          {...show(1.05)}
          className="mt-10 flex items-center justify-between border-t border-border pt-5 font-mono text-[11px] text-muted"
        >
          <span className="flex items-center gap-3">
            <span className="relative h-8 w-px overflow-hidden bg-border">
              <span className="scroll-cue absolute inset-0 bg-accent-light" />
            </span>
            Scroll
          </span>
          <span className="hidden sm:inline">BUT Info · École 42 · UTT</span>
          <span>FR · TR · EN</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
