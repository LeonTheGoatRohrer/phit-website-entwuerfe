# Design-Notes – 5 Varianten für P.H.I.T Innsbruck

## Farbwelt aus dem Logo

Das aktuelle Logo besteht aus drei Elementen: dem kursiven, sehr fetten Schriftzug **„Phit“** in Schwarz, einem **Unterstrich-Balken** mit schrägen Enden und einem **leuchtenden Kreis in Cyan #00B9EE**, der wie eine Wasseroberfläche bzw. ein Lichtring wirkt. Im älteren Logo kommt noch ein **Grau #707070** dazu.

| Logo-Farbe | Hex | Interpretation |
|---|---|---|
| Cyan (Kreis) | `#00B9EE` | Wasser, Hallenbad, Frische, Energie |
| Schwarz (Schriftzug) | `#000000` | Klarheit, Präzision |
| Grau (Alt-Logo) | `#707070` | Ruhe, Sachlichkeit |

`#00B9EE` erreicht auf Weiß nur einen Kontrast von ca. 2,4 : 1 und ist deshalb **nie Textfarbe auf hellem Grund**. Jede Variante leitet daraus eine eigene, AA-taugliche Akzentfarbe ab oder verwendet Cyan nur als Fläche mit dunkler Schrift (Schwarz auf Cyan ≈ 9,5 : 1).

Logo im Web: `assets/logo/phit-logo.svg` (dunkel) und `phit-logo-weiss.svg` (hell), vektorisiert aus dem Originalschriftzug.

---

## Variante 1 – „Klinik“

- **Designidee:** Eine Praxis, die wirkt wie eine erstklassige Facharztordination: ruhig, aufgeräumt, maximal lesbar. Information steht vor Inszenierung, jede Sektion beantwortet eine konkrete Patientenfrage. Vertrauen entsteht durch Ordnung, klare Hierarchien und sichtbare Qualifikationen.
- **Schrift:** Inter (variabel, 400–700) für alles; Zahlen mit `font-variant-numeric: tabular-nums`.
- **Farben:** Weiß `#FFFFFF` · Fläche `#F3F7F9` · Linie `#DCE5E9` · Tinte `#0F2A33` · Text gedämpft `#475E66` · **Petrol `#0A6A7E`** (Primär, AA auf Weiß) · Petrol dunkel `#07505F` (Hover) · Cyan `#00B9EE` nur als feine Akzentlinie/Logo.
- **Layout:** Klassisches 12-Spalten-Raster, max. 1200 px, großzügiger Weißraum, Info-Leiste oben (Telefon, Adresse), Leistungen als ruhiges Karten-Raster mit Linien-Icons (1,5 px, eigene SVGs), Qualifikationen als Badges, „Ablauf & Kosten“ als nummerierte Timeline, FAQ als Akkordeon.
- **Animation:** Nur dezente Fade-ins (IntersectionObserver, 400 ms, 12 px Versatz), sonst nichts.
- **Bilder:** `therapie-knie`, `therapie-nacken`, `praxis-hallenbad-amras`, `trainingsraum-phit`, `physio-knie-mobilisation`, `behandlungsraum`, `beckenboden-behandlung`, Team-Porträts (farbig, rechteckig, einheitlich).

## Variante 2 – „Modern“

- **Designidee:** Swiss-Editorial-Haltung – die Typografie *ist* das Bild. Riesige, extrabreite Headlines, ein asymmetrisches Raster und harte Bildkanten erzeugen Selbstbewusstsein; Cyan aus dem Logo wird als einzige, kompromisslose Signalfarbe in großen Flächen eingesetzt. Wirkt wie das Magazin der modernsten Praxis der Stadt.
- **Schrift:** Archivo (variabel, Breitenachse 62–125) – Headlines in Expanded/Black, Fließtext normal; JetBrains Mono für Labels, Nummerierungen und Meta-Infos.
- **Farben:** Papier `#F1F0EB` · Tinte `#0B0B0B` · **Signal-Cyan `#00B9EE`** (nur Fläche, Text darauf schwarz) · Grau `#5C5C5C` (Sekundärtext, AA) · Linie `#0B0B0B` 1 px.
- **Layout:** 12-Spalten-Raster mit bewusst asymmetrischen Spannweiten, nummerierte Sektionen (01–12), Bento-Grid für Leistungen, eckige Bilder ohne Rundungen, Haarlinien als Gliederung, Laufband (Marquee) mit Fakten.
- **Animation:** Mikro-Interaktionen: magnetische Buttons, Bild-Reveal beim Hover über Leistungen/Team, unterstrichene Links mit Wipe, Marquee. Keine Scroll-Inszenierung.
- **Bilder:** `haende-manuelle-therapie`, `training-kraft-coaching`, `wasser-bahnen`, `laeufer-beine-dynamik`, `therapie-nacken`, `therapie-knie`, `trainingsraum-phit`, `beckenboden-huefte`, Team in Graustufen → Farbe beim Hover.

## Variante 3 – „Motion“

