# Site E-commerce

Projet académique · Groupe de 3 · 2022 · Premier projet fullstack en équipe — catalogue, panier, commandes.

## Contexte

Premier projet web fullstack développé en groupe de 3 personnes dans le cadre de la première année de BUT Informatique. L'objectif était de construire un site e-commerce fonctionnel de bout en bout : navigation dans un catalogue, ajout au panier, passage de commande, gestion des produits côté admin.

## Fonctionnalités

**Côté client**
- Catalogue avec filtres par catégorie et tri par prix
- Fiche produit avec description et images
- Panier persistant (session utilisateur)
- Processus de commande en plusieurs étapes

**Côté admin**
- Gestion du catalogue (ajout, modification, suppression de produits)
- Suivi des commandes avec changement de statut

## Architecture

```
Templates HTML (Django/Flask)
        ↓
Backend Python (Flask + Django)
        ↓
MySQL
```

Le backend gère le routage, la logique métier (calcul du panier, gestion des stocks) et la communication avec la base MySQL.

## Ce qu'on en a retenu

Projet fondateur sur plusieurs points : comprendre le cycle requête/réponse HTTP, structurer une base de données relationnelle (produits, catégories, utilisateurs, commandes, lignes de commande), gérer l'état utilisateur avec les sessions, et travailler sur une base de code partagée en équipe avec Git.

Les problèmes classiques du développement web sont apparus ici pour la première fois : conflits de merge, incohérences entre l'état du panier en session et la base, sécurisation basique des formulaires.

## Stack

- **Python** — backend et logique métier
- **Flask / Django** — framework web
- **MySQL** — base de données
- **HTML / CSS** — templates frontend
