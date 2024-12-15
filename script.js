let people = []; // Daten aus der Excel-Datei werden hier gespeichert

// Passwortschutz
function checkPassword() {
    const password = "swissport24";
    let userPassword = sessionStorage.getItem("authenticated");

    // Passwort prüfen, wenn nicht bereits authentifiziert
    if (!userPassword || userPassword !== "true") {
        userPassword = prompt("Bitte geben Sie das Passwort ein, um die Web-App zu verwenden:");
        if (userPassword === password) {
            sessionStorage.setItem("authenticated", "true");
            alert("Willkommen in der SWP FINDER Web-App!");
        } else {
            alert("Falsches Passwort!");
            location.reload(); // Seite neu laden bei falschem Passwort
        }
    }
}

// Seite sperren
function lockApp() {
    sessionStorage.removeItem("authenticated"); // Authentifizierung entfernen
    alert("Die Seite wurde gesperrt!");
    location.reload(); // Seite neu laden, um Passwortfenster zu aktivieren
}

// Initialisiere Passwortprüfung beim Laden
checkPassword();

// Excel-Daten automatisch laden
function loadExcelData() {
    const excelFilePath = "./Mitarbeiter.xlsx";

    fetch(excelFilePath)
        .then(response => {
            if (!response.ok) {
                throw new Error("Die Excel-Datei konnte nicht geladen werden.");
            }
            return response.arrayBuffer();
        })
        .then(data => {
            const workbook = XLSX.read(data, { type: "array" });

            // Überprüfen, ob das Tabellenblatt "Sheet1" existiert
            if (!workbook.SheetNames.includes("Sheet1")) {
                alert("Die Excel-Datei muss ein Tabellenblatt mit dem Namen 'Sheet1' enthalten.");
                return;
            }

            const sheet = workbook.Sheets["Sheet1"];
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            // Excel-Daten in die App-Datenstruktur laden
            people = jsonData.map(row => ({
                personalCode: row["Personalnummer"].toString(),
                firstName: row["Vorname"],
                lastName: row["Nachname"],
                shortCode: row["Kürzel"] || null,
                position: row["Position"],
                photo: `Fotos/${row["Vorname"]}_${row["Nachname"]}.jpg`,
                skills: Object.keys(row)
                    .filter(
                        key =>
                            row[key] === "x" &&
                            !["Personalnummer", "Vorname", "Nachname", "Kürzel", "Position", "Foto-URL"].includes(key)
                    )
            }));

            console.log("Excel-Daten erfolgreich geladen:", people);
        })
        .catch(error => {
            console.error("Fehler beim Laden der Excel-Datei:", error);
            alert("Die Excel-Daten konnten nicht geladen werden.");
        });
}

// Suchbutton aktivieren, wenn Eingabe erfolgt
document.getElementById("searchInput").addEventListener("input", () => {
    const searchInput = document.getElementById("searchInput").value.trim();
    const searchButton = document.getElementById("searchButton");
    searchButton.disabled = searchInput === ""; // Button nur aktivieren, wenn Eingabe vorhanden
});

// Such-Button-Event
document.getElementById("searchButton").addEventListener("click", () => {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const filter = document.getElementById("filter").value;
    const results = document.getElementById("results");
    results.innerHTML = ""; // Alte Ergebnisse löschen

    // Filtere Personen basierend auf Eingaben
    const filteredPeople = people.filter(person => {
        const matchesPersonalCode = person.personalCode.toLowerCase().includes(searchInput);
        const matchesShortCode = person.shortCode?.toLowerCase().includes(searchInput);
        const matchesFirstName = person.firstName.toLowerCase().includes(searchInput);
        const matchesLastName = person.lastName.toLowerCase().includes(searchInput);
        const matchesFilter =
            filter === "all" ||
            (filter === "supervisor" && person.position === "Supervisor") ||
            (filter === "arrival" && person.position === "Supervisor Arrival") ||
            (filter === "employee" && person.position === "Betriebsarbeiter") ||
            (filter === "assistant" && person.position === "Duty Manager Assistent") ||
            (filter === "manager" && person.position === "Duty Manager");

        return (matchesPersonalCode || matchesShortCode || matchesFirstName || matchesLastName) && matchesFilter;
    });

    // Zeige Ergebnisse an oder eine Meldung, falls keine gefunden werden
    if (filteredPeople.length === 0) {
        results.innerHTML = "<p>Keine Ergebnisse gefunden.</p>";
        return;
    }

    filteredPeople.forEach(person => {
        const card = document.createElement("div");
        card.className = "result-card";
        card.innerHTML = `
            <img src="${person.photo}" alt="${person.firstName}" onerror="this.src='Fotos/default.JPG';">
            <h2>${person.firstName} ${person.lastName}</h2>
            <p><span>Personalnummer:</span> ${person.personalCode}</p>
            ${person.shortCode ? `<p><span>Kürzel:</span> ${person.shortCode}</p>` : ""}
            <p><span>Position:</span> ${person.position}</p>
            <p class="skills"><span>Skills:</span> ${person.skills.join(", ")}</p>
        `;
        results.appendChild(card);
    });
});

// Sperr-Button-Event
document.getElementById("lockButton").addEventListener("click", lockApp);

// Automatisches Laden der Excel-Daten
loadExcelData();
