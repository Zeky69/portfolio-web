# GameJAM Multijoueur

GameJAM Scientifique 2023 · Équipe de 7 · Jeu multijoueur en temps réel développé sous contrainte de temps.

## Contexte

Projet développé lors de la GameJAM Scientifique organisée à l'IUT. Contrainte : livrer un jeu jouable en quelques jours, en équipe de 7 personnes de profils différents (développeurs, designers, non-techniciens).

L'équipe s'est organisée en sous-groupes : deux personnes sur le backend réseau, trois sur le frontend et la logique de jeu, deux sur le game design et les assets.

## Ce qu'on a construit

Jeu multijoueur en temps réel où plusieurs joueurs se connectent depuis leurs navigateurs. L'état du jeu (positions, scores, événements) est synchronisé en continu via Socket.IO.

La contrainte principale était la **latence** : dans un jeu, un décalage de 200 ms entre ce que le joueur fait et ce qu'il voit rend l'expérience injouable. On a priorisé la réactivité côté client en affichant immédiatement l'action locale, puis en corrigeant si le serveur renvoie un état différent (reconciliation).

## Organisation sous contrainte

- **Découpage rapide des responsabilités** dès la première heure — pas de superposition sur les mêmes fichiers
- **Interface minimale mais jouable** — on a coupé plusieurs features pour finir proprement ce qu'on avait commencé
- Intégration continue informelle : chacun push, les autres testent en direct

## Stack

- **JavaScript** — logique de jeu frontend
- **Socket.IO** — synchronisation temps réel entre joueurs
- **HTML / CSS** — interface du jeu
