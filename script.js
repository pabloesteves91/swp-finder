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

// Suchfunktion
document.getElementById("searchButton").addEventListener("click", () => {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const results = document.getElementById("results");
    results.innerHTML = "";

    const filteredPeople = people.filter(person => person.Personalnummer.toLowerCase().includes(searchInput));

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
});

// Bild-Popup Funktionen
function openImagePopup(imageSrc) {
    document.getElementById("popupImage").src = imageSrc;
    document.getElementById("imagePopup").style.display = "flex";
}

function closeImagePopup() {
    document.getElementById("imagePopup").style.display = "none";
}

// Initialisierung
checkPassword();
loadExcelData();
