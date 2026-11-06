## Objectif

Répondre en langage naturel à des questions sur le dépôt **vLLM** (code et documentation), en citant les bons fichiers. Le projet est évalué sur deux jeux privés de 100 questions, avec un seuil de Recall@5.

## Le pipeline

1. **Indexation** — chaque fichier pertinent (`.py`, `.md`, `.rst`, `.yaml`, `.toml`…) est découpé en chunks de 2 000 caractères. Deux index sont construits en parallèle : **BM25** pour la correspondance lexicale, et des **embeddings** normalisés (`all-MiniLM-L6-v2`) pour le sens. Le chemin du fichier est préfixé à chaque chunk, pour que BM25 retrouve un module cité dans la question.
2. **Recherche** — la requête est enrichie par une table de synonymes, BM25 tourne sur la version originale et sur la version enrichie, et une recherche sémantique complète parcourt tous les embeddings.
3. **Fusion** — les classements sont combinés par **Reciprocal Rank Fusion** pondérée.
4. **Génération** — les meilleurs chunks forment le contexte d'un **Qwen3-0.6B** qui rédige une réponse appuyée sur ces sources.

## Résultats

| Jeu | Recall@1 | Recall@3 | Recall@5 | Recall@10 |
|---|---|---|---|---|
| Documentation | 63 % | 78 % | **82 %** | 88 % |
| Code | 48 % | 65 % | **70 %** | 72 % |

Seuils demandés : 80 % (doc) et 50 % (code).

| Configuration | Doc R@5 | Code R@5 |
|---|---|---|
| BM25 seul | ~76 % | ~48 % |
| BM25 + expansion | ~78 % | ~50 % |
| BM25 + rerank sémantique (top 100) | ~84 % | ~52 % |
| **Hybride complet + RRF** | **82 %** | **70 %** |

La recherche sémantique sur *tout* le corpus fait la différence sur le code : elle rattrape les paraphrases que BM25 manque complètement.

## Contraintes tenues

- 15 050 chunks indexés en ~151 s (limite : 300 s).
- 200 questions traitées en ~15 s (limite : 90 s) grâce à l'encodage par lots.
- Index persisté sur disque et cache `lru_cache` : pas de ré-indexation entre deux lancements.
- Génération via `llama-cpp-python` et un modèle GGUF : tout tourne sur CPU, sans GPU ni pilotes.
