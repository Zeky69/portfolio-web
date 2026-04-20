# portfolio-web

Portfolio personnel de **Zekeriya Akburak** — développeur Fullstack & IA, étudiant à l'École 42 Mulhouse.

→ En ligne : [zeky69.github.io/portfolio-web](https://zeky69.github.io/portfolio-web/)

## Stack

- **Next.js 15** (app router, export statique)
- **React 19** + **TypeScript**
- **Tailwind CSS** — palette warm dark neutre + accent terracotta `#D35F3E`
- **Framer Motion** pour les micro-interactions
- **Lucide Icons**
- Contenu projets en Markdown (`content/projects/*.md`)

## Architecture

```
app/
  layout.tsx          # layout global, fonts Archivo + Space Grotesk
  page.tsx            # home : Hero / About / Skills / Experience / Projects / Education / Contact
  projects/[slug]/    # page détail projet, rendu depuis Markdown
  globals.css
components/           # composants de section (Hero, Projects, etc.)
content/projects/     # fiches projets en Markdown
lib/
  projects.ts         # registry des projets (featured + mini)
  animations.ts       # variants Framer Motion
```

Le Hero a un bloc "terminal" à droite avec sortie simulée `$ whoami` / `cat stack.txt` / `status` — zéro orbe flottant, zéro gradient décoratif, l'objectif est d'éviter le look générique "portfolio Tailwind + Framer".

## Développement local

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Build statique

```bash
npm run build
# génère ./out/ (static export)
```

## Déploiement

Automatique via GitHub Actions (`.github/workflows/deploy.yml`) à chaque push sur `main`.

Le workflow injecte `NEXT_PUBLIC_BASE_PATH=/portfolio-web` pour préfixer correctement assets et liens internes sur GitHub Pages.

Dans les settings GitHub du repo, **Pages → Source** doit être réglé sur **GitHub Actions**.

## Contact

- GitHub — [@Zeky69](https://github.com/Zeky69)
- Mail — [zek.akburak@gmail.com](mailto:zek.akburak@gmail.com)
