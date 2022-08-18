/*const inquirer = require('inquirer');
const express = require('express');
const router = express.Router();
//const mysql = require('mysql2');
const db = require('.db/connection.js');
//const { allowedNodeEnvironmentFlags } = require('process');

// Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });

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
            case 'Exit':
                connection.end();
                break;
        };
    });

    router.get('/employee', (req, res) => {
        const sql = `SELECT * FROM employee`;
        db.query(sql, (err, rows) => {
            if(err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({
                message: 'success',
                data: rows
            });
        });
    });
    function viewEmployees() {
        const sql = `SELECT * FROM employee`;
        connection.createQuery(sql, function (err, res) {
            if (err) throw err;
            console.table(res);
            startPrompt();
        });
    };*/