//This page containts all of the manager account functions
//require the npm package mysql
var mysql = require('mysql');
//require the npm package inquirer
var inquirer = require('inquirer');
//connection to mysql
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
//this function controls the different options selection for a manager profile
  function managerStart(){
      //prompt using inquirer
      inquirer
        .prompt([
            {
                type: 'list',
                message: 'Please choose an action',
                choices:['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add new product'],
                name: 'managerSelection'
            }
        //run different managerial functions based on selections
        ]).then(function(data){
            if(data.managerSelection === 'View Products for Sale'){
                viewProductsForSale();
            } else if(data.managerSelection === 'View Low Inventory'){
                viewLowInventory();
            } else if(data.managerSelection === 'Add to Inventory'){
                addToInventory();
            } else {
                addNewProduct();
            }
        })
  }
//function allows user to view all of the products that are currently in stock
function viewProductsForSale(){
    //the MYSQL database request for all products whose stock value is greater than 0 (in stock)
    connection.query("SELECT * FROM products WHERE stock_quantity > 0;",
    function(err, res){
        if(err) throw err;
        //console logs for console display
        console.log('Here are Current Items for Sale');
        console.log('---------');
        //loops through the results
        for (var i = 0; i < res.length; i++){
            if(res[i].stock_quantity > 0){
                //displays each result item individually with the items name, price, and quantity left
                console.log(res[i].product_name + " || $" + res[i].price + ' || quantity:' + res[i].stock_quantity);
                console.log('----------');
              
            }
        } 
        //calls the reSelect function
       reSelect();  
    })
}
//function allows user to view all products that are low in stock
function viewLowInventory(){
    //MYSQL request for all rows in products table where stock_quantity column has a value less than or equal to 5
    connection.query("SELECT * FROM products WHERE stock_quantity <= 5;",
    function(err, res){
        if(err) throw err;
        //console logs for display
        console.log('Here are Items that Need to be Restocked');
        console.log('---------');
        //loop through each found item
        for (var i = 0; i < res.length; i++){
            if(res[i].stock_quantity > 0){
                //display each irem indivudally with the name, price, and quantity left
                console.log(res[i].product_name + " || $" + res[i].price + ' || quantity:' + res[i].stock_quantity);
                console.log('----------');
            
            }
        }
        //calls reSelect function 
        reSelect();  
    })
}
//function allows user to increase the stock of an item in the database
function addToInventory(){
    //inquirer prompt is used to determine which item to restock and how much to increse stock amount
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'Which Item would you ike to Restock?',
                name: 'restockName'
            },
            {
                type: 'input',
                message: 'How Many New Items would you like to Add?',
                name: 'restockNumber'
            }
        ]).then(function(data){
            //assign item name and amount to restock to variables 
            var itemName = data.restockName;
            var itemNumber = data.restockNumber;
            //use these variables to update the databases stock_quantity at the desired product 
            connection.query("UPDATE products SET stock_quantity = stock_quantity + " + "'" + itemNumber + "' WHERE product_name = " + "'" + itemName + "' ;",
            function(err,res){
                if(err) throw err;
                //let user know item was successfully restocked
                console.log(itemNumber + " more stock added to " + itemName);
                //calls the reSelect function
                reSelect();
            })
        })
}
//this function allows the user to add an entirely new row into the products table
function addNewProduct(){
    //use an inquirer prompt in order to get all of the new rows info
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'Please Enter New Product Name',
                name: 'newName'
            },
            {
                type: 'input',
                message: 'Please Enter Department',
                name: 'newDepartment'
            },
            {
                type: 'input',
                message: 'Please Enter a Price',
                name: 'newPrice'
            },
            {
                type: 'input',
                message: 'Please Enter Initial Stock',
                name: 'newStock'
            }
        ]).then(function(data){
            //this query inserts a new row
            connection.query(    
            "INSERT INTO products SET ?",
            {
              //match all of the key names to the corresponding column names in the database
              product_name : data.newName,
              department_name : data.newDepartment,
              price: data.newPrice,
              stock_quantity: data.newStock
            },
            function(err, res){
                if(err) throw err;
                //let user know in console that the item was successfully added to the database
                console.log('Item Successfully added!');
                //call reSelect function
                reSelect();
            })
        })
}
//this function allows users to perform new tasks after a prior task is finished
function reSelect(){
    //use inquirer to question whether the user would like to do another action
    inquirer
        .prompt([
            {
                //confirm returns a boolean
                type: 'confirm',
                message: 'Would you like to do something else?',
                name:'chooseRestart'
            }
        ]).then(function(data){
            //if user selects yes, run the initial manager controller function
            if(data.chooseRestart === true){
                managerStart();
            //if user selects no, end the connection to the database    
            } else {
                console.log('Have a Nice Day.');
                connection.end();
            }
        })
}

//managerStart();
//exports all of the functions from the page
module.exports = {
    reSelect,
    addNewProduct,
    viewLowInventory,
    viewProductsForSale,
    managerStart
};