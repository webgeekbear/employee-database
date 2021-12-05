const db = require("./db/connection");

function viewAllDepartments() {
    const sql = `select * from department`;
    db.query(sql, (err, rows) => {
        console.log(cTable.getTable(rows));
    });
}

function viewAllRoles() {
    const sql = `select role.id, title, salary, department.name from role
      left join department on department_id = department.id`;

    db.query(sql, (err, rows) => {
        console.log(cTable.getTable(rows));
    });
}

function viewAllEmployees() {
    const sql = `SELECT E1.id, E1.first_name AS emp_first_name,
        E1.last_name AS emp_last_name, department.name, role.title,
        role.salary, E2.first_name AS mgr_first_name,
        E2.last_name AS mgr_last_name
        FROM employee E1
        LEFT JOIN role ON E1.role_id = role.id
        LEFT JOIN employee E2 ON E1.manager_id = E2.id
        LEFT JOIN department ON role.department_id = department.id`
}

module.exports = { viewAllDepartments, viewAllRoles };