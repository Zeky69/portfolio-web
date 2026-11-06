## Le problème

Sur les MacBook récents, l'encoche occupe le haut de l'écran sans rien apporter. Sur iPhone, Apple en a fait la Dynamic Island. Pastille apporte la même idée au Mac : l'encoche devient une surface vivante qui s'agrandit quand une information compte, puis se rétracte.

## Ce que fait l'app

- **Lecture en cours** — pochette et spectre animé de part et d'autre de l'encoche, quelle que soit la source : Musique, Spotify, Deezer ou une vidéo YouTube dans le navigateur. À chaque morceau, la pastille s'élargit brièvement pour l'annoncer.
- **Vue détaillée au survol** — lecteur complet, événements du jour, météo, batterie des appareils Bluetooth et mode anti-veille.
- **Codes de vérification** — un code reçu par SMS, iMessage ou Mail apparaît avec le nom du service ; un clic le copie.
- **Notifications d'état** — AirPods connectés, chargeur branché, minuteur terminé, téléchargement en cours, volume, luminosité. Elles passent l'une après l'autre, sans jamais se chevaucher.
- **Personnalisation** — cinq styles de lecteur, trois styles d'agenda, fond Noir ou Liquid Glass (macOS 26), préréglages en un clic.

## Sous le capot

```
Sources/Pastille/
├── App/        lancement, réglages, apparence, diagnostic
├── Managers/   musique, agenda, codes, Bluetooth, mises à jour…
├── Pill/       fenêtre, forme animée, logique d'affichage
└── Views/      SwiftUI : Compact, Expanded, Music, Calendar…
```

Chaque source de données est un *manager* isolé qui publie son état ; la pastille décide seule de ce qui mérite d'être affiché et dans quel ordre, via une file de notifications.

Certaines fonctions reposent sur des interfaces non documentées de macOS (lecture en cours de toutes les apps, luminosité, minuteur de l'app Horloge). Si une mise à jour du système en casse une, elle passe en orange dans les réglages et le reste continue de fonctionner.

## Distribution

- **Mises à jour signées** : chaque version est signée en Ed25519. L'app vérifie la signature avant toute installation et refuse une archive modifiée.
- **Tests avant tout build** : `build.sh` lance la suite Swift Testing (détection des codes, lecture des mails, protection contre l'injection AppleScript, file de notifications, vérification des mises à jour). Si un test échoue, rien n'est installé.
- **Publication en une commande** : `./build.sh publish` compile, signe, archive et publie la release sur GitHub.

## Confidentialité

Tout est lu et traité en local. Deux requêtes réseau seulement : la météo (coordonnées arrondies à ~1 km) et la vérification des mises à jour, désactivable.
