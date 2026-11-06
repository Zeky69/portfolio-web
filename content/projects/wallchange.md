## Le principe

WallChange relie un parc de postes Linux à un serveur central. Sur chaque machine, un petit client en C reste connecté en WebSocket. Depuis un terminal ou depuis le panel web, on envoie une commande à un poste précis, ou à tous : elle s'exécute en temps réel à l'écran.

```
Panel React / CLI
      │  HTTPS (API REST + token)
      ▼
Serveur C (Mongoose)
      │  WebSocket
      ▼
Clients C — un par poste
      │
      ▼
Fond d'écran, effets, raccourcis, mises à jour
```

## Ce qu'on peut déclencher

Changer le fond d'écran (URL ou fichier envoyé), faire défiler une image ou un GIF, des particules qui suivent la souris, cent clones de curseur, une souris « ivre », des confettis ou une pluie d'images, des feux d'artifice, le logo DVD qui rebondit, un faux terminal, un écran inversé pendant trois secondes, un raccourci clavier… plus de 25 effets au total.

## Côté C

- **Serveur** : maintient la liste des clients connectés, expose l'API HTTP, route chaque commande vers le bon client ou la diffuse à tous. Notifications Discord optionnelles à la connexion et à la déconnexion.
- **Client** : se lance au démarrage de session, écoute les commandes, rend les effets à l'écran (X11) et se met à jour lui-même sur ordre du serveur.
- **Zéro framework** : Mongoose pour le réseau, cJSON pour les messages, stb_image pour les images.
- **Installation en une commande** : un script télécharge, compile, installe et configure le démarrage automatique.

## Sécurité

Authentification à deux niveaux : un token utilisateur, distribué automatiquement aux clients à leur connexion, et un token administrateur requis pour les actions sensibles (désinstaller un client, diffuser à tout le parc). Les tokens ont une durée de vie configurable et le CORS peut être restreint à l'origine du panel.

## Le panel

Interface React + TypeScript : liste des postes connectés avec leur version, sélection multiple pour les envois groupés, logs en direct, et statistiques (effets les plus utilisés, images populaires, postes les plus actifs).

La CI incrémente la version à chaque push et déploie le serveur ; les clients se mettent à jour à distance.
