/**
 * Formes que les particules peuvent dessiner.
 * Chaque générateur renvoie exactement `n` points (x, y, z) dans un repère
 * d'environ ±2,4 unités, centré sur l'origine.
 */
export type ShapeName =
  | "scatter"
  | "name"
  | "halo"
  | "wave"
  | "pill"
  | "podium"
  | "screen"
  | "constellation"
  | "radar"
  | "braces"
  | "helix"
  | "knot"
  | "galaxy"
  | LogoName;

/* ---------- Logos (parcours) ---------- */

/**
 * Logos des écoles / employeurs, échantillonnés depuis l'image puis extrudés :
 * face avant, face arrière, tranches sur les contours et détails intérieurs.
 *  - "alpha" : tout pixel opaque est de la matière
 *  - "dark"  : les pixels blancs sont des trous (lettres claires découpées dans un disque sombre)
 * `keep` : zones conservées (fractions x0, y0, x1, y1 de l'image) — on retire le petit texte,
 * illisible une fois en particules.
 */
type Rect = readonly [number, number, number, number];
type LogoDef = { src: string; mode: "alpha" | "dark"; keep?: readonly Rect[] };

export const LOGOS = {
  // Symbole + « utt » + « TROYES », sans la ligne « Université de technologie » trop fine
  "logo-utt": { src: "/logos/utt.png", mode: "alpha", keep: [[0, 0, 0.4, 1], [0.4, 0, 1, 0.66], [0.4, 0.8, 1, 1]] },
  "logo-42": { src: "/logos/42.svg", mode: "alpha" },
  "logo-sdis": { src: "/logos/sdis25.webp", mode: "alpha" },
  // « femto-st » + les quatre carrés, sans « Sciences & Technologies »
  "logo-femto": { src: "/logos/femto-st.svg", mode: "alpha", keep: [[0, 0, 1, 0.52], [0, 0.53, 0.41, 0.73]] },
  // La pastille « iut » seule : le nom complet, trop fin en particules, est déjà dans le texte
  "logo-iut": { src: "/logos/iut-nfc.png", mode: "dark", keep: [[0, 0, 0.32, 1]] },
} as const satisfies Record<string, LogoDef>;
export type LogoName = keyof typeof LOGOS;

const isLogo = (name: string): name is LogoName => name in LOGOS;

type LogoBitmap = { w: number; h: number; data: Uint8ClampedArray };
const logoBitmaps = new Map<LogoName, LogoBitmap>();
let logosPromise: Promise<void> | null = null;

/** Charge et rastérise les logos une seule fois (SVG compris), à ~720 px de côté max. */
export function preloadLogos() {
  if (logosPromise) return logosPromise;
  logosPromise = Promise.all(
    (Object.keys(LOGOS) as LogoName[]).map(async (name) => {
      try {
        const img = new Image();
        img.decoding = "async";
        img.src = LOGOS[name].src;
        await img.decode();
        const iw = img.naturalWidth || 400;
        const ih = img.naturalHeight || 400;
        const k = 720 / Math.max(iw, ih);
        const w = Math.round(iw * k);
        const h = Math.round(ih * k);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const cx = canvas.getContext("2d", { willReadFrequently: true });
        if (!cx) return;
        cx.imageSmoothingQuality = "high";
        cx.drawImage(img, 0, 0, w, h);
        logoBitmaps.set(name, { w, h, data: cx.getImageData(0, 0, w, h).data });
      } catch {
        /* logo indisponible : la forme de repli reste affichée */
      }
    })
  ).then(() => {});
  return logosPromise;
}

/**
 * Couleur affichable d'un pixel du logo : on garde la teinte mais on remonte la luminosité
 * (fond sombre + mélange additif), et le noir devient un gris clair légèrement froid.
 */
function visibleColor(r: number, g: number, b: number): [number, number, number] {
  const max = Math.max(r, g, b);
  if (max < 0.16) return [0.74, 0.77, 0.84];
  const k = Math.min(1 / max, 2.4);
  return [Math.min(1, r * k) * 0.96 + 0.04, Math.min(1, g * k) * 0.96 + 0.04, Math.min(1, b * k) * 0.96 + 0.04];
}

function logoPoints(n: number, bmp: LogoBitmap, def: LogoDef, seed: number) {
  const { mode, keep } = def;
  // rgb + poids « logo » (1 = la particule prend la couleur du logo et un éclat uniforme)
  const col = new Float32Array(n * 4);
  const { w, h, data } = bmp;
  const r = mulberry32(seed);
  const out = new Float32Array(n * 3);

  const lum = (i: number) => (0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2]) / 255;
  const ink = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) {
    if (data[i * 4 + 3] < 128) continue;
    if (keep) {
      const fx = (i % w) / w;
      const fy = Math.floor(i / w) / h;
      if (!keep.some(([x0, y0, x1, y1]) => fx >= x0 && fx <= x1 && fy >= y0 && fy <= y1)) continue;
    }
    if (mode === "dark" && lum(i) > 0.82) continue;
    ink[i] = 1;
  }

  // Pixels pleins, contours (→ tranches) et détails intérieurs (changements de couleur)
  const fill: number[] = [];
  const edge: number[] = [];
  const detail: number[] = [];
  let minX = w, maxX = 0, minY = h, maxY = 0;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      if (!ink[i]) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      fill.push(x, y);
      if (!ink[i - 1] || !ink[i + 1] || !ink[i - w] || !ink[i + w]) {
        edge.push(x, y);
        continue;
      }
      const l = lum(i);
      if (
        Math.abs(l - lum(i + 1)) > 0.13 ||
        Math.abs(l - lum(i + w)) > 0.13 ||
        Math.abs(l - lum(i - 1)) > 0.13 ||
        Math.abs(l - lum(i - w)) > 0.13
      )
        detail.push(x, y);
    }
  }
  if (fill.length === 0) return { pos: out, col };

  // Mise à l'échelle : tient dans une boîte de 2,75 × 2,3 unités (à gauche du texte), centrée
  const bw = maxX - minX + 1;
  const bh = maxY - minY + 1;
  const scale = Math.min(2.75 / bw, 2.3 / bh);
  const ox = (minX + maxX) / 2;
  const oy = (minY + maxY) / 2;
  const D = 0.17; // demi-épaisseur de l'extrusion

  // Les logos riches en dessins intérieurs (écusson) donnent plus de place aux détails
  const detailShare = detail.length < 200 ? 0 : Math.min(0.48, 0.12 + (detail.length / fill.length) * 1.2);
  // Moins de remplissage (et de face arrière, qui transparaît) quand il y a des détails à montrer
  // La face arrière transparaît (mélange additif) et brouille la lecture : on la garde discrète
  const front = Math.max(0.14, 0.6 - detailShare);
  const back = 0.06;
  const parts: [number, number[], "front" | "back" | "wall"][] = [
    [front, fill, "front"],
    [back, fill, "back"],
    [1 - front - back - detailShare, edge.length ? edge : fill, "wall"],
  ];
  if (detailShare > 0) parts.push([detailShare, detail, "front"]);

  // Couleur du pixel source (les faces arrière et tranches un peu plus sombres : effet de volume)
  const paint = (i: number, x: number, y: number, shade: number) => {
    const k = (y * w + x) * 4;
    const [cr, cg, cb] = visibleColor(data[k] / 255, data[k + 1] / 255, data[k + 2] / 255);
    col[i * 4] = cr * shade;
    col[i * 4 + 1] = cg * shade;
    col[i * 4 + 2] = cb * shade;
    col[i * 4 + 3] = 1;
  };

  let i = 0;
  for (const [weight, pool, face] of parts) {
    const count = Math.round(weight * n);
    const m = pool.length / 2;
    for (let k = 0; k < count && i < n; k++, i++) {
      const p = Math.floor(r() * m);
      const x = pool[p * 2] + (r() - 0.5);
      const y = pool[p * 2 + 1] + (r() - 0.5);
      const z = face === "front" ? D : face === "back" ? -D : (r() * 2 - 1) * D;
      out[i * 3] = (x - ox) * scale;
      out[i * 3 + 1] = -(y - oy) * scale;
      out[i * 3 + 2] = z + gauss(r) * 0.006;
      paint(i, pool[p * 2], pool[p * 2 + 1], face === "front" ? 1 : 0.75);
    }
  }
  for (; i < n; i++) {
    const p = Math.floor(r() * (fill.length / 2));
    out[i * 3] = (fill[p * 2] - ox) * scale;
    out[i * 3 + 1] = -(fill[p * 2 + 1] - oy) * scale;
    out[i * 3 + 2] = D;
    paint(i, fill[p * 2], fill[p * 2 + 1], 1);
  }
  // Mélange pour que le morph ne parte pas par paquets
  for (let a = n - 1; a > 0; a--) {
    const b = Math.floor(r() * (a + 1));
    for (let c = 0; c < 3; c++) {
      const t = out[a * 3 + c];
      out[a * 3 + c] = out[b * 3 + c];
      out[b * 3 + c] = t;
    }
    for (let c = 0; c < 4; c++) {
      const t = col[a * 4 + c];
      col[a * 4 + c] = col[b * 4 + c];
      col[b * 4 + c] = t;
    }
  }
  return { pos: out, col };
}

