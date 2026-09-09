/* Gîte Saint-Aubin — animations, menu mobile, formulaire, dates par défaut. */
(function () {
  'use strict';

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
      '.grid-avis > *, .savoir, .bande, .rep, .savoir-court');
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

  /* ---- menu mobile ---- */
  var burger = document.querySelector('.burger');
  var menu   = document.getElementById('menu-mobile');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var ouvert = menu.classList.toggle('ouvert');
      burger.setAttribute('aria-expanded', ouvert ? 'true' : 'false');
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
