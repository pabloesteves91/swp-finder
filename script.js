let people = []; // Daten aus der Excel-Datei werden hier gespeichert

// Excel-Daten laden
function loadExcelData() {
    fetch("./Mitarbeiter.xlsx")
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            people = jsonData.map(row => ({
                personalCode: row["Personalnummer"].toString(),
                firstName: row["Vorname"],
                lastName: row["Nachname"],
                shortCode: row["Kürzel"] || null,
                position: row["Position"],
                photo: `Fotos/${row["Vorname"]}_${row["Nachname"]}.jpg`
            }));

            searchEmployees();
        })
        .catch(error => alert("Die Excel-Daten konnten nicht geladen werden."));
}

// Login-Funktion mit Personalnummer als Passwort
function login() {
    const enteredCode = document.getElementById("personalCodeInput").value;
    const employee = people.find(emp => emp.personalCode === enteredCode);

    if (employee) {
        sessionStorage.setItem("authenticated", "true");
        document.getElementById("loginContainer").style.display = "none";
        document.getElementById("mainContainer").style.display = "block";
        document.getElementById("loggedInUser").innerText = `Eingeloggt als: ${employee.firstName} ${employee.lastName} | ${employee.personalCode}`;
        searchEmployees();
    } else {
        document.getElementById("errorMessage").style.display = "block";
        setTimeout(() => document.getElementById("errorMessage").style.display = "none", 3000);
    }
}

// Automatische Mitarbeitersuche
function searchEmployees() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const results = document.getElementById("results");
    results.innerHTML = "";

    people.filter(emp => emp.firstName.toLowerCase().includes(searchInput) || emp.lastName.toLowerCase().includes(searchInput))
          .forEach(person => {
              results.innerHTML += `
                <div class="result-card">
                    <img src="${person.photo}" alt="${person.firstName}" onerror="this.src='Fotos/default.JPG';">
                    <div>
                        <h2>${person.firstName} ${person.lastName}</h2>
                        <p>Personalnummer: ${person.personalCode}</p>
                        <p>Position: ${person.position}</p>
                    </div>
                </div>`;
          });
}

document.getElementById("searchInput").addEventListener("input", searchEmployees);
document.getElementById("loginButton").addEventListener("click", login);
document.getElementById("lockButton").addEventListener("click", () => location.reload());

loadExcelData();
