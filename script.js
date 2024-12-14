let people = []; // Daten aus der Excel-Datei werden hier gespeichert

// Event-Listener für Excel-Upload
document.getElementById("fileInput").addEventListener("change", function (event) {
    const file = event.target.files[0];

    // Überprüfen, ob der Dateiname "Mitarbeiter" ist
    if (!file.name.startsWith("Mitarbeiter")) {
        alert("Bitte laden Sie eine Datei mit dem Namen 'Mitarbeiter' hoch.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Überprüfen, ob das Tabellenblatt "Sheet1" existiert
        if (!workbook.SheetNames.includes("Sheet1")) {
            alert("Die Datei muss ein Tabellenblatt mit dem Namen 'Sheet1' enthalten.");
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
            photo: row["Foto-URL"] || "https://via.placeholder.com/100",
            // Skills sammeln: Alle Spalten mit "x", außer den Standardspalten
            skills: Object.keys(row)
                .filter(
                    key =>
                        row[key] === "x" &&
                        !["Personalnummer", "Vorname", "Nachname", "Kürzel", "Position", "Foto-URL"].includes(key)
                )
        }));

        alert("Daten erfolgreich geladen!");
    };

    reader.readAsArrayBuffer(file);
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
        const matchesFilter =
            filter === "all" ||
            (filter === "supervisor" && person.position === "Supervisor") ||
            (filter === "arrival" && person.position === "Supervisor Arrival") ||
            (filter === "employee" && person.position === "Betriebsarbeiter");

        return (matchesPersonalCode || matchesShortCode) && matchesFilter;
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
            <img src="${person.photo}" alt="${person.firstName}">
            <h2>${person.firstName} ${person.lastName}</h2>
            <p>Personalnummer: ${person.personalCode}</p>
            ${person.shortCode ? `<p>Kürzel: ${person.shortCode}</p>` : ""}
            <p>Position: ${person.position}</p>
            <p class="skills">Skills: ${person.skills.join(", ")}</p>
        `;
        results.appendChild(card);
    });
});
