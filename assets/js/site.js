/* Gîte Saint-Aubin — animations, tiroir de navigation, saisons, formulaire, dates par défaut. */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  /* ---- apparitions au défilement ----
     Le marqueur est posé tout de suite : sans JavaScript, ou si le visiteur
     demande moins d'animation, rien n'est jamais caché.
     IntersectionObserver ne coûte rien — pas d'écouteur de défilement — et
     chaque élément est oublié dès qu'il est apparu. */
  var doux = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!doux && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js-anim');

    var aRevelerer = document.querySelectorAll(
      '.tete, .duo > *, .gal figure, .equip > *, .gestes > *, .liste-a > *, ' +
      '.grid-avis > *, .savoir, .bande, .rep, .savoir-court, .vues > *');
    aRevelerer.forEach(function (el) { el.classList.add('revele'); });

    var oeil = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('vu');
        oeil.unobserve(e.target);          /* une fois vu, on n'observe plus */
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    aRevelerer.forEach(function (el) { oeil.observe(el); });

    /* ce qui est déjà à l'écran au chargement apparaît sans attendre */
    requestAnimationFrame(function () {
      aRevelerer.forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('vu');
      });
    });

    /* ombre de la barre haute, via une sentinelle : toujours pas de scroll */
    var barre = document.querySelector('.topbar');
    if (barre) {
      var s = document.createElement('div');
      s.className = 'sentinelle';
      document.body.insertBefore(s, document.body.firstChild);
      new IntersectionObserver(function (e) {
        barre.classList.toggle('defile', !e[0].isIntersecting);
      }).observe(s);
    }
  }

  /* ---- menu mobile : tiroir latéral ----
     Ouvert : la page ne défile plus, le focus reste dans le tiroir (et sur le
     burger, qui reste visible au-dessus), Échap ou le voile ferment, et le
     focus revient au bouton. */
  var burger = document.querySelector('.burger');
  var tiroir = document.getElementById('menu-mobile');
  var voile  = document.querySelector('.voile');
  if (burger && tiroir && voile) {
    var racine = document.documentElement;
    var ouvert = false;
    var focusables = function () {
      return [burger].concat(Array.prototype.slice.call(tiroir.querySelectorAll('a[href]')));
    };
    var ouvrir = function () {
      if (ouvert) return;
      ouvert = true;
      racine.style.setProperty('--sb', (window.innerWidth - racine.clientWidth) + 'px');
      document.body.classList.add('menu-ouvert');
      tiroir.classList.add('ouvert');
      voile.classList.add('ouvert');
      burger.setAttribute('aria-expanded', 'true');
      var premier = tiroir.querySelector('a[href]');
      if (premier) premier.focus();
    };
    var fermer = function (rendreFocus) {
      if (!ouvert) return;
      ouvert = false;
      document.body.classList.remove('menu-ouvert');
      tiroir.classList.remove('ouvert');
      voile.classList.remove('ouvert');
      burger.setAttribute('aria-expanded', 'false');
      if (rendreFocus !== false) burger.focus();
    };
    burger.addEventListener('click', function () { if (ouvert) fermer(); else ouvrir(); });
    voile.addEventListener('click', function () { fermer(); });
    tiroir.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('a[href]')) fermer(false);
    });
    document.addEventListener('keydown', function (e) {
      if (!ouvert) return;
      if (e.key === 'Escape') { e.preventDefault(); fermer(); return; }
      if (e.key !== 'Tab') return;
      var f = focusables(), premier = f[0], dernier = f[f.length - 1];
      if (e.shiftKey && document.activeElement === premier) { e.preventDefault(); dernier.focus(); }
      else if (!e.shiftKey && document.activeElement === dernier) { e.preventDefault(); premier.focus(); }
    });
    /* la fenêtre s'élargit jusqu'au menu de bureau : le tiroir n'a plus lieu d'être */
    var grand = window.matchMedia('(min-width: 1000px)');
    var surChangement = function (m) { if (m.matches) fermer(false); };
    if (grand.addEventListener) grand.addEventListener('change', surChangement);
    else if (grand.addListener) grand.addListener(surChangement);
  }

  /* ---- saisons : la même vue, trois saisons ----
     Un onglet par saison ; les trois vues basculent ensemble, en fondu (CSS).
     Flèches, Début et Fin déplacent la sélection, comme dans tout tablist. */
  var saisons = document.querySelector('.saisons');
  if (saisons) {
    var onglets = Array.prototype.slice.call(saisons.querySelectorAll('[role=tab]:not([hidden])'));
    var panneau = saisons.querySelector('[role=tabpanel]');
    var cadres  = Array.prototype.slice.call(saisons.querySelectorAll('.cadre'));
    var choisir = function (onglet, focus) {
      var s = onglet.getAttribute('data-saison');
      onglets.forEach(function (o) {
        var actif = o === onglet;
        o.setAttribute('aria-selected', actif ? 'true' : 'false');
        o.tabIndex = actif ? 0 : -1;
      });
      cadres.forEach(function (c) { c.classList.toggle('active', c.getAttribute('data-saison') === s); });
      saisons.setAttribute('data-saison', s);
      if (panneau) panneau.setAttribute('aria-labelledby', onglet.id);
      if (focus) onglet.focus();
    };
    onglets.forEach(function (o, i) {
      o.addEventListener('click', function () { choisir(o, false); });
      o.addEventListener('keydown', function (e) {
        var j = -1;
        if (e.key === 'ArrowRight') j = (i + 1) % onglets.length;
        else if (e.key === 'ArrowLeft') j = (i - 1 + onglets.length) % onglets.length;
        else if (e.key === 'Home') j = 0;
        else if (e.key === 'End') j = onglets.length - 1;
        if (j < 0) return;
        e.preventDefault();
        choisir(onglets[j], true);
      });
    });
  }

  /* ---- dates par défaut : arrivée dans 7 jours, départ 3 nuits plus tard ---- */
  var jour = 86400000;
  var arr = document.getElementById('champ-arrivee');
  var dep = document.getElementById('champ-depart');
  var iso = function (d) { return new Date(d).toISOString().slice(0, 10); };
  if (arr && dep) {
    var t = Date.now();
    arr.min = iso(t);
    arr.value = iso(t + 7 * jour);
    dep.min = iso(t + jour);
    dep.value = iso(t + 10 * jour);
    arr.addEventListener('change', function () {
      if (!arr.value) return;
      var lendemain = iso(new Date(arr.value).getTime() + jour);
      dep.min = lendemain;
      if (dep.value <= arr.value) dep.value = lendemain;
    });
  }

  /* ---- envoi de la demande ----
     Le site ne fait pas de réservation en ligne : c’est une demande par
     formulaire. En production, Netlify Forms reçoit le POST ; en local il
     échoue, et l’on affiche alors le repli téléphone / e-mail. */
  var form = document.querySelector('form.demande');
  if (!form) return;
  var retour = document.getElementById('retour');
  var bouton = form.querySelector('button[type=submit]');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;

    var libelleInitial = bouton.innerHTML;
    bouton.disabled = true;
    bouton.innerHTML = document.documentElement.lang === 'en' ? 'Sending…' : 'Envoi…';

    fetch(form.getAttribute('action') || '/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString()
    })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r; })
      .then(function () {
        retour.className = 'retour ok';
        retour.innerHTML = retour.getAttribute('data-ok');
        form.reset();
        bouton.innerHTML = libelleInitial;
        bouton.disabled = false;
      })
      .catch(function () {
        retour.className = 'retour ko';
        retour.innerHTML = retour.getAttribute('data-ko');
        bouton.innerHTML = libelleInitial;
        bouton.disabled = false;
      })
      .finally(function () { retour.focus && retour.focus(); });
  });
})();
