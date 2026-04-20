"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { fadeUp, slideRight } from "@/lib/animations";

const education = [
  {
    period: "2026 – 2029",
    title: "École d'Ingénieur Informatique",
    subtitle: "En alternance – Admission en cours de préparation",
    accent: false,
  },
  {
    period: "2025 – Présent",
    title: "École 42",
    subtitle: "Campus de Mulhouse · Piscine validée",
    accent: true,
  },
  {
    period: "2022 – 2025",
    title: "BUT Informatique",
    subtitle: "IUT Nord-Franche-Comté, Montbéliard · Diplôme obtenu",
    accent: false,
  },
  {
    period: "2022",
    title: "Baccalauréat Général",
    subtitle: "Mention Mathématiques, Numérique & Sciences Informatiques (NSI)",
    accent: false,
  },
];

export default function Education() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="education"
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
            Formation
          </p>
          <h2 className="font-heading font-bold text-4xl sm:text-5xl text-text">
            Parcours académique
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[calc(16.666%-0.5px)] top-0 bottom-0 hidden md:block w-px bg-gradient-to-b from-accent/30 via-border to-transparent pointer-events-none" />

          {education.map((item, i) => (
            <motion.div
              key={i}
              variants={slideRight}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ delay: i * 0.12 }}
              className="relative grid md:grid-cols-6 gap-4 md:gap-10 mb-0"
            >
              {/* Dot */}
              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : { scale: 0 }}
                transition={{ delay: i * 0.12 + 0.2, type: "spring", stiffness: 400 }}
                className="hidden md:block absolute left-[calc(16.666%-6px)] top-6 w-3 h-3 rounded-full border-2 border-bg z-10"
                style={{ backgroundColor: item.accent ? "#D35F3E" : "#363640" }}
              />

              {/* Period */}
              <div className="md:col-span-1 pt-5">
                <p className="text-xs font-medium text-muted uppercase tracking-wide">
                  {item.period}
                </p>
              </div>

              {/* Content */}
              <div className="md:col-span-5 py-5 border-b border-border last:border-0">
                <h3 className="font-heading font-semibold text-text text-xl mb-1">
                  {item.title}
                </h3>
                <p className={`text-sm ${item.accent ? "text-accent" : "text-muted"}`}>
                  {item.subtitle}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
