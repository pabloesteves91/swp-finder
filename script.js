let people = []; // Daten aus der JSON-Datei werden hier gespeichert

// Passwortschutz
function checkPassword() {
    const password = "swissport24";
    let userPassword = sessionStorage.getItem("authenticated");

    if (!userPassword || userPassword !== "true") {
        userPassword = prompt("Bitte geben Sie das Passwort ein, um die Web-App zu verwenden:");
        if (userPassword === password) {
            sessionStorage.setItem("authenticated", "true");
            alert("Willkommen in der SWP FINDER Web-App!");
        } else {
            alert("Falsches Passwort!");
            location.reload();
        }
    }
}

// Seite sperren
function lockApp() {
    sessionStorage.removeItem("authenticated");
    alert("Die App wurde gesperrt. Zurück zur Anmeldung!");
    location.reload();
}

// JSON-Daten laden
function loadJSONData() {
    const jsonFilePath = "./Mitarbeiter.json";
    const spinner = document.getElementById("loadingSpinner");

    spinner.style.display = "block"; // Spinner anzeigen

    return fetch(jsonFilePath)
        .then(response => {
            if (!response.ok) {
                throw new Error("Die JSON-Datei konnte nicht geladen werden.");
            }
            return response.json();
        })
        .then(data => {
            people = data;
            console.log("JSON-Daten erfolgreich geladen:", people);
        })
        .catch(error => {
            console.error("Fehler beim Laden der JSON-Datei:", error);
            alert("Die JSON-Daten konnten nicht geladen werden.");
        })
        .finally(() => {
            spinner.style.display = "none"; // Spinner ausblenden
        });
}

// Such-Button-Event
document.getElementById("searchButton").addEventListener("click", async () => {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const filter = document.getElementById("filter").value;
    const results = document.getElementById("results");
    results.innerHTML = ""; // Alte Ergebnisse löschen

    // Daten asynchron laden, wenn noch nicht geschehen
    if (people.length === 0) {
        await loadJSONData();
    }

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

// Sperr-Button
document.getElementById("lockButton").addEventListener("click", lockApp);

// Passwortprüfung initialisieren
checkPassword();
