# P.H.I.T – Website (Produktivfassung)

Statische Website für **P.H.I.T – Physiotherapie und individuelles Training**, Innsbruck (www.phit.cc).
Basis: Entwurf „Klinik 1 · Referenz“. HTML + CSS + Vanilla JS, kein Framework. Ausgeliefert werden
minifizierte Dateien (`css/style.min.css`, `js/main.min.js`); die lesbaren Quellen liegen daneben.

**Der Ordner `final/` ist das Web-Root:** Inhalt 1:1 in das Stammverzeichnis von www.phit.cc hochladen.

---

## 1. Ordnerstruktur

```
final/                      = Web-Root (www.phit.cc/)
├── index.html              Startseite (One-Pager: Hero, Leistungen, Beckenboden, Sport, Team,
│                           Ablauf & Kosten, Räume, Anfahrt, Karriere, FAQ, Kontakt)
├── beckenboden.html        Unterseite Beckenbodentherapie
├── impressum.html          Impressum (noindex)
├── datenschutz.html        Datenschutzerklärung (noindex)
├── 404.html                Fehlerseite (eigenständig: Styles inline, Links mit „/“ – siehe Abschnitt 3)
├── css/style.css           Stylesheet – lesbare QUELLE (21 nummerierte Abschnitte, Design-Tokens in 02)
├── css/style.min.css       Stylesheet – AUSGELIEFERT (Build, nicht von Hand bearbeiten)
├── js/main.js              Interaktion + Motion – lesbare QUELLE
├── js/main.min.js          AUSGELIEFERT (Build, nicht von Hand bearbeiten)
├── assets/img/             Bilder: WebP + JPG, Breiten 640/1024/1600/2560 (Porträts 640/960,
│                           Mini-Avatare 168); Bildnachweise: assets/img/CREDITS.md
├── assets/fonts/           Inter (normal + italic, variabel), Geist Mono – lokal, keine Google-Requests
├── assets/logo/            phit-logo.svg (hell), phit-logo-weiss.svg (dunkel)
├── assets/icons/           App-Icons 32/192/512 + maskable 512 (aus phit-logo.svg gerendert)
├── assets/vendor/          GSAP 3.13 (gsap, ScrollTrigger, SplitText), Lenis 1.3.4 – nur Desktop, nachgeladen
├── favicon.svg / .ico      Favicon (SVG passt sich dem Dark Mode des Browsers an; ICO 16/32/48)
├── apple-touch-icon.png    180 × 180
├── site.webmanifest        Web-App-Manifest (Name, Farben, Icons)
├── robots.txt              erlaubt alles, verweist auf die Sitemap
├── sitemap.xml             Startseite + Beckenboden (Impressum/Datenschutz sind bewusst noindex)
├── .htaccess               Apache-Vorlage: Kompression, Caching, 404, Sicherheits-Header
└── README.md               diese Datei (per .htaccess vor Abruf geschützt)
```

## 2. Build / Minify

Nach jeder Änderung an `css/style.css` oder `js/main.js` die Auslieferungsdateien neu erzeugen
(im Ordner `final/`, Node.js ≥ 18 nötig, esbuild wird von npx automatisch geladen):

```
npx esbuild@0.24.0 css/style.css --minify --outfile=css/style.min.css
npx esbuild@0.24.0 js/main.js --minify --outfile=js/main.min.js
```

Die HTML-Seiten referenzieren ausschließlich die `.min`-Dateien. Wer ohne Build arbeiten will, kann in den
vier Seiten testweise `style.min.css` → `style.css` und `main.min.js` → `main.js` tauschen.
Nach einem Upload neuer CSS/JS-Dateien: Browser-Cache beachten (siehe `.htaccess`, 1 Woche) – bei Bedarf
im HTML `?v=2` an den Dateinamen hängen.

## 3. Deployment

1. **Inhalt von `final/` in das Web-Root hochladen** (inkl. der versteckten Datei `.htaccess`). Alle Pfade
   sind relativ zum Root (`assets/…`, im CSS `../assets/…`); es gibt keine Abhängigkeit außerhalb des Ordners.
2. **HTTPS** aktivieren. Danach in `.htaccess` den Block „HTTPS + www erzwingen“ und den HSTS-Header
   einkommentieren (leitet `phit.cc`, `http://` und `/index.html` auf `https://www.phit.cc/` um).
3. **Google Search Console:** Domain bestätigen, `https://www.phit.cc/sitemap.xml` einreichen.
4. Alte WordPress-URLs: Wer häufig verlinkte Altseiten kennt, legt in `.htaccess` 301-Weiterleitungen an
   (`Redirect 301 /alte-seite/ https://www.phit.cc/`). Alles andere landet auf der 404-Seite.

**Die `.htaccess` (Apache, die meisten österreichischen Webhoster)**
- `ErrorDocument 404 /404.html` – eigene Fehlerseite. Sie ist absichtlich eigenständig (CSS inline, Logo inline,
  Links auf `/…`), weil der Server sie unter *jeder* falschen URL ausliefert, auch in Unterordnern.
- **Kompression:** Brotli (falls `mod_brotli` vorhanden), sonst gzip (`mod_deflate`) für HTML, CSS, JS, SVG, JSON.
- **Caching:** Bilder, Fonts, Icons, Vendor-Skripte 1 Jahr `immutable` → ausgetauschte Bilder bitte unter neuem
  Dateinamen ablegen. `style.min.css`/`main.min.js` 1 Woche. HTML/Manifest/Sitemap `no-cache` (immer aktuell).
- **Sicherheits-Header:** `nosniff`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`.
- README.md und CREDITS.md werden nicht ausgeliefert. Alle Blöcke stecken in `<IfModule>` – fehlt ein Modul,
  wird der Block ignoriert. Optional (bei manchen Hostern verboten): `Options -Indexes`.

**Andere Hoster**
- **Nginx:** `.htaccess` wird ignoriert – dieselben Regeln (gzip/brotli, `expires`, `error_page 404 /404.html`)
  in der Server-Konfiguration setzen.
- **Netlify / Cloudflare Pages:** Ordner `final/` als Publish-Verzeichnis; `404.html` wird automatisch verwendet,
  Kompression ist eingebaut. Cache-Header bei Bedarf über eine `_headers`-Datei.
- **GitHub Pages:** funktioniert (404.html wird erkannt, gzip automatisch), `.htaccess` wird ignoriert,
  Cache-Header sind nicht konfigurierbar (10 min). Für eine eigene Domain eine Datei `CNAME` mit `www.phit.cc` anlegen.

## 4. Inhalte pflegen

Alle Texte stehen direkt im HTML, jede Sektion ist mit einem Kommentar markiert (`<!-- ===== Team ===== -->`).

| Was | Wo |
|---|---|
| **Header & Footer** | stehen **in allen 4 Seiten** (index, beckenboden, impressum, datenschutz) identisch – Änderungen in allen vier Dateien vornehmen (auf Unterseiten zeigen die Links auf `index.html#…`). Die 404-Seite hat einen eigenen, vereinfachten Kopf/Fuß. |
| Telefon / E-Mail | Suchen nach `+43512366002`, `0512 / 36 60 02`, `info@phit.cc` (Header, Menü, Hero, Kontakt, Footer, Callbar, 404, JSON-LD) |
| Leistungen | `index.html` → `<ul class="services__grid">`, je Karte ein `<li class="service">`. Icons sind Inline-SVGs; Pfade brauchen `pathLength="1"` für die Strichanimation |
| Team | `index.html` → `<article class="member">`; Badges: `<li class="badge">`, Hauptqualifikation `badge badge--key` (Häkchen/Schild-Icon kommt per CSS) |
| Häkchen-Listen | `<ul class="check-list"><li>Text</li></ul>` – das Häkchen setzt das CSS (`--i-check`) |
| Praxisschild (Hero) | `index.html` → `<div class="plate">`, je Person ein `<li class="plate__row">` (Animation ist für 4 Zeilen getaktet) |
| Vertrauensleiste | `<li class="fact">`; Zahl im Attribut `data-count` **und** im Text identisch halten |
| Ablauf-Schritte | `<li class="step">` innerhalb `.timeline__steps` |
| FAQ | `<details class="faq__item">`; zusätzlich JSON-LD `FAQPage` im `<head>` von `index.html` anpassen |
| Bilder | Muster `<picture>` mit WebP-`srcset` + JPG-Fallback, `width`/`height` immer setzen, `sizes` = tatsächliche Anzeigebreite. Nur `loading="lazy"` außerhalb des ersten Bildschirms |
| SEO | Je Seite `<title>`, `meta description`, `canonical`, Open Graph (`og:url`/`og:image` absolut auf `https://www.phit.cc/…`), JSON-LD. Neue Seiten in `sitemap.xml` eintragen |

