let people = []; // Daten aus der Excel-Datei werden hier gespeichert

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

// Initialisiere Passwortprüfung beim Laden
checkPassword();

// Excel-Daten laden
function loadExcelData() {
    const excelFilePath = "./Mitarbeiter.xlsx";

    fetch(excelFilePath)
        .then(response => {
            if (!response.ok) {
                throw new Error("Die Excel-Datei konnte nicht geladen werden.");
            }
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

            console.log("Excel-Daten erfolgreich geladen:", people);
        })
        .catch(error => {
            console.error("Fehler beim Laden der Excel-Datei:", error);
            alert("Die Excel-Daten konnten nicht geladen werden.");
        });
}

// Weitere Logik bleibt gleich wie zuvor
