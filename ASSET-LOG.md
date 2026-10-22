# Asset-Log – Variante 6 „Befund“

Alle Bilder und Videos in `img/gen/` und `video/` wurden am **20.10.2026** über Higgsfield generiert.
Sie zeigen **weder die Praxis noch reale Personen** und sind auf der Seite als „KI“ / „KI-generiert“ / „Symbolbild“ gekennzeichnet.
Echte Fotos (Team, Trainingsbereich, Hallenbad-Gebäude) stammen unverändert aus `assets/img/`.

## Budget

| | Credits |
|---|---|
| Vorgegebenes Budget | `{{MAX_CREDITS}}` war nicht ausgefüllt → selbst gesetzte Obergrenze **150** |
| Guthaben vor Start | 2.941,00 |
| Guthaben nach Abschluss | 2.851,25 |
| **Differenz laut Konto** | **89,75** |
| davon eigene Generierungen dieser Variante (Summe der Tabellen unten) | **84,25** |
| nicht zuordenbar | 5,50 (11 × 0,50 „GPT Image 2.5 Flare“, 18:07–18:13 UTC, siehe unten) |
| Verbleibend vom selbst gesetzten Budget | 150 − 89,75 = **60,25** |

> **Hinweis zu den 5,50 Credits:** Im Transaktionsprotokoll stehen in diesem Zeitraum elf Buchungen zu je 0,50 Credits
> („GPT Image 2.5 Flare“), die keiner Generierung dieser Variante entsprechen. Alle eigenen Bilder kosteten 2,75 (Qualität
> `high`, 2K). Wahrscheinlich stammen sie aus einer parallelen Sitzung auf demselben Konto. Das ließ sich nicht klären,
> deshalb sind sie hier vorsichtshalber mitgezählt.

## Stil-Prompt-Block (für alle Stills wiederverwendet)

