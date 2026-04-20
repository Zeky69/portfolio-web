# MovieMind

Projet personnel · 2024 · Système de recommandation de films par embeddings vectoriels.

[Dépôt GitHub](https://github.com/Zeky69/MovieMind)

## Contexte

Projet de recherche personnelle sur les systèmes de recommandation. L'idée de départ : comprendre comment les plateformes comme Netflix ou Letterboxd construisent leurs suggestions — et implémenter une version fonctionnelle de A à Z.

## Comment ça marche

Chaque film est représenté par un **vecteur d'embeddings** calculé à partir de ses métadonnées (titre, synopsis, genres, mots-clés). Deux films avec des embeddings proches sont considérés comme similaires.

Quand un utilisateur sélectionne un film (ou plusieurs), le système calcule la **similarité cosinus** entre ce film et tous les autres du catalogue, puis retourne les N plus proches.

```
Film sélectionné → vecteur d'embedding
        ↓
Similarité cosinus avec tous les films du catalogue
        ↓
Top-N films les plus similaires
```

## Ce qui était intéressant

**La qualité des embeddings détermine tout.** Un embedding basé uniquement sur les genres donne des résultats plats (tous les films d'action se ressemblent). L'ajout du synopsis et des mots-clés thématiques améliore significativement la pertinence des suggestions.

**Scalabilité.** Calculer la similarité cosinus contre un catalogue de 10 000 films en temps réel est faisable, mais avec 500 000 films ça devient un problème de performance. J'ai exploré l'indexation vectorielle (FAISS) comme solution pour les grands catalogues.

## Stack

- **Python** — pipeline de traitement et de recommandation
- **Embeddings** — représentations vectorielles des films
- **NumPy / SciPy** — calculs de similarité
