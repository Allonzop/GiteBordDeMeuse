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
| `le-jardin.html` | Le jardin et les environs | Jardin 500 m², saisons, Voie Verte, Place Ducale, Meuse |
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
photos/               44 photos, 800/1200/1600 px, WebP + repli JPEG (+ 1920 px pour le hero)
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

Retours de Claire du 22/09, appliqués le même jour (textes, puis photos au
fur et à mesure de l’arrivée des fichiers) :

- **Les 17 photos de l’index du 22/09 sont reçues et intégrées, sauf doublons.**
  La maison : grande chambre, chambre du 2e, salon en fin de journée (bandeau
  de la pièce à vivre, à la place du panoramique), salle à manger, tiroir de
  la cuisine (avec une phrase sur son contenu, écrite d’après la photo), salle
  de bain sous la poutre, salle de bain vue du lit (sous le « bon à savoir »),
  second WC (carte « La salle de bain »), portillon (section famille). Le
  jardin et les environs : jardin au printemps, séjour en automne (comparateur
  de saisons), Voie Verte au saule (bandeau « Autour du gîte ») et Voie Verte
  le long de la Meuse, port de plaisance, Meuse et sa péniche (galerie des
  environs, à quatre colonnes), Vieux Moulin (carte Rimbaud), aire de jeux
  (carte Mont-Olympe). Les vues Airbnb de la Voie Verte, du chemin des berges,
  de la base nautique et des bateaux sont retirées au profit de celles de
  Claire ; 43 photos au total. Reçues mais non placées, une seule photo par
  sujet : la plaque à induction, six autres vues de la salle de bain, une
  seconde vue du tiroir, la passerelle du musée Rimbaud.

- **« Le jardin et les environs »** partout (menu, titres, meta).
- **Capacité « 2 à 5 personnes + 1 bébé »** partout, meta et JSON-LD compris.
- **Voie Verte : 130 km**, vers Sedan et Mouzon en amont, jusqu’à Givet en
  aval ; « Place Ducale » avec majuscule ; « arrêt de bus de la ligne 7 ».
- **Réassurance** : « Réponse rapide, avec les disponibilités et le tarif. »
- **Hero** : « Une maison ouverte sur un grand jardin à deux pas de la Meuse »,
  sans point final ; photo avant le texte sur téléphone.
- **Jamais « vieux mur »** (toujours « mur de pierre »), jamais « derrière »
  à propos du mur ou de la Meuse ; écureuil au singulier ; « fraises des bois ».
- **La maison** : « années 20 », pièce à vivre réécrite, « bon à savoir »
  raccourci (les escaliers, la salle de bain par la chambre, le lavabo du
  second, l’accessibilité), section famille « Pour les familles ou les amis ».
- **Écologie** : cinq gestes → quatre (« Partout » supprimé), « Pour aérer ».
- **Liens officiels** en bas de « Autour du gîte » : ADT des Ardennes, Office
  de tourisme de Charleville-Mézières, Ardenne Écotourisme (URL vérifiées).
- **Cartes d’activités** : la mention orange (distance / temps) au-dessus du
  titre ; les titres avaient une couleur héritée du fond sombre et étaient
  invisibles, corrigé.

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
- **Le hero de l’accueil est en fond photo** à partir de 900 px de large.
  Claire veut **rien sur la photo** : ni voile, ni dégradé, ni cartouche
  (redit par Allonzo le 23/09). Sans rien, le texte tombait sur les roses
  pâles et devenait illisible. Solution du 23/09 : la photo n’est pas
  touchée, ce sont **les lettres qui portent leur propre contour sombre**
  (`paint-order:stroke fill` + `-webkit-text-stroke`, 2,5 px sur le titre,
  1,6 px sur le reste) avec un halo léger. Le texte se détache ainsi de
  n’importe quelle zone, claire ou sombre. Un dégradé localisé (22/09) et un
  cartouche translucide ont été essayés et écartés pour cette raison. Sous
  900 px, la photo vient **avant** le texte, pleine largeur. L’original fait
  1 920 px ; au-delà, il est agrandi.
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

### 22/09 (soir) — vérification croisée avant l’envoi à Claire

Audit croisé du site contre chaque source (mail de Claire du 22/09, réponses
du 14/09, rapport du RDV du 18/09, spécification du 22/09) : tout est
appliqué, sauf les écarts suivants, corrigés ce soir.

- **« Ouverture : toute l’année »** restait dans le tableau « Le séjour » de
  la page Contact ; Claire avait dit le 18/09 que ce n’est pas vrai (retouche
  11, déjà appliquée sur les deux autres pages). Ligne retirée, FR et EN.
- **Légendes sans virgule** : « La maison vue du jardin », « Les groseilliers
  en juin », « La Place Ducale à 10 minutes », « Le second WC à côté de l’abri
  à vélos ». La légende « Second étage : deux lits en place, un troisième à la
  demande » garde sa virgule : Claire l’a relue et voulue telle quelle.
- **Virgule avant « et »** retirée dans quatre énumérations : « 85 avis et
  100 % de demandes répondues », « 23 avis sur Google, 62 sur Airbnb et un
  taux de réponse de 100 % », « des entreprises des Ardennes et des matériaux
  naturels… », « Ambiance village et tous les commerces… ».
- **Avis** : « Extraits reformulés et abrégés » (et non « traduits », qui
  n’est vrai que pour la version anglaise).
- **Anglais** : « Airing the room » pour « Pour aérer » (l’anglais disait
  « Before airing »), « stone wall at the far end » (plus de « behind »),
  « 2 to 5 guests + 1 baby » partout.
