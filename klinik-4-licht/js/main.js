/* P.H.I.T – Klinik 4 „Licht“
   Basis-UI (ohne Abhängigkeiten) + Motion-System (GSAP, ScrollTrigger, SplitText, Lenis). */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var lenis = null;

  /* =====================================================================
     1) Basis-UI – funktioniert immer, auch ohne GSAP
     ===================================================================== */

  /* Mobile-Menü */
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('mobile-menu');
  function setMenu(open, returnFocus) {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    menu.hidden = !open;
    document.body.classList.toggle('menu-open', open);
    if (lenis) { open ? lenis.stop() : lenis.start(); }
    if (open) { var first = menu.querySelector('a'); if (first) first.focus(); }
    else if (returnFocus) toggle.focus();
  }
  if (toggle && menu) {
    toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true', false); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false, false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setMenu(false, true);
    });
    menu.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var items = menu.querySelectorAll('a, button');
      var first = items[0], last = items[items.length - 1];
      if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); toggle.focus(); }
      else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); toggle.focus(); }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1100 && toggle.getAttribute('aria-expanded') === 'true') setMenu(false, false);
    }, { passive: true });
  }

  /* Header-Zustand */
  var header = document.querySelector('.site-header');
  function onScrollHeader() { if (header) header.classList.toggle('is-scrolled', window.scrollY > 12); }
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* Google Maps – 2-Klick */
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
      var consent = box.querySelector('.map-consent');
      if (consent) consent.remove();
      iframe.setAttribute('tabindex', '0');
      iframe.focus();
    });
  }

  /* Kontaktformular – kein Versand */
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

  /* Jahr */
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  /* Lichtreflex folgt dem Cursor auf Karten */
  if (finePointer && !reduce) {
    document.querySelectorAll('.glow').forEach(function (card) {
      var x = 0, y = 0, pending = false;
      function paint() { pending = false; card.style.setProperty('--gx', x + 'px'); card.style.setProperty('--gy', y + 'px'); }
      card.addEventListener('pointerenter', function (e) {
        var r = card.getBoundingClientRect(); x = e.clientX - r.left; y = e.clientY - r.top; paint();
        card.classList.add('is-lit');
      });
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect(); x = e.clientX - r.left; y = e.clientY - r.top;
        if (!pending) { pending = true; requestAnimationFrame(paint); }
      });
      card.addEventListener('pointerleave', function () { card.classList.remove('is-lit'); });
    });
  }

  /* Licht in der Tiefe nur bewegen, wenn sichtbar (CSS-Animation, Compositor) */
  if (!reduce && 'IntersectionObserver' in window) {
    var flowIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.target.classList.toggle('is-flowing', en.isIntersecting); });
    });
    document.querySelectorAll('[data-deep]').forEach(function (el) { flowIO.observe(el); });
  }

  /* =====================================================================
     2) Motion-System – nur mit GSAP und ohne reduced motion
     ===================================================================== */
  var gsap = window.gsap, ScrollTrigger = window.ScrollTrigger, SplitText = window.SplitText;
  if (reduce || !gsap || !ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  if (SplitText) gsap.registerPlugin(SplitText);
  root.classList.add('js-motion');

  var small = window.matchMedia('(max-width: 767px)').matches;

  /* Motion-Tokens */
  var M = {
    ease: { out: 'expo.out', soft: 'power3.out', inOut: 'power2.inOut', line: 'sine.inOut' },
    dur: { s: 0.5, m: 0.9, l: 1.25, xl: 1.8 },
    stagger: 0.08,
    rise: small ? 14 : 26,
    blur: small ? 0 : 12,
    start: 'top 88%'
  };

  /* Lenis – nur Desktop-Zeiger (syncTouch bleibt false) */
  if (window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.11, wheelMultiplier: 0.95, anchors: { offset: -88 }, autoRaf: false });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    lenis.on('scroll', onScrollHeader);
  }

  /* ---- Reveal-Utilities ---- */
  function willChange(els, v) { gsap.set(els, { willChange: v }); }

  // a) rise: Opacity + Versatz, in Gruppen gestaffelt
  var rises = gsap.utils.toArray('[data-reveal="rise"]');
  if (rises.length) gsap.set(rises, { autoAlpha: 0, y: M.rise });
  if (rises.length) ScrollTrigger.batch(rises, {
    start: M.start,
    once: true,
    onEnter: function (batch) {
      // beim schnellen Springen (Anker, Lenis) nicht alles nacheinander staffeln:
      // bereits passierte Elemente sofort zeigen, nur sichtbare Elemente kurz gestaffelt einblenden
      var inView = [], passed = [];
      batch.forEach(function (el) { (el.getBoundingClientRect().bottom < 0 ? passed : inView).push(el); });
      if (passed.length) gsap.set(passed, { autoAlpha: 1, y: 0, clearProps: 'transform' });
      if (!inView.length) return;
      willChange(inView, 'transform, opacity');
      gsap.to(inView, {
        autoAlpha: 1, y: 0, duration: M.dur.m, ease: M.ease.out, overwrite: true,
        stagger: Math.min(M.stagger, 0.48 / inView.length),
        onComplete: function () { gsap.set(inView, { clearProps: 'transform,willChange' }); }
      });
    }
  });

  // b) image: weicher Blur-zu-scharf-Reveal (filter nur kurz)
  gsap.utils.toArray('[data-reveal="image"]').forEach(function (frame) {
    var img = frame.querySelector('img');
    if (!img) return;
    gsap.set(frame, { autoAlpha: 0 });
    gsap.set(img, { scale: 1.06, filter: M.blur ? 'blur(' + M.blur + 'px)' : 'none' });
    ScrollTrigger.create({
      trigger: frame, start: 'top 85%', once: true,
      onEnter: function () {
        willChange(img, 'transform, filter');
        gsap.timeline({ onComplete: function () { gsap.set(img, { clearProps: 'filter,transform,willChange' }); } })
          .to(frame, { autoAlpha: 1, duration: M.dur.s, ease: 'none' }, 0)
          .to(img, { scale: 1, duration: M.dur.xl, ease: M.ease.out }, 0)
          .to(img, { filter: 'blur(0px)', duration: 0.9, ease: M.ease.soft }, 0);
      }
    });
  });

  // c) line: Wasserlinie zeichnet sich (clip-path)
  gsap.utils.toArray('[data-reveal="line"]').forEach(function (line) {
    gsap.set(line, { clipPath: 'inset(0 100% 0 0)' });
    ScrollTrigger.create({
      trigger: line, start: 'top 92%', once: true,
      onEnter: function () { gsap.to(line, { clipPath: 'inset(0 0% 0 0)', duration: 1.8, ease: M.ease.line }); }
    });
  });

  // d) split: Headline-Zeilen steigen aus einer Maske
  // Mobile: die Hero-Headline steht sofort (LCP), alle anderen Headlines werden gesplittet
  var splitTargets = gsap.utils.toArray('[data-split]').filter(function (el) { return !(small && el.getAttribute('data-split') === 'hero'); });
  if (splitTargets.length) gsap.set(splitTargets, { autoAlpha: 0 });
  var heroIntro = buildHeroIntro();
  if (small) heroIntro.play();

  function runSplits() {
    if (!SplitText) { gsap.to(splitTargets, { autoAlpha: 1, duration: M.dur.s }); if (heroIntro) heroIntro.play(); return; }
    splitTargets.forEach(function (el) {
      var isHero = el.getAttribute('data-split') === 'hero';
      var played = false;
      SplitText.create(el, {
        type: 'lines', mask: 'lines', linesClass: 'line', autoSplit: true,
        onSplit: function (self) {
          gsap.set(el, { autoAlpha: 1 });
          if (played) return;
          if (isHero) {
            gsap.set(self.lines, { yPercent: 108 });
            heroIntro.to(self.lines, { yPercent: 0, duration: M.dur.l, ease: M.ease.out, stagger: 0.1, onComplete: function () { played = true; } }, 0.15);
            heroIntro.play();
            return;
          }
          return gsap.from(self.lines, {
            yPercent: 108, duration: M.dur.l, ease: M.ease.out, stagger: 0.09,
            scrollTrigger: { trigger: el, start: M.start, once: true },
            onComplete: function () { played = true; }
          });
        }
      });
    });
    if (!splitTargets.some(function (el) { return el.getAttribute('data-split') === 'hero'; }) && heroIntro) heroIntro.play();
  }
  var fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  var fallback = new Promise(function (r) { setTimeout(r, 2200); });
  Promise.race([fontsReady, fallback]).then(runSplits);

  // e) Hero-Intro: Licht blendet auf, Inhalte folgen
  function buildHeroIntro() {
    var light = document.querySelector('.hero-light');
    var items = gsap.utils.toArray('[data-hero-item]');
    var plate = document.querySelector('[data-hero-plate]');
    var tl = gsap.timeline({ paused: true, defaults: { ease: M.ease.out } });
    if (light) { gsap.set(light, { autoAlpha: 0 }); tl.to(light, { autoAlpha: 1, duration: 2.2, ease: 'sine.out' }, 0); }
    if (items.length) { gsap.set(items, { autoAlpha: 0, y: M.rise }); tl.to(items, { autoAlpha: 1, y: 0, duration: M.dur.l, stagger: 0.09, clearProps: 'transform' }, small ? 0.05 : 0.35); }
    if (plate && !small) {
      gsap.set(plate, { autoAlpha: 0, y: M.rise * 1.6 });
      tl.to(plate, { autoAlpha: 1, y: 0, duration: M.dur.xl, clearProps: 'transform' }, 0.55);
      var rows = plate.querySelectorAll('li');
      if (rows.length) { gsap.set(rows, { autoAlpha: 0, x: -10 }); tl.to(rows, { autoAlpha: 1, x: 0, duration: M.dur.m, stagger: 0.07 }, 0.95); }
    }
    // Sicherheitsnetz: falls etwas hängt, nach 3 s alles zeigen
    setTimeout(function () { if (!tl.isActive() && tl.progress() === 0) tl.play(); }, 3000);
    return tl;
  }

  /* ---- Szenen ---- */
  var mm = gsap.matchMedia();
  mm.add('(min-width: 768px)', function () {
    // Hero: Licht sinkt beim Scrollen langsamer ab und wird leiser
    var light = document.querySelector('.hero .hero-light');
    if (light) {
      gsap.to(light, { yPercent: 14, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }
    var plate = document.querySelector('.hero .plate');
    if (plate) gsap.to(plate, { y: -48, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    // Eintauchen: die Tiefe öffnet sich zur vollen Breite
    gsap.utils.toArray('[data-deep]').forEach(function (panel) {
      gsap.fromTo(panel,
        { clipPath: 'inset(0% 4% 0% 4% round 36px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none',
          scrollTrigger: { trigger: panel, start: 'top 92%', end: 'top 22%', scrub: 0.6 } });
    });

    // Bild in der Tiefe: sanfte Parallaxe
    gsap.utils.toArray('.deep-media .media').forEach(function (m) {
      gsap.fromTo(m, { y: 40 }, { y: -40, ease: 'none', scrollTrigger: { trigger: m, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  });

  /* ---- Gezeiten: Hintergrund gleitet Weiß → Aqua → Weiß ---- */
  var tide = document.querySelector('.tide');
  var aquaSections = gsap.utils.toArray('[data-tone="aqua"]');
  if (tide && aquaSections.length) {
    var setTide = gsap.quickSetter(tide, 'opacity');
    var levels = aquaSections.map(function () { return 0; });
    function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
    function ease(v) { return v * v * (3 - 2 * v); }
    aquaSections.forEach(function (sec, idx) {
      ScrollTrigger.create({
        trigger: sec, start: 'top bottom', end: 'bottom top',
        onUpdate: update, onRefresh: update, onToggle: update
      });
      function update(self) {
        var vh = window.innerHeight;
        var total = self.end - self.start;          // = Höhe + vh
        var hgt = total - vh;
        var top = vh - self.progress * total;       // Oberkante relativ zum Viewport
        var bottom = top + hgt;
        var enter = clamp01((vh * 0.82 - top) / (vh * 0.42));
        var leave = clamp01((bottom - vh * 0.18) / (vh * 0.42));
        levels[idx] = ease(Math.min(enter, leave));
        setTide(Math.max.apply(null, levels));
      }
    });
  }

  /* ---- Nach Bildern neu messen ---- */
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  document.querySelectorAll('img[loading="lazy"]').forEach(function (img) {
    if (!img.complete) img.addEventListener('load', debounceRefresh, { once: true });
  });
  var refreshTimer = 0;
  function debounceRefresh() { clearTimeout(refreshTimer); refreshTimer = setTimeout(function () { ScrollTrigger.refresh(); }, 250); }

  /* Details (FAQ) ändern die Höhe */
  document.querySelectorAll('details').forEach(function (d) { d.addEventListener('toggle', debounceRefresh); });
})();
