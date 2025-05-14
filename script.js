let people = [];

// ✅ Normalisiert Umlaute und diakritische Zeichen
function normalizeFileName(str) {
    return str
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue")
        .replace(/Ä/g, "Ae").replace(/Ö/g, "Oe").replace(/Ü/g, "Ue")
        .replace(/ß/g, "ss");
}

// 📸 Liefert kombinierte Bildpfade (kein default mehr hier!)
function getPhotoPaths(row) {
    const folders = ["SPV", "DMA", "DM", "BA"];
    const firstName = row["Vorname"];
    const lastName = row["Nachname"];
    const shortCode = row["Kürzel"] || "";

    const normFirst = normalizeFileName(firstName);
    const normLast = normalizeFileName(lastName);
    const suffix = shortCode ? ` (${shortCode})` : "";

    const variants = [
        `${lastName}, ${firstName}${suffix}.jpg`,
        `${normLast}, ${normFirst}${suffix}.jpg`,
        `${lastName}, ${firstName}.jpg`,
        `${normLast}, ${normFirst}.jpg`,
        `${normLast}, ${firstName}${suffix}.jpg`,
        `${lastName}, ${normFirst}${suffix}.jpg`,
        `${normLast}, ${firstName}.jpg`,
        `${lastName}, ${normFirst}.jpg`
    ];

    const allPaths = [];
    for (const folder of folders) {
        for (const fileName of variants) {
            allPaths.push(`Fotos/${folder}/${fileName}`);
        }
    }

    return allPaths;
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

            const sheetsMapping = {
                "Supervisor": "supervisor",
                "Duty Manager Assistant": "duty manager assistant",
                "Duty Manager": "duty manager",
                "Betriebsarbeiter": "betriebsarbeiter"
            };

            people = [];

            for (const [sheetName, positionKeyword] of Object.entries(sheetsMapping)) {
                const sheet = workbook.Sheets[sheetName];
                if (!sheet) continue;

                const jsonData = XLSX.utils.sheet_to_json(sheet);

                jsonData.forEach(row => {
                    people.push({
                        personalCode: row["Personalnummer"]?.toString() || "",
                        firstName: row["Vorname"],
                        lastName: row["Nachname"],
                        shortCode: row["Kürzel"] || null,
                        position: row["Position"] || capitalizeWords(positionKeyword),
                        photoPaths: getPhotoPaths({
                            ...row,
                            Position: row["Position"] || positionKeyword
                        })
                    });
                });
            }

            searchEmployees();
        })
        .catch(error => {
            console.error("Fehler beim Laden:", error);
            alert("Die Excel-Daten konnten nicht geladen werden.");
        });
}

// Großschreibt jedes Wort
function capitalizeWords(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

// 🔐 Login
function login() {
    const input = document.getElementById("personalCodeInput");
    const enteredCode = input.value.trim().toLowerCase();

    if (!enteredCode) {
        alert("Bitte Personalnummer oder Kürzel eingeben.");
        return;
    }

    const employee = people.find(emp =>
        emp.personalCode.toLowerCase() === enteredCode ||
        (emp.shortCode && emp.shortCode.toLowerCase() === enteredCode)
    );

    if (employee) {
        sessionStorage.setItem("authenticated", "true");
        sessionStorage.setItem("loggedInUser", JSON.stringify(employee));
        document.getElementById("loginContainer").style.display = "none";
        document.getElementById("mainContainer").style.display = "block";

        const infoBox = document.getElementById("loggedInInfo");
        infoBox.textContent = `Eingeloggt als: ${employee.firstName} ${employee.lastName} ${employee.shortCode ? `(${employee.shortCode})` : `| ${employee.personalCode}`}`;
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
        emp.shortCode?.toLowerCase().includes(searchInput) ||
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

        const imgContainer = createImageWithFallback(person.photoPaths);
        const info = `
            <div class="result-info">
                <div class="name">${person.firstName} ${person.lastName}</div>
                ${person.personalCode ? `<div class="nummer">Personalnummer: ${person.personalCode}</div>` : ""}
                ${person.shortCode ? `<div class="kuerzel">Kürzel: ${person.shortCode}</div>` : ""}
                <div class="position">${person.position}</div>
            </div>
        `;

        card.appendChild(imgContainer);
        card.insertAdjacentHTML("beforeend", info);
        results.appendChild(card);
    });
}

document.getElementById("searchInput").addEventListener("input", searchEmployees);

// 🔁 Robuste Bilder-Fallback-Logik mit rotem Warnsymbol
function createImageWithFallback(paths) {
    const container = document.createElement("div");
    container.className = "image-container"; // Optionales CSS

    const img = new Image();
    img.className = "clickable-img";
    img.onclick = () => openImageModal(img.src);

    let loaded = false;
    let index = 0;

    function tryNext() {
        if (index >= paths.length) {
            if (!loaded) {
                console.warn("❌ Kein Bild gefunden.");
                const warn = document.createElement("div");
                warn.textContent = "⚠️";
                warn.title = "Kein Bild gefunden";
                warn.style.color = "red";
                warn.style.fontSize = "24px";
                warn.style.textAlign = "center";
                warn.style.paddingTop = "10px";
                container.appendChild(warn);
            }
            return;
        }

        const path = paths[index++];
        const testImg = new Image();

        testImg.onload = () => {
            if (!loaded) {
                loaded = true;
                img.src = testImg.src;
                container.appendChild(img);
                console.log("✅ Bild gefunden:", testImg.src);
            }
        };

        testImg.onerror = () => {
            console.warn("🔍 Bild nicht gefunden:", path);
            tryNext();
        };

        testImg.src = path;
    }

    tryNext();
    return container;
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

loadExcelData();
