/* ==========================================================================
   P.H.I.T – main.js (lesbare Quelle; ausgeliefert wird js/main.min.js,
   Build-Befehl siehe README „Build / Minify“)
   Aufbau:
     A  Basis (läuft immer, auch bei reduced motion)
        A1 Mobile-Menü   A2 Header verdichten   A3 Nav-Indikator + Scroll-Spy
        A4 Google Maps 2-Klick   A5 Kontaktformular   A6 Timeline-Linie einpassen
        A7 Jahr im Footer
     B  Motion „lite“ (alle Geräte, nur ohne reduced motion; keine Bibliothek)
        B1 Scroll-Reveals (IntersectionObserver -> .is-in, Bewegung per CSS)
        B2 Zahlen-Counter   B3 Timeline „Ablauf“ (Fortschrittslinie, aktive Schritte)
     C  Desktop-Enhancement (Maus + ≥ 768 px): lädt GSAP, ScrollTrigger, SplitText
        und Lenis NACH dem Seiten-Load (requestIdleCallback) nach.
        C1 Lenis + weiche Anker   C2 Headlines zeilenweise (SplitText)   C3 Parallax
   Das Hero-Intro ist reines CSS (style.css 19a) und braucht kein JS.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var mm = function (q) { return window.matchMedia(q).matches; };
  var qsa = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  var reduceMotion = mm('(prefers-reduced-motion: reduce)');
  var motion = !reduceMotion && 'IntersectionObserver' in window;
  var fullMotion = motion && mm('(hover: hover) and (pointer: fine) and (min-width: 768px)');
  if (motion) root.classList.add('js-motion');
  if (fullMotion) root.classList.add('js-full');

  // Basis-URL für nachgeladene Dateien (funktioniert unabhängig vom Seitenpfad)
  var script = document.currentScript;
  var base = script ? script.src.replace(/js\/[^/]*$/, '') : '';

  var header = document.querySelector('[data-header]');
  var lenis = null;

  /* ---------------------------------------------------------------- A1 --- */
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('mobile-menu');

  function setMenu(open, returnFocus) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    menu.hidden = !open;
    document.body.classList.toggle('menu-open', open);
    if (lenis) { if (open) lenis.stop(); else lenis.start(); }
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
    var links = qsa('.nav__link', navList);
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
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { visible.set(en.target, en.isIntersecting); });
        var current = null;
        spyTargets.forEach(function (t) { if (visible.get(t.el)) current = t.link; });
        setActive(current);
      }, { rootMargin: '-40% 0px -55% 0px' });
      spyTargets.forEach(function (t) { spy.observe(t.el); });
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
  var timelines = qsa('[data-timeline]');
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

  if (!motion) return;

  /* ======================================================================
     B  Motion „lite“
     ====================================================================== */

  /* ------------------------------------------------------------ B1 --- */
  // Jedes Ziel bekommt beim Eintreten .is-in; Elemente, die im selben Frame
  // eintreten, werden über --d gestaffelt. Danach .is-done: Die Reveal-Transition
  // wird entfernt, damit Hover-Transitions der Komponenten wieder greifen.
  var pending = new Set();
  var reveal = function (el, i) {
    pending.delete(el);
    var delay = Math.min(i, 7) * 0.07;
    if (delay) el.style.setProperty('--d', delay.toFixed(2) + 's');
    el.classList.add('is-in');
    setTimeout(function () {
      el.classList.add('is-done');
      el.style.removeProperty('--d');
    }, 1700 + delay * 1000);
  };
  var revealIO = new IntersectionObserver(function (entries) {
    var i = 0;
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      revealIO.unobserve(en.target);
      reveal(en.target, i++);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  var watch = function (el) { pending.add(el); revealIO.observe(el); };

  qsa('[data-reveal="up"], [data-reveal="clip"], [data-split]').forEach(watch);
  qsa('[data-stagger]').forEach(function (group) { Array.prototype.forEach.call(group.children, watch); });

  /* ------------------------------------------------------------ B2 --- */
  var counters = qsa('[data-count]');
  if (counters.length) {
    var countIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        countIO.unobserve(en.target);
        var el = en.target;
        var end = parseFloat(el.getAttribute('data-count'));
        var dur = end > 10 ? 1600 : 900;
        var t0 = performance.now();
        var step = function (now) {
          var p = Math.min(1, (now - t0) / dur);
          el.textContent = String(Math.round(end * (1 - Math.pow(1 - p, 3)))); // ≙ power3.out
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    counters.forEach(function (el) { el.textContent = '0'; countIO.observe(el); });
  }

  /* ------------------------------------------------------------ B3 --- */
  // Fortschrittslinie folgt dem Scroll (Start: Oberkante bei 62 % der Viewporthöhe,
  // Ende: Unterkante bei 62 %); Schritte oberhalb der Linie sind aktiv.
  timelines.forEach(function (tlEl) {
    var progress = tlEl.querySelector('.timeline__progress');
    var steps = qsa('.step', tlEl);
    var readNum = document.querySelector('[data-step-current]');
    var readFill = document.querySelector('.process__readout-fill');
    var lastN = -1;
    var queued = false;
    var update = function () {
      queued = false;
      var line = window.innerHeight * 0.62;
      var r = tlEl.getBoundingClientRect();
      var tops = steps.map(function (s) { return s.getBoundingClientRect().top; });
      var p = Math.max(0, Math.min(1, (line - r.top) / r.height));
      if (progress) progress.style.transform = 'scaleY(' + p.toFixed(4) + ')';
      var n = 0;
      steps.forEach(function (s, i) {
        var on = tops[i] < line;
        s.classList.toggle('is-active', on);
        if (on) n++;
      });
      if (n !== lastN) {
        lastN = n;
        if (readNum) readNum.textContent = String(Math.max(1, n));
        if (readFill) readFill.style.transform = 'scaleX(' + Math.max(1, n) / steps.length + ')';
      }
    };
    var onScroll = function () { if (!queued) { queued = true; requestAnimationFrame(update); } };
    // Scroll-Listener nur, solange die Timeline in der Nähe des Viewports ist
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
      } else {
        window.removeEventListener('scroll', onScroll);
        update();
      }
    }, { rootMargin: '50% 0px 50% 0px' }).observe(tlEl);
    window.addEventListener('resize', onScroll);
  });

  if (!fullMotion) return;

  /* ======================================================================
     C  Desktop-Enhancement (GSAP-Stack wird erst nach dem Load nachgeladen)
     ====================================================================== */
  var load = function (src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = base + src;
      s.async = false; // Reihenfolge beibehalten
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  };
  var idle = function (fn) {
    if ('requestIdleCallback' in window) window.requestIdleCallback(fn, { timeout: 2000 });
    else setTimeout(fn, 300);
  };
  var start = function () {
    idle(function () {
      Promise.all([
        load('assets/vendor/gsap.min.js'),
        load('assets/vendor/ScrollTrigger.min.js'),
        load('assets/vendor/SplitText.min.js'),
        load('assets/vendor/lenis.min.js')
      ]).then(enhance).catch(function () { /* Lite-Motion bleibt aktiv */ });
    });
  };
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });

  function enhance() {
    var gsap = window.gsap;
    var ScrollTrigger = window.ScrollTrigger;
    var SplitText = window.SplitText;
    if (!gsap || !ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    if (SplitText) gsap.registerPlugin(SplitText);

    // Motion-Tokens (≙ CSS --ease-* / --dur-*)
    var M = { dur4: 1.1, easeOut: 'expo.out', stagger: 0.08 };

    /* ---------------------------------------------------------- C1 --- */
    if (window.Lenis) {
      lenis = new window.Lenis({ lerp: 0.11, wheelMultiplier: 1, syncTouch: false });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);

      // In-Page-Anker weich anfahren (Header-Höhe berücksichtigen)
      document.addEventListener('click', function (e) {
        var a = e.target.closest('a[href*="#"]');
        if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
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

    /* ---------------------------------------------------------- C2 --- */
    // Headlines, die noch nicht erschienen sind, übernimmt SplitText (Zeilen-Masken).
    var fontsReady = new Promise(function (resolve) {
      if (!document.fonts || !document.fonts.ready) return resolve();
      document.fonts.ready.then(resolve);
      setTimeout(resolve, 1200);
    });
    fontsReady.then(function () {
      if (SplitText) {
        qsa('[data-split]').forEach(function (el) {
          if (!pending.has(el)) return; // schon per Lite-Reveal sichtbar
          revealIO.unobserve(el);
          pending.delete(el);
          SplitText.create(el, {
            type: 'lines',
            mask: 'lines',
            linesClass: 'split-line',
            autoSplit: true,
            aria: 'auto', // Screenreader lesen weiterhin den ganzen Satz
            reduceWhiteSpace: false, // erhält &nbsp;
            onSplit: function (self) {
              el.classList.add('is-split');
              return gsap.from(self.lines, {
                yPercent: 112,
                duration: M.dur4,
                stagger: M.stagger,
                ease: M.easeOut,
                scrollTrigger: { trigger: el, start: 'top 88%', once: true }
              });
            }
          });
        });
      }

      /* -------------------------------------------------------- C3 --- */
      gsap.matchMedia().add('(min-width: 768px)', function () {
        qsa('[data-parallax]').forEach(function (media) {
          var img = media.querySelector('img');
          if (!img) return;
          var amount = parseFloat(media.getAttribute('data-parallax')) || 6;
          gsap.fromTo(img, { yPercent: -amount }, {
            yPercent: amount,
            ease: 'none',
            scrollTrigger: { trigger: media, start: 'top bottom', end: 'bottom top', scrub: 0.6 }
          });
        });
      });

      ScrollTrigger.refresh();
      // Spät geladene Bilder ändern keine Höhen (feste Maße) – ein gebündelter Refresh genügt
      var timer = null;
      qsa('img[loading="lazy"]').forEach(function (img) {
        if (!img.complete) img.addEventListener('load', function () {
          clearTimeout(timer);
          timer = setTimeout(function () { ScrollTrigger.refresh(); }, 250);
        }, { once: true });
      });
    });
  }
})();
