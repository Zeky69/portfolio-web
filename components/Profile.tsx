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
      className={`mr-[0.24em] inline-block ${HIGHLIGHT.has(word) ? "font-serif italic text-steel" : ""}`}
    >
      {word}
    </motion.span>
  );
}

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
      <div data-stage="wave" data-side="left" data-c1="#8FB8FF" data-c2="#5C8DFF" className="mx-auto grid min-h-[100svh] max-w-[1600px] grid-cols-1 items-center py-28 md:grid-cols-12">
        <div className="md:col-span-8 md:col-start-5 lg:col-span-7 lg:col-start-6">
          <SectionTitle title="Du code qui" accent="sert." />
          <p ref={ref} className="mt-12 text-[clamp(1.35rem,2.4vw,2.2rem)] font-medium leading-[1.3] tracking-[-0.02em]">
            {words.map((w, i) => {
              const start = i / words.length;
              return <Word key={i} word={w} range={[start, start + 1 / words.length]} progress={scrollYProgress} />;
            })}
          </p>

        </div>
      </div>

      <div data-stage="helix" data-side="right" data-c1="#6F95D8" data-c2="#5CC8FF" className="mx-auto grid min-h-[90svh] max-w-[1600px] grid-cols-1 items-center py-24 md:grid-cols-12">
        <div className="md:col-span-7 lg:col-span-6">
          <ul>
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
                  <h3 className="text-[clamp(1.6rem,3vw,2.6rem)] font-bold tracking-[-0.015em] transition-transform duration-700 ease-expo group-hover:translate-x-2">
                    {g.title}
                  </h3>
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
