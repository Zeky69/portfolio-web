# Function Calling Contraint

Projet personnel · 2026 · Obtenir 100% de sorties JSON valides depuis un petit LLM (0.6B paramètres) grâce au décodage contraint.

[Dépôt GitHub](https://github.com/Zeky69/call-me-maybe) · Base technique de l'[Agent Domotique IA](/projects/agent-domotique-ia)

## Le problème

Le function calling avec un LLM consiste à lui demander de produire un JSON structuré plutôt qu'une réponse en texte libre. Sur les grands modèles (GPT-4, Mistral 7B+), ça marche raisonnablement bien. Sur un modèle de 600M de paramètres, environ **70% des sorties sont invalides** — JSON malformé, mauvais types, champs manquants.

Ce projet résout ce problème sans changer le modèle.

## La solution : décodage contraint

À chaque étape de génération, le modèle produit une distribution de probabilité sur tous les tokens possibles. Normalement, on sélectionne le token le plus probable. Ici, on **masque d'abord les tokens qui rendraient le JSON invalide**, puis on sélectionne parmi les tokens légaux restants.

```
Token précédents : {"function": "
Tokens valides à ce stade : uniquement des chaînes de caractères valides
Tokens masqués : }, ], nombres, booléens, null...
```

Le résultat : le modèle ne peut pas physiquement produire un JSON invalide.

## Architecture

```
Entrée en langage naturel
        ↓
LLM (Qwen3 0.6B via llm_sdk)
  + Constrained Decoder
    → masque les tokens invalides à chaque step
    → valide le schéma JSON attendu
        ↓
Sortie JSON 100% conforme au schéma
        ↓
Exécution de la fonction ciblée
```

## Résultats

| Méthode | JSON valides | Conformes au schéma |
|---------|-------------|---------------------|
| Génération libre | ~30% | ~15% |
| Décodage contraint | **100%** | **100%** |

## Ce qui était technique

**Gestion des séquences d'échappement.** Dans une valeur string JSON, les caractères `"`, `\`, et les caractères de contrôle doivent être échappés. Le décodeur doit tracker si on est "dans une string" ou "hors string" pour appliquer les bonnes règles de masquage.

**Sélection de fonction par préfixe.** Le nom de la fonction est décodé caractère par caractère — le masquage garantit qu'à chaque étape, seuls les préfixes valides de fonctions connues sont autorisés.

**Extraction typée des paramètres.** Nombres, booléens, chaînes et tableaux ont chacun leurs propres règles de génération contrôlée.

## Stack

- **Python 3.10+** — logique de décodage
- **Qwen3 0.6B** — modèle LLM local
- **NumPy** — manipulation des distributions de probabilité
- **Pydantic** — validation des schémas JSON
