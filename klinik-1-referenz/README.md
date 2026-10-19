# P.H.I.T – Website „Klinik 1 · Referenz“

Statische, übergabefertige Website für **P.H.I.T – Physiotherapie und individuelles Training**, Innsbruck.
Kein Build-Schritt, kein Framework: HTML + CSS + Vanilla JS, Bibliotheken lokal.

---

## 1. Struktur

```
klinik-1-referenz/
├── index.html          Startseite (One-Pager: Hero, Leistungen, Beckenboden, Sport, Team,
│                       Ablauf & Kosten, Räume, Anfahrt, Karriere, FAQ, Kontakt)
├── beckenboden.html    Unterseite Beckenbodentherapie
├── impressum.html      Impressum (noindex)
├── datenschutz.html    Datenschutzerklärung (noindex)
├── css/style.css       Gesamtes Styling inkl. Design-Tokens (in 21 nummerierte Abschnitte gegliedert)
├── js/main.js          Interaktion + Motion-System
└── README.md

Gemeinsam genutzt (eine Ebene höher, ../assets/):
├── assets/img/         Bilder (WebP + JPG, Breiten 640/1024/1600/2560 – siehe manifest.json)
├── assets/logo/        phit-logo.svg (hell), phit-logo-weiss.svg (dunkel)
├── assets/fonts/       inter-wght-normal/italic.woff2, geist-mono-wght-normal.woff2
└── assets/vendor/      gsap.min.js, ScrollTrigger.min.js, SplitText.min.js (GSAP 3.13), lenis.min.js + lenis.css (1.3.4)
```

> **Wichtig beim Deployment:** Die Seiten referenzieren `../assets/…`. Entweder die Ordnerstruktur
> 1:1 hochladen (Website liegt dann unter `/klinik-1-referenz/`) **oder** beim Umzug in das Web-Root
> alle `../assets/` per Suchen & Ersetzen in `assets/` ändern (HTML + `css/style.css`, dort `../../assets/` → `../assets/`).

## 2. Inhalte pflegen

Alle Texte stehen direkt im HTML, jede Sektion ist mit einem Kommentar markiert (`<!-- ===== Team ===== -->`).

| Was | Wo |
|---|---|
| Telefon / E-Mail | Suchen nach `+43512366002`, `0512 / 36 60 02`, `info@phit.cc` (Header, Menü, Hero, Kontakt, Footer, Callbar – auf allen 4 Seiten) |
| Header & Footer | In jeder der 4 Dateien identisch – Änderungen bitte in allen vier Dateien vornehmen |
| Leistungen | `index.html` → `<ul class="services__grid">`, je Karte ein `<li class="service">`. Icons sind Inline-SVGs; Pfade brauchen `pathLength="1"` für die Strichanimation |
| Team | `index.html` → `<article class="member">`; Badges: `badge--key` = Hauptqualifikation |
| Praxisschild (Hero) | `index.html` → `<div class="plate">`, je Person ein `<li class="plate__row">` |
| Vertrauensleiste | `<li class="fact">`; die Zahl im Attribut `data-count` **und** im Text identisch halten |
| Ablauf-Schritte | `<li class="step">` innerhalb `.timeline__steps` |
| FAQ | `<details class="faq__item">`; zusätzlich JSON-LD `FAQPage` im `<head>` von `index.html` anpassen |
| Bilder | Muster `<picture>` mit WebP-`srcset` + JPG-Fallback; nur Breiten aus `assets/img/manifest.json` verwenden; `width`/`height` immer setzen |
| SEO | Je Seite `<title>`, `meta description`, Open Graph im `<head>`; JSON-LD (`Physiotherapy`/`MedicalBusiness`) auf allen Seiten, `MedicalWebPage` + `BreadcrumbList` auf `beckenboden.html` |

## 3. Design-Tokens (`css/style.css`, Abschnitt 02)

- **Farbe:** `--c-white`, `--c-mist` (Flächen), `--c-line`, `--c-ink` #0F2A33 (Text), `--c-ink-2` (Sekundärtext, AA),
  `--c-petrol` #0A6A7E (Primär, AA auf Weiß), `--c-petrol-700` (Hover), `--c-deep` (dunkle Sektionen),
  `--c-cyan` #00B9EE (nur Licht/Akzentlinie – **nie Text auf Hell**). Semantische Rollen: `--color-*`.
