# SWP Finder

**SWP Finder** ist eine benutzerfreundliche Web-App zur schnellen Suche von Swissport-Mitarbeitenden anhand von Personalnummer, Name oder Kürzel.  
Optimiert für den Einsatz durch Supervisoren, Duty Manager und andere operative Rollen.

---

## 🔍 Funktionen

- 🔐 Login mit Personalnummer oder Kürzel
- 👁️ Sofortige Live-Suche nach Vorname, Nachname, Kürzel oder Personalnummer
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

⚠️ Die Excel-Spaltenüberschriften **dürfen nicht verändert** werden.  
⚠️ Die Datei muss sich im selben Verzeichnis wie `index.html` befinden.

---

## 🖼️ Bilder: Format & Ordnerstruktur

### 🔤 Bildbenennung

Die Bilder der Mitarbeitenden müssen folgendermaßen benannt werden:

```
<Nachname>, <Vorname>.jpg
```

> Achte darauf, **exakt ein Leerzeichen** nach dem Komma zu verwenden.

---

### 🧪 Beispiel

**Excel-Eintrag:**

- Vorname: `Jörg`
- Nachname: `Gößmann`
- Position: `Supervisor`

**Bildname:**  
```
Goessmann, Joerg.jpg
```

**Pfad:**  
```
Fotos/SPV/Goessmann, Joerg.jpg
```

---

### 🔤 Umlaute und Sonderzeichen ersetzen

Bitte ersetze alle Sonderzeichen im Bildnamen wie folgt:

| Zeichen | Ersetzen durch |
|---------|----------------|
| ä       | ae             |
| ö       | oe             |
| ü       | ue             |
| Ä       | Ae             |
| Ö       | Oe             |
| Ü       | Ue             |
| ß       | ss             |
| é, è    | e              |
| à, á    | a              |
| ç       | c              |
| ñ       | n              |

---

### 📁 Bildordner je nach Position

Speichere das Bild abhängig von der Position im passenden Ordner:

| Position (aus Excel) enthält | Ordnername        |
|------------------------------|-------------------|
| Supervisor                   | `Fotos/SPV`       |
| Duty Manager                 | `Fotos/DM`        |
| Duty Manager Assistant       | `Fotos/DMA`       |
| Betriebsarbeiter             | `Fotos/BA`        |

> ⚠️ Wenn kein passendes Bild vorhanden ist, wird automatisch `Fotos/default.JPG` angezeigt.

---

## 🚀 Nutzung

1. Alle Dateien (inkl. `Mitarbeiter.xlsx` & Bilder) in denselben Ordner kopieren
2. `index.html` im Browser öffnen (z. B. per Doppelklick)
3. Mit deiner Personalnummer oder deinem Kürzel anmelden
4. Nach Mitarbeitenden suchen

---

## 🔧 Entwicklerhinweise

- **Excel-Import:** via [SheetJS](https://sheetjs.com/) (`xlsx.js`)
- **Session-Timeout:** Anpassbar in `script.js` (`timeoutDuration`)
- **Vollständig clientseitig:** Kein Server, keine Datenbank
- **Datenschutz:** Läuft komplett lokal im Browser – keine Datenübertragung ins Internet

---

## 👤 Autor & Kontakt

**Fabio Berta**  
Winterthur, Schweiz  
📧 [fabio.berta@swissport.com](mailto:fabio.berta@swissport.com)

---

## 🛠️ Lizenz

Dieses Tool wird bereitgestellt im internen Rahmen der **SWISSPORT INT. AG**.  
Nutzung und Weitergabe nur mit Genehmigung.

---

## 🙏 Danke

Vielen Dank für die sorgfältige Datenpflege und die Einhaltung der Formatvorgaben!  
Nur so funktioniert das Tool zuverlässig für alle Beteiligten.