## 5. Design-Tokens (`css/style.css`, Abschnitt 02)

- **Farbe:** `--c-white`, `--c-mist` (Flächen), `--c-line`, `--c-ink` #0F2A33 (Text), `--c-ink-2` (Sekundärtext, AA),
  `--c-petrol` #0A6A7E (Primär, AA auf Weiß), `--c-petrol-700` (Hover), `--c-deep` (dunkle Sektionen),
  `--c-cyan` #00B9EE (nur Licht/Akzentlinie – **nie Text auf Hell**). Semantische Rollen: `--color-*`.
- **Typo:** Inter (Text/Headlines) + Geist Mono (Labels, Praxisschild), fluide Skala `--fs-2xs … --fs-h1`.
- **Spacing:** 4er-Raster `--sp-1 … --sp-20`, `--sp-section`, `--gutter`, `--container` (1240 px).
- **Radien** `--r-xs … --r-pill`, **Schatten** `--sh-1 … --sh-3`, **Motion** `--ease-out` (≙ GSAP `expo.out`),
  `--ease-in-out` (≙ `power3.inOut`), `--ease-standard`, `--dur-1 … --dur-4`.

## 6. Motion-System (inkl. Mobile-Strategie)

Grundregel: **Progressive Enhancement in drei Ebenen** – jede Ebene ist optional, die Seite ist ohne JS,
bei `prefers-reduced-motion: reduce` und bei Ladefehlern vollständig sichtbar und benutzbar.

| Ebene | Wo | Wer bekommt sie | Was |
|---|---|---|---|
| **1 Hero-Intro** | `style.css` 19a, reines CSS | alle (außer reduced motion), auch ohne JS | Hero-Texte steigen gestaffelt auf, H1 bewegt sich (bleibt aber **deckend** – LCP), Akzent-Zeile „leuchtet“ in Petrol auf, Hero-Bild öffnet sich aus leichtem Inset und setzt sich (scale), Praxisschild baut sich auf (Rahmen → Lichtlinie → Kopf → Zeilen → Fuß) |
| **2 Scroll-Reveals „lite“** | `main.js` B, `style.css` 19b/19c | alle Geräte (außer reduced motion) | IntersectionObserver setzt `.is-in`, die Bewegung sind CSS-Transitions mit den Motion-Tokens: Blöcke fade-up, Kinder gestaffelt, Bild-Masken (clip-path + Zoom-out), Leistungs-Icons zeichnen sich, Zahlen-Counter, Timeline-Fortschrittslinie + aktive Schritte |
| **3 Desktop-Enhancement** | `main.js` C | nur Maus/Trackpad **und** ≥ 768 px (`.js-full`) | GSAP + ScrollTrigger + SplitText + Lenis werden **nach dem `load`-Event im Leerlauf** (`requestIdleCallback`) nachgeladen: Lenis-Smooth-Scroll inkl. weicher Anker, Headlines (h2) zeilenweise per SplitText-Masken (`aria: "auto"`), Bild-Parallax (`data-parallax`) |

**Mobile/Touch:** lädt die Bibliotheken gar nicht (≈ 140 KB JS gespart). Dort laufen Ebene 1 + 2 – dieselben
Kurven und Dauern, kürzere Wege (`--rise` 0,875 rem statt 1,5 rem), kein Parallax, kein Lenis, kein Pinning.
**LCP:** H1 und Hero-Bild sind ab dem ersten Frame sichtbar und warten nie auf JS. Headlines, die beim
Nachladen von GSAP schon sichtbar sind, werden nicht erneut animiert (kein Flackern).

