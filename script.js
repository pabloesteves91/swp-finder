let people = [];

// 📥 JSON-Daten laden aus mitarbeiter_neu.json (mit foto_pfade)
function loadPeopleData() {
    fetch('./mitarbeiter.json')        // <–  neue minimal-Datei
        .then(r => r.json())
        .then(data => {
            people = data.map(p => {
                const vor = p.vorname.trim();
                const nach = p.nachname.trim();

                // 4 Ordner + default automatisch bauen
                const ordner = ["SPV", "DM", "DMA", "BA"];
                const paths  = ordner.map(o => `Fotos/${o}/${nach}, ${vor}.jpg`);
                paths.push("Fotos/default.JPG");

                return {
                    personalCode: (p.personalnummer || "").trim(),
                    shortCode:   (p.kürzel        || "").trim(),
                    firstName:   vor,
                    lastName:    nach,
                    position:    p.position || "",
                    photoPaths:  paths       // 🔥  dynamisch
                };
            });

            searchEmployees();
        })
        .catch(err => {
            console.error("JSON-Load-Fehler:", err);
            alert("Mitarbeiterdaten konnten nicht geladen werden.");
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
        const pc = (emp.personalCode || "").toLowerCase();
        const sc = (emp.shortCode || "").toLowerCase();
        return enteredCode === pc || enteredCode === sc;
    });

    if (employee) {
        sessionStorage.setItem("authenticated", "true");
        sessionStorage.setItem("loggedInUser", JSON.stringify(employee));
        document.getElementById("loginContainer").style.display = "none";
        document.getElementById("mainContainer").style.display = "block";

        const infoBox = document.getElementById("loggedInInfo");
        infoBox.textContent = `Eingeloggt als: ${employee.firstName} ${employee.lastName} (${employee.shortCode || employee.personalCode})`;
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

        const img = createImageWithFallback(person.photoPaths);
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

// 🔁 Bild-Fallback-Logik
function createImageWithFallback(paths) {
    const img = new Image();
    let index = 0;

    function tryNext() {
        if (index < paths.length) {
            const src = paths[index++];
            img.onerror = tryNext;
            img.src = src;
        } else {
            // Setze fallback manuell ohne Schleife, wenn wirklich alles durch ist
            img.onerror = null;
            img.src = "Fotos/default.JPG";
        }
    }

    img.className = "clickable-img";
    img.onclick = () => openImageModal(img.src);

    tryNext();

    return img;
}

// ⏱️ Session-Timer (jetzt 20 Sekunden)
let sessionTimeout;
const timeoutDuration = 20 * 1000;

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

// 🚀 Starte die Datenabfrage
loadPeopleData();
