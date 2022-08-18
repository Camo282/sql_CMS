const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');
require('console.table');
const util = require('util');

const PORT = process.env.PORT || 3001;
const app = express();


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

//Express middleware
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Hello World'
    });
});

connection.connect(err => {
    if (err) throw err;
    prompt();
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
                    'View All Employees', 
                    'Add Employee', 
                    'Update Employee Role', 
                    'View All Roles', 
                    'Add Role', 
                    'View All Departments', 
                    'Add Department',
                    'Exit'
                ]
            },  
        ])
        .then(function (choice) {
            console.info('You chose:' + choice.cmsChoices);
    
            switch (choice.option) {
                case 'View All Employees':
                    viewEmployees();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Update Employee Role':
                    updateRole();
                    break;
                case 'View All Roles':
                    viewRoles();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'View All Departments':
                    viewDepartments();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Exit':
                    connection.end();
                    break;
            };
        });
    };

function viewEmployees() {
   
    const sql = `SELECT employee.*, role.title
     AS role_id
    FROM employee
    LEFT JOIN role
     ON employee.role_id = role.id`;

    connection.query(sql, function (err, res) {
        if (err) throw err;
        console.table(res);
        prompt();
    });
}

// Start server after DB connection
connection.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });