# WallChange — Administration Système Distante

Projet personnel · Déployé sur [wallchange.codeky.fr](https://wallchange.codeky.fr) · Backend C + Interface React

Système complet de pilotage de postes à distance — fond d'écran, effets visuels, captures d'écran, commandes système — depuis un panneau web centralisé.

Dépôts : [WallChange (backend C)](https://github.com/Zeky69/WallChange) · [webWall (frontend React)](https://github.com/Zeky69/webWall)

## Vue d'ensemble

Deux composants indépendants qui forment un système cohérent :

- **WallChange** — agent C léger qui tourne sur chaque poste administré, connecté au serveur via WebSocket
- **webWall** — interface React/TypeScript déployée en production, qui liste les postes connectés et envoie des commandes

## WallChange — Backend C

**Architecture client/serveur en C** avec la bibliothèque Mongoose pour le WebSocket et l'HTTP. Aucune dépendance lourde.

```
Interface web (wallchange.codeky.fr)
        ↓ HTTPS / API REST
Serveur C (Mongoose)
        ↓ WebSocket
Agents C — un par machine administrée
        ↓
Actions exécutées sur le poste
```

**Serveur** — maintient la liste des clients connectés, identifiés par ID unique. Expose une API HTTP pour recevoir les commandes depuis le frontend. Route chaque commande vers le bon client ou les diffuse à tous.

**Client (agent)** — process léger qui se connecte au serveur au démarrage, reste en écoute de commandes, les exécute localement. Script d'installation avec démarrage automatique au boot.

**cJSON** — sérialisation des messages échangés entre agent et serveur.

## webWall — Interface de contrôle React

Interface d'administration déployée sur [wallchange.codeky.fr](https://wallchange.codeky.fr). Construite avec React + TypeScript + Tailwind.

### Gestion des clients

Chaque poste connecté est représenté par une **ClientCard** avec :
- Statut en ligne / hors ligne en temps réel
- Version et nom d'hôte
- Badge "Locked" si la session est verrouillée
- Sélection multiple pour les actions broadcast

### Contrôle par poste

4 onglets par client :

| Onglet | Actions |
|--------|---------|
| **Fond** | Upload d'image ou URL — change le fond d'écran |
| **Marquee** | Texte ou image défilante sur l'écran |
| **Particules** | Effets visuels animés |
| **Cover** | Image de couverture plein écran |

Actions rapides : bureau, inversion d'écran, capture d'écran, extinction.

### Effets visuels (admin)

15+ effets disponibles côté admin : Confetti, Feux d'artifice, DVD Bounce, Nyan Cat, Ondes, Spotlight, et d'autres.

### Administration avancée

- Verrouillage / blackout de session
- **Capture d'écran** en temps réel
- **Reverse shell** sur le poste ciblé
- Logs d'activité par client (`ClientLogs`)
- Statistiques globales (`StatsPage`)
- Désinstallation de l'agent à distance

### Authentification

Système de rôles admin/user — les effets avancés et les commandes système sont réservés aux administrateurs.

## Stack

**Backend (WallChange)**
- **C / C++** — serveur et agents clients
- **Mongoose** — WebSocket + HTTP serveur en C
- **cJSON** — sérialisation des messages

**Frontend (webWall)**
- **React + TypeScript** — interface de contrôle
- **Tailwind CSS** — styles
- **Vite** — build et dev server
- **API REST** — communication vers le serveur C (wallchange.codeky.fr)
