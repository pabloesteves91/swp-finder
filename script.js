let people = []; // Daten aus der Excel-Datei werden hier gespeichert

// Excel-Daten laden
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
            if (!workbook.SheetNames.includes("Sheet1")) {
                alert("Die Excel-Datei muss ein Tabellenblatt mit dem Namen 'Sheet1' enthalten.");
                return;
            }
            const sheet = workbook.Sheets["Sheet1"];
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            people = jsonData.map(row => ({
                personalCode: row["Personalnummer"].toString(),
                firstName: row["Vorname"],
                lastName: row["Nachname"],
                shortCode: row["Kürzel"] || null,
                position: row["Position"],
                photo: `Fotos/${row["Vorname"]}_${row["Nachname"]}.jpg`
            }));

            console.log("Excel-Daten erfolgreich geladen:", people);
            searchEmployees(); // Lade die Mitarbeiter direkt nach dem Einlesen
        })
        .catch(error => {
            console.error("Fehler beim Laden der Excel-Datei:", error);
            alert("Die Excel-Daten konnten nicht geladen werden.");
        });
}

// Login-Funktion mit Personalnummer als Passwort
function login() {
    const enteredCode = document.getElementById("personalCodeInput").value;
    const employee = people.find(emp => emp.personalCode === enteredCode);

    if (employee) {
        sessionStorage.setItem("authenticated", "true");
        sessionStorage.setItem("loggedInUser", JSON.stringify(employee));
        document.getElementById("loginContainer").style.display = "none";
        document.getElementById("mainContainer").style.display = "block";
        searchEmployees(); // Zeige die Mitarbeiter nach dem Login
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

// Such- und Filterfunktion
function searchEmployees() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const filter = document.getElementById("filter").value;
    const results = document.getElementById("results");
    results.innerHTML = "";

    const filteredEmployees = people.filter(emp => {
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
            <img src="${person.photo}" alt="${person.firstName}" class="clickable-img" width="80" height="80" onerror="this.src='Fotos/default.JPG';">
            <div class="result-info">
                <h2>${person.firstName} ${person.lastName}</h2>
                <p><span>Personalnummer:</span> ${person.personalCode}</p>
                ${person.shortCode ? `<p><span>Kürzel:</span> ${person.shortCode}</p>` : ""}
                <p class="position">${person.position}</p>
            </div>
        `;
        results.appendChild(card);
    });
}

document.getElementById("searchButton").addEventListener("click", searchEmployees);
document.getElementById("searchInput").addEventListener("input", () => {
    document.getElementById("searchButton").disabled = document.getElementById("searchInput").value.trim() === "";
});

// Bildanzeige in Modal
function openImageModal(imageSrc) {
    let modal = document.getElementById("imageModal");
    let modalImg = document.getElementById("modalImage");
    
    modal.style.display = "flex";
    modalImg.src = imageSrc;
}

document.addEventListener("DOMContentLoaded", () => {
    let modal = document.createElement("div");
    modal.id = "imageModal";
    modal.style.display = "none";
    modal.style.position = "fixed";
    modal.style.zIndex = "1000";
    modal.style.left = "0";
    modal.style.top = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";

    let modalImg = document.createElement("img");
    modalImg.id = "modalImage";
    modalImg.style.maxWidth = "90%";
    modalImg.style.maxHeight = "90%";
    modal.appendChild(modalImg);
    
    modal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    document.body.appendChild(modal);
});

// Initialisiere Excel-Daten beim Start
loadExcelData();
