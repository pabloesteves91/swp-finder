let people = [];

// 📥 JSON-Daten laden
function loadPeopleData() {
    fetch("./mitarbeiter.json")
        .then(response => {
            if (!response.ok) throw new Error("Die Mitarbeiterdaten konnten nicht geladen werden.");
            return response.json();
        })
        .then(data => {
            people = data.map(row => ({
                personalCode: row.personalnummer || "",
                firstName: row.vorname,
                lastName: row.nachname,
                shortCode: row.kuerzel || "",
                position: row.position,
                photoPath: row.bild || "Fotos/default.JPG"
            }));
            searchEmployees();
        })
        .catch(error => {
            console.error("Fehler beim Laden:", error);
            alert("Die Mitarbeiterdaten konnten nicht geladen werden.");
        });
}

// 🔐 Login (Kürzel oder Personalnummer)
function login() {
    const input = document.getElementById("personalCodeInput");
    const enteredCode = input.value.trim().toLowerCase();

    if (!enteredCode) {
        alert("Bitte Personalnummer oder Kürzel eingeben.");
        return;
    }

    const employee = people.find(emp => {
        const code = emp.personalCode?.toString().trim().toLowerCase() || "";
        const short = emp.shortCode?.toString().trim().toLowerCase() || "";
        return enteredCode === code || enteredCode === short;
    });

    if (employee) {
        sessionStorage.setItem("authenticated", "true");
        sessionStorage.setItem("loggedInUser", JSON.stringify(employee));
        document.getElementById("loginContainer").style.display = "none";
        document.getElementById("mainContainer").style.display = "block";

        const infoBox = document.getElementById("loggedInInfo");
        const shortCodeDisplay = employee.shortCode ? `(${employee.shortCode})` : "";
        infoBox.textContent = `Eingeloggt als: ${employee.firstName} ${employee.lastName} ${shortCodeDisplay}`;
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
    sessionStorage.removeItem("authenticated");
    sessionStorage.removeItem("loggedInUser");
    location.reload();
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

    const filtered = people.filter(emp =>
        emp.personalCode.toLowerCase().includes(searchInput) ||
        emp.shortCode.toLowerCase().includes(searchInput) ||
        emp.firstName.toLowerCase().includes(searchInput) ||
        emp.lastName.toLowerCase().includes(searchInput)
    );

    if (filtered.length === 0) {
        results.innerHTML = "<p>Keine Ergebnisse gefunden.</p>";
        return;
    }

    filtered.forEach(person => {
        const card = document.createElement("div");
        card.className = "result-card";

        const img = createImageWithFallback([person.photoPath]);
        const info = `
            <div class="result-info">
                <div class="name">${person.firstName} ${person.lastName}</div>
                ${person.personalCode ? `<div class="nummer">Personalnummer: ${person.personalCode}</div>` : ""}
                ${person.shortCode ? `<div class="kuerzel">Kürzel: ${person.shortCode}</div>` : ""}
                <div class="position">${person.position}</div>
            </div>
        `;

        card.appendChild(img);
        card.insertAdjacentHTML("beforeend", info);
        results.appendChild(card);
    });
}

document.getElementById("searchInput").addEventListener("input", searchEmployees);

// 🔁 Bilder-Fallback-Logik
function createImageWithFallback(paths) {
    const img = new Image();
    let index = 0;

    function tryNext() {
        if (index >= paths.length) return;
        img.src = paths[index++];
    }

    img.onerror = tryNext;
    img.className = "clickable-img";
    img.onclick = () => openImageModal(img.src);
    tryNext();

    return img;
}

// ⏱️ Session-Timer
let sessionTimeout;
const timeoutDuration = 5 * 60 * 1000;

function resetSessionTimer() {
    clearTimeout(sessionTimeout);
    sessionTimeout = setTimeout(() => {
        alert("Du wurdest automatisch ausgeloggt.");
        logout();
    }, timeoutDuration);
}

function startSessionTimer() {
    resetSessionTimer();
    ["click", "mousemove", "keydown", "scroll", "touchstart"].forEach(event =>
        document.addEventListener(event, resetSessionTimer)
    );
}

// 🖼️ Bildmodal
function openImageModal(imageSrc) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");

    modal.style.display = "flex";
    modalImg.src = imageSrc;
}

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.createElement("div");
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

    const modalImg = document.createElement("img");
    modalImg.id = "modalImage";
    modalImg.style.maxWidth = "90%";
    modalImg.style.maxHeight = "90%";
    modal.appendChild(modalImg);

    modal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    document.body.appendChild(modal);
});

// ⏳ Lade JSON-Daten beim Start
loadPeopleData();
