# À copier-coller dans Claude Code

---

Le dossier gite-saint-aubin/ contient tout le brief d'un site à produire pour une
cliente. Lis d'abord, dans cet ordre : gite-saint-aubin/README.md, BRIEF.md,
contenu/annonce-airbnb.md, contenu/infos-pratiques.md, contenu/maquette-v0.md et
photos/MANIFEST.md. Ne commence pas à coder avant.

Le site actuel est index.html, à la racine du dépôt : c'est la maquette que la cliente a
validée. Tu pars de là, tu ne repars pas de zéro.

Ce que tu dois faire :

1. Réécrire l'accroche du hero. Elle contient « la Meuse derrière le mur », qui est
   exactement la formulation que la cliente déteste (BRIEF.md §2.1). Le même mot revient
   dans le premier avis Google cité en bas de page. Propose-moi trois accroches avant
   d'en choisir une.
2. Passer de la page unique aux cinq pages du BRIEF.md §4, en gardant le design existant.
3. Lance d'abord `python gite-saint-aubin/photos/download_sources.py` : il récupère les
   41 photos de l'annonce Airbnb, qui sont la meilleure source et doivent fournir le hero.
   Puis `python gite-saint-aubin/photos/import_photos.py` pour leurs versions web. Si le
   réseau bloque, dis-le-moi et travaille avec ce qui est déjà dans photos/web/.
4. Place les photos en t'appuyant sur photos/photos.json : chaque entrée porte une
   description en français dans alt_fr, et photos/MANIFEST.md dit lesquelles sont les
   meilleures et pour quelle section. Traduis les alt en anglais au passage.
5. Ordre des arguments : le jardin d'abord, l'emplacement ensuite, l'accueil de Claire en
   troisième. C'est ce que comptent ses 62 avis Airbnb, pas une intuition. La maquette
   ouvre sur la maison : inverse.
6. Ajoute un « bon à savoir » honnête sur les escaliers raides et l'accès à la salle de
   bain par la chambre du 1er. La moitié de ses avis le citent, Airbnb l'affiche déjà.
7. Page écologie : appuie-toi sur le kit Interreg « Ardenne Écotourisme » décrit dans
   photos/MANIFEST.md — sablier de douche, carafe d'eau, contenants zéro déchet. Des
   gestes concrets, pas un discours.
8. Angle éditorial famille, aucune réservation en ligne, FR + EN seulement pour l'instant
   (structure i18n prête pour une troisième langue).
9. Reprends la palette chaude de la maison : orange, ocre, rouge, bois. Pas de gris-beige
   neutre, la maison ne ressemble pas à ça.
10. Carte aux vraies coordonnées : 49.77913 / 4.735605.
11. Mentions légales : SIREN 950 813 659, TVA non applicable, article 293 B du CGI.

Contrainte non négociable : la cliente est très rigoureuse sur l'orthographe et la
syntaxe. Relis chaque texte FR et EN, typographie française comprise — espaces
insécables, guillemets français, majuscules accentuées.

Quand c'est prêt, sers le site en local et montre-moi.
