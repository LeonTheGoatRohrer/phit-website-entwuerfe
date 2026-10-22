# Variante 6 – „Befund“

## Die Idee

**Die Website ist ein Befundblatt.** Gute Physiotherapie beginnt mit genauem Hinsehen: untersuchen, messen, verstehen,
erst dann behandeln. Genau diese Haltung trägt die Gestaltung. Jede Sektion ist ein nummerierter Paragraph (§ 00–§ 12),
jedes Bild eine Abbildung mit Nummer, Legende und Messrahmen (Cyan-Eckmarken). Haarlinien gliedern wie auf einem Formular,
Mono-Labels wirken wie Messwerte. Statt Stock-Fotos von lächelnden Menschen zeigen die Bilder Objekte der Präzision:
ein Goniometer, Gelenke als Glasmodelle, Lichtspuren einer Bewegung. Dazu kommt das Wasser des Hallenbads Amras.

Gemischt sind zwei der vorgeschlagenen Richtungen, und zwar kohärent: **„Biomechanisches Labor“** liefert Ordnung,
Messlinie, Annotationen und Bewegungsbahn. **„Wasser & Licht“** liefert die Bildwelt: das Cyan des Logos als Licht im Wasser,
nie als Dekor-Gradient.

**Warum es zur Praxis passt:** P.H.I.T verkauft keinen Wellness-Moment, sondern Fachlichkeit: vier Spezialist:innen mit
klaren Schwerpunkten (IVRT®, CFT, ESP, MSc Beckenboden) und eine Praxis direkt im Hallenbad. „Befund vor Behandlung“
schafft Vertrauen, ohne etwas zu versprechen. Die Ehrlichkeit gehört zum System: Jede KI-Abbildung ist als
Symbolbild beschriftet, und jede Lücke steht sichtbar als Platzhalter da.

## Farbe

| Token | Hex | Rolle |
|---|---|---|
| `--ink` | `#0B0C0D` | Tiefschwarz, Grund der dunklen Sektionen |
| `--paper` | `#F4F1EA` | warmes Weiß, heller Grund und Text auf Dunkel (≈ 17 : 1) |
| `--paper-2` | `#E9E4D9` | warme Fläche, nur für Beckenboden (Ruhe, Wärme) |
| `--cyan` | `#00B9EE` | Logo-Cyan: **nur** Fläche (Buttons, Akzentfelder, Text darauf schwarz ≈ 8,6 : 1), Licht (Messlinie, Wasserlinie) und Text auf Schwarz (≈ 8,6 : 1). **Nie Text auf Hell.** |
| `--mute-light` | `#57554F` | Sekundärtext auf Hell (≈ 6,6 : 1) |
| `--mute-dark` | `#A3A8A8` | Sekundärtext auf Dunkel (≈ 8 : 1) |

Der Rhythmus der Sektionen wechselt zwischen Hell und Dunkel: Hero dunkel · Praxis und Leistungen hell · Wasser und Sport dunkel ·
Beckenboden warm · Team hell · Ablauf dunkel · Räume, Anfahrt hell · Karriere dunkel · FAQ hell · Kontakt dunkel.

## Typografie-System

| Rolle | Schrift | Einsatz |
|---|---|---|
| Display | **Archivo** (variabel, `wdth` 125 %, `wght` 200 ↔ 640) | Headlines; Kontrast *leicht ↔ fett* in derselben Zeile (`<em>`) als Stilmittel |
| Text | **Instrument Sans** (400–700) | Fließtext 17 px, Lead 19–22 px, Zeilenlänge max. 62 ch / Lead 46 ch |
| Mono | **Geist Mono** | Labels, Paragraphen-Nummern, Legenden, Buttons, Uppercase mit 0,08 em Laufweite |

Feste Skala (≈ 1,25): 12 · 14 · 17 · 19–22 · 22–28 · 32–60 · 46–136 px (Display fluide per `clamp()`, im Hero zusätzlich auf
12,5 svh begrenzt). Alle Schriften liegen lokal in `../assets/fonts/`.

## Motion: jede Bewegung hat einen Zweck

| Moment | Zweck |
|---|---|
| **Messlinie** (Header-Unterkante, Cyan-Punkt = Logo-Kreis) + Abschnittsanzeige „§ 03 Wasser“ | Orientierung auf einer langen Seite |
| Hero: Zeilen steigen aus Masken (reines CSS, sofort) | Rhythmus, erster Eindruck, ohne auf JS zu warten |
| Sektionskopf: Haarlinie zieht sich auf, dann Text | Rhythmus, markiert den Kapitelwechsel |
| **Register** (Leistungen): aktive Zeile per Scroll/Hover/Fokus, Vorschau-Abbildung wechselt | Spannung und Zuordnung Text ↔ Bild, ohne Karten-Raster |
| **Wasserlinie** (§ 03, ab 900 px gepinnt): Wasser steigt beim Scrollen über die Bühne | Spannung, erzählt das Alleinstellungsmerkmal Hallenbad |
| Annotationen am Kniemodell zeichnen sich | Präzision, „Befund“ |
| Ablauf-Linie (4 Schritte) füllt sich mit dem Scroll | Orientierung im Prozess |
| Clip-Reveals der Abbildungen | Rhythmus |

**Reduzierte Bewegung / ohne JS:** Alle Startzustände gelten nur unter `html.js-motion`. Diese Klasse wird nur gesetzt, wenn
**keine** reduzierte Bewegung gewünscht ist. Dann ist alles sofort sichtbar, die Wasser-Szene steht statisch auf hohem Pegel
und ist nicht gepinnt, und es werden **keine Videos geladen** (Poster bleiben stehen). Keine Bibliothek: Alles ist Vanilla JS
mit IntersectionObserver und rAF. GSAP und Lenis wurden bewusst nicht eingebunden, weil sie hier keinen Mehrwert gegenüber
etwa 6 KB eigenem Code bieten.

## Bewusst vermieden

Kein Hero mit drei Feature-Karten, keine Icon-Reihen (die Leistungen sind ein typografisches Register), keine Deko-Gradients
(nur ein funktionaler Lesbarkeits-Verlauf über dem Hero-Bild), keine KI-Personen mit Gesicht, keine Stock-Lächler.
