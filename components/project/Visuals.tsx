"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import type { Visual } from "@/lib/projects";

/** Boucle de « scènes » jouée seulement quand le visuel est à l'écran. */
function useLoop(steps: number, interval: number, ref: React.RefObject<HTMLElement | null>) {
  const inView = useInView(ref, { margin: "0px 0px -10% 0px" });
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setStep((s) => (s + 1) % steps), interval);
    return () => clearInterval(id);
  }, [inView, steps, interval]);
  return step;
}

function Window({ title, children, dark = "#0E0C14" }: { title: string; children: React.ReactNode; dark?: string }) {
  return (
    <div style={{ background: dark }} className="font-mono text-[11px] leading-relaxed text-[#d9d4e0] sm:text-[12.5px]">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 truncate text-[10.5px] text-white/45">{title}</span>
      </div>
      {children}
    </div>
  );
}

/* ---------------- WallChange : CLI + écran pilotés ---------------- */

const WALL_SCRIPT: { cmd: string; out: string[]; screen: number }[] = [
  {
    cmd: "wallchange list",
    out: ["● e1r2p3   v1.0.166  online", "● e1r4p7   v1.0.166  online", "● e2r1p12  v1.0.165  online"],
    screen: 0,
  },
  { cmd: "wallchange send e1r4p7 ./sunset.jpg", out: ["✓ fond d'écran appliqué · 212 ms"], screen: 1 },
  { cmd: "wallchange confetti all", out: ["✓ diffusé à 37 postes"], screen: 2 },
  { cmd: "wallchange marquee e1r4p7 \"bonjour 👋\"", out: ["✓ marquee lancé"], screen: 3 },
];

const WALLPAPERS = [
  "linear-gradient(160deg,#1d2433,#0f1320)",
  "linear-gradient(180deg,#ffb347 0%,#ff5f6d 55%,#3a1c71 100%)",
  "linear-gradient(160deg,#1d2433,#0f1320)",
  "linear-gradient(200deg,#134e5e,#71b280)",
];

function Terminal() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(WALL_SCRIPT.length, 3200, ref);
  const shown = WALL_SCRIPT.slice(0, step + 1).slice(-3);
  const screen = WALL_SCRIPT[step].screen;

  return (
    <div ref={ref} className="grid sm:grid-cols-[1.25fr_1fr]">
      <Window title="zakburak@42 — wallchange">
        <div className="h-[230px] space-y-2 overflow-hidden px-4 py-4 sm:h-[260px]">
          {shown.map((s, i) => (
            <motion.div
              key={s.cmd + step + i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <p>
                <span className="text-[#FFB020]">$</span> {s.cmd}
                {i === shown.length - 1 && <span className="caret ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 bg-[#FFB020]" />}
              </p>
              {s.out.map((o, j) => (
                <motion.p
                  key={o}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + j * 0.15 }}
                  className={o.startsWith("✓") ? "pl-3 text-[#7ee0a1]" : "pl-3 text-white/60"}
                >
                  {o}
                </motion.p>
              ))}
            </motion.div>
          ))}
        </div>
      </Window>
      <div className="relative hidden items-center justify-center bg-[#0E0C14] p-5 sm:flex">
        <div className="w-full">
          <div className="relative aspect-[16/10] overflow-hidden rounded-md border-[5px] border-[#2a2633]">
            <motion.div
              className="absolute inset-0"
              animate={{ background: WALLPAPERS[screen] }}
              transition={{ duration: 0.8 }}
            />
            <AnimatePresence>
              {screen === 2 &&
                Array.from({ length: 26 }).map((_, i) => (
                  <motion.span
                    key={i}
                    className="absolute h-1.5 w-1 rounded-[1px]"
                    style={{
                      left: `${(i * 37) % 100}%`,
                      background: ["#FFB020", "#FF4D2E", "#7ee0a1", "#B7A4FF", "#5CC8FF"][i % 5],
                    }}
                    initial={{ top: "-10%", rotate: 0, opacity: 1 }}
                    animate={{ top: "110%", rotate: 360 + i * 20 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.6 + (i % 5) * 0.25, delay: (i % 7) * 0.12, ease: "easeIn" }}
                  />
                ))}
              {screen === 3 && (
                <motion.p
                  key="marquee"
                  className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap font-sans text-lg font-bold text-white"
                  initial={{ left: "100%" }}
                  animate={{ left: "-80%" }}
                  transition={{ duration: 3, ease: "linear" }}
                >
                  bonjour 👋
                </motion.p>
              )}
            </AnimatePresence>
            <span className="absolute bottom-1.5 right-2 text-[9px] text-white/50">e1r4p7</span>
          </div>
          <div className="mx-auto h-5 w-10 bg-[#2a2633]" />
          <div className="mx-auto h-1.5 w-24 rounded-full bg-[#2a2633]" />
        </div>
      </div>
    </div>
  );
}

