const inquirer = require('inquirer');

const menu = [{
    type: "list",
    name: "choice",
    message: "Please select an item",
    choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
        "Done"
    ]
}];

async function mainMenu() {
    let myChoice = await inquirer.prompt(menu);
    return myChoice.choice;
}

module.exports = mainMenu;
