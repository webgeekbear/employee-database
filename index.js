const {
    mainMenu,
    promptDepartment
} = require("./promptUser");
const mysql = require("mysql2/promise");
const cTable = require("console.table");
const inquirer = require("inquirer");

let db;

async function createConnection() {
    db = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'employees',
        password: "mySqlPassw0rd",
    });
}

createConnection();

/**
 * 
 * @param { string } str String to test
 * @returns true if a number, false if not
 * 
 * Determine if the string passed in is a valid number
 * From https://stackoverflow.com/questions/175739/
 */
function isNumeric(str) {
    if (typeof str != "string") {
        str = "" + str; // we only process strings!
    }

    return (
        !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) && // ...and ensure strings of whitespace fail
        parseFloat(str) // ...and ensure the number isn't zero
    );
}

async function addRole() {
    const sql = `SELECT id, name FROM department`;
    let [rows, fields] = await db.execute(sql);

    let departmentArray = [];
    for (let i = 0; i < rows.length; i++) {
        departmentArray.push(rows[i].name);
    }

    const rolePrompts = [{
        type: "input",
        name: "title",
        message: "Enter the title",
        validate: inputTitle => {
            if (inputTitle.trim()) {
                return true;
            }
            console.log("Title cannot be blank");
            return false;
        }
    },
    {
        type: "input",
        name: "salary",
        message: "Enter the salary",
        validate: inputSalary => {
            if (isNumeric(inputSalary)) {
                return true;
            }
            console.log(" Salary must be a non-zero number");
            return false;
        }
    },
    {
        type: "list",
        name: "department",
        choices: departmentArray
    }
    ];
    let data = await inquirer.prompt(rolePrompts);

    let departmentId = 0;

    for (let i = 0; i < rows.length; i++) {
        if (rows[i].name === data.department) {
            departmentId = rows[i].id;
            break;
        }
    }
    
    const sql2 = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
    const values = [data.title, data.salary, departmentId];
    let [err] = await db.execute(sql2, values);

    await viewAllRoles();
}

async function addEmployee() {
    const sql = `SELECT role.id, CONCAT(department.name, " ", title, " ", salary) AS role_text FROM role
                LEFT JOIN department ON department_id = department.id`;
    let [rows, fields] = await db.execute(sql);

    const roleRows = rows;
    let roleArray = [];

    for (let i = 0; i < roleRows.length; i++) {
        roleArray.push(roleRows[i].role_text);
    }

    const sql2 = `SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee`;
    let [rows2, fields2] = await db.execute(sql2);
    
    const employeeRows = rows2;

    let employeeArray = [];

    for (let i = 0; i < employeeRows.length; i++) {
        employeeArray.push(employeeRows[i].name);
    }
    employeeArray.push("None");

    const employeePrompts = [{
        type: "input",
        name: "firstName",
        message: "Enter the first name",
        validate: inputFirstName => {
            if (inputFirstName.trim()) {
                return true;
            }
            console.log("First name cannot be blank");
            return false;
        }
    },
    {
        type: "input",
        name: "lastName",
        message: "Enter the last name",
        validate: inputLastName => {
            if (inputLastName.trim()) {
                return true;
            }
            console.log("Last name cannot be blank");
            return false;
        }
    },
    {
        type: "list",
        message: "Select a role for the employee",
        name: "role",
        choices: roleArray
    },
    {
        type: "list",
        message: "Select a manager for the employee",
        name: "manager",
        choices: employeeArray
    }
    ];
    let data = await inquirer.prompt(employeePrompts);

    let roleId = null;

    for (let i = 0; i < roleRows.length; i++) {
        if (roleRows[i].role_text === data.role) {
            roleId = roleRows[i].id;
            break;
        }
    }

    let managerId = null;
    for (let i = 0; i < employeeRows.length; i++) {
        if (employeeRows[i].name === data.manager) {
            managerId = employeeRows[i].id;
            break;
        }
    }

    const sql3 = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
    const values = [ data.firstName, data.lastName, roleId, managerId ];
    let [err] = await db.execute(sql3, values);

    await viewAllEmployees();
}

async function viewAllDepartments() {
    const sql = `SELECT * FROM department`;

    let [rows, fields] = await db.execute(sql);
    console.log(cTable.getTable(rows));
}

async function viewAllRoles() {
    const sql = `SELECT role.id, title, salary, department.name AS department_name FROM role
      LEFT JOIN department ON department_id = department.id`;

    let [rows, fields] = await db.execute(sql);
    console.log(cTable.getTable(rows));
}

async function viewAllEmployees() {
    const sql = `SELECT E1.id, E1.first_name AS first_name,
        E1.last_name AS last_name, department.name AS department_name, role.title,
        role.salary, CONCAT(E2.first_name, ' ', E2.last_name) AS manager
        FROM employee E1
        LEFT JOIN role ON E1.role_id = role.id
        LEFT JOIN employee E2 ON E1.manager_id = E2.id
        LEFT JOIN department ON role.department_id = department.id`

    let [rows, fields] = await db.execute(sql);
    console.log(cTable.getTable(rows));
}

async function addDepartment() {
    let department = await promptDepartment();

    const sql = `INSERT INTO department (name) VALUES (?)`;
    let [err] = await db.execute(sql, department);

    await viewAllDepartments();
}

async function main() {
    var choice = await mainMenu();
    switch (choice) {
        case "View all departments":
            await viewAllDepartments();
            main();
            break;

        case "View all roles":
            await viewAllRoles();
            main();
            break;

        case "View all employees":
            await viewAllEmployees();
            main();
            break;

        case "Add a department":
            await addDepartment();
            main();
            break;

        case "Add a role":
            await addRole();
            main();
            break;

        case "Add an employee":
            await addEmployee();
            main();
            break;
        
        case "Done":
            process.exit();

        default:
            main();
            break;
    }
}

main();