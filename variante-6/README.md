# P.H.I.T – Variante 6 „Befund“

Statische Website (HTML + CSS + Vanilla JS, kein Build, keine Bibliothek). Konzept: `DESIGN-CONCEPT.md`,
generierte Assets und Credits: `ASSET-LOG.md`.

```

├── index.html          Startseite: § 00 Hero · 01 Praxis · 02 Leistungen (Register) · 03 Wasser (Scroll-Szene)
│                       04 Sport · 05 Beckenboden · 06 Team · 07 Ablauf & Kosten · 08 Räume · 09 Anfahrt
│                       10 Karriere · 11 FAQ · 12 Kontakt
├── beckenboden.html    Unterseite Beckenbodentherapie
├── impressum.html      Inhalte aus final/ übernommen (noindex)
├── datenschutz.html    Inhalte aus final/ übernommen, Schriftnamen angepasst (noindex)
├── css/style.css       Tokens (Abschnitt 02), Typo-System (04), 24 nummerierte Abschnitte
├── js/main.js          A Basis (Menü, Karte 2-Klick, Formular-Hinweis) · B Motion (nur ohne reduced motion)
├── img/gen/            KI-Stills (WebP 640/1024/1600/max + JPG 1024), manifest.json
├── img/team-*-168.jpg  Mini-Avatare (aus ../assets/img zugeschnitten)
└── video/              4 Loops, MP4 (H.264) + WebM (VP9), ohne Ton
```

Gemeinsam genutzt (eine Ebene höher): `../assets/fonts/`, `../assets/logo/`, `assets/img/` (Team, Trainingsraum, Hallenbad).

## Lokal öffnen

Ein beliebiger statischer Server im **Repo-Root** (wegen `../assets/`), z. B.:

```bash
python -m http.server 8000
```

Danach `http://localhost:8000/variante-6/` öffnen. Direktes Öffnen per `file://` funktioniert weitgehend, Videos und
Schriften laden aber je nach Browser nicht zuverlässig.

## Messwerte (lokal, 20.10.2026)

Lighthouse 13.5.0, Mobile (Standard-Emulation, simuliertes Throttling), lokaler Node-Server mit gzip:

| Seite | Performance | Accessibility | Best Practices | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| index | 97 | 100 | 100 | 100 | 2,2 s | 40–80 ms | 0 |
| beckenboden | 97 | 100 | 100 | 100 | 2,3 s | 0 ms | 0 |
| impressum / datenschutz | 98 | 100 | 100 | 63* | 1,9 s | 0 ms | 0 |

\* SEO 63 nur wegen des gewollten `noindex`. Transfergröße beim ersten Laden: Startseite etwa 350 KB, Beckenboden etwa 226 KB.
Auf dem echten Hosting erneut messen.

## Pflege

- Platzhalter: Suche nach `PLATZHALTER` bzw. `BITTE PRÜFEN` (gelb markiert).
- Header und Footer sind in allen vier Dateien identisch. Änderungen bitte überall nachziehen.
- Neues Leistungs-Register: `<li class="reg" data-img="img/gen/NAME" data-cap="Abb. …">`. Die Vorschau lädt `NAME-640/1024/1600.webp`.
- Abschnittsanzeige im Header: Attribut `data-section="§ 03 Wasser"` an der Sektion.
