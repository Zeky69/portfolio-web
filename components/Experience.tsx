"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useSpring } from "framer-motion";
import SectionHeader from "@/components/SectionHeader";
import { easeExpo } from "@/lib/animations";

const experiences = [
  {
    period: "2024 — 2025",
    type: "Alternance · 1 an",
    role: "Développeur informatique",
    company: "SDIS 25",
    companyFull: "Service Départemental d'Incendie et de Secours du Doubs",
    description:
      "Développement d'Optimops, la solution de gestion et d'analyse des données opérationnelles des pompiers du Doubs : tableaux de bord analytiques, génération de rapports et simulations via un jumeau numérique.",
    highlights: ["Tableaux de bord analytiques", "Génération de rapports", "Jumeau numérique"],
    tags: ["Vue.js", "Python", "Flask", "MongoDB"],
  },
  {
    period: "Avr — Juin 2024",
    type: "Stage R&D",
    role: "Recherche & développement — IA",
    company: "FEMTO-ST",
    companyFull: "Laboratoire FEMTO-ST",
    description:
      "Implémentation de modèles d'apprentissage fédéré (Federated Learning) pour améliorer la prévision de consommation et de production d'énergies renouvelables (solaire, éolien).",
    highlights: ["Federated Learning", "Prévision énergétique", "Solaire & éolien"],
    tags: ["Python", "TensorFlow", "Scikit-Learn"],
  },
];

function ExperienceItem({
  exp,
  index,
}: {
  exp: (typeof experiences)[number];
  index: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });

  return (
    <article
      ref={ref}
      className="group relative grid gap-8 py-14 md:grid-cols-12 md:gap-10 md:py-20"
    >
      {/* Nœud de la timeline */}
      <motion.span
        className="absolute left-0 top-[4.4rem] hidden h-3 w-3 -translate-x-[5.5px] rounded-full border-2 border-bg bg-accent md:block md:top-[6.1rem]"
        initial={{ scale: 0 }}
        animate={{ scale: inView ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 18, delay: 0.2 }}
      />

      <div className="md:col-span-4 md:pl-12">
        <div className="md:sticky md:top-32">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: easeExpo }}
            className="font-mono text-xs text-accent-light"
          >
            {exp.period}
          </motion.p>
          <div className="mt-4 overflow-hidden">
            <motion.p
              initial={{ y: "100%" }}
              animate={{ y: inView ? "0%" : "100%" }}
              transition={{ duration: 1.1, ease: easeExpo, delay: 0.05 }}
              className="text-[clamp(3rem,6.5vw,6rem)] font-semibold leading-[0.9] tracking-[-0.055em] text-text"
            >
              {exp.company}
            </motion.p>
          </div>
          <p className="mt-3 font-mono text-xs text-muted">{exp.type}</p>
        </div>
      </div>

      <motion.div
        className="md:col-span-8"
        initial={{ clipPath: "inset(0% 0% 100% 0%)", opacity: 0 }}
        animate={
          inView
            ? { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }
            : {}
        }
        transition={{ duration: 1.2, ease: easeExpo, delay: 0.15 + index * 0.05 }}
      >
        <div className="relative overflow-hidden rounded-[28px] border border-border bg-surface p-7 transition-colors duration-500 group-hover:border-border-hover md:p-10">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-accent/20 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />
          <h3 className="text-2xl font-semibold tracking-[-0.03em] text-text md:text-4xl">
            {exp.role}
          </h3>
          <p className="mt-2 text-sm text-muted">{exp.companyFull}</p>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-light md:text-lg">
            {exp.description}
          </p>

          <ul className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
            {exp.highlights.map((h) => (
              <li key={h} className="bg-surface px-4 py-4 text-sm text-text">
                <span className="mb-2 block h-1 w-6 rounded-full bg-gradient-to-r from-accent to-ice" />
                {h}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-2">
            {exp.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-border-hover px-3 py-1.5 font-mono text-xs text-muted-light"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </article>
  );
}

export default function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.7", "end 0.6"],
  });
  const line = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="experience" className="relative px-5 py-32 sm:px-8 md:py-44 lg:px-12">
      <div className="mx-auto max-w-[1600px]">
        <SectionHeader
          index="03"
          label="Parcours pro"
          title="Expériences"
          intro="Un an sur le terrain : de la donnée opérationnelle des pompiers à la recherche en IA distribuée."
        />
        <div ref={ref} className="relative">
          {/* Ligne qui se dessine au scroll */}
          <div className="absolute bottom-0 left-0 top-0 hidden w-px bg-border md:block">
            <motion.div
              className="h-full w-px origin-top bg-gradient-to-b from-accent via-accent-light to-ice"
              style={{ scaleY: line }}
            />
          </div>
          {experiences.map((exp, i) => (
            <ExperienceItem key={exp.company} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
