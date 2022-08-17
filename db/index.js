const inquirer = require('inquirer');
//const mysql = require('mysql2');
const connection = require('.db/connection.js');
//const { allowedNodeEnvironmentFlags } = require('process');

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
                'Add Department'
            ]
        },  
    ])
    .then(function (choice) {
        console.info('You chose:' + choice.option);

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
        };
    });

    function viewEmployees() {
        const sql = `SELECT * FROM employee`;
        connection.createQuery(sql, function (err, res) {
            if (err) throw err;
            console.table(res);
            startPrompt();
        });
    };