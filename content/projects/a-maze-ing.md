# A-Maze-ing

Projet École 42 · 2026 · Génération procédurale, résolution et visualisation animée de labyrinthes complexes.

[Dépôt GitHub](https://github.com/Zeky69/A-Maze-ing)

## Présentation

Générateur de labyrinthes en Python qui implémente trois algorithmes de génération distincts et deux algorithmes de résolution, avec une visualisation ASCII animée en terminal. Développé dans le cadre du cursus de l'École 42 Mulhouse.

## Génération

Trois algorithmes sont disponibles, chacun avec un comportement différent :

**DFS (Depth-First Search)** — algorithme par défaut. Crée des labyrinthes avec de longs couloirs continus et peu de croisements. Le résultat est intuitif mais avec un seul chemin long vers la sortie.

**Prim** — part d'un point et étend le labyrinthe en ajoutant des cellules aléatoires depuis la frontière. Produit des labyrinthes plus "buissonnants" avec beaucoup de petites impasses.

**Kruskal** — construit le labyrinthe en fusionnant des zones distinctes. Donne une distribution plus uniforme des murs, avec un aspect plus "quadrillé".

## Résolution

**DFS** — explore en profondeur, trouve un chemin mais pas forcément le plus court.

**BFS (Breadth-First Search)** — garantit le chemin le plus court en nombre de cases.

Les deux algorithmes visualisent le chemin de résolution en surbrillance sur le labyrinthe.

## Visualisation ASCII

```
+--+--+--+--+--+
|        |     |
+  +--+  +  +--+
|  |     |  |  |
+  +  +--+  +  +
|     |  |     |
+--+--+  +--+--+
```

Le rendu est animé : la génération et la résolution se déroulent en temps réel dans le terminal, avec support des couleurs. La vitesse d'animation est configurable.

## Architecture

Le projet utilise le **pattern Observer** pour découpler complètement la logique des algorithmes du rendu visuel — ce qui permet de brancher d'autres rendus (graphique, web) sans toucher aux algorithmes.

```
mazegen_forge/     # Algorithmes purs (génération + résolution)
display/           # Rendu ASCII et animations
core/              # Structures de données (grille, cellules, murs)
main.py            # Point d'entrée + lecture config.txt
```

La configuration (dimensions du labyrinthe, algorithme, couleurs, vitesse d'animation) est gérée via un fichier `config.txt`.

## Stack

- **Python** — implémentation complète
- **Algorithmes** — DFS, BFS, Prim, Kruskal
- **Pattern Observer** — découplage logique / affichage
