/* P.H.I.T – Variante 3 „Motion“
   Grundfunktionen (Navigation, Formular, Karte) laufen immer.
   Die Inszenierung (GSAP + ScrollTrigger + Lenis) startet nur, wenn
   die Bibliotheken geladen sind UND keine reduzierte Bewegung gewünscht ist.
   Ohne JS / ohne GSAP bleibt jeder Inhalt sichtbar. */
(function () {
  'use strict';
  var d = document, html = d.documentElement;
  html.classList.add('js');

  var reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------------- Header-Zustand ---------------- */
  var header = d.querySelector('[data-header]');
  var lastY = window.scrollY;
  function onScroll() {
    var y = window.scrollY;
    if (!header) return;
    header.classList.toggle('is-scrolled', y > 40);
    var goingDown = y > lastY + 2, goingUp = y < lastY - 2;
    if (goingDown && y > 500 && !html.classList.contains('nav-open') && !header.contains(d.activeElement)) header.classList.add('is-hidden');
    else if (goingUp || y < 200) header.classList.remove('is-hidden');
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (header) header.addEventListener('focusin', function () { header.classList.remove('is-hidden'); });

  /* ---------------- Mobile Navigation ---------------- */
  var toggle = d.querySelector('[data-nav-toggle]');
  var panel = d.querySelector('[data-nav-panel]');
  var label = toggle && toggle.querySelector('.nav__toggle-label');
  function isOpen() { return html.classList.contains('nav-open'); }
  function setNav(open, returnFocus) {
    html.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (label) label.textContent = open ? 'Schließen' : 'Menü';
    if (window.__lenis) { open ? window.__lenis.stop() : window.__lenis.start(); }
    html.style.overflow = open ? 'hidden' : '';
    if (open) {
      var first = panel.querySelector('a');
      if (first) setTimeout(function () { first.focus(); }, 60);
    } else if (returnFocus) toggle.focus();
  }
  if (toggle && panel) {
    toggle.addEventListener('click', function () { setNav(!isOpen()); });
    panel.addEventListener('click', function (e) { if (e.target.closest('a') && isOpen()) setNav(false); });
    d.addEventListener('keydown', function (e) {
      if (!isOpen()) return;
      if (e.key === 'Escape') { e.preventDefault(); setNav(false, true); return; }
      if (e.key === 'Tab') {
        var items = [toggle].concat([].slice.call(panel.querySelectorAll('a')));
        var i = items.indexOf(d.activeElement);
        if (e.shiftKey && (i <= 0)) { e.preventDefault(); items[items.length - 1].focus(); }
        else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
      }
    });
    window.matchMedia('(min-width: 1160px)').addEventListener('change', function (m) { if (m.matches && isOpen()) setNav(false); });
  }

  /* ---------------- Kontaktformular (ohne Versand) ---------------- */
  var form = d.querySelector('[data-form]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = form.querySelector('[data-form-status]');
      status.innerHTML = '<strong>[PLATZHALTER: Formular-Backend]</strong> – bitte vorerst anrufen (<a href="tel:+43512366002">0512 / 36 60 02</a>) oder an <a href="mailto:info@phit.cc">info@phit.cc</a> schreiben.';
    });
  }

  /* ---------------- Google Maps 2-Klick ---------------- */
  d.querySelectorAll('[data-map]').forEach(function (box) {
    var btn = box.querySelector('[data-map-load]');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var f = d.createElement('iframe');
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

  /* ---------------- Ripple-Canvas (nur Maus/Trackpad) ---------------- */
  function Ripples(host) {
    var c = d.createElement('canvas');
    c.className = 'ripple-canvas';
    c.setAttribute('aria-hidden', 'true');
    host.insertBefore(c, host.firstChild);
    var ctx = c.getContext('2d');
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    var w = 0, h = 0, rings = [], raf = 0, visible = false, last = { x: -999, y: -999, t: 0 };
    function resize() {
      w = host.clientWidth; h = host.clientHeight;
      c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    new ResizeObserver(resize).observe(host);
    resize();
    // außerhalb des Viewports: Loop stoppen, Canvas leeren
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (!visible) { cancelAnimationFrame(raf); raf = 0; rings.length = 0; ctx.clearRect(0, 0, w, h); }
    }).observe(host);
    function add(x, y, a, max) {
      if (rings.length > 36) rings.shift();
      rings.push({ x: x, y: y, a: a, max: max, born: performance.now() });
      if (!raf) raf = requestAnimationFrame(tick);
    }
    function pos(e) { var r = c.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
    host.addEventListener('pointermove', function (e) {
      if (!visible || e.pointerType !== 'mouse') return;
      var p = pos(e), now = performance.now(), dx = p.x - last.x, dy = p.y - last.y;
      if (dx * dx + dy * dy < 1600 && now - last.t < 120) return;
      last = { x: p.x, y: p.y, t: now };
      add(p.x, p.y, .42, 70 + Math.random() * 30);
    }, { passive: true });
    host.addEventListener('pointerdown', function (e) {
      if (!visible || e.pointerType !== 'mouse') return;
      var p = pos(e); add(p.x, p.y, .75, 170);
    }, { passive: true });
    function tick(t) {
      ctx.clearRect(0, 0, w, h);
      for (var i = rings.length - 1; i >= 0; i--) {
        var g = rings[i], p = (t - g.born) / 1700;
        if (p >= 1) { rings.splice(i, 1); continue; }
        var e = 1 - Math.pow(1 - p, 3), r = 3 + e * g.max, al = g.a * (1 - p);
        ctx.lineWidth = 1.3;
        ctx.strokeStyle = 'rgba(127,227,255,' + al.toFixed(3) + ')';
        ctx.beginPath(); ctx.ellipse(g.x, g.y, r, r * .52, 0, 0, Math.PI * 2); ctx.stroke();
        if (r > 22) {
          ctx.strokeStyle = 'rgba(0,185,238,' + (al * .6).toFixed(3) + ')';
          ctx.beginPath(); ctx.ellipse(g.x, g.y, r * .62, r * .62 * .52, 0, 0, Math.PI * 2); ctx.stroke();
        }
      }
      raf = rings.length ? requestAnimationFrame(tick) : 0;
      if (!raf) ctx.clearRect(0, 0, w, h);
    }
  }

  /* ---------------- Eigene Split-Funktion (Wörter > Zeichen) ---------------- */
  function splitText(el) {
    var full = el.textContent.replace(/­/g, '').replace(/\s+/g, ' ').trim();
    var groups = el.querySelectorAll('.line');
    groups = groups.length ? [].slice.call(groups) : [el];
    var visual = d.createElement('span');
    visual.setAttribute('aria-hidden', 'true');
    var chars = [];
    groups.forEach(function (g) {
      var holder = g === el ? visual : d.createElement('span');
      if (g !== el) { holder.className = g.className; visual.appendChild(holder); visual.appendChild(d.createTextNode(' ')); }
      var words = g.textContent.replace(/­/g, '').trim().split(/\s+/);
      words.forEach(function (word, wi) {
        word.split(/(?<=-)/).forEach(function (part, pi, arr) {
          var w = d.createElement('span');
          w.className = 'split-w';
          Array.from(part).forEach(function (ch) {
            var s = d.createElement('span');
            s.className = 'split-c';
            s.textContent = ch;
            w.appendChild(s); chars.push(s);
          });
          holder.appendChild(w);
          if (pi < arr.length - 1) holder.appendChild(d.createElement('wbr'));
        });
        if (wi < words.length - 1) holder.appendChild(d.createTextNode(' '));
      });
    });
    var sr = d.createElement('span');
    sr.className = 'sr-only';
    sr.textContent = full;
    el.textContent = '';
    el.appendChild(sr);
    el.appendChild(visual);
    return chars;
  }

  /* ---------------- Inszenierung ---------------- */
  function initMotion() {
    var gsap = window.gsap, ST = window.ScrollTrigger;
    gsap.registerPlugin(ST);
    html.classList.add('motion');

    // Lenis Smooth Scroll, gekoppelt an GSAP-Ticker
    var lenis = null;
    if (window.Lenis) {
      lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
      window.__lenis = lenis;
      lenis.on('scroll', ST.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
      d.addEventListener('click', function (e) {
        var a = e.target.closest('a[href*="#"]');
        if (!a || e.defaultPrevented) return;
        var url = new URL(a.href, location.href);
        if (url.pathname !== location.pathname || !url.hash) return;
        var id = decodeURIComponent(url.hash.slice(1));
        var target = id === 'top' ? 0 : d.getElementById(id);
        if (target === null) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: 0, duration: 1.4 });
        history.pushState(null, '', '#' + id);
        if (target && target !== d.getElementById('inhalt')) {
          var h = target.querySelector('h1, h2');
          if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
        }
      });
    }

    // Hero: Split-Text + Ebenen
    var hero = d.querySelector('.hero, .subhero');
    if (hero) {
      var title = hero.querySelector('[data-split]');
      var chars = title ? splitText(title) : [];
      var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      if (chars.length) tl.from(chars, { yPercent: 118, rotate: 7, duration: 1.25, stagger: 0.026 }, 0.15);
      tl.from(hero.querySelectorAll('[data-hero-fade]'), { y: 26, opacity: 0, duration: 1.1, stagger: 0.1 }, 0.55);
      var bg = hero.querySelector('[data-hero-bg]');
      if (bg) {
        tl.from(bg, { scale: 1.12, duration: 2.4, ease: 'power3.out' }, 0);
        gsap.to(bg, { yPercent: 12, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
      }
      var ring = hero.querySelector('.hero__ring'), orbImg = hero.querySelector('.hero__orb-img'), orb = hero.querySelector('[data-hero-orb]');
      if (ring) tl.from(ring, { scale: 0.55, rotate: -120, opacity: 0, transformOrigin: '50% 50%', duration: 2 }, 0.2);
      if (orbImg) tl.from(orbImg, { scale: 0.35, opacity: 0, duration: 1.8 }, 0.3);
      if (orb) gsap.to(orb, { yPercent: -28, scale: 1.18, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
      var content = hero.querySelector('[data-hero-content]');
      if (content) gsap.to(content, { yPercent: -16, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    }

    // Pins ZUERST anlegen, damit alle späteren Trigger die Pin-Abstände kennen
    // Desktop-only: Pinning + Horizontal-Scroll + Tiefenmesser
    var mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', function () {
      var cleanup = [];

      // USP Unterwassertherapie (gepinnt)
      var usp = d.querySelector('.usp');
      if (usp) {
        usp.classList.add('is-pinned');
        cleanup.push(function () { usp.classList.remove('is-pinned'); });
        var imgs = usp.querySelectorAll('[data-usp-img]'), panels = usp.querySelectorAll('[data-usp-panel]'), dots = usp.querySelectorAll('[data-usp-dot]');
        dots[0].classList.add('is-on');
        gsap.set([panels[1], panels[2]], { opacity: 0, y: 46 });
        gsap.set([imgs[1], imgs[2]], { clipPath: 'circle(0% at 50% 60%)' });
        var ptl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: usp.querySelector('[data-usp]'), start: 'top top', end: '+=230%', pin: true, scrub: 0.7, anticipatePin: 1,
            onUpdate: function (self) {
              var i = self.progress < 0.36 ? 0 : self.progress < 0.7 ? 1 : 2;
              dots.forEach(function (dd, j) { dd.classList.toggle('is-on', j === i); });
            }
          }
        });
        ptl.to({}, { duration: 0.35 })
          .to(panels[0], { opacity: 0, y: -46, duration: 0.3 })
          .to(imgs[1], { clipPath: 'circle(80% at 50% 60%)', duration: 0.7, ease: 'power2.inOut' }, '<')
          .to(panels[1], { opacity: 1, y: 0, duration: 0.3 }, '<0.25')
          .to({}, { duration: 0.4 })
          .to(panels[1], { opacity: 0, y: -46, duration: 0.3 })
          .to(imgs[2], { clipPath: 'circle(80% at 50% 60%)', duration: 0.7, ease: 'power2.inOut' }, '<')
          .to(panels[2], { opacity: 1, y: 0, duration: 0.3 }, '<0.25')
          .to({}, { duration: 0.35 });
        ptl.fromTo(imgs[0].querySelector('img'), { scale: 1.18 }, { scale: 1, duration: ptl.duration() }, 0);
      }

      // Leistungen: horizontal
      var sec = d.querySelector('.services');
      if (sec) {
        sec.classList.add('is-hs');
        cleanup.push(function () { sec.classList.remove('is-hs'); });
        var track = sec.querySelector('[data-hs-track]');
        var cards = track.children, count = sec.querySelector('[data-hs-count]'), bar = sec.querySelector('[data-hs-bar]');
        var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
        var hs = gsap.to(track, {
          x: function () { return -dist(); }, ease: 'none',
          scrollTrigger: {
            trigger: sec.querySelector('[data-hs]'), start: 'top top', end: function () { return '+=' + dist(); },
            pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
            onUpdate: function (self) {
              var i = Math.min(cards.length - 1, Math.round(self.progress * (cards.length - 1)));
              count.textContent = String(i + 1).padStart(2, '0');
              bar.style.transform = 'scaleX(' + (0.1 + 0.9 * self.progress).toFixed(3) + ')';
            }
          }
        });
        // leichte Gegenbewegung der Kartentexte
        [].forEach.call(cards, function (c) {
          var body = c.querySelector('.svc__body');
          gsap.fromTo(body, { x: 40 }, { x: 0, ease: 'none', scrollTrigger: { trigger: c, containerAnimation: hs, start: 'left right', end: 'center center', scrub: true } });
        });
      }

      // Tiefenmesser
      var depth = d.querySelector('[data-depth]');
      if (depth && window.matchMedia('(min-width: 1400px)').matches) {
        var fill = depth.querySelector('[data-depth-fill]'), dot = depth.querySelector('[data-depth-dot]'), now = depth.querySelector('[data-depth-now]');
        var trackEl = depth.querySelector('.depth__track');
        ST.create({ start: 0, end: 'max', onUpdate: function (s) { fill.style.transform = 'scaleY(' + s.progress.toFixed(4) + ')'; dot.style.transform = 'translateY(' + (s.progress * trackEl.offsetHeight).toFixed(1) + 'px)'; } });
        d.querySelectorAll('[data-depth-name]').forEach(function (s) {
          ST.create({ trigger: s, start: 'top 50%', end: 'bottom 50%', onToggle: function (self) { if (self.isActive) now.textContent = s.getAttribute('data-depth-name'); } });
        });
        var hsSec = d.querySelector('.services');
        if (hsSec) ST.create({ trigger: hsSec, start: 'top 60%', end: 'bottom 40%', onToggle: function (self) { depth.classList.toggle('is-muted', self.isActive); } });
      }

      return function () { cleanup.forEach(function (f) { f(); }); };
    });

    // Generische Reveals (batched)
    var reveals = d.querySelectorAll('[data-reveal]');
    if (reveals.length) {
      gsap.set(reveals, { opacity: 0, y: 36 });
      ST.batch(reveals, {
        start: 'top 92%', once: true,
        onEnter: function (b) {
          // bereits überscrollte Elemente sofort zeigen, nur sichtbare gestaffelt einblenden
          var vis = b.filter(function (el) { return el.getBoundingClientRect().bottom > 0; });
          var gone = b.filter(function (el) { return vis.indexOf(el) < 0; });
          if (gone.length) gsap.set(gone, { opacity: 1, y: 0, overwrite: true });
          gsap.to(vis, { opacity: 1, y: 0, duration: 1, stagger: Math.min(0.08, 0.6 / vis.length), ease: 'expo.out', overwrite: true });
        }
      });
    }

    // Bild-Masken-Reveals: Kreis wächst von unten wie steigendes Wasser
    d.querySelectorAll('[data-mask]').forEach(function (el) {
      var img = el.querySelector('img');
      var t = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 86%', once: true } });
      t.fromTo(el, { clipPath: 'circle(0% at 50% 100%)' }, { clipPath: 'circle(150% at 50% 100%)', duration: 1.7, ease: 'power3.inOut', clearProps: 'clipPath' });
      if (img) t.fromTo(img, { scale: 1.28 }, { scale: 1, duration: 2, ease: 'expo.out', clearProps: 'transform' }, 0.1);
    });

    // Parallax in Bildern
    d.querySelectorAll('[data-parallax]').forEach(function (el) {
      gsap.fromTo(el, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    // Zahlen-Counter
    d.querySelectorAll('[data-count]').forEach(function (el) {
      var end = parseInt(el.getAttribute('data-count'), 10), o = { v: 0 };
      el.textContent = '0';
      ST.create({
        trigger: el, start: 'top 90%', once: true,
        onEnter: function () {
          gsap.to(o, { v: end, duration: end > 10 ? 2.2 : 1.2, ease: 'power2.out', onUpdate: function () { el.textContent = Math.round(o.v); } });
        }
      });
    });

    // Ablauf-Linie
    var line = d.querySelector('[data-steps-line]');
    if (line) gsap.fromTo(line, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '[data-steps]', start: 'top 70%', end: 'bottom 65%', scrub: true } });

    // Ripples nur mit feinem Zeiger
    if (finePointer) d.querySelectorAll('[data-ripple]').forEach(function (h) { new Ripples(h); });

    // Nach Bild-/Font-Load neu messen
    var to = 0;
    function refresh() { clearTimeout(to); to = setTimeout(function () { ST.refresh(); }, 150); }
    window.addEventListener('load', refresh);
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(refresh);
    d.querySelectorAll('img').forEach(function (img) { if (!img.complete) img.addEventListener('load', refresh, { once: true }); });

    // Wechselt jemand währenddessen auf reduzierte Bewegung: Seite statisch neu laden
    reduceMQ.addEventListener('change', function (m) { if (m.matches) location.reload(); });
  }

  function boot() {
    if (!reduceMQ.matches && window.gsap && window.ScrollTrigger) {
      try { initMotion(); }
      catch (err) {
        // Fallback: alles sichtbar machen
        html.classList.remove('motion');
        if (window.gsap) window.gsap.set('[data-reveal], [data-mask], [data-mask] img, .split-c, [data-hero-fade]', { clearProps: 'all' });
        if (window.console) console.warn('Motion deaktiviert:', err);
      }
    }
  }
  boot();
})();
