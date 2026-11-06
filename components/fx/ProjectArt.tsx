"use client";

import { useId } from "react";

const ACCENT = "#5B5BFF";
const ICE = "#9EF0FF";
const PAPER = "#EEF0F5";

function wavePath(i: number) {
  const amp = 18 + i * 3;
  const y0 = 80 + i * 26;
  let d = `M -20 ${y0}`;
  for (let x = -20; x <= 420; x += 10) {
    const y = y0 + Math.sin((x / 400) * Math.PI * (2 + i * 0.35) + i) * amp;
    d += ` L ${x} ${y.toFixed(1)}`;
  }
  return d;
}

/** Visuels génératifs (SVG animé en CSS) — un motif par projet, aucune image requise. */
export default function ProjectArt({
  variant,
  className = "",
}: {
  variant: number;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const v = ((variant % 6) + 6) % 6;
  const bg = `bg-${uid}`;
  const sweep = `sw-${uid}`;

  return (
    <svg
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden
    >
      <defs>
        <radialGradient id={bg} cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor={ACCENT} stopOpacity="0.35" />
          <stop offset="60%" stopColor={ACCENT} stopOpacity="0.06" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={sweep} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={ICE} stopOpacity="0" />
          <stop offset="100%" stopColor={ICE} stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="#07070A" />
      <rect width="400" height="400" fill={`url(#${bg})`} />

      {v === 0 && (
        // Orbites — messagerie, canaux qui gravitent
        <g>
          {[60, 100, 140, 180].map((r, i) => (
            <g
              key={r}
              className={i % 2 ? "art-spin-rev" : "art-spin"}
              style={{ transformOrigin: "200px 200px", animationDuration: `${20 + i * 9}s` }}
            >
              <circle cx="200" cy="200" r={r} fill="none" stroke={PAPER} strokeOpacity="0.12" />
              <circle cx={200 + r} cy="200" r={4 - i * 0.5} fill={i % 2 ? ICE : ACCENT} />
              <circle cx={200 - r * 0.7} cy={200 + r * 0.7} r="2" fill={PAPER} fillOpacity="0.7" />
            </g>
          ))}
          <circle cx="200" cy="200" r="14" fill={ACCENT} />
          <circle cx="200" cy="200" r="26" fill="none" stroke={ICE} strokeOpacity="0.5" className="art-blink" />
        </g>
      )}

      {v === 1 && (
        // Ondes — langage naturel qui devient structure
        <g>
          {Array.from({ length: 9 }).map((_, i) => (
            <path
              key={i}
              d={wavePath(i)}
              fill="none"
              stroke={i === 4 ? ICE : i % 3 === 0 ? ACCENT : PAPER}
              strokeOpacity={i === 4 ? 0.9 : 0.25}
              strokeWidth={i === 4 ? 2 : 1}
              strokeDasharray={i === 4 ? "8 6" : undefined}
              className={i === 4 ? "art-dash" : undefined}
            />
          ))}
        </g>
      )}

      {v === 2 && (
        // Grille + chemin — maison pilotée, appareils reliés
        <g>
          {Array.from({ length: 11 }).map((_, row) =>
            Array.from({ length: 11 }).map((__, col) => (
              <circle
                key={`${row}-${col}`}
                cx={40 + col * 32}
                cy={40 + row * 32}
                r="1.6"
                fill={PAPER}
                fillOpacity="0.25"
              />
            ))
          )}
          <path
            d="M 40 328 L 136 328 L 136 232 L 232 232 L 232 136 L 296 136 L 296 72 L 360 72"
            fill="none"
            stroke={ICE}
            strokeWidth="2"
            className="art-draw"
          />
          {[
            [136, 328],
            [232, 232],
            [296, 136],
            [360, 72],
          ].map(([x, y], i) => (
            <g key={i}>
              <rect x={x - 9} y={y - 9} width="18" height="18" fill={ACCENT} rx="3" />
              <circle cx={x} cy={y} r="18" fill="none" stroke={ACCENT} strokeOpacity="0.6" className="art-blink" style={{ animationDelay: `${i * 0.4}s` }} />
            </g>
          ))}
        </g>
      )}

      {v === 3 && (
        // Radar — postes pilotés à distance
        <g>
          {[50, 100, 150, 190].map((r) => (
            <circle key={r} cx="200" cy="200" r={r} fill="none" stroke={PAPER} strokeOpacity="0.12" />
          ))}
          <line x1="10" y1="200" x2="390" y2="200" stroke={PAPER} strokeOpacity="0.08" />
          <line x1="200" y1="10" x2="200" y2="390" stroke={PAPER} strokeOpacity="0.08" />
          <g className="art-spin-fast" style={{ transformOrigin: "200px 200px" }}>
            <path d="M 200 200 L 390 200 A 190 190 0 0 0 334 66 Z" fill={`url(#${sweep})`} />
          </g>
          {[
            [280, 150],
            [130, 260],
            [250, 300],
            [150, 120],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="4" fill={i === 0 ? ICE : ACCENT} className="art-blink" style={{ animationDelay: `${i * 0.6}s` }} />
          ))}
        </g>
      )}

      {v === 4 && (
        // Égaliseur — signal, entraînement, données
        <g>
          {Array.from({ length: 22 }).map((_, i) => (
            <rect
              key={i}
              x={22 + i * 16.5}
              y={110}
              width="8"
              height="200"
              rx="4"
              fill={i % 5 === 0 ? ICE : ACCENT}
              fillOpacity={i % 5 === 0 ? 0.9 : 0.55}
              className="art-eq"
              style={{ animationDelay: `${(i * 0.13) % 1.8}s` }}
            />
          ))}
        </g>
      )}

      {v === 5 && (
        // Carrés imbriqués — labyrinthes, routage, structure
        <g>
          {Array.from({ length: 8 }).map((_, i) => {
            const s = 40 + i * 42;
            return (
              <rect
                key={i}
                x={200 - s / 2}
                y={200 - s / 2}
                width={s}
                height={s}
                fill="none"
                stroke={i === 3 ? ICE : PAPER}
                strokeOpacity={i === 3 ? 0.9 : 0.16}
                className={i % 2 ? "art-spin" : "art-spin-rev"}
                style={{ transformOrigin: "200px 200px", animationDuration: `${30 + i * 6}s` }}
              />
            );
          })}
          <rect x="190" y="190" width="20" height="20" fill={ACCENT} />
        </g>
      )}
    </svg>
  );
}
