var MongoClient = require('mongodb').MongoClient,
    settings = require('./config.js'),
    Guid = require("guid");

var fullMongoUrl = settings.mongoConfig.serverUrl + settings.mongoConfig.database;

function runSetup() {
    return MongoClient.connect(fullMongoUrl)
        .then(function(db) {
            return db.collection("users").drop().then(function() {
                return db;
            }, function() {
                return db;
            });
        }).then(function(db) {
            return db.createCollection("users");
        });
    };

var exports = module.exports = runSetup;