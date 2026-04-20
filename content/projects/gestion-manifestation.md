# Gestion Manifestation

Projet académique · Groupe de 5 · 2023–2024 · Application de gestion d'événements déployée en production sur [codeky.fr](https://codeky.fr).

## Contexte

Projet développé en groupe de 5 personnes dans le cadre du BUT Informatique. Objectif : construire une application complète de gestion d'événements (manifestations sportives, culturelles) — de la planification à la coordination sur le terrain — et la déployer en conditions réelles.

## Fonctionnalités

**Gestion de l'événement**
Création et configuration d'une manifestation : date, lieu, capacité, missions à pourvoir. Chaque mission peut être assignée à un bénévole ou à un prestataire.

**Suivi en temps réel**
Tableau de bord central avec l'état des missions en cours, les alertes (mission non pourvue, retard signalé) et les ressources disponibles.

**Cartographie**
Intégration de **VueLeaflet** pour visualiser les postes de mission sur une carte interactive. Particulièrement utile pour les événements en extérieur avec plusieurs zones géographiques.

**API REST**
Backend Express avec une API claire et documentée, consommée aussi bien par le frontend Vue.js que par des outils tiers.

## Architecture

```
Frontend Vue.js (SPA)
  ├── Carte interactive (VueLeaflet / OpenStreetMap)
  └── Tableau de bord en temps réel
        ↓
API REST Express
        ↓
PostgreSQL
```

## Ce qu'on a appris

Premier projet fullstack d'équipe déployé en production. La gestion du déploiement, des variables d'environnement, de la base de données en production et des montées de version en conditions réelles a été la partie la plus formatrice — autant que le code lui-même.

On a également fait face à des retours d'utilisateurs réels, ce qui a conduit à plusieurs itérations sur l'ergonomie du tableau de bord.

## Stack

- **Vue.js** — frontend SPA
- **Express** — API REST backend
- **PostgreSQL** — base de données
- **VueLeaflet** — cartographie (OpenStreetMap)
- **JavaScript** — fullstack
