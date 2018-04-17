var bamazonCustomer = require('./bamazonCustomer.js');
var bamazonManager = require('./bamazonManager.js');
var bamazonSupervisor = require('./bamazonSuperviser.js');

var mysql = require('mysql');
var inquirer = require('inquirer');

inquirer
    .prompt([
        {
            type: 'list',
            message: 'Please Choose User Type',
            choices: ['Customer', 'Manager', 'Supervisor'],
            name: 'userType'
        }
    ]).then(function(data){
        if(data.userType === 'Customer'){
            bamazonCustomer.customerStart();
        } else if(data.userType === 'Manager'){
            inquirer
                .prompt([
                    {
                        type: 'input',
                        message: 'Please Enter Your Password',
                        name: 'managerPass'
                    }
                ]).then(function(data){
                    if(data.managerPass === "managerPassword"){
                        console.log('SUCCESS!');
                        bamazonManager.managerStart();
                    } else {
                        console.log('Incorrect Password');
                    }
                })
        } else if(data.userType === 'Supervisor'){
            inquirer
                .prompt([
                    {
                        type: 'input',
                        message: 'Please Enter Your Password',
                        name: 'supervisorPass'
                    }
                ]).then(function(data){
                    if(data.supervisorPass === "supervisorPassword"){
                        console.log('SUCCESS!');
                        bamazonSupervisor.viewAllDepartments();
                    } else {
                        console.log('Incorrect Password');
                    }
                })
        }
    })