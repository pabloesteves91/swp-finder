let people = [];

// Passwortschutz mit Speicherung in localStorage
function checkPassword() {
    const password = "swissport24";
    const savedPassword = localStorage.getItem("authenticated");

    if (savedPassword === "true") {
        return;
    }

    const inputPassword = prompt("Bitte geben Sie das Passwort ein:");
    if (inputPassword === password) {
        localStorage.setItem("authenticated", "true");
        alert("Willkommen in der SWP FINDER Web-App!");
    } else {
        alert("Falsches Passwort! Versuch es erneut.");
        checkPassword(); // Erneut aufrufen, statt die Seite neu zu laden
    }
}

// App sperren
function lockApp() {
    localStorage.removeItem("authenticated");
    alert("Die Seite wurde gesperrt!");
    location.reload();
}

// Excel-Daten laden
function loadExcelData() {
    fetch("./Mitarbeiter.xlsx")
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets["Sheet1"];
            people = XLSX.utils.sheet_to_json(sheet);
        });
}

// Suchbutton aktivieren, wenn Eingabe erfolgt
document.getElementById("searchInput").addEventListener("input", () => {
    const searchInput = document.getElementById("searchInput").value.trim();
    const searchButton = document.getElementById("searchButton");
    searchButton.disabled = searchInput === ""; // Button nur aktivieren, wenn Eingabe vorhanden
});

// Suche mit Enter-Taste
document.getElementById("searchInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        performSearch();
    }
});

// Suchfunktion (Jetzt funktionierend)
function performSearch() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase().trim();
    const results = document.getElementById("results");
    results.innerHTML = "";

    if (searchInput === "") {
        return;
    }

    const filteredPeople = people.filter(person =>
        person.Personalnummer?.toString().toLowerCase().includes(searchInput) ||
        person.Vorname?.toLowerCase().includes(searchInput) ||
        person.Nachname?.toLowerCase().includes(searchInput) ||
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
            <div>
                <h2>${person.Vorname} ${person.Nachname}</h2>
                <p><span>Personalnummer:</span> ${person.Personalnummer}</p>
            </div>
        `;
        results.appendChild(card);
    });
}

// Bild-Popup Funktionen
function openImagePopup(imageSrc) {
    document.getElementById("popupImage").src = imageSrc;
    document.getElementById("imagePopup").style.display = "flex";
}

function closeImagePopup() {
    document.getElementById("imagePopup").style.display = "none";
}
