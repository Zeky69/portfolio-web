## L'idée

À 42, tout le monde se compare au niveau, mais l'intra ne permet ni de se situer dans sa promo, ni de savoir précisément quoi faire pour rattraper quelqu'un. 42 Rank répond aux deux, en direct sur l'API officielle.

## Fonctionnalités

- **Classement** par campus et par année de piscine, trié par niveau, avec podium animé pour le top 3, eval points, wallet, statut en ligne et état du cursus.
- **Mode global** : tous les campus à la fois, avec badge pays.
- **Rang mondial** : ta position parmi tous les étudiants du réseau.
- **Duel projet par projet** : en face d'un rival, la liste exacte des projets qu'il a validés et pas toi, et un plan d'action.
- **Graphique de progression** du niveau dans le temps (Recharts).
- **Statistiques de fréquentation** en page d'accueil : actifs maintenant, membres, rétention.

## Architecture

Aucune base de données : l'application est un **proxy avec cache** au-dessus de l'API 42 v2.

| Élément | Choix |
|---|---|
| Framework | Next.js 14, App Router, Server Components |
| Auth | OAuth 42 `authorization_code`, scope `public` en lecture seule |
| Session | iron-session — cookie chiffré, httpOnly, sameSite=lax |
| Graphiques | Recharts |
| Styles | CSS pur, aucun framework UI |

Quand le jeton expire, l'API renvoie un 401 : le code lève une `TokenExpiredError` qui déconnecte proprement l'utilisateur au lieu d'afficher une erreur.

Les pages lourdes sont découpées en *shell* + composant de données avec squelettes de chargement, pour que la page s'affiche immédiatement pendant que l'API répond.

## Déploiement

Chaque push sur `master` déclenche une GitHub Action qui se connecte en SSH au serveur, reconstruit l'application et la relance avec PM2.
