# Fly-in

Projet École 42 · 2026 · Simulation de routage de drones sur un réseau de zones — Dijkstra + équilibrage de charge sur k chemins, cartes de difficulté croissante.

[Dépôt GitHub](https://github.com/Zeky69/Fly-in)

## Contexte

Projet développé dans le cadre du cursus de l'École 42. Le problème : acheminer un nombre donné de drones d'une zone de départ vers une zone d'arrivée, en passant par un réseau de connexions avec capacités. L'objectif est de répartir les drones efficacement sans saturer les routes.

## Comment ça fonctionne

Le réseau est décrit dans un fichier de carte texte — zones, connexions et leurs capacités. Le simulateur charge la carte, instancie les drones et les route via deux algorithmes combinés.

```
Carte (.txt)
  Zones : A, B, C, D...
  Connexions : A-B (capacité 3), B-C (capacité 2)...
        ↓
Parsing → Graph
        ↓
Dijkstra → k chemins les plus courts
        ↓
Flow Router → distribution des drones
        ↓
Simulation + visualisation
```

## Algorithmes

### Dijkstra — k shortest paths

Trouve les **k chemins les plus courts** (en nombre de zones traversées) entre la source et la destination. Par défaut k=4, ce qui donne plusieurs routes candidates pour répartir le trafic.

### Flow Router — équilibrage de charge

Distribue les drones sur les k chemins en **round-robin** :

```python
drone.path = paths[i % len(paths)]
```

Chaque drone prend le prochain chemin dans la rotation. Si le nombre de drones dépasse k, la distribution recommence cycliquement. Résultat : aucun chemin n'est surchargé par rapport aux autres.

Cette approche évite la congestion qui arriverait si tous les drones prenaient le chemin optimal unique.

## Cartes

11 cartes classées en 4 niveaux de difficulté :

| Niveau | Cartes | Caractéristiques |
|--------|--------|-----------------|
| Easy | 3 | Chemin linéaire, fourche simple, capacités basiques |
| Medium | 3 | Impasses, boucles circulaires, puzzle de priorité |
| Hard | 3 | Labyrinthe, capacités contraintes, combinaisons complexes |
| Challenger | 1 | "The Impossible Dream" |

## Architecture

Le projet suit une séparation claire entre les modules :

```
src/
  models/          # Structures de données : Graph, Zone, Connection, Drone
  pathfinding/     # Dijkstra + FlowRouter (algorithmes purs)
  simulation/      # Simulateur qui orchestre le tout
  display/         # Rendu terminal et GUI (découplé de la logique)
  parser/          # Lecture des fichiers de cartes
  utils/           # Logger configurable
```

Le rendu (terminal ASCII ou GUI graphique) est découplé des algorithmes — on peut brancher un nouveau renderer sans toucher au cœur du simulateur.

## Stack

- **Python** — implémentation complète
- **Dijkstra** — recherche des k chemins les plus courts
- **Flow routing** — équilibrage de charge par distribution circulaire
- **Makefile** — automatisation (install, run, clean)