- **Designidee:** Eintauchen. Die Seite erzählt die Praxis als Bewegung durch Wasser – vom Abtauchen im Hero bis zum Auftauchen im Kontakt. Das Hallenbad Amras ist nicht nur Standort, sondern das Leitmotiv: Wellen, Lichtbrechung, Ripples.
- **Schrift:** Syne (800) für Display, Manrope (400–700) für Text.
- **Farben:** Tiefsee `#04141C` · Tiefe `#0A2633` · **Cyan `#00B9EE`** · Aqua hell `#7FE3FF` · Schaum `#E8F7FC` · Text gedämpft `#9DB8C2`.
- **Layout:** Dunkles Vollbild-Layout, Hero mit Parallax-Bildebenen und Text-Split, gepinnte USP-Sektion (Unterwassertherapie), horizontal scrollende Leistungs-Galerie, Zahlen-Counter, Masken-Reveals für Bilder, SVG-Wellen als Sektionsübergänge, Ripple-Effekt am Cursor (Canvas, nur Desktop).
- **Animation:** GSAP 3 + ScrollTrigger + Lenis (CDN). Mobile: Pinning/Horizontal-Scroll aus, einfache Reveals. `prefers-reduced-motion`: alles aus, Inhalte sofort sichtbar. Inhalte sind nie *nur* über Animation erreichbar.
- **Bilder:** `wasser-unterwasser`, `schwimmer-unterwasser`, `hallenbad-ruhig`, `wasser-textur-licht`, `wasser-tropfen`, `praxis-hallenbad-amras`, `haende-ruecken-behandlung`, `training-geraete-betreuung`, `laeufer-bahn`, `trainingsraum-phit`, Team.

## Variante 4 – „Alpin / Innsbruck Sport“

- **Designidee:** „Wir bringen dich zurück auf den Berg.“ Innsbruck mit Nordkette ist Kulisse und Versprechen zugleich: Return to Sport, Kreuzband-Reha und Laufanalyse stehen vorne. Diagonalen, Bergsilhouetten und kondensierte Display-Schrift geben Tempo.
- **Schrift:** Barlow Condensed (600–800, auch Italic) für Headlines, Barlow (400–600) für Text.
- **Farben:** Granit `#13171A` · Fels `#2A3136` · Schnee `#F4F6F7` · **Alpenglühen `#FF5A1F`** (auf dunklem Grund bzw. als Fläche mit dunkler Schrift) · Alpenglühen dunkel `#C23E0C` (Text auf Hell, AA) · Gletscher-Cyan `#00B9EE` · Latsche `#1E3A2C`.
- **Layout:** Schräg angeschnittene Sektionen (`clip-path`), Nordkette als SVG-Silhouette, „Höhenprofil“-Linie als Ablaufgrafik (Phasen der Reha), große Zahlen, Sport-Kacheln (Laufen, Skitour, Klettern).
- **Animation:** Kraftvoll, aber kurz: Diagonal-Wipes beim Einblenden, leichte Parallax der Bergsilhouette, Hover-Zoom auf Sportbildern. Reduced-Motion respektiert.
- **Bilder:** `innsbruck-inn-nordkette`, `nordkette-abendlicht`, `skitour-aufstieg`, `skitour-gegenlicht`, `trailrunning-gipfel`, `trailrunning-beine`, `klettern-grat`, `laeufer-bahn`, `physio-knie-mobilisation`, `therapie-knie`, `training-kraft-coaching`, `trainingsraum-phit`, Team.

## Variante 5 – „Boutique / Wellbeing“

- **Designidee:** Hier wird man als Mensch gesehen. Warme Neutraltöne, eine elegante Serif und viel Ruhe machen aus der Praxis einen geschützten Raum – besonders für sensible Themen wie Beckenboden. Leitgedanke ist die Gesundheitsdefinition der WHO.
- **Schrift:** Fraunces (variabel, Soft-Optik, auch Italic) für Headlines, Figtree (400–600) für Text.
- **Farben:** Leinen `#FAF6F0` · Sand `#EFE6D8` · Salbei `#A3B09A` (Fläche) · Salbei dunkel `#4D5C49` (Text) · **Gedämpftes Petrol `#2E5C63`** (Primär) · Ton `#C8A68C` · Tinte `#2B2724`.
- **Layout:** Weiche Rundungen (24–40 px), Bilder in organischen Masken (Bogen/Blob), viel Luft, zentrierte Zitate, Leistungen als ruhige Liste mit Hover-Bild, Beckenboden als eigene, warm inszenierte Sektion.
- **Animation:** Langsam und sanft (800–1200 ms, ease-out), Bilder blenden mit leichtem Scale ein, Blob-Formen bewegen sich kaum merklich. Reduced-Motion: statisch.
- **Bilder:** `hand-ruecken-ruhig`, `beckenboden-behandlung`, `beckenboden-huefte`, `haende-warm`, `behandlungsraum`, `hallenbad-ruhig`, `nordkette-abendlicht`, `therapie-nacken`, `trainingsraum-phit`, Team (warm getönt).

---

## Unterscheidbarkeit auf einen Blick

| | Grund | Schrift | Akzent | Form | Bewegung |
|---|---|---|---|---|---|
| 1 Klinik | Weiß | Inter | Petrol | Raster, kleine Radien | fast keine |
| 2 Modern | Papier | Archivo Expanded + Mono | Cyan-Flächen | harte Kanten, asymmetrisch | Mikro-Interaktionen |
| 3 Motion | Tiefsee-Dunkel | Syne + Manrope | Cyan/Aqua leuchtend | Wellen, Masken | volle Scroll-Inszenierung |
| 4 Alpin | Granit/Schnee | Barlow Condensed | Alpenglühen-Orange | Diagonalen, Berge | Wipes, Parallax |
| 5 Boutique | Leinen/Sand | Fraunces + Figtree | Salbei/Petrol | Bögen, Blobs | langsam, sanft |
