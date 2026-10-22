/* ==========================================================================
   P.H.I.T · Variante 6 „Befund“ – Vanilla JS, keine Bibliothek.
   A Basis (immer):   A1 Menü  A2 Karte 2-Klick  A3 Formular  A4 Jahr
   B Motion (nur ohne prefers-reduced-motion):
     B1 Reveals  B2 Messlinie + Abschnittsanzeige  B3 Register-Vorschau
     B4 Wasserlinie (Scroll-Scrub)  B5 Ablauf-Linie  B6 Videos lazy
   Ohne JS bzw. mit reduzierter Bewegung ist jeder Inhalt statisch sichtbar;
   Videos werden dann gar nicht geladen (Poster-Bild bleibt stehen).
   ========================================================================== */
(function () {
  'use strict';
  var root = document.documentElement;
  var qsa = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var mq = function (q) { return window.matchMedia(q); };
  var reduce = mq('(prefers-reduced-motion: reduce)').matches;
  var motion = !reduce && 'IntersectionObserver' in window;
  root.classList.add('js');
  if (motion) root.classList.add('js-motion');

  /* ---------------------------------------------------------------- A1 --- */
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('mobile-menu');
  if (toggle && menu) {
    var setMenu = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
      menu.hidden = !open;
      root.classList.toggle('menu-open', open);
      if (open) { var first = menu.querySelector('a'); if (first) first.focus(); }
    };
    toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) { setMenu(false); toggle.focus(); }
    });
    mq('(min-width: 1080px)').addEventListener('change', function (e) { if (e.matches) setMenu(false); });
  }

  /* ---------------------------------------------------------------- A2 --- */
  var mapBtn = document.querySelector('[data-map-load]');
  if (mapBtn) {
    mapBtn.addEventListener('click', function () {
      var box = mapBtn.closest('.map');
      var f = document.createElement('iframe');
      f.src = 'https://www.google.com/maps?q=Amraser+Stra%C3%9Fe+3,+6020+Innsbruck&output=embed';
      f.title = 'Google Maps: P.H.I.T im Hallenbad Amras';
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      f.setAttribute('allowfullscreen', '');
      box.appendChild(f);
      box.classList.add('is-loaded');
      box.querySelector('.map__consent').hidden = true;
      f.focus();
    });
  }

  /* ---------------------------------------------------------------- A3 --- */
  var form = document.querySelector('[data-contact-form]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var st = form.querySelector('.form-status');
      st.hidden = false; st.focus();
    });
  }

  /* ---------------------------------------------------------------- A4 --- */
  qsa('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  if (!motion) return;

  /* ---------------------------------------------------------------- B1 --- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -12% 0px' });
  qsa('[data-reveal], .sec-head, .annot').forEach(function (el) { io.observe(el); });

  /* ------------------------------------------------- Scroll-Schleife ------ */
  var tasks = [];
  var ticking = false;
  var run = function () { ticking = false; tasks.forEach(function (t) { t(); }); };
  var schedule = function () { if (!ticking) { ticking = true; requestAnimationFrame(run); } };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  var clamp = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };

  /* ---------------------------------------------------------------- B2 --- */
  // Messlinie: nur scrollY/scrollHeight lesen; Abschnittsanzeige per IntersectionObserver
  var meter = document.querySelector('.meter');
  var readout = document.querySelector('[data-readout]');
  if (meter) {
    var maxScroll = 1;
    var measure = function () { maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight); };
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
    tasks.push(function () { meter.style.setProperty('--p', clamp(window.scrollY / maxScroll).toFixed(4)); });
    if (readout) {
      var sio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) readout.textContent = en.target.getAttribute('data-section'); });
      }, { rootMargin: '-35% 0px -64% 0px' });
      qsa('main [data-section]').forEach(function (sec) { sio.observe(sec); });
    }
  }

  // Szenen-Tasks laufen nur, solange ihr Element in der Nähe des Viewports ist
  var near = function (el, fn) {
    var on = false;
    new IntersectionObserver(function (en) { on = en[0].isIntersecting; if (on) schedule(); }, { rootMargin: '100px 0px' }).observe(el);
    tasks.push(function () { if (on) fn(); });
  };

  /* ---------------------------------------------------------------- B3 --- */
  var preview = document.querySelector('.register__preview');
  var rows = qsa('.reg');
  if (rows.length) {
    var img = preview && preview.querySelector('img');
    var cap = preview && preview.querySelector('[data-preview-cap]');
    var activeRow = null;
    var activate = function (row) {
      if (row === activeRow) return;
      if (activeRow) activeRow.classList.remove('is-active');
      activeRow = row; row.classList.add('is-active');
      if (!img || !row.dataset.img) return;
      var base = row.dataset.img;
      if (img.dataset.current === base) return;
      img.classList.add('is-out');
      setTimeout(function () {
        img.srcset = base + '-640.webp 640w, ' + base + '-1024.webp 1024w, ' + base + '-1600.webp 1600w';
        img.src = base + '-1024.webp';
        img.dataset.current = base;
        if (cap) cap.textContent = row.dataset.cap || '';
        var show = function () { img.classList.remove('is-out'); };
        if (img.complete) show(); else img.addEventListener('load', show, { once: true });
      }, 180);
    };
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) activate(en.target); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    rows.forEach(function (r) {
      rio.observe(r);
      r.addEventListener('pointerenter', function () { activate(r); });
      r.addEventListener('focusin', function () { activate(r); });
    });
  }

  /* ---------------------------------------------------------------- B4 --- */
  var water = document.querySelector('.water');
  if (water) {
    var wide = mq('(min-width: 900px)');
    near(water, function () {
      var r = water.getBoundingClientRect();
      var vh = window.innerHeight;
      var p;
      if (wide.matches) {
        // gepinnt: 0 beim Eintritt, 1 nach etwa der Hälfte der Scrollstrecke
        p = clamp(-r.top / ((r.height - vh) * 0.6));
      } else {
        p = clamp((vh - r.top) / (vh * 1.1));
      }
      // Wasser steigt von 92 % auf 8 % der Bühne
      water.style.setProperty('--lvl', (0.92 - p * 0.84).toFixed(4));
    });
  }

  /* ---------------------------------------------------------------- B5 --- */
  var steps = document.querySelector('.steps');
  if (steps) {
    near(steps, function () {
      var r = steps.getBoundingClientRect();
      var vh = window.innerHeight;
      steps.style.setProperty('--steps-p', clamp((vh * 0.85 - r.top) / (vh * 0.6)).toFixed(4));
    });
  }
  /* ---------------------------------------------------------------- B6 --- */
  // Videos erst laden, wenn sie in die Nähe des Viewports kommen; Hero erst nach load.
  var saveData = navigator.connection && navigator.connection.saveData;
  var videos = qsa('video[data-lazy]');
  if (!saveData && videos.length) {
    var start = function (v) {
      if (v.dataset.loaded) { var p = v.play(); if (p && p.catch) p.catch(function () {}); return; }
      v.dataset.loaded = '1';
      if (v.dataset.poster) v.poster = v.dataset.poster;
      qsa('source[data-src]', v).forEach(function (s) { s.src = s.dataset.src; });
      v.load();
      v.addEventListener('playing', function () { v.classList.add('is-playing'); }, { once: true });
      var pr = v.play(); if (pr && pr.catch) pr.catch(function () {});
    };
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) start(v); else if (v.dataset.loaded) v.pause();
      });
    }, { rootMargin: '200px 0px' });
    var observeAll = function () { videos.forEach(function (v) { vio.observe(v); }); };
    if (document.readyState === 'complete') setTimeout(observeAll, 600);
    else window.addEventListener('load', function () { setTimeout(observeAll, 600); });
  }
})();
