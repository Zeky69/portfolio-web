"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import ProjectArt from "@/components/fx/ProjectArt";
import FadeIn from "@/components/fx/FadeIn";
import { TransitionLink } from "@/components/fx/PageTransition";
import { featuredProjects, miniProjects, type Project } from "@/lib/projects";
import { useMediaQuery } from "@/lib/useMediaQuery";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

function FeaturedCard({
  project,
  index,
  total,
  rail,
}: {
  project: Project;
  index: number;
  total: number;
  rail: boolean;
}) {
  return (
    <TransitionLink
      href={`/projects/${project.slug}`}
      label={project.title}
      data-cursor="Ouvrir"
      className={`group relative block shrink-0 overflow-hidden rounded-[32px] border border-border bg-surface transition-colors duration-500 hover:border-accent/60 ${
        rail ? "h-[74vh] w-[min(82vw,1100px)]" : "w-full"
      }`}
    >
      <div className={`grid h-full ${rail ? "grid-cols-2" : "grid-rows-[auto_1fr]"}`}>
        <div
          className={`relative overflow-hidden border-border ${
            rail ? "border-r" : "aspect-[4/3] border-b"
          }`}
        >
          <ProjectArt
            variant={index}
            className="absolute inset-0 h-full w-full transition-transform duration-[1.4s] ease-expo group-hover:scale-[1.12]"
          />
          <span className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 font-mono text-[11px] text-text backdrop-blur-md">
            {project.badge}
          </span>
        </div>

        <div className="flex flex-col p-7 md:p-10">
          <div className="flex items-center justify-between font-mono text-xs text-muted">
            <span className="tabular">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <span>{project.category}</span>
          </div>

          <h3
            className={`mt-10 font-semibold leading-[0.95] tracking-[-0.045em] text-text ${
              rail ? "mt-auto text-[clamp(2.25rem,3.8vw,4rem)]" : "text-4xl"
            }`}
          >
            {project.title}
          </h3>
          <p className="mt-5 max-w-md leading-relaxed text-muted-light">
            {project.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.tags.slice(0, 5).map((t) => (
              <span
                key={t}
                className="rounded-full border border-border-hover px-3 py-1 font-mono text-[11px] text-muted-light"
              >
                {t}
              </span>
            ))}
          </div>

          <span className="mt-8 inline-flex items-center gap-3 text-sm font-medium text-text">
            <span className="relative">
              Lire l&apos;étude de cas
              <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-accent-light transition-transform duration-500 ease-expo group-hover:origin-left group-hover:scale-x-100" />
            </span>
            <span className="grid h-10 w-10 place-items-center rounded-full border border-border-hover transition-all duration-500 ease-expo group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent">
              <ArrowUpRight size={16} />
            </span>
          </span>
        </div>
      </div>
    </TransitionLink>
  );
}

