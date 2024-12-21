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

// Admin-Panel Passwortschutz
function showAdminPanel() {
    const adminPassword = "swissportadmin";
    const inputPassword = prompt("Bitte Admin-Passwort eingeben:");
    if (inputPassword === adminPassword) {
        document.getElementById("adminPanel").style.display = "block";
    } else {
        alert("Falsches Passwort!");
    }
}

// Mitarbeiter hinzufügen
document.getElementById("addEmployeeForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const newEmployee = {
        personalCode: document.getElementById("personalCode").value,
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        shortCode: document.getElementById("shortCode").value || null,
        position: document.getElementById("position").value,
        photo: `Fotos/${document.getElementById("firstName").value}_${document.getElementById("lastName").value}.jpg`
    };

    people.push(newEmployee);
    alert("Mitarbeiter erfolgreich hinzugefügt!");
    document.getElementById("addEmployeeForm").reset();
});

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

// Vorschläge anzeigen
function updateSuggestions(input) {
    const suggestions = document.getElementById("suggestions");
    suggestions.innerHTML = "";

    if (!input) return;

    const matches = people.filter(person =>
        person.Personalnummer.toLowerCase().includes(input) ||
        person.Kürzel?.toLowerCase().includes(input) ||
        person.Vorname.toLowerCase().includes(input) ||
        person.Nachname.toLowerCase().includes(input)
    );

    matches.slice(0, 10).forEach(person => {
        const li = document.createElement("li");
        li.textContent = `${person.Vorname} ${person.Nachname} (${person.Personalnummer})`;
        li.addEventListener("click", () => {
            document.getElementById("searchInput").value = person.Personalnummer;
            suggestions.innerHTML = "";
        });
        suggestions.appendChild(li);
    });
}

// Event für Vorschläge
document.getElementById("searchInput").addEventListener("input", (e) => {
    updateSuggestions(e.target.value.toLowerCase().trim());
});

// Initialisierung
checkPassword();
loadExcelData();
