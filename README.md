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
mentions-legales.html
assets/
  css/site.css        feuille de style unique
  js/i18n.js          bascule de langue
  js/site.js          menu mobile, formulaire, dates
  i18n/fr.json        dictionnaire français (référence)
  i18n/en.json        dictionnaire anglais
  i18n/LISEZMOI.md    comment ajouter le néerlandais
photos/               48 photos, 1600 px et 800 px, WebP + repli JPEG
```

## Choix techniques

**Langues.** Le français est écrit en clair dans le HTML : le site reste lisible
sans JavaScript et les moteurs de recherche voient le vrai texte. Les autres
langues vivent dans `assets/i18n/<code>.json`. Une clé absente d’un dictionnaire
retombe sur le français — une traduction incomplète n’affiche jamais de clé brute.
Ajouter le néerlandais demande trois gestes, décrits dans
[`assets/i18n/LISEZMOI.md`](assets/i18n/LISEZMOI.md).

La langue est choisie dans cet ordre : `?lang=` dans l’URL, puis le choix
précédent du visiteur, puis la langue de son navigateur, puis le français.

**Photos.** `<picture>` avec WebP et repli JPEG, deux largeurs (800 et 1600 px),
`width`/`height` explicites pour éviter les sauts de mise en page, et
`loading="lazy"` partout sauf sur la première image de chaque page.

**Formulaire.** Pas de réservation ni de paiement en ligne : c’est une demande.
Le formulaire est prêt pour Netlify Forms (`data-netlify`, pot de miel
anti-robots). En local l’envoi échoue et le message de repli affiche le téléphone
et l’adresse électronique — c’est le comportement voulu, pas un bug.

**Carte.** Coordonnées GPS réelles : `49.77913, 4.735605`.
La fiche Google Business de Claire pointe encore au mauvais endroit : cela se
corrige chez Google, pas sur le site.

**Couleurs.** Reprises de la maison — mur de cuisine orange, mur ocre, escalier
et cœur rouges, lambris, travertin. Tous les contrastes texte/fond ont été
vérifiés au niveau AA (≥ 4,5:1).

## Avant la mise en ligne

À faire confirmer par Claire :

- [ ] **Qui parle.** L’annonce Airbnb est au nom de « Claire et Olivier » et dit
      « nous » ; la maquette qu’elle a validée fait parler Claire au « je ». Le
      site reprend ce mélange tel qu’elle l’a approuvé — à trancher avec elle.
- [ ] **La chambre du 2e.** Le site annonce trois lits une personne, d’après son
      annonce Airbnb et une de ses photos. Deux lits seulement sont visibles sur
      les photos du 04/09.
- [ ] **Les tarifs.** Aucun tarif n’est affiché. Les fiches touristiques donnent
      80–155 € la nuit, forfait ménage 50–70 €, taxe de séjour 0,80 € — non repris
      faute de confirmation.
- [ ] **Le SIREN de l’éditeur.** Les mentions légales portent le SIREN de KRAON
      au titre de la conception. Le numéro de l’activité de Claire manque.
- [ ] **La troisième langue.** Néerlandais plutôt qu’allemand : ses avis
      étrangers sont néerlandais, et le kit de son label est édité en FR/EN/NL.
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

Le site a été vérifié avant livraison :

- typographie française (insécables avant `: ; ! ?`, guillemets `« »`,
  apostrophes typographiques, ligature `œ`, majuscules accentuées, unités) ;
- dictionnaires FR et EN portant exactement les mêmes 380 clés ;
- aucun lien mort, aucune ancre morte, aucun identifiant dupliqué ;
- chaque image avec `alt`, `width`, `height` ;
- aucune erreur JavaScript, aucun débordement horizontal, de 390 px à 1280 px.
