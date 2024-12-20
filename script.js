let people = [];

// Passwortschutz
function checkPassword() {
    const password = "swissport24";
    let userPassword = sessionStorage.getItem("authenticated");

    if (!userPassword || userPassword !== "true") {
        userPassword = prompt("Bitte geben Sie das Passwort ein, um die Web-App zu verwenden:");
        if (userPassword === password) {
            sessionStorage.setItem("authenticated", "true");
            alert("Willkommen in der SWP FINDER Web-App!");
        } else {
            alert("Falsches Passwort!");
            location.reload();
        }
    }
}

// Seite sperren
function lockApp() {
    sessionStorage.removeItem("authenticated");
    alert("Die Seite wurde gesperrt!");
    location.reload();
}

// Automatische Datenaktualisierung
function autoRefreshData(interval = 3600000) {
    setInterval(() => {
        console.log("Aktualisiere Mitarbeiterdaten...");
        loadExcelData();
    }, interval);
}

// Dark Mode
document.getElementById("darkMode").addEventListener("change", (event) => {
    document.body.classList.toggle("dark", event.target.checked);
});

// Burger-Menü
const burgerMenu = document.getElementById("burgerMenu");
const mobileNav = document.getElementById("mobileNav");

burgerMenu.addEventListener("click", () => {
    burgerMenu.classList.toggle("active");
    mobileNav.classList.toggle("hidden");
    mobileNav.classList.toggle("active");
});

// Mitarbeiterdaten laden
function loadExcelData() {
    // Hier Excel-Daten laden und parsen
    console.log("Daten geladen.");
}

// Initiale Aufrufe
checkPassword();
autoRefreshData();
