var mysql = require("mysql");
var inquirer = require("inquirer");


var connection = mysql.createConnection({
 host     : 'localhost',
 user     : 'root',
 password : 'root',
 port     :  3306, 
 database : 'bamazon_DB'
});

connection.connect();

// Begins by printing out options for the user to choose from
function start(){
    inquirer.prompt([{
      type: "list",
      name: "options",
      message: "Please choose an option from below.",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product","End Session"]
    }]).then(function(answer){
       switch(answer.options){
        case "View Products for Sale": printItems();
        break;
        case "View Low Inventory": viewLowInventory();
        break;
        case "Add to Inventory": addToInventory();
        break;
        case "Add New Product": addNewProduct();
        break;
        case "End Session": console.log('Bye, please come back again!');
      }
    });
  }

// Prints out list of products in the mySQL database
function printItems(){
connection.query("SELECT * FROM products", function (error, results) {
    if (error) throw error;
 
    for(var i = 0; i < results.length; i++) {
        console.log("ID: "  + results[i].item_id  + "\nProduct: " + results[i].product_name  
        + "\nDepartment: " + results[i].department_name + "\nPrice: $" + results[i].price 
        +  "\nStock Quantity: " + results[i].stock_quantity + "\n");
        console.log("------------------------------");
    }  
    start();
});
}

// Shows all items that have less than 5 items left
function viewLowInventory() {
    connection.query("SELECT * FROM products", function(error, results) {
        if(error) throw error;
        
        for(var i = 0; i < results.length; i++) {
            if(results[i].stock_quantity <= 5) {
                console.log("Products with low inventory: " + "ID: "  + results[i].item_id + "\n" + "Product: " + results[i].product_name  
                + "\n" + "Department: " + results[i].department_name  + "\n" + "Price: $" + results[i].price 
                + "\nStock Quantity: " + results[i].stock_quantity);
                console.log("------------------------------");
            }
        }
        start();
    });
}

// Adds new inventory to the database
function addToInventory() {
    connection.query("SELECT * FROM products", function(error, results) {
         if(error) throw error;

        var addItems = [];
        for(var i = 0; i < results.length; i++) {
            addItems.push(results[i].product_name);
        }

        inquirer.prompt([{
            type: "list",
            name: "products",
            choices: addItems,
            message: "Which item would you like to add inventory?"
          }, {
            type: "input",
            name: "quantity",
            message: "How much would you like to add?",
            validate: function(value){
              if(isNaN(value) === false){return true;}
              else{return false;}
            }
            }]).then(function(answer){
              var currentQuantity;
              for(var i = 0; i < results.length; i++){
                if(results[i].product_name === answer.products){
                  currentQuantity = results[i].stock_quantity;
                }
              }
              connection.query('UPDATE products SET ? WHERE ?', [
                {stock_quantity: currentQuantity + parseInt(answer.quantity)},
                {product_name: answer.products}
                ], function(error, results){
                  if(error) throw error;
                  console.log('The quantity was updated.');
                  start();
                });
              })
    
    });
}

// Adds a new product to the database
function addNewProduct() {
    connection.query("SELECT * FROM products", function(error, results) {
         if(error) throw error;

        var addProduct = [];
        for(var i = 0; i < results.length; i++) {
            addProduct.push(results[i].department_name);
        }

        inquirer.prompt([{
            type: "input",
            name: "product",
            message: "Product you would like to add: ",
            validate: function(value){
                if(value){return true;}
                else{return false;}
              }
          }, {
            type: "list",
            name: "departmentName",
            message: "Department: ",
            choices: addProduct
            },
            {
                type: "input",
                name: "price",
                message: "Price: ",
                validate: function(value){
                  if(isNaN(value) === false){return true;}
                  else{return false;}
                }
              }, {
                type: "input",
                name: "stockQuantity",
                message: "Stock Quantity: ",
                validate: function(value){
                  if(isNaN(value) == false){return true;}
                  else{return false;}
                } 
        }]).then(function(answer){
              var currentQuantity;
              for(var i = 0; i < results.length; i++){
                if(results[i].product_name === answer.products){
                  currentQuantity = results[i].stock_quantity;
                }
              }
              connection.query('INSERT INTO products SET ?', {
                product_name: answer.product, 
                department_name: answer.departmentName,
                price: answer.price,
                stock_quantity: answer.stock_quantity

              }, function(error, results){
                  if(error) throw error;
                  console.log('The quantity was updated.');
                  start();
                });
              })
    
    });
}


start();


// connection.end(); 







 


  
