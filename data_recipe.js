var MongoClient = require('mongodb').MongoClient,
 settings = require('./config.js'),
 runStartupForRecipe = require("./startup_recipe.js"),
 runStartupForUsers = require("./startup_users.js"),
 Guid = require('Guid');

var fullMongoUrl = settings.mongoConfig.serverUrl + settings.mongoConfig.database;
runStartupForRecipe(); // Creating db and recipe collections

runStartupForUsers(); // Creating users collections


var exports = module.exports = {};

MongoClient.connect(fullMongoUrl)
    .then(function(db) {
        var myCollection = db.collection("recipe");
        
        // setup your exports!
        exports.searchDB = function(keyword){
        	myCollection.find( { $text: { $search: keyword } } ).toArray().then(function(searchResults){

        	});	
        }
    });