Attribute (einfach ins HTML schreiben):

| Attribut | Wirkung |
|---|---|
| `data-reveal="up"` | Block blendet beim Scrollen von unten ein |
| `data-stagger` | direkte Kinder erscheinen gestaffelt (Karten, Listen) |
| `data-reveal="clip"` | Bild öffnet sich per `clip-path` von unten |
| `data-split` | h2 erscheint (Desktop) zeilenweise per SplitText, sonst als Block |
| `data-parallax="5"` | leichter Parallax des Bildes (yPercent), nur Desktop-Enhancement |
| `data-count="320"` | Zahlen-Counter |
| `data-timeline` | Ablauf: Fortschrittslinie folgt dem Scroll, Schritte werden aktiv |
| Klasse `hero-intro` | Container, dessen Kinder das CSS-Intro bekommen (Hero, Unterseiten-Kopf) |

Weitere Momente: Header verdichtet sich ab 48 px (`.is-condensed`), gleitender Nav-Indikator mit Scroll-Spy,
Leistungskarten mit Lift + Icon-Strichanimation (Hover, nur Maus), FAQ-Höhenanimation (`::details-content`,
Chromium ≥ 131), **Seitenübergänge** per `@view-transition { navigation: auto; }` (Chrome/Edge).
Animiert werden nur `transform`, `scale`, `opacity`, `clip-path` (Ausnahmen: FAQ-Höhe, Akzentfarbe der H1).

## 7. Performance & gemessene Lighthouse-Werte

**Gemessen am 19.10.2026**, Lighthouse (Node-Modul, Chrome headless) gegen einen lokalen Node-Server mit gzip,
je **Median aus 3 Läufen**. Mobile = Lighthouse-Standard (Moto G Power, 4× CPU-Drosselung, langsames 4G),
Desktop = 1350 × 940, ohne CPU-Drosselung. Der Messrechner war stark ausgelastet; die Werte schwanken um
± 3 Punkte. Kontrollseite `impressum.html` (sehr leicht): Mobile Performance 98.

| Seite | Mobile Perf. | Desktop Perf. | Accessibility | Best Practices | SEO | Mobile FCP / LCP / TBT / CLS |
|---|---|---|---|---|---|---|
| index.html | **96** (vorher 63–77) | **100** | 100 | 100 | 100 | 1,4 s / 2,1 s / ~100 ms / 0 |
| beckenboden.html | **97** | **100** | 100 | 100 | 100 | 1,4 s / 2,2 s / 0 ms / 0 |

