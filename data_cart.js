var MongoClient = require('mongodb').MongoClient,
 settings = require('./config.js'),
 Guid = require('Guid');
 recipeData = require('./data_recipe.js');

var fullMongoUrl = settings.mongoConfig.serverUrl + settings.mongoConfig.database;
var exports = module.exports = {};

MongoClient.connect(fullMongoUrl)
    .then(function(db) {
        var cartCollection = db.collection("cart");
        
        // setup your exports!
                
        // return cart with id of cartId
        exports.getCart = function(cartId) {
            if (!cartId) {
                return Promise.reject("Cart ID not provided");
            }

            return cartCollection.find({_id: cartId}).limit(1).toArray().then(function(listOfCarts) {
                if (listOfCarts.length === 0) {
                    return Promise.reject("Could not find cart with id of " + cartId);
                }
                return listOfCarts[0];
            });
        };
        
        // return object with all cart data to display on cart page
        exports.displayCart = function(cart) {
            var recipeList = [];
            var count = 0;
            
            var prom = new Promise(function(resolve, reject) {
                // there were no recipe IDs (empty cart)
                if (cart["recipes"].length === 0) {
                    var emptyCart = {
                        "_id": cart["_id"],
                        "recipes": []
                    }
                    resolve(emptyCart);
                } else {
                    cart["recipes"].forEach(function(recipe) {
                        return recipeData.getRecipe(recipe["recipeId"]).then(function(returnedRecipe) {
                            var ingredients = [];
                            returnedRecipe["ingredients"].forEach(function(ingredient) {
                                ingredients.push(ingredientObject(recipe, ingredient));
                            });
                            recipeList.push(recipeObject(returnedRecipe, ingredients));
                            count++;
                            if (count === cart["recipes"].length) {
                                var displayCart = {
                                    "_id": cart["_id"],
                                    "recipes": recipeList
                                };
                                resolve(displayCart);
                            }
                        }, function(error) {
                            reject(error);
                        });
                    });
                }
            });
            
            return prom.then(function(cart) {
                return Promise.resolve(cart);
            }).catch(function(error) {
                return Promise.reject("something went wrong", error);
            });
        };
       
        // replace the list of recipes in the cart with the new list
        exports.updateCart = function(cartId, recipeList) {
            if (!cartId) {
                return Promise.reject("Cart ID not provided");
            }
            /*if (Array.isArray(recipeList) && recipeList.length <= 0) {
                return Promise.reject("Array is empty or not provided");
            }*/
            
            return cartCollection.updateOne({_id: cartId}, {recipes: recipeList}).then(function() {
                return exports.getCart(cartId);
            });
        };
        
        exports.addRecipeToCart = function(cartId, recipe) {
            return cartCollection.update({ _id: cartId }, { $push: { "recipes": recipe }}).then(function() {
                    //return Promise.resolve("remove this later");
                    return exports.getCart(cartId);
                });
        };
        
        // delete the cart
        exports.deleteCart = function(cartId) {
            if (!cartId) {
                return Promise.reject("Cart ID not provided");
            }
            
            return cartCollection.deleteOne({_id: cartId}).then(function(deletionInfo) {
                if (deletionInfo.deletedCount === 0) {
                    Promise.reject("Could not find cart with id " + cartId + " to delete");
                }
                
                return true;
            });
        };
        
        exports.createCart = function(cartId) {
            return cartCollection.insertOne({_id: cartId, recipes: []}).then(function(newCart) {
                return newCart.insertedId;
            }).then(function(newId) {
                return exports.getCart(newId);
            });
        };
        
        function ingredientObject(recipe, ingredient) {
            return {
                "ingredientId": ingredient["_id"],
                "ingredientName": ingredient["name"],
                "price": ingredient["price"],
                "minQuantity": ingredient["min_q"],
                "quantity": recipe[ingredient["_id"]]
            };
        }
        
        function recipeObject(recipe, ingredients) {
            return {
                "recipeId": recipe["_id"],
                "recipeName": recipe["name"],
                "listOfIngredients": ingredients
            };
        }

    });