const inquirer = require('inquirer');


const employeeQuestion = [
    {
        type: 'list',
        name: 'userInput',
        message: 'What would you like to do?',
        choices: ['View All Employees','View All Employees By Department', 'View All Employees By Manager', 'Add Employee', 'Remove Employee', 'Update Employee Role', 'Update Employee Manager', 'View All Roles']
    }
];



function getData () {
    inquirer
        .prompt(employeeQuestion)
        .then ( answer => {
            switch (answer.userInput) {
                case "View All Employees":
                    viewEmployee();
                    break;
                case "View All Employees By Department":
                    viewEmployee();
                    break;
                case "View All Employees By Manager":
                    viewEmployee();
                    break;
                case "View All Roles":
                    viewRoles();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Remove Employee":
                    removeEmployee();
                    break;
                case "Update Employee Role":
                    updateEmployeeRole();
                    break;
                case "Update Employee Manager":
                    updateEmployeeManager();
                    break;
            }
        });
};

function viewEmployee () {
    const query = `SELECT employee.id, employee.first_name, employee.last_name, roles.title, roles.salary, department.dep_name 
    FROM employee
    INNER JOIN roles ON roles.id = employee.role_id
    INNER JOIN department ON department.id = roles.department_id
    ORDER BY employee.last_name ASC`;

    connection.query(query, (err, res) => {
        if (err) throw err;
        cTable(res);
    });
};

module.exports.startApp = startApp ;


