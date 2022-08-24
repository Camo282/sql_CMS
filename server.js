const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');
require('console.table');
const util = require('util');

const PORT = process.env.PORT || 3001;
const app = express();

//Express middleware
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

// Connect to database
const connection = mysql.createConnection(
    {
      host: 'localhost',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: 'Dutchman18!',
      database: 'cms'
    },
    console.log('Connected to the Employee Tracker database.')
  );

  connection.query = util.promisify(connection.query);
  
  connection.connect(err => {
    if (err) throw err;
    prompt();
});

app.get('/', (req, res) => {
    res.json({
        message: 'Hello World'
    });
});



// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
    });



function prompt() {
        inquirer
        .prompt([
            {
                type: 'list',
                name: 'cmsChoices',
                message: 'What would you like to do?',
                choices: [
                    'View All Departments',
                    'View All Roles', 
                    'View All Employees',
                    'Add Department',
                    'Add Role', 
                    'Add Employee', 
                    'Update Employee Role',       
                    'Exit'
                ]
            },  
        ])
        .then(function (choice) {
            console.info('You chose:' + choice.cmsChoices);
    
            switch (choice.cmsChoices) {
                case 'View All Departments':
                    viewDepartments();
                    break;
                case 'View All Roles':
                    viewRoles();
                    break;
                case 'View All Employees':
                    viewEmployees();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Update Employee Role':
                    updateRole();
                    break;
                case 'Exit':
                    connection.end();
                    break;
            };
        });
    };

function viewDepartments() {
   
    const sql = `SELECT * FROM department`;
    
    connection.query(sql, function (err, res) {
        if (err) throw err;
        console.table(res);
        prompt();
    });
}

function viewRoles() {
   
    const sql = `SELECT * FROM role`;
    
    connection.query(sql, function (err, res) {
        if (err) throw err;
        console.table(res);
        prompt();
    });
}
function viewEmployees() {

    const sql = `SELECT employee.*, role.title AS role_id, role.salary, department.name, CONCAT(manager.first_name, ' ' ,manager.last_name) AS manager
    FROM employee
    LEFT JOIN role
     ON employee.role_id = role.id
    LEFT JOIN department
     ON role.department_id = department.id
     LEFT JOIN employee manager
     ON manager.id = employee.manager_id`;

    connection.query(sql, function (err, res) {
        if (err) throw err;
        console.table(res);
        prompt();
    });
}

function addDepartment() {
    inquirer
    .prompt({
        name: 'department',
        type: 'input',
        message: 'What is the name of the new department?',
    })
    .then(function(answer) {
        var query = 'INSERT INTO department (name) VALUES ( ? )';
        connection.query(query, answer.department, function(err, res) {
            console.log(`You have added this department: ${(answer.department).toUpperCase()}.`)
        })
        viewDepartments();
    })
}

function addRole() {
    connection.query('SELECT * FROM  department', function(err, res) {
        if (err) throw (err);
        inquirer
        .prompt([{
            name: 'title',
            type: 'input',
            message: 'What is the title of the new role?',
        },
        {
            name: 'salary',
            type: 'input',
            message: 'What is the salary of the new role?',
        },
        {
            name: 'departmentName',
            type: 'list',
            message: 'Which department does this role belong to?',
            choices: function() {
                var choicesArray = [];
                res.forEach(res=> {
                    choicesArray.push(
                        res.name
                    );
                })
                return choicesArray;
            }
        }
    ])
    .then(function(answer) {
        const department = answer.departmentName;
        connection.query('SELECT * FROM department', function(err, res) {
            if (err) throw (err);
            let filteredDept = res.filter(function(res) {
                return res.name == department;
            })
            let id = filteredDept[0].id;
            let query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
            let values = [answer.tilte, parseInt(answer.salary), id]
            console.log(values);
            connection.query(query, values, 
                function(err, res, fields) {
                    console.log(`You have added this role: ${(values[0]).toUpperCase()}.`)
                })
                viewRoles()
        })
    })
    })
}

function addEmployee() {
    connection.query('SELECT * FROM role', (err, roles) => {
        if (err) console.log(err);
        roles = roles.map((role) => {
            return {
                name:role.title,
                value: role.id,
            };
        });
        inquirer
        .prompt([
            {
                type: 'input',
                name: 'firstName', 
                message: 'Enter the first name of the new employee...'
            },
            {
                type: 'input',
                name: 'lastName', 
                message: 'Enter the last name of the new employee...'
            },
            {
                type: 'list',
                name: 'role', 
                message: 'Enter the new employees role...',
                choices: roles,
            },
            {
                type: 'list',
                name: 'managerId', 
                message: 'select a manager id...',
                choices: [1, 3, 5, 7],
            }
        ])
        .then((data) => {
            console.log(data.role);
            connection.query(
                'INSERT INTO employee SET ?',
                {
                    first_name: data.firstName,
                    last_name: data.lastName,
                    role_id: data.role,
                    manager_id: data.managerId
                },
                (err) => {
                    if (err) throw err;
                    console.log('Updated Employee Roster;');
                    viewEmployees();
                }
            )
        })
    })
}

const updateRole = () => {
    connection.query('SELECT * FROM employee', (err, employees) => {
        if (err) console.log(err);
        employees = employees.map((employee) => {
            return {
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
            };
        });
        connection.query('SELECT * FROM role', (err, roles) => {
            if (err) console.log(err);
            roles = roles.map((role) => {
                return {
                    name: role.title, 
                    value: role.id,
                }
            });
            inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'selectEmployee',
                    message: 'Select employee to update...',
                    choices: employees,
                },
                {
                    type: 'list',
                    name: 'selectNewRole',
                    message: 'Select new employee role...',
                    choices: roles,
                },
            ])
            .then((data) => {
                connection.query('UPDATE employee SET ? WHERE ?',
                [
                    {
                        role_id: data.selectNewRole,
                    },
                    {
                        id: data.selectEmployee,
                    },
                ],
                function (err) {
                    if (err) throw err;
                }
                );
                console.log('Employee role updated');
                viewAllRoles();
            });
        });
    });
};

// Start server after DB connection
connection.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });