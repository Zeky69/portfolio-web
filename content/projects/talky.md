# Talky

Projet personnel · 2024 · Application de messagerie instantanée déployée sur [talky.codeky.fr](https://talky.codeky.fr).

[Dépôt GitHub](https://github.com/Zeky69/Talky-vuejs)

## Présentation

Application web de messagerie temps réel avec canaux thématiques, développée et déployée en production. Accessible depuis n'importe quel navigateur sur talky.codeky.fr.

## Fonctionnalités

- **Canaux de discussion** — organisation des conversations par thème ou par groupe
- **Messagerie temps réel** — les messages apparaissent instantanément via Socket.IO, sans rechargement de page
- **Historique persistant** — les messages sont stockés en base de données et rechargés à la connexion
- **Interface Vue.js** — SPA fluide, pas de rechargement entre les canaux

## Architecture

```
Frontend Vue.js (SPA)
        ↓ REST + WebSocket
Backend Express (server/)
  ├── Socket.IO  (messages temps réel)
  ├── PostgreSQL (persistance)
  └── Routes REST (canaux, utilisateurs)
```

La séparation entre les appels REST (chargement initial, création de canaux) et Socket.IO (envoi/réception en temps réel) suit le même pattern que l'[Application Mobile Associative](/projects/application-mobile-associative), développée ensuite avec une stack plus robuste.

## Ce qu'on retient

Premier projet de messagerie personnelle déployé en conditions réelles. Les principaux défis étaient la synchronisation des messages entre plusieurs onglets ouverts simultanément et la gestion des déconnexions/reconnexions Socket.IO.

Talky a servi de base de réflexion pour l'architecture de l'Application Mobile Associative, avec une stack plus robuste (Fastify, Redis, React Native).

## Stack

- **Vue.js** — interface frontend (SPA)
- **Express** — backend et API REST
- **Socket.IO** — messagerie temps réel
- **PostgreSQL** — persistance des messages et canaux
- **JavaScript** — fullstack
