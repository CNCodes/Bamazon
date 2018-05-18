//This page contains all of the functions for the Supervisor account
//require mysql npm package
var mysql = require('mysql');
//establish connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "",
    database: "bamazon_db",

    multipleStatements: true
  });

//this function allows the supervisor account to find all of the product_sales stats  
function viewAllDepartments(){
    var departmentName;
    var totalSales;
    //MYSQL call to get all contents from departments table
    connection.query("SELECT * FROM departments",
    //all of the data is in the res paramater
    function(err,res){
        if(err) throw err;
        //console.log(res);
        res.forEach(function(department){
            //takes each row in the table
            //get department name for the each specific row to be used to reference a foreign key in the products table
            var departmentName = department.department_name;
            //get department overhead costs for later use during console log
            var overHeadCosts = department.over_head_costs;
            var productSales;
            //create a query for the MYSQL products table that matches each department to their products and then group them by their profuct_sales column
            connection.query("SELECT AVG(product_sales)FROM products WHERE department_name = " + "'" + departmentName + "' GROUP BY product_sales;",
                               function(err, res){
                                   //each of the product sales columns displays the product sales for the department
                                   productSales = (res[res.length-1]["AVG(product_sales)"]);
                                   //this code may be redundant
                                   connection.query("SELECT * FROM departments WHERE department_name = " + "'" + departmentName + "' ;",
                                   function(err,res){
                                      if(err) throw err;
                                      //display all of the necessary data in console
                                      console.log("| " + res[0].department_id + "         " + "| " + res[0].department_name + "         " + "| " + res[0].over_head_costs + "         " + "| " + productSales + "         " + "| " + (productSales - res[0].over_head_costs) + "         |");
                                    })
                               });

        })
        }
    )    
}

//viewAllDepartments();

module.exports = {
    viewAllDepartments
}