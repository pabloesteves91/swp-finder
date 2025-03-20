let people = []; // Daten aus der Excel-Datei werden hier gespeichert

// Excel-Daten laden
function loadExcelData() {
    fetch("Mitarbeiter.xlsx")
        .then(response => response.blob())
        .then(blob => blob.arrayBuffer())
        .then(data => {
            try {
                const workbook = XLSX.read(data, { type: "array" });
                console.log("Workbook Sheets:", workbook.SheetNames);

                if (workbook.SheetNames.length === 0) {
                    alert("Fehler: Keine Tabellenblätter in der Excel-Datei gefunden.");
                    return;
                }

                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(sheet);

                people = jsonData.map(row => ({
                    personalCode: row["Personalnummer"] ? row["Personalnummer"].toString() : null,
                    firstName: row["Vorname"] || "",
                    lastName: row["Nachname"] || "",
                    shortCode: row["Kürzel"] || null,
                    position: row["Position"] || "",
                    photo: `Fotos/${row["Vorname"]}_${row["Nachname"]}.jpg`
                })).filter(emp => emp.personalCode !== null);

                console.log("Excel-Daten erfolgreich geladen:", people);
            } catch (error) {
                console.error("Fehler beim Verarbeiten der Excel-Datei:", error);
                alert("Die Excel-Daten konnten nicht verarbeitet werden.");
            }
        })
        .catch(error => {
            console.error("Fehler beim Laden der Excel-Datei:", error);
            alert("Die Excel-Datei konnte nicht geladen werden.");
        });
}

// Login-Funktion mit Personalnummer als Passwort
function login() {
    const enteredCode = document.getElementById("personalCodeInput").value;
    const employee = people.find(emp => emp.personalCode === enteredCode);

    if (employee) {
        sessionStorage.setItem("authenticated", "true");
        sessionStorage.setItem("loggedInUser", JSON.stringify(employee));
        document.getElementById("loginContainer").style.display = "none";
        document.getElementById("mainContainer").style.display = "block";
    } else {
        document.getElementById("errorMessage").style.display = "block";
        setTimeout(() => document.getElementById("errorMessage").style.display = "none", 3000);
    }
}

document.getElementById("loginButton").addEventListener("click", login);

document.getElementById("personalCodeInput").addEventListener("keypress", function (event) {
    if (event.key === "Enter") login();
});

// Logout-Funktion
function logout() {
    sessionStorage.removeItem("authenticated");
    sessionStorage.removeItem("loggedInUser");
    location.reload();
}
document.getElementById("lockButton").addEventListener("click", logout);

// Initialisiere Excel-Daten beim Start
loadExcelData();
