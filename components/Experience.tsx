"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { fadeUp, slideRight, staggerContainer } from "@/lib/animations";

const experiences = [
  {
    period: "2024 – 2025",
    type: "Alternance",
    role: "Développeur Informatique",
    company: "SDIS25 – Service Départemental d'Incendie et de Secours (Doubs)",
    description:
      "Développement d'Optimops, solution de gestion et d'analyse des données opérationnelles des pompiers. Tableaux de bord analytiques, génération de rapports et simulations via jumeau numérique.",
    tags: ["Vue.js", "Python", "MongoDB", "Flask"],
  },
  {
    period: "Avr – Juin 2024",
    type: "Stage R&D",
    role: "Recherche & Développement – IA",
    company: "Laboratoire FEMTO-ST",
    description:
      "Implémentation de modèles d'apprentissage fédéré (Federated Learning) pour optimiser la prévision de consommation et de production d'énergie renouvelable (solaire, éolien).",
    tags: ["Python", "TensorFlow", "Scikit-Learn"],
  },
];

function TimelineItem({
  exp,
  index,
  isInView,
}: {
  exp: (typeof experiences)[0];
  index: number;
  isInView: boolean;
}) {
  return (
    <motion.article
      variants={slideRight}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ delay: index * 0.15 }}
      className="relative grid md:grid-cols-4 gap-4 md:gap-10 group"
    >
      {/* Timeline dot */}
      <div className="hidden md:flex absolute left-[calc(25%-1.25rem)] top-0 flex-col items-center h-full pointer-events-none">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ delay: index * 0.15 + 0.2, type: "spring", stiffness: 400 }}
          className="w-3 h-3 rounded-full bg-accent border-2 border-bg z-10 mt-1"
        />
        {index < experiences.length - 1 && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ delay: index * 0.15 + 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 w-px bg-gradient-to-b from-accent/40 to-transparent origin-top"
          />
        )}
      </div>

      {/* Meta */}
      <div className="md:col-span-1 pt-0.5">
        <p className="text-xs font-medium text-accent/80 uppercase tracking-wide">
          {exp.period}
        </p>
        <p className="text-xs text-muted mt-1">{exp.type}</p>
      </div>

      {/* Content */}
      <div className="md:col-span-3 pb-12">
        <div className="bg-surface border border-border rounded-2xl p-6 group-hover:border-border-hover transition-colors duration-300">
          <h3 className="font-heading font-semibold text-text text-lg mb-1">
            {exp.role}
          </h3>
          <p className="text-accent text-sm font-medium mb-4">{exp.company}</p>
          <p className="text-muted text-sm leading-relaxed mb-5" style={{ lineHeight: "1.75" }}>
            {exp.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {exp.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full bg-bg border border-border text-muted-light"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function Experience() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="experience"
      ref={ref}
      className="py-28 px-4 sm:px-6 lg:px-8 border-t border-border"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-16"
        >
          <p className="text-accent text-xs font-medium tracking-widest uppercase mb-4">
            Parcours
          </p>
          <h2 className="font-heading font-bold text-4xl sm:text-5xl text-text">
            Expériences professionnelles
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="space-y-0">
          {experiences.map((exp, i) => (
            <TimelineItem key={i} exp={exp} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}
