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

const deptPrompt = [{
    type: "input",
    name: "department",
    message: "Department name?",
    validate: dept => {
        if (dept.trim()) {
            return true;
        } else {
            console.log('You need to enter a department name!');
            return false;
        }
    }
}];

async function promptDepartment() {
    let myChoice = await inquirer.prompt(deptPrompt);
    return [ myChoice.department ];
}

module.exports = { mainMenu, promptDepartment };
