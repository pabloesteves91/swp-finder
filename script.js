let people = [];

// ✅ Funktion zur Umwandlung von Umlauten im Dateinamen
function normalizeFileName(str) {
    return str
        .replace(/ä/g, "ae")
        .replace(/ö/g, "oe")
        .replace(/ü/g, "ue")
        .replace(/Ä/g, "Ae")
        .replace(/Ö/g, "Oe")
        .replace(/Ü/g, "Ue")
        .replace(/ß/g, "ss");
}

// 📸 Erzeuge Foto-Pfad basierend auf Position & Namensformat
function getPhotoPath(row) {
    const position = row["Position"]?.toLowerCase() || "";
    const firstName = row["Vorname"];
    const lastName = row["Nachname"];
    const shortCode = row["Kürzel"];
    const personalNumber = row["Personalnummer"].toString();

    let folder = "";
    let fileName = "";

    if (position.includes("supervisor")) {
        folder = "SPV";
        fileName = `${normalizeFileName(lastName)}, ${normalizeFileName(firstName)} (${shortCode || "X"}).jpg`;
    } else if (position.includes("duty manager assistant")) {
        folder = "DMA";
        fileName = `${normalizeFileName(lastName)}, ${normalizeFileName(firstName)} (${shortCode || "X"}).jpg`;
    } else if (position.includes("duty manager")) {
        folder = "DM";
        fileName = `${normalizeFileName(lastName)}, ${normalizeFileName(firstName)} (${shortCode || "X"}).jpg`;
    } else if (position.includes("betriebsarbeiter")) {
        folder = "BA";
        fileName = `${normalizeFileName(lastName)}, ${normalizeFileName(firstName)} ${personalNumber}.jpg`;
    } else {
        return "Fotos/default.jpg";
    }

    return `Fotos/${folder}/${fileName}`;
}

// 📥 Excel-Daten laden
function loadExcelData() {
    const excelFilePath = "./Mitarbeiter.xlsx";

    fetch(excelFilePath)
        .then(response => {
            if (!response.ok) throw new Error("Die Excel-Datei konnte nicht geladen werden.");
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
                photo: getPhotoPath(row)
            }));

            searchEmployees();
        })
        .catch(error => {
            console.error("Fehler beim Laden der Excel-Datei:", error);
            alert("Die Excel-Daten konnten nicht geladen werden.");
        });
}

// 🔐 Login-Funktion
function login() {
    const enteredCode = document.getElementById("personalCodeInput").value;
    const employee = people.find(emp => emp.personalCode === enteredCode);

    if (employee) {
        sessionStorage.setItem("authenticated", "true");
        sessionStorage.setItem("loggedInUser", JSON.stringify(employee));
        document.getElementById("loginContainer").style.display = "none";
        document.getElementById("mainContainer").style.display = "block";

        const infoBox = document.getElementById("loggedInInfo");
        infoBox.textContent = `Eingeloggt als: ${employee.firstName} ${employee.lastName} | ${employee.personalCode}`;
        infoBox.style.display = "block";

        searchEmployees();
        startSessionTimer();
    } else {
        document.getElementById("errorMessage").style.display = "block";
        setTimeout(() => document.getElementById("errorMessage").style.display = "none", 3000);
    }
}

// 🔓 Logout
function logout() {
    if (confirm("Willst du dich wirklich abmelden?")) {
        sessionStorage.removeItem("authenticated");
        sessionStorage.removeItem("loggedInUser");
        location.reload();
    }
}

document.getElementById("loginButton").addEventListener("click", login);
document.getElementById("personalCodeInput").addEventListener("keypress", e => {
    if (e.key === "Enter") login();
});
document.getElementById("lockButton").addEventListener("click", logout);

// 🔍 Mitarbeitersuche
function searchEmployees() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const results = document.getElementById("results");
    results.innerHTML = "";

    const filteredEmployees = people.filter(emp =>
        emp.personalCode.toLowerCase().includes(searchInput) ||
        emp.shortCode?.toLowerCase().includes(searchInput) ||
        emp.firstName.toLowerCase().includes(searchInput) ||
        emp.lastName.toLowerCase().includes(searchInput)
    );

    if (filteredEmployees.length === 0) {
        results.innerHTML = `<p>Keine Ergebnisse gefunden für "${searchInput}".</p>`;
        return;
    }

    filteredEmployees.forEach(person => {
        const card = document.createElement("div");
        card.className = "result-card";
        card.innerHTML = `
            <img src="${person.photo}" alt="${person.firstName} ${person.lastName}" class="clickable-img" onerror="this.src='Fotos/default.jpg';" onclick="openImageModal('${person.photo}')">
            <div class="result-info">
                <div class="name">${person.firstName} ${person.lastName}</div>
                <div class="nummer">Personalnummer: ${person.personalCode}</div>
                ${person.shortCode ? `<div class="kuerzel">Kürzel: ${person.shortCode}</div>` : ""}
                <div class="position">${person.position}</div>
            </div>
        `;
        results.appendChild(card);
    });
}

document.getElementById("searchInput").addEventListener("input", searchEmployees);

// 🔒 Session-Timer
let sessionTimeout;
const timeoutDuration = 5 * 60 * 1000; // 5 Minuten

function resetSessionTimer() {
    clearTimeout(sessionTimeout);
    sessionTimeout = setTimeout(() => {
        alert("Du wurdest aufgrund von Inaktivität abgemeldet.");
        logout();
    }, timeoutDuration);
}

function startSessionTimer() {
    resetSessionTimer();
    ["click", "mousemove", "keydown", "scroll", "touchstart"].forEach(event =>
        document.addEventListener(event, resetSessionTimer)
    );
}

// 🖼️ Bildanzeige Modal
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

loadExcelData();
