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
        
        // create cart for user with userId with a list of recipeIds
        exports.createCart = function(userId, listOfRecipeIds) {
            if (!userId) {
                return Promise.reject("User ID not provided");
            }
            if (Array.isArray(listOfRecipeIds) && listOfRecipeIds.length <= 0) {
                return Promise.reject("Array is empty or not provided");
            }
            
            return cartCollection.insertOne({_id: Guid.create().toString(), recipeIds: listOfRecipeIds}).then(function(newCart) {
                return newCart.insertedId;
            }).then(function(newId) {
                return exports.getCart(newId);
            });
        };
        
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
        exports.buildDisplayCart = function(cart, userId) {            
            var listOfRecipes = [];
            var count = 0;
            
            var prom = new Promise(function(resolve, reject) {
                cart["recipeIds"].forEach(function(recipeId) {
                    return recipeData.getRecipe(recipeId).then(function(recipe) {
                        var ingredients = [];
                        recipe["ingredients"].forEach(function(ingredient) {
                            var ingredientObject = {
                                "ingredientId": ingredient["_id"],
                                "ingredientName": ingredient["name"],
                                "price": ingredient["price"],
                                "minQuantity": ingredient["min_q"],
                                "quantity": 0
                            };
                            ingredients.push(ingredientObject);
                        });
                        var recipeObject = {
                            "recipeId": recipe["_id"],
                            "recipeName": recipe["name"],
                            "listOfIngredients": ingredients
                        };
                        listOfRecipes.push(recipeObject);
                        count++;
                        if (count === cart["recipeIds"].length) {
                            var displayCart = {
                                "_id": cart["_id"],
                                "userId": userId,
                                "recipes": listOfRecipes
                            };
                            resolve(displayCart);
                        }
                    }, function(error) {
                        return Promise.reject(error);
                    });
                });
            });
            
            return prom.then(function(cart) {
                return Promise.resolve(cart);
            }).catch(function() {
                return Promise.reject("something went wrong");
            });
        };
        
        // replace the list of recipes in the cart with the new list
        exports.modifyCart = function(cartId, listOfRecipeIds) {
            if (!cartId) {
                return Promise.reject("Cart ID not provided");
            }
            if (Array.isArray(listOfRecipeIds) && listOfRecipeIds.length <= 0) {
                return Promise.reject("Array is empty or not provided");
            }
            
            return cartCollection.updateOne({_id: cartId}, {recipeIds: listOfRecipeIds}).then(function() {
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
    });