var express = require('express');
var bodyParser = require("body-parser");
var MongoClient = require('mongodb').MongoClient;

var app = express();

app.use(bodyParser.json());

module.exports = {
    
    list: function(callback) {
        MongoClient.connect('mongodb://' + process.env.IP + '/githubWebHooks', function(err, db) {
            var results = [];
            db.collection('pullRequests').find().each( function(err, doc) {
                if (err) { console.error(err) }
                else {
                    if (doc === null) { 
                        db.close();
                        callback(results);
                    }
                    else {
                        results.push(doc);
                    }
                }
            });
        });
    },
    
    insert: function(req) {
        
        var pullform = new pullForm(req.body)
        .save( function(err, doc) {
            if (err) {
              console.error(err);
            }
            else {
              console.log("succesfully inserted!");
            }
        });
        
    }
    
};