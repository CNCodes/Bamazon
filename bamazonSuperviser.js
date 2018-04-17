var mysql = require('mysql');

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

function viewAllDepartments(){
    var departmentName;
    var totalSales;
    connection.query("SELECT * FROM departments",
    function(err,res){
        if(err) throw err;
        //console.log(res);
        res.forEach(function(department){
            var departmentName = department.department_name;
            var overHeadCosts = department.over_head_costs;
            var productSales;
            connection.query("SELECT AVG(product_sales)FROM products WHERE department_name = " + "'" + departmentName + "' GROUP BY product_sales;",
                               function(err, res){
                                   productSales = (res[res.length-1]["AVG(product_sales)"]);
                                   connection.query("SELECT * FROM departments WHERE department_name = " + "'" + departmentName + "' ;",
                                   function(err,res){
                                      if(err) throw err;
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