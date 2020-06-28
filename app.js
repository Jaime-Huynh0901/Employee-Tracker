// Dependencies
const express = require("express");
const cTable = require("console.table");
const inquirer = require('inquirer');
// const connection = require('./config/connection');
const mysql = require("mysql");


// Create express app instance.
const app = express();

// Set the port of our application
// process.env.PORT lets the port be set by Heroku
const PORT = process.env.PORT || 8080;

 // MySQL DB Connection Information (remember to change this with our specific credentials)
 const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "MacBook_Pr0",
    database: "comp_employees_db",
    multipleStatements: true
});

// Initiate MySQL Connection.
connection.connect( err => {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }
    console.log("connected as id " + connection.threadId);
    startApp()
});


const employeeQuestion = [
    {
        type: 'list',
        name: 'userInput',
        message: 'What would you like to do?',
        choices: ['View All Employees','View All Employees By Department', 'View All Departments', 'View All Roles', 'Add Employee', 'Add Roles', 'Add Departments', 'Update Employee Role', 'Remove Employee', 'Remove Role','Remove Department',  ]
    }
];

const allEmployeeQuery = `SELECT e.id AS employee_id, e.first_name, e.last_name, d.dep_name AS department_name, r.title AS job_title, r.salary,
    CONCAT(f.first_name, ' ', f.last_name) AS manager_name
    FROM employee e
    LEFT JOIN roles r ON e.role_id = r.id
    LEFT JOIN department d ON d.id = r.department_id
    LEFT JOIN employee f ON e.manager_id = f.id`;


const depQuery = `SELECT dep_name FROM department`;

const startApp = async () => {
    try {
        const answer = await inquirer.prompt(employeeQuestion);
        switch (answer.userInput) {
            case "View All Employees":
                viewEmployee();
                break;
            case "View All Employees By Department":
                viewEmployeeByDep();
                break;
            case "View All Departments":
                viewDeps();
                break;
            case "View All Roles":
                viewRoles();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Add Roles":
                addRole();
                break;
            case "Add Departments":
                addDep();
                break;
            case "Update Employee Role":
                updateRole();
                break;
            case "Remove Employee":
                removeEmployee();
                break;
            case "Remove Role":
                removeRole();
                break;
            case "Remove Department":
                removeDep();
                break;
            
        }
    } catch (err) {
        console.log(err);
    }
};


const viewEmployee =  () => {
    connection.query(allEmployeeQuery, (err, res) => {
        if (err) throw err;
        console.table(" ",res);
        startApp();
    });
    
};

const viewEmployeeByDep = () => {
    connection.query (depQuery, (err, results) => {
        if (err) throw err;

        inquirer
        .prompt([
        {
            type: 'list',
            name: 'departChoice',
            choices: () => {
                let choiceArr = results.map (choice => choice.dep_name)
                return choiceArr;
            },
            message: 'Select a Department:'
        }
        ])
        .then ( answer => {
            const query = `SELECT employee.id, employee.first_name "First Name", employee.last_name "Last Name", roles.title, roles.salary, department.dep_name "Department Name"
                FROM employee
                INNER JOIN roles ON roles.id = employee.role_id
                INNER JOIN department ON department.id = roles.department_id
                WHERE ?`;

            connection.query(query, {dep_name: answer.departChoice}, (err, res) => {
                if (err) throw err;
                    console.table(" ",res);
                    startApp();
            });
        })
    });
}

const viewRoles = () => {
    const query = `SELECT title AS "Title" FROM roles`;
    connection.query(query, (err, results) => {
        if (err) throw err;
        console.table((''), results);
        startApp();
    })

}

const viewDeps = () => {
    const query = `SELECT dep_name AS "Department" FROM department`;
    connection.query(query, (err, results) => {
        if (err) throw err;
        console.table((''), results);
        startApp();
    })

}


const addEmployee = () => {
    const roleQuery = `SELECT * from roles; SELECT CONCAT (e.first_name," ",e.last_name) AS full_name FROM employee e`;
    connection.query(roleQuery, (err, results) => {
        if (err) throw err;

        inquirer.prompt([
            {
                name: 'fName',
                type: 'input',
                message: 'What is your first name?'

            },
            {
                name: 'lName',
                type: 'input',
                message: 'What is your last name?'
            },
            {
                type: 'list',
                name: 'role',
                choices: () => {
                    let choiceArray = results[0].map(choice => choice.title);
                    return choiceArray;
                },
                message: 'Choose the role:'

            },
            {
                name: 'manager',
                type: 'list',
                choices: function () {
                    let choiceArray = results[1].map(choice => choice.full_name);
                    return choiceArray;
                },
                message: 'Choose the manager ID from the list'

            }
        ]).then( answer => {
            const query2 =`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?, ?, (SELECT id FROM roles WHERE title = ? ),(SELECT id FROM (SELECT id FROM employee WHERE CONCAT(first_name," ",last_name) = ? ) AS newTable))`;

            connection.query(query2, [answer.fName, answer.lName, answer.role, answer.manager]);
            startApp();
        })
    })
}

