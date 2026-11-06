import type { ShapeName } from "@/lib/shapes";

export type Media =
  | { type: "video"; src: string; poster: string; alt: string; w: number; h: number }
  | { type: "image"; src: string; alt: string; w: number; h: number };

/** Visuel généré en code quand le projet n'a pas de capture publique. */
export type Visual = "terminal" | "pipeline" | "radar" | "json";

export type Project = {
  slug: string;
  title: string;
  kicker: string;
  year: string;
  status: string;
  description: string;
  highlights: string[];
  stack: string[];
  links: { label: string; href: string }[];
  media: Media[];
  visual?: Visual;
  icon?: string;
  shape: ShapeName;
  /** Deux teintes : particules, fond texturé, plaques des visuels. */
  colors: [string, string];
};

export const projects: Project[] = [
  {
    slug: "pastille",
    title: "Pastille",
    kicker: "Une Dynamic Island pour l'encoche du MacBook",
    year: "2026",
    status: "App macOS · open source · v0.2",
    description:
      "L'encoche de l'écran devient un espace utile : musique en cours avec spectre animé, agenda, minuteurs, codes de vérification reçus par SMS ou Mail, batterie des AirPods. L'information apparaît au bon moment, puis s'efface.",
    highlights: [
      "≈ 0 % de CPU au repos, ≈ 1 % pendant la lecture de musique",
      "Mises à jour automatiques signées Ed25519, vérifiées avant toute installation",
      "100 % local : aucune donnée collectée, deux requêtes réseau en tout",
      "5 styles de lecteur, 3 styles d'agenda, fond Noir ou Liquid Glass",
    ],
    stack: ["Swift 6", "SwiftUI", "AppKit", "Swift Testing", "Ed25519"],
    links: [
      { label: "Code source", href: "https://github.com/Zeky69/Pastille" },
      { label: "Télécharger", href: "https://github.com/Zeky69/Pastille/releases/latest" },
    ],
    icon: "/projects/pastille/icon.webp",
    media: [
      { type: "video", src: "/projects/pastille/hover-glass.mp4", poster: "/projects/pastille/hover-glass.jpg", alt: "Le curseur survole l'encoche et la pastille s'ouvre en Liquid Glass", w: 900, h: 384 },
      { type: "video", src: "/projects/pastille/track.mp4", poster: "/projects/pastille/track.jpg", alt: "Annonce d'un nouveau morceau autour de l'encoche", w: 720, h: 180 },
      { type: "video", src: "/projects/pastille/code.mp4", poster: "/projects/pastille/code.jpg", alt: "Code de vérification reçu, copié en un clic", w: 720, h: 180 },
      { type: "video", src: "/projects/pastille/moments.mp4", poster: "/projects/pastille/moments.jpg", alt: "AirPods connectés, charge, minuteur terminé", w: 720, h: 180 },
      { type: "video", src: "/projects/pastille/hover-black.mp4", poster: "/projects/pastille/hover-black.jpg", alt: "Vue détaillée au survol, fond Noir", w: 900, h: 384 },
      { type: "image", src: "/projects/pastille/immersif.webp", alt: "Style de lecteur Immersif", w: 1400, h: 520 },
      { type: "image", src: "/projects/pastille/vinyle.webp", alt: "Style de lecteur Vinyle", w: 1400, h: 520 },
      { type: "image", src: "/projects/pastille/liquid-glass.webp", alt: "Style Liquid Glass", w: 1400, h: 480 },
      { type: "image", src: "/projects/pastille/mois.webp", alt: "Agenda du mois", w: 1400, h: 480 },
      { type: "image", src: "/projects/pastille/reglages.webp", alt: "Fenêtre des réglages de Pastille", w: 1160, h: 1336 },
    ],
    shape: "pill",
    colors: ["#2E8BFF", "#C9B8FF"],
  },
  {
    slug: "42-rank",
    title: "42 Rank",
    kicker: "Le classement des étudiants 42, en direct",
    year: "2026",
    status: "En ligne · 42rank.codeky.fr",
    description:
      "Un classement par campus et par année de piscine, branché en direct sur l'API de l'intra 42. Le duel projet par projet montre exactement quoi rattraper pour dépasser un rival, et un graphique suit la progression du niveau dans le temps.",
    highlights: [
      "Connexion OAuth 42 en un clic, session dans un cookie chiffré",
      "Proxy et cache au-dessus de l'API 42 pour tenir le rate limit",
      "Podium animé, rang mondial, statistiques de fréquentation en direct",
      "Déploiement continu : GitHub Actions → SSH → PM2",
    ],
    stack: ["Next.js 14", "TypeScript", "Server Components", "Recharts", "OAuth 2.0"],
    links: [
      { label: "42rank.codeky.fr", href: "https://42rank.codeky.fr" },
      { label: "Code source", href: "https://github.com/Zeky69/42rank" },
    ],
    media: [
      { type: "image", src: "/projects/42rank/hero.webp", alt: "Page d'accueil de 42 Rank avec l'aperçu du podium", w: 1600, h: 1012 },
      { type: "image", src: "/projects/42rank/features.webp", alt: "Fonctionnalités de 42 Rank : classement live, duel, position", w: 1600, h: 1012 },
    ],
    shape: "podium",
    colors: ["#00C2C4", "#7B5CFF"],
  },
  {
    slug: "wallchange",
    title: "WallChange",
    kicker: "Piloter l'écran de tout un parc Linux, en temps réel",
    year: "2025 — 2026",
    status: "Serveur v1.0 en production",
    description:
      "Un client écrit en C s'installe en une commande sur chaque poste et garde une connexion WebSocket ouverte vers un serveur, lui aussi en C. Depuis la ligne de commande ou le panel web, on change un fond d'écran ou on déclenche l'un des 25 effets — confettis, feux d'artifice, logo DVD qui rebondit, texte défilant — sur un poste ou sur tout le parc à la fois.",
    highlights: [
      "Client et serveur en C pur (Mongoose, cJSON, stb_image), sans framework",
      "Authentification à deux niveaux (utilisateur / admin), tokens à durée de vie",
      "Mise à jour des clients à distance, version incrémentée par la CI",
      "Panel React : postes connectés, envoi groupé, logs en direct, statistiques",
    ],
    stack: ["C", "WebSocket", "Mongoose", "X11", "React", "TypeScript"],
    links: [
      { label: "Serveur & client C", href: "https://github.com/Zeky69/WallChange" },
      { label: "Panel React", href: "https://github.com/Zeky69/webWall" },
    ],
    media: [],
    visual: "terminal",
    shape: "screen",
    colors: ["#FFB020", "#FF4D2E"],
  },
  {
    slug: "rag-against-the-machine",
    title: "RAG Against the Machine",
    kicker: "Interroger 15 000 morceaux de code en langage naturel",
    year: "2026",
    status: "École 42 · 5/5 bonus",
    description:
      "Un système RAG qui répond aux questions sur le dépôt vLLM. Chaque fichier est découpé puis indexé deux fois — BM25 pour les mots exacts, embeddings pour le sens — et les deux classements sont fusionnés (RRF) avant qu'un Qwen3-0.6B local rédige une réponse appuyée sur ses sources.",
    highlights: [
      "Recall@5 : 82 % sur la doc, 70 % sur le code (seuils : 80 % et 50 %)",
      "15 050 chunks indexés en ~150 s, 200 questions traitées en ~15 s",
      "Tourne sur CPU seul : génération via llama.cpp, aucun GPU requis",
    ],
    stack: ["Python", "BM25", "sentence-transformers", "RRF", "Qwen3", "llama.cpp"],
    links: [{ label: "Code source", href: "https://github.com/Zeky69/RAG-against-the-machine" }],
    media: [],
    visual: "pipeline",
    shape: "constellation",
    colors: ["#2EE6A0", "#5CC8FF"],
  },
  {
    slug: "therightone",
    title: "TheRightOne",
    kicker: "Repérer la bonne voiture avant tout le monde",
    year: "2026",
    status: "Auto-hébergé · dépôt privé",
    description:
      "Une application full-stack de veille automobile. Chaque recherche tourne dans son propre thread sur Leboncoin et AutoScout24, et chaque nouvelle annonce part aussitôt sur Discord. Plusieurs comptes totalement cloisonnés, un administrateur qui gère les quotas, et un tableau de bord qui suit les prix.",
    highlights: [
      "Backend FastAPI multi-thread, interface mise à jour par WebSocket",
      "Auth JWT avec rôles, anti-bruteforce, SQLite en mode WAL",
      "Analytique : annonces sur 30 jours, médiane / min / max des prix, export CSV",
    ],
    stack: ["Python", "FastAPI", "React", "Ant Design", "SQLite", "JWT"],
    links: [],
    media: [],
    visual: "radar",
    shape: "radar",
    colors: ["#4D8DFF", "#A9C2FF"],
  },
  {
    slug: "call-me-maybe",
    title: "Call Me Maybe",
    kicker: "100 % de JSON valide avec un modèle de 0,6 milliard de paramètres",
    year: "2026",
    status: "École 42",
    description:
      "Transformer une phrase en appel de fonction exécutable avec un tout petit LLM. Laissé libre, Qwen3-0.6B ne produit du JSON valide qu'une fois sur trois. Ici, à chaque token, tout ce qui violerait le schéma est masqué avant la sélection : la sortie est valide par construction.",
    highlights: [
      "Décodage contraint écrit à la main : fonction, nombres, booléens, chaînes",
      "≈ 30 % → 100 % de sorties JSON valides",
      "Typage strict (mypy --strict) et validation Pydantic",
    ],
    stack: ["Python", "Qwen3-0.6B", "NumPy", "Pydantic"],
    links: [{ label: "Code source", href: "https://github.com/Zeky69/call-me-maybe" }],
    media: [],
    visual: "json",
    shape: "braces",
    colors: ["#FF3D8B", "#FFB020"],
  },
];

/** Projets plus courts, cités en fin de section. */
export const moreProjects = [
  { title: "Inception", note: "8 services Docker, TLS, secrets", href: "https://github.com/Zeky69/Inception" },
  { title: "Codexion", note: "Threads C, ordonnancement EDF", href: "https://github.com/Zeky69/codexion" },
  { title: "A-Maze-ing", note: "Labyrinthes : Prim, Kruskal, BFS", href: "https://github.com/Zeky69/A-Maze-ing" },
  { title: "Fly-in", note: "Routage de drones, Dijkstra", href: "https://github.com/Zeky69/Fly-in" },
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
