# Agent Domotique IA

Projet personnel. IA locale intégrée à Home Assistant pour piloter la maison connectée en langage naturel — sans cloud, sans API externe.

## Contexte

La plupart des assistants vocaux envoient les commandes vers des serveurs distants. Ce projet part du principe inverse : tout tourne en local, le modèle de langage est exécuté sur ma propre machine via Ollama, et les actions sur les appareils passent uniquement par Home Assistant sur le réseau local.

## Comment ça fonctionne

L'utilisateur envoie une commande en langage naturel (ex. : *"éteins les lumières du salon et ferme les volets"*). L'agent décompose l'intention en appels de fonctions structurés (function calling), chaque appel correspondant à une action précise dans Home Assistant.

```
Entrée : "allume la lampe du bureau à 60%"
        ↓
Parsing LLM (Mistral local via Ollama)
        ↓
{
  "function": "set_light",
  "entity_id": "light.bureau",
  "brightness": 153
}
        ↓
Appel API Home Assistant → action exécutée
```

## Ce qui était technique

**Schémas JSON stricts.** Le point délicat du function calling avec un LLM local, c'est de garantir que la sortie est toujours un JSON valide et conforme au schéma attendu. J'ai implémenté une couche de validation et de retry pour les cas où le modèle produit une sortie malformée.

**Gestion des intentions ambiguës.** Quand la commande est incomplète ou contradictoire (ex. : *"mets une ambiance"* sans préciser laquelle), l'agent demande une clarification plutôt que de deviner.

**Mode sécurisé.** Certaines actions (coupure générale, alarme) passent par une confirmation explicite avant exécution.

**Journalisation.** Toutes les commandes et leurs résultats sont enregistrés avec un horodatage pour traçabilité et debug.

## Stack

- **Python** — logique de l'agent, orchestration
- **Ollama** — exécution locale du LLM (Mistral)
- **FastAPI** — exposition de l'agent en API REST
- **Home Assistant** — actionneurs domotiques (lumières, volets, prises)

## Référence GitHub

Le projet [call-me-maybe](https://github.com/Zeky69/call-me-maybe) est une introduction au function calling avec LLM — base de réflexion pour cet agent.