const addRole = () => {
    connection.query(depQuery, (err, results) => {
        if (err) throw err;

        inquirer.prompt([
            {
                name: 'newRole',
                type: 'input',
                message: 'Enter the name of the Role to add:'

            },
            {
                name: 'newSalary',
                type: 'number',
                message: 'Enter the salary of the role:',
            },
            {
                type: 'list',
                name: 'depList',
                choices: () => {
                    let choiceArray = results.map(choice => choice.dep_name);
                    return choiceArray;
                },
                message: 'Chose the Department:'

            }
        ]).then( answer => {
            const query =`INSERT INTO roles (title, salary, department_id) VALUES(?, ?, (SELECT id FROM department WHERE dep_name = ? ))`;
            connection.query(query, [answer.newRole, answer.newSalary, answer.depList]);
            startApp();
        })
    })
}

const addDep = () => {
    inquirer.prompt([
        {
            name: 'newDep',
            type: 'input',
            message: 'Enter the name of the Department to add:'
        }
    ]).then((answer) => {
        connection.query(`INSERT INTO department(dep_name) VALUES( ? )`, answer.newDep)
        startApp();
    })
}

const removeEmployee = () => {
    connection.query(allEmployeeQuery, (err, results) => {
        if (err) throw err;
        console.table(" ",results )
        inquirer.prompt([
            {
                type: 'input',
                name: 'employeeID',
                message: 'Enter Employee ID of the person to remove (see the table above):'
            }
        ]).then( answer => {

            const query =`DELETE FROM employee WHERE ?`;
            connection.query(query, {id: answer.employeeID});
            startApp();
        })
    })
}

const removeRole = () => {
    query = `SELECT * FROM roles`;
    connection.query(query, (err, results) => {
        if (err) throw err;

        inquirer.prompt([
            {
                name: 'removeRole',
                type: 'list',
                choices: function () {
                    let choiceArray = results.map(choice => choice.title);
                    return choiceArray;
                },
                message: 'Select a Role to remove:'
            }
        ]).then((answer) => {
            connection.query(`DELETE FROM roles WHERE ? `, { title: answer.removeRole });
            startApp();

        })

    })

}

const removeDep = () => {
    query = `SELECT * FROM department`;
    connection.query(query, (err, results) => {
        if (err) throw err;

        inquirer.prompt([
            {
                name: 'dep',
                type: 'list',
                choices: function () {
                    let choiceArray = results.map(choice => choice.dep_name);
                    return choiceArray;
                },
                message: 'Select the department to remove:'
            }
        ]).then((answer) => {
            connection.query(`DELETE FROM department WHERE ? `, { dep_name: answer.dep })
            startApp();
        })
    })
}

const updateRole = () => {
    const query = `SELECT CONCAT (first_name," ",last_name) AS full_name FROM employee; SELECT title FROM roles`
    connection.query(query, (err, results) => {
        if (err) throw err;

        inquirer.prompt([
            {
                name: 'fullName',
                type: 'list',
                choices: function () {
                    let choiceArray = results[0].map(choice => choice.full_name);
                    return choiceArray;
                },
                message: 'Select an employee to update their role:'
            },
            {
                name: 'newRole',
                type: 'list',
                choices: function () {
                    let choiceArray = results[1].map(choice => choice.title);
                    return choiceArray;
                }
            }
        ]).then((answer) => {
            const query2 = `UPDATE employee SET role_id = (SELECT id FROM roles WHERE title = ? ) WHERE id = (SELECT id FROM(SELECT id FROM employee WHERE CONCAT(first_name," ",last_name) = ?) AS newTable)`;
           
            connection.query(query2, [answer.newRole, answer.fullName]);
            
            startApp();
        });
    });
}

// Start our server so that it can begin listening to client requests.
app.listen(PORT, function() {
    // Log (server-side) when our server has started
    console.log(`Server listening on: http://localhost:${PORT}`);
});