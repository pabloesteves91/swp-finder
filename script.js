let people = [];

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
                photo: `Fotos/${row["Vorname"]}_${row["Nachname"]}.jpg`
            }));

            searchEmployees();
        })
        .catch(error => {
            console.error("Fehler beim Laden der Excel-Datei:", error);
            alert("Die Excel-Daten konnten nicht geladen werden.");
        });
}

function login() {
    const enteredCode = document.getElementById("personalCodeInput").value;
    const employee = people.find(emp => emp.personalCode === enteredCode);

    if (employee) {
        sessionStorage.setItem("authenticated", "true");
        sessionStorage.setItem("loggedInUser", JSON.stringify(employee));
        document.getElementById("loginContainer").style.display = "none";
        document.getElementById("mainContainer").style.display = "block";
        document.getElementById("loggedInInfo").textContent = `Eingeloggt als: ${employee.firstName} ${employee.lastName} | ${employee.personalCode}`;
        searchEmployees();
    } else {
        document.getElementById("errorMessage").style.display = "block";
        setTimeout(() => document.getElementById("errorMessage").style.display = "none", 3000);
    }
}

function logout() {
    sessionStorage.removeItem("authenticated");
    sessionStorage.removeItem("loggedInUser");
    location.reload();
}

document.getElementById("loginButton").addEventListener("click", login);
document.getElementById("personalCodeInput").addEventListener("keypress", e => {
    if (e.key === "Enter") login();
});
document.getElementById("lockButton").addEventListener("click", logout);

function searchEmployees() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const results = document.getElementById("results");
    results.innerHTML = "";

    const filteredEmployees = people.filter(emp => {
        return emp.personalCode.toLowerCase().includes(searchInput) ||
               emp.shortCode?.toLowerCase().includes(searchInput) ||
               emp.firstName.toLowerCase().includes(searchInput) ||
               emp.lastName.toLowerCase().includes(searchInput);
    });

    if (filteredEmployees.length === 0) {
        results.innerHTML = "<p>Keine Ergebnisse gefunden.</p>";
        return;
    }

    filteredEmployees.forEach(person => {
        const card = document.createElement("div");
        card.className = "result-card";
        card.innerHTML = `
            <img src="${person.photo}" alt="${person.firstName}" class="clickable-img" onerror="this.src='Fotos/default.JPG';" onclick="openImageModal('${person.photo}')">
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