/* ---------------- RAG : recherche hybride ---------------- */

const QUESTIONS = [
  {
    q: "Comment vLLM alloue la mémoire du KV cache ?",
    hits: [
      ["vllm/core/block_manager.py", 0.91],
      ["docs/design/paged_attention.md", 0.87],
      ["vllm/worker/cache_engine.py", 0.79],
    ],
  },
  {
    q: "Où est défini le scheduler des requêtes ?",
    hits: [
      ["vllm/core/scheduler.py", 0.94],
      ["vllm/engine/llm_engine.py", 0.81],
      ["docs/design/arch_overview.md", 0.72],
    ],
  },
];

function Pipeline() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(QUESTIONS.length, 4200, ref);
  const cur = QUESTIONS[step];
  const node = "rounded-lg border border-white/15 bg-white/[0.04] px-3 py-2 text-center";

  return (
    <div ref={ref}>
      <Window title="rag — question → sources → réponse">
        <div className="px-4 py-5 sm:px-6">
          <AnimatePresence mode="wait">
            <motion.p
              key={cur.q}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="text-[#2EE6A0]"
            >
              ? {cur.q}
            </motion.p>
          </AnimatePresence>

          <div className="relative mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-[10.5px] sm:text-[11.5px]">
            <div className="space-y-2">
              <div className={node}>BM25 · mots exacts</div>
              <div className={node}>Embeddings · sens</div>
            </div>
            <svg width="44" height="70" viewBox="0 0 44 70" className="text-[#5CC8FF]" aria-hidden>
              <path className="flow" d="M0 16 C 22 16, 22 35, 44 35" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <path className="flow" d="M0 54 C 22 54, 22 35, 44 35" fill="none" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            <div className="space-y-2">
              <div className={`${node} border-[#2EE6A0]/50 text-[#2EE6A0]`}>Fusion RRF</div>
              <div className={node}>Qwen3-0.6B</div>
            </div>
          </div>

          <div className="mt-5 space-y-1.5">
            {cur.hits.map(([file, score], i) => (
              <motion.div
                key={file as string}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.15 }}
                className="flex items-center gap-3"
              >
                <span className="w-4 text-white/40">{i + 1}</span>
                <span className="flex-1 truncate">{file}</span>
                <span className="h-1 w-16 overflow-hidden rounded-full bg-white/10 sm:w-24">
                  <motion.span
                    className="block h-full bg-gradient-to-r from-[#2EE6A0] to-[#5CC8FF]"
                    initial={{ width: 0 }}
                    animate={{ width: `${(score as number) * 100}%` }}
                    transition={{ delay: 0.4 + i * 0.15, duration: 0.7 }}
                  />
                </span>
                <span className="tabular w-8 text-right text-white/60">{(score as number).toFixed(2)}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </Window>
    </div>
  );
}

/* ---------------- TheRightOne : radar d'annonces ---------------- */

const LISTINGS = [
  { car: "Peugeot 208 · 2019", km: "54 000 km", price: "11 490 €", src: "Leboncoin" },
  { car: "Golf 7 GTD · 2017", km: "98 000 km", price: "16 900 €", src: "AutoScout24" },
  { car: "Clio V · 2021", km: "31 000 km", price: "13 200 €", src: "Leboncoin" },
];

