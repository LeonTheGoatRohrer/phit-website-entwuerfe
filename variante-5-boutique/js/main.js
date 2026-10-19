/* P.H.I.T – Variante 5 „Boutique“ · Vanilla JS, keine Abhängigkeiten */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('js');
  if (!reduce && 'IntersectionObserver' in window) root.classList.add('motion');

  /* ---------- Header-Zustand ---------- */
  var header = document.querySelector('.site-header');
  var onScroll = function () { if (header) header.classList.toggle('is-scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile Navigation ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var panel = document.getElementById('nav-panel');
  var desktop = window.matchMedia('(min-width: 1080px)');
  function setNav(open, focusToggle) {
    if (!toggle || !panel) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.label').textContent = open ? 'Schließen' : 'Menü';
    panel.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
    if (open) {
      var first = panel.querySelector('a');
      if (first) setTimeout(function () { first.focus(); }, 60);
    } else if (focusToggle) {
      toggle.focus();
    }
  }
  if (toggle && panel) {
    toggle.addEventListener('click', function () { setNav(toggle.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setNav(false, true);
    });
    panel.addEventListener('click', function (e) {
      if (e.target.closest('a') && !desktop.matches) setNav(false);
    });
    // Fokus im offenen Menü halten
    panel.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || desktop.matches || toggle.getAttribute('aria-expanded') !== 'true') return;
      var items = panel.querySelectorAll('a, button');
      var last = items[items.length - 1];
      if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); toggle.focus(); }
    });
    toggle.addEventListener('keydown', function (e) {
      if (e.key === 'Tab' && e.shiftKey && toggle.getAttribute('aria-expanded') === 'true' && !desktop.matches) {
        var items = panel.querySelectorAll('a, button');
        e.preventDefault(); items[items.length - 1].focus();
      }
    });
    var onBp = function () { if (desktop.matches) setNav(false); };
    if (desktop.addEventListener) desktop.addEventListener('change', onBp); else desktop.addListener(onBp);
  }

  /* ---------- Sanfte Reveals ---------- */
  if (root.classList.contains('motion')) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    document.querySelectorAll('.reveal, .reveal-media, .who-diagram').forEach(function (el) { io.observe(el); });
  }

  /* ---------- Leistungen: Bild zum aktiven Eintrag ---------- */
  var services = document.querySelectorAll('.service[data-img]');
  var frames = document.querySelectorAll('.services-visual .frame picture');
  var cap = document.querySelector('.services-visual .cap span');
  function activate(item) {
    var key = item.getAttribute('data-img');
    services.forEach(function (s) { s.classList.toggle('is-active', s === item); });
    frames.forEach(function (f) { f.classList.toggle('is-active', f.getAttribute('data-key') === key); });
    if (cap) cap.textContent = item.querySelector('h3').textContent;
  }
  services.forEach(function (s) {
    s.addEventListener('mouseenter', function () { activate(s); });
    s.addEventListener('focusin', function () { activate(s); });
  });

  /* ---------- Google Maps: 2-Klick ---------- */
  document.querySelectorAll('[data-map-load]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var map = btn.closest('.map');
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.google.com/maps?q=Amraser+Stra%C3%9Fe+3,+6020+Innsbruck&output=embed';
      iframe.title = 'Google Maps: P.H.I.T im Hallenbad Amras';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.setAttribute('allowfullscreen', '');
      map.appendChild(iframe);
      map.classList.add('is-loaded');
      var consent = map.querySelector('.map-consent');
      if (consent) consent.remove();
      iframe.focus();
    });
  });

  /* ---------- Kontaktformular (ohne Versand) ---------- */
  var form = document.querySelector('[data-contact-form]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var status = form.querySelector('.form-status');
      status.classList.add('is-visible');
      status.focus();
    });
  }
})();
