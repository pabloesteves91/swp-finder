let people = []; // Daten aus der Excel-Datei

// Passwortschutz
function checkPassword() {
    const password = "swissport24";
    const userPassword = sessionStorage.getItem("authenticated");

    if (!userPassword || userPassword !== "true") {
        const inputPassword = prompt("Bitte geben Sie das Passwort ein:");
        if (inputPassword === password) {
            sessionStorage.setItem("authenticated", "true");
            alert("Willkommen in der SWP FINDER Web-App!");
        } else {
            alert("Falsches Passwort!");
            location.reload();
        }
    }
}

// Excel-Daten laden
function loadExcelData() {
    const excelFilePath = "./Mitarbeiter.xlsx";
    const spinner = document.getElementById("loadingSpinner");

    spinner.style.display = "block";

    fetch(excelFilePath)
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets["Sheet1"];
            people = XLSX.utils.sheet_to_json(sheet);
            console.log("Excel-Daten geladen:", people);
        })
        .finally(() => {
            spinner.style.display = "none";
        });
}

// Suchbutton aktivieren, wenn Eingabe erfolgt
document.getElementById("searchInput").addEventListener("input", () => {
    const searchInput = document.getElementById("searchInput").value.trim();
    const searchButton = document.getElementById("searchButton");
    searchButton.disabled = searchInput === ""; // Button nur aktivieren, wenn Eingabe vorhanden
});

// Zurücksetzen bei Klick auf "SWP FINDER"
document.getElementById("resetButton").addEventListener("click", () => {
    const searchInput = document.getElementById("searchInput");
    const filter = document.getElementById("filter");
    const searchButton = document.getElementById("searchButton");
    const results = document.getElementById("results");

    searchInput.value = ""; // Suchfeld leeren
    filter.selectedIndex = 0; // Filter zurücksetzen
    searchButton.disabled = true; // Suchbutton deaktivieren
    results.innerHTML = ""; // Ergebnisse löschen
});

// Such-Button-Event
document.getElementById("searchButton").addEventListener("click", () => {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const filter = document.getElementById("filter").value;
    const results = document.getElementById("results");
    results.innerHTML = ""; // Alte Ergebnisse löschen

    // Filtere Personen basierend auf Eingaben
    const filteredPeople = people.filter(person => {
        const matchesPersonalCode = person.Personalnummer.toLowerCase().includes(searchInput);
        const matchesShortCode = person.Kürzel?.toLowerCase().includes(searchInput);
        const matchesFirstName = person.Vorname.toLowerCase().includes(searchInput);
        const matchesLastName = person.Nachname.toLowerCase().includes(searchInput);
        const matchesFilter =
            filter === "all" ||
            (filter === "supervisor" && person.Position === "Supervisor") ||
            (filter === "arrival" && person.Position === "Supervisor Arrival") ||
            (filter === "employee" && person.Position === "Betriebsarbeiter") ||
            (filter === "assistant" && person.Position === "Duty Manager Assistent") ||
            (filter === "manager" && person.Position === "Duty Manager");

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
            <img src="${person.Foto}" alt="${person.Vorname}" onerror="this.src='Fotos/default.JPG';">
            <h2>${person.Vorname} ${person.Nachname}</h2>
            <p><span>Personalnummer:</span> ${person.Personalnummer}</p>
            ${person.Kürzel ? `<p><span>Kürzel:</span> ${person.Kürzel}</p>` : ""}
            <p><span>Position:</span> ${person.Position}</p>
        `;
        results.appendChild(card);
    });
});

// Initialisierung
checkPassword();
loadExcelData();
