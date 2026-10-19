/* ==========================================================================
   P.H.I.T – Klinik 1 „Referenz“ · main.js
   Aufbau:
     A  Basis (läuft immer, auch ohne GSAP / bei reduced motion)
        A1 Mobile-Menü   A2 Header verdichten   A3 Nav-Indikator
        A4 Google Maps 2-Klick   A5 Kontaktformular   A6 Timeline-Linie einpassen
        A7 Jahr im Footer
     B  Motion-System (nur wenn GSAP geladen UND keine reduzierte Bewegung)
        B1 Tokens   B2 Lenis   B3 Headline-Splits   B4 Hero-Intro + Praxisschild
        B5 Reveals (up / stagger / clip)   B6 Parallax   B7 Counter
        B8 Timeline „Ablauf & Kosten“   B9 Refresh nach Bildern
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var header = document.querySelector('[data-header]');

  /* ---------------------------------------------------------------- A1 --- */
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('mobile-menu');
  var lenis = null;

  function setMenu(open, returnFocus) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    menu.hidden = !open;
    document.body.classList.toggle('menu-open', open);
    if (lenis) { open ? lenis.stop() : lenis.start(); }
    if (open) {
      var first = menu.querySelector('a');
      if (first) first.focus();
    } else if (returnFocus) {
      toggle.focus();
    }
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true', false);
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false, false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setMenu(false, true);
    });
    // Tab-Schleife: letzter Menüpunkt -> zurück zum Schließen-Button
    menu.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var items = menu.querySelectorAll('a, button');
      var first = items[0];
      var last = items[items.length - 1];
      if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); toggle.focus(); }
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); toggle.focus(); }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1100 && toggle.getAttribute('aria-expanded') === 'true') setMenu(false, false);
    });
  }

  /* ---------------------------------------------------------------- A2 --- */
  if (header) {
    var condensed = false;
    var ticking = false;
    var updateHeader = function () {
      ticking = false;
      var next = window.scrollY > 48;
      if (next !== condensed) {
        condensed = next;
        header.classList.toggle('is-condensed', condensed);
      }
    };
    updateHeader();
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(updateHeader); }
    }, { passive: true });
  }

  /* ---------------------------------------------------------------- A3 --- */
  // Gleitender Indikator unter dem aktiven Navigationspunkt (nur transform).
  var navList = document.querySelector('.nav__list');
  var indicator = document.querySelector('.nav__indicator');
  if (navList && indicator) {
    var links = Array.prototype.slice.call(navList.querySelectorAll('.nav__link'));
    var activeLink = navList.querySelector('[aria-current="page"]') || null;

    var moveTo = function (link) {
      if (!link) { indicator.classList.remove('is-visible'); return; }
      indicator.style.setProperty('--ind-x', link.offsetLeft + 12 + 'px');
      indicator.style.setProperty('--ind-s', String((link.offsetWidth - 24) / 100));
      indicator.classList.add('is-visible');
    };
    var setActive = function (link) {
      if (activeLink === link) return;
      if (activeLink && !activeLink.hasAttribute('aria-current')) activeLink.classList.remove('is-active');
      activeLink = link;
      if (link) link.classList.add('is-active');
      moveTo(link);
    };

    // Erste Positionierung ohne Animation
    indicator.classList.add('no-anim');
    moveTo(activeLink);
    requestAnimationFrame(function () { requestAnimationFrame(function () { indicator.classList.remove('no-anim'); }); });

    links.forEach(function (link) {
      link.addEventListener('mouseenter', function () { moveTo(link); });
      link.addEventListener('focus', function () { moveTo(link); });
    });
    navList.addEventListener('mouseleave', function () { moveTo(activeLink); });
    navList.addEventListener('focusout', function (e) { if (!navList.contains(e.relatedTarget)) moveTo(activeLink); });

    // Scroll-Spy für In-Page-Anker (nur Startseite)
    var spyTargets = links
      .map(function (l) {
        var href = l.getAttribute('href') || '';
        var id = href.indexOf('#') === 0 ? href.slice(1) : null;
        var el = id && document.getElementById(id);
        return el ? { link: l, el: el } : null;
      })
      .filter(Boolean);

    if (spyTargets.length && 'IntersectionObserver' in window) {
      var visible = new Map();
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { visible.set(en.target, en.isIntersecting); });
        var current = null;
        spyTargets.forEach(function (t) { if (visible.get(t.el)) current = t.link; });
        setActive(current);
      }, { rootMargin: '-40% 0px -55% 0px' });
      spyTargets.forEach(function (t) { io.observe(t.el); });
    }

    var reposition = function () {
      indicator.classList.add('no-anim');
      moveTo(activeLink);
      requestAnimationFrame(function () { indicator.classList.remove('no-anim'); });
    };
    window.addEventListener('resize', reposition);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(reposition);
  }

  /* ---------------------------------------------------------------- A4 --- */
  var mapBtn = document.querySelector('[data-map-load]');
  if (mapBtn) {
    mapBtn.addEventListener('click', function () {
      var box = mapBtn.closest('.map');
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.google.com/maps?q=Amraser+Stra%C3%9Fe+3,+6020+Innsbruck&output=embed';
      iframe.title = 'Google Maps: P.H.I.T im Hallenbad Amras';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.setAttribute('allowfullscreen', '');
      box.appendChild(iframe);
      box.classList.add('is-loaded');
      var consent = box.querySelector('.map__consent');
      if (consent) consent.hidden = true;
      iframe.focus();
    });
  }

  /* ---------------------------------------------------------------- A5 --- */
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

  /* ---------------------------------------------------------------- A6 --- */
  // Timeline-Linie endet exakt am letzten Knoten (Mitte = 1,5rem unter Oberkante)
  var timelines = document.querySelectorAll('[data-timeline]');
  var fitRails = function () {
    timelines.forEach(function (tl) {
      var steps = tl.querySelectorAll('.step');
      var last = steps[steps.length - 1];
      if (last) tl.style.setProperty('--rail-bottom', Math.max(0, last.offsetHeight - 24) + 'px');
    });
  };
  if (timelines.length) {
    fitRails();
    window.addEventListener('resize', fitRails);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitRails);
  }

  /* ---------------------------------------------------------------- A7 --- */
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ======================================================================
     B  Motion-System
     ====================================================================== */
  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  var SplitText = window.SplitText;
  if (reduceMotion || !gsap || !ScrollTrigger) return;

  try {
    gsap.registerPlugin(ScrollTrigger);
    if (SplitText) gsap.registerPlugin(SplitText);
    root.classList.add('js-motion');
    initMotion();
  } catch (err) {
    // Fallback: Startzustände entfernen, Seite bleibt vollständig sichtbar
    root.classList.remove('js-motion');
    if (window.console) console.warn('Motion deaktiviert:', err);
  }

  function initMotion() {
    /* ------------------------------------------------------------ B1 --- */
    var css = getComputedStyle(root);
    var tok = function (name, fallback) {
      var v = parseFloat(css.getPropertyValue(name));
      return isNaN(v) ? fallback : v;
    };
    var M = {
      dur3: tok('--dur-3', 0.7),
      dur4: tok('--dur-4', 1.1),
      easeOut: 'expo.out',         // ≙ --ease-out
      easeInOut: 'power3.inOut',   // ≙ --ease-in-out
      easeStd: 'power2.out',       // ≙ --ease-standard
      stagger: 0.08
    };
    var mm = gsap.matchMedia();
    var isSmall = window.matchMedia('(max-width: 767px)').matches;
    var dist = isSmall ? 14 : 24; // Mobile: spürbar, aber kürzer

    gsap.defaults({ ease: M.easeOut, duration: M.dur3 });

    /* ------------------------------------------------------------ B2 --- */
    // Lenis nur auf Desktop mit feinem Zeiger (Touch bleibt nativ, syncTouch: false)
    if (window.Lenis && window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 768px)').matches) {
      lenis = new window.Lenis({ lerp: 0.11, wheelMultiplier: 1, syncTouch: false });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);

      // In-Page-Anker weich anfahren (Header-Höhe berücksichtigen)
      document.addEventListener('click', function (e) {
        var a = e.target.closest('a[href*="#"]');
        if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
        var url = new URL(a.href, location.href);
        if (url.pathname !== location.pathname || !url.hash || url.hash.length < 2) return;
        var target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
        if (!target) return;
        e.preventDefault();
        var offset = -(header ? header.querySelector('.header-main').offsetHeight : 72) - 16;
        lenis.scrollTo(target, { offset: offset, duration: 1.2 });
        history.pushState(null, '', url.hash);
        if (target.matches('main')) target.focus({ preventScroll: true });
      });
    }

    /* ------------------------------------------------------------ B3 --- */
    var fontsReady = new Promise(function (resolve) {
      if (!document.fonts || !document.fonts.ready) return resolve();
      document.fonts.ready.then(resolve);
      setTimeout(resolve, 1200); // nicht ewig auf Fonts warten
    });

    function splitHeading(el, vars) {
      // SplitText 3.13: Zeilen-Masken, autoSplit bei Resize, aria: "auto" hält den Satz für Screenreader zusammen
      if (!SplitText) { el.classList.add('is-split'); return null; }
      return SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'split-line',
        autoSplit: true,
        aria: 'auto',
        reduceWhiteSpace: false, // erhält &nbsp; (z. B. vor Gedankenstrichen)
        onSplit: function (self) {
          el.classList.add('is-split');
          var tween = gsap.from(self.lines, {
            yPercent: 112,
            duration: M.dur4,
            stagger: M.stagger,
            ease: M.easeOut,
            scrollTrigger: vars.trigger ? { trigger: el, start: 'top 88%', once: true } : undefined
          });
          return tween; // SplitText synchronisiert den Fortschritt beim Re-Split
        }
      });
    }

    /* ------------------------------------------------------------ B4 --- */
    // Startet sofort (nicht erst nach den Fonts), damit der sichtbare Inhalt früh malt (LCP).
    // Nur die Headline wartet auf document.fonts.ready (siehe heroTitle).
    function heroIntro() {
      var hero = document.querySelector('.hero, .page-hero');
      if (!hero) return;

      var tl = gsap.timeline({ defaults: { ease: M.easeOut } });
      var heroBits = hero.querySelectorAll('[data-hero]');
      if (heroBits.length) {
        tl.fromTo(heroBits, { opacity: 0, y: dist }, { opacity: 1, y: 0, duration: M.dur4, stagger: 0.06, clearProps: 'transform' }, 0.05);
      }

      var media = hero.querySelector('[data-reveal="clip"]');
      if (media) {
        var img = media.querySelector('img');
        tl.to(media, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: M.easeInOut }, 0.05);
        if (img) tl.fromTo(img, { scale: 1.18 }, { scale: 1.06, duration: 1.8, ease: M.easeOut }, 0.05);
        media.setAttribute('data-revealed', '');
      }

      // Praxisschild baut sich gestaffelt auf: Rahmen -> Licht -> Kopf -> Zeilen (Linie, dann Text) -> Fuß
      var plate = hero.querySelector('.plate');
      if (plate) {
        var at = 0.7;
        tl.fromTo(plate, { opacity: 0, y: 18, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.9, clearProps: 'transform' }, at)
          .to(plate.querySelector('.plate__light'), { scaleX: 1, duration: 0.8, ease: M.easeInOut }, at + 0.2)
          .to(plate.querySelector('.plate__head'), { opacity: 1, duration: 0.5, ease: M.easeStd }, at + 0.3);
        plate.querySelectorAll('.plate__row').forEach(function (row, i) {
          var t = at + 0.45 + i * 0.11;
          tl.to(row.querySelector('.plate__rule'), { scaleX: 1, duration: 0.7, ease: M.easeInOut }, t)
            .fromTo(row.querySelectorAll('span:not(.plate__rule)'), { opacity: 0, x: -6 }, { opacity: 1, x: 0, duration: 0.6, stagger: 0.05, clearProps: 'transform' }, t + 0.08);
        });
        tl.to(plate.querySelector('.plate__foot'), { opacity: 1, duration: 0.5, ease: M.easeStd }, '-=0.3');
      }
    }

    /* ------------------------------------------------------------ B5 --- */
    function reveals() {
      // Fade-up einzelner Blöcke
      var ups = gsap.utils.toArray('[data-reveal="up"]');
      if (ups.length) ScrollTrigger.batch(ups, {
        start: 'top 88%',
        once: true,
        onEnter: function (els) {
          gsap.to(els, { opacity: 1, y: 0, duration: M.dur3 * 1.3, stagger: 0.08, overwrite: true, clearProps: 'transform' });
        }
      });
      if (ups.length) gsap.set(ups, { y: dist });

      // Gestaffelte Kinder (Karten-Raster, Listen)
      document.querySelectorAll('[data-stagger]').forEach(function (group) {
        var kids = group.children;
        gsap.set(kids, { y: dist * 0.7 });
        ScrollTrigger.batch(kids, {
          start: 'top 90%',
          once: true,
          onEnter: function (els) {
            gsap.to(els, { opacity: 1, y: 0, duration: M.dur3 * 1.2, stagger: 0.07, overwrite: true, clearProps: 'transform' });
            // Icons in Leistungskarten zeichnen sich beim ersten Erscheinen einmal
            els.forEach(function (el, i) {
              var svg = el.querySelector('.service__icon svg');
              if (svg) gsap.fromTo(svg, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, delay: 0.15 + i * 0.07, ease: M.easeInOut, clearProps: 'strokeDashoffset' });
            });
          }
        });
      });

      // Bild-Masken (clip-path) außerhalb des Heros
      gsap.utils.toArray('[data-reveal="clip"]').forEach(function (media) {
        if (media.hasAttribute('data-revealed')) return;
        var img = media.querySelector('img');
        var tl = gsap.timeline({ scrollTrigger: { trigger: media, start: 'top 85%', once: true } });
        tl.to(media, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: M.easeInOut });
        if (img && !media.hasAttribute('data-parallax')) tl.fromTo(img, { scale: 1.14 }, { scale: 1, duration: 1.6, ease: M.easeOut, clearProps: 'transform' }, 0);
      });

      // Headlines (h2) zeilenweise
      gsap.utils.toArray('[data-split]').forEach(function (el) {
        if (el.closest('.hero, .page-hero')) return;
        splitHeading(el, { trigger: true });
      });
    }

    /* ------------------------------------------------------------ B6 --- */
    function parallax() {
      mm.add('(min-width: 768px)', function () {
        gsap.utils.toArray('[data-parallax]').forEach(function (media) {
          var img = media.querySelector('img');
          if (!img) return;
          var amount = parseFloat(media.getAttribute('data-parallax')) || 6;
          // nur yPercent – Skalierung (Beschnittreserve) kommt aus dem CSS bzw. dem Hero-Intro
          gsap.fromTo(img, { yPercent: -amount }, {
            yPercent: amount,
            ease: 'none',
            scrollTrigger: { trigger: media, start: 'top bottom', end: 'bottom top', scrub: 0.6 }
          });
        });
      });
    }

    /* ------------------------------------------------------------ B7 --- */
    function counters() {
      gsap.utils.toArray('[data-count]').forEach(function (el) {
        var end = parseFloat(el.getAttribute('data-count'));
        var obj = { v: 0 };
        el.textContent = '0';
        ScrollTrigger.create({
          trigger: el,
          start: 'top 92%',
          once: true,
          onEnter: function () {
            gsap.to(obj, {
              v: end,
              duration: end > 10 ? 1.6 : 0.9,
              ease: 'power3.out',
              onUpdate: function () { el.textContent = String(Math.round(obj.v)); }
            });
          }
        });
      });
    }

    /* ------------------------------------------------------------ B8 --- */
    function timeline() {
      var tlEl = document.querySelector('[data-timeline]');
      if (!tlEl) return;
      var progress = tlEl.querySelector('.timeline__progress');
      var steps = gsap.utils.toArray(tlEl.querySelectorAll('.step'));
      var readNum = document.querySelector('[data-step-current]');
      var readFill = document.querySelector('.process__readout-fill');

      // Fortschrittslinie wird beim Scrollen gezeichnet (scrub, kein Pinning)
      gsap.fromTo(progress, { scaleY: 0 }, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: tlEl, start: 'top 62%', end: 'bottom 62%', scrub: 0.5 }
      });

      var setReadout = function () {
        var n = steps.filter(function (s) { return s.classList.contains('is-active'); }).length;
        if (readNum) readNum.textContent = String(Math.max(1, n));
        if (readFill) gsap.to(readFill, { scaleX: Math.max(1, n) / steps.length, duration: M.dur3, ease: M.easeOut });
      };

      steps.forEach(function (step) {
        ScrollTrigger.create({
          trigger: step,
          start: 'top 62%',
          onEnter: function () { step.classList.add('is-active'); setReadout(); },
          onLeaveBack: function () { step.classList.remove('is-active'); setReadout(); }
        });
      });
    }

    /* ------------------------------------------------------------ B9 --- */
    function heroTitle() {
      var title = document.querySelector('.hero [data-split], .page-hero [data-split]');
      if (title) splitHeading(title, {});
    }

    function refreshOnImages() {
      // Alle Bilder haben feste Maße, daher genügt ein gebündelter Refresh (spart teure Neuberechnungen)
      var timer = null;
      var refresh = function () {
        clearTimeout(timer);
        timer = setTimeout(function () { ScrollTrigger.refresh(); }, 250);
      };
      document.querySelectorAll('img[loading="lazy"]').forEach(function (img) {
        if (!img.complete) img.addEventListener('load', refresh, { once: true });
      });
      window.addEventListener('load', refresh);
    }

    heroIntro();

    // Reihenfolge: Text erst nach Fonts splitten (korrekte Zeilenumbrüche)
    fontsReady.then(function () {
      heroTitle();
      reveals();
      parallax();
      counters();
      timeline();
      refreshOnImages();
      ScrollTrigger.refresh();
    });
  }
})();
