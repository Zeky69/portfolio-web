"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import RevealText from "@/components/fx/RevealText";
import Magnetic from "@/components/fx/Magnetic";
import { easeExpo } from "@/lib/animations";

const EMAIL = "zek.akburak@gmail.com";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <section
      id="contact"
      data-stage="scatter"
      data-dim="0.55"
      data-side="right"
      data-c1="#5C8DFF"
      data-c2="#8FB8FF"
      className="relative flex min-h-[100svh] items-center px-5 py-28 sm:px-8 lg:px-12"
    >
      <div className="mx-auto w-full max-w-[1600px]">
        <h2
          className="max-w-[14ch] text-[clamp(3.2rem,9vw,9.5rem)] font-extrabold leading-[0.86] tracking-[-0.05em]"
        >
          <RevealText text="On construit" />{" "}
          <span className="font-serif font-normal italic tracking-[-0.02em] text-accent">
            <RevealText text="quelque chose ?" delay={0.15} />
          </span>
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: easeExpo, delay: 0.2 }}
          className="mt-14 max-w-2xl"
        >
          <p className="text-lg leading-relaxed text-muted-light">
            Stage, alternance, projet ou simple question : je réponds vite.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Magnetic strength={0.2}>
              <a
                href={`mailto:${EMAIL}`}
                data-cursor="Écrire"
                className="group inline-flex items-center gap-4 rounded-full bg-accent-dark py-4 pl-7 pr-4 text-[clamp(1rem,1.6vw,1.25rem)] font-semibold text-text"
              >
                {EMAIL}
                <span className="grid h-10 w-10 place-items-center rounded-full bg-bg text-accent transition-transform duration-500 ease-expo group-hover:rotate-45">
                  <ArrowUpRight size={18} />
                </span>
              </a>
            </Magnetic>
            <button
              onClick={copy}
              className="glass inline-flex h-[72px] items-center gap-2 rounded-full px-6 text-sm"
              aria-label="Copier l'adresse e-mail"
            >
              {copied ? <Check size={16} className="text-accent" /> : <Copy size={16} />}
              {copied ? "Copié" : "Copier"}
            </button>
          </div>

          <ul className="mt-12 grid max-w-md gap-px overflow-hidden rounded-2xl border border-border bg-border">
            {[
              { label: "GitHub", value: "github.com/Zeky69", href: "https://github.com/Zeky69" },
              { label: "Site", value: "codeky.fr", href: "https://codeky.fr" },
            ].map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between bg-bg/75 px-5 py-4 backdrop-blur transition-colors hover:bg-surface"
                >
                  <span className="label text-muted">{l.label}</span>
                  <span className="flex items-center gap-2 text-sm">
                    {l.value}
                    <ArrowUpRight size={14} className="text-muted transition-transform duration-500 ease-expo group-hover:rotate-45" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
