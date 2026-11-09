"use client";

import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLoop } from "./useLoop";
import { easeExpo } from "@/lib/animations";

type Colors = [string, string];
type Step = { title: string; text: string; Visual: (p: { c: Colors }) => React.ReactElement };

/* ============================================================
   Mise en page commune : une étape = un titre court + une animation
   ============================================================ */

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`glass relative overflow-hidden rounded-3xl p-5 sm:p-7 ${className}`}>{children}</div>
  );
}

function Steps({ steps, c }: { steps: Step[]; c: Colors }) {
  return (
    <ol className="space-y-6 sm:space-y-10">
      {steps.map((s, i) => (
        <motion.li
          key={s.title}
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.1, ease: easeExpo }}
          className="grid grid-cols-1 items-center gap-6 md:grid-cols-12 md:gap-10"
        >
          <div className={`min-w-0 md:col-span-4 ${i % 2 ? "md:order-2" : ""}`}>
            <h3 className="text-[clamp(1.7rem,3vw,2.6rem)] font-bold leading-[1.02] tracking-[-0.015em]">
              {s.title}
            </h3>
            <p className="mt-4 max-w-[38ch] leading-relaxed text-muted-light">{s.text}</p>
          </div>
          <div className={`min-w-0 md:col-span-8 ${i % 2 ? "md:order-1" : ""}`}>
            <s.Visual c={c} />
          </div>
        </motion.li>
      ))}
    </ol>
  );
}

const mono = "font-mono text-[11px] sm:text-[12px]";

/* ============================================================
   WALLCHANGE
   ============================================================ */

