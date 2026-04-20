# Application Mobile Associative

Projet personnel en cours. Application iOS/Android de gestion associative : attribution de tâches, messagerie temps réel par canaux, gestionnaire de fichiers.

## Contexte

Les associations utilisent souvent un mélange de WhatsApp, Google Drive et tableurs partagés pour coordonner leurs membres. Ce projet centralise tout dans une seule application mobile, avec des rôles clairs et une messagerie structurée par canaux thématiques.

## Fonctionnalités

**Gestion des membres et des rôles**
Trois niveaux d'accès : administrateur, membre actif, bénévole. Chaque rôle a des droits distincts sur les tâches, les canaux et les fichiers.

**Attribution de tâches**
Création, assignation et suivi de tâches avec statut (à faire, en cours, terminé). Notifications push à l'assignation et aux échéances.

**Messagerie temps réel par canaux**
Canaux thématiques (logistique, communication, finance...) avec historique persistant. Connexion via Socket.IO — les messages arrivent en moins de 100 ms sur le réseau local.

**Gestionnaire de fichiers**
Upload et partage de documents directement depuis l'application. Les fichiers sont organisés par événement ou par canal.

## Architecture

```
App React Native (Expo)
       ↓ REST + WebSocket
API Node.js / Fastify
  ├── PostgreSQL  (utilisateurs, tâches, messages)
  └── Redis       (sessions, cache temps réel)
```

La séparation entre la couche REST (CRUD classique) et la couche WebSocket (événements temps réel) permet de scaler chaque partie indépendamment.

## Points techniques notables

- **Redis** pour la gestion des sessions et la file de messages — évite d'interroger PostgreSQL à chaque événement temps réel
- **Fastify** choisi pour sa performance sur les requêtes JSON (benchmark ~2x plus rapide qu'Express sur ce type de charge)
- Schéma de base de données avec **Row-Level Security** PostgreSQL pour isoler les données par association

## Stack

- **React Native** (Expo) — iOS & Android depuis une base unique
- **Node.js / Fastify** — API backend
- **Socket.IO** — messagerie temps réel
- **PostgreSQL** — données persistantes
- **Redis** — sessions et événements temps réel
