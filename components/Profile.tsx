"use client";

import { useRef } from "react";
import { motion, type MotionValue, useScroll, useTransform } from "framer-motion";
import SectionTitle from "@/components/SectionTitle";
import { easeExpo } from "@/lib/animations";

const STATEMENT =
  "Né en 2004, je code depuis le lycée. BUT Informatique, École 42, puis l'UTT : un parcours qui mêle rigueur académique et terrain, avec une année entre le SDIS 25 et le laboratoire FEMTO-ST. J'aime les projets qui sortent de l'écran de l'IDE : une app installée sur des Mac, un site utilisé par des étudiants, une IA qui tourne sans cloud.";

const HIGHLIGHT = new Set(["l'UTT", "SDIS", "FEMTO-ST.", "Mac,", "étudiants,", "cloud."]);

function Word({ word, range, progress }: { word: string; range: [number, number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const blur = useTransform(progress, range, ["blur(6px)", "blur(0px)"]);
  return (
    <motion.span
      style={{ opacity, filter: blur }}
      className={`mr-[0.24em] inline-block ${HIGHLIGHT.has(word) ? "font-serif italic text-lilac" : ""}`}
    >
      {word}
    </motion.span>
  );
}

const stats = [
  { value: "50+", label: "dépôts GitHub" },
  { value: "3", label: "projets utilisés en production" },
  { value: "1 an", label: "d'alternance au SDIS 25" },
];

const skills = [
  { title: "IA & données", items: ["PyTorch", "TensorFlow", "LangChain", "Scikit-Learn", "Ollama", "RAG", "Décodage contraint"] },
  { title: "Web", items: ["Next.js", "React", "Vue.js", "TypeScript", "FastAPI", "Express", "Fastify", "Flask"] },
  { title: "Natif & bas niveau", items: ["Swift", "SwiftUI", "C", "Threads POSIX", "WebSocket", "React Native"] },
  { title: "Données & infra", items: ["PostgreSQL", "MongoDB", "Redis", "SQLite", "Docker", "GitHub Actions", "Linux"] },
];

export default function Profile() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = STATEMENT.split(" ");

  return (
    <section id="profil" className="relative px-5 sm:px-8 lg:px-12">
      <div data-stage="wave" data-side="left" data-c1="#8FB8FF" data-c2="#C7A6FF" className="mx-auto grid min-h-[100svh] max-w-[1600px] grid-cols-1 items-center py-28 md:grid-cols-12">
        <div className="md:col-span-8 md:col-start-5 lg:col-span-7 lg:col-start-6">
          <SectionTitle n="02" label="Profil" title="Du code qui" accent="sert." />
          <p ref={ref} className="mt-12 text-[clamp(1.35rem,2.4vw,2.2rem)] font-medium leading-[1.3] tracking-[-0.02em]">
            {words.map((w, i) => {
              const start = i / words.length;
              return <Word key={i} word={w} range={[start, start + 1 / words.length]} progress={scrollYProgress} />;
            })}
          </p>

          <div className="mt-16 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border bg-border">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: easeExpo, delay: i * 0.1 }}
                className="bg-bg/75 p-4 backdrop-blur sm:p-6"
              >
                <p className="text-[clamp(1.8rem,4vw,3.4rem)] font-extrabold leading-none tracking-[-0.04em] text-accent">{s.value}</p>
                <p className="mt-3 text-xs leading-snug text-muted-light sm:text-sm">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div data-stage="helix" data-side="right" data-c1="#B7A4FF" data-c2="#5CC8FF" className="mx-auto grid min-h-[90svh] max-w-[1600px] grid-cols-1 items-center py-24 md:grid-cols-12">
        <div className="md:col-span-7 lg:col-span-6">
          <p className="label flex items-center gap-3 text-muted">
            <span className="text-accent">02.b</span>
            <span className="h-px w-10 bg-border-hover" />
            Stack
          </p>
          <ul className="mt-8">
            {skills.map((g, i) => (
              <motion.li
                key={g.title}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1, ease: easeExpo, delay: i * 0.08 }}
                className="group border-t border-border py-7 last:border-b"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-[clamp(1.6rem,3vw,2.6rem)] font-bold tracking-[-0.035em] transition-transform duration-700 ease-expo group-hover:translate-x-2">
                    {g.title}
                  </h3>
                  <span className="label tabular text-muted">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {g.items.map((it) => (
                    <li
                      key={it}
                      className="glass rounded-full px-3 py-1.5 text-sm text-muted-light transition-colors duration-300 group-hover:text-text"
                    >
                      {it}
                    </li>
                  ))}
                </ul>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
