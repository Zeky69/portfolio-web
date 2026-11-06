## Le défi

Transformer une phrase en appel de fonction exploitable par une machine :

```json
{
  "prompt": "What is the product of 3 and 5?",
  "name": "fn_multiply_numbers",
  "parameters": { "a": 3.0, "b": 5.0 }
}
```

Avec un modèle de moins d'un milliard de paramètres, une simple consigne donne du JSON valide environ **une fois sur trois**. L'objectif : 100 %.

## Le décodage contraint

À chaque étape, le modèle produit un score pour chacun des ~150 000 tokens du vocabulaire. Avant de choisir, on met à `-inf` le score de tous les tokens qui violeraient la structure attendue. Le meilleur token *restant* est sélectionné : la sortie est valide par construction.

```
1. Prompt système listant les fonctions disponibles
2. Choix de la fonction   → generate_one_of(noms)
3. Lecture du schéma des paramètres
4. Pour chaque paramètre, le générateur adapté :
   number / integer → chiffres, « . », « - » uniquement
   boolean          → true | false
   string           → jusqu'au guillemet fermant
5. Assemblage et écriture du JSON
```

- **`generate_one_of`** : à chaque pas, seuls les tokens qui prolongent le préfixe d'au moins un candidat sont autorisés ; la génération s'arrête dès qu'un seul candidat correspond.
- **Nombres** : une regex pré-compilée filtre le vocabulaire une seule fois au démarrage. Si le meilleur token non contraint n'est pas numérique, le modèle a naturellement fini.
- **Booléens** : un `generate_one_of(["true", "false"])`.

## Résultat

- ≈ 30 % → **100 %** de sorties JSON valides sur Qwen3-0.6B.
- Code typé strictement (`mypy --strict`, flake8) et objets validés par Pydantic.

C'est la brique qui permet de brancher un petit modèle local sur de vraies actions — par exemple piloter une maison connectée sans cloud.
