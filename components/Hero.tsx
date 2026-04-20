"use client";

import { motion } from "framer-motion";
import { Github, ArrowRight, Mail } from "lucide-react";

// ─── Terminal block ──────────────────────────────────────────────────────────
function Terminal() {
  const lines: Array<{
    kind: "prompt" | "out" | "blank";
    text?: string;
    value?: string;
    tone?: "muted" | "accent" | "text";
  }> = [
    { kind: "prompt", text: "whoami" },
    { kind: "out", text: "  Zekeriya Akburak — Audincourt, FR (25)" },
    { kind: "out", text: "  Fullstack & IA · École 42 Mulhouse", tone: "muted" },
    { kind: "blank" },
    { kind: "prompt", text: "cat stack.txt" },
    { kind: "out", text: "  lang    ", value: "Python · TypeScript · C · Java" },
    { kind: "out", text: "  ai      ", value: "PyTorch · TensorFlow · LangChain" },
    { kind: "out", text: "  web     ", value: "Next.js · FastAPI · PostgreSQL" },
    { kind: "blank" },
    { kind: "prompt", text: "status" },
    { kind: "out", text: "  ● available for alternance 2025→2029", tone: "accent" },
    { kind: "out", text: "  ● cursus 42 in progress", tone: "muted" },
    { kind: "out", text: "  ● 10+ projects on github.com/Zeky69", tone: "muted" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-2xl border border-border bg-surface/80 backdrop-blur-sm shadow-[0_20px_60px_-30px_rgba(211,95,62,0.25)]"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#363640]" />
          <span className="w-3 h-3 rounded-full bg-[#363640]" />
          <span className="w-3 h-3 rounded-full bg-accent/80" />
        </div>
        <span className="font-mono text-[11px] text-muted tracking-wide">
          zeky@42mulhouse: ~
        </span>
        <span className="w-12" />
      </div>

      {/* Body */}
      <div className="px-5 py-5 font-mono text-[13px] leading-relaxed">
        {lines.map((line, i) => {
          if (line.kind === "blank") {
            return <div key={i} className="h-3" />;
          }
          if (line.kind === "prompt") {
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.5 + i * 0.08 }}
                className="flex gap-2"
              >
                <span className="text-accent select-none">$</span>
                <span className="text-text">{line.text}</span>
              </motion.div>
            );
          }
          const toneClass =
            line.tone === "accent"
              ? "text-accent"
              : line.tone === "text"
                ? "text-text"
                : "text-muted-light";
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.55 + i * 0.08 }}
              className={toneClass}
            >
              {line.value ? (
                <>
                  <span className="text-muted">{line.text}</span>
                  <span className="text-text">{line.value}</span>
                </>
              ) : (
                line.text
              )}
            </motion.div>
          );
        })}

        {/* Prompt vivant */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="flex items-center gap-2 mt-3"
        >
          <span className="text-accent select-none">$</span>
          <motion.span
            aria-hidden
            animate={{ opacity: [1, 1, 0, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
            className="inline-block w-[8px] h-[15px] bg-text align-middle"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Fact (stat) ─────────────────────────────────────────────────────────────
function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted mb-1">
        {label}
      </span>
      <span className="text-text text-sm font-medium">{value}</span>
    </div>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────
export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Grille très discrète, fade vers les bords */}
      <div className="absolute inset-0 grid-bg grid-mask pointer-events-none" />
      {/* Ligne horizontale fine en haut — marque éditoriale */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      {/* Fade bas */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* ── LEFT : identité ── */}
          <div className="lg:col-span-7">
            {/* Status pill */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 text-[11px] font-mono text-muted-light border border-border bg-surface/60 px-3 py-1.5 rounded-full mb-10"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
              </span>
              <span className="text-accent">disponible</span>
              <span className="text-muted">·</span>
              <span>alternance · 2025—2029</span>
            </motion.div>

            {/* Nom */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-heading font-bold leading-[0.88] tracking-[-0.02em] mb-6"
            >
              <span className="block text-5xl sm:text-6xl lg:text-[5.5rem] text-text">
                Zekeriya
              </span>
              <span className="block text-5xl sm:text-6xl lg:text-[5.5rem] text-accent">
                Akburak<span className="text-text/40">.</span>
              </span>
            </motion.h1>

            {/* Rôle — phrase directe */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-lg sm:text-xl text-muted-light font-light mb-3 max-w-xl leading-snug"
            >
              Développeur{" "}
              <span className="text-text font-medium">Fullstack &amp; IA</span>
              . Je construis des systèmes qui raisonnent, qui parlent, et qui
              tiennent en prod.
            </motion.p>

            {/* Bio dense */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="text-muted text-sm leading-relaxed mb-10 max-w-lg"
            >
              École 42 Mulhouse · BUT Informatique IUT Nord-Franche-Comté · 1
              an sur le terrain au SDIS 25 (Optimops) et au laboratoire
              FEMTO-ST (apprentissage fédéré).
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="flex flex-wrap gap-3 mb-14"
            >
              <a
                href="#projects"
                className="group inline-flex items-center gap-2 text-sm font-medium px-5 py-3 rounded-lg bg-accent text-bg hover:bg-accent-light transition-colors duration-200"
              >
                Voir les projets
                <ArrowRight
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-sm font-medium px-5 py-3 rounded-lg border border-border text-text hover:border-accent hover:text-accent transition-colors duration-200"
              >
                <Mail size={14} />
                Me contacter
              </a>
              <a
                href="https://github.com/Zeky69"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium px-5 py-3 rounded-lg border border-border text-text hover:border-accent hover:text-accent transition-colors duration-200"
              >
                <Github size={14} />
                github.com/Zeky69
              </a>
            </motion.div>

            {/* Facts row — remplace les counters animés */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.75 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-border"
            >
              <Fact label="Basé à" value="Audincourt (25)" />
              <Fact label="École" value="42 Mulhouse" />
              <Fact label="Langues" value="FR · TR · EN" />
              <Fact label="Projets" value="10+ shipped" />
            </motion.div>
          </div>

          {/* ── RIGHT : terminal ── */}
          <div className="lg:col-span-5 lg:pt-16">
            <Terminal />
          </div>
        </div>
      </div>
    </section>
  );
}
