const mysql = require('mysql2');

// let db;

// async function createConnection() {
const    db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'employees',
        password: "mySqlPassw0rd",
});
db.connect(function (err) {
    if (err) {
        throw err;
        }
    })
// }

// createConnection();

module.exports = db;