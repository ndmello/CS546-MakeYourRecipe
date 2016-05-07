// We first require our express package
var express = require('express');
var bodyParser = require('body-parser');
var cartData = require('./data_cart.js');
var recipeData = require('./data_recipe.js');
var usersData = require('./data_users.js');
var cookieParser = require('cookie-parser');
Guid = require('Guid');

// This package exports the function to create an express instance:
var app = express();

// We can setup Jade now!
app.set('view engine', 'ejs');

// This is called 'adding middleware', or things that will help parse your request
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser()); //for parsing cookies


app.use('/assets', express.static('static'));


app.use('/logout',function(request, response, next){
        var sessionID = request.cookies.currentSessionID;

        usersData.removeSessionId(sessionID);

        var anHourAgo = new Date();
        anHourAgo.setHours(anHourAgo.getHours() -1);

        response.cookie("currentSessionId", "", {expires : anHourAgo});
        response.clearCookie("currentSessionId");
		
		response.cookie("isAdmin", "", {expires : anHourAgo});
        response.clearCookie("isAdmin");
        next();
});


app.use('/add-product',function(request, response, next){
        if(request.cookies.isAdmin){
            next();
        }
        else
        {
            response.redirect("/");
        }
    
});

app.use(function(request, response, next) {


    if(request.cookies.currentSessionId)
            {
                usersData.getUserBySessionId(request.cookies.currentSessionId).then(function(result){


                    if(result.length == 1)
                    {

                        next();
                    }
                }).catch(function(error){
                    console.log(error)
                    var anHourAgo = new Date();
                    anHourAgo.setHours(anHourAgo.getHours() -1);

                    response.cookie("currentSessionId", "", {expires : anHourAgo});
                    response.clearCookie("currentSessionId");
					response.cookie("isAdmin", "", {expires : anHourAgo});
					response.clearCookie("isAdmin");
                    response.redirect("/");


                });
                return;

            }



    next();
});



// Setup your routes here!

app.get("/", function (request, response) {
    if(request.cookies.currentSessionId){
        usersData.getUserBySessionId(request.cookies.currentSessionId).then(function (user) {
            cartData.getCart(user[0].cartId).then(function (cart) {
                response.render("pages/homepage", {loginFlag: request.cookies.currentSessionId, adminFlag: request.cookies.isAdmin, pageTitle: "Home", cartCount: cart.recipes.length});
            }).catch(function(errorMessage){
                console.log(errorMessage);
            });
        }).catch(function(errorMessage){
            response.redirect("/login");
        });
    }
    else
    {
        response.render("pages/homepage", {loginFlag: request.cookies.currentSessionId, pageTitle: "Home"});
    }
});

app.post("/logout", function (request, response) {
    response.redirect("/");
});

app.get("/login",function (request, response){
    response.render("pages/index", {loginFlag: request.cookies.currentSessionId, pageTitle: "Login"});
});



// Create a user
app.post("/createUser", function(request, response) {
    usersData.createUser(request.body.register_email, request.body.register_passwd).then(function(user) {
		
        if(user != "User already exists") {
            var expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 1);
            response.cookie('currentSessionId', user.currentSessionId, { expires: expiresAt });
			
			if(request.body.register_email == 'admin@makemyrecipe.com'){
				response.cookie('isAdmin', 'true', { expires: expiresAt });
			}
            response.redirect("/");
        }else {

            response.render("pages/index", {error: "User already exists. Try Logging in.", pageTitle: "Registration Error"});

        }
    }, function(errorMessage) {
        response.status(500).json({ error: errorMessage });
    });
});

// Login
app.post("/login", function(request, response) {
    var uname,pwd;
    uname = request.body.login_email;
    pwd = request.body.login_passwd;
    if(uname && pwd){
    usersData.validateUser(uname, pwd).then(function(newSessionId) {
        var expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 1);
            response.cookie('currentSessionId', newSessionId, { expires: expiresAt });

        response.redirect("/");
    }, function(errorMessage) {
        response.render("pages/index", {error: errorMessage, pageTitle: "Login Error"});
    });
    }
});




