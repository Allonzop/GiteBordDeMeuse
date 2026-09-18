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
  js/site.js          apparitions, tiroir de navigation, saisons, formulaire, dates
  i18n/fr.json        dictionnaire français (référence)
  i18n/en.json        dictionnaire anglais
  i18n/LISEZMOI.md    procédure pour une langue supplémentaire
photos/               37 photos, 800/1200/1600 px, WebP + repli JPEG (+ 1920 px pour le hero)
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
JPEG en deux (800, 1200) ; la photo de fond du hero a en plus un WebP de 1920 px. Le repli s’arrête à 1200 px : il ne sert qu’aux
navigateurs sans WebP, trop rares pour justifier 14 Mo de fichiers
supplémentaires. `width`/`height` explicites pour que la page ne sursaute pas au
chargement, `loading="lazy"` partout sauf la première image de chaque page.

**Largeurs.** Le conteneur fait 1 320 px et le texte s’arrête à 78 caractères
par ligne : au-delà de 90, l’œil perd la ligne au retour. Ce sont les blocs
visuels — galeries, bandeaux, cartes, chiffres clés — qui s’élargissent jusqu’à
1 560 px sur grand écran, et passé 1 600 px de large c’est la police qui monte
d’un cran, pas la mesure. Sous 1 000 px, tout prend la largeur de l’écran.

**Menu mobile.** Un tiroir fixé au bord droit, qui s’ouvre depuis n’importe
quel point de la page : glissement sur `transform` seulement, voile cliquable,
page bloquée pendant l’ouverture (largeur de l’ascenseur compensée), focus
gardé dans le tiroir et rendu au bouton, fermeture par Échap, par le voile ou
par un lien. Fermé, il est `visibility:hidden`, donc hors du parcours clavier.
Le bouton « Demander des dates » et sa ligne de réassurance sont en bas du tiroir.

**Saisons.** Sur Le jardin, un comparateur « la même vue, à trois saisons » :
trois points de vue (le séjour vers le jardin, la maison depuis le jardin,
l’allée), trois onglets Été · Automne · Hiver. Les trois saisons sont empilées
dans un cadre au format fixe, seule l’active est opaque : changer d’onglet est
un fondu de 400 ms, sans chargement ni saut. Onglets pilotables aux flèches.
Sans JavaScript, l’été s’affiche et les onglets restent cachés. Un quatrième
onglet « Printemps » est écrit dans le HTML, caché (`hidden`) : il suffit de
retirer l’attribut et d’ajouter les trois photos quand Claire les envoie.

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

**Partage.** Chaque page porte `og:url` et `og:image` en URL absolue, pour
que le lien montre une photo quand il est envoyé par messagerie ou partagé.
L’adresse vient d’une seule constante du générateur (`BASE_URL`), à changer
le jour du nom de domaine, en même temps que `<link rel="canonical">`.

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
  aucune planche. Il avait été remplacé par le repère de baignoire ; l’audit du
  11/09 a relevé que la maison n’a pas de baignoire. Il reste cinq gestes.

Toutes les photos ont été régénérées depuis la meilleure source disponible, en
un seul ré-encodage, sans empiler les compressions.

## Décisions prises

- **Votre hôte : Claire seule**, mais pas tout le site au « je » : voix
      impersonnelle partout, sauf le bloc « Votre hôte » (review du 10/09).
- **Réponses de Claire du 18/09, intégrées** : Wi-Fi par la fibre, barbecue
  (sauf en période de canicule), portillon de sécurité en haut de l’escalier,
  détecteur de monoxyde de carbone, maison des années 1920, fraises et
  framboises en plus des groseilles, pas de baignoire. **La cheminée n’est pas
  utilisable** : elle n’est plus citée nulle part, ni dans les textes, ni dans
  les meta, ni dans le JSON-LD ; si elle apparaît sur une photo, c’est du
  décor. Les mentions légales portent maintenant le SIREN de Claire
  (entrepreneur individuel), KRAON restant crédité pour la conception.
- Plancher chauffant, abri à vélos et second WC extérieur ajoutés d’après la
  visite du 09/09, confirmés depuis.
- **Chambre du second : trois couchages.** Deux lits une personne installés en
  permanence, un troisième monté à la demande.
- **Pas de tarif.** Tant que l’annonce Airbnb n’en affiche pas, le site n’en
  affiche pas non plus.
- **Deux langues.** Pas de troisième pour l’instant. La procédure reste écrite
  dans [`assets/i18n/LISEZMOI.md`](assets/i18n/LISEZMOI.md) si le besoin vient.

Audit du 11/09, appliqué le même jour :

- **Les notes sont données séparément** dès le hero : 4,8/5 sur Google, 4,77/5
  sur Airbnb, 85 avis en tout. Plus de moyenne qui laisse croire à 4,8 sur 85.
- **Les avis sont cités une fois avec des chiffres**, deux fois en passant. Le
  jardin est l’argument, l’accueil vient ensuite ; « 500 m² » ne fait plus deux
  titres identiques.
