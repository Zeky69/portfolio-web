# Zekeriya AKBURAK — Portfolio

**Développeur Fullstack & IA** · École 42 Mulhouse · Audincourt (25)

→ [codeky.fr](https://codeky.fr) · [github.com/Zeky69](https://github.com/Zeky69) · zek.akburak@gmail.com

---

## Qui je suis

Diplômé d'un BUT Informatique (IUT Nord-Franche-Comté, 2022–2025), actuellement étudiant à l'École 42 Mulhouse. 1 an d'expérience terrain : alternance au SDIS 25 sur un outil d'analyse opérationnelle, stage R&D au laboratoire FEMTO-ST sur l'apprentissage fédéré appliqué aux énergies renouvelables.

Je cherche une **alternance 2025–2029** dans le développement applicatif ou l'IA. Mobile sur toute la France, télétravail accepté.

---

## Expériences

### Alternance — Développeur Informatique
**SDIS 25 – Service Départemental d'Incendie et de Secours** · 2024–2025

Développement d'**Optimops** — solution d'analyse des données opérationnelles des pompiers du Doubs. Tableaux de bord analytiques, génération de rapports, simulation via jumeau numérique.

`Vue.js` `Python` `Flask` `MongoDB`

### Stage R&D
**Laboratoire FEMTO-ST** · Avril–Juin 2024

Implémentation de modèles d'**apprentissage fédéré (Federated Learning)** pour la prévision de consommation et de production d'énergie renouvelable (solaire, éolien).

`Python` `TensorFlow` `Scikit-Learn`

---

## Projets

### Projets personnels

| Projet | Description | Stack | Lien |
|--------|-------------|-------|------|
| **Agent Domotique IA** | IA locale avec function calling JSON, intégrée à Home Assistant. Contrôle de la maison en langage naturel, zéro cloud. Gestion des intentions ambiguës, journalisation des commandes, mode sécurisé. | Python · Ollama · Mistral · FastAPI · Home Assistant | [call-me-maybe](https://github.com/Zeky69/call-me-maybe) |
| **Bot Telegram — Devis IA** | Bot Telegram qui comprend les messages en langage naturel pour créer et gérer des devis. Extraction structurée des champs critiques, validation, persistance SQL. | Python · Mistral API · Telegram Bot API · SQL | — |
| **Outil Admin Système Distante** | Gestion centralisée de postes à distance via panneau web. Exécution de commandes à distance, diffusion d'images et animations sur les écrans clients. Client/serveur bas niveau en C. | C · Sockets · HTTP | — |
| **MovieMind** | Système de recommandation de films par embeddings vectoriels et similarité cosinus. Pipeline pensé pour itérer rapidement sur les modèles. | Python · Embeddings | [MovieMind](https://github.com/Zeky69/MovieMind) |

### Projets académiques & collaboratifs

| Projet | Contexte | Description | Stack |
|--------|----------|-------------|-------|
| **Application Mobile Associative** | Personnel · En cours | iOS/Android pour gestion associative : attribution de tâches, messagerie temps réel par canaux, gestion de fichiers, rôles (admin / membre / bénévole). | React Native · Node.js · Fastify · Socket.IO · PostgreSQL · Redis |
| **Bomberman IA** | GameJAM 2024 · **🏆 1er prix du public** | Jeu Bomberman multijoueur avec agents entraînés par renforcement (PPO). Architecture split front/back, synchronisation WebSocket temps réel. | Python · TensorFlow · Vue.js · Phaser · FastAPI · Redis · Docker |
| **Gestion Manifestation** | Groupe de 5 · 2023–2024 | Application de gestion d'événements déployée en production. Planning, ressources, assignation de missions, cartographie (VueLeaflet). | Vue.js · Express · PostgreSQL · VueLeaflet |
| **GameJAM Multijoueur** | Groupe de 7 · 2023 | Jeu multijoueur développé sous contrainte de temps (GameJAM Scientifique). Synchronisation d'état entre joueurs en temps réel. | JavaScript · Socket.IO |
| **Quoridor avec IA** | Binôme · 2023 | Implémentation du jeu de plateau Quoridor avec IA intégrée (heuristiques de recherche, évaluation de position). Interface JavaFX. | Java · JavaFX |
| **Site E-commerce** | Groupe de 3 · 2022 | Catalogue produits, panier, gestion des commandes. Premier projet fullstack en équipe. | Python · Flask · Django · MySQL |

---

## Stack

**Langages** — Python · TypeScript · C · Java

**IA / Data** — PyTorch · TensorFlow · LangChain · Scikit-Learn · Ollama

**Web / API** — Next.js · React · Vue.js · FastAPI · Express · Fastify · Flask

**Bases de données** — PostgreSQL · MongoDB · Redis · MySQL

**Outils** — Docker · Git · Home Assistant · Socket.IO

**Langues** — Français (natif) · Turc (courant) · Anglais (B1)

---

## Ce portfolio

Construit avec **Next.js 15** (export statique), **Tailwind CSS**, **Framer Motion**. Déployé sur GitHub Pages via GitHub Actions.

```
app/
  layout.tsx              # fonts Archivo + Space Grotesk, metadata
  page.tsx                # home : Hero / About / Skills / Experience / Projects / Education / Contact
  projects/[slug]/        # page détail, rendu depuis Markdown
components/               # Hero (terminal), Projects, Skills, Experience...
content/projects/*.md     # fiches projets en Markdown
lib/
  projects.ts             # registry des projets (featured + mini)
  animations.ts           # variants Framer Motion
public/
  CNAME                   # domaine custom codeky.fr
```

**Lancer en local :**

```bash
npm install
npm run dev   # → http://localhost:3000
```

**Build statique :**

```bash
npm run build   # → ./out/
```

Le déploiement est automatique à chaque push sur `main` via `.github/workflows/deploy.yml`.

---

## Contact

- Email — [zek.akburak@gmail.com](mailto:zek.akburak@gmail.com)
- GitHub — [@Zeky69](https://github.com/Zeky69)
- Localisation — Audincourt (25) · Mobile France · Télétravail OK
