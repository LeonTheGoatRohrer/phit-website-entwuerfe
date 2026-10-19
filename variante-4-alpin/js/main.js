/* P.H.I.T – Variante 4 „Alpin“ – Vanilla JS, kein Framework */
(function () {
  'use strict';
  var doc = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Mobile-Navigation ---------- */
  var toggle = document.querySelector('.nav__toggle');
  var panel = document.getElementById('nav-panel');
  var desktop = window.matchMedia('(min-width: 1120px)');

  function setOpen(open, returnFocus) {
    if (!toggle || !panel) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.nav__toggle-label').textContent = open ? 'Schließen' : 'Menü';
    panel.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
    if (open) {
      var first = panel.querySelector('a');
      if (first) first.focus();
    } else if (returnFocus) {
      toggle.focus();
    }
  }
  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true', false);
    });
    panel.addEventListener('click', function (e) {
      if (e.target.closest('a') && !desktop.matches) setOpen(false, false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setOpen(false, true);
      // Fokus im offenen Menü halten
      if (e.key === 'Tab' && panel.classList.contains('is-open') && !desktop.matches) {
        var items = [toggle].concat([].slice.call(panel.querySelectorAll('a, button')));
        var firstEl = items[0], lastEl = items[items.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus(); }
        else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus(); }
      }
    });
    var onBp = function () { if (desktop.matches) setOpen(false, false); };
    if (desktop.addEventListener) desktop.addEventListener('change', onBp); else desktop.addListener(onBp);
  }

  /* ---------- Reveal + Diagonal-Wipes ---------- */
  var targets = [].slice.call(document.querySelectorAll('.reveal, .wipe, .profile__chart'));
  if (!reduce.matches && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    targets.forEach(function (t) { io.observe(t); });
  } else {
    targets.forEach(function (t) { t.classList.add('is-in'); });
  }

  /* ---------- Parallax der Bergsilhouette (nur Hero) ---------- */
  var layers = [].slice.call(document.querySelectorAll('.hero__ridge .parallax'));
  if (layers.length && !reduce.matches) {
    var ticking = false;
    var update = function () {
      var y = window.scrollY || window.pageYOffset;
      if (y < 1400) {
        layers.forEach(function (el) {
          var s = parseFloat(el.getAttribute('data-speed')) || 0.05;
          el.style.transform = 'translate3d(0,' + (y * s).toFixed(1) + 'px,0)';
        });
      }
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
  }

  /* ---------- Google Maps 2-Klick ---------- */
  var mapBtn = document.querySelector('[data-map-load]');
  if (mapBtn) {
    mapBtn.addEventListener('click', function () {
      var wrap = mapBtn.closest('[data-map]');
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.google.com/maps?q=Amraser+Stra%C3%9Fe+3,+6020+Innsbruck&output=embed';
      iframe.title = 'Google Maps: P.H.I.T im Hallenbad Amras';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.setAttribute('allowfullscreen', '');
      wrap.innerHTML = '';
      wrap.appendChild(iframe);
      var route = document.createElement('p');
      route.className = 'map__after';
      route.innerHTML = '<a class="btn btn--orange" href="https://www.google.com/maps/dir/?api=1&amp;destination=Amraser+Stra%C3%9Fe+3+6020+Innsbruck" rel="noopener" target="_blank">Route planen</a>';
      route.style.padding = '1rem';
      route.style.margin = '0';
      wrap.appendChild(route);
      iframe.focus();
    });
  }

  /* ---------- Kontaktformular (kein Versand) ---------- */
  var form = document.querySelector('[data-form]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var status = form.querySelector('.form__status');
      status.innerHTML = '<strong>[PLATZHALTER: Formular-Backend]</strong> – Die Nachricht wurde noch nicht versendet. Bitte ruf vorerst unter <a href="tel:+43512366002">0512 / 36 60 02</a> an oder schreib an <a href="mailto:info@phit.cc">info@phit.cc</a>.';
      status.classList.add('is-shown');
    });
  }
})();