- **Typo:** Inter (Text/Headlines) + Geist Mono (Labels, Praxisschild). Fluide Skala per `clamp()`:
  `--fs-2xs … --fs-h1`, `--fs-stat`; Zeilenhöhen `--lh-*`, Laufweiten `--ls-*`.
- **Spacing:** 4er-Raster `--sp-1 … --sp-20`, Sektionsabstand `--sp-section`, Seitenrand `--gutter`, Breite `--container` (1240 px).
- **Radien:** `--r-xs 6` · `--r-sm 10` · `--r-md 16` · `--r-lg 24` · `--r-pill`.
- **Schatten:** `--sh-1` (Karten), `--sh-2` (Hover), `--sh-3` (Praxisschild, Overlays).
- **Motion:** `--ease-out`, `--ease-in-out`, `--ease-standard`, `--dur-1 … --dur-4` (siehe unten).

Komponenten sind BEM-artig benannt (`.service__title`, `.plate__row`, `.btn--ghost`). Neue Farben bitte nur als Token anlegen.

## 4. Motion-System

Grundregel: **Progressive Enhancement.** Startzustände (unsichtbar, maskiert) gelten nur unter `html.js-motion`.
Diese Klasse setzt `main.js` erst, nachdem GSAP + ScrollTrigger geladen sind und **keine** reduzierte Bewegung
gewünscht ist. Ohne JS, ohne GSAP oder bei `prefers-reduced-motion: reduce` ist alles sofort sichtbar und statisch
(kein Lenis, keine Splits, keine Scrubs).

| Token (CSS) | GSAP-Pendant (main.js `M`) | Einsatz |
|---|---|---|
| `--ease-out` | `expo.out` | Reveals, Headlines |
| `--ease-in-out` | `power3.inOut` | Masken (clip-path), Linien |
| `--ease-standard` | `power2.out` | kleine Fades |
| `--dur-3` / `--dur-4` | `M.dur3` / `M.dur4` (werden aus CSS gelesen) | Reveals / Bühne |

Wiederverwendbare Attribute (einfach ins HTML schreiben):

| Attribut | Wirkung |
|---|---|
| `data-split` | Headline erscheint zeilenweise per SplitText-Masken (nach `document.fonts.ready`, `autoSplit` bei Resize, `aria: "auto"` – Screenreader lesen den ganzen Satz) |
| `data-reveal="up"` | Block blendet beim Scrollen von unten ein |
| `data-stagger` | Direkte Kinder erscheinen gestaffelt (Karten, Listen); Leistungs-Icons zeichnen sich dabei einmal |
| `data-reveal="clip"` | Bild öffnet sich per `clip-path` von unten |
| `data-parallax="5"` | leichter Parallax des Bildes (Wert = yPercent), nur ≥ 768 px |
| `data-count="320"` | Zahlen-Counter |
| `data-hero` | Teil der Hero-Intro-Sequenz |
| `data-timeline` | Ablauf: Fortschrittslinie wird per Scroll-Scrub gezeichnet, Schritte werden aktiv; links Sticky-Spalte (≥ 1024 px) |

Weitere Momente: Praxisschild baut sich gestaffelt auf (Rahmen → Lichtlinie → Kopf → Zeilen → Fuß), Header
verdichtet sich ab 48 px Scroll (`.is-condensed`, nur `transform`), gleitender Nav-Indikator (`translateX` + `scaleX`,
Scroll-Spy per IntersectionObserver), Leistungskarten mit Lift + Icon-Strichanimation (CSS, nur bei Maus),
FAQ-Akkordeon mit Höhenanimation (natives `<details>` + `::details-content`, Chromium ≥ 131; sonst sofort),
Seitenübergänge per `@view-transition { navigation: auto; }` (Chrome/Edge; andere Browser wechseln normal),
Lenis-Smooth-Scroll nur Desktop mit Maus (`syncTouch: false`, gekoppelt an den GSAP-Ticker).
Mobile (< 768 px): kürzere Wege, kein Parallax, kein Pinning, kein Lenis.
Animiert werden ausschließlich `transform`, `opacity`, `clip-path` (Ausnahme: FAQ-Höhe, bewusst).

## 5. Platzhalter – vor dem Livegang ersetzen

