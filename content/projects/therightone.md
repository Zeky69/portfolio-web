## Le besoin

Sur le marché de l'occasion, les bonnes annonces partent en quelques minutes. TheRightOne surveille en continu des recherches précises et prévient dès qu'une nouvelle annonce correspond.

## Fonctionnalités

- **Surveillance multi-plateforme** : Leboncoin et AutoScout24.
- **Une recherche, un thread** : chaque recherche tourne en arrière-plan avec son propre intervalle de vérification, sans bloquer l'interface.
- **Alerte immédiate** : chaque nouvelle annonce est poussée dans un salon Discord par webhook, un webhook par compte.
- **Comptes cloisonnés** : recherches, résultats, paramètres et journaux totalement isolés d'un compte à l'autre.
- **Administration** : création de comptes, rôles, activation, quotas (nombre de recherches, délai minimal, rétention des données).

## Tableau de bord

Interface React + Ant Design en thème sombre : annonces trouvées sur 30 jours, répartition par plateforme, annonces par recherche, distribution des prix (médiane, minimum, maximum), export CSV des résultats filtrés et journaux téléchargeables.

## Architecture

| Couche | Choix |
|---|---|
| API | FastAPI, threads de surveillance gérés par un manager |
| Temps réel | WebSocket vers l'interface |
| Données | SQLite en mode WAL, robuste sous écritures concurrentes, rétention automatique |
| Auth | JWT avec rôles, secret obligatoire en production |
| Front | React, Vite, Ant Design |

## Sécurité

Bannissement temporaire d'une IP après trois échecs de connexion, changement de mot de passe forcé au premier login de l'administrateur par défaut.

Projet auto-hébergé, dépôt privé — démonstration possible sur demande.
