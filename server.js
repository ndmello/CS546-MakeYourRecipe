// We first require our express package
var express = require('express');
var bodyParser = require('body-parser');
var myData = require('./data.js');
var recipeData = require('./data_recipe.js');
var userData = require('./data_users.js');
var cartData = require('./data_cart.js');

// This package exports the function to create an express instance:
var app = express();

// We can setup Jade now!
app.set('view engine', 'ejs');

// This is called 'adding middleware', or things that will help parse your request
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// This middleware will activate for every request we make to 
// any path starting with /assets;
// it will check the 'static' folder for matching files 
app.use('/assets', express.static('static'));

// Setup your routes here!

app.get("/home", function (request, response) {
    response.render("pages/home", { pageTitle: "Welcome Home" });
});

app.get("/cart", function (request, response) {
    // user id should be provided in request/response
        
    //var cart = cartData.getCart(userId);
    
    // sample cart before DB is implemented
    var exampleCart = {
        "_id": 50,
        "userId": 10,
        "recipes": [
            {
                "recipeId": 20,
                "recipeName": "Breakfast",
                "listOfIngredients": [
                    {
                        "ingredientId": 30,
                        "ingredientName": "Eggs",
                        "price": 2.50,
                        "minQuantity": 1,
                        "quantity": 2
                    },
                    {
                        "ingredientId": 31,
                        "ingredientName": "Butter",
                        "price": 1.50,
                        "minQuantity": 1,
                        "quantity": 1
                    },
                    {
                        "ingredientId": 32,
                        "ingredientName": "Toast",
                        "price": 1.00,
                        "minQuantity": 1,
                        "quantity": 2
                    },
                    {
                        "ingredientId": 33,
                        "ingredientName": "Orange Juice",
                        "price": 2.00,
                        "minQuantity": 1,
                        "quantity": 0
                    }
                ]
            },
            {
                "recipeId": 21,
                "recipeName": "Snack",
                "listOfIngredients": [
                    {
                        "ingredientId": 34,
                        "ingredientName": "Chips",
                        "price": 3.00,
                        "minQuantity": 2,
                        "quantity": 10
                    }
                ]
            }
        ]
    }
    response.render("pages/cart", { pageTitle: "Shopping Cart", cart: exampleCart });
});

app.get("/", function (request, response) { 
    // We have to pass a second parameter to specify the root directory
    // __dirname is a global variable representing the file directory you are currently in
    response.sendFile("./pages/index.html", { root: __dirname });
});

// We can now navigate to localhost:3000
app.listen(3000, function () {
    console.log('Your server is now listening on port 3000! Navigate to http://localhost:3000 to access it');
});