Alle Platzhalter sind im Browser gelb markiert (`<span class="placeholder">`). Suche: `PLATZHALTER` bzw. `BITTE PRÜFEN`.

**Startseite / Unterseiten**
- [ ] Öffnungszeiten (Anfahrt, Kontakt, Footer auf allen 4 Seiten)
- [ ] Telefonische Erreichbarkeit (Kontakt)
- [ ] Lift / barrierefreier Zugang (Anfahrt)
- [ ] Tarif pro Therapieeinheit (Ablauf & Kosten)
- [ ] Rückerstattung „ca. 55 € pro Therapiestunde“ – **[BITTE PRÜFEN]** (index Kosten + FAQ, beckenboden Verrechnung). Bewusst nicht im FAQ-JSON-LD enthalten; nach Bestätigung dort ergänzen.
- [ ] Formular-Backend (Formular zeigt derzeit nur einen Hinweis, es wird nichts versendet; siehe `main.js` A5)

**Impressum**
- [ ] Name Inhaber:in / Gesellschafter:innen · [ ] Rechtsform · [ ] UID-Nummer · [ ] Firmenbuch
- [ ] Berufsbezeichnung bestätigen · [ ] Berufsrecht (Link) · [ ] Gesundheitsberuferegister-Nummern
- [ ] Aufsichtsbehörde · [ ] Kammer/Verband · [ ] Medieninhaber:in · [ ] Bildnachweise (aus `assets/img/CREDITS.md`)

**Datenschutz**
- [ ] Verantwortliche Person · [ ] Hosting-Anbieter inkl. AV-Vertrag · [ ] Speicherdauer Logfiles
- [ ] Formular-Dienstleister · [ ] Speicherdauer Formulardaten · [ ] Stand/Datum
- [ ] Rechtliche Prüfung der gesamten Erklärung

**Technik**
- [ ] `og:image` und JSON-LD-URLs auf die finale Domain umstellen (absolute URLs, z. B. `https://www.phit.cc/assets/img/praxis-hallenbad-amras-1600.jpg`)
- [ ] Canonical-Link je Seite ergänzen, sobald die Domain feststeht

## 6. Deployment (statisches Hosting)

Funktioniert auf jedem statischen Hoster (Apache/Nginx-Webspace, Netlify, Cloudflare Pages, GitHub Pages …):

1. Ordner `klinik-1-referenz/` **und** `assets/` hochladen (oder Pfade wie in Abschnitt 1 anpassen).
2. HTTPS aktivieren.
3. **Kompression** (gzip/Brotli) für HTML, CSS, JS, SVG aktivieren – halbiert die Übertragungsmenge deutlich.
4. **Caching:** `assets/fonts`, `assets/img`, `assets/vendor` mit `Cache-Control: public, max-age=31536000, immutable`;
   HTML mit kurzer Cache-Dauer bzw. `no-cache`.
5. Optional `sitemap.xml` + `robots.txt` (Impressum/Datenschutz sind bereits `noindex, follow`).
6. Google Maps lädt erst nach Klick (2-Klick-Lösung) – keine Cookie-Banner nötig, solange keine Tracker ergänzt werden.

## 7. Lighthouse-Hinweise

- Ziel: Performance ≥ 90 (Mobile), Accessibility/SEO ≥ 90. Messen **auf dem echten Hosting** mit Kompression –
  der lokale Testserver komprimiert nicht und verfälscht die Werte.
- Hero-Bild ist `loading="eager"` + `fetchpriority="high"`, alle anderen Bilder `lazy` mit festen Maßen (CLS ≈ 0).
- Alle Skripte `defer`; Hero-Texte blenden sofort ein, nur die H1 wartet auf die Schrift (LCP).
- Größter JS-Posten sind GSAP + ScrollTrigger (~115 KB unkomprimiert). Wenn TBT zu hoch ist: auf Unterseiten ohne
  Animationsbedarf (Impressum/Datenschutz) die vier Vendor-Skripte entfernen – die Seite funktioniert ohne sie vollständig.
- Neue Bilder immer als WebP mit `srcset`/`sizes` einbinden, Hero-Bild nicht größer als nötig wählen.
- Bei neuen Farben Kontrast prüfen (AA: 4,5 : 1 für Text). Cyan nie als Textfarbe auf Weiß.