- **Une ligne de réassurance sous chaque « Demander des dates »** — « Réponse en
  quelques heures, avec les disponibilités et le tarif. Sans engagement. » —
  y compris dans le tiroir et, en texte masqué relié par `aria-describedby`,
  sur la barre mobile.
- **La salle de bain est au premier étage** partout (elle était « sous les
  combles » à un endroit). Il n’y a pas de baignoire : le geste correspondant
  est retiré de la page Écologie.
- **Le barbecue est parti aussi des `<meta description>` et du JSON-LD**, où il
  avait survécu à la review du 10/09.
- **Chaque photo n’apparaît qu’une fois par page.** L’emplacement, sur
  l’accueil, montre la Meuse et ses bateaux ; la galerie de La maison ne répète
  plus le séjour ; quatre photos redondantes sont retirées (41 → 37).
- **La barrière d’escalier n’est pas affirmée** : l’audit proposait de la
  mettre en avant dans l’argument famille, mais rien ne la confirme. Elle est
  dans les questions pour Claire.
- **Le hero de l’accueil est en fond photo** à partir de 900 px de large,
  décision d’Allonzo après essai : la photo du jardin couvre la section, deux
  dégradés par-dessus (lisibilité, puis teinte brune depuis le haut à gauche),
  le texte au-dessus. Contraste du titre et du sous-titre vérifié ≥ 4,5:1 sur
  le pixel le plus clair, de 1 024 à 2 560 px. Sous 900 px, la photo passe sous
  le texte, pleine largeur : sur un téléphone, un fond sous un voile ne montre
  rien. L’original fait 1 920 px ; au-delà de 1 920 px d’écran il est agrandi.
  Un original d’au moins 2 400 px est demandé à Claire.
- **La Meuse à Vélo : 130 km jusqu’à Givet**, puis le réseau belge (et non
  « 85 km jusqu’à la frontière »). Rimbaud : le musée est dans le vieux moulin,
  la maison où il a vécu est sur le même quai ; sa tombe est au cimetière, pas
  sur la promenade.
- **Crédit photo réduit à ce qui est sûr** : « Photographies : Claire Hugerot,
  et Allonzo Pensa pour les vues d’intérieur prises sur place. » La provenance
  des vues extérieures est à confirmer.
- **Anglais** : `%` collé au nombre, contractions d’usage (`it’s`, `you’ll`,
  `doesn’t`) sauf dans les mentions légales et le « bon à savoir », calques du
  français réécrits, `contact.f.ok` aligné sur le français.

## Reste à obtenir

La liste complète des points à faire confirmer par Claire est dans
[`QUESTIONS-POUR-CLAIRE.md`](QUESTIONS-POUR-CLAIRE.md).

- [ ] **Les avis.** Les trois extraits affichés sont reformulés et abrégés, ce que
      la page indique. À valider ou à remplacer par des citations exactes.
- [ ] **Le nom de domaine.** Une fois choisi et acheté, changer `BASE_URL`
      dans le générateur, ajouter `<link rel="canonical">` (emplacement marqué
      en commentaire dans le `<head>`), puis `robots.txt` et `sitemap.xml`.

À signaler à Claire, indépendamment du site :

- **Le lien Airbnb de sa bio Instagram est mort** : il renvoie sur l’accueil
  d’airbnb.fr. C’est son seul appel à l’action public.
- **Airbnb signale l’absence de détecteur de monoxyde de carbone.** Claire
  confirme qu’il y en a un : c’est sa fiche Airbnb qui est à mettre à jour.

## Contrôles

Le site est vérifié à chaque génération :

- typographie française (insécables avant `: ; ! ?`, guillemets `« »`,
  apostrophes typographiques, ligature `œ`, majuscules accentuées, unités) ;
- typographie anglaise (pas d’espace avant la ponctuation double, point décimal),
  les citations françaises gardant leurs propres règles ;
- dictionnaires FR et EN portant exactement les mêmes clés, aucune valeur
  vide, chaque clé du HTML présente, et la liste des valeurs identiques dans les
  deux langues (noms propres attendus, traduction oubliée sinon) ;
- aucun lien mort, aucune ancre morte, aucun identifiant dupliqué ;
- chaque image avec `alt`, `width`, `height`, `sizes` et `srcset`, et aucune
  photo utilisée deux fois sur une même page ;
- aucune erreur JavaScript, aucun débordement horizontal, de 320 px à 2560 px ;
- le tiroir mobile ouvert depuis le milieu de la page la plus longue (focus,
  Échap, voile, lien), les onglets de saisons (fondu, clavier, défilement sur
  téléphone) et les largeurs sur grand écran, en navigateur automatisé.

Le formulaire, lui, n’est pas testable ici : il ne fonctionnera que sur Netlify.
Il reste à essayer le menu sur un vrai téléphone, iOS et Android.
