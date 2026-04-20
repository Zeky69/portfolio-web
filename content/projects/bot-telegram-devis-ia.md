# Bot Telegram — Devis par IA

Projet personnel. Bot Telegram capable de créer et gérer des devis directement depuis une conversation, sans formulaire ni interface dédiée.

## Contexte

Générer un devis implique habituellement d'ouvrir un logiciel, remplir des champs, exporter un PDF. Ce bot permet de faire la même chose depuis Telegram en écrivant naturellement : *"devis pour M. Dupont, 3 jours de développement web à 400€/j plus 2 heures de réunion à 80€"*.

Le LLM comprend l'intention, extrait les données structurées, valide les champs obligatoires et persiste le devis en base.

## Flux de traitement

```
Message utilisateur
      ↓
Mistral API — extraction structurée
      ↓
{
  "client": "M. Dupont",
  "lignes": [
    {"description": "Développement web", "qte": 3, "unite": "jour", "prix_unitaire": 400},
    {"description": "Réunion", "qte": 2, "unite": "heure", "prix_unitaire": 80}
  ],
  "total_ht": 1360
}
      ↓
Validation des champs + calcul TVA
      ↓
Persistance SQL + confirmation Telegram
```

## Fonctionnalités

- **Création de devis** en langage naturel — une phrase suffit pour générer une structure complète
- **Validation des champs critiques** — le bot redemande les informations manquantes plutôt que de deviner
- **Calcul automatique** — totaux HT/TTC, application de remises si mentionnées
- **Historique** — recherche des devis par client ou par date via commandes Telegram
- **Modification** — possibilité de corriger un devis existant en conversation

## Ce qui était technique

Le défi principal était de rendre l'extraction fiable. Un LLM peut interpréter *"400€ par jour sur 3 jours"* de plusieurs façons. J'ai structuré le prompt pour forcer une sortie JSON normalisée, avec validation côté Python avant toute persistance.

Pour les cas ambigus (unités manquantes, prix sans contexte), le bot pose des questions de clarification plutôt que d'enregistrer une donnée potentiellement fausse.

## Stack

- **Python** — logique du bot et orchestration
- **Telegram Bot API** — interface conversationnelle
- **Mistral API** — compréhension du langage naturel et extraction structurée
- **SQL** — persistance des devis et clients
