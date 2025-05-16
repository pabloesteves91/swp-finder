let people = [];

function normalizeFileName(str) {
    return str
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue")
        .replace(/Ä/g, "Ae").replace(/Ö/g, "Oe").replace(/Ü/g, "Ue")
        .replace(/ß/g, "ss");
}

function getPhotoPaths(row) {
    const position = row["Position"]?.toLowerCase() || "";
    const firstName = row["Vorname"];
    const lastName = row["Nachname"];
    const shortCode = row["Kürzel"] || "";

    const normFirst = normalizeFileName(firstName);
    const normLast = normalizeFileName(lastName);
    const suffix = shortCode ? ` (${shortCode})` : "";

    let folder = "";
    if (position.includes("supervisor")) folder = "SPV";
    else if (position.includes("duty manager assistant")) folder = "DMA";
    else if (position.includes("duty manager")) folder = "DM";
    else if (position.includes("betriebsarbeiter")) folder = "BA";
    else return ["https://pabloesteves91.github.io/swp-finder/Fotos/default.JPG"];

    const base = `https://pabloesteves91.github.io/swp-finder/Fotos/${folder}`;

    return [
        `${base}/${lastName}, ${firstName}${suffix}.jpg`,
        `${base}/${normLast}, ${normFirst}${suffix}.jpg`,
        `${base}/${lastName}, ${firstName}.jpg`,
        `${base}/${normLast}, ${normFirst}.jpg`,
        `${base}/${normLast}, ${firstName}${suffix}.jpg`,
        `${base}/${lastName}, ${normFirst}${suffix}.jpg`,
        `${base}/${normLast}, ${firstName}.jpg`,
        `${base}/${lastName}, ${normFirst}.jpg`,
        "https://pabloesteves91.github.io/swp-finder/Fotos/default.JPG"
    ];
}

function loadJsonData() {
    fetch('./mitarbeiter.json')
        .then(response => {
            if (!response.ok) throw new Error("JSON konnte nicht geladen werden.");
            return response.json();
        })
        .then(data => {
            people = data.map(row => ({
                personalCode: row["Personalnummer"]?.toString() || "",
                firstName: row["Vorname"],
                lastName: row["Nachname"],
                shortCode: row["Kürzel"] || null,
                position: row["Position"],
                photoPaths: getPhotoPaths(row)
            }));

            searchEmployees();
        })
        .catch(error => {
            console.error("Fehler beim Laden der JSON:", error);
            alert("Daten konnten nicht geladen werden.");
        });
}

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

document.getElementById("searchInput").addEventListener("input", searchEmployees);

// Nur JSON wird geladen:
loadJsonData();