type Rng = () => number;

function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TAU = Math.PI * 2;

function gauss(r: Rng) {
  return Math.sqrt(-2 * Math.log(r() + 1e-9)) * Math.cos(TAU * r());
}

function onSphere(r: Rng, radius: number): [number, number, number] {
  const u = r() * 2 - 1;
  const t = r() * TAU;
  const s = Math.sqrt(1 - u * u);
  return [s * Math.cos(t) * radius, u * radius, s * Math.sin(t) * radius];
}

/** Remplit `out` en tirant chaque point dans un des sous-générateurs pondérés. */
function mix(
  n: number,
  seed: number,
  parts: [number, (r: Rng) => [number, number, number]][]
) {
  const r = mulberry32(seed);
  const out = new Float32Array(n * 3);
  const total = parts.reduce((s, p) => s + p[0], 0);
  let i = 0;
  for (const [w, fn] of parts) {
    const count = Math.round((w / total) * n);
    for (let k = 0; k < count && i < n; k++, i++) {
      const p = fn(r);
      out[i * 3] = p[0];
      out[i * 3 + 1] = p[1];
      out[i * 3 + 2] = p[2];
    }
  }
  // Arrondis : on complète avec la dernière partie
  const last = parts[parts.length - 1][1];
  for (; i < n; i++) {
    const p = last(r);
    out[i * 3] = p[0];
    out[i * 3 + 1] = p[1];
    out[i * 3 + 2] = p[2];
  }
  // Mélange : sinon les sous-formes se séparent par paquets pendant le morph
  for (let a = n - 1; a > 0; a--) {
    const b = Math.floor(r() * (a + 1));
    for (let c = 0; c < 3; c++) {
      const t = out[a * 3 + c];
      out[a * 3 + c] = out[b * 3 + c];
      out[b * 3 + c] = t;
    }
  }
  return out;
}

function rotX(p: [number, number, number], a: number): [number, number, number] {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c];
}
function rotZ(p: [number, number, number], a: number): [number, number, number] {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2]];
}

/* ---------- Texte échantillonné depuis un canvas ---------- */

function textPoints(
  n: number,
  lines: string[],
  font: string,
  worldWidth: number,
  seed: number
) {
  const W = 1400;
  const lineH = 300;
  const H = lineH * lines.length + 80;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const r = mulberry32(seed);
  const out = new Float32Array(n * 3);
  if (!ctx) return out;

  // Taille de police ajustée pour que la ligne la plus longue remplisse le canvas
  let size = 280;
  ctx.font = `800 ${size}px ${font}`;
  const widest = Math.max(...lines.map((l) => ctx.measureText(l).width));
  size = Math.min(size, (size * (W * 0.94)) / widest);
  ctx.font = `800 ${size}px ${font}`;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  lines.forEach((l, i) => ctx.fillText(l, W / 2, 40 + lineH * (i + 0.5)));

  const data = ctx.getImageData(0, 0, W, H).data;
  const pts: number[] = [];
  const step = 3;
  for (let y = 0; y < H; y += step) {
    for (let x = 0; x < W; x += step) {
      if (data[(y * W + x) * 4 + 3] > 140) pts.push(x, y);
    }
  }
  const count = pts.length / 2;
  const scale = worldWidth / W;
  for (let i = 0; i < n; i++) {
    if (count === 0) break;
    const k = Math.floor(r() * count);
    const x = pts[k * 2] + (r() - 0.5) * step;
    const y = pts[k * 2 + 1] + (r() - 0.5) * step;
    out[i * 3] = (x - W / 2) * scale;
    out[i * 3 + 1] = -(y - H / 2) * scale;
    out[i * 3 + 2] = gauss(r) * 0.06;
  }
  return out;
}