function Radar() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(LISTINGS.length, 2600, ref);

  return (
    <div ref={ref} className="grid bg-[#0D1220] sm:grid-cols-[1fr_1.2fr]">
      <div className="relative flex items-center justify-center p-6">
        <svg viewBox="0 0 200 200" className="w-full max-w-[220px]" aria-hidden>
          {[30, 55, 80, 96].map((r) => (
            <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="#4D8DFF" strokeOpacity="0.25" />
          ))}
          <line x1="4" y1="100" x2="196" y2="100" stroke="#4D8DFF" strokeOpacity="0.15" />
          <line x1="100" y1="4" x2="100" y2="196" stroke="#4D8DFF" strokeOpacity="0.15" />
          <defs>
            <linearGradient id="sweep" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#4D8DFF" stopOpacity="0" />
              <stop offset="1" stopColor="#4D8DFF" stopOpacity="0.55" />
            </linearGradient>
          </defs>
          <g className="sweep">
            <path d="M100 100 L196 100 A96 96 0 0 0 183 52 Z" fill="url(#sweep)" />
          </g>
          {[
            [140, 70],
            [62, 132],
            [120, 150],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i === step ? 5 : 3} fill={i === step ? "#A9C2FF" : "#4D8DFF"}>
              <animate attributeName="opacity" values="1;0.3;1" dur="1.6s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </svg>
      </div>
      <div className="space-y-2 p-4 font-mono text-[11px] sm:p-5 sm:text-[12px]">
        <p className="label mb-3 text-[#A9C2FF]/70">Nouvelles annonces</p>
        {LISTINGS.map((l, i) => (
          <motion.div
            key={l.car}
            animate={{
              opacity: i <= step ? 1 : 0.25,
              borderColor: i === step ? "rgba(77,141,255,0.7)" : "rgba(255,255,255,0.08)",
            }}
            className="rounded-lg border bg-white/[0.03] px-3 py-2.5 text-[#dfe6f5]"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="truncate font-sans text-[13px] font-semibold">{l.car}</span>
              <span className="tabular shrink-0 text-[#A9C2FF]">{l.price}</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-white/45">
              <span>
                {l.km} · {l.src}
              </span>
              {i === step && (
                <motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className="text-[#7ee0a1]">
                  → Discord
                </motion.span>
              )}
            </div>
          </motion.div>
        ))}
        <p className="pt-1 text-[10px] text-white/30">Exemple illustratif</p>
      </div>
    </div>
  );
}

/* ---------------- Call Me Maybe : décodage contraint ---------------- */

const TOKENS: { t: string; rejected?: string[] }[] = [
  { t: '{"name": "', rejected: ["Sure", "The"] },
  { t: "fn_multiply", rejected: ["fn_add", "15"] },
  { t: '_numbers", ' },
  { t: '"parameters": {"a": ', rejected: ["three"] },
  { t: "3.0", rejected: ["x", "\""] },
  { t: ', "b": ' },
  { t: "5.0", rejected: ["five"] },
  { t: "}}" },
];

function JsonDecode() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(TOKENS.length + 3, 700, ref);
  const n = Math.min(step, TOKENS.length);
  const cur = TOKENS[Math.min(step, TOKENS.length - 1)];

  return (
    <div ref={ref}>
      <Window title="call-me-maybe — Qwen3-0.6B">
        <div className="px-4 py-5 sm:px-6">
          <p className="text-white/50">prompt</p>
          <p className="mt-1 text-[#FFB020]">« Quel est le produit de 3 et 5 ? »</p>
          <p className="mt-5 text-white/50">sortie</p>
          <p className="mt-1 min-h-[3.2em] break-all text-[13px] sm:text-[14px]">
            {TOKENS.slice(0, n).map((tok, i) => (
              <motion.span
                key={i}
                initial={{ backgroundColor: "rgba(255,61,139,0.45)" }}
                animate={{ backgroundColor: "rgba(255,61,139,0)" }}
                transition={{ duration: 0.8 }}
                className="rounded-[3px]"
              >
                {tok.t}
              </motion.span>
            ))}
            {step < TOKENS.length && <span className="caret ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 bg-[#FF3D8B]" />}
          </p>
          <div className="mt-5 flex min-h-[1.8em] flex-wrap items-center gap-2">
            <span className="text-white/50">masqués</span>
            {step < TOKENS.length &&
              (cur.rejected ?? []).map((r) => (
                <motion.span
                  key={r + step}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded border border-[#FF3D8B]/40 px-1.5 text-[#FF3D8B] line-through"
                >
                  {r}
                </motion.span>
              ))}
            {step >= TOKENS.length && <span className="text-[#7ee0a1]">✓ JSON valide · schéma respecté</span>}
          </div>
        </div>
      </Window>
    </div>
  );
}

export default function ProjectVisual({ visual }: { visual: Visual }) {
  if (visual === "terminal") return <Terminal />;
  if (visual === "pipeline") return <Pipeline />;
  if (visual === "radar") return <Radar />;
  return <JsonDecode />;
}
