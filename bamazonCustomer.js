//This page contains the functions for the customer accounts
//require the npm mysql package
var mysql = require('mysql');
//require the npm inquirer package
var inquirer = require('inquirer');
//establish connection to the database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "",
    database: "bamazon_db",

  });
//this function shows all of the items in the database  
function showAllItems() {
      connection;
      //get data from all rows in the products table
      connection.query("SELECT * FROM `products`;",
      function(err,res){
          if (err) throw err;
        //loop through each row sent back from products table
          for (var i = 0; i < res.length; i++){
              //for all of the instock items, display them with their name, price, and amount remaining in stock
              if(res[i].stock_quantity > 0){
                  console.log(res[i].product_name + " || $" + res[i].price + ' || quantity:' + res[i].stock_quantity);
                  console.log('----------');
                  
              }
          }
              //call the reslsect function
              reSelect();
      });
    }
//This function allows users to "buy" items from the product list
function buyItems(){
    //allows user to input item name and the amount they would like to purchase
      inquirer
        .prompt([
            {
                type: 'input',
                message: 'what item would you like to purchase',
                name: 'itemName'
            },
            {
                type: 'input',
                message: 'How many would you like to order?',
                name: 'itemQuantity'
            }
        ]).then(function(data){
            var itemName = data.itemName;
            var itemQuantity = data.itemQuantity;
            console.log(itemQuantity);
            //get all the data from the specific product row
            connection.query("SELECT * FROM `products` WHERE product_name = " + "'" + itemName + "'" + ";",
            function (err,res){
                if (err) throw err;
                if(res[0].stock_quantity > 0) {
                  //amountRemaing variable is equal to the original stock - the desired amount to be purchase 
                  var amountRemaining = res[0].stock_quantity - itemQuantity;
                  //CustomerCost variable is the just multiplying the amount of items desired by their individual cost
                  var customerCost = itemQuantity * res[0].price;
                  //totalSales adds the customerCost to the previous product_sales from the database
                  var totalSales = customerCost + res[0].product_sales
                  //makes sure user doesn't take more product than currently in stock
                  if(amountRemaining < 0){
                      console.log('Sorry, we dont have enough in our stock :(');
                      //connection.end();

                  } else {
                      //update 
                      connection.query("UPDATE products SET stock_quantity = " + "'" + amountRemaining + "'" + "WHERE product_name = " + "'" + itemName + "'" + ";");
                      connection.query("UPDATE products SET product_sales = " + "'" + totalSales + "'" + "WHERE product_name = " + "'" + itemName + "'" + ";");
                      console.log('Your order of ' + itemName + ' was successful!');
                      console.log('quantity : ' + itemQuantity + ' || ' + 'total price : $' + customerCost);
                      console.log('---------');
                      //connection.end();
                  }
                }
                reSelect();
            })
        })
 
  }
//functions for starting 
function customerStart(){
//inquirer prompt for user to choose a task to perform
inquirer
    .prompt([
        {
            type: 'list',
            message: 'please choose an action',
            choices: ['Display Items', 'Place an Order'],
            name: 'customerChoices'
        }
    ]).then(function(data){
        //if else statement to choose correct functions to run
        if(data.customerChoices === 'Display Items'){
            showAllItems();
        } else {
                buyItems();
        }
    });
}
//function to allow users to choose a new action  
function reSelect(){
    //inquirer confirm prompt to determine whether the user wants to do more
    inquirer
        .prompt([
            {
                type: 'confirm',
                message: 'Would you like to do something else?',
                name:'chooseRestart'
            }
        ]).then(function(data){
            //if true, restart user selection
            if(data.chooseRestart === true){
                customerStart();
            //if false, end the connection to the database    
            } else {
                console.log('Have a Nice Day.');
                connection.end();
            }
        })
}

//customerStart();
//export the functions
module.exports = {
    reSelect,
    customerStart,
    buyItems,
    showAllItems
};