/* ---------- Générateurs ---------- */

export type ShapeContext = { n: number; displayFont: string; monoFont: string; narrow: boolean };

const generators: Record<Exclude<ShapeName, LogoName>, (c: ShapeContext) => Float32Array> = {
  scatter: ({ n }) =>
    mix(n, 1, [
      [1, (r) => [(r() - 0.5) * 16, (r() - 0.5) * 9, (r() - 0.5) * 8 - 1]],
    ]),

  name: ({ n, displayFont, narrow }) =>
    textPoints(n, narrow ? ["ZEKERIYA", "AKBURAK"] : ["ZEKERIYA"], displayFont, narrow ? 4.4 : 9.6, 2),

  // Coquille autour de la forme 3D + anneau incliné
  // Un ruban de particules, torsadé, qui tourne doucement
  halo: ({ n }) =>
    mix(n, 3, [
      [
        1,
        (r) => {
          const u = r() * TAU;
          const th = 1.5 * u;
          const v = (r() * 2 - 1) * 0.62;
          const R = 2.2 + 0.12 * Math.sin(2 * u);
          const rad = v * Math.cos(th) + gauss(r) * 0.03;
          const z = v * Math.sin(th) + gauss(r) * 0.03 + 0.15 * Math.sin(3 * u);
          const p: [number, number, number] = [(R + rad) * Math.cos(u), (R + rad) * Math.sin(u), z];
          return rotZ(rotX(p, 1.0), -0.3);
        },
      ],
    ]),

  // Terrain ondulant vu en plongée
  wave: ({ n }) =>
    mix(n, 4, [
      [
        1,
        (r) => {
          const x = (r() - 0.5) * 6.2;
          const z = (r() - 0.5) * 4.2;
          const y =
            Math.sin(x * 1.3) * 0.35 + Math.cos(z * 1.7 + x * 0.6) * 0.3 + Math.sin(x * 0.4 + z * 2.4) * 0.12;
          return rotX([x, y, z], 0.55);
        },
      ],
    ]),

  // La « pastille » : capsule + égaliseur à l'intérieur
  pill: ({ n }) => {
    const L = 3.4;
    const R = 0.78;
    const cyl = TAU * R * L;
    const caps = 4 * Math.PI * R * R;
    return mix(n, 5, [
      [
        (cyl / (cyl + caps)) * 0.82,
        (r) => {
          const a = r() * TAU;
          return [(r() - 0.5) * L, Math.cos(a) * R, Math.sin(a) * R];
        },
      ],
      [
        (caps / (cyl + caps)) * 0.82,
        (r) => {
          const p = onSphere(r, R);
          return [p[0] + (p[0] > 0 ? L / 2 : -L / 2), p[1], p[2]];
        },
      ],
      [
        0.18,
        (r) => {
          const bar = Math.floor(r() * 9);
          const h = 0.18 + Math.abs(Math.sin(bar * 1.7)) * 0.42;
          return [-1.25 + bar * 0.13 + (r() - 0.5) * 0.05, (r() - 0.5) * h, R * 0.15 + (r() - 0.5) * 0.05];
        },
      ],
    ]);
  },

  // Podium à trois marches + médaille
  podium: ({ n }) => {
    const boxes = [
      { x: -1.25, h: 1.5 },
      { x: 0, h: 2.3 },
      { x: 1.25, h: 1.05 },
    ];
    const base = -1.45;
    const w = 1.08;
    const box = (r: Rng, b: { x: number; h: number }): [number, number, number] => {
      const face = r();
      let x = (r() - 0.5) * w;
      let y = r() * b.h;
      let z = (r() - 0.5) * w;
      if (face < 0.34) z = w / 2;
      else if (face < 0.5) z = -w / 2;
      else if (face < 0.66) x = (face < 0.58 ? -1 : 1) * (w / 2);
      else if (face < 0.86) y = b.h;
      else x = (r() < 0.5 ? -1 : 1) * (w / 2);
      return [b.x + x, base + y, z];
    };
    return mix(n, 6, [
      [0.3, (r) => box(r, boxes[0])],
      [0.38, (r) => box(r, boxes[1])],
      [0.22, (r) => box(r, boxes[2])],
      [
        0.1,
        (r) => {
          const p = onSphere(r, 0.32);
          return [p[0], base + 2.3 + 0.62 + p[1], p[2]];
        },
      ],
    ]);
  },

  // Écran : image ondulée, cadre, pied
  screen: ({ n }) => {
    const W = 4;
    const H = 2.5;
    return mix(n, 7, [
      [
        0.6,
        (r) => {
          const x = (r() - 0.5) * W * 0.94;
          const y = (r() - 0.5) * H * 0.9 + 0.35;
          return [x, y, Math.sin(x * 2.2 + y * 1.4) * 0.12];
        },
      ],
      [
        0.27,
        (r) => {
          const t = r();
          const side = Math.floor(r() * 4);
          const j = gauss(r) * 0.02;
          if (side === 0) return [(t - 0.5) * W, H / 2 + 0.35 + j, 0];
          if (side === 1) return [(t - 0.5) * W, -H / 2 + 0.35 + j, 0];
          if (side === 2) return [-W / 2 + j, (t - 0.5) * H + 0.35, 0];
          return [W / 2 + j, (t - 0.5) * H + 0.35, 0];
        },
      ],
      [0.05, (r) => [(r() - 0.5) * 0.22, -0.9 - r() * 0.75, (r() - 0.5) * 0.12]],
      [
        0.08,
        (r) => {
          const a = r() * TAU;
          const rad = Math.sqrt(r());
          return [Math.cos(a) * rad * 0.95, -1.68, Math.sin(a) * rad * 0.4];
        },
      ],
    ]);
  },

  // Documents (amas) reliés à une requête centrale
  constellation: ({ n }) => {
    const rr = mulberry32(8);
    const nodes = Array.from({ length: 8 }, (_, i) => {
      const a = (i / 8) * TAU + rr() * 0.4;
      const rad = 1.6 + rr() * 0.8;
      return {
        p: [Math.cos(a) * rad, Math.sin(a) * rad * 0.75, (rr() - 0.5) * 1.6] as [number, number, number],
        s: 0.18 + rr() * 0.22,
      };
    });
    return mix(n, 9, [
      [
        0.2,
        (r) => onSphere(r, 0.55 + gauss(r) * 0.02),
      ],
      [
        0.45,
        (r) => {
          const node = nodes[Math.floor(r() * nodes.length)];
          const p = onSphere(r, node.s * Math.cbrt(r()));
          return [node.p[0] + p[0], node.p[1] + p[1], node.p[2] + p[2]];
        },
      ],
      [
        0.35,
        (r) => {
          const node = nodes[Math.floor(r() * nodes.length)];
          const t = r();
          return [node.p[0] * t + gauss(r) * 0.015, node.p[1] * t + gauss(r) * 0.015, node.p[2] * t];
        },
      ],
    ]);
  },

  // Radar : anneaux, balayage, échos
  radar: ({ n }) => {
    const tilt = -1.0;
    return mix(n, 10, [
      [
        0.5,
        (r) => {
          const ring = 1 + Math.floor(r() * 5);
          const a = r() * TAU;
          const rad = ring * 0.46 + gauss(r) * 0.012;
          return rotX([Math.cos(a) * rad, Math.sin(a) * rad, 0], tilt);
        },
      ],
      [
        0.32,
        (r) => {
          const a = 0.35 + r() * 0.75;
          const rad = Math.sqrt(r()) * 2.3;
          return rotX([Math.cos(a) * rad, Math.sin(a) * rad, gauss(r) * 0.02], tilt);
        },
      ],
      [
        0.1,
        (r) => {
          const blips: [number, number][] = [
            [0.9, 0.6],
            [-1.2, 0.9],
            [1.5, -0.8],
            [-0.5, -1.6],
            [0.2, 1.7],
          ];
          const b = blips[Math.floor(r() * blips.length)];
          const p = onSphere(r, 0.09 * Math.cbrt(r()));
          return rotX([b[0] + p[0], b[1] + p[1], p[2]], tilt);
        },
      ],
      [0.08, (r) => rotX([gauss(r) * 0.01, gauss(r) * 0.01, r() * 1.6], tilt)],
    ]);
  },

  braces: ({ n, monoFont }) => textPoints(n, ["{ }"], monoFont, 5.8, 11),

  // Double hélice (ADN) — compétences
  helix: ({ n }) =>
    mix(n, 12, [
      [
        0.66,
        (r) => {
          const t = r();
          const strand = r() < 0.5 ? 0 : Math.PI;
          const a = t * TAU * 2.2 + strand;
          const y = (t - 0.5) * 4.6;
          return rotZ([Math.cos(a) * 0.95 + gauss(r) * 0.03, y, Math.sin(a) * 0.95 + gauss(r) * 0.03], 0.35);
        },
      ],
      [
        0.34,
        (r) => {
          const rung = Math.floor(r() * 26);
          const t = (rung + 0.5) / 26;
          const a = t * TAU * 2.2;
          const y = (t - 0.5) * 4.6;
          const s = r() * 2 - 1;
          return rotZ([Math.cos(a) * 0.95 * s, y, Math.sin(a) * 0.95 * s], 0.35);
        },
      ],
    ]),

  // Nœud torique — le parcours qui se boucle
  knot: ({ n }) =>
    mix(n, 13, [
      [
        1,
        (r) => {
          const t = r() * TAU;
          const p = 2;
          const q = 3;
          const R = 1.45;
          const cx = (R + 0.55 * Math.cos(q * t)) * Math.cos(p * t);
          const cy = (R + 0.55 * Math.cos(q * t)) * Math.sin(p * t);
          const cz = 0.55 * Math.sin(q * t);
          const s = onSphere(r, 0.2 * Math.sqrt(r()));
          return [cx + s[0], cy + s[1], cz + s[2]];
        },
      ],
    ]),

  // Galaxie spirale — contact
  galaxy: ({ n }) =>
    mix(n, 14, [
      [
        0.85,
        (r) => {
          const arm = Math.floor(r() * 3);
          const d = Math.pow(r(), 0.8) * 3.3;
          const a = (arm / 3) * TAU + d * 1.25 + gauss(r) * (0.2 + 0.15 / (d + 0.3));
          const p: [number, number, number] = [
            Math.cos(a) * d,
            gauss(r) * 0.08 * (1.2 - d / 3.3),
            Math.sin(a) * d,
          ];
          return rotZ(rotX(p, 0.42), -0.2);
        },
      ],
      [0.15, (r) => onSphere(r, 0.4 * Math.cbrt(r()))],
    ]),
};

