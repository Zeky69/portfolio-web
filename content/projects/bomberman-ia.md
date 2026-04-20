# Bomberman IA

GameJAM Scientifique 2024 · **1er prix du public** · Architecture split front/back avec agents entraînés par apprentissage par renforcement (PPO).

## Contexte

Projet développé dans le cadre de la GameJAM Scientifique 2024. L'objectif était de créer un jeu Bomberman multijoueur avec des agents IA capables de jouer contre des humains. Le projet a remporté le **1er prix du public**.

Architecture divisée en deux dépôts distincts :
- [Back-end-Bomberman](https://github.com/Zeky69/Back-end-Bomberman) — moteur de jeu, logique IA, WebSocket
- [Bomberman-front-end](https://github.com/Zeky69/Bomberman-front-end) — interface de jeu Vue.js / Phaser

## Architecture

```
Frontend (Vue.js + Phaser)
        ↓ WebSocket
Backend Python (FastAPI)
  ├── Moteur de jeu (grille, bombes, explosions)
  ├── Agents PPO (TensorFlow)
  └── Redis (état de jeu partagé)
```

Le backend gère l'état canonique du jeu. Le frontend est un rendu pur — il reçoit l'état à chaque tick et affiche sans recalculer la logique.

## Agents IA

Les agents sont entraînés avec l'algorithme **PPO (Proximal Policy Optimization)** via TensorFlow. L'état du jeu est encodé en grille 2D (position des joueurs, bombes actives, murs, power-ups) et passé en entrée d'un réseau de neurones convolutif.

L'entraînement s'est fait en **self-play** — les agents jouent les uns contre les autres, ce qui évite le surapprentissage contre un adversaire fixe.

Actions disponibles : déplacement dans 4 directions + poser une bombe + rester.

## Ce qui était difficile

**Synchronisation temps réel.** Avec plusieurs joueurs connectés simultanément, garantir que tous voient exactement le même état de jeu au même moment a nécessité une gestion fine des ticks serveur et des deltas envoyés aux clients.

**Récompenses IA.** Définir une fonction de récompense pertinente pour Bomberman n'est pas trivial — récompenser la survie, les éliminations, ou les deux ? J'ai testé plusieurs variantes avant de trouver un équilibre qui donne des agents agressifs mais pas suicidaires.

## Stack

- **Python** — moteur de jeu, entraînement IA
- **TensorFlow** — modèle PPO
- **Vue.js + Phaser** — interface de jeu
- **FastAPI** — API et gestion WebSocket
- **Redis** — état de jeu partagé
- **Docker** — conteneurisation du backend
