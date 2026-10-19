/* P.H.I.T – Variante 1 „Klinik“ – minimal, zugänglich, ohne Abhängigkeiten */
(function () {
  'use strict';
  var doc = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile-Menü ---------- */
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('mobile-menu');
  if (toggle && menu) {
    var setOpen = function (open, returnFocus) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
      menu.hidden = !open;
      document.body.classList.toggle('menu-open', open);
      if (open) {
        var first = menu.querySelector('a');
        if (first) first.focus();
      } else if (returnFocus) {
        toggle.focus();
      }
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true', false);
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false, false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setOpen(false, true);
    });
    // Fokus im offenen Menü halten (Tab-Schleife zwischen Toggle und Menülinks)
    menu.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var items = menu.querySelectorAll('a, button');
      var last = items[items.length - 1];
      if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); toggle.focus(); }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1100 && toggle.getAttribute('aria-expanded') === 'true') setOpen(false, false);
    });
  }

  /* ---------- Header-Schatten beim Scrollen ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Dezente Fade-ins ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (!reduce && 'IntersectionObserver' in window && reveals.length) {
    doc.classList.add('js');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
    // Sicherheitsnetz: nach 2,5 s alles sichtbar
    setTimeout(function () { reveals.forEach(function (el) { el.classList.add('is-visible'); }); }, 2500);
  }

  /* ---------- Google Maps 2-Klick ---------- */
  var mapBtn = document.querySelector('[data-map-load]');
  if (mapBtn) {
    mapBtn.addEventListener('click', function () {
      var box = mapBtn.closest('.map-box');
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.google.com/maps?q=Amraser+Stra%C3%9Fe+3,+6020+Innsbruck&output=embed';
      iframe.title = 'Google Maps: P.H.I.T im Hallenbad Amras';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.setAttribute('allowfullscreen', '');
      box.appendChild(iframe);
      box.classList.add('is-loaded');
      var consent = box.querySelector('.map-consent');
      if (consent) consent.remove();
      iframe.setAttribute('tabindex', '0');
      iframe.focus();
    });
  }

  /* ---------- Kontaktformular (kein Versand) ---------- */
  var form = document.querySelector('[data-contact-form]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var status = form.querySelector('.form-status');
      status.hidden = false;
      status.focus();
    });
  }

  /* ---------- Jahr im Footer ---------- */
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
