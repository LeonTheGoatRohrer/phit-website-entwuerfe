/* P.H.I.T – Klinik 3 „Kinetik“
   Basis-Interaktionen laufen immer. Motion (GSAP + ScrollTrigger + SplitText + Lenis)
   nur, wenn die Bibliotheken geladen sind und keine reduzierte Bewegung gewünscht ist. */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var q = function (s, c) { return (c || document).querySelector(s); };
  var qa = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var lenis = null;

  /* ------------------------------------------------------------------
     Motion-System: Tokens
     ------------------------------------------------------------------ */
  var M = {
    ease: { out: 'expo.out', inOut: 'power3.inOut', soft: 'power2.out', none: 'none' },
    dur: { xs: 0.3, s: 0.6, m: 0.9, l: 1.3 },
    stagger: { s: 0.05, m: 0.09 },
    scrub: 0.7
  };

  /* ------------------------------------------------------------------
     Basis: Menü, Header, Karte, Formular, Laufband, Jahr
     ------------------------------------------------------------------ */
  var toggle = q('.menu-toggle');
  var menu = q('#mobile-menu');
  function setMenu(open, returnFocus) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    menu.hidden = !open;
    document.body.classList.toggle('menu-open', open);
    if (lenis) { open ? lenis.stop() : lenis.start(); }
    if (open) { var first = q('a', menu); if (first) first.focus(); }
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
      var items = qa('a, button', menu);
      if (!e.shiftKey && document.activeElement === items[items.length - 1]) { e.preventDefault(); toggle.focus(); }
    });
    toggle.addEventListener('keydown', function (e) {
      if (e.key === 'Tab' && e.shiftKey && toggle.getAttribute('aria-expanded') === 'true') {
        var items = qa('a, button', menu); e.preventDefault(); items[items.length - 1].focus();
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1100 && toggle.getAttribute('aria-expanded') === 'true') setMenu(false, false);
    });
  }

  var header = q('.site-header');
  var callbar = q('.callbar');
  var footer = q('.site-footer');
  var lastY = window.scrollY;
  function onScroll() {
    var y = window.scrollY;
    if (header) {
      header.classList.toggle('is-scrolled', y > 8);
      if (!reduce && root.classList.contains('js-motion')) {
        var menuOpen = toggle && toggle.getAttribute('aria-expanded') === 'true';
        if (y > 480 && y > lastY + 2 && !menuOpen && !header.contains(document.activeElement)) header.classList.add('is-hidden');
        else if (y < lastY - 2 || y <= 480) header.classList.remove('is-hidden');
      }
    }
    if (callbar && footer) {
      callbar.classList.toggle('is-away', footer.getBoundingClientRect().top < window.innerHeight - 40);
    }
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  if (header) header.addEventListener('focusin', function () { header.classList.remove('is-hidden'); });
  onScroll();

  var mapBtn = q('[data-map-load]');
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
      var consent = q('.map-consent', box);
      if (consent) consent.remove();
      iframe.setAttribute('tabindex', '0');
      iframe.focus();
    });
  }

  var form = q('[data-contact-form]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var status = q('.form-status', form);
      status.hidden = false;
      status.focus();
    });
  }

  var marquee = q('.marquee');
  var mToggle = q('.marquee-toggle');
  if (marquee && mToggle) {
    mToggle.addEventListener('click', function () {
      var paused = marquee.classList.toggle('is-paused');
      mToggle.setAttribute('aria-pressed', String(paused));
    });
  }

  var year = q('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------
     Motion
     ------------------------------------------------------------------ */
  if (reduce || !window.gsap || !window.ScrollTrigger) return;

  var gsap = window.gsap;
  var ST = window.ScrollTrigger;
  var hasSplit = !!window.SplitText;

  try {
    root.classList.add('js-motion');
    gsap.registerPlugin(ST);
    if (hasSplit) gsap.registerPlugin(window.SplitText);
    initMotion();
  } catch (err) {
    // Sicherheitsnetz: niemals Inhalte versteckt lassen
    root.classList.remove('js-motion', 'm-desk', 'm-mob');
    try { ST.getAll().forEach(function (t) { t.kill(); }); } catch (e) { /* noop */ }
    gsap.set(qa('[data-reveal], [data-stagger] > *, [data-mask], [data-mask] img, .hero-title, [data-split-hero], .step, .card'), { clearProps: 'all' });
  }

  function initMotion() {
    /* ---------- Lenis (nur Wheel, Touch bleibt nativ) ---------- */
    if (window.Lenis) {
      lenis = new window.Lenis({ lerp: 0.11, wheelMultiplier: 1, syncTouch: false });
      lenis.on('scroll', ST.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    /* ---------- In-Page-Anker über Lenis ---------- */
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a || !lenis) return;
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = document.getElementById(id.slice(1));
      if (!target) return;
      e.preventDefault();
      header && header.classList.remove('is-hidden');
      lenis.scrollTo(target, { offset: id === '#inhalt' ? 0 : -(header ? header.offsetHeight : 0) + 1, duration: 1.2 });
      if (history.pushState) history.pushState(null, '', id);
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });

    /* ---------- Utilities ---------- */
    revealUp(qa('[data-reveal]'));
    qa('[data-stagger]').forEach(function (g) { revealUp(qa(':scope > *', g), true); });
    masks(qa('[data-mask]'));

    /* ---------- Breakpoint-abhängige Szenen ---------- */
    var mm = gsap.matchMedia();
    mm.add({
      desk: '(min-width: 1024px) and (min-height: 600px)',
      mob: '(max-width: 1023.98px), (max-height: 599.98px)'
    }, function (ctx) {
      var desk = ctx.conditions.desk;
      root.classList.add(desk ? 'm-desk' : 'm-mob');
      var cleanups = [];
      if (desk) {
        heroDesk();
        cleanups.push(servicesDesk());
        cleanups.push(stepsDesk());
        subHeroGrow(true);
        parallax();
        skewOnVelocity();
        cleanups.push(motionLine());
      } else {
        heroMob();
        cleanups.push(servicesMob());
        subHeroGrow(false);
        progressBar();
      }
      return function () {
        cleanups.forEach(function (f) { if (typeof f === 'function') f(); });
        root.classList.remove('m-desk', 'm-mob');
      };
    });

    ST.sort();
    ST.refresh();

    /* ---------- Typo-Splits nach dem Laden der Schriften ---------- */
    var fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    var splitDone = false;
    var showTitles = function () { gsap.set(qa('.hero-title, [data-split-hero]'), { visibility: 'visible' }); };
    setTimeout(function () { if (!splitDone) showTitles(); }, 2500);
    fontsReady.then(function () {
      splitDone = true;
      if (!hasSplit) { showTitles(); heroIntro(null); return; }
      var heroTitle = q('.hero-title') || q('[data-split-hero]');
      if (heroTitle) {
        var played = false;
        window.SplitText.create(heroTitle, {
          type: 'words', mask: 'words', wordsClass: 'w', autoSplit: true,
          onSplit: function (self) {
            gsap.set(heroTitle, { visibility: 'visible' });
            if (played) return;
            played = true;
            return heroIntro(self.words);
          }
        });
      } else { heroIntro(null); }
      qa('[data-split]').forEach(function (el) {
        var done = false;
        window.SplitText.create(el, {
          type: 'lines', mask: 'lines', linesClass: 'ln', autoSplit: true,
          onSplit: function (self) {
            if (done) return;
            return gsap.from(self.lines, {
              yPercent: 112, duration: M.dur.m + 0.1, ease: M.ease.out, stagger: M.stagger.m,
              scrollTrigger: { trigger: el, start: 'top 88%', once: true, onEnter: function () { done = true; } }
            });
          }
        });
      });
      ST.sort();
      ST.refresh();
      jumpToHash();
    });

    window.addEventListener('load', function () { ST.refresh(); });
  }

  /* ---------- Reveal-Utilities ---------- */
  function revealUp(els, group) {
    if (!els.length) return;
    gsap.set(els, { autoAlpha: 0, y: 26 });
    ST.batch(els, {
      start: 'top 90%', once: true,
      onEnter: function (batch) {
        gsap.to(batch, { autoAlpha: 1, y: 0, duration: M.dur.m, ease: M.ease.out, stagger: group ? M.stagger.m : M.stagger.s, overwrite: true, clearProps: 'transform' });
      }
    });
  }

  function masks(els) {
    els.forEach(function (el) {
      var dir = el.getAttribute('data-mask');
      var from = dir === 'left' ? 'inset(0% 100% 0% 0%)' : 'inset(100% 0% 0% 0%)';
      var img = q('img', el);
      gsap.set(el, { clipPath: from });
      if (img) gsap.set(img, { scale: 1.16 });
      ST.create({
        trigger: el, start: 'top 86%', once: true,
        onEnter: function () {
          gsap.to(el, { clipPath: 'inset(0% 0% 0% 0%)', duration: M.dur.l, ease: M.ease.out, clearProps: 'clipPath' });
          if (img) gsap.to(img, { scale: 1, duration: M.dur.l + 0.4, ease: M.ease.out, clearProps: 'transform' });
        }
      });
    });
  }

  /* ---------- Hero ---------- */
  function heroIntro(words) {
    var tl = gsap.timeline({ defaults: { ease: M.ease.out } });
    var hero = q('.hero') || q('.page-hero');
    if (!hero) return tl;
    var label = q('.label', hero);
    var copy = qa('.hero-copy > *', hero);
    var img = q('.hero-img');
    if (label) tl.from(label, { autoAlpha: 0, y: 12, duration: M.dur.s }, 0);
    if (words) tl.from(words, { yPercent: 108, duration: M.dur.l, stagger: 0.07 }, 0.08);
    if (copy.length) tl.from(copy, { autoAlpha: 0, y: 22, duration: M.dur.m, stagger: M.stagger.m, clearProps: 'transform' }, 0.45);
    if (img) tl.from(img, { autoAlpha: 0, scale: 1.08, duration: M.dur.l + 0.3, clearProps: 'transform' }, 0.2);
    if (header) tl.from(header, { autoAlpha: 0, y: -12, duration: M.dur.s, clearProps: 'transform,opacity,visibility' }, 0);
    return tl;
  }

  function heroDesk() {
    var stage = q('.hero-stage');
    if (!stage) return;
    var media = q('.hero-media'), slot = q('.hero-slot');
    var imgEl = q('.hero-img img');
    var a = q('.h1-a'), b = q('.h1-b');
    var copy = q('.hero-copy'), lab = q('.hero-head .label');
    var shade = q('.hero-shade'), caps = qa('.hero-cap span'), plate = q('.hero .plate');

    var card = function () {
      var s = stage.getBoundingClientRect(), r = slot.getBoundingClientRect();
      return 'inset(' + (r.top - s.top) + 'px ' + (s.right - r.right) + 'px ' + (s.bottom - r.bottom) + 'px ' + (r.left - s.left) + 'px round 22px)';
    };

    var tl = gsap.timeline({
      defaults: { ease: M.ease.none },
      scrollTrigger: {
        trigger: '.hero', start: 'top top', end: '+=140%', pin: stage, scrub: M.scrub,
        invalidateOnRefresh: true, anticipatePin: 1
      }
    });
    tl.fromTo(media, { clipPath: card }, { clipPath: 'inset(0px 0px 0px 0px round 0px)', duration: 1, ease: 'power2.inOut' }, 0)
      .fromTo(imgEl, { xPercent: 6, yPercent: function () { var s = stage.getBoundingClientRect(), r = slot.getBoundingClientRect(); return ((r.top - s.top) / s.height) * 100 + 1; }, scale: 1.08 }, { xPercent: 0, yPercent: 0, scale: 1, duration: 1, ease: 'power2.inOut' }, 0)
      .fromTo(a, { xPercent: 0 }, { xPercent: -16, duration: 1 }, 0)
      .fromTo(b, { xPercent: 0 }, { xPercent: 12, duration: 1 }, 0)
      .to([copy, lab], { autoAlpha: 0, y: -32, duration: 0.35, ease: 'power1.in' }, 0)
      .fromTo(shade, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.55)
      .fromTo(caps, { autoAlpha: 0, yPercent: 40 }, { autoAlpha: 1, yPercent: 0, duration: 0.3, stagger: 0.07, ease: M.ease.soft }, 0.68)
      .fromTo(plate, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: M.ease.soft }, 0.78)
      .to({}, { duration: 0.25 });
  }

  function heroMob() {
    var img = q('.hero-img img');
    if (!img) return;
    gsap.fromTo(img, { scale: 1.12 }, {
      scale: 1, ease: M.ease.none,
      scrollTrigger: { trigger: '.hero-slot', start: 'top bottom', end: 'bottom top', scrub: true }
    });
  }

  /* Unterseiten-Hero: Bild öffnet sich beim Scrollen leicht (kein Pin) */
  function subHeroGrow(desk) {
    var el = q('[data-grow]');
    if (!el) return;
    var img = q('img', el);
    gsap.fromTo(el, { clipPath: 'inset(0% 0% 100% 0% round 28px)' }, { clipPath: 'inset(0% 0% 0% 0% round 28px)', duration: M.dur.l, ease: M.ease.out, delay: 0.2, clearProps: desk ? '' : 'clipPath' });
    if (img) gsap.fromTo(img, { scale: 1.18 }, {
      scale: 1, ease: M.ease.none,
      scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom top', scrub: true }
    });
    if (desk) {
      gsap.to(el, {
        clipPath: 'inset(4% 6% 0% 6% round 28px)', ease: M.ease.none, immediateRender: false,
        scrollTrigger: { trigger: el, start: 'center center', end: 'bottom top', scrub: true }
      });
    }
  }

  /* ---------- Leistungen: horizontale Spur ---------- */
  function setTrackProgress(p, n) {
    var cur = q('.tp-cur'), bar = q('.tp-bar span');
    if (!cur || !bar) return;
    var i = Math.min(n, Math.round(p * (n - 1)) + 1);
    cur.textContent = (i < 10 ? '0' : '') + i;
    bar.style.transform = 'scaleX(' + Math.max(0.1, p) + ')';
  }

  function servicesDesk() {
    var section = q('.services'), pinEl = q('.services-pin'), track = q('.track');
    if (!section || !track) return;
    var cards = qa('.card', track);
    var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
    var tween = gsap.to(track, {
      x: function () { return -dist(); }, ease: M.ease.none,
      scrollTrigger: {
        trigger: section, start: 'top top', end: function () { return '+=' + dist(); },
        pin: pinEl, scrub: M.scrub, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: function (self) { setTrackProgress(self.progress, cards.length); }
      }
    });
    qa('.card-media img', track).forEach(function (img) {
      gsap.fromTo(img, { xPercent: -5 }, {
        xPercent: 5, ease: M.ease.none,
        scrollTrigger: { trigger: img.closest('.card'), containerAnimation: tween, start: 'left right', end: 'right left', scrub: true }
      });
    });
    gsap.from(cards.slice(0, 4), {
      x: 90, autoAlpha: 0, duration: M.dur.l, ease: M.ease.out, stagger: M.stagger.m, clearProps: 'transform,opacity,visibility',
      scrollTrigger: { trigger: section, start: 'top 72%', once: true }
    });
    // Tastatur: fokussierte Karte in den sichtbaren Bereich scrollen
    var onFocus = function (e) {
      var card = e.target.closest('.card');
      var st = tween.scrollTrigger;
      if (!card || !st) return;
      var vp = q('.track-viewport'); if (vp) vp.scrollLeft = 0;
      var p = Math.min(1, Math.max(0, (card.offsetLeft - track.firstElementChild.offsetLeft) / (dist() || 1)));
      var y = st.start + p * (st.end - st.start);
      if (lenis) lenis.scrollTo(y, { immediate: true }); else window.scrollTo(0, y);
    };
    track.addEventListener('focusin', onFocus);
    setTrackProgress(0, cards.length);
    return function () { track.removeEventListener('focusin', onFocus); };
  }

  function servicesMob() {
    var track = q('.track');
    if (!track) return;
    var n = qa('.card', track).length;
    var on = function () {
      var max = track.scrollWidth - track.clientWidth;
      setTrackProgress(max > 0 ? track.scrollLeft / max : 0, n);
    };
    track.addEventListener('scroll', on, { passive: true });
    on();
    return function () { track.removeEventListener('scroll', on); };
  }

  /* ---------- Ablauf: gepinnte Szene mit 4 Schritten ---------- */
  function stepsDesk() {
    var scene = q('.steps-scene');
    if (!scene) return;
    var steps = qa('.step', scene);
    var navs = qa('.steps-nav li', scene);
    var nav = q('.steps-nav', scene);
    var fill = document.createElement('span');
    fill.className = 'sn-fill';
    nav.appendChild(fill);
    var n = steps.length;
    gsap.set(steps.slice(1), { opacity: 0, yPercent: 14 });
    var setActive = function (i) {
      navs.forEach(function (li, k) { li.classList.toggle('is-active', k === i); li.classList.toggle('is-done', k < i); });
      steps.forEach(function (s, k) { s.classList.toggle('is-current', k === i); });
    };
    var tl = gsap.timeline({
      defaults: { ease: M.ease.none },
      scrollTrigger: {
        trigger: scene, start: 'top top', end: '+=' + (n - 1) * 85 + '%', pin: '.steps-pin', scrub: M.scrub,
        invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: function (self) {
          setActive(Math.min(n - 1, Math.floor(self.progress * (n - 1) + 0.5)));
          fill.style.transform = 'scaleY(' + self.progress + ')';
        }
      }
    });
    tl.addLabel('s0').to({}, { duration: 0.35 });
    for (var i = 1; i < n; i++) {
      tl.to(steps[i - 1], { opacity: 0, yPercent: -10, duration: 0.35, ease: 'power2.in' })
        .fromTo(steps[i], { opacity: 0, yPercent: 10 }, { opacity: 1, yPercent: 0, duration: 0.4, ease: 'power2.out' }, '>0.05')
        .addLabel('s' + i)
        .to({}, { duration: 0.35 });
    }
    setActive(0);
    // Tastatur: Link in einem Schritt fokussiert -> zu diesem Schritt springen
    var onFocus = function (e) {
      var step = e.target.closest('.step');
      var st = tl.scrollTrigger;
      if (!step || !st) return;
      var y = st.start + (st.end - st.start) * (tl.labels['s' + steps.indexOf(step)] / tl.duration());
      if (lenis) lenis.scrollTo(y, { immediate: true }); else window.scrollTo(0, y);
    };
    scene.addEventListener('focusin', onFocus);
    return function () { scene.removeEventListener('focusin', onFocus); if (fill.parentNode) fill.parentNode.removeChild(fill); navs.forEach(function (li) { li.className = ''; }); steps.forEach(function (s) { s.classList.remove('is-current'); }); };
  }

  /* ---------- Parallaxe in Bildmasken ---------- */
  function parallax() {
    qa('.par').forEach(function (p) {
      gsap.fromTo(p, { yPercent: -5 }, {
        yPercent: 5, ease: M.ease.none,
        scrollTrigger: { trigger: p.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
  }

  /* ---------- Skew nach Scroll-Geschwindigkeit (max. 2,5°) ---------- */
  function skewOnVelocity() {
    var els = qa('[data-skew]');
    if (!els.length) return;
    var setters = els.map(function (el) { return gsap.quickSetter(el, 'skewY', 'deg'); });
    var clamp = gsap.utils.clamp(-2.5, 2.5);
    var proxy = { skew: 0 };
    gsap.set(els, { transformOrigin: '50% 50%' });
    ST.create({
      start: 0, end: 'max',
      onUpdate: function (self) {
        var s = clamp(self.getVelocity() / -450);
        if (Math.abs(s) > Math.abs(proxy.skew)) {
          proxy.skew = s;
          gsap.to(proxy, {
            skew: 0, duration: 0.8, ease: 'power3', overwrite: true,
            onUpdate: function () { setters.forEach(function (f) { f(proxy.skew); }); }
          });
        }
      }
    });
  }

  /* ---------- Bewegungslinie (roter Faden) ---------- */
  function motionLine() {
    var host = q('.mline'), main = q('main');
    var secs = qa('[data-line]');
    if (!host || secs.length < 2) return;
    var NS = 'http://www.w3.org/2000/svg';
    var mk = function (tag, attrs) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); return e; };
    var base = mk('svg', { 'class': 'ml-base', 'aria-hidden': 'true', focusable: 'false' });
    var draw = mk('svg', { 'class': 'ml-draw', 'aria-hidden': 'true', focusable: 'false' });
    var pBase = mk('path', {}), pDraw = mk('path', {});
    base.appendChild(pBase); draw.appendChild(pDraw);
    var dot = document.createElement('span'); dot.className = 'ml-dot';
    host.appendChild(base); host.appendChild(draw); host.appendChild(dot);
    var lut = [], nodes = [], H = 0, startY = 0;

    function build() {
      var mr = main.getBoundingClientRect();
      var top0 = mr.top + window.scrollY;
      var W = main.clientWidth;
      H = main.scrollHeight;
      var wrap = q('.wrap', main);
      var margin = wrap ? (W - wrap.getBoundingClientRect().width) / 2 : 60;
      var xL = Math.round(margin / 2), xR = Math.round(W - margin / 2);
      var pts = secs.map(function (s) {
        var box = s.parentElement && s.parentElement.classList.contains('pin-spacer') ? s.parentElement : s;
        var r = box.getBoundingClientRect();
        var pad = Math.min(130, parseFloat(getComputedStyle(s).paddingTop) * 0.72 || 60);
        return { x: s.getAttribute('data-line') === 'r' ? xR : xL, a: r.top + window.scrollY - top0 + pad, b: r.bottom + window.scrollY - top0 - pad };
      });
      var d = 'M' + pts[0].x + ' ' + pts[0].a;
      pts.forEach(function (p, i) {
        if (i > 0) {
          var prev = pts[i - 1], mid = (prev.b + p.a) / 2;
          d += ' C' + prev.x + ' ' + mid + ' ' + p.x + ' ' + mid + ' ' + p.x + ' ' + p.a;
        }
        d += ' L' + p.x + ' ' + p.b;
      });
      [base, draw].forEach(function (s) { s.setAttribute('width', W); s.setAttribute('height', H); s.setAttribute('viewBox', '0 0 ' + W + ' ' + H); });
      host.style.height = H + 'px';
      pBase.setAttribute('d', d); pDraw.setAttribute('d', d);
      nodes.forEach(function (n) { n.remove(); });
      nodes = pts.map(function (p) { var c = mk('circle', { cx: p.x, cy: p.a, r: 4.5, 'class': 'ml-node' }); draw.parentNode && base.appendChild(c); return c; });
      // Lookup-Tabelle y -> x (Pfad ist in y monoton)
      var len = pDraw.getTotalLength();
      lut = [];
      for (var l = 0; l <= len; l += 6) { var pt = pDraw.getPointAtLength(l); lut.push([pt.y, pt.x]); }
      startY = pts[0].a;
      host._top0 = top0;
      update();
    }

    function xAt(y) {
      var lo = 0, hi = lut.length - 1;
      if (!lut.length) return 0;
      if (y <= lut[0][0]) return lut[0][1];
      if (y >= lut[hi][0]) return lut[hi][1];
      while (hi - lo > 1) { var m = (lo + hi) >> 1; if (lut[m][0] < y) lo = m; else hi = m; }
      var A = lut[lo], B = lut[hi], t = (y - A[0]) / ((B[0] - A[0]) || 1);
      return A[1] + (B[1] - A[1]) * t;
    }

    function update() {
      if (!lut.length) return;
      var y = window.scrollY + window.innerHeight * 0.58 - (host._top0 || 0);
      var endY = lut[lut.length - 1][0];
      var yc = Math.max(0, Math.min(H, y));
      draw.style.clipPath = 'inset(0px 0px ' + Math.max(0, H - yc) + 'px 0px)';
      var visible = y > startY && y < endY + 40;
      dot.classList.toggle('on', visible);
      var yy = Math.min(Math.max(y, startY), endY);
      dot.style.transform = 'translate3d(' + xAt(yy) + 'px,' + yy + 'px,0)';
      nodes.forEach(function (n) { n.classList.toggle('on', +n.getAttribute('cy') < y); });
    }

    ST.addEventListener('refresh', build);
    var st = ST.create({ start: 0, end: 'max', onUpdate: update });
    build();
    return function () {
      ST.removeEventListener('refresh', build);
      st.kill();
      host.innerHTML = '';
      host.style.height = '';
    };
  }

  /* ---------- Scroll-Fortschritt (Mobile) ---------- */
  function progressBar() {
    var bar = q('.progress span');
    if (!bar) return;
    gsap.to(bar, { scaleX: 1, ease: M.ease.none, scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });
  }

  /* ---------- Hash beim Laden (z. B. index.html#ablauf) ---------- */
  function jumpToHash() {
    if (!location.hash || location.hash.length < 2) return;
    var t = document.getElementById(location.hash.slice(1));
    if (!t) return;
    var y = t.getBoundingClientRect().top + window.scrollY - (header ? header.offsetHeight : 0) + 1;
    if (lenis) lenis.scrollTo(y, { immediate: true }); else window.scrollTo(0, y);
  }
})();
