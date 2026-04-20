export type Project = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  details: string[];
  href?: string;
  year?: string;
  category?: string;
  badge?: string;
  badgeColor?: "accent" | "muted";
  featured: boolean;
};

export const projects: Project[] = [
  {
    slug: "application-mobile-associative",
    badge: "En cours",
    badgeColor: "accent",
    category: "React Native",
    title: "Application Mobile Associative",
    description:
      "Application iOS/Android de gestion associative - attribution de taches, messagerie temps reel par canaux, gestionnaire de fichiers integre.",
    tags: ["React Native", "Node.js", "Fastify", "Socket.IO", "PostgreSQL", "Redis"],
    details: [
      "Architecture mobile multiplateforme avec API Node.js.",
      "Messagerie temps reel par canaux avec Socket.IO.",
      "Gestion avancee des roles et des taches associatives.",
    ],
    featured: true,
  },
  {
    slug: "bot-telegram-devis-ia",
    badge: "Personnel",
    badgeColor: "muted",
    category: "Python / IA",
    title: "Bot Telegram - Devis par IA",
    description:
      "Bot Telegram comprenant le langage naturel pour creer et gerer des devis. L'IA structure les donnees et les enregistre automatiquement.",
    tags: ["Python", "Mistral API", "SQL", "Telegram Bot API"],
    details: [
      "Comprehension des messages naturels pour creer des devis.",
      "Structuration automatique des donnees avant persistance.",
      "Workflow conversationnel oriente productivite pour les devis.",
    ],
    featured: true,
  },
  {
    slug: "agent-domotique-ia",
    badge: "Personnel",
    badgeColor: "muted",
    category: "IA locale",
    title: "Agent Domotique IA",
    description:
      "IA locale avec sorties structurees JSON et function calling, integree a Home Assistant. Controle de la maison en langage naturel, sans cloud.",
    tags: ["Python", "Ollama", "Mistral", "FastAPI", "Home Assistant"],
    details: [
      "Function calling avec schemas JSON stricts.",
      "Execution locale des modeles LLM sans dependance cloud.",
      "Integration Home Assistant pour piloter les appareils domotiques.",
    ],
    featured: true,
  },
  {
    slug: "outil-administration-systeme-distante",
    badge: "Personnel",
    badgeColor: "muted",
    category: "C · React · WebSocket",
    title: "WallChange — Admin Système Distante",
    description:
      "Pilotage complet de postes à distance — fond d'écran, effets visuels, captures, reverse shell. Backend C/WebSocket + interface React déployée sur wallchange.codeky.fr.",
    tags: ["C", "C++", "React", "TypeScript", "WebSocket", "Mongoose"],
    details: [
      "Backend C avec WebSocket (Mongoose) — agents clients sur chaque poste.",
      "Interface React (webWall) : liste des clients, broadcast, effets, logs, stats.",
      "Déployé en production sur wallchange.codeky.fr.",
    ],
    href: "https://wallchange.codeky.fr",
    featured: true,
  },
  {
    slug: "call-me-maybe",
    title: "Function Calling Contraint",
    year: "2026",
    description: "100% de JSON valide sur un LLM 0.6B grâce au décodage contraint — masquage de tokens invalides à chaque étape de génération.",
    tags: ["Python", "LLM", "Qwen3", "Constrained Decoding"],
    details: [
      "Décodage contraint : masquage des tokens invalides à chaque step de génération.",
      "100% de sorties JSON valides sur un modèle 0.6B (vs ~30% sans contrainte).",
      "Base technique de l'agent domotique IA.",
    ],
    href: "https://github.com/Zeky69/call-me-maybe",
    featured: false,
  },
  {
    slug: "a-maze-ing",
    title: "A-Maze-ing",
    year: "2026",
    description: "Génération procédurale et résolution de labyrinthes — 3 algos de génération (DFS, Prim, Kruskal), 2 de résolution (DFS, BFS), visualisation ASCII animée.",
    tags: ["Python", "DFS", "BFS", "Prim", "Kruskal", "École 42"],
    details: [
      "Trois algorithmes de génération : DFS, Prim, Kruskal.",
      "Résolution par DFS et BFS avec visualisation du chemin.",
      "Rendu ASCII animé avec pattern Observer pour découpler logique et affichage.",
    ],
    href: "https://github.com/Zeky69/A-Maze-ing",
    featured: false,
  },
  {
    slug: "talky",
    title: "Talky",
    year: "2024",
    description: "Application de messagerie instantanée déployée sur talky.codeky.fr — canaux, temps réel, architecture Vue.js + Express + Socket.IO.",
    tags: ["Vue.js", "Socket.IO", "Express", "PostgreSQL", "JavaScript"],
    details: [
      "Messagerie temps réel par canaux via Socket.IO.",
      "Frontend Vue.js, backend Express, persistance PostgreSQL.",
      "Déployé en production sur talky.codeky.fr.",
    ],
    href: "https://github.com/Zeky69/Talky-vuejs",
    featured: false,
  },
  {
    slug: "bomberman-ia",
    title: "Bomberman IA",
    year: "2024",
    description: "Agents PPO + 1er prix du public - GameJAM.",
    tags: ["Phaser", "TensorFlow", "Vue.js"],
    details: [
      "Entrainement d'agents avec apprentissage par renforcement.",
      "Partie multijoueur en temps reel via WebSocket.",
      "Projet recompense (1er prix du public).",
    ],
    featured: false,
  },
  {
    slug: "moviemind",
    title: "MovieMind",
    year: "2024",
    description: "Systeme de recommandation de films par embeddings vectoriels.",
    tags: ["Python", "Embeddings"],
    details: [
      "Indexation vectorielle du catalogue de films.",
      "Recommandations par similarite cosinus.",
      "Pipeline pense pour iterer rapidement sur les modeles.",
    ],
    featured: false,
  },
  {
    slug: "gestion-manifestation",
    title: "Gestion Manifestation",
    year: "2023-24",
    description: "Application de gestion d'evenements deployee.",
    tags: ["Vue.js", "Express", "PostgreSQL"],
    details: [
      "Gestion de manifestations et suivi logistique.",
      "API REST avec base PostgreSQL.",
      "Deploiement public et tests en conditions reelles.",
    ],
    href: "https://codeky.fr",
    featured: false,
  },
  {
    slug: "gamejam-multijoueur",
    title: "GameJAM Multijoueur",
    year: "2023",
    description: "Jeu multijoueur developpe en equipe de 7.",
    tags: ["JavaScript", "Socket.io"],
    details: [
      "Developpement express en contexte GameJAM.",
      "Synchronisation de l'etat de jeu entre plusieurs joueurs.",
      "Collaboration rapide avec equipe pluridisciplinaire.",
    ],
    featured: false,
  },
  {
    slug: "quoridor-ia",
    title: "Quoridor avec IA",
    year: "2023",
    description: "Jeu de plateau Quoridor avec IA integree.",
    tags: ["Java", "JavaFX"],
    details: [
      "Implementation des regles et de l'interface JavaFX.",
      "IA pour prise de decision sur les deplacements.",
      "Travail en binome avec architecture modulaire.",
    ],
    featured: false,
  },
  {
    slug: "site-ecommerce",
    title: "Site E-commerce",
    year: "2022",
    description: "Site e-commerce realise en groupe de 3.",
    tags: ["Python", "Flask", "MySQL"],
    details: [
      "Catalogue, panier et base produit en MySQL.",
      "Backend Flask et pages dynamiques.",
      "Projet fondateur sur la logique fullstack.",
    ],
    featured: false,
  },
  {
    slug: "fly-in",
    title: "Fly-in",
    year: "2026",
    description: "Simulation de routage de drones sur réseau de zones — Dijkstra + équilibrage de charge sur k chemins, cartes de difficulté croissante, visualisation terminal/GUI.",
    tags: ["Python", "Dijkstra", "Flow Routing", "École 42"],
    details: [
      "Dijkstra pour trouver les k chemins les plus courts.",
      "Flow router : distribution circulaire des drones sur les chemins.",
      "Cartes de difficulté easy / medium / hard / challenger.",
    ],
    href: "https://github.com/Zeky69/Fly-in",
    featured: false,
  },
];

export const featuredProjects = projects.filter((project) => project.featured);
export const miniProjects = projects.filter((project) => !project.featured);

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
