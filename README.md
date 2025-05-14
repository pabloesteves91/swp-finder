# SWP Finder

**Webseite:** [https://pabloesteves91.github.io/swp-finder/](https://pabloesteves91.github.io/swp-finder/)

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
├── xlsx.full.min.js
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
> Änderungen an der Datei bitte an **Fabio Berta** weitergeben.  
> **Achtung:** Änderungen werden nicht sofort sichtbar – es dauert ca. **10–15 Minuten**, bis sie in der App aktiv sind.

**Beispiel für Hans Gössmann** – so muss der Eintrag in der `Mitarbeiter.xlsx` aussehen:  

| Personalnummer | Vorname | Nachname  | Kürzel | Position   |
|----------------|---------|-----------|--------|------------|
| 123456         | Hans    | Goessmann | HGO    | Supervisor |

📌 **Wichtig:**  
- Umlaute und Sonderzeichen **müssen auch in Excel ersetzt** sein (`Gössmann` → `Goessmann`)
- Die **Position** bestimmt automatisch den Ordner, aus dem das Bild geladen wird (`Fotos/SPV/`)

✅ **Bildname:** `Goessmann, Hans.jpg`  
✅ **Pfad:** `Fotos/SPV/Goessmann, Hans.jpg`

---

## 🖼️ Bilder: Format & Ordnerstruktur

- **Dateiname:** `<Nachname>, <Vorname>.jpg`
- 🔁 **Umlaute und Sonderzeichen bitte immer ersetzen**, sowohl in `Mitarbeiter.xlsx` als auch im Bildnamen:

| Original | Umbenannt |
|----------|-----------|
| ä        | ae        |
| ö        | oe        |
| ü        | ue        |
| é, è     | e         |
| ß        | ss        |

✅ **Alle Bilder müssen die Endung `.jpg` haben.**

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

### 📸 Fotos hinzufügen oder ersetzen

1. In den passenden Ordner gehen (z. B. `Fotos/SPV`)
2. Bild korrekt benennen → z. B. `Goessmann, Hans.jpg`
3. **"Add file" → "Upload files"** klicken
4. Bild hochladen
5. Ganz unten auf **"Commit changes"** klicken
6. Fertig ✅

---

### 📄 Mitarbeiterliste (`Mitarbeiter.xlsx`) bearbeiten oder ersetzen

1. Datei `Mitarbeiter.xlsx` in GitHub öffnen
2. Oben auf die **drei Punkte (...)** → **"Delete file"**
3. Neue Datei lokal vorbereiten (gleich benennen!)
4. Zurück zum Repo `swp-finder`
5. **"Add file" → "Upload files"**
6. Neue Datei hochladen
7. **"Commit changes"** klicken und bestätigen

✅ Änderungen sind nach ca. **10–15 Minuten aktiv** (nicht sofort nach Neuladen).

---

## ⚠️ Fehlerverhalten

- Wenn ein Bild nicht gefunden wird (z. B. durch falsche Umlaute oder fehlende Datei), wird automatisch `default.JPG` angezeigt.
- Achte darauf, dass der Bildname exakt (inkl. Ersetzungen wie `ä → ae`) mit Excel-Eintrag übereinstimmt.

---

## 📌 Versionen

| Version | Datum       | Änderungen                                                  |
|---------|-------------|-------------------------------------------------------------|
| 1.0.0   | 10.11.2024  | Grundstruktur: Suche, Excel-Import, Bildanzeige             |
| 1.1.0   | 15.12.2024  | Bildzoom, Session-Timeout und mobile Optimierung            |
| 1.2.0   | 19.01.2025  | Fallback-Logik für Bilder, Default-Bild                     |
| 1.3.0   | 07.03.2025  | Erweiterte Umlaute & Kürzel-Unterstützung                   |
| 1.4.0   | 05.05.2025  | README erweitert, Formatierungen und Klarheit               |
| 1.5.0   | 15.05.2025  | Anpassung Versionsanzeige und Implementierung der neuen MA-Liste |

---

## ⚙️ Konfigurierbare Variablen

Die Inaktivitätsdauer (Session Timeout) kann im `script.js` durch **Fabio Berta** angepasst werden:

```js
const timeoutDuration = 5 * 60 * 1000; // In Millisekunden (5 Minuten)
```

---

## 👥 Rollenübersicht

| Rolle                         | Aufgabe                                           |
|-------------------------------|--------------------------------------------------|
| **IT-Support** (Fabio Berta)  | Adminrechte, Entwicklung & Support               |
| **Admin** (Max Weinmann)      | Pflege von `Mitarbeiter.xlsx` und Bildern        |

---

## 👤 Autor & Kontakt

**Fabio Berta**    
📧 [fabio.berta@swissport.com](mailto:fabio.berta@swissport.com)

---


## 🛠️ Lizenz

Bereitgestellt im internen Rahmen der **SWISSPORT INT. AG**. Nutzung oder Weitergabe nur mit Zustimmung.

---

## 🔧 Änderungsrechte

- Es darf **ausschließlich** folgende Dateien bearbeitet werden:
  - `Mitarbeiter.xlsx`
  - Fotos in den jeweiligen Ordnern (`Fotos/SPV/`, `Fotos/DM/`, etc.)
- Ein Back-up der aktuellen Version ist vorhanden (Stand: **15.05.2025**)
