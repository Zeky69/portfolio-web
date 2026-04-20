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
    category: "C / Reseau",
    title: "Outil d'Administration Systeme Distante",
    description:
      "Gestion centralisee de postes a distance via interface web - execution de commandes, diffusion d'images et animations sur les ecrans clients.",
    tags: ["C", "Sockets", "HTTP", "Interface Web"],
    details: [
      "Client/serveur bas niveau en C via sockets.",
      "Pilotage distant de machines depuis un panneau web unique.",
      "Projet oriente apprentissage reseau et administration systeme.",
    ],
    featured: true,
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
];

export const featuredProjects = projects.filter((project) => project.featured);
export const miniProjects = projects.filter((project) => !project.featured);

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
