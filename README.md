# SWP Finder

**SWP Finder** ist eine benutzerfreundliche Web-App zur schnellen Suche von Swissport-Mitarbeitenden anhand von Personalnummer, Name oder Kürzel.  
Optimiert für den Einsatz durch Supervisoren, Duty Manager und andere operative Rollen.

---

## 🔍 Funktionen

- 🔐 Login mit Personalnummer oder Kürzel
- 👁️ Live-Suche nach Vorname, Nachname, Kürzel oder Personalnummer
- 📸 Mitarbeiterkarte mit:
  - Bild (anklickbar zur Vergrößerung)
  - Vorname + Nachname
  - Personalnummer
  - Kürzel
  - Position
- 🔒 Automatische Abmeldung nach 5 Minuten Inaktivität
- 🧾 Excel-Datenimport (`Mitarbeiter.xlsx`)
- 📱 Vollständig responsive (Smartphones & Tablets unterstützt)

---

## 📁 Projektstruktur

```
📦 swp-finder/
├── index.html
├── style.css
├── script.js
├── Mitarbeiter.xlsx
├── Fotos/
│   ├── SPV/
│   ├── DM/
│   ├── DMA/
│   ├── BA/
│   └── default.JPG
├── swissport-logo.png
├── manifest.json
└── apple-touch-icon-180x180.png
```

---

## 📊 Excel-Datei: Format & Regeln

> Der Tabellenblattname muss `Sheet1` lauten.

| Vorname | Nachname | Personalnummer | Kürzel | Position |
|--------|----------|----------------|--------|----------|
| Fabio  | Berta    | 148085         | FB     | Supervisor |

---

## 🖼️ Bilder: Format & Ordnerstruktur

Dateiname: `<Nachname>, <Vorname>.jpg`  
Umlaute und Sonderzeichen bitte ersetzen: `ä → ae`, `ö → oe`, `é → e`, `ß → ss`, usw.

Beispiel:  
**Excel**: Jörg Gößmann (MJ)  
**Bildname**: `Goessmann, Joerg (MJ).jpg`  
**Pfad**: `Fotos/SPV/Goessmann, Joerg (MJ).jpg`

---

## 📁 Ordnerstruktur für Bilder

| Excel-Position enthält     | Zielordner     |
|----------------------------|----------------|
| Supervisor                 | Fotos/SPV/     |
| Duty Manager               | Fotos/DM/      |
| Duty Manager Assistant     | Fotos/DMA/     |
| Betriebsarbeiter           | Fotos/BA/      |

---

## 🧩 Wie füge ich Fotos oder Mitarbeitende auf GitHub hinzu?

### 📸 Fotos hinzufügen oder ersetzen (über GitHub Weboberfläche)

1. In den entsprechenden Ordner wechseln (`Fotos/SPV`, `Fotos/DM`, etc.)
2. Das Bild korrekt umbenennen (z. B. `Mueller, Joerg (MJ).jpg`)
3. Oben auf **"Add file"** klicken → **"Upload files"**
4. Bild auswählen und hochladen
5. Ganz unten auf den **grünen Button "Commit changes"** klicken
6. Bestätigen – fertig ✅

---

### 📄 Mitarbeiterliste (`Mitarbeiter.xlsx`) bearbeiten oder ersetzen

1. Auf die Datei `Mitarbeiter.xlsx` klicken
2. Oben rechts auf die **drei Punkte (...)** klicken → **"Delete file"**
3. Lokal die neue Excel-Datei vorbereiten (gleicher Dateiname!)
4. Zurück zum Hauptordner `swp-finder` in GitHub
5. Wieder auf **"Add file" → "Upload files"** klicken
6. Neue Datei hochladen
7. Ganz unten auf **"Commit changes"** klicken und bestätigen

✅ Damit ist die Liste aktualisiert. Beim nächsten Laden in der App sind die Änderungen aktiv.

---

## 👤 Autor & Kontakt

**Fabio Berta**  
Winterthur, Schweiz  
📧 [fabio.berta@swissport.com](mailto:fabio.berta@swissport.com)

---

## 🛠️ Lizenz

Bereitgestellt im internen Rahmen der **SWISSPORT INT. AG**. Nutzung oder Weitergabe nur mit Zustimmung.