const cache = new Map<string, Float32Array>();
const colorCache = new Map<string, Float32Array>();
const noColor = new Map<number, Float32Array>();

export function getShape(name: ShapeName, c: ShapeContext): Float32Array {
  const key = `${name}:${c.n}:${c.narrow ? 1 : 0}`;
  let s = cache.get(key);
  if (s) return s;
  if (isLogo(name)) {
    const bmp = logoBitmaps.get(name);
    // Logo pas encore chargé : forme de repli, non mise en cache
    if (!bmp) return getShape("knot", c);
    const res = logoPoints(c.n, bmp, LOGOS[name], 20 + Object.keys(LOGOS).indexOf(name));
    s = res.pos;
    colorCache.set(key, res.col);
  } else {
    s = generators[name](c);
  }
  cache.set(key, s);
  return s;
}

/** Couleur propre de chaque particule (rgb + poids), nulle pour les formes qui ne sont pas des logos. */
export function getShapeColors(name: ShapeName, c: ShapeContext): Float32Array {
  const key = `${name}:${c.n}:${c.narrow ? 1 : 0}`;
  if (isLogo(name)) {
    getShape(name, c);
    const col = colorCache.get(key);
    if (col) return col;
  }
  let z = noColor.get(c.n);
  if (!z) {
    z = new Float32Array(c.n * 4);
    noColor.set(c.n, z);
  }
  return z;
}

export const SHAPES = [...Object.keys(generators), ...Object.keys(LOGOS)] as ShapeName[];
