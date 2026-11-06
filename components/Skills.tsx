"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { easeExpo } from "@/lib/animations";

const skillGroups = [
  {
    title: "IA & Data",
    note: "Modèles, agents, LLM locaux",
    tags: ["PyTorch", "TensorFlow", "LangChain", "Scikit-Learn", "Ollama"],
  },
  {
    title: "Langages",
    note: "Du bas niveau au typé",
    tags: ["Python", "TypeScript", "JavaScript", "C", "Java"],
  },
  {
    title: "Web & API",
    note: "Front réactif, back rapide",
    tags: ["React", "Vue.js", "FastAPI", "Express", "Fastify", "Flask"],
  },
  {
    title: "Données",
    note: "Relationnel, document, cache",
    tags: ["PostgreSQL", "MongoDB", "Redis", "MySQL"],
  },
  {
    title: "DevOps & Outils",
    note: "Livrer et faire tourner",
    tags: ["Docker", "Git", "Socket.IO", "Home Assistant"],
  },
  {
    title: "Mobile",
    note: "Une base, deux plateformes",
    tags: ["React Native", "iOS", "Android"],
  },
];

function SkillRow({
  group,
  index,
}: {
  group: (typeof skillGroups)[number];
  index: number;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  return (
    <li ref={ref} className="group relative border-b border-border">
      {/* Remplissage au survol */}
      <span className="absolute inset-0 origin-bottom scale-y-0 bg-accent transition-transform duration-700 ease-expo group-hover:scale-y-100" />
      <motion.span
        className="absolute inset-x-0 top-0 h-px origin-left bg-border-hover"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: inView ? 1 : 0 }}
        transition={{ duration: 1.2, ease: easeExpo, delay: index * 0.06 }}
      />

      <div className="relative grid items-center gap-6 px-2 py-8 md:grid-cols-12 md:px-4 md:py-10">
        <div className="overflow-hidden md:col-span-5">
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: inView ? "0%" : "100%" }}
            transition={{ duration: 1, ease: easeExpo, delay: 0.1 + index * 0.06 }}
            className="flex items-baseline gap-4"
          >
            <h3 className="text-[clamp(2rem,4.5vw,4rem)] font-semibold leading-none tracking-[-0.045em] text-text transition-transform duration-700 ease-expo group-hover:translate-x-3">
              {group.title}
            </h3>
          </motion.div>
          <p className="mt-3 font-mono text-xs text-muted transition-colors duration-500 group-hover:text-white/80">
            {group.note}
          </p>
        </div>

        <ul className="flex flex-wrap gap-2 md:col-span-6">
          {group.tags.map((tag, ti) => (
            <motion.li
              key={tag}
              initial={{ opacity: 0, y: 16, scale: 0.9 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.7, ease: easeExpo, delay: 0.25 + index * 0.06 + ti * 0.05 }}
              className="rounded-full border border-border-hover px-4 py-2 text-sm text-muted-light transition-colors duration-500 group-hover:border-white/40 group-hover:text-white"
              style={{ transitionDelay: `${ti * 30}ms` }}
            >
              {tag}
            </motion.li>
          ))}
        </ul>

        <div className="hidden justify-end md:col-span-1 md:flex">
          <ArrowUpRight
            size={28}
            className="text-muted transition-all duration-700 ease-expo group-hover:rotate-45 group-hover:text-white"
          />
        </div>
      </div>
    </li>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="relative px-5 py-32 sm:px-8 md:py-44 lg:px-12">
      <div className="mx-auto max-w-[1600px]">
        <SectionHeader
          index="02"
          label="Compétences"
          title="Stack technique"
          intro="Les outils avec lesquels je construis — de l'entraînement du modèle jusqu'à la mise en production."
        />
        <ul className="border-b border-border">
          {skillGroups.map((g, i) => (
            <SkillRow key={g.title} group={g} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
