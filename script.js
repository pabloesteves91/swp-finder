let people = [];

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
        })
        .catch(err => {
            console.error("JSON-Load-Fehler:", err);
            alert("Fehler beim Laden der Mitarbeiterdaten.");
        });
}

function login() {
    const input = document.getElementById("personalCodeInput");
    const enteredCode = input.value.trim().toLowerCase();
    if (!enteredCode) return alert("Bitte Personalnummer oder Kürzel eingeben.");
    const employee = people.find(emp =>
        enteredCode === (emp.personalCode || "").toLowerCase() ||
        enteredCode === (emp.shortCode || "").toLowerCase()
    );
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

function logout() {
    sessionStorage.removeItem("authenticated");
    sessionStorage.removeItem("loggedInUser");
    document.getElementById("mainContainer").style.display = "none";
    document.getElementById("loginContainer").style.display = "block";
    document.getElementById("loggedInInfo").style.display = "none";
    document.getElementById("results").innerHTML = "";
}

function searchEmployees() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const results = document.getElementById("results");
    results.innerHTML = "";
    const filtered = people.filter(emp =>
        emp.personalCode.toLowerCase().includes(input) ||
        emp.shortCode.toLowerCase().includes(input) ||
        emp.firstName.toLowerCase().includes(input) ||
        emp.lastName.toLowerCase().includes(input)
    );
    if (filtered.length === 0) {
        results.innerHTML = "<p>Keine Ergebnisse gefunden.</p>";
        return;
    }
    filtered.forEach((person, i) => {
        const card = document.createElement("div");
        card.className = "result-card";
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
        }, i * 100);
    });
}

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
    modal.addEventListener("click", () => { modal.style.display = "none"; });
    document.body.appendChild(modal);
    document.getElementById("lockButton").addEventListener("click", logout);
});

loadPeopleData();
