var mysql = require("mysql");
var inquirer = require("inquirer");

var con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazondb"
});

con.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
        console.log(res[i].item_id + ". " + res[i].product_name + " in " + res[i].dept_name + " for " + res[i].price + " dollars with " + res[i].stock + " in stock.");
    }
});

inquirer.prompt([
    {
        type: "input",
        name: "itemName",
        message: "Enter the item number you want to buy:"
    }
]).then(function (answer) {
    con.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {

            if (answer.itemName === res[i].product_name || parseInt(answer.itemName) === res[i].item_id) 
            {
                ableToBid = true;
            }
        }
        if (ableToBid === true) {
            console.log("How many would you like to buy? ");
            inquirer.prompt([
                {
                    type: "input",
                    name: "quantity",
                    message: "Total quantity: "
                }
            ]).then(function (data) {
                var x = parseInt(answer.itemName);
                var y = x - 1;
                if (res[y].stock > 0) {
                    var merchLeft = res[y].stock - data.quantity;
                    var location = res[y].product_name;
                    var totalPrice = (res[y].price * data.quantity);
                    // console.log(merchLeft);
                    // console.log(res[y].item_id);
                    console.log("For $" + totalPrice + ", you bought " + data.quantity + " " + res[y].product_name);
                    con.query("UPDATE products SET ? WHERE ?",
                        [{
                            stock: merchLeft
                        },
                        {
                            product_name: location
                        }],
                        function (err, res) {
                            if (err) throw err;
                            con.end();
                        }
                    )
                }
            });
        }
    });
});