/* P.H.I.T – Klinik 2 „Präzision“
   Base UI works without any library. Motion layer (GSAP + ScrollTrigger + SplitText + Lenis)
   is progressive enhancement: start states are only applied once GSAP is available and
   the user has not asked for reduced motion. */
(function () {
  'use strict';
  var d = document;
  var root = d.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var lenis = null;
  root.classList.add('js');

  function qs(s, c) { return (c || d).querySelector(s); }
  function qsa(s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); }

  /* ---------------- year ---------------- */
  qsa('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  /* ---------------- header state ---------------- */
  var hdr = qs('.hdr');
  function onScroll() { if (hdr) hdr.classList.toggle('is-scrolled', window.scrollY > 8); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------------- skip link: move focus, not just scroll ---------------- */
  var skip = qs('.skip-link');
  if (skip) skip.addEventListener('click', function () {
    var main = d.getElementById('inhalt');
    if (main) setTimeout(function () { main.focus({ preventScroll: true }); }, 0);
  });

  /* ---------------- mobile menu ---------------- */
  var toggle = qs('.menu-toggle');
  var menu = d.getElementById('mmenu');
  if (toggle && menu) {
    var setOpen = function (open, returnFocus) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
      menu.hidden = !open;
      if (lenis) { if (open) lenis.stop(); else lenis.start(); }
      if (open) { var first = qs('a', menu); if (first) first.focus(); }
      else if (returnFocus) toggle.focus();
    };
    toggle.addEventListener('click', function () { setOpen(toggle.getAttribute('aria-expanded') !== 'true', false); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false, false); });
    d.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setOpen(false, true);
    });
    menu.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var items = qsa('a, button', menu);
      var last = items[items.length - 1];
      if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); toggle.focus(); }
    });
    toggle.addEventListener('keydown', function (e) {
      if (e.key === 'Tab' && e.shiftKey && toggle.getAttribute('aria-expanded') === 'true') {
        var items = qsa('a, button', menu); e.preventDefault(); items[items.length - 1].focus();
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1100 && toggle.getAttribute('aria-expanded') === 'true') setOpen(false, false);
    });
  }

  /* ---------------- Google Maps 2-click ---------------- */
  qsa('[data-map-load]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var box = btn.closest('[data-map]');
      if (!box || box.classList.contains('is-loaded')) return;
      var f = d.createElement('iframe');
      f.src = 'https://www.google.com/maps?q=Amraser+Stra%C3%9Fe+3,+6020+Innsbruck&output=embed';
      f.title = 'Google Maps: P.H.I.T im Hallenbad Amras';
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      f.setAttribute('allowfullscreen', '');
      box.appendChild(f);
      box.classList.add('is-loaded');
      f.focus();
    });
  });

  /* ---------------- contact form (frontend only) ---------------- */
  qsa('[data-contact-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var st = qs('.form-status', form);
      if (st) { st.hidden = false; st.focus(); }
    });
  });

  /* ---------------- bento spotlight (follows the pointer) ---------------- */
  qsa('[data-spotlight]').forEach(function (grid) {
    if (!canHover) return;
    var cards = qsa('.card', grid);
    var raf = 0, px = 0, py = 0;
    function paint() {
      raf = 0;
      for (var i = 0; i < cards.length; i++) {
        var r = cards[i].getBoundingClientRect();
        cards[i].style.setProperty('--x', (px - r.left) + 'px');
        cards[i].style.setProperty('--y', (py - r.top) + 'px');
      }
    }
    grid.addEventListener('pointermove', function (e) {
      px = e.clientX; py = e.clientY;
      if (!raf) raf = requestAnimationFrame(paint);
    }, { passive: true });
  });

  /* ---------------- anatomy: the block crossing the viewport centre selects the figure ---------------- */
  var aFigs = qsa('.anat-stage .anat-fig'), aBlocks = qsa('.anat-block');
  function setAnat(i) {
    aFigs.forEach(function (f, j) { f.classList.toggle('is-active', i === j); });
    aBlocks.forEach(function (b, j) { b.classList.toggle('is-active', i === j); });
  }
  if (aFigs.length && 'IntersectionObserver' in window) {
    setAnat(0);
    var aio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) setAnat(aBlocks.indexOf(en.target)); });
    }, { rootMargin: '-48% 0px -48% 0px' });
    aBlocks.forEach(function (b) { aio.observe(b); });
  }

  /* ---------------- micro visuals only run while visible ---------------- */
  var liveTargets = qsa('.card');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.target.classList.toggle('is-live', en.isIntersecting && !d.hidden); });
    }, { rootMargin: '40px 0px' });
    liveTargets.forEach(function (c) { io.observe(c); });
    d.addEventListener('visibilitychange', function () {
      if (d.hidden) liveTargets.forEach(function (c) { c.classList.remove('is-live'); });
      else liveTargets.forEach(function (c) { io.unobserve(c); io.observe(c); });
    });
  } else {
    liveTargets.forEach(function (c) { c.classList.add('is-live'); });
  }

  /* =====================================================================
     MOTION LAYER
     ===================================================================== */
  if (reduce || !window.gsap || !window.ScrollTrigger) return;
  var gsap = window.gsap, ScrollTrigger = window.ScrollTrigger, SplitText = window.SplitText;
  gsap.registerPlugin(ScrollTrigger);
  if (SplitText) gsap.registerPlugin(SplitText);
  root.classList.add('js-motion');

  /* motion tokens (mirror of the CSS custom properties) */
  var MOTION = {
    ease: { out: 'power3.out', expo: 'expo.out', io: 'power2.inOut', morph: 'power3.inOut', draw: 'none' },
    dur: { xs: 0.18, s: 0.32, m: 0.6, l: 1.1, xl: 1.6 },
    stagger: 0.07,
    rise: window.innerWidth < 768 ? 12 : 20
  };

  /* ---- Lenis smooth scroll, coupled to the GSAP ticker ---- */
  if (window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.11, anchors: { offset: -84 } });
    window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* ---- utilities ---- */
  function prepDraw(els) {
    els.forEach(function (p) {
      var len = 0;
      try { len = p.getTotalLength(); } catch (e) { len = 0; }
      if (!len) return;
      len = Math.ceil(len) + 1;
      gsap.set(p, { strokeDasharray: len + ' ' + len, strokeDashoffset: len });
    });
    return els;
  }

  /* draws an anatomical figure: outline → accents → points → leaders → labels */
  function figTimeline(fig, vars) {
    var svg = qs('svg', fig);
    var lines = qsa('.a-guide, .a-soft path, .a-lines path', svg);
    var acc = qsa('.a-accent path', svg);
    var lead = qsa('.a-leaders path', svg);
    var pts = qsa('.a-pt', svg);
    var labels = qsa('.a-label', fig);
    prepDraw(lines); prepDraw(acc); prepDraw(lead);
    if (pts.length) gsap.set(pts, { opacity: 0, scale: 0.2, transformOrigin: '50% 50%' });
    if (labels.length) gsap.set(labels, { opacity: 0, x: function (i, el) { return el.classList.contains('a-label--l') ? 10 : -10; } });
    var tl = gsap.timeline(vars);
    if (lines.length) tl.to(lines, { strokeDashoffset: 0, duration: 1, ease: MOTION.ease.draw, stagger: { amount: 0.6 } });
    if (acc.length) tl.to(acc, { strokeDashoffset: 0, duration: 0.45, ease: MOTION.ease.draw, stagger: 0.04 }, '-=0.45');
    if (pts.length) tl.to(pts, { opacity: 1, scale: 1, duration: 0.25, ease: 'back.out(2)', stagger: 0.06 }, '-=0.1');
    if (lead.length) tl.to(lead, { strokeDashoffset: 0, duration: 0.35, ease: MOTION.ease.draw, stagger: 0.06 }, '<');
    if (labels.length) tl.to(labels, { opacity: 1, x: 0, duration: 0.3, ease: MOTION.ease.out, stagger: 0.06 }, '-=0.2');
    return tl;
  }

  /* ---- headline splits (after fonts are ready) ---- */
  function showSplits() { qsa('[data-split]').forEach(function (el) { el.classList.add('is-split'); }); }
  var splitFallback = setTimeout(showSplits, 2500);
  (d.fonts && d.fonts.ready ? d.fonts.ready : Promise.resolve()).then(function () {
    clearTimeout(splitFallback);
    if (!SplitText) { showSplits(); return; }
    qsa('[data-split]').forEach(function (el) {
      var hero = el.getAttribute('data-split') === 'hero';
      SplitText.create(el, {
        type: 'lines', mask: 'lines', linesClass: 'sl', autoSplit: true, aria: 'auto',
        onSplit: function (self) {
          el.classList.add('is-split');
          var v = { yPercent: 110, duration: hero ? 1.25 : MOTION.dur.l, ease: MOTION.ease.expo, stagger: 0.09 };
          if (hero) v.delay = 0.2;
          else v.scrollTrigger = { trigger: el, start: 'top 88%', once: true };
          return gsap.from(self.lines, v);
        }
      });
    });
    ScrollTrigger.refresh();
  });

  /* ---- generic reveals ---- */
  var reveals = qsa('[data-reveal]');
  if (reveals.length) gsap.set(reveals, { opacity: 0, y: MOTION.rise });
  if (reveals.length) ScrollTrigger.batch(reveals, {
    start: 'top 90%', once: true,
    onEnter: function (batch) {
      gsap.to(batch, { opacity: 1, y: 0, duration: MOTION.dur.m + 0.2, ease: MOTION.ease.out, stagger: MOTION.stagger, overwrite: true, clearProps: 'transform' });
    }
  });

  /* ---- image masks ---- */
  qsa('[data-mask]').forEach(function (el) {
    var img = qs('img', el);
    var tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 86%', once: true } });
    tl.fromTo(el, { clipPath: 'inset(0% 0% 100% 0% round 14px)' }, { clipPath: 'inset(0% 0% 0% 0% round 14px)', duration: MOTION.dur.xl, ease: MOTION.ease.expo });
    if (img) tl.fromTo(img, { scale: 1.12 }, { scale: 1, duration: MOTION.dur.xl + 0.4, ease: MOTION.ease.expo, clearProps: 'transform' }, 0);
  });

  /* ---- meters / lines ---- */
  qsa('[data-bar]').forEach(function (el) {
    gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: MOTION.dur.xl, ease: MOTION.ease.expo, scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
  });
  qsa('.pips').forEach(function (el) {
    gsap.from(el.children, { scale: 0, duration: 0.5, ease: 'back.out(2.2)', stagger: 0.12, scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
  });
  qsa('.fact-wave path').forEach(function (p) {
    prepDraw([p]);
    gsap.to(p, { strokeDashoffset: 0, duration: 1.6, ease: MOTION.ease.io, scrollTrigger: { trigger: p, start: 'top 95%', once: true } });
  });
  var fl = qs('.floor');
  if (fl) {
    gsap.from(qs('.fl-train', fl), { scaleX: 0, transformOrigin: '0 50%', duration: MOTION.dur.xl, ease: MOTION.ease.expo, scrollTrigger: { trigger: fl, start: 'top 85%', once: true } });
  }

  /* ---- hero intro ---- */
  var hero = qs('.hero');
  if (hero) {
    var scan = qs('.scan', hero);
    var heroBits = qsa('.hero-label, .hero-lead, .hero-cta, .hero-meta', hero);
    var ret = qs('.scan-reticle', hero);
    gsap.set(heroBits, { opacity: 0, y: 14 });
    gsap.set(ret, { xPercent: -50, yPercent: -50 });
    var tl = gsap.timeline({ defaults: { ease: MOTION.ease.out } });
    tl.fromTo(scan, { clipPath: 'inset(0% 0% 100% 0% round 14px)' }, { clipPath: 'inset(0% 0% 0% 0% round 14px)', duration: 1.4, ease: MOTION.ease.expo }, 0.05)
      .fromTo(qs('.scan-img img', hero), { scale: 1.14 }, { scale: 1, duration: 2, ease: MOTION.ease.expo }, 0.05)
      .to(heroBits[0], { opacity: 1, y: 0, duration: 0.6 }, 0.1)
      .to(heroBits.slice(1), { opacity: 1, y: 0, duration: 0.8, stagger: 0.09 }, 0.55)
      .from(qsa('.scan-ui .c', hero), { opacity: 0, scale: 0.5, duration: 0.5, stagger: 0.05 }, 0.8)
      .fromTo(ret, { opacity: 0, scale: 0.55, rotation: -30 }, { opacity: 0.9, scale: 1, rotation: 0, duration: 1, ease: MOTION.ease.expo }, 0.95)
      .fromTo(qs('.scan-line', hero), { y: 0, opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.9)
      .to(qs('.scan-line', hero), { y: function () { return scan.offsetHeight - 2; }, duration: 1.7, ease: MOTION.ease.io }, 0.9)
      .to(qs('.scan-line', hero), { opacity: 0, duration: 0.35 }, 2.3)
      .from(qs('.plate', hero), { y: 28, opacity: 0, duration: 1, ease: MOTION.ease.expo }, 0.75)
      .from(qsa('.plate li, .plate-foot', hero), { opacity: 0, x: -8, duration: 0.5, stagger: 0.07 }, 1.05);
  }

  /* ---- Beckenboden page: draw pelvis immediately ---- */
  qsa('[data-draw-now]').forEach(function (fig) { figTimeline(fig, { delay: 0.35 }).timeScale(0.8); });

  /* ---- responsive scenes ---- */
  var mm = gsap.matchMedia();

  mm.add('(min-width: 1024px)', function () {
    /* anatomy: sticky stage, figures draw with scroll (selection via IntersectionObserver above) */
    var figs = qsa('.anat-stage .anat-fig');
    var blocks = qsa('.anat-block');
    figs.forEach(function (fig, i) {
      if (blocks[i]) figTimeline(fig, { scrollTrigger: { trigger: blocks[i], start: 'top 85%', end: 'top 38%', scrub: 0.6 } });
    });

    /* hero: gentle depth on scroll */
    var himg = qs('.hero .scan-img');
    if (himg) gsap.to(himg, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    /* treatment path: pinned panel that morphs between the five steps */
    var path = qs('.path');
    var cleanupPath = function () {};
    if (path) {
      path.classList.add('is-pinnable');
      var steps = qsa('.pstep', path), names = qsa('.pp-name', path), layers = qsa('.pl', path), dots = qsa('.pd', path), fill = qs('.pp-fill', path);
      var states = dots.map(function (dot) { return dot.getAttribute('data-s').split('|').map(function (p) { return p.split(',').map(Number); }); });
      var cur = -1;
      dots.forEach(function (dot, k) { gsap.set(dot, { x: states[k][0][0], y: states[k][0][1] }); });
      var go = function (i) {
        if (i === cur) return;
        cur = i;
        steps.forEach(function (s, j) { s.classList.toggle('is-on', j === i); });
        names.forEach(function (s, j) { s.classList.toggle('is-on', j === i); });
        layers.forEach(function (s, j) { s.classList.toggle('is-on', j === i); });
        dots.forEach(function (dot, k) {
          gsap.to(dot, { x: states[k][i][0], y: states[k][i][1], duration: 0.9, ease: MOTION.ease.morph, delay: k * 0.018, overwrite: true });
        });
      };
      go(0);
      ScrollTrigger.create({
        trigger: path, start: 'top top', end: function () { return '+=' + Math.round(window.innerHeight * 2.4); },
        pin: true, anticipatePin: 1,
        onUpdate: function (self) {
          go(Math.min(4, Math.floor(self.progress * 5)));
          gsap.set(fill, { scaleX: 0.2 + 0.8 * self.progress });
        }
      });
      cleanupPath = function () {
        path.classList.remove('is-pinnable');
        steps.forEach(function (s) { s.classList.remove('is-on'); });
        steps[0].classList.add('is-on');
        layers.forEach(function (s, j) { s.classList.toggle('is-on', j === 0); });
        names.forEach(function (s, j) { s.classList.toggle('is-on', j === 0); });
        dots.forEach(function (dot, k) { gsap.set(dot, { x: states[k][0][0], y: states[k][0][1] }); });
      };
    }

    return function () { cleanupPath(); };
  });

  mm.add('(max-width: 1023.98px)', function () {
    /* anatomy inline figures draw once when they enter */
    qsa('.anat-inline').forEach(function (fig) {
      figTimeline(fig, { scrollTrigger: { trigger: fig, start: 'top 82%', once: true } }).timeScale(0.75);
    });
  });

  /* layout settles once images are in */
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
