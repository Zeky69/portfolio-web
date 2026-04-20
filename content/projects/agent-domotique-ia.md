# Agent Domotique IA

## Resume
Agent IA local pour maison connectee: comprehension d'intentions, sortie JSON structuree et execution via Home Assistant.

## Ce que la page doit montrer
- Pourquoi local: confidentialite et latence faible
- Pourquoi structure: actions robustes et tracables
- Pourquoi utile: pilotage naturel des appareils

## Stack
- Python
- Ollama / Mistral (local)
- FastAPI
- Home Assistant

## Reference GitHub pertinente
- [call-me-maybe](https://github.com/Zeky69/call-me-maybe): introduction au function calling avec LLM.

## Media temporaires
![Placeholder architecture agent domotique](https://placehold.co/1600x900/111118/818cf8?text=LLM+Local+%E2%86%92+JSON+%E2%86%92+Home+Assistant)

*Legende: cette image doit representer le schema d'architecture complet: utilisateur, LLM local, couche API, et actionneur domotique.*

![Placeholder GIF - commande vocale vers action](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjBheWU5d2ptYjh4b2F2dWJmZDB2M2NpdjI3YzVuNGRudzh2N2Q0YiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3o7TKsQ8UQh0gJ2f5C/giphy.gif)

*Legende: ce GIF doit representer une commande utilisateur transformee en action concrete (ex: allumer lumiere, fermer volets).* 

## Points forts a decrire
1. Schema strict pour le function calling
2. Gestion des erreurs d'intention
3. Journalisation des commandes
4. Mode securise pour actions sensibles