app.get("/product/category/:category",function (request, response){
    var category = request.params.category;

    if(request.cookies.currentSessionId){
        usersData.getUserBySessionId(request.cookies.currentSessionId).then(function (user) {
            cartData.getCart(user[0].cartId).then(function (cart) {
                var category = request.params.category;
				if(category == 'Favorites'){
					usersData.getUserFavorites(user[0]._id).then(function(fave){
                        if (fave.length == 0) {
                            response.render("pages/product_category", {resultData : [], loginFlag: request.cookies.currentSessionId, adminFlag: request.cookies.isAdmin, pageTitle: "Categories", cartCount: cart.recipes.length});
                        } else {
                            var favorites = [];
                            for (var f = 0; f < fave.length; f++) {
                                (function(f) {
                                    recipeData.getRecipe(fave[f]).then(function(rec) {
                                        favorites.push(rec);
                                        if (f == fave.length-1) {
                                            response.render("pages/product_category", {resultData : favorites, loginFlag: request.cookies.currentSessionId, adminFlag: request.cookies.isAdmin, pageTitle: "Categories", cartCount: cart.recipes.length});
                                        }
                                    });
                                })(f);
                            }
                        }
					});
						
                } else {
                    recipeData.getCategory(category).then(function(result){
                        for(var i=0; i<result.length; i++)
                        {
                            result[i] = recipeData.totalPrice(result[i]);
                        }
                        response.render("pages/product_category", {resultData : result, category: category, loginFlag: request.cookies.currentSessionId, adminFlag: request.cookies.isAdmin, pageTitle: "Categories", cartCount: cart.recipes.length})
                       });
				}

            }).catch(function(errorMessage){
                console.log(errorMessage);
            });
        }).catch(function(errorMessage){
            response.redirect("/login");
        });
    }
    else
    {
        var category = request.params.category;
            recipeData.getCategory(category).then(function(result){
                for(var i=0; i<result.length; i++)
                    {
                        result[i] = recipeData.totalPrice(result[i]);
                    }
                    response.render("pages/product_category", {resultData : result, category: category, loginFlag: request.cookies.currentSessionId, adminFlag: request.cookies.isAdmin, pageTitle: "Categories"})
            });
    }


});



app.get("/add-product",function (request, response){
    response.render("pages/add-product", {loginFlag: request.cookies.currentSessionId, adminFlag: request.cookies.isAdmin, pageTitle: "Add Product"});
});

app.post("/add-product",function (request, response){
    var recipe_name = request.body.recipe_name;
    var description = request.body.description;
    var image_url = request.body.image_url;
    var prep_time = request.body.prep_time;
    var cook_time = request.body.cook_time;
    var servings = request.body.servings;
    var cuisine = request.body.cuisine;
    var procedure = request.body.procedure;
    var ing_arr = request.body.i_name;
    var min_q = request.body.min_q;
    var price = request.body.price;
   
    var ingredientArray = [];
    for(var i=0; i<ing_arr.length; i++)
    {
        var newIngredient = {
                    _id: Guid.create().toString(),
                    name: ing_arr[i],
                    min_q: min_q[i],
                    price: price[i],
                }

        ingredientArray.push(newIngredient);
    }

    recipeData.addProduct(recipe_name, description, image_url, prep_time, cook_time, servings, cuisine, ingredientArray, procedure).then(function(result){
        if(result == true){
            response.render("pages/add-product",{success: "Successfully Added the Recipe", pageTitle: "Add Product"});
        }
    });



});


app.post("/search",function (request, response){
    if(request.cookies.currentSessionId){
        usersData.getUserBySessionId(request.cookies.currentSessionId).then(function (user) {
            cartData.getCart(user[0].cartId).then(function (cart) {
                var keyword = request.body.keyword;
                recipeData.searchDB(keyword).then(function(result) {
                    for(var i=0; i<result.length; i++)
                    {
                        result[i] = recipeData.totalPrice(result[i]);
                    }
                    response.render("pages/search_results",{resultData : result, keyword : keyword, loginFlag: request.cookies.currentSessionId, adminFlag: request.cookies.isAdmin, pageTitle: "Search Results", cartCount: cart.recipes.length})
                });
            }).catch(function(errorMessage){
                console.log(errorMessage);
            });
        }).catch(function(errorMessage){
            response.redirect("/login");
        });
    }
    else
    {
        var keyword = request.body.keyword;
        recipeData.searchDB(keyword).then(function(result) {
            for(var i=0; i<result.length; i++)
            {
                result[i] = recipeData.totalPrice(result[i]);
            }
            response.render("pages/search_results",{resultData : result, keyword : keyword, loginFlag: request.cookies.currentSessionId, adminFlag: request.cookies.isAdmin, pageTitle: "Search Results"})
        });
    }
});


