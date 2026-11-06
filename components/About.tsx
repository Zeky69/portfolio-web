"use client";

import { useRef, useState } from "react";
import { motion, type MotionValue, useScroll, useTransform } from "framer-motion";
import { Check, Copy } from "lucide-react";
import FadeIn from "@/components/fx/FadeIn";

const STATEMENT =
  "Né en 2004, je code depuis le lycée. BUT Informatique, École 42, puis l'UTT : un parcours qui mêle rigueur académique et terrain — une année entre le SDIS 25 et le laboratoire FEMTO-ST. Aujourd'hui élève ingénieur en Informatique et Systèmes d'Information, je construis des IA qui tournent en local, des apps temps réel et des outils qu'on utilise vraiment.";

// Mots mis en valeur une fois "allumés"
const HIGHLIGHT = new Set(["l'UTT", "SDIS", "FEMTO-ST.", "IA", "local,", "réel", "vraiment."]);

function Word({
  word,
  range,
  progress,
}: {
  word: string;
  range: [number, number];
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const y = useTransform(progress, range, [8, 0]);
  return (
    <motion.span
      style={{ opacity, y }}
      className={`mr-[0.25em] inline-block ${HIGHLIGHT.has(word) ? "text-accent-light" : ""}`}
    >
      {word}
    </motion.span>
  );
}

const details = [
  { label: "Basé à", value: "Troyes (10) · Audincourt (25)" },
  { label: "École", value: "UTT — branche ISI" },
  { label: "Langues", value: "Français · Turc · Anglais B1" },
  { label: "Mobilité", value: "Permis B — véhiculé" },
];

export default function About() {
  const ref = useRef<HTMLParagraphElement>(null);
  const [copied, setCopied] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });
  const words = STATEMENT.split(" ");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText("zek.akburak@gmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = "mailto:zek.akburak@gmail.com";
    }
  };

  return (
    <section id="about" className="relative px-5 py-32 sm:px-8 md:py-44 lg:px-12">
      <div className="mx-auto grid max-w-[1600px] gap-12 md:grid-cols-12">
        <div className="md:col-span-3">
          <FadeIn y={12} className="md:sticky md:top-32">
            <p className="flex items-center gap-3 font-mono text-xs text-muted">
              <span className="text-accent-light">01</span>
              <span className="h-px w-10 bg-border-hover" />
              À propos
            </p>
          </FadeIn>
        </div>

        <div className="md:col-span-9">
          <p
            ref={ref}
            className="text-[clamp(1.75rem,3.9vw,3.6rem)] font-medium leading-[1.12] tracking-[-0.035em] text-text"
          >
            <span className="sr-only">{STATEMENT}</span>
            <span aria-hidden>
              {words.map((w, i) => (
                <Word
                  key={i}
                  word={w}
                  progress={scrollYProgress}
                  range={[i / words.length, (i + 1) / words.length]}
                />
              ))}
            </span>
          </p>

          <dl className="mt-20 grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {details.map((d, i) => (
              <FadeIn key={d.label} delay={i * 0.08} y={20} className="h-full">
                <div className="group relative h-full overflow-hidden bg-bg p-6">
                  <span className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-accent to-ice transition-transform duration-700 ease-expo group-hover:scale-x-100" />
                  <dt className="mb-8 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                    {d.label}
                  </dt>
                  <dd className="text-lg font-medium tracking-tight text-text transition-transform duration-500 ease-expo group-hover:translate-x-1">
                    {d.value}
                  </dd>
                </div>
              </FadeIn>
            ))}
          </dl>

          <FadeIn delay={0.2} className="mt-6">
            <button
              type="button"
              onClick={copy}
              data-cursor={copied ? "Copié" : "Copier"}
              className="group flex w-full items-center justify-between gap-4 rounded-3xl border border-border px-6 py-5 text-left transition-colors duration-300 hover:border-accent"
            >
              <span>
                <span className="block font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                  Email
                </span>
                <span className="mt-2 block text-lg font-medium tracking-tight text-text sm:text-2xl">
                  zek.akburak@gmail.com
                </span>
              </span>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border-hover transition-colors duration-300 group-hover:border-accent group-hover:bg-accent">
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </span>
              <span className="sr-only" aria-live="polite">
                {copied ? "Adresse copiée" : ""}
              </span>
            </button>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
