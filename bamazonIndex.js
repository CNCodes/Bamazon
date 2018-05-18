//import all of the other files
var bamazonCustomer = require('./bamazonCustomer.js');
var bamazonManager = require('./bamazonManager.js');
var bamazonSupervisor = require('./bamazonSuperviser.js');
//import mysql and inquirer
var mysql = require('mysql');
var inquirer = require('inquirer');

//start with a requirer prompt to choose the account type
inquirer
    .prompt([
        {
            type: 'list',
            message: 'Please Choose User Type',
            choices: ['Customer', 'Manager', 'Supervisor'],
            name: 'userType'
        }
    ]).then(function(data){
        //if user is a customer run the customerStart function to give them their options
        if(data.userType === 'Customer'){
            bamazonCustomer.customerStart();
        //if user is a manager or a supervisor makes them enter a password to confirm thier access
        //if the user is a manager run the managerStart function to give them the appropriate options
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
        //if the user is a supervisor run the supervisorStart function to give them the appropriate options        
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