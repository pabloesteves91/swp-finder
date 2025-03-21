let people = [];

function loadExcelData() {
    const excelFilePath = "./Mitarbeiter.xlsx";

    fetch(excelFilePath)
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets["Sheet1"];
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            people = jsonData.map(row => ({
                personalCode: row["Personalnummer"].toString(),
                firstName: row["Vorname"],
                lastName: row["Nachname"],
                position: row["Position"],
                photo: `Fotos/${row["Vorname"]}_${row["Nachname"]}.jpg`
            }));

            searchEmployees();
        })
        .catch(error => console.error("Fehler beim Laden der Excel-Datei:", error));
}

function login() {
    const enteredCode = document.getElementById("personalCodeInput").value;
    const employee = people.find(emp => emp.personalCode === enteredCode);

    if (employee) {
        document.getElementById("loginContainer").style.display = "none";
        document.getElementById("mainContainer").style.display = "flex";
        document.getElementById("userInfo").innerText = `Eingeloggt als: ${employee.firstName} ${employee.lastName} | ${employee.personalCode}`;
        searchEmployees();
    } else {
        document.getElementById("errorMessage").style.display = "block";
        setTimeout(() => document.getElementById("errorMessage").style.display = "none", 3000);
    }
}

document.getElementById("loginButton").addEventListener("click", login);
document.getElementById("lockButton").addEventListener("click", () => location.reload());

loadExcelData();
