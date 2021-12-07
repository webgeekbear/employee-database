const mysql = require('mysql2/promise');

async function createConnection() {
    let db = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'employees',
        password: "mySqlPassw0rd",
    });

    return db;
}

const db = createConnection();

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
    const sql = `SELECT E1.id, E1.first_name AS emp_first_name,
        E1.last_name AS emp_last_name, department.name AS department_name, role.title,
        role.salary, E2.first_name AS mgr_first_name, E2.last_name AS mgr_last_name
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

module.exports = { viewAllDepartments, viewAllRoles, viewAllEmployees, addDepartment };