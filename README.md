# Gîte Saint-Aubin — site v1

Site du gîte de Claire Hugerot, 42C rue Saint-Aubin, 08000 Charleville-Mézières.
Cinq pages, français et anglais, sans réservation en ligne.

Le dossier de production (brief, contenus, photos sources) est dans
[`gite-saint-aubin/`](gite-saint-aubin/).

## En ligne

<https://allonzop.github.io/GiteBordDeMeuse/>

La maquette v0, celle que la cliente a validée le 04/09, reste consultable pour
comparaison : [`maquette-v0.html`](https://allonzop.github.io/GiteBordDeMeuse/maquette-v0.html).
Elle est en `noindex` pour ne pas concurrencer le site dans les moteurs de recherche.

⚠️ **Sur GitHub Pages, le formulaire n’envoie rien** : il est écrit pour Netlify
Forms, qui n’existe pas là-bas. L’envoi échoue et affiche le repli « écrivez-moi
à… ou appelez le… ». C’est voulu, et sans conséquence tant que le site n’est pas
sur Netlify.

## Voir le site en local

C’est du HTML statique : aucune dépendance, aucune étape de compilation.

```bash
python3 -m http.server 8000
# puis http://127.0.0.1:8000/
```

⚠️ Ouvrir les fichiers directement (`file://`) fonctionne, mais la bascule
FR/EN reste bloquée en français : le navigateur refuse de lire les dictionnaires
JSON hors d’un serveur. Passer par `http://` pour la tester.

## Les pages

| Fichier | Page | Ce qu’elle porte |
|---|---|---|
| `index.html` | Accueil | Accroche, chiffres, jardin → emplacement → accueil → maison, avis |
| `la-maison.html` | La maison | Pièces, chambres, équipements, **« bon à savoir »** |
| `le-jardin.html` | Le jardin & autour | Jardin 500 m², saisons, Voie Verte, place Ducale, Meuse |
| `ecologie.html` | Écologie | Kit Interreg « Ardenne Écotourisme », rénovation |
| `contact.html` | Contact | Formulaire de demande, téléphone, accès, carte |
| `mentions-legales.html` | Mentions légales | Obligation légale, hors forfait 5 pages |

## Arborescence

```
index.html · la-maison.html · le-jardin.html · ecologie.html · contact.html
mentions-legales.html · maquette-v0.html
assets/
  css/site.css        feuille de style unique
  js/i18n.js          bascule de langue
  js/site.js          apparitions, menu mobile, formulaire, dates
  i18n/fr.json        dictionnaire français (référence)
  i18n/en.json        dictionnaire anglais
  i18n/LISEZMOI.md    procédure pour une langue supplémentaire
photos/               41 photos, 800/1200/1600 px, WebP + repli JPEG
```

## Choix techniques

**Qui parle.** Le site est écrit à la voix impersonnelle. Claire, unique hôte,
parle à la première personne dans le seul bloc « Votre hôte » de l’accueil.
Les pluriels restants sont ceux des voyageurs : les avis, et l’exemple de
message dans le formulaire. Les nombres sont en chiffres, jamais en lettres.

**Langues.** Français et anglais. Le français est écrit en clair dans le HTML :
le site reste lisible sans JavaScript et les moteurs de recherche voient le vrai
texte. L’anglais vit dans `assets/i18n/en.json`. Une clé absente d’un
dictionnaire retombe sur le français — une traduction incomplète n’affiche
jamais de clé brute. Les deux dictionnaires portent exactement les mêmes clés,
vérifié à chaque génération.

La langue est choisie dans cet ordre : `?lang=` dans l’URL, puis le choix
précédent du visiteur, puis la langue de son navigateur, puis le français.

**Photos.** `<picture>` avec WebP en trois largeurs (800, 1200, 1600) et repli
JPEG en deux (800, 1200). Le repli s’arrête à 1200 px : il ne sert qu’aux
navigateurs sans WebP, trop rares pour justifier 14 Mo de fichiers
supplémentaires. `width`/`height` explicites pour que la page ne sursaute pas au
chargement, `loading="lazy"` partout sauf la première image de chaque page.

**Animations.** Apparition en fondu au défilement, léger agrandissement des
photos au survol, ombre de la barre haute une fois la page défilée. Uniquement
`opacity` et `transform`, que le navigateur traite sur le GPU sans recalculer la
mise en page ; aucun écouteur de défilement, un `IntersectionObserver` qui oublie
chaque élément dès qu’il est apparu. Tout part de l’état visible : sans
JavaScript, rien n’est caché. `prefers-reduced-motion` coupe l’ensemble.

Ces animations tournent dans le navigateur du visiteur : elles ne coûtent rien à
l’hébergement, sur Netlify comme ailleurs.

**Formulaire.** Pas de réservation ni de paiement en ligne : c’est une demande.
Prêt pour Netlify Forms (`data-netlify`, pot de miel anti-robots), avec repli
téléphone et e-mail si l’envoi échoue.

**Carte.** Coordonnées GPS réelles : `49.77913, 4.735605`.
La fiche Google Business de Claire pointe encore au mauvais endroit : cela se
corrige chez Google, pas sur le site.

**Couleurs.** Reprises de la maison — mur de cuisine orange, mur ocre, escalier
et cœur rouges, lambris, travertin. Tous les contrastes texte/fond ont été
vérifiés au niveau AA (≥ 4,5:1).

## Ce que l’audit photo a corrigé

Les descriptions de `gite-saint-aubin/photos/photos.json` annonçaient avoir été
« vérifiées à l’œil ». Pour les planches du kit Interreg, c’était faux. Après
lecture de chaque image :

- **quatre planches étaient mal orientées** — trois à 90°, une à 180° ;
- **trois portaient un nom qui ne correspondait pas à leur contenu** : ce que le
  manifeste appelait l’affiche « Rien que de l’eau ! » était la notice cuisine,
  la notice cuisine était celle de la salle de bain, et le « bandeau trilingue
  La nature commence ici » n’existe pas ;
- la photo de la base nautique montrait des baigneurs sautant dans le port : le
  cadre s’arrête maintenant avant eux ;
- le geste « ne jetez pas de lingettes », repris du manifeste, ne figure sur
  aucune planche. Il a été remplacé par le repère de baignoire, qui y figure.

Toutes les photos ont été régénérées depuis la meilleure source disponible, en
un seul ré-encodage, sans empiler les compressions.

## Décisions prises

- **Votre hôte : Claire seule**, mais pas tout le site au « je » : voix
      impersonnelle partout, sauf le bloc « Votre hôte » (review du 10/09).
- **Barbecue et fibre non affirmés** tant qu’ils ne sont pas confirmés ; le
      plancher chauffant au rez-de-chaussée, l’abri à vélos et le second WC
      extérieur sont ajoutés (review du 10/09).
- **Chambre du second : trois couchages.** Deux lits une personne installés en
  permanence, un troisième monté à la demande.
- **Pas de tarif.** Tant que l’annonce Airbnb n’en affiche pas, le site n’en
  affiche pas non plus.
- **Deux langues.** Pas de troisième pour l’instant. La procédure reste écrite
  dans [`assets/i18n/LISEZMOI.md`](assets/i18n/LISEZMOI.md) si le besoin vient.

## Reste à obtenir

La liste complète des points à faire confirmer par Claire est dans
[`QUESTIONS-POUR-CLAIRE.md`](QUESTIONS-POUR-CLAIRE.md).

- [ ] **Le SIREN de l’éditeur.** Les mentions légales portent le SIREN de KRAON
      au titre de la conception. Le numéro de l’activité de Claire manque.
- [ ] **Les avis.** Les trois extraits affichés sont reformulés et abrégés, ce que
      la page indique. À valider ou à remplacer par des citations exactes.
- [ ] **Le nom de domaine.** Une fois choisi et acheté, renseigner `<link
      rel="canonical">` et `<meta property="og:image">` (marqués en commentaire
      dans le `<head>` de chaque page), puis ajouter `robots.txt` et `sitemap.xml`.

À signaler à Claire, indépendamment du site :

- **Le lien Airbnb de sa bio Instagram est mort** : il renvoie sur l’accueil
  d’airbnb.fr. C’est son seul appel à l’action public.
- **Airbnb signale l’absence de détecteur de monoxyde de carbone**, alors que la
  maison a une cheminée. Cela s’installe, ça ne se rédige pas — le site n’en parle
  donc pas.

## Contrôles

Le site est vérifié à chaque génération :

- typographie française (insécables avant `: ; ! ?`, guillemets `« »`,
  apostrophes typographiques, ligature `œ`, majuscules accentuées, unités) ;
- typographie anglaise (pas d’espace avant la ponctuation double, point décimal),
  les citations françaises gardant leurs propres règles ;
- dictionnaires FR et EN portant exactement les mêmes clés ;
- aucun lien mort, aucune ancre morte, aucun identifiant dupliqué ;
- chaque image avec `alt`, `width`, `height`, `sizes` et `srcset` ;
- aucune erreur JavaScript, aucun débordement horizontal, de 320 px à 2560 px.
