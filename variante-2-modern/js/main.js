/* P.H.I.T – Variante 2 „Modern“ – Mikro-Interaktionen (Vanilla JS) */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    /* ---------- Header: Linie beim Scrollen ---------- */
    var header = document.querySelector('.site-header');
    if (header) {
      var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ---------- Mobile-Menü ---------- */
    var toggle = document.querySelector('.menu-toggle');
    var menu = document.getElementById('mobile-menu');
    if (toggle && menu) {
      var label = toggle.querySelector('.mt-label');
      var open = function () {
        menu.hidden = false;
        toggle.setAttribute('aria-expanded', 'true');
        if (label) label.textContent = 'Schließen';
        document.body.classList.add('menu-open');
        var first = menu.querySelector('a');
        if (first) first.focus();
      };
      var close = function (returnFocus) {
        menu.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
        if (label) label.textContent = 'Menü';
        document.body.classList.remove('menu-open');
        if (returnFocus) toggle.focus();
      };
      toggle.addEventListener('click', function () {
        if (menu.hidden) open(); else close(false);
      });
      menu.addEventListener('click', function (e) {
        if (e.target.closest('a')) close(false);
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !menu.hidden) close(true);
        // Fokus im offenen Menü halten (Toggle + Menülinks)
        if (e.key === 'Tab' && !menu.hidden) {
          var items = [toggle].concat(Array.prototype.slice.call(menu.querySelectorAll('a')));
          var i = items.indexOf(document.activeElement);
          if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
          else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
        }
      });
      window.matchMedia('(min-width: 1100px)').addEventListener('change', function (m) { if (m.matches) close(false); });
    }

    /* ---------- Magnetische Buttons ---------- */
    if (finePointer.matches && !reduced.matches) {
      document.querySelectorAll('.magnetic').forEach(function (el) {
        var raf = 0;
        var strength = el.classList.contains('header-call') ? 0.18 : 0.28;
        el.addEventListener('pointermove', function (e) {
          var r = el.getBoundingClientRect();
          var x = (e.clientX - (r.left + r.width / 2)) * strength;
          var y = (e.clientY - (r.top + r.height / 2)) * strength * 1.4;
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(function () {
            el.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
          });
        });
        el.addEventListener('pointerleave', function () {
          cancelAnimationFrame(raf);
          el.style.transform = '';
        });
      });
    }

    /* ---------- Marquee: Pause-Button ---------- */
    var marquee = document.querySelector('.marquee');
    if (marquee) {
      var mBtn = marquee.querySelector('.marquee-toggle');
      if (mBtn) {
        mBtn.addEventListener('click', function () {
          var paused = marquee.classList.toggle('is-paused');
          mBtn.setAttribute('aria-pressed', paused ? 'true' : 'false');
          mBtn.setAttribute('aria-label', paused ? 'Laufband fortsetzen' : 'Laufband anhalten');
        });
      }
    }

    /* ---------- Google Maps: 2-Klick ---------- */
    document.querySelectorAll('[data-map-load]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var map = btn.closest('[data-map]');
        if (!map || map.classList.contains('is-loaded')) return;
        var f = document.createElement('iframe');
        f.src = 'https://www.google.com/maps?q=Amraser+Stra%C3%9Fe+3,+6020+Innsbruck&output=embed';
        f.title = 'Google Maps: P.H.I.T im Hallenbad Amras';
        f.loading = 'lazy';
        f.referrerPolicy = 'no-referrer-when-downgrade';
        f.setAttribute('allowfullscreen', '');
        map.appendChild(f);
        map.classList.add('is-loaded');
        f.setAttribute('tabindex', '0');
        f.focus();
      });
    });

    /* ---------- Kontaktformular (kein Versand) ---------- */
    var form = document.getElementById('kontaktformular');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var status = form.querySelector('.form-status');
        if (!form.checkValidity()) { form.reportValidity(); return; }
        if (status) {
          status.textContent = '[PLATZHALTER: Formular-Backend] – bitte vorerst anrufen (0512 / 36 60 02) oder an info@phit.cc schreiben.';
          status.classList.add('is-visible');
        }
      });
    }
  });
})();