Impressum/Datenschutz: SEO-Wert < 100 nur wegen des gewollten `noindex`.
Auf dem echten Hosting (Brotli, HTTP/2, CDN-nah) sind die Werte typischerweise gleich oder besser.
Bitte nach dem Livegang einmal mit PageSpeed Insights (https://pagespeed.web.dev/) gegenprüfen.

Was die Werte trägt: kein Bibliotheks-JS auf Mobile; GSAP erst nach `load`; CSS und JS minifiziert,
`lenis.css` ins Stylesheet integriert (ein Request weniger); Hauptschrift vorgeladen; `sizes` an die
tatsächliche Anzeigebreite angepasst (Hero lädt auf Mobile 640 w statt 1024 w); 168-px-Avatare statt 640-px-Bildern;
Häkchen-/Badge-Icons als CSS-Maske statt Inline-SVG (DOM index: 955 → ~770 Elemente).

## 8. Platzhalter – vor dem Livegang ersetzen (Checkliste)

Alle Platzhalter sind im Browser gelb markiert (`<span class="placeholder">`). Suche: `PLATZHALTER` bzw. `BITTE PRÜFEN`.

**Startseite (`index.html`)**
- [ ] Öffnungszeiten – Anfahrt (Info-Liste) und Footer
- [ ] Öffnungszeiten / telefonische Erreichbarkeit – Kontakt
- [ ] Lift / barrierefreier Zugang – Anfahrt
- [ ] Tarif pro Therapieeinheit – Ablauf & Kosten
- [ ] **[BITTE PRÜFEN]** Rückerstattung „ca. 55 € pro Therapiestunde“ – Kostenpanel + FAQ „Was zahlt die Krankenkasse?“.
      Bewusst nicht im FAQ-JSON-LD; nach Bestätigung dort ergänzen.
- [ ] Formular-Backend – das Formular versendet derzeit nichts, es zeigt nur einen Hinweis (`main.js` A5).
      Optionen: Formular-Dienst (z. B. mit AV-Vertrag) oder PHP-Mailer des Hosters; danach Datenschutz anpassen.

**Beckenboden (`beckenboden.html`)**
- [ ] **[BITTE PRÜFEN]** Rückerstattung ca. 55 € – Abschnitt Verrechnung
- [ ] Öffnungszeiten – Footer

**Impressum (`impressum.html`)**
- [ ] Name der Inhaberin / des Inhabers bzw. Gesellschafter:innen · [ ] Rechtsform
- [ ] UID-Nummer (falls vorhanden) · [ ] Firmenbuchnummer und -gericht (falls eingetragen)
- [ ] Berufsbezeichnung bestätigen („bitte bestätigen“) · [ ] Berufsrecht (z. B. MTD-Gesetz, Link auf ris.bka.gv.at)
- [ ] Registrierungsnummern der Therapeut:innen (Gesundheitsberuferegister)
- [ ] Zuständige Aufsichtsbehörde · [ ] Kammer- oder Verbandszugehörigkeit · [ ] Medieninhaber:in
- [ ] Bildnachweise gemäß `assets/img/CREDITS.md` ergänzen · [ ] Öffnungszeiten – Footer

**Datenschutz (`datenschutz.html`)**
- [ ] Name der verantwortlichen Person · [ ] Hosting-Anbieter, Sitz, Auftragsverarbeitungsvertrag
- [ ] Speicherdauer (2×: Server-Logfiles, Formulardaten) · [ ] Formular-Backend / Dienstleister
- [ ] Stand/Datum · [ ] Öffnungszeiten – Footer
- [ ] Rechtliche Prüfung der gesamten Erklärung (kein Platzhalter-Marker, aber Pflicht)

**Technik / Livegang**
- [ ] Domain prüfen: Canonical, `og:url`, `og:image`, JSON-LD und Sitemap zeigen auf `https://www.phit.cc/` –
      bei anderer Domain per Suchen & Ersetzen `https://www.phit.cc/` anpassen (HTML, `sitemap.xml`, `robots.txt`)
- [ ] HTTPS-Weiterleitung + HSTS in `.htaccess` einkommentieren (Abschnitt 3)
- [ ] `lastmod` in `sitemap.xml` bei größeren Inhaltsänderungen aktualisieren
- [ ] Sitemap in der Google Search Console einreichen; Google-Unternehmensprofil auf die neue URL verlinken

## 9. Bildnachweise

Siehe **`assets/img/CREDITS.md`** (Quelle, Lizenz und Bearbeitung je Bild). Die dort erwähnten Originale
(`_original/`) und `manifest.json` liegen im Projekt-Masterordner (`../assets/img/`), nicht im Web-Root.
Die Bildnachweise müssen zusätzlich im Impressum stehen (Platzhalter oben).

## 10. Barrierefreiheit & Qualität

Ein `<h1>` pro Seite, Landmarks, Skip-Link, zugängliches Mobile-Menü (Escape, Fokus-Schleife), sichtbare
Fokuszustände, Kontrast AA, gültige `<dl>`-Strukturen, Alt-Texte. Geprüft bei 360/390/1440/1920 px, mit und ohne
Animation, ohne JavaScript: 0 Konsolenfehler, 0 fehlende Dateien, 0 horizontaler Overflow, 0 kaputte Anker.
Google Maps lädt erst nach Klick (2-Klick-Lösung) – kein Cookie-Banner nötig, solange keine Tracker ergänzt werden.
