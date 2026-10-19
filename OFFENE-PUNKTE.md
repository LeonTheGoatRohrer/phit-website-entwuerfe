# Offene Punkte & Platzhalter

Alle Platzhalter sind auf den Seiten sichtbar als `[PLATZHALTER: …]` bzw. `[BITTE PRÜFEN]` markiert. Folgende Angaben braucht es von der Praxis, bevor eine Variante live gehen kann.

## Inhalte (alle 5 Varianten)

- [ ] **Öffnungszeiten:** fehlen komplett, auch im JSON-LD bewusst weggelassen.
- [ ] **Barrierefreiheit / Lift:** Gibt es einen Lift in den 1. Stock? Ist der Eingang barrierefrei?
- [ ] **Rückerstattung „ca. 55 € pro Therapiestunde“:** Der Wert stammt von der alten Seite und steht überall mit `[BITTE PRÜFEN]`. Ist er aktuell, und gilt er für alle Kassen (ÖGK, BVAEB, SVS)?
- [ ] **Tarif pro Einheit:** Preise der Privattarife (sofern sie genannt werden sollen; einige Varianten haben dafür einen Platzhalter).
- [ ] **Kontaktformular-Backend:** Das Formular ist nur Frontend. Bei Absenden erscheint ein Hinweis. Ein Dienst (z. B. eigener Mailversand) muss gewählt und im Datenschutz ergänzt werden.
- [ ] **Beckenboden-Formulierungen bestätigen:** „Interne Palpation nur nach Aufklärung und mit deinem Einverständnis“ und der Ablauf „Befundgespräch → Untersuchung“ sind sinngemäß formuliert, nicht wörtlich übernommen. Bitte von Anna Gassner freigeben lassen.
- [ ] **Team-Kurzbezeichnungen:** Einige Varianten kürzen die Schwerpunkte (z. B. „Schwindel · Rücken“). Bitte gegenlesen.

## Impressum (§ 5 ECG, § 25 MedienG)

- [ ] Name der Inhaber:in / Firmenwortlaut, Rechtsform
- [ ] UID-Nummer, ggf. Firmenbuchnummer und -gericht
- [ ] Berufsbezeichnung + Verleihungsstaat, Berufsrecht (MTD-Gesetz), Eintrag im Gesundheitsberuferegister
- [ ] Aufsichtsbehörde, Berufsverband (z. B. Physio Austria, falls Mitglied)
- [ ] Medieninhaber:in / Blattlinie

## Datenschutz

- [ ] Verantwortliche:r mit Kontaktdaten
- [ ] Hosting-Anbieter (derzeit Vorschau auf GitHub Pages)
- [ ] Formular-Dienstleister, Speicherdauer
- [ ] Datum / Stand

## Bilder & Logo

- [ ] **Logo als Vektordatei:** Auf phit.cc gibt es das aktuelle Logo nur mit 148 × 77 px. Verwendet wird ein vektorisierter Nachbau (`assets/logo/phit-logo.svg`). Bitte die Original-SVG/AI/PDF der Agentur besorgen.
- [ ] **Trainingsraum-Foto:** Das einzige echte Foto des Trainingsbereichs (`Bild14.jpg`) hatte nur 717 px und wurde per KI hochskaliert. Es wird nur mittelgroß gezeigt. **Empfehlung: neues Foto-Shooting** (Trainingsbereich, Behandlungsräume, Eingang, Wasserbecken in Amras).
- [ ] **Stockfotos als Symbolbilder:** Hallenbad-Wasser, Behandlungsraum und Sportmotive sind Unsplash-Fotos und zeigen *nicht* die Praxis. Die Bildunterschriften behaupten das auch nicht. Eigene Fotos wären authentischer.
- [ ] Bildnachweise im Impressum ergänzen (Liste: `assets/img/CREDITS.md`; bei Unsplash freiwillig).
- [ ] Freigabe der Team-Porträts für die neue Seite (stammen von phit.cc).

## Technik / Vorschau

- [ ] Die Vorschau liegt öffentlich auf GitHub Pages. Für die finale Seite: Hosting, Domain `phit.cc`, HTTPS, `robots.txt` und Sitemap einrichten. Die Impressum- und Datenschutz-Seiten sind `noindex`.
- [ ] Lighthouse-Messung nach dem finalen Hosting wiederholen (Performance hängt vom Server ab).
- [ ] Variante 3 nutzt GSAP + Lenis von CDNs (cdnjs/unpkg). Vor dem Livegang lokal einbinden, damit keine Drittanbieter-Requests entstehen.
- [ ] Facebook-Link: auf der alten Seite `http://facebook.com/Phitibk`, übernommen als `https://www.facebook.com/Phitibk`. Bitte prüfen, ob die Seite noch aktiv ist.
- [ ] Die alte Seite trägt im Seitentitel „Gesundheitszentrum Dr. Gehmacher“. Das wurde bewusst **nicht** übernommen.
