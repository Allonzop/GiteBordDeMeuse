/* ------------------------------------------------------------------
   Gîte Saint-Aubin — bascule de langue
   ------------------------------------------------------------------
   Le français est écrit en clair dans le HTML : le site reste lisible
   sans JavaScript et les moteurs de recherche voient le vrai texte.
   Les autres langues vivent dans assets/i18n/<code>.json.

   AJOUTER UNE LANGUE (le néerlandais, par exemple) :
     1. copier assets/i18n/en.json en assets/i18n/nl.json et le traduire ;
     2. ajouter 'nl' à LANGUES ci-dessous ;
     3. ajouter <button type="button" data-lang="nl">NL</button>
        dans le sélecteur de langue de chaque page.
   Rien d’autre à toucher.
------------------------------------------------------------------- */
(function () {
  'use strict';

  var LANGUES  = ['fr', 'en'];
  var DEFAUT   = 'fr';
  var BASE     = 'assets/i18n/';
  var CLE      = 'gite-saint-aubin:langue';

  /* attribut HTML  ->  propriété/attribut à écrire */
  var CIBLES = {
    'data-i18n':         null,          /* null = contenu de l’élément */
    'data-i18n-alt':     'alt',
    'data-i18n-ph':      'placeholder',
    'data-i18n-aria':    'aria-label',
    'data-i18n-title':   'title',
    'data-i18n-content': 'content',
    'data-i18n-ok':      'data-ok',       /* messages du formulaire (site.js) */
    'data-i18n-ko':      'data-ko'
  };

  var SELECTEUR = Object.keys(CIBLES).map(function (a) { return '[' + a + ']'; }).join(',');
  var reference = {};   /* le français relevé dans le HTML */
  var cache     = {};   /* dictionnaires déjà téléchargés */

  function noeuds() { return document.querySelectorAll(SELECTEUR); }

  function releverReference() {
    noeuds().forEach(function (el) {
      Object.keys(CIBLES).forEach(function (attr) {
        var cle = el.getAttribute(attr);
        if (!cle) return;
        var prop = CIBLES[attr];
        reference[cle] = prop === null ? el.innerHTML : el.getAttribute(prop);
      });
    });
  }

  function ecrire(dico) {
    noeuds().forEach(function (el) {
      Object.keys(CIBLES).forEach(function (attr) {
        var cle = el.getAttribute(attr);
        if (!cle) return;
        var valeur = dico[cle];
        if (valeur === undefined) valeur = reference[cle];   /* repli : le français */
        if (valeur === undefined || valeur === null) return;
        var prop = CIBLES[attr];
        if (prop === null) el.innerHTML = valeur;
        else el.setAttribute(prop, valeur);
      });
    });
  }

  function marquerBoutons(lang) {
    document.querySelectorAll('.lang button').forEach(function (b) {
      var actif = b.getAttribute('data-lang') === lang;
      b.classList.toggle('on', actif);
      b.setAttribute('aria-pressed', actif ? 'true' : 'false');
    });
  }

  function appliquer(lang) {
    if (LANGUES.indexOf(lang) === -1) lang = DEFAUT;
    document.documentElement.setAttribute('lang', lang);
    marquerBoutons(lang);
    try { localStorage.setItem(CLE, lang); } catch (e) { /* navigation privée */ }

    if (lang === DEFAUT) { ecrire(reference); return; }
    if (cache[lang])     { ecrire(cache[lang]); return; }

    fetch(BASE + lang + '.json', { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (d) { cache[lang] = d; ecrire(d); })
      .catch(function () {
        /* dictionnaire injoignable : on reste en français plutôt que d’afficher des clés */
        document.documentElement.setAttribute('lang', DEFAUT);
        marquerBoutons(DEFAUT);
        ecrire(reference);
      });
  }

  function langueInitiale() {
    var p = new URLSearchParams(location.search).get('lang');
    if (p && LANGUES.indexOf(p) > -1) return p;
    try {
      var m = localStorage.getItem(CLE);
      if (m && LANGUES.indexOf(m) > -1) return m;
    } catch (e) { /* ignore */ }
    var n = (navigator.language || DEFAUT).slice(0, 2).toLowerCase();
    return LANGUES.indexOf(n) > -1 ? n : DEFAUT;
  }

  function demarrer() {
    releverReference();
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.addEventListener('click', function () { appliquer(b.getAttribute('data-lang')); });
    });
    appliquer(langueInitiale());
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer);
  else demarrer();
})();
