# WallChange

Projet personnel · 2026 · Changement de fond d'écran à distance via WebSocket — serveur C, multi-clients, API HTTP.

[Dépôt GitHub](https://github.com/Zeky69/WallChange)

## Contexte

Outil personnel dans la continuité de l'[outil d'administration système](/projects/outil-administration-systeme-distante) : piloter des postes à distance depuis un point central. WallChange cible spécifiquement l'affichage — changer le fond d'écran de n'importe quelle machine du réseau via une simple requête HTTP.

## Comment ça marche

Chaque machine cible fait tourner un **client** qui se connecte au serveur via WebSocket et attend des instructions. Quand le serveur reçoit une commande (via HTTP), il la route vers le bon client qui applique le changement.

```
curl "http://localhost:8000/api/send?id=bureau&url=https://example.com/image.jpg"
        ↓
Serveur C (Mongoose)
        ↓ WebSocket
Client C (machine "bureau")
        ↓
Fond d'écran changé
```

## Architecture

**Serveur** (`server/`) — processus central en C qui gère les connexions WebSocket entrantes et expose une API HTTP. Chaque client se connecte avec un identifiant unique. Quand une requête HTTP arrive avec un `id` et une `url`, le serveur retrouve le client correspondant et lui envoie la commande.

**Client** (`wallchange/`) — agent léger en C qui tourne sur chaque poste administré. Se connecte au serveur au démarrage, reste en écoute, télécharge l'image à l'URL reçue et l'applique comme fond d'écran. Le script d'installation configure le démarrage automatique au boot.

## Ce qui était technique

**Mongoose** — bibliothèque C/C++ légère qui gère à la fois le serveur HTTP et le WebSocket dans le même processus, sans dépendances lourdes.

**cJSON** — parsing et sérialisation JSON en C pur pour les messages échangés entre client et serveur.

**Multi-clients.** Le serveur maintient une table des connexions actives indexées par ID. Une diffusion simultanée à plusieurs postes est possible en itérant sur tous les clients connectés.

**Démarrage automatique.** Le script d'installation crée un service système pour que le client redémarre automatiquement après un reboot de la machine.

## Stack

- **C / C++** — serveur et client
- **WebSocket** — communication temps réel (bibliothèque Mongoose)
- **HTTP** — API de commande
- **cJSON** — sérialisation des messages
