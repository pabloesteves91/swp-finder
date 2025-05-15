let people = [];

// 📥 JSON-Daten laden
function loadPeopleData() {
    fetch('./mitarbeiter.json')
        .then(r => r.json())
        .then(data => {
            people = data.map(p => {
                const vor = p.vorname.trim();
                const nach = p.nachname.trim();

                const ordner = ["SPV", "DM", "DMA", "BA"];
                const endungen = [".jpg", ".jpeg", ".JPG", ".png"];
                let paths = [];

                ordner.forEach(o => {
                    endungen.forEach(ext => {
                        paths.push(`Fotos/${o}/${nach}, ${vor}${ext}`);
                        paths.push(`Fotos/${o}/${vor}, ${nach}${ext}`);
                    });
                });

                paths.push("Fotos/default.jpg");

                return {
                    personalCode: (p.personalnummer || "").trim(),
                    shortCode: (p.kürzel || "").trim(),
                    firstName: vor,
                    lastName: nach,
                    position: p.position || "",
                    photoPaths: paths
                };
            });

            // Keine automatische Suche hier!
            // Suche erfolgt erst nach Login oder bei Sucheingabe
        })
        .catch(err => {
            console.error("JSON-Load-Fehler:", err);
            alert("Fehler beim Laden der Mitarbeiterdaten.");
        });
}

// 🔐 Login
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

        searchEmployees();  // erst hier laden
        startSessionTimer();
    } else {
        document.getElementById("errorMessage").style.display = "block";
        setTimeout(() => document.getElementById("errorMessage").style.display = "none", 3000);
    }
}

// 🔓 Logout ohne reload
function logout() {
    sessionStorage.removeItem("authenticated");
    sessionStorage.removeItem("loggedInUser");

    document.getElementById("mainContainer").style.display = "none";
    document.getElementById("loginContainer").style.display = "block";
    document.getElementById("loggedInInfo").style.display = "none";
    document.getElementById("results").innerHTML = "";
}

document.getElementById("loginButton").addEventListener("click", login);
document.getElementById("personalCodeInput").addEventListener("keypress", e => {
    if (e.key === "Enter") login();
});
document.getElementById("lockButton").addEventListener("click", logout);

// 🔍 Suche
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

    filtered.forEach((person, i) => {
        const card = document.createElement("div");
        card.className = "result-card";

        // ⏱️ Verzögere das Bildladen leicht für GitHub RateLimit
        setTimeout(() => {
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
        }, i * 100);  // Verzögerung in 100ms-Schritten
    });
}

document.getElementById("searchInput").addEventListener("input", searchEmployees);

// 🔁 Fallback-Logik mit setTimeout
function createImageWithFallback(paths) {
    const img = new Image();
    let index = 0;
    let fallbackSet = false;

    function tryNext() {
        if (index < paths.length) {
            const src = paths[index++];
            img.onerror = () => setTimeout(tryNext, 100);
            img.src = src;
        } else if (!fallbackSet) {
            fallbackSet = true;
            img.onerror = null;
            img.src = "Fotos/default.jpg";
        }
    }

    img.className = "clickable-img";
    img.onclick = () => openImageModal(img.src);
    tryNext();

    return img;
}

// ⏱️ Session-Timer (1 Minute)
let sessionTimeout;
const timeoutDuration = 60 * 1000;

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

// 🚀 Lade MA-Daten
loadPeopleData();
