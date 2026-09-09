# Gîte Saint-Aubin — dossier de production du site (client KRAON #3)

Tout ce qu'il faut pour construire la v1 du site de Mme Claire Hugerot. Aucune
dépendance à Gmail, à Notion ni à un poste de travail : les photos sont dans le dépôt.

## Ordre de lecture

1. `BRIEF.md` — le brief client. **À lire en entier avant d'écrire une ligne.**
2. `contenu/annonce-airbnb.md` — son annonce Airbnb et ce que ses 62 avis disent.
3. `contenu/infos-pratiques.md` — équipements, tarifs, accès, GPS.
4. `contenu/maquette-v0.md` — le texte intégral de la maquette qu'elle a validée.
5. `photos/MANIFEST.md` — ce que montre chaque photo, et laquelle sert à quoi.

## Les photos

`photos/web/` contient **33 photos** déjà optimisées, en 1600 px, JPEG + WebP :

- **28 envoyées par la cliente** le 04/09 (intérieur, chambres, jardin, saisons, et le
  kit d'autocollants de son label écotouristique)
- **5 prises sur place par Allonzo** le 09/09 (`13-allonzo-rdv/`)

`photos/photos.json` donne pour chacune ses dimensions réelles, son orientation et une
description en français dans `alt_fr`. **Elles ont toutes été regardées** — les
descriptions ne sont pas devinées d'après un nom de fichier.

Les originaux pleine résolution ne sont pas dans le dépôt (114 Mo). Si une photo doit
être recadrée plus large que 1600 px, demander à Allonzo.

## Les photos qui ne sont pas encore là

`python photos/download_sources.py` récupère, si le réseau est disponible :

- **41 photos de l'annonce Airbnb** → `photos/originaux/12-airbnb/` — la meilleure source,
  c'est de là que doit venir le hero
- 7 photos du site Wix actuel, 17 vignettes de la fiche ADT Ardennes

Puis `python photos/import_photos.py` génère leurs versions web.

## Ce qui reste à demander à la cliente

- Qui signe la page « votre hôte » : Claire seule, ou « Claire et Olivier »
- La troisième langue : néerlandais plutôt qu'allemand (voir `BRIEF.md`)
- La capacité réelle de la chambre du 2e : deux lits sur les photos, trois annoncés
- Les tarifs à afficher, s'ils doivent l'être
