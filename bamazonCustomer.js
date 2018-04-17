var mysql = require('mysql');

var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "",
    database: "bamazon_db",

    //multipleStatements: true
  });
  
function showAllItems() {
      connection;
      connection.query("SELECT * FROM `products`;",
      function(err,res){
          if (err) throw err;

          for (var i = 0; i < res.length; i++){
              if(res[i].stock_quantity > 0){
                  console.log(res[i].product_name + " || $" + res[i].price + ' || quantity:' + res[i].stock_quantity);
                  console.log('----------');
                  
              }
          }
              //connection.end();
              reSelect();
      });
    }

function buyItems(){
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
            connection.query("SELECT * FROM `products` WHERE product_name = " + "'" + itemName + "'" + ";",
            function (err,res){
                if (err) throw err;
                if(res[0].stock_quantity > 0) {
                  var amountRemaining = res[0].stock_quantity - itemQuantity;
                  var customerCost = itemQuantity * res[0].price;
                  var totalSales = customerCost + res[0].product_sales
                  if(amountRemaining < 0){
                      console.log('Sorry, we dont have enough in our stock :(');
                      //connection.end();

                  } else {
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

function customerStart(){

inquirer
    .prompt([
        {
            type: 'list',
            message: 'please choose an action',
            choices: ['Display Items', 'Place an Order'],
            name: 'customerChoices'
        }
    ]).then(function(data){
        if(data.customerChoices === 'Display Items'){

                showAllItems();
               
        } else {
                buyItems();
        }
    });
}
  
function reSelect(){
    inquirer
        .prompt([
            {
                type: 'confirm',
                message: 'Would you like to do something else?',
                name:'chooseRestart'
            }
        ]).then(function(data){
            if(data.chooseRestart === true){
                customerStart();
            } else {
                console.log('Have a Nice Day.');
                connection.end();
            }
        })
}

//customerStart();

module.exports = {
    reSelect,
    customerStart,
    buyItems,
    showAllItems
};
