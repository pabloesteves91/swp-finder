let employees = []; // Hier werden die Mitarbeiterdaten gespeichert

// Excel-Daten laden (angepasst aus altem Script.js)
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
            const sheet = workbook.Sheets[workbook.SheetNames[0]]; // Erstes Sheet laden
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            employees = jsonData.map(row => ({
                personalCode: row["Personalnummer"] ? row["Personalnummer"].toString() : "",
                firstName: row["Vorname"] || "",
                lastName: row["Nachname"] || "",
                shortCode: row["Kürzel"] || null,
                position: row["Position"] || "",
                photo: `Fotos/${row["Vorname"]}_${row["Nachname"]}.jpg`
            }));
            console.log("Excel-Daten erfolgreich geladen:", employees);
        })
        .catch(error => {
            console.error("Fehler beim Laden der Excel-Datei:", error);
            alert("Die Excel-Daten konnten nicht geladen werden.");
        });
}

// Login-Funktion
function login() {
    const enteredCode = document.getElementById("personalCodeInput").value;
    const employee = employees.find(emp => emp.personalCode === enteredCode);

    if (employee) {
        sessionStorage.setItem("authenticated", "true");
        sessionStorage.setItem("loggedInUser", JSON.stringify(employee));
        document.getElementById("loginContainer").style.display = "none";
        document.getElementById("mainContainer").style.display = "block";
    } else {
        document.getElementById("errorMessage").style.display = "block";
        setTimeout(() => document.getElementById("errorMessage").style.display = "none", 3000);
    }
}

document.getElementById("loginButton").addEventListener("click", login);

document.getElementById("personalCodeInput").addEventListener("keypress", function (event) {
    if (event.key === "Enter") login();
});

// Logout-Funktion
function logout() {
    sessionStorage.removeItem("authenticated");
    sessionStorage.removeItem("loggedInUser");
    location.reload();
}
document.getElementById("lockButton").addEventListener("click", logout);

// Suche und Filter
function searchEmployees() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const filter = document.getElementById("filter").value;
    const results = document.getElementById("results");
    results.innerHTML = "";

    const filteredEmployees = employees.filter(emp => {
        const matchesPersonalCode = emp.personalCode.toLowerCase().includes(searchInput);
        const matchesShortCode = emp.shortCode?.toLowerCase().includes(searchInput);
        const matchesFirstName = emp.firstName.toLowerCase().includes(searchInput);
        const matchesLastName = emp.lastName.toLowerCase().includes(searchInput);
        const matchesFilter = filter === "all" || emp.position.toLowerCase() === filter.replace("_", " ").toLowerCase();

        return (matchesPersonalCode || matchesShortCode || matchesFirstName || matchesLastName) && matchesFilter;
    });

    if (filteredEmployees.length === 0) {
        results.innerHTML = "<p>Keine Ergebnisse gefunden.</p>";
        return;
    }

    filteredEmployees.forEach(person => {
        const card = document.createElement("div");
        card.className = "result-card";
        card.innerHTML = `
            <img src="${person.photo}" alt="${person.firstName}" class="clickable-img" width="100" height="100" onerror="this.src='Fotos/default.JPG';">
            <h2>${person.firstName} ${person.lastName}</h2>
            <p><span>Personalnummer:</span> ${person.personalCode}</p>
            ${person.shortCode ? `<p><span>Kürzel:</span> ${person.shortCode}</p>` : ""}
            <p><span>Position:</span> ${person.position}</p>
        `;
        results.appendChild(card);
    });
}

document.getElementById("searchButton").addEventListener("click", searchEmployees);
document.getElementById("searchInput").addEventListener("input", () => {
    document.getElementById("searchButton").disabled = document.getElementById("searchInput").value.trim() === "";
});

// Initialisiere Daten
loadExcelData();
