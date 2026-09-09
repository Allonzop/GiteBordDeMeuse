# Les 28 photos de Claire Hugerot

Envoyées le **jeudi 4 septembre 2026, entre 19h18 et 20h22**, en 13 mails séparés,
hors du fil de prospection, **sans un mot de texte**. Uniquement des pièces jointes.

⚠️ **Personne n'a encore regardé ces images.** Les catégories ci-dessous viennent
uniquement du sujet des mails. À vérifier à l'œil après import.

| # | Heure | Sujet du mail | Fichiers | Rangé dans |
|---|---|---|---|---|
| 1 | 19:18 | Photos prises aujourd'hui | `1000042339.jpg` `1000042342.jpg` | `01-a-trier/` |
| 2 | 19:19 | Suite photos | `1000042341.jpg` `1000042338.jpg` `1000042340.jpg` | `01-a-trier/` |
| 3 | 19:20 | Suite : cuisine | `1000042337.jpg` | `02-cuisine/` |
| 4 | 19:21 | Chambre parentale | *(aucune pièce jointe — oubli, corrigé 45 s plus tard)* | — |
| 5 | 19:21 | Chbre parentale avec photos | `0ad22bb6-…-1_all_11472.jpg` `1000042332.jpg` | `03-chambre-parentale/` |
| 6 | 19:23 | Chambre enfants | `1788542582604.jpg` `1788542582617.jpg` | `04-chambre-enfants/` |
| 7 | 19:25 | Photos d'hiver | `1788542730026.jpg` `1788542730037.jpg` | `07-saison-hiver/` |
| 8 | 19:27 | Chambre enfants et sdb | `1788542849523.jpg` `1788542849537.jpg` `1788542849509.jpg` | `05-chambre-enfants-sdb/` |
| 9 | 19:28 | Automne | `1788542917559.jpg` `1788542917524.jpg` `1788542917539.jpg` | `08-saison-automne/` |
| 10 | 19:31 | Automne suite | `1788543038947.jpg` `1788543038938.jpg` | `08-saison-automne/` |
| 11 | 19:32 | Le jardin (c'est la dernière !) | `1788543140153.jpg` | `06-jardin/` |
| 12 | 20:22 | Les pictos | `1000042357.jpg` `1000042358.jpg` `1000042356.jpg` | `09-pictos/` |
| 13 | 20:22 | Explication des pictos | `0ad22bb6-…-1_all_11495.jpg` `1000042361.jpg` `1000042360.jpg` `1000042359.jpg` | `09-pictos/` |

**Total : 28 fichiers, 12 mails avec pièces jointes.** Poids brut ≈ 150 Mo (originaux
de téléphone, 4 à 8 Mo pièce). Le script `import_photos.py` génère les versions web.

## Ce que les photos montrent vraiment — vérifié à l'œil le 09/09

Toutes ont été ouvertes et décrites. Les descriptions sont dans `manifest.json` (clé
`descriptions`) et se retrouvent pré-remplies dans `alt_fr` de `photos.json`.

**Les meilleures, par ordre d'utilité :**

| Fichier | Ce que c'est | Usage |
|---|---|---|
| `1000042342.jpg` | La façade vue du jardin, bardage clair, extension vitrée, allée pavée | Photo d'identité de la maison |
| `1000042339.jpg` | Pièce à vivre, baies vitrées plein cadre sur le jardin (panoramique 4000×1800) | **Candidat hero** — le format panoramique tombe parfaitement pour un bandeau |
| `1000042338.jpg` | Table, chaises paillées, cheminée, sol travertin (panoramique) | Section « la maison » |
| `1000042341.jpg` | Vue depuis l'entrée : escalier rouge, salle à manger, salon | Montre le volume d'un coup |
| `1788543140153.jpg` | Le jardin en été, fauteuil rouge sur la pelouse | Section jardin |
| `1788542730026.jpg` | Le salon en hiver, jardin enneigé derrière les baies | La preuve du « magnifique en toute saison » |
| `1788542917524.jpg` | Le salon en automne, feuilles sur l'allée | Idem, l'autre saison |
| `1788542849537.jpg` | Salle de bain : douche à l'italienne, WC suspendu, poutre | Seule photo de la sdb |

**Trois choses qu'on ne savait pas :**

- **Un lit parapluie bébé est monté dans la chambre du 2e** (`1788542582617.jpg`). Le
  « matériel bébé » de l'annonce n'est pas une case cochée, c'est visible sur la photo.
- **Deux lits une personne visibles**, pas trois, alors que l'annonce Airbnb annonce
  « 3 lits simples ». À faire confirmer avant d'écrire une capacité.
- **Le jeu de lumières colorées était allumé pendant sa séance photo aussi**
  (`1788542582604` et `...617`) : ces deux-là sont abîmées comme celle d'Allonzo.
  Les photos utilisables de la chambre du 2e sont les trois de `05-chambre-enfants-sdb/`.

## Les « pictos » : ce n'était pas ce qu'on croyait

Les 7 images des deux derniers mails **ne sont pas un jeu d'icônes pour le site**.

C'est le **kit d'autocollants du programme Interreg « Ardenne Écotourisme »** qu'elle
appose dans le gîte : sablier de douche 5 minutes dans la salle de bain, « ne jetez pas
de lingettes » aux toilettes, carafe d'eau et contenants zéro déchet en cuisine,
« éteindre le chauffage avant d'ouvrir les fenêtres » dans les pièces de vie, ampoules.
Logos Interreg, Accueil Champêtre en Wallonie, Ardennes de France, RND Pierre + Bois.

L'affiche principale dit : **« Rien que de l'eau ! 100 % ARDENNE 0 % DÉCHET / Just Water!
100% ARDENNE 0% WASTE / Gewoon Water! 100% ARDENNEN 0% AFVAL »** — trilingue
**français, anglais, néerlandais**.

Deux conséquences directes :

1. **La page écologie a de la matière concrète** : des gestes affichés dans les pièces,
   pas un discours. C'est exactement ce qu'il fallait, puisqu'elle dit que ses clients
   n'accrochent pas sur l'écologie — des gestes se racontent, des principes non.
2. **Le kit officiel de son label est en FR / EN / NL.** Le débat allemand contre
   néerlandais est tranché par ses propres documents.

---

## Les autres sources de photos

Ses 28 mails ne sont pas la seule matière. `python photos/download_sources.py` récupère
automatiquement ce qui est accessible :

| Source | Volume | Qualité | Dossier |
|---|---|---|---|
| **Airbnb** | **41 photos** | la meilleure, d'après le RDV du 04/09 | `12-airbnb/` |
| Site Wix actuel | 7 photos | grandes, jusqu'à 4032 × 3024 | `10-wix-site-actuel/` |
| Fiche ADT Ardennes | 17 photos | petites (380 × 250 à 800 × 520) | `11-adt-ardennes/` |
| **Photos d'Allonzo sur place** | 5 photos | déjà dans le dossier | `13-allonzo-rdv/` |
| Instagram @gite_ardennes | ~qqs posts | correcte | à la main, connexion requise |
| Fiche Google Business | ? | variable, photos d'hôtes incluses | à la main |

### Airbnb — trouvée

**https://www.airbnb.fr/rooms/17429584** — « Gîte de charme en bord de Meuse ».
Retrouvée le 09/09 par le lien en bio de son Instagram, puis confirmée par recherche.
Les 41 URLs de photos sont déjà dans `manifest.json` : `download_sources.py` les tire en
pleine résolution (`?im_w=1920`) sans rescraper la page. Rien à faire de plus.

Le lien court `abnb.me` de sa bio Instagram, lui, est mort — il renvoie sur l'accueil
d'Airbnb. À lui signaler.

### ADT Ardennes — dépannage seulement

Les 17 photos de la fiche touristique sont servies en vignettes. Le script tente d'abord
des variantes plus grandes dans l'URL avant de se rabattre. À traiter comme une réserve :
ça dépanne pour une vignette de section, jamais pour un hero.


---

## Les 5 photos prises par Allonzo sur place (09/09)

Déjà dans `photos/originaux/13-allonzo-rdv/`, rien à télécharger. Toutes en lumière
artificielle : elles complètent, elles ne portent pas. **Les heros viennent d'Airbnb.**

| Fichier | Ce qu'on voit | Usage |
|---|---|---|
| `chambre-enfants-jeu-de-lumieres.jpg` | La chambre du 2e avec la boule à facettes allumée | ❌ **Inexploitable** : les lits sont couverts de taches vertes et rouges |
| `chambre-enfants-veilleuses.jpg` | Applique cœur rouge, applique lune, petite toile d'un arbre | ✅ Le meilleur des cinq. Format paysage, parfait en bandeau « pour les familles » |
| `veilleuse-lune.jpg` | La lune seule, allumée | ✅ Vignette ou transition de section |
| `cuisine-ensemble.jpg` | Induction, hotte inox, lave-vaisselle, colonne four + micro-ondes, sol pierre, mur orange | ✅ Seule vue d'ensemble récente de la cuisine. Cadrage chargé à droite, à recadrer |
| `cuisine-cafetiere-bouilloire.jpg` | Cafetière filtre isotherme et bouilloire, mur ocre | ✅ Détail d'équipement |

### Trois choses que ces photos apprennent

- **La chambre du 2e est équipée pour les enfants** : veilleuse lune, cœur lumineux,
  jeu de lumières colorées. Ça ne figure nulle part — ni sur l'annonce Airbnb, ni sur le
  Wix, ni dans la maquette. **C'est un argument famille gratuit, à raconter en texte
  puisque la photo est inutilisable.**
- **La maison a une vraie palette chaude** : mur de cuisine orange, mur ocre, cœur rouge,
  lune orange. Le site doit reprendre ces accents plutôt qu'une palette sage et neutre.
- ⚠️ **Deux lits visibles dans la chambre du 2e**, alors que l'annonce Airbnb annonce
  « 3 lits simples ». À vérifier auprès de Claire avant d'écrire une capacité sur le site.