/** Desktop : la section se fige et les projets défilent horizontalement au scroll. */
function FeaturedRail() {
  const target = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useIsoLayoutEffect(() => {
    const measure = () => {
      if (!track.current) return;
      setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target,
    offset: ["start start", "end end"],
  });
  const raw = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const x = useSpring(raw, { stiffness: 140, damping: 30, mass: 0.4 });
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={target} className="relative" style={{ height: `calc(100vh + ${distance}px)` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <motion.div ref={track} style={{ x }} className="flex w-max gap-8 px-12">
          {featuredProjects.map((p, i) => (
            <FeaturedCard key={p.slug} project={p} index={i} total={featuredProjects.length} rail />
          ))}
          <div className="flex h-[74vh] w-[30vw] shrink-0 flex-col justify-center pl-8">
            <p className="text-[clamp(2rem,3.5vw,3.5rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-text">
              Et d&apos;autres
              <br />
              <span className="text-outline">projets</span>
              <br />
              plus bas.
            </p>
          </div>
        </motion.div>
        <div className="mx-12 mt-8 flex items-center gap-4 font-mono text-[11px] text-muted">
          <span>Scroll</span>
          <div className="h-px flex-1 bg-border">
            <motion.div className="h-px origin-left bg-accent-light" style={{ scaleX: bar }} />
          </div>
          <span>{featuredProjects.length} projets phares</span>
        </div>
      </div>
    </div>
  );
}

function ProjectIndex({ items }: { items: Project[] }) {
  const fine = useMediaQuery("(pointer: fine)");
  const [active, setActive] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 28, mass: 0.5 });
  const y = useSpring(my, { stiffness: 260, damping: 28, mass: 0.5 });

  useEffect(() => setMounted(true), []);

  return (
    <div
      onPointerMove={(e) => {
        mx.set(e.clientX);
        my.set(e.clientY);
      }}
      onPointerLeave={() => setActive(null)}
    >
      <ul className="border-t border-border">
        {items.map((p, i) => (
          <li key={p.slug} onPointerEnter={() => setActive(i)}>
            <TransitionLink
              href={`/projects/${p.slug}`}
              label={p.title}
              data-cursor="Ouvrir"
              className="group relative grid grid-cols-12 items-baseline gap-4 border-b border-border py-6 md:py-8"
            >
              <span className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-gradient-to-r from-accent to-ice transition-transform duration-700 ease-expo group-hover:scale-x-100" />
              <span className="col-span-2 font-mono text-xs text-muted md:col-span-1">
                {p.year}
              </span>
              <span className="col-span-10 md:col-span-6">
                <span className="block text-2xl font-medium tracking-[-0.03em] text-text transition-all duration-700 ease-expo group-hover:translate-x-4 group-hover:text-accent-light md:text-4xl">
                  {p.title}
                </span>
                <span className="mt-2 block text-sm leading-relaxed text-muted md:hidden">
                  {p.description}
                </span>
              </span>
              <span className="hidden font-mono text-xs text-muted md:col-span-4 md:block">
                {p.tags.slice(0, 3).join(" · ")}
              </span>
              <span className="hidden justify-end md:col-span-1 md:flex">
                <ArrowUpRight
                  size={22}
                  className="text-muted transition-all duration-700 ease-expo group-hover:rotate-45 group-hover:text-text"
                />
              </span>
            </TransitionLink>
          </li>
        ))}
      </ul>

      {fine &&
        mounted &&
        createPortal(
          <motion.div
            aria-hidden
            className="pointer-events-none fixed left-0 top-0 z-[80]"
            style={{ x, y }}
          >
            <AnimatePresence>
              {active !== null && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.6, rotate: 8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className="ml-10 w-[320px] -translate-y-1/2 overflow-hidden rounded-3xl border border-border-hover bg-surface shadow-[0_30px_80px_-20px_rgba(91,91,255,0.45)]"
                >
                  <div className="relative h-40 overflow-hidden">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.div
                        key={active}
                        initial={{ y: "100%" }}
                        animate={{ y: "0%" }}
                        exit={{ y: "-100%" }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0"
                      >
                        <ProjectArt variant={active + 1} className="h-full w-full" />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <div className="p-5">
                    <p className="font-mono text-[11px] text-accent-light">
                      {items[active].year} · {items[active].tags[0]}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-light">
                      {items[active].description}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>,
          document.body
        )}
    </div>
  );
}

export default function Projects() {
  const desktop = useMediaQuery("(min-width: 1024px)");
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const rail = desktop && !reduce;

  return (
    <section id="projects" className="relative py-32 md:py-44">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <SectionHeader
          index="04"
          label="Réalisations"
          title="Projets"
          intro="IA locale, temps réel, systèmes bas niveau : une sélection de ce que j'ai conçu, codé et livré."
        />
      </div>

      {rail ? (
        <FeaturedRail />
      ) : (
        <div className="mx-auto grid max-w-[1600px] gap-6 px-5 sm:px-8 md:grid-cols-2">
          {featuredProjects.map((p, i) => (
            <FadeIn key={p.slug} delay={(i % 2) * 0.1}>
              <FeaturedCard project={p} index={i} total={featuredProjects.length} rail={false} />
            </FadeIn>
          ))}
        </div>
      )}

      <div className="mx-auto mt-32 max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <FadeIn y={12}>
          <div className="mb-10 flex items-end justify-between gap-6">
            <h3 className="text-[clamp(2rem,4.5vw,4rem)] font-semibold leading-none tracking-[-0.045em] text-text">
              Autres projets
            </h3>
            <span className="font-mono text-xs text-muted">
              {String(miniProjects.length).padStart(2, "0")} entrées
            </span>
          </div>
        </FadeIn>
        <ProjectIndex items={miniProjects} />
      </div>
    </section>
  );
}