- **Mentions légales** : hébergeur réel (GitHub Pages, tant que le site n’est
  pas sur Netlify), formulaire décrit sans nommer un service pas encore
  branché, crédits photo exacts (Place Ducale et bateaux sur la Meuse repris
  de l’annonce, libres de droits selon Claire).
- **Relecture anglaise** : « aquatic centre » pour le centre aquatique (le
  « water sports centre » reste la base nautique), « Aquatic centre and
  wellness area » (plus de « spa » inventé), « guests are gladly pointed to
  the local country markets », « recycling » (et non « sorting »), « living
  areas », « business travellers », « a terrace level with the living room »,
  « step-free terrace », « redcurrants », point-virgule dans l’intro des
  saisons, « for the garden’s other residents », « permanently in place ».
- **Formulaire en anglais** : les messages de réussite et d’échec (`data-ok`,
  `data-ko`, affichés par `site.js`) restaient en français. `i18n.js` et
  `extraire.py` connaissent maintenant `data-i18n-ok` et `data-i18n-ko`
  (clés `contact.f.ok`, `contact.f.ko`). Même chose pour le numéro de
  téléphone du pied de page et du bloc Contact (`commun.tel`) : « +33 6 48 90
  45 09 » en anglais.
- **Écologie** : sur-titre « Le programme » (le site n’affiche aucun label),
  carte Cuisine retitrée « Pique-nique, tri et compost » pour ne pas répéter
  la phrase de Claire placée dessous.
- **Relecture française** (aucune faute avérée) : « Pas de circulation de
  passage » (et non « Aucune circulation », les riverains roulent), « le
  jardin fleurit » (le « il » n’avait pas d’antécédent clair), « la Voie
  Verte au bout de la rue » dans le chapô du hero (le « à deux pas » y
  était deux fois depuis la nouvelle phrase de Claire), « Les quais de
  Meuse » (la photo montre une péniche et des bateaux), « au mauvais
  endroit » pour la note GPS, « les langues d’une bonne part des voyageurs »
  sur Écologie, « le cas échéant, jusqu’à la fin du séjour » dans les
  mentions. Les phrases dictées par Claire ne bougent pas, même quand la
  relecture proposait mieux (terrasse, table, salle de bain, contenants,
  Contact, boucles de la Meuse).
- **23/09, retours d’Allonzo** : titre de l’accueil « Gîte Saint-Aubin — maison
  et grand jardin au bord de la Meuse, Charleville-Mézières » (plus de
  « maison de famille », le cadrage famille a quitté le site) ; quatrième
  repère de l’accueil « 130 km de Voie Verte » à la place de « Pensée pour
  les familles » ; « Pas de circulation : la rue… » ; dans le « Bon à
  savoir », « La salle de bain » en sous-titre et la phrase complète dessous
  (le sous-titre seul faisait un trou) ; section salle de bain : une seconde
  photo de Claire (le meuble-vasque, `sdb-vasque`, cadrée en 4:3) sous le
  titre, pour remplir la colonne vidée par la suppression des paragraphes.
  44 photos.
- **Nombres** : chiffres dès qu’une phrase en contient déjà (« 70 m² sur
  3 niveaux », « 2 chambres » dans le chiffre clé, l’intro et les meta) ;
  lettres gardées en tête de phrase et dans le titre « Deux chambres, deux
  étages ».
- **JSON-LD** : `petsAllowed` retiré, aucune source n’en parle.
- **Technique** : favicon sans espaces bruts dans l’URL `data:`,
  `data-netlify-honeypot` (valide), `srcset` sans largeur en double quand
  l’original est plus petit que 1 600 px (portillon, cuisine…), image de
  partage en paysage pour Contact (la maison depuis le jardin) et Écologie
  (le jardin au printemps).
- **Rendu** : le second WC quitte la carte « La salle de bain » (les deux
  cartes voisines se vidaient) pour la galerie du bas, à côté de la salle de
  bain vue de la chambre, qui était seule sur sa grille ; gestes d’Écologie
  en 2 × 2 (le 4e était seul sur sa ligne) ; photo de la façade cadrée en
  3:4 sur Contact (elle faisait trois fois la hauteur du texte) ; plus de
  liseré clair entre le pied de page et la barre mobile.

## Reste à obtenir

La liste complète des points à faire confirmer par Claire est dans
[`QUESTIONS-POUR-CLAIRE.md`](QUESTIONS-POUR-CLAIRE.md).

- [ ] **Les avis.** Les trois extraits affichés sont reformulés et abrégés, ce que
      la page indique. À valider ou à remplacer par des citations exactes.
- [ ] **Le nom de domaine.** Une fois choisi et acheté, changer `BASE_URL`
      dans le générateur, ajouter `<link rel="canonical">` (emplacement marqué
      en commentaire dans le `<head>`), puis `robots.txt` et `sitemap.xml`.
- [ ] **La bascule sur Netlify.** Le jour où le site quitte GitHub Pages,
      remettre Netlify comme hébergeur dans les mentions légales (`ml.heb.p`,
      FR et EN) et nommer Netlify Forms dans le paragraphe sur le formulaire
      (`ml.rgpd.p3`) : depuis le 22/09, les mentions décrivent l’hébergeur
      réel, GitHub Pages, et le formulaire sans nommer de service.
- [ ] **Deux photos des environs** viennent de l’annonce Airbnb et non des
      envois de Claire : la Place Ducale et les bateaux sur la Meuse. Elle les
      dit libres de droits ; les mentions légales le précisent. À remplacer par
      des photos à elle si elle en a.

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
