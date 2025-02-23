let people = [];

// Passwortschutz
function checkPassword() {
    const password = "swissport24";
    const userPassword = sessionStorage.getItem("authenticated");

    if (!userPassword || userPassword !== "true") {
        const inputPassword = prompt("Bitte geben Sie das Passwort ein:");
        if (inputPassword === password) {
            sessionStorage.setItem("authenticated", "true");
        } else {
            alert("Falsches Passwort!");
            location.reload();
        }
    }
}

// App sperren
function lockApp() {
    sessionStorage.removeItem("authenticated");
    alert("Die Seite wurde gesperrt!");
    location.reload();
}

// Excel-Daten laden
function loadExcelData() {
    document.getElementById("loadingSpinner").style.display = "block";

    fetch("./Mitarbeiter.xlsx")
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets["Sheet1"];
            people = XLSX.utils.sheet_to_json(sheet);
        })
        .finally(() => {
            document.getElementById("loadingSpinner").style.display = "none";
        });
}

// Suchbutton aktivieren, wenn Eingabe erfolgt
document.getElementById("searchInput").addEventListener("input", () => {
    const searchInput = document.getElementById("searchInput").value.trim();
    const searchButton = document.getElementById("searchButton");
    searchButton.disabled = searchInput === ""; // Button nur aktivieren, wenn Eingabe vorhanden
});

// Suchfunktion
function performSearch() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase().trim();
    const results = document.getElementById("results");
    results.innerHTML = "";

    if (searchInput === "") {
        return;
    }

    const filteredPeople = people.filter(person =>
        person.Personalnummer.toLowerCase().includes(searchInput) ||
        person.Vorname.toLowerCase().includes(searchInput) ||
        person.Nachname.toLowerCase().includes(searchInput) ||
        (person.Kürzel && person.Kürzel.toLowerCase().includes(searchInput))
    );

    if (filteredPeople.length === 0) {
        results.innerHTML = "<p>Keine Ergebnisse gefunden.</p>";
        return;
    }

    filteredPeople.forEach(person => {
        const card = document.createElement("div");
        card.className = "result-card";
        card.innerHTML = `
            <img src="${person.Foto}" onclick="openImagePopup('${person.Foto}')" onerror="this.src='Fotos/default.JPG';">
            <h2>${person.Vorname} ${person.Nachname}</h2>
            <p><span>Personalnummer:</span> ${person.Personalnummer}</p>
        `;
        results.appendChild(card);
    });
}
