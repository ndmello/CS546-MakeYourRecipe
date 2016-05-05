var MongoClient = require('mongodb').MongoClient,
 settings = require('./config.js'),
 Guid = require('Guid'),
 cartData = require('./data_cart.js');
var bcrypt = require("bcrypt-nodejs");

var fullMongoUrl = settings.mongoConfig.serverUrl + settings.mongoConfig.database;
var exports = module.exports = {};
var isMatch;

MongoClient.connect(fullMongoUrl)
    .then(function(db) {
        var usersCollection = db.collection("users");
        
          exports.getAllUsers = function() {

            
            // by calling .toArray() on the find cursor, it converts it to the promise that resolves
            // an array of all the results
            return usersCollection.find().toArray();
        };

        // we can still update our data module by adding properties here, even though it's inside a callback!
        exports.getUser = function(id) {
            if (!id) return Promise.reject("You must provide an ID");

            // by calling .toArray() on the function, we convert the Mongo Cursor to a promise where you can 
            // easily iterate like a normal array
            return usersCollection.find({ _id: id }).limit(1).toArray().then(function(listOfUsers) {
                if (listOfUsers.length === 0) throw "Could not find user with id of " + id;

                return listOfUsers[0];
            });
        };
		
		 // we can still update our data module by adding properties here, even though it's inside a callback!
        exports.getUserBySessionId = function(sessionId) {
            if (!sessionId) return Promise.reject("You must provide a sessionId");

            // by calling .toArray() on the function, we convert the Mongo Cursor to a promise where you can 
            // easily iterate like a normal array
            return usersCollection.find({ currentSessionId: sessionId }).limit(1).toArray().then(function(listOfUsers) {
                
                
                if (listOfUsers.length == 0) 
                {
                    return Promise.reject("No user with this sesisonID");
                }
                else
                {
                   return listOfUsers; 
                }
            });
        };

        // creating data in MongoDB is very easy, as we can just use a simple insert method
        exports.createUser = function(username, passwd ) {
           
		   
		    if (!username) return Promise.reject("You must provide an username");
			if (!passwd) return Promise.reject("You must provide a password");
			
				return usersCollection.find({ username: username }).limit(1).toArray().then(function(listOfUsers) {
                if (listOfUsers.length === 0)
				{ 
					return Promise.reject("User does not exist");
				}

                return Promise.resolve("User already exists");
            }).catch(function (err) {
                var cartGuid = Guid.create().toString();
                
                cartData.createCart(cartGuid);
				return usersCollection.insertOne({_id : Guid.create().toString(),
                username: username,
                cartId: cartGuid,
                encryptedPassword: bcrypt.hashSync(passwd),
                currentSessionId: Guid.create().toString(),
				profile:{ name: '', address: '', phone: '', credit_card_no: '', favorites: '' }}).then(function(newDoc) {
                return newDoc.insertedId;
            }).then(function(newId) {
                return exports.getUser(newId);
            });
				});
			
            
        }
		
		
	/*	exports.updateUser = function(sessionId, firstName, lastName, hobby, petName) {
               if (!sessionId) Promise.reject("You must provide a sessionId");
			   
            return usersCollection.updateOne({ currentSessionId: sessionId }, { $set: { "profile.firstName": firstName,"profile.lastName": lastName,"profile.hobby": hobby,"profile.petName": petName  } }).then(function() {
                return exports.getUserBySessionId(sessionId);
            });
        }; 
		*/
		
		exports.updateSessionId = function(userId, sessionId) {
			   if (!userId) Promise.reject("You must provide a userId");
               if (!sessionId) Promise.reject("You must provide a sessionId");
			   
            return usersCollection.updateOne({ _id: userId }, { $set: { currentSessionId: sessionId } }).then(function() {
                return exports.getUserBySessionId(sessionId);
            });
        }; 
		
		exports.removeSessionId = function(sessionId) {
               if (!sessionId) Promise.reject("You must provide a sessionId");
			   
            return usersCollection.update({ currentSessionId: sessionId }, { $unset: { "currentSessionId": "" } }).then(function() {
                return Promise.resolve("Successfully logged out");
            });
        }; 
		
		

        exports.validateUser = function(username, password){
                return usersCollection.find({username : username}).toArray().then(function(entry){
                    if(entry.length !== 1) return Promise.reject("Username "+username+" doesn't exists in the database.");
                    return entry;
                }).then(function(entry){
                    var res = bcrypt.compareSync(password, entry[0].encryptedPassword)
                        if (res === true) {
                              return true;
                        } else {
                            return Promise.reject("Password Doesn't Match.");
                        }
                    
                }).catch(function(error){
                    throw error;
                }).then(function(result){
                    var newSessionID = Guid.create().toString();
                    return usersCollection.update({ username: username }, { $set: { "currentSessionId": newSessionID } }).then(function() {
                    return newSessionID;
                        });
                });
        }
    });
