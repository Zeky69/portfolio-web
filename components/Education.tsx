"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionHeader from "@/components/SectionHeader";
import { easeExpo } from "@/lib/animations";

const education = [
  {
    period: "2026 — aujourd'hui",
    title: "Diplôme d'ingénieur",
    detail: "Informatique et Systèmes d'Information",
    school: "UTT — Université de Technologie de Troyes",
    note: "1re année de branche · formation initiale",
    current: true,
  },
  {
    period: "2025 — 2026",
    title: "École 42",
    detail: "Piscine validée",
    school: "Campus de Mulhouse",
    note: "A-Maze-ing, Fly-in, call-me-maybe",
    current: false,
  },
  {
    period: "2022 — 2025",
    title: "BUT Informatique",
    detail: "Diplôme obtenu",
    school: "IUT Nord-Franche-Comté, Montbéliard",
    note: "Alternance au SDIS 25 en dernière année",
    current: false,
  },
  {
    period: "2022",
    title: "Baccalauréat général",
    detail: "Mention Mathématiques & NSI",
    school: "Numérique et Sciences Informatiques",
    note: "Le début du code",
    current: false,
  },
];

function Row({ item, index }: { item: (typeof education)[number]; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  return (
    <li ref={ref} className="group relative">
      <motion.span
        className="absolute inset-x-0 top-0 h-px origin-left bg-border-hover"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: inView ? 1 : 0 }}
        transition={{ duration: 1.3, ease: easeExpo, delay: index * 0.08 }}
      />
      <div className="grid gap-4 py-10 transition-transform duration-700 ease-expo group-hover:translate-x-2 md:grid-cols-12 md:gap-8 md:py-12">
        <div className="md:col-span-3">
          <p className="flex items-center gap-3 font-mono text-xs text-muted">
            {item.current && (
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ice opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-ice" />
              </span>
            )}
            <span className={item.current ? "text-ice" : ""}>{item.period}</span>
          </p>
        </div>
        <div className="overflow-hidden md:col-span-6">
          <motion.h3
            initial={{ y: "100%" }}
            animate={{ y: inView ? "0%" : "100%" }}
            transition={{ duration: 1, ease: easeExpo, delay: 0.1 + index * 0.08 }}
            className="text-[clamp(1.9rem,3.6vw,3.25rem)] font-semibold leading-[1] tracking-[-0.045em] text-text"
          >
            {item.title}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: inView ? 1 : 0 }}
            transition={{ duration: 1, delay: 0.3 + index * 0.08 }}
            className={`mt-3 text-lg ${item.current ? "text-accent-light" : "text-muted-light"}`}
          >
            {item.detail}
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: easeExpo, delay: 0.35 + index * 0.08 }}
          className="text-sm leading-relaxed md:col-span-3 md:text-right"
        >
          <p className="text-text">{item.school}</p>
          <p className="mt-1 text-muted">{item.note}</p>
        </motion.div>
      </div>
    </li>
  );
}

export default function Education() {
  return (
    <section id="education" className="relative px-5 py-32 sm:px-8 md:py-44 lg:px-12">
      <div className="mx-auto max-w-[1600px]">
        <SectionHeader
          index="05"
          label="Formation"
          title="Parcours académique"
          intro="Un BUT pour les fondations, 42 pour l'autonomie, l'UTT pour la vision d'ingénieur."
        />
        <ul className="border-b border-border">
          {education.map((item, i) => (
            <Row key={item.title} item={item} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
