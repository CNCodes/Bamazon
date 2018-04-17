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

    multipleStatements: true
  });

  function managerStart(){
      inquirer
        .prompt([
            {
                type: 'list',
                message: 'Please choose an action',
                choices:['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add new product'],
                name: 'managerSelection'
            }
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

function viewProductsForSale(){
    connection.query("SELECT * FROM products WHERE stock_quantity > 0;",
    function(err, res){
        if(err) throw err;
        console.log('Here are Current Items for Sale');
        console.log('---------');
        for (var i = 0; i < res.length; i++){
            if(res[i].stock_quantity > 0){
                console.log(res[i].product_name + " || $" + res[i].price + ' || quantity:' + res[i].stock_quantity);
                console.log('----------');
              
            }
        } 
       reSelect();  
    })
}

function viewLowInventory(){
    connection.query("SELECT * FROM products WHERE stock_quantity <= 5;",
    function(err, res){
        if(err) throw err;
        console.log('Here are Items that Need to be Restocked');
        console.log('---------');
        for (var i = 0; i < res.length; i++){
            if(res[i].stock_quantity > 0){
                console.log(res[i].product_name + " || $" + res[i].price + ' || quantity:' + res[i].stock_quantity);
                console.log('----------');
            
            }
        }
        reSelect();  
    })
}

function addToInventory(){
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
            var itemName = data.restockName;
            var itemNumber = data.restockNumber;
            connection.query("UPDATE products SET stock_quantity = stock_quantity + " + "'" + itemNumber + "' WHERE product_name = " + "'" + itemName + "' ;",
            function(err,res){
                if(err) throw err;
                console.log(itemNumber + " more stock added to " + itemName);
                reSelect();
            })
        })
}

function addNewProduct(){
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
            connection.query( 
            "INSERT INTO products SET ?",
            {
              product_name : data.newName,
              department_name : data.newDepartment,
              price: data.newPrice,
              stock_quantity: data.newStock
            },
            function(err, res){
                if(err) throw err;
                console.log('Item Successfully added!');
                reSelect();
            })
        })
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
                managerStart();
            } else {
                console.log('Have a Nice Day.');
                connection.end();
            }
        })
}

//managerStart();

module.exports = {
    reSelect,
    addNewProduct,
    viewLowInventory,
    viewProductsForSale,
    managerStart
};