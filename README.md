# SWP Finder

**SWP Finder** ist eine benutzerfreundliche Web-App zur schnellen Suche von Swissport-Mitarbeitenden anhand von Personalnummer, Name oder Kürzel.  
Optimiert für den Einsatz durch Supervisoren, Duty Manager und andere operative Rollen.

---

## 🔍 Funktionen

- 🔐 Login mit Personalnummer
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

📦 swp-finder/
├── index.html
├── style.css
├── script.js
├── Mitarbeiter.xlsx
├── Fotos/
│   ├── Vorname_Nachname.jpg
│   └── default.JPG
├── swissport-logo.png
├── manifest.json
└── apple-touch-icon-180x180.png

---

## 📊 Excel-Datei: Format & Regeln

> Der Tabellenblattname muss `Sheet1` lauten.

| Vorname | Nachname | Personalnummer | Kürzel | Position |
|--------|----------|----------------|--------|----------|
| Fabio  | Berta    | 148085         | FB     | Supervisor |

⚠️ Das Mitarbeiterfoto muss als `Fotos/Vorname_Nachname.jpg` gespeichert sein.  
Falls kein Bild vorhanden ist, wird automatisch `default.JPG` angezeigt.

---

## 🚀 Nutzung

1. Alle Dateien in denselben Ordner kopieren
2. `index.html` im Browser öffnen
3. Mit deiner Personalnummer anmelden
4. Nach Mitarbeiter:innen suchen

---

## 🔧 Entwicklerhinweise

- **Excel-Import:** Wird mit [SheetJS](https://sheetjs.com/) (xlsx.js) eingelesen
- **Session-Timeout:** Anpassbar in `script.js` (`timeoutDuration`)
- **Suche:** Echtzeit, kein Button notwendig
- **Keine Backend-Anbindung:** Läuft komplett lokal im Browser

---

## 👤 Autor

**Fabio Berta**  
Winterthur, Schweiz  
📧 [fabio.berta@swissport.com](mailto:fabio.berta@swissport.com)

---

## 🛠️ Lizenz

Lizenz genutzt von SWISSPORT INT. AG
