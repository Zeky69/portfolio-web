# Outil d'Administration Système Distante

Projet personnel. Solution de supervision et de pilotage de postes clients à distance, avec panneau de contrôle web et communication bas niveau en C.

## Contexte

Projet d'apprentissage sur les communications réseau bas niveau et l'administration système. L'objectif était de construire, sans framework, un système permettant de contrôler plusieurs machines distantes depuis un seul panneau web — comprendre concrètement ce que font des outils comme VNC ou SSH sous le capot.

## Architecture

```
Panneau web (navigateur)
        ↓ HTTP
Serveur central (C)
        ↓ Sockets TCP
Agents clients (C) — un par machine distante
```

**Serveur central** — reçoit les commandes depuis l'interface web, les route vers le bon client, agrège les réponses.

**Agents clients** — processus léger en C qui tourne sur chaque machine administrée. Écoute les instructions, les exécute et renvoie le résultat.

**Interface web** — panneau HTML/JS minimaliste pour envoyer des commandes et visualiser les retours.

## Fonctionnalités

- **Exécution de commandes à distance** — une commande envoyée depuis le panneau s'exécute sur la machine cible et renvoie la sortie
- **Diffusion d'images** — affichage d'une image sur l'écran de plusieurs postes simultanément (utile pour afficher des consignes ou du contenu en salle)
- **Diffusion d'animations** — envoi de séquences animées sur les écrans clients
- **Supervision multi-postes** — le panneau liste les machines connectées avec leur statut

## Ce qui était technique

Implémenter un serveur HTTP basique en C pur (sans librairie externe) a demandé de comprendre le protocole HTTP au niveau des en-têtes et du parsing des requêtes. De même pour les sockets TCP : gestion des connexions multiples avec `select()`, sérialisation des données, gestion des déconnexions inattendues.

C'est le type de projet où on comprend pourquoi les abstractions réseau existent — et pourquoi elles sont utiles.

## Stack

- **C** — serveur central et agents clients
- **Sockets TCP** — communication bas niveau
- **HTTP** — protocole entre le navigateur et le serveur central
- **HTML / JavaScript** — interface de contrôle web
