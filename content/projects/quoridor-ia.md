# Quoridor avec IA

Projet académique · Binôme · 2023 · Implémentation complète du jeu de plateau Quoridor avec IA intégrée et interface JavaFX.

## Le jeu

Quoridor est un jeu de plateau à 2 joueurs. Chaque joueur cherche à traverser le plateau en premier, mais peut aussi placer des murs pour bloquer l'adversaire. La difficulté stratégique vient de ce que chaque mur placé change les trajectoires optimales des deux joueurs.

Règle importante : il est interdit de placer un mur qui empêcherait complètement un joueur d'atteindre son objectif — valider cette contrainte à chaque coup nécessite un algorithme de recherche de chemin.

## Ce qu'on a construit

Jeu fonctionnel avec :
- Interface graphique complète en JavaFX (plateau, pions, murs, indicateurs de tour)
- Mode joueur vs joueur
- Mode joueur vs IA
- Validation en temps réel des coups illégaux

## L'IA

L'IA évalue chaque coup possible selon plusieurs critères :
- **Distance à l'objectif** — calculée par BFS (recherche en largeur) depuis la position actuelle
- **Distance adversaire** — l'IA cherche à maximiser son avance relative
- **Utilité des murs** — un mur est utile s'il allonge significativement le chemin adverse sans trop rallonger le sien

La profondeur de recherche est configurable : en mode facile, l'IA ne regarde qu'un coup devant elle ; en mode difficile, elle anticipe sur plusieurs coups.

## Ce qui était technique

**Validation des murs** — à chaque placement de mur, il faut vérifier que les deux joueurs ont encore un chemin vers leur objectif. On utilise un BFS sur la grille après modification hypothétique pour valider ou invalider le coup.

**Représentation de l'état** — le plateau est encodé comme une matrice avec les positions des pions et les murs (horizontaux / verticaux) séparément, ce qui simplifie le calcul des voisins accessibles.

Développé en binôme avec une architecture modulaire : séparation claire entre la logique de jeu, l'IA et l'interface graphique.

## Stack

- **Java** — logique de jeu et IA
- **JavaFX** — interface graphique