app.get("/products/:id", function(request,response){


    if(request.cookies.currentSessionId){
        usersData.getUserBySessionId(request.cookies.currentSessionId).then(function (user) {
            cartData.getCart(user[0].cartId).then(function (cart) {
                recipeData.getRecipe(request.params.id).then(function(recipe){
                response.render("pages/product",{resultData: recipe, loginFlag: request.cookies.currentSessionId, adminFlag: request.cookies.isAdmin, pageTitle: "Recipe", cartCount: cart.recipes.length});
                    },function(errorMessage) {
                        response.status(500).json({ error: errorMessage });
                });
            }).catch(function(errorMessage){
                console.log(errorMessage);
            });
        }).catch(function(errorMessage){
            response.redirect("/login");
        });
    }
    else
    {
        recipeData.getRecipe(request.params.id).then(function(recipe){
            response.render("pages/product",{resultData: recipe, loginFlag: request.cookies.currentSessionId, adminFlag: request.cookies.isAdmin, pageTitle: "Recipe"});
            },function(errorMessage) {
                response.status(500).json({ error: errorMessage });
            });
    }


});

app.post("/cart/save", function(request, response) {
    usersData.getUserBySessionId(request.cookies.currentSessionId).then(function (user) {
        cartData.updateCart(user[0].cartId, request.body.recipes).then(function() {
            response.status(200).json({message: "Cart saved"});
        }, function(errorMessage) {
            response.status(500).json({message: errorMessage});
        });
    }, function (errorMessage) {
        response.redirect("/login");
    });
});

app.post("/cart/add", function(request, response) {
    usersData.getUserBySessionId(request.cookies.currentSessionId).then(function (user) {
        cartData.addRecipeToCart(user[0].cartId, request.body).then(function() {
            response.status(200).json({message: "Product added to Cart"});
        }, function(errorMessage) {
            response.status(500).json({message: errorMessage});
        });
    }, function (errorMessage) {
        response.redirect("/login");
    });
});

app.get("/cart", function(request, response) {
    usersData.getUserBySessionId(request.cookies.currentSessionId).then(function (user) {
        cartData.getCart(user[0].cartId).then(function (cart) {
            cartData.displayCart(cart).then(function(displayCart) {

                response.render("pages/cart", { pageTitle: "Shopping Cart", cart: displayCart, loginFlag: request.cookies.currentSessionId, adminFlag: request.cookies.isAdmin, cartCount: cart.recipes.length });
            }).catch(function(error){
                console.log(error);
            });
        }).catch(function(errorMessage){
            console.log(errorMessage);
        });
    }).catch(function(errorMessage){
        response.redirect("/login");
    });
});

app.post("/checkout",function(request,response){
    var priceInfo = JSON.parse(request.body.priceInfo);
    usersData.getUserBySessionId(request.cookies.currentSessionId).then(function(user){
        cartData.getCart(user[0].cartId).then(function (cart) {
            cartData.displayCart(cart).then(function(displayCart) {
                response.render("pages/checkout_page", { pageTitle: "Checkout page", user:user[0], cart: displayCart, priceInfo: priceInfo, loginFlag: request.cookies.currentSessionId, adminFlag: request.cookies.isAdmin, cartCount: cart.recipes.length });
            }).catch(function(error){
                console.log(error);
            });
        }).catch(function(errorMessage){
            console.log(errorMessage);
        });
    }).catch(function(errorMessage){
        response.redirect("/login");
    });

});


app.post("/add/favorite", function(request, response) {
	//console.log("recipe ID ::"+request.body.recipeID + " body"+request.body);
    usersData.getUserBySessionId(request.cookies.currentSessionId).then(function (user) {
        usersData.addRecipeToFavorites(user[0]._id, request.body.recipeID).then(function() {
            response.status(200).json({message: "Favorites added to the user"});
        }, function(errorMessage) {
            response.status(500).json({message: errorMessage});
        });
    }, function (errorMessage) {
        response.redirect("/login");
    });
});

app.post("/remove/favorite", function(request, response) {
    usersData.getUserBySessionId(request.cookies.currentSessionId).then(function (user) {
        usersData.removeRecipeFromFavorites(user[0]._id, request.body.recipeID).then(function() {
            response.status(200).json({message: "Favorite removed from user"});
        }, function(errorMessage) {
            response.status(500).json({message: errorMessage});
        });
    }, function (errorMessage) {
        response.redirect("/login");
    });
});

app.post("/order",function(request,response){
    usersData.getUserBySessionId(request.cookies.currentSessionId).then(function(user){
          //console.log("REached");
        usersData.updateUser(request.cookies.currentSessionId, request.body.first_name, request.body.last_name, request.body.country, request.body.address, request.body.city, request.body.state, 
            request.body.zip_code,request.body.phone_number,request.body.car_number).then(function(result){
                if(result==true)
                    console.log("User profile updated");
            }).catch(function(error){
                console.log(error);
            });
            placeorder();

    }).catch(function(errorMessage){
        response.redirect("/login");
    });
});

// We can now navigate to localhost:3000
app.listen(3000, function () {
    console.log('Your server is now listening on port 3000! Navigate to http://localhost:3000 to access it');
});
