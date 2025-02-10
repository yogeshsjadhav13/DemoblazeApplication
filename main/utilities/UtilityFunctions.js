const ExcelJS = require('exceljs');

class UtilityFunctions {



    constructor(TestCaseName) {
        this.TestCaseName = TestCaseName;
    }


    async fetchEnvironmentCreds() {
        var secretsData = new Map();
        if (process.env.ENVIRONMENT) {
            secretsData.set("environment", process.env.ENVIRONMENT);
            secretsData.set("environmentURL", process.env.ENVIRONMENTURL);
            secretsData.set("username", process.env.USERNAME);
            secretsData.set("password", process.env.PASSWORD);
            secretsData.set("baseURL", process.env.BASEURL);
            secretsData.set("apiusername", process.env.APIUSERNAME);
            secretsData.set("apipassword", process.env.APIPASSWORD);
        } else {
            try {
                const environmentParameters = require('../../resources-credentials/environmentParameters.json');
                const environment = environmentParameters.environment;
                const credentials = require('../../resources-credentials/credentials' + environment + '.json');
                secretsData.set("environment", environment);
                secretsData.set("environmentURL", credentials.environmentURL);
                secretsData.set("username", credentials.username);
                secretsData.set("password", credentials.password);
                secretsData.set("baseURL", credentials.baseURL);
                secretsData.set("apiusername", credentials.apiusername);
                secretsData.set("apipassword", credentials.apipassword);
            } catch (error) {
                console.error('Failed to load credentials:', error);
                process.exit(1);
            }
        }
        return secretsData;
    }


    async ReadDataFromExcel() {
        const secretsData = await this.fetchEnvironmentCreds();
        var TestDataPath = "./resources/TestDataSheet_";
        var Sheet;
        switch (secretsData.get("environment")) {
            case "TrainingEnvironment":
                TestDataPath = TestDataPath + "TrainingEnvironment.xlsx";
                break;
            case "UATEnvironment":
                TestDataPath = TestDataPath + "UATEnvironment.xlsx";
                break;
            case "ST1Environment":
                TestDataPath = TestDataPath + "ST1Environment.xlsx";
                break;
            case "ST2Environment":
                TestDataPath = TestDataPath + "ST2Environment.xlsx";
                break;
            case "DEV1Environment":
                TestDataPath = TestDataPath + "DEV1Environment.xlsx";
                break;
            case "DEV2Environment":
                TestDataPath = TestDataPath + "DEV2Environment.xlsx";
                break;
        }
        if (this.TestCaseName === "Global") {
            Sheet = 'Global';
        }
        const testName = this.TestCaseName;
        if (testName.includes('Demoblaze')) {
            Sheet = 'Demoblaze';
        }
        const workbook = new ExcelJS.Workbook();
        try {
            await workbook.xlsx.readFile(TestDataPath);
            const worksheet = workbook.getWorksheet(Sheet);
            const headerRow = worksheet.getRow(1);
            const headers = [];
            headerRow.eachCell({ includeEmpty: true }, (cell) => {
                headers.push(cell.value);
            });
            const testData = new Map();
            worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
                const currentTestCase = row.getCell(1).value; // Assuming test case name is in the first column (column A)
                if (currentTestCase === testName) {
                    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                        testData.set(headers[colNumber - 1], cell.value);
                    });
                }
            });
            return testData;
        } catch (error) {
            console.error('Error reading Excel file:', error);
            throw error;
        }
    }


    async WriteDataToExcel(columnName, dataToWrite) {
        const secretsData = await this.fetchEnvironmentCreds();
        var TestDataPath = "./resources/TestDataSheet_";
        var Sheet;
        switch (secretsData.get("environment")) {
            case "TrainingEnvironment":
                TestDataPath = TestDataPath + "TrainingEnvironment.xlsx";
                break;
            case "UATEnvironment":
                TestDataPath = TestDataPath + "UATEnvironment.xlsx";
                break;
            case "ST1Environment":
                TestDataPath = TestDataPath + "ST1Environment.xlsx";
                break;
            case "ST2Environment":
                TestDataPath = TestDataPath + "ST2Environment.xlsx";
                break;
            case "DEV1Environment":
                TestDataPath = TestDataPath + "DEV1Environment.xlsx";
                break;
            case "DEV2Environment":
                TestDataPath = TestDataPath + "DEV2Environment.xlsx";
                break;
        }
        if (this.TestCaseName === "Global") {
            Sheet = 'Global';
        }
        const testName = this.TestCaseName;
        if (testName.includes('Demoblaze')) {
            Sheet = 'Demoblaze';
        }
        var testCaseName = this.TestCaseName;
        var columnName = columnName;
        var workbook = new ExcelJS.Workbook();
        // Load an existing workbook or create a new one
        await workbook.xlsx.readFile(TestDataPath);
        // Assuming you have only one sheet; you can modify this based on your needs
        var worksheet = workbook.getWorksheet(Sheet);
        // Find the column index based on the column name
        var columnIndex = worksheet.getRow(1).values.indexOf(columnName);
        // Iterate through rows to find the row index based on the test case name
        let rowIndex = null;
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (row.getCell(1).value === testCaseName) {
                rowIndex = rowNumber;
            }
        });
        if (rowIndex && columnIndex) {
            // Write data to the specified cell
            worksheet.getCell(rowIndex, columnIndex).value = dataToWrite;
            // Save the changes to the workbook
            await workbook.xlsx.writeFile(TestDataPath);
            //console.log(`Data "${dataToWrite}" written to cell ${columnName}`);
        } else {
            console.log(`Test case "${testCaseName}" or column "${columnName}" not found`);
        }

    }


    async generateRandomString() {
        const randomHex = () => Math.floor(Math.random() * 16).toString(16);
        const uuid =
            Array(8).fill(0).map(randomHex).join('') + '-' +
            Array(4).fill(0).map(randomHex).join('') + '-' +
            Array(4).fill(0).map(randomHex).join('') + '-' +
            Array(4).fill(0).map(randomHex).join('') + '-' +
            Array(12).fill(0).map(randomHex).join('');
        return uuid;
    }

}
module.exports = { UtilityFunctions };