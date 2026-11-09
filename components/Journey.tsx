"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import SectionTitle from "@/components/SectionTitle";
import { easeExpo } from "@/lib/animations";
import type { LogoName } from "@/lib/shapes";

type Step = {
  period: string;
  kind: "Expérience" | "Formation";
  title: string;
  place: string;
  text: string;
  tags?: string[];
  current?: boolean;
  /** Logo dessiné en particules pendant qu'on lit cette étape */
  logo: LogoName;
};

const steps: Step[] = [
  {
    period: "2026 — aujourd'hui",
    kind: "Formation",
    title: "Diplôme d'ingénieur — Informatique et Systèmes d'Information",
    place: "UTT · Université de Technologie de Troyes",
    text: "Première année de branche, en formation initiale.",
    current: true,
    logo: "logo-utt",
  },
  {
    period: "2025 — 2026",
    kind: "Formation",
    title: "École 42",
    place: "Campus de Mulhouse",
    text: "Pédagogie par projets, sans cours : RAG, décodage contraint, Docker, threads en C, Pac-Man, labyrinthes, routage de drones.",
    logo: "logo-42",
  },
  {
    period: "2024 — 2025",
    kind: "Expérience",
    title: "Développeur — alternance",
    place: "SDIS 25 · Pompiers du Doubs",
    text: "Développement d'Optimops, l'outil de gestion et d'analyse des données opérationnelles : tableaux de bord, génération de rapports et simulations via un jumeau numérique.",
    tags: ["Vue.js", "Python", "Flask", "MongoDB"],
    logo: "logo-sdis",
  },
  {
    period: "Avr — Juin 2024",
    kind: "Expérience",
    title: "Stage R&D en IA",
    place: "Laboratoire FEMTO-ST",
    text: "Apprentissage fédéré (Federated Learning) pour prévoir la consommation et la production d'énergies renouvelables, solaire et éolien.",
    tags: ["Python", "TensorFlow", "Scikit-Learn"],
    logo: "logo-femto",
  },
  {
    period: "2022 — 2025",
    kind: "Formation",
    title: "BUT Informatique",
    place: "IUT Nord-Franche-Comté · Belfort",
    text: "Diplôme obtenu, dernière année en alternance.",
    logo: "logo-iut",
  },
];

/**
 * La section porte le premier logo (titre + première étape) ; chaque étape suivante
 * déclare le sien. La scène ne regarde que le haut de chaque bloc : une étape imbriquée
 * prend donc le relais dès qu'elle atteint le milieu de l'écran.
 */
const stage = (logo: LogoName, morph = 0.25) => ({
  "data-stage": logo,
  "data-side": "left",
  "data-c1": "#FFC48A",
  "data-c2": "#FF8FB1",
  "data-morph": String(morph),
});

export default function Journey() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.7", "end 0.6"] });
  const line = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section
      id="parcours"
      {...stage(steps[0].logo, 0.5)}
      className="relative px-5 py-28 sm:px-8 md:py-40 lg:px-12"
    >
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 md:grid-cols-12">
        <div className="md:col-span-8 md:col-start-5 lg:col-span-7 lg:col-start-6">
          <SectionTitle title="Le chemin" accent="jusqu'ici." />

          <ol ref={ref} className="relative mt-16 pl-8 sm:pl-12">
            <span className="absolute left-0 top-2 h-[calc(100%-1rem)] w-px bg-border" />
            <motion.span
              style={{ scaleY: line }}
              className="absolute left-0 top-2 h-[calc(100%-1rem)] w-px origin-top bg-gradient-to-b from-accent via-[#8FB8FF] to-steel"
            />
            {steps.map((s, i) => (
              <motion.li
                key={s.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1, ease: easeExpo, delay: 0.05 * i }}
                {...(i > 0 ? stage(s.logo) : {})}
                className="relative pb-14 last:pb-0 md:min-h-[42vh]"
              >
                <span
                  className={`absolute -left-8 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-bg sm:-left-12 ${
                    s.current ? "bg-accent shadow-[0_0_20px_rgba(48,73,147,0.9)]" : "bg-text"
                  }`}
                />
                <p className="label flex flex-wrap items-center gap-3 text-muted">
                  <span className={s.kind === "Expérience" ? "text-accent" : "text-steel"}>{s.kind}</span>
                  <span className="tabular">{s.period}</span>
                </p>
                <h3 className="mt-3 text-[clamp(1.5rem,2.8vw,2.4rem)] font-bold leading-[1.05] tracking-[-0.015em]">{s.title}</h3>
                <p className="mt-2 font-serif text-xl italic text-muted-light">{s.place}</p>
                <p className="mt-4 max-w-[58ch] leading-relaxed text-muted-light">{s.text}</p>
                {s.tags && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {s.tags.map((t) => (
                      <li key={t} className="glass rounded-full px-3 py-1 font-mono text-[11px] text-muted-light">
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