function WcInstall({ c }: { c: Colors }) {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(16, 380, ref);
  const n = 12;
  return (
    <Panel>
      <div ref={ref} className="grid grid-cols-[1fr_auto] items-center gap-6">
        <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
          {Array.from({ length: n }).map((_, i) => {
            const on = i < step;
            return (
              <div key={i} className="relative">
                <motion.div
                  animate={{ borderColor: on ? c[0] : "rgba(255,255,255,0.12)" }}
                  className="aspect-[16/10] rounded-md border-2 bg-[#0e0c14]"
                >
                  <motion.div
                    className="h-full w-full rounded-[3px]"
                    animate={{ opacity: on ? 1 : 0 }}
                    style={{ background: `linear-gradient(135deg, ${c[0]}55, transparent)` }}
                  />
                </motion.div>
                <motion.span
                  animate={{ backgroundColor: on ? "#7ee0a1" : "rgba(255,255,255,0.2)", scale: i === step - 1 ? [1, 1.8, 1] : 1 }}
                  className="absolute -right-1 -top-1 h-2 w-2 rounded-full"
                />
              </div>
            );
          })}
        </div>
        <div className="flex flex-col items-center gap-2">
          <motion.div
            animate={{ boxShadow: [`0 0 0px ${c[0]}`, `0 0 28px ${c[0]}`, `0 0 0px ${c[0]}`] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="textured grid h-16 w-16 place-items-center overflow-hidden rounded-2xl text-bg sm:h-20 sm:w-20"
            style={{ background: c[0] }}
          >
            <span className="font-mono text-[10px] font-bold">SERVER</span>
          </motion.div>
          <span className={`${mono} tabular text-muted-light`}>{Math.min(step, n)} / {n} connectés</span>
        </div>
      </div>
      <p className={`${mono} mt-5 truncate text-white/50`}>
        <span style={{ color: c[0] }}>$</span> curl -sL …/install.sh | bash
      </p>
    </Panel>
  );
}

const WC_CMDS = [
  { label: "send e1r4p7 sunset.jpg", targets: [1], fx: "wall" },
  { label: "confetti all", targets: [0, 1, 2], fx: "confetti" },
  { label: "marquee e1r2p3 \"salut\"", targets: [0], fx: "marquee" },
];

function WcRoute({ c }: { c: Colors }) {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(WC_CMDS.length, 3000, ref);
  const cmd = WC_CMDS[step];
  const ys = [18, 50, 82];
  return (
    <Panel>
      <div ref={ref}>
        <AnimatePresence mode="wait">
          <motion.p
            key={cmd.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`${mono} text-text`}
          >
            <span style={{ color: c[0] }}>$ wallchange</span> {cmd.label}
          </motion.p>
        </AnimatePresence>
        <div className="relative mt-4 aspect-[2/1]">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
            <line x1="16" y1="50" x2="44" y2="50" stroke="rgba(255,255,255,0.15)" strokeWidth="0.4" vectorEffect="non-scaling-stroke" />
            {ys.map((y) => (
              <path key={y} d={`M56 50 C 68 50, 66 ${y}, 78 ${y}`} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            ))}
          </svg>
          {/* Paquet panel → serveur */}
          <motion.span
            key={`a${step}`}
            className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: c[0], boxShadow: `0 0 14px ${c[0]}` }}
            initial={{ left: "16%" }}
            animate={{ left: "44%" }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          />
          {/* Serveur → postes ciblés */}
          {cmd.targets.map((ti) => (
            <motion.span
              key={`b${step}-${ti}`}
              className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: c[0], boxShadow: `0 0 14px ${c[0]}` }}
              initial={{ left: "56%", top: "50%", opacity: 0 }}
              animate={{ left: "78%", top: `${ys[ti]}%`, opacity: [0, 1, 1, 0] }}
              transition={{ duration: 0.8, delay: 0.75, ease: "easeInOut" }}
            />
          ))}
          <div className="absolute left-0 top-1/2 w-[16%] -translate-y-1/2 rounded-lg border border-white/15 bg-white/[0.04] py-2 text-center">
            <span className={`${mono} text-muted-light`}>CLI</span>
          </div>
          <div
            className="textured absolute left-[44%] top-1/2 grid w-[12%] -translate-y-1/2 place-items-center overflow-hidden rounded-lg py-2 text-bg"
            style={{ background: c[0] }}
          >
            <span className="font-mono text-[10px] font-bold">C</span>
          </div>
          {ys.map((y, i) => {
            const hitScreen = cmd.targets.includes(i);
            return (
              <div key={y} className="absolute left-[78%] w-[19%] -translate-y-1/2" style={{ top: `${y}%` }}>
                <div className="relative aspect-[16/9] overflow-hidden rounded-[4px] border-2 border-[#2a2633] bg-[#151320]">
                  <AnimatePresence>
                    {hitScreen && (
                      <motion.div
                        key={`${step}-${i}`}
                        className="absolute inset-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 1.45, duration: 0.3 }}
                        style={{
                          background:
                            cmd.fx === "wall"
                              ? "linear-gradient(180deg,#ffb347,#ff5f6d 55%,#3a1c71)"
                              : cmd.fx === "confetti"
                                ? `radial-gradient(circle at 20% 30%, ${c[0]} 0 2px, transparent 3px), radial-gradient(circle at 70% 60%, #7ee0a1 0 2px, transparent 3px), radial-gradient(circle at 45% 80%, ${c[1]} 0 2px, transparent 3px), radial-gradient(circle at 85% 20%, #B7A4FF 0 2px, transparent 3px), #151320`
                                : "#151320",
                        }}
                      >
                        {cmd.fx === "marquee" && (
                          <motion.span
                            className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap font-sans text-[10px] font-bold text-white"
                            initial={{ left: "100%" }}
                            animate={{ left: "-60%" }}
                            transition={{ delay: 1.45, duration: 1.4, ease: "linear" }}
                          >
                            salut
                          </motion.span>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Panel>
  );
}

function MiniScreen({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-md border-[3px] border-[#2a2633] bg-[#141221]">{children}</div>
      <p className={`${mono} mt-2 text-center text-muted`}>{label}</p>
    </div>
  );
}

function WcEffects({ c }: { c: Colors }) {
  const palette = [c[0], c[1], "#7ee0a1", "#B7A4FF", "#5CC8FF"];
  return (
    <Panel>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <MiniScreen label="confetti">
          {Array.from({ length: 14 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute h-1.5 w-1 rounded-[1px]"
              style={{ left: `${(i * 29) % 96}%`, background: palette[i % 5] }}
              animate={{ top: ["-10%", "110%"], rotate: [0, 300] }}
              transition={{ duration: 1.8 + (i % 4) * 0.3, repeat: Infinity, delay: (i % 6) * 0.25, ease: "linear" }}
            />
          ))}
        </MiniScreen>
        <MiniScreen label="dvdbounce">
          <motion.span
            className="absolute rounded-[3px] px-1 text-[9px] font-black text-bg"
            style={{ background: c[0] }}
            animate={{ left: ["0%", "70%", "30%", "0%"], top: ["0%", "45%", "80%", "0%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          >
            DVD
          </motion.span>
        </MiniScreen>
        <MiniScreen label="marquee">
          <motion.span
            className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap text-sm font-bold text-white"
            animate={{ left: ["100%", "-90%"] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
          >
            coucou le campus 👋
          </motion.span>
        </MiniScreen>
        <MiniScreen label="fireworks">
          {[0, 1].map((k) => (
            <motion.span
              key={k}
              className="absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                left: k ? "68%" : "32%",
                top: k ? "40%" : "55%",
                background: `radial-gradient(circle, transparent 35%, ${palette[k * 2]} 38%, transparent 42%)`,
              }}
              animate={{ scale: [0, 1.4], opacity: [1, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: k * 0.7 }}
            />
          ))}
        </MiniScreen>
        <MiniScreen label="invert">
          <motion.div
            className="absolute inset-0"
            style={{ background: "linear-gradient(135deg,#134e5e,#71b280)" }}
            animate={{ filter: ["invert(0)", "invert(0)", "invert(1)", "invert(1)", "invert(0)"] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </MiniScreen>
        <MiniScreen label="drunk">
          <motion.svg
            viewBox="0 0 12 18"
            className="absolute h-4 w-3"
            animate={{ left: ["20%", "60%", "35%", "75%", "20%"], top: ["30%", "60%", "20%", "55%", "30%"], rotate: [0, 25, -20, 15, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <path d="M1 1 L1 15 L4.5 11.5 L7 17 L9 16 L6.5 10.5 L11 10.5 Z" fill="white" stroke="black" strokeWidth="0.8" />
          </motion.svg>
        </MiniScreen>
      </div>
      <p className={`${mono} mt-4 text-center text-white/45`}>+ particules, clones de souris, faux terminal, nyancat, spotlight…</p>
    </Panel>
  );
}

function WcSecurity({ c }: { c: Colors }) {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(4, 1700, ref);
  const rows = [
    { token: "user", action: "send e1r4p7 photo.jpg", ok: true },
    { token: "user", action: "uninstall all", ok: false },
    { token: "admin", action: "uninstall e2r1p12", ok: true },
    { token: "admin", action: "update all → v1.0.166", ok: true },
  ];
  return (
    <Panel>
      <div ref={ref} className="space-y-2.5">
        {rows.map((r, i) => (
          <motion.div
            key={r.action}
            animate={{ opacity: i <= step ? 1 : 0.2, x: i === step ? 6 : 0 }}
            className={`${mono} flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3`}
          >
            <span
              className="rounded-md px-2 py-0.5 font-bold text-bg"
              style={{ background: r.token === "admin" ? c[0] : "#B7A4FF" }}
            >
              {r.token}
            </span>
            <span className="flex-1 truncate text-text">{r.action}</span>
            {i <= step && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={r.ok ? "text-[#7ee0a1]" : "text-[#ff6b6b]"}
              >
                {r.ok ? "✓ 200" : "✕ 403"}
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>
    </Panel>
  );
}

const WALLCHANGE: Step[] = [
  {
    title: "Un client sur chaque poste",
    text: "Une seule commande télécharge, compile et installe le client C. Il se lance à l'ouverture de session et garde une connexion WebSocket vers le serveur.",
    Visual: WcInstall,
  },
  {
    title: "Une commande, un poste ou tout le parc",
    text: "La CLI ou le panel appelle l'API du serveur, qui retrouve la bonne connexion et pousse l'ordre au client concerné — ou à tous.",
    Visual: WcRoute,
  },
  {
    title: "25 effets rendus à l'écran",
    text: "Le client dessine directement par-dessus le bureau : fond d'écran, confettis, logo DVD, texte défilant, écran inversé…",
    Visual: WcEffects,
  },
  {
    title: "Des droits, et des mises à jour à distance",
    text: "Token utilisateur pour les actions courantes, token admin pour désinstaller ou diffuser partout. Les clients se mettent à jour sur ordre du serveur.",
    Visual: WcSecurity,
  },
];

/* ============================================================
   RAG AGAINST THE MACHINE
   ============================================================ */

function RagChunk({ c }: { c: Colors }) {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(2, 2600, ref);
  const split = step === 1;
  const lines = [92, 70, 84, 60, 88, 76, 66, 90, 58, 80, 72, 86];
  return (
    <Panel>
      <div ref={ref} className="grid grid-cols-[1fr_auto] items-center gap-6">
        <div>
          <p className={`${mono} mb-3 text-muted-light`}>vllm/core/block_manager.py</p>
          <div className="space-y-1.5">
            {lines.map((w, i) => {
              const group = Math.floor(i / 3);
              return (
                <motion.div
                  key={i}
                  animate={{
                    x: split ? (group % 2 ? 18 : 0) : 0,
                    marginTop: split && i % 3 === 0 && i > 0 ? 14 : 0,
                    backgroundColor: split ? [c[0], c[1], "#B7A4FF", "#5CC8FF"][group] + "66" : "rgba(255,255,255,0.12)",
                  }}
                  transition={{ duration: 0.8, ease: easeExpo, delay: i * 0.02 }}
                  className="h-2 rounded-full"
                  style={{ width: `${w}%` }}
                />
              );
            })}
          </div>
        </div>
        <div className="text-center">
          <motion.p
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="tabular text-[clamp(1.8rem,4vw,3rem)] font-extrabold leading-none tracking-[-0.02em]"
            style={{ color: c[0] }}
          >
            {split ? "15 050" : "1 fichier"}
          </motion.p>
          <p className={`${mono} mt-2 text-muted`}>{split ? "chunks de 2 000 car." : "texte brut"}</p>
        </div>
      </div>
    </Panel>
  );
}

const RAG_WORDS = "how does vllm allocate the kv cache blocks for each sequence".split(" ");
const RAG_KEY = new Set(["vllm", "kv", "cache", "blocks"]);

function RagIndex({ c }: { c: Colors }) {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(3, 1800, ref);
  const pts = Array.from({ length: 34 }).map((_, i) => {
    const a = (i * 137.5 * Math.PI) / 180;
    const r = 18 + ((i * 53) % 30);
    return { x: Math.round((50 + Math.cos(a) * r) * 100) / 100, y: Math.round((50 + Math.sin(a) * r * 0.8) * 100) / 100 };
  });
  const near = [3, 11, 24];
  return (
    <div ref={ref} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Panel>
        <p className="label" style={{ color: c[0] }}>BM25 · les mots</p>
        <p className="mt-4 text-[15px] leading-loose">
          {RAG_WORDS.map((w, i) => (
            <motion.span
              key={i}
              animate={{
                backgroundColor: step >= 1 && RAG_KEY.has(w) ? `${c[0]}55` : "rgba(0,0,0,0)",
                color: step >= 1 && !RAG_KEY.has(w) ? "rgba(243,238,230,0.35)" : "rgba(243,238,230,1)",
              }}
              transition={{ delay: i * 0.04 }}
              className="mr-1.5 inline-block rounded px-1"
            >
              {w}
            </motion.span>
          ))}
        </p>
        <p className={`${mono} mt-4 text-white/45`}>+ chemin du fichier préfixé à chaque chunk</p>
      </Panel>
      <Panel>
        <p className="label" style={{ color: c[1] }}>Embeddings · le sens</p>
        <svg viewBox="0 0 100 100" className="mt-2 h-44 w-full" aria-hidden>
          {pts.map((p, i) => (
            <motion.circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={near.includes(i) && step === 2 ? 2.6 : 1.5}
              animate={{ fill: near.includes(i) && step === 2 ? c[1] : "rgba(255,255,255,0.35)" }}
            />
          ))}
          {step >= 1 && (
            <motion.circle cx="54" cy="46" r="3" fill={c[0]} initial={{ scale: 0 }} animate={{ scale: 1 }} />
          )}
          {step === 2 &&
            near.map((i) => (
              <motion.line
                key={i}
                x1="54"
                y1="46"
                x2={pts[i].x}
                y2={pts[i].y}
                stroke={c[1]}
                strokeWidth="0.6"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
              />
            ))}
        </svg>
      </Panel>
    </div>
  );
}

const BM = ["block_manager.py", "cache_engine.py", "scheduler.py", "config.py"];
const SEM = ["paged_attention.md", "block_manager.py", "cache_engine.py", "kv_cache.md"];
const FUSED = ["block_manager.py", "cache_engine.py", "paged_attention.md", "scheduler.py"];

function RagFuse({ c }: { c: Colors }) {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(2, 2800, ref);
  const List = ({ title, items, color, dim }: { title: string; items: string[]; color: string; dim?: boolean }) => (
    <div className={dim ? "opacity-50" : ""}>
      <p className="label mb-3" style={{ color }}>{title}</p>
      <ol className="space-y-1.5">
        {items.map((it, i) => (
          <motion.li
            layout
            key={it}
            className={`${mono} flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-2`}
          >
            <span className="text-white/40">{i + 1}</span>
            <span className="truncate">{it}</span>
          </motion.li>
        ))}
      </ol>
    </div>
  );
  return (
    <Panel>
      <div ref={ref} className="grid grid-cols-1 gap-5 sm:grid-cols-[1fr_1fr_auto_1.1fr] sm:items-center">
        <List title="BM25" items={BM} color={c[0]} dim={step === 1} />
        <List title="Sémantique" items={SEM} color={c[1]} dim={step === 1} />
        <motion.span
          animate={{ scale: step === 1 ? [1, 1.3, 1] : 1 }}
          className="hidden text-2xl text-muted sm:block"
        >
          →
        </motion.span>
        <div>
          <p className="label mb-3 text-text">Fusion RRF</p>
          <ol className="space-y-1.5">
            {FUSED.map((it, i) => (
              <motion.li
                key={it}
                animate={{ opacity: step === 1 ? 1 : 0.15, x: step === 1 ? 0 : -14 }}
                transition={{ delay: step === 1 ? i * 0.12 : 0, duration: 0.5 }}
                className={`${mono} flex items-center gap-2 rounded-lg border px-2.5 py-2`}
                style={{ borderColor: i < 2 ? `${c[0]}88` : "rgba(255,255,255,0.1)", background: i < 2 ? `${c[0]}18` : "rgba(255,255,255,0.03)" }}
              >
                <span className="text-white/40">{i + 1}</span>
                <span className="truncate">{it}</span>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
      <p className={`${mono} mt-5 text-white/45`}>score = Σ 1 / (k + rang) — un document bien classé des deux côtés remonte en tête</p>
    </Panel>
  );
}

function RagAnswer({ c }: { c: Colors }) {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(2, 4200, ref);
  const bars = [
    { label: "Doc · Recall@5", v: 82, min: 80 },
    { label: "Code · Recall@5", v: 70, min: 50 },
  ];
  return (
    <Panel>
      <div ref={ref}>
        <p className={`${mono} text-muted-light`}>Qwen3-0.6B · llama.cpp · CPU</p>
        <motion.p
          key={step}
          className="mt-3 text-[15px] leading-relaxed"
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{ duration: 2, ease: "linear" }}
        >
          Le KV cache est découpé en blocs de taille fixe alloués à la demande par le block manager
          <sup className="ml-1 rounded px-1 font-mono text-[10px] text-bg" style={{ background: c[0] }}>1</sup>, suivant le
          principe de PagedAttention
          <sup className="ml-1 rounded px-1 font-mono text-[10px] text-bg" style={{ background: c[1] }}>2</sup>.
        </motion.p>
        <div className="mt-7 space-y-4">
          {bars.map((b) => (
            <div key={b.label}>
              <div className={`${mono} mb-1.5 flex justify-between text-muted-light`}>
                <span>{b.label}</span>
                <span className="tabular text-text">{b.v} %</span>
              </div>
              <div className="relative h-2.5 rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${c[0]}, ${c[1]})` }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${b.v}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.4, ease: easeExpo }}
                />
                <span className="absolute -top-1 h-[18px] w-px bg-white/70" style={{ left: `${b.min}%` }} />
              </div>
            </div>
          ))}
          <p className={`${mono} text-white/40`}>│ = seuil demandé</p>
        </div>
      </div>
    </Panel>
  );
}

const RAG: Step[] = [
  {
    title: "Découper le dépôt",
    text: "Chaque fichier utile (.py, .md, .yaml…) est coupé en morceaux de 2 000 caractères, assez petits pour tenir dans le contexte du modèle.",
    Visual: RagChunk,
  },
  {
    title: "Indexer deux fois",
    text: "BM25 retrouve les mots exacts de la question ; les embeddings retrouvent les passages qui disent la même chose avec d'autres mots.",
    Visual: RagIndex,
  },
  {
    title: "Fusionner les classements",
    text: "Reciprocal Rank Fusion : un passage bien placé dans les deux listes passe devant. C'est ce qui fait grimper le code de 48 % à 70 %.",
    Visual: RagFuse,
  },
  {
    title: "Répondre, sources à l'appui",
    text: "Les meilleurs passages forment le contexte d'un Qwen3-0.6B local, qui rédige la réponse en citant ses sources.",
    Visual: RagAnswer,
  },
];

/* ============================================================
   THERIGHTONE
   ============================================================ */

const LANES = [
  { q: "Peugeot 208 · < 12 000 €", every: 2.2 },
  { q: "Golf 7 GTD · < 18 000 €", every: 3.1 },
  { q: "Clio V · < 30 000 km", every: 2.6 },
  { q: "Model 3 · LR · < 30 000 €", every: 3.6 },
];

function TroThreads({ c }: { c: Colors }) {
  return (
    <Panel>
      <div className="space-y-3">
        {LANES.map((l, i) => (
          <div key={l.q} className="flex items-center gap-3">
            <span className={`${mono} w-6 text-white/40`}>T{i + 1}</span>
            <div className="min-w-0 flex-1">
              <div className={`${mono} mb-1.5 flex justify-between`}>
                <span className="truncate text-text">{l.q}</span>
                <span className="text-white/40">{l.every.toFixed(1)} min</span>
              </div>
              <div className="relative h-1.5 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ background: c[0] }}
                  animate={{ width: ["0%", "100%"] }}
                  transition={{ duration: l.every, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </div>
            <motion.span
              className="h-2 w-2 rounded-full bg-[#7ee0a1]"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: l.every, repeat: Infinity }}
            />
          </div>
        ))}
      </div>
      <p className={`${mono} mt-5 text-white/45`}>Leboncoin · AutoScout24 — chaque recherche tourne dans son propre thread</p>
    </Panel>
  );
}

const ALERTS = [
  { car: "Peugeot 208 GT Line", y: "2019", km: "54 000 km", p: "11 490 €" },
  { car: "Golf 7 GTD", y: "2017", km: "98 000 km", p: "16 900 €" },
  { car: "Clio V Intens", y: "2021", km: "28 000 km", p: "13 200 €" },
];

function TroDiscord({ c }: { c: Colors }) {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(ALERTS.length + 1, 1600, ref);
  return (
    <Panel className="!bg-[#313338]/80">
      <div ref={ref}>
        <p className={`${mono} text-white/50`}># alertes-voitures</p>
        <div className="mt-4 min-h-[250px] space-y-3">
          <AnimatePresence>
            {ALERTS.slice(0, step).map((a) => (
              <motion.div
                key={a.car}
                initial={{ opacity: 0, x: 40, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: easeExpo }}
                className="flex gap-3"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[11px] font-black text-bg" style={{ background: c[0] }}>
                  TRO
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm">
                    <span className="font-semibold">TheRightOne</span>{" "}
                    <span className="rounded bg-[#5865F2] px-1 text-[9px] font-bold">BOT</span>{" "}
                    <span className="text-xs text-white/40">à l&apos;instant</span>
                  </p>
                  <div className="mt-1 rounded-md border-l-4 bg-[#2b2d31] px-3 py-2" style={{ borderColor: c[0] }}>
                    <p className="truncate text-sm font-semibold" style={{ color: c[1] }}>{a.car}</p>
                    <p className={`${mono} mt-0.5 text-white/60`}>
                      {a.y} · {a.km} · <span className="text-white">{a.p}</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <p className={`${mono} text-white/30`}>Annonces d&apos;exemple</p>
      </div>
    </Panel>
  );
}

function TroDashboard({ c }: { c: Colors }) {
  const hist = [3, 7, 12, 18, 22, 16, 11, 6, 3];
  const max = Math.max(...hist);
  const line = [4, 6, 5, 9, 8, 12, 10, 14, 13, 17, 15, 19];
  const pts = line.map((v, i) => `${(i / (line.length - 1)) * 100},${100 - (v / 20) * 90}`).join(" ");
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Panel>
        <p className="label text-muted">Distribution des prix</p>
        <div className="mt-5 flex h-36 items-end gap-1.5">
          {hist.map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-t-md"
              style={{ background: i === 4 ? c[0] : `${c[0]}55` }}
              initial={{ height: 0 }}
              whileInView={{ height: `${(h / max) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: easeExpo, delay: i * 0.06 }}
            />
          ))}
        </div>
        <div className={`${mono} mt-3 flex justify-between text-white/45`}>
          <span>8 k€</span>
          <span style={{ color: c[0] }}>médiane 12,4 k€</span>
          <span>19 k€</span>
        </div>
      </Panel>
      <Panel>
        <p className="label text-muted">Annonces · 30 jours</p>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="mt-5 h-36 w-full" aria-hidden>
          <motion.polyline
            points={pts}
            fill="none"
            stroke={c[1]}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
          />
        </svg>
        <p className={`${mono} mt-3 text-white/45`}>Export CSV · journaux téléchargeables</p>
      </Panel>
    </div>
  );
}

const THERIGHTONE: Step[] = [
  {
    title: "Des recherches qui tournent en continu",
    text: "Chaque recherche a son thread et son intervalle. Elles tournent en arrière-plan sans jamais bloquer l'interface.",
    Visual: TroThreads,
  },
  {
    title: "Nouvelle annonce → Discord",
    text: "Dès qu'une annonce inédite correspond, elle part sur le webhook Discord du compte. Chaque compte a ses recherches, ses résultats et ses alertes, isolés des autres.",
    Visual: TroDiscord,
  },
  {
    title: "Lire le marché",
    text: "Le tableau de bord suit les annonces sur 30 jours et la distribution des prix de chaque recherche : médiane, minimum, maximum.",
    Visual: TroDashboard,
  },
];

/* ============================================================
   CALL ME MAYBE
   ============================================================ */

function CmmProblem({ c }: { c: Colors }) {
  const outs = [
    { t: "Sure! The product of 3 and 5 is 15.", ok: false },
    { t: '{"name": "fn_multiply_numbers", "parameters": {"a": 3, "b": 5}}', ok: true },
    { t: '{"name": fn_multiply, "parameters": {a: 3, b: 5', ok: false },
  ];
  return (
    <Panel>
      <p className={`${mono} text-muted-light`}>Sans contrainte · même prompt, trois essais</p>
      <div className="mt-4 space-y-2.5">
        {outs.map((o, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.25, duration: 0.6 }}
            className={`${mono} flex items-center gap-3 rounded-xl border px-3 py-3`}
            style={{ borderColor: o.ok ? "rgba(126,224,161,0.4)" : `${c[0]}66`, background: o.ok ? "rgba(126,224,161,0.06)" : `${c[0]}10` }}
          >
            <span className={o.ok ? "text-[#7ee0a1]" : ""} style={o.ok ? undefined : { color: c[0] }}>
              {o.ok ? "✓" : "✕"}
            </span>
            <span className="truncate">{o.t}</span>
          </motion.div>
        ))}
      </div>
      <p className="mt-6 text-[clamp(2rem,5vw,3.6rem)] font-extrabold leading-none tracking-[-0.02em]" style={{ color: c[0] }}>
        ≈ 30 %
      </p>
      <p className={`${mono} mt-1 text-muted`}>de JSON valide avec un modèle de 0,6 milliard de paramètres</p>
    </Panel>
  );
}

const VOCAB = ['{"', "Sure", "The", "name", "15", "fn_", "Hello", "\\n", "3", ".0", "five", ",", "}", '"', "true", "def", ":", "a", "b", "#", "ok", "[", " ", "x"];
const DECODE = [
  { allowed: ['{"'], pick: '{"' },
  { allowed: ["name"], pick: "name" },
  { allowed: ['"', ":"], pick: '"' },
  { allowed: ["fn_"], pick: "fn_" },
  { allowed: ["3", ".0"], pick: "3" },
  { allowed: [".0", ","], pick: ".0" },
];

function CmmMask({ c }: { c: Colors }) {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(DECODE.length, 1500, ref);
  const cur = DECODE[step];
  return (
    <Panel>
      <div ref={ref}>
        <p className={`${mono} text-muted-light`}>Vocabulaire (~150 000 tokens) · étape {step + 1}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {VOCAB.map((t) => {
            const allowed = cur.allowed.includes(t);
            const picked = cur.pick === t;
            return (
              <motion.span
                key={t}
                animate={{
                  opacity: allowed ? 1 : 0.22,
                  scale: picked ? 1.15 : 1,
                  backgroundColor: picked ? c[0] : allowed ? `${c[0]}30` : "rgba(255,255,255,0.04)",
                  color: picked ? "#0B0A10" : "#F3EEE6",
                }}
                transition={{ duration: 0.35 }}
                className={`${mono} rounded-md border border-white/10 px-2 py-1 ${allowed ? "" : "line-through"}`}
              >
                {t === " " ? "␣" : t}
              </motion.span>
            );
          })}
        </div>
        <div className={`${mono} mt-5 flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-3`}>
          <span className="text-white/40">sortie</span>
          <span className="truncate">
            {DECODE.slice(0, step + 1).map((d, i) => (
              <motion.span key={i} initial={{ color: c[0] }} animate={{ color: "#F3EEE6" }} transition={{ duration: 0.8 }}>
                {d.pick}
              </motion.span>
            ))}
            <span className="caret ml-0.5 inline-block h-3 w-1.5 translate-y-0.5" style={{ background: c[0] }} />
          </span>
        </div>
        <p className={`${mono} mt-4 text-white/45`}>logits des tokens interdits → −∞, puis on prend le meilleur restant</p>
      </div>
    </Panel>
  );
}

function CmmResult({ c }: { c: Colors }) {
  const rows = [
    { label: "Prompt seul", v: 30 },
    { label: "Décodage contraint", v: 100 },
  ];
  return (
    <Panel>
      <div className="space-y-6">
        {rows.map((r, i) => (
          <div key={r.label}>
            <div className={`${mono} mb-2 flex justify-between`}>
              <span className="text-muted-light">{r.label}</span>
              <span className="tabular font-bold" style={{ color: i ? c[0] : undefined }}>{r.v} %</span>
            </div>
            <div className="h-4 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className={`h-full rounded-full ${i ? "textured overflow-hidden" : ""}`}
                style={{ background: i ? c[0] : "rgba(255,255,255,0.35)" }}
                initial={{ width: 0 }}
                whileInView={{ width: `${r.v}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.6, ease: easeExpo, delay: i * 0.3 }}
              />
            </div>
          </div>
        ))}
      </div>
      <pre className={`${mono} mt-6 overflow-x-auto rounded-xl border border-white/10 bg-black/30 p-4 leading-relaxed`}>
{`{
  "name": "fn_multiply_numbers",
  "parameters": { "a": 3.0, "b": 5.0 }
}`}
      </pre>
    </Panel>
  );
}

const CALLMEMAYBE: Step[] = [
  {
    title: "Un petit modèle bavarde",
    text: "On demande un appel de fonction, le modèle répond par une phrase, ou par un JSON cassé. Deux fois sur trois, la sortie est inutilisable.",
    Visual: CmmProblem,
  },
  {
    title: "Masquer avant de choisir",
    text: "À chaque token, on calcule ce qui est autorisé à cet endroit du schéma et on interdit tout le reste. Le modèle choisit, mais seulement parmi les tokens valides.",
    Visual: CmmMask,
  },
  {
    title: "Valide par construction",
    text: "Plus besoin d'espérer : la sortie respecte le schéma à chaque fois, sur le même modèle de 0,6 milliard de paramètres.",
    Visual: CmmResult,
  },
];

/* ============================================================ */

const EXPLAINERS: Record<string, Step[]> = {
  wallchange: WALLCHANGE,
  "rag-against-the-machine": RAG,
  therightone: THERIGHTONE,
  "call-me-maybe": CALLMEMAYBE,
};

export default function Explainer({ slug, colors }: { slug: string; colors: Colors }) {
  const steps = EXPLAINERS[slug];
  if (!steps) return null;
  return (
    <section className="mt-28 md:mt-40">
      <p className="label flex items-center gap-3 text-muted">
        <span style={{ color: colors[0] }}>●</span>
        Comment ça marche
      </p>
      <h2
        className="mb-14 mt-5 text-[clamp(2.4rem,6vw,5.5rem)] font-extrabold leading-[0.9] tracking-[-0.025em] md:mb-20"
        style={{ fontVariationSettings: '"wdth" 85' }}
      >
        En {steps.length} <span className="font-serif font-normal italic tracking-[-0.02em]" style={{ color: colors[1] }}>étapes.</span>
      </h2>
      <Steps steps={steps} c={colors} />
    </section>
  );
}
