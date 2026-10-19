/* P.H.I.T – Klinik 5 „Szenen“
   Grundfunktionen ohne Abhängigkeiten + ein Motion-System (GSAP/ScrollTrigger/SplitText/Lenis),
   das nur startet, wenn die Bibliotheken geladen sind und keine reduzierte Bewegung gewünscht ist. */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var header = document.querySelector('.site-header');
  var lenis = null;

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  /* ---------- Mobile-Menü ---------- */
  var toggle = $('.menu-toggle');
  var menu = document.getElementById('mobile-menu');
  if (toggle && menu) {
    var setOpen = function (open, returnFocus) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
      menu.hidden = !open;
      document.body.classList.toggle('menu-open', open);
      if (lenis) { if (open) lenis.stop(); else lenis.start(); }
      if (open) { var first = $('a', menu); if (first) first.focus(); }
      else if (returnFocus) toggle.focus();
    };
    toggle.addEventListener('click', function () { setOpen(toggle.getAttribute('aria-expanded') !== 'true', false); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false, false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setOpen(false, true);
    });
    menu.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var items = $$('a, button', menu);
      if (!e.shiftKey && document.activeElement === items[items.length - 1]) { e.preventDefault(); toggle.focus(); }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1100 && toggle.getAttribute('aria-expanded') === 'true') setOpen(false, false);
    });
  }

  /* ---------- Header-Zustand, Kapitel-Rail, Kapitel-Kennung ---------- */
  var chapters = $$('[data-chapter]');
  var railLinks = $$('.rail a');
  var railFill = $('.rail-fill');
  var hcNum = $('.hc-num');
  var hcName = $('.hc-name');
  var current = -1;

  function setChapter(i) {
    if (i === current || i < 0) return;
    current = i;
    railLinks.forEach(function (a, j) {
      a.classList.toggle('is-active', j === i);
      if (j === i) a.setAttribute('aria-current', 'step'); else a.removeAttribute('aria-current');
    });
    if (!hcNum || !chapters[i]) return;
    var num = chapters[i].getAttribute('data-chapter');
    var name = chapters[i].getAttribute('data-name');
    if (window.gsap && root.classList.contains('js-motion')) {
      var g = window.gsap;
      g.killTweensOf([hcNum, hcName]);
      g.to([hcNum, hcName], {
        opacity: 0, y: -6, duration: 0.22, ease: 'power2.in', onComplete: function () {
          hcNum.textContent = num; hcName.textContent = name;
          g.fromTo([hcNum, hcName], { opacity: 0, y: 7 }, { opacity: 1, y: 0, duration: 0.55, ease: 'expo.out', stagger: 0.05 });
        }
      });
    } else { hcNum.textContent = num; hcName.textContent = name; }
  }

  var ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 8);
    if (chapters.length) {
      var line = window.innerHeight * 0.5, idx = 0;
      for (var i = 0; i < chapters.length; i++) { if (chapters[i].getBoundingClientRect().top <= line) idx = i; }
      setChapter(idx);
      if (railFill) {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        railFill.style.transform = 'scaleY(' + (max > 0 ? Math.min(1, y / max) : 0).toFixed(4) + ')';
      }
    }
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- Jahr, Formular, Karte ---------- */
  $$('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  var form = $('[data-contact-form]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var st = $('.form-status', form);
      if (st) { st.hidden = false; st.focus(); }
    });
  }

  $$('[data-map-load]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var box = btn.closest('[data-map]');
      if (!box) return;
      var f = document.createElement('iframe');
      f.src = 'https://www.google.com/maps?q=Amraser+Stra%C3%9Fe+3,+6020+Innsbruck&output=embed';
      f.title = 'Google Maps: P.H.I.T im Hallenbad Amras';
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      f.setAttribute('allowfullscreen', '');
      box.innerHTML = '';
      box.appendChild(f);
      f.focus();
    });
  });

  /* =====================================================================
     Motion-System
     ===================================================================== */
  // Tokens – gespiegelt aus css/style.css (--ease-*, --dur-*)
  var T = {
    dur: { s: 0.45, m: 0.8, l: 1.2, xl: 1.6 },
    ease: { out: 'expo.out', soft: 'power2.out', io: 'power3.inOut', none: 'none' },
    y: 28,
    stagger: 0.08,
    dim: 0.14              // Ausgangshelligkeit der „hell geschriebenen“ Wörter
  };

  function initMotion() {
    if (reduce || !window.gsap || !window.ScrollTrigger) return;
    var gsap = window.gsap, ST = window.ScrollTrigger, Split = window.SplitText;
    gsap.registerPlugin(ST);
    if (Split) gsap.registerPlugin(Split);

    var calm = !!$('[data-tempo="calm"]');
    if (calm) { T.dur.m *= 1.4; T.dur.l *= 1.45; T.dur.xl *= 1.4; T.y = 14; }

    root.classList.add('js-motion');

    try {
      setupLenis(gsap, ST);
      var mm = gsap.matchMedia();

      /* --- Reveal-Utility (alle Breiten) --- */
      $$('[data-reveal]').forEach(function (el) {
        var sibs = el.parentElement ? $$(':scope > [data-reveal]', el.parentElement) : [el];
        var delay = Math.min(sibs.indexOf(el), 5) * T.stagger;
        gsap.fromTo(el, { opacity: 0, y: T.y }, {
          opacity: 1, y: 0, duration: T.dur.l, delay: delay, ease: T.ease.out,
          scrollTrigger: { trigger: el, start: 'top 90%', once: true }
        });
      });

      /* --- Porträts: Masken-Reveal (alle Breiten) --- */
      $$('[data-portrait]').forEach(function (p, i) {
        var d = (window.innerWidth >= 1200 ? i % 4 : 0) * 0.1;
        var st = { trigger: p, start: 'top 88%', once: true };
        gsap.fromTo(p, { clipPath: 'inset(100% 0% 0% 0% round 20px)' }, { clipPath: 'inset(0% 0% 0% 0% round 20px)', duration: T.dur.l * 1.15, delay: d, ease: T.ease.out, scrollTrigger: st });
        var im = $('img', p);
        if (im) gsap.fromTo(im, { scale: 1.18 }, { scale: 1, duration: T.dur.xl, delay: d, ease: T.ease.out, scrollTrigger: { trigger: p, start: 'top 88%', once: true } });
      });

      /* --- Weicher Hell-Dunkel-Übergang zur Wasser-Szene --- */
      var wasser = document.getElementById('wasser');
      var tint = $('.scene-tint');
      if (wasser && tint) {
        gsap.fromTo(tint, { opacity: 0 }, { opacity: 1, ease: 'none', scrollTrigger: { trigger: wasser, start: 'top 85%', end: 'top 25%', scrub: true } });
        gsap.fromTo(tint, { opacity: 1 }, { opacity: 0, ease: 'none', immediateRender: false, scrollTrigger: { trigger: wasser, start: 'bottom 80%', end: 'bottom 30%', scrub: true } });
        ST.create({ trigger: wasser, start: 'top top+=34', end: 'bottom top+=34', toggleClass: { targets: header, className: 'is-dark' } });
        var rail = $('.rail');
        if (rail) ST.create({ trigger: wasser, start: 'top 50%', end: 'bottom 50%', toggleClass: { targets: rail, className: 'is-dark' } });
      }

      /* --- Schritte: Fortschrittslinie --- */
      var stepsWrap = $('[data-steps]');
      if (stepsWrap) {
        var fill = $('.steps-fill', stepsWrap), steps = $$('.step', stepsWrap);
        var light = function (p) {
          steps.forEach(function (s, i) { s.classList.toggle('is-on', p > 0.001 && p >= (i / (steps.length - 1)) * 0.97); });
        };
        mm.add({ d: '(min-width: 900px)', m: '(max-width: 899px)' }, function (ctx) {
          var prop = ctx.conditions.d ? 'scaleX' : 'scaleY';
          var from = {}; from[prop] = 0; var to = { ease: 'none' }; to[prop] = 1;
          to.scrollTrigger = {
            trigger: stepsWrap, start: ctx.conditions.d ? 'top 72%' : 'top 75%', end: ctx.conditions.d ? 'top 30%' : 'bottom 55%', scrub: 0.4,
            onUpdate: function (self) { light(self.progress); }, onRefresh: function (self) { light(self.progress); }
          };
          gsap.fromTo(fill, from, to);
        });
      }

      /* --- Wort-für-Wort „hell schreiben“ + Szenen --- */
      var fontsReady = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
      fontsReady.then(function () {
        mm.add('(min-width: 900px)', function () { desktopScenes(gsap, ST, Split); });
        mm.add('(max-width: 899px)', function () { mobileScenes(gsap, ST, Split); });
        ST.refresh();
      });

      /* Bilder fertig → Positionen neu berechnen */
      window.addEventListener('load', function () { ST.refresh(); });
      var to2;
      $$('img[loading="lazy"]').forEach(function (im) {
        if (im.complete) return;
        im.addEventListener('load', function () { clearTimeout(to2); to2 = setTimeout(function () { ST.refresh(); }, 250); }, { once: true });
      });
    } catch (err) {
      root.classList.remove('js-motion');
      try { ST.getAll().forEach(function (t) { t.kill(); }); gsap.set('[data-reveal], [data-portrait], [data-portrait] img', { clearProps: 'all' }); } catch (e2) { /* noop */ }
    }
  }

  function edgeOf(sel) {
    var w = $(sel);
    return w ? Math.max(0, w.getBoundingClientRect().left) : 24;
  }

  function splitWords(Split, el, build) {
    if (!Split || !el) return null;
    return Split.create(el, { type: 'words', wordsClass: 'w', aria: 'auto', autoSplit: true, onSplit: build });
  }

  /* ---------------- Desktop: Sticky-Szenen mit Scrub ---------------- */
  function desktopScenes(gsap, ST, Split) {
    var calm = !!$('[data-tempo="calm"]');

    // Kapitel-Kennungen: große Wörter schreiben sich beim Ankommen ein
    $$('[data-opener]').forEach(function (op) {
      var w = $('.chapter-word', op), k = $('.kicker', op);
      gsap.fromTo(w, { opacity: 0, yPercent: 32, scale: 0.965, transformOrigin: '0% 100%' }, { opacity: 1, yPercent: 0, scale: 1, ease: 'none', scrollTrigger: { trigger: op, start: 'top 98%', end: 'top 50%', scrub: 0.5 } });
      gsap.fromTo(k, { opacity: 0, x: -14 }, { opacity: 1, x: 0, ease: 'none', scrollTrigger: { trigger: op, start: 'top 96%', end: 'top 68%', scrub: 0.5 } });
    });

    // 01 Ankommen: Bild wächst aus der Karte zur vollen Breite
    var hm = $('[data-hero-media]');
    if (hm) {
      var himg = $('img', hm);
      var tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: hm, start: 0, end: 'top top+=68', scrub: 0.4, invalidateOnRefresh: true } });
      tl.fromTo(hm, { clipPath: function () { var e = edgeOf('.hero .wrap'); return 'inset(0px ' + e + 'px 0px ' + e + 'px round 28px)'; } }, { clipPath: 'inset(0px 0px 0px 0px round 0px)' }, 0)
        .fromTo(himg, { scale: 1.1 }, { scale: 1 }, 0)
        .fromTo('[data-hero-copy]', { y: 0 }, { y: -48 }, 0)
        .fromTo('.hero .plate', { y: 0 }, { y: -36 }, 0);
    }

    // 02 Verstehen: Bild nähert sich, Satz wird Wort für Wort hell
    var sv = $('[data-scene="verstehen"]');
    if (sv) {
      var vm = $('[data-v-media]', sv), vimg = $('img', vm);
      gsap.fromTo(vm, { scale: 0.84, transformOrigin: '50% 50%' }, { scale: 1, ease: 'none', scrollTrigger: { trigger: sv, start: 'top bottom', end: 'top top', scrub: 0.4 } });
      gsap.fromTo(vimg, { scale: 1.3, yPercent: -4 }, { scale: 1.12, yPercent: 4, ease: 'none', scrollTrigger: { trigger: sv, start: 'top bottom', end: 'bottom bottom', scrub: 0.4 } });
      splitWords(Split, $('[data-words]', sv), function (self) {
        return gsap.fromTo(self.words, { opacity: T.dim }, { opacity: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: sv, start: 'top 30%', end: 'bottom 112%', scrub: 0.3 } });
      });
    }

    // 03 Behandeln: aktive Leistung + Bildwechsel
    var svcs = $$('.svc'), figs = $$('.svc-fig');
    var activate = function (i) {
      svcs.forEach(function (s, j) { s.classList.toggle('is-active', j === i); });
      var m = svcs[i].getAttribute('data-svc');
      figs.forEach(function (f) { f.classList.toggle('is-active', f.getAttribute('data-svc-fig') === m); });
    };
    svcs.forEach(function (s, i) {
      ST.create({ trigger: s, start: 'top 60%', end: 'bottom 60%', onToggle: function (self) { if (self.isActive) activate(i); } });
    });

    // 04 Wasser: Eintauchen durch den Ring
    var sw = $('[data-scene="wasser"]');
    if (sw) {
      var wm = $('[data-w-media]', sw), wimg = $('img', wm), ring = $('.w-ring', sw), word = $('.w-word', sw),
        shade = $('.w-shade', sw), title = $('[data-w-title]', sw), stmt = $('[data-words]', sw);
      var r0 = function () { return Math.min(window.innerWidth, window.innerHeight) * 0.18; };
      var r1 = function () { return Math.hypot(window.innerWidth, window.innerHeight) / 2 + 40; };
      var buildWater = function (words) {
        var t = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: sw, start: 'top top', end: 'bottom bottom', scrub: 0.5, invalidateOnRefresh: true } });
        t.fromTo(wm, { clipPath: function () { return 'circle(' + r0() + 'px at 50% 50%)'; } }, { clipPath: function () { return 'circle(' + r1() + 'px at 50% 50%)'; }, duration: 0.4 }, 0)
          .fromTo(wimg, { scale: 1.32 }, { scale: 1.04, duration: 0.7 }, 0)
          .fromTo(ring, { scale: 1, opacity: 1 }, { scale: function () { return r1() / r0(); }, opacity: 0, duration: 0.4 }, 0)
          .fromTo(word, { opacity: 1, yPercent: -50, y: 0 }, { opacity: 0, yPercent: -50, y: -50, duration: 0.14 }, 0.2)
          .fromTo(shade, { opacity: 0 }, { opacity: 1, duration: 0.18 }, 0.26)
          .fromTo(title, { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 0.12 }, 0.36)
          .fromTo(stmt, { opacity: 0 }, { opacity: 1, duration: 0.04 }, 0.42);
        if (words && words.length) t.fromTo(words, { opacity: T.dim }, { opacity: 1, duration: 0.06, stagger: 0.42 / words.length }, 0.46);
        t.to({}, { duration: 0.06 });
        return t;
      };
      if (Split && stmt) splitWords(Split, stmt, function (self) { return buildWater(self.words); });
      else buildWater(null);
    }

    // 05 Trainieren: Vorhang öffnet sich, Raum gleitet
    var pc = $('.pano-clip');
    if (pc) {
      var pimg = $('img', pc);
      gsap.fromTo(pc, { clipPath: function () { var e = edgeOf('#training .wrap'), x = e + window.innerWidth * 0.14; return 'inset(6% ' + x + 'px 6% ' + x + 'px round 28px)'; } },
        { clipPath: function () { var e = edgeOf('#training .wrap'); return 'inset(0% ' + e + 'px 0% ' + e + 'px round 28px)'; }, ease: 'none', scrollTrigger: { trigger: pc, start: 'top bottom', end: 'center 55%', scrub: 0.4, invalidateOnRefresh: true } });
      gsap.fromTo(pimg, { scale: 1.22, xPercent: -3 }, { scale: 1.02, xPercent: 3, ease: 'none', scrollTrigger: { trigger: pc, start: 'top bottom', end: 'bottom top', scrub: 0.4 } });
    }

    // 06 Zurück: Collage mit Tiefenstaffelung
    var col = $('.collage');
    if (col) {
      $$('figure', col).forEach(function (f) {
        var s = parseFloat(f.getAttribute('data-speed')) || 0;
        if (s) gsap.fromTo(f, { y: 90 * s }, { y: -90 * s, ease: 'none', scrollTrigger: { trigger: col, start: 'top bottom', end: 'bottom top', scrub: 0.5 } });
        gsap.fromTo($('img', f), { scale: 1.16 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: col, start: 'top bottom', end: 'bottom 30%', scrub: 0.5 } });
      });
    }

    // Unterseite Beckenboden: ein ruhiger, langsamer Satz
    $$('[data-words][data-calm]').forEach(function (el) {
      splitWords(Split, el, function (self) {
        return gsap.fromTo(self.words, { opacity: T.dim }, { opacity: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 40%', scrub: 1.2 } });
      });
    });
    var cm = $('[data-calm-media] img');
    if (cm && calm) gsap.fromTo(cm, { scale: 1.07 }, { scale: 1, duration: 2.6, ease: 'power2.out' });
  }

  /* ---------------- Mobile: ruhige Abschnitte, kurze Reveals ---------------- */
  function mobileScenes(gsap, ST, Split) {
    $$('[data-opener]').forEach(function (op) {
      gsap.fromTo($$('.kicker, .chapter-word', op), { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: T.dur.l, ease: T.ease.out, stagger: 0.08, scrollTrigger: { trigger: op, start: 'top 88%', once: true } });
    });
    $$('[data-words]').forEach(function (el) {
      splitWords(Split, el, function (self) {
        return gsap.fromTo(self.words, { opacity: T.dim }, { opacity: 1, duration: 0.5, ease: T.ease.soft, stagger: 0.028, scrollTrigger: { trigger: el, start: 'top 82%', once: true } });
      });
    });
    var wm = $('[data-w-media]');
    if (wm) gsap.fromTo(wm, { clipPath: 'circle(22% at 50% 50%)' }, { clipPath: 'circle(75% at 50% 50%)', duration: T.dur.xl, ease: T.ease.out, scrollTrigger: { trigger: wm, start: 'top 82%', once: true } });
    var pc = $('.pano-clip img');
    if (pc) gsap.fromTo(pc, { scale: 1.12 }, { scale: 1, duration: T.dur.xl, ease: T.ease.out, scrollTrigger: { trigger: pc, start: 'top 90%', once: true } });
  }

  /* ---------------- Lenis (nur Desktop-Zeigegeräte, syncTouch aus) ---------------- */
  function setupLenis(gsap, ST) {
    if (!window.Lenis) return;
    lenis = new window.Lenis({ lerp: 0.1, syncTouch: false });
    lenis.on('scroll', ST.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);

    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href*="#"]');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
      var url = new URL(a.getAttribute('href'), location.href);
      if (url.pathname !== location.pathname || !url.hash || url.hash === '#' || url.hash === '#inhalt') return;
      var target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;
      e.preventDefault();
      var off = target.id === 'top' ? 0 : -((header ? header.offsetHeight : 68) + 16);
      lenis.scrollTo(target.id === 'top' ? 0 : target, {
        offset: off, duration: 1.3, onComplete: function () {
          if (!target.hasAttribute('tabindex') && !/^(A|BUTTON|INPUT|TEXTAREA|SELECT|SUMMARY)$/.test(target.tagName)) target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        }
      });
      if (history.pushState) history.pushState(null, '', url.hash);
    });
  }

  initMotion();
})();
