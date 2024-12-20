// Passwortschutz
document.getElementById("loginButton").addEventListener("click", () => {
    const password = "swissport24";
    const input = document.getElementById("passwordInput").value;

    if (input === password) {
        document.getElementById("loginContainer").style.display = "none";
        document.getElementById("appContainer").style.display = "block";
    } else {
        document.getElementById("loginError").style.display = "block";
    }
});

// Dark Mode
document.getElementById("darkMode").addEventListener("change", (e) => {
    document.body.classList.toggle("dark", e.target.checked);
});

// Suche deaktiviert, bis Eingabe erfolgt
document.getElementById("searchInput").addEventListener("input", () => {
    const searchValue = document.getElementById("searchInput").value.trim();
    document.getElementById("searchButton").disabled = searchValue === "";
});

// Suche
document.getElementById("searchButton").addEventListener("click", () => {
    const searchValue = document.getElementById("searchInput").value.trim().toLowerCase();
    alert(`Suche nach: ${searchValue}`); // Beispiel für Suche
});

// Sperren
document.getElementById("lockButton").addEventListener("click", () => {
    document.getElementById("appContainer").style.display = "none";
    document.getElementById("loginContainer").style.display = "block";
});