> STYLE: high-end editorial still photography, deep near-black shadows, one cool cyan (#00B9EE) accent/rim light and soft
> warm-white (#F4F1EA) key light, 50–100 mm lens, shallow depth of field, fine film grain, quiet clinical precision.
> No text, no logos, no brands. Bei Händen: no faces visible.

## Modelle

- **Stills:** `gpt_image_2_5` (GPT Image 2.5, Variante Flare), `quality: high`, `resolution: 2k`, je **2,75 Credits**.
  Gewählt als Higgsfield-Standardmodell für fotorealistische Bilder. Recraft V4.1 und Soul Location wurden geprüft und verworfen
  (Recraft ist auf Vektor/Utility ausgelegt, Soul Location nur auf Umgebungen).
- **Videos:** `kling3_0` (Kling v3.0), `mode: pro`, `sound: off`, **Start- und Endbild identisch**, damit der Loop nahtlos ist.
  5 s = 8,75 Credits, 8 s = 14 Credits. Seedance 2.5 (1080p, 6 s ≈ 96 Credits) war für das Budget zu teuer.

## Stills (`img/gen/`, je WebP 640/1024/1600/max + JPG 1024)

| # | Datei | Prompt (Kurzfassung) | Einsatz | Credits |
|---|---|---|---|---|
| 01 | `01-hallenbad-lichtlinie` | leeres Hallenbad, blaue Stunde, Cyan-Lichtlinie auf dem Wasser, Rundbogenfenster | Hero (LCP) + Poster | 2,75 |
| 02 | `02-caustics-fliesen` | Lichtbrechung (Caustics) auf hellen Beckenfliesen, Aufsicht | Register 04, Wasser-Inset | 2,75 |
| 03 | `03-haende-knie` | Therapeutenhände mobilisieren ein gebeugtes Knie, keine Gesichter | Register 01 | 2,75 |
| 04 | `04-haende-nacken` | Hände an Nacken/Schulter, Person von hinten, Gesicht abgewandt | Register 02 | 2,75 |
| 05 | `05-knie-glas` | Kniegelenk als Glasmodell mit innerem Cyan-Licht | § 04 Sport (Poster + Loop) | 2,75 |
| 06 | `06-wirbelsaeule-glas` | Wirbelsäule als Glasmodell, vertikal | Register 09 (CFT) | 2,75 |
| 07 | `07-becken-porzellan` | Beckenmodell aus Porzellan auf Leinen | Register 10, § 05, Hero Beckenboden | 2,75 |
| 08 | `08-bewegungsbahn` | Chronofotografie: Cyan-Lichtspuren einer Bewegungsbahn über Messraster (**Retake**) | Register 06, § 04 Band | 2,75 |
| 09 | `09-behandlungsraum` | leerer, ruhiger Behandlungsraum mit Rundbogenfenster | Register 03/05, § 08 (als Symbolbild markiert) | 2,75 |
| 10 | `10-training-stillleben` | Kettlebell + Widerstandsband auf Eichenboden, dunkle Wand (**Retake**) | Register 07 | 2,75 |
| 11 | `11-balance-kugel` | Cyan-Glaskugel balanciert auf Stahllineal | Register 08 (Schwindel) | 2,75 |
| 12 | `12-unterwasser` | Blick von unten an die Wasseroberfläche, Lichtstrahlen | § 03 Wasser (Poster + Loop) | 2,75 |
| 13 | `13-beckenboden-haende` | ruhige Handauflage an Hüfte/unterem Rücken, bekleidet, Seitenlage, kein Kopf im Bild | § 05, Beckenboden-Unterseite | 2,75 |
| 14 | `14-goniometer` | durchsichtiges Goniometer auf Leinen, Aufsicht | § 01 Praxis | 2,75 |
| | | | **Summe Stills (16 Generierungen inkl. 2 verworfener)** | **44,00** |

### Verworfen (`img/gen/_verworfen/`, nur Vorschau-WebP im Repo)

| Datei | Grund | Credits |
|---|---|---|
| `08-bewegungsbahn-v1` | Lichtspur wirkte wie eine zufällige Kritzelform, keine lesbare Bewegungsbahn | 2,75 (in Summe enthalten) |
| `10-training-stillleben-v1` | Fenster zeigte eine Hochhaus-Skyline, die nicht nach Innsbruck aussieht und falsche Ortsbezüge weckt | 2,75 (in Summe enthalten) |

## Videos (`video/`, je MP4 H.264 + WebM VP9, ohne Ton)

| Datei | Quelle (Start = Endbild) | Bewegung | Länge | Größe MP4 / WebM | Credits |
|---|---|---|---|---|---|
| `hero-hallenbad` | Still 01 | statische Kamera, Wasser atmet, Reflexe zittern | 8 s | 404 KB / 126 KB | 14,00 |
| `loop-unterwasser` | Still 12 | Oberfläche wogt, Lichtstrahlen, Bläschen | 5 s | 844 KB / 839 KB | 8,75 |
| `loop-knie` | Still 05 | inneres Licht pulsiert, Reflexe gleiten | 5 s | 249 KB / 108 KB | 8,75 |
| `loop-caustics` | Still 02 | Caustics fließen über die Fliesen | 5 s | 995 KB / 921 KB | 8,75 |
| | | | | **Summe Videos** | **40,25** |

Keine Videogenerierung ist fehlgeschlagen oder wurde verworfen. Die Rohdateien (`video/_src/`, `img/gen/_src/`, zusammen etwa 100 MB) liegen nur lokal
und stehen in `.gitignore`.

## Einbindung

- Videos: `muted playsinline loop preload="none"`, Quellen erst per `data-src` gesetzt, wenn das Video in die Nähe des Viewports kommt
  (Hero erst nach `load`). Poster per `data-poster`, darunter liegt immer ein `<picture>` als statisches Bild.
- Bei `prefers-reduced-motion: reduce` oder `Save-Data` werden **keine** Videos geladen.
- Videos tragen keine Information. Jede Aussage steht zusätzlich im Text.
