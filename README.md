# Mini Mozart – Solfège-Lernspiel

**Ein vollständiges statisches Webspiel für GitHub Pages.** Kein Backend, kein Build, keine Registrierung, keine API-Schlüssel und keine kostenpflichtigen Dienste.

## Funktionen

- **Basic:** reine Prime, kleine/grosse Sekunde, kleine/grosse Terz, reine Quarte, reine Quinte.
- **Advanced:** zusätzlich kleine/grosse Sexte und kleine/grosse Septime.
- **Profi:** zusätzlich Tritonus als übermässige Quarte und verminderte Quinte, übermässige Sekunde, übermässige Terz, verminderte Quarte und übermässige Quinte.
- **Erkennen:** Zweiton-Hörbeispiel mit schriftlicher Antwort oder Notenbild mit schriftlicher Antwort. Abkürzungen `k2`, `g3`, `r5`, `ü4`, `v5` sind erlaubt.
- **Singen:** Zwei notierte Töne, Startton-Vorgabe, optionale Intervall-Vorgabe und Live-Mikrofonanalyse. Die Töne müssen in der richtigen Oktave kurz gehalten werden (etwa ±50 Cent Toleranz; 350 ms stabil).
- Aufwärts, abwärts und gemischt; jeweils 10 Aufgaben, Ergebnisauswertung und lokaler Bestwert.
- Mobil-/Tablet-Ansicht, Notenbild mit Vorzeichen und deutsche Notennamen (H/B).

## Bereitstellen über GitHub Pages

1. Auf [github.com/new](https://github.com/new) ein **öffentliches** Repository mit dem Namen `mini-mozart` erstellen.
2. Im Repository **Add file → Upload files** wählen und die drei Dateien `index.html`, `style.css`, `app.js` (und optional diese `README.md`) aus dem ZIP **direkt ins Hauptverzeichnis** hochladen. Nicht das ZIP als einzige Datei hochladen.
3. **Commit changes** wählen.
4. Unter **Settings → Pages → Build and deployment** als Source **Deploy from a branch** auswählen, als Branch `main` und Verzeichnis `/ (root)` einstellen. Speichern.
5. Die Webseite unter `https://BENUTZERNAME.github.io/mini-mozart/` öffnen (den Benutzernamen ersetzen). GitHub kann für die Erstveröffentlichung kurz brauchen.

## Mikrofon und Datenschutz

Das Mikrofon benötigt eine HTTPS-Verbindung, z. B. GitHub Pages, sowie die ausdrückliche Browserfreigabe. Die Audiodaten werden lokal im Browser über Web Audio ausgewertet; es werden keine Audioaufnahmen erstellt, übertragen oder gespeichert. Nur Bestserie und Zahl der richtigen Antworten werden lokal in `localStorage` gespeichert. Für eine präzisere Erkennung Hintergrundgeräusche vermeiden und ohne Lautsprecherbegleitung singen.

## Musikdidaktische Hinweise

- Eine «kleine» oder «grosse» Quarte gibt es in der traditionellen Intervalllehre nicht. Die Quarte ist **rein**, **vermindert** oder **übermässig**.
- **Enharmonische Verwechslung:** In gleichstufiger Stimmung sind etwa übermässige Quarte und verminderte Quinte akustisch identisch. Im Hörmodus werden daher in der App alle gleich klingenden, korrekt benannten Intervalle als richtig gewertet. Nur die notenbasierte Aufgabe verlangt die genaue Schreibweise.
- Die Tonhöhenerkennung basiert auf Autokorrelation. Sie kann bei sehr leiser Stimme, Vibrato, viel Hall, unklarer Grundfrequenz oder starkem Umgebungslärm scheitern; sie ersetzt kein fachliches Gesangsfeedback.

## Dateien

- `index.html` – Struktur, UI, barrierearme Beschriftungen
- `style.css` – Responsives Erscheinungsbild
- `app.js` – Lernlogik, Musiknotation, Web-Audio-Klänge und Mikrofonauswertung

Keine Abhängigkeit von externen JS-Bibliotheken. Schriftarten laden optional von Google Fonts; bei blockierter Verbindung werden lokale Systemfonts verwendet.