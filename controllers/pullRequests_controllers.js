var express = require('express');
var bodyParser = require("body-parser");

var mongoose = require('mongoose');
var obj = require('../mongoDB/pullSchemaInstance.json');

var app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://' + process.env.IP + '/githubWebHooks', function(err, res) {
    if(err) {
        console.error(err);
    }
});
var pullSchema = new mongoose.Schema(obj, {collection: "pullRequests"});
var pullForm = mongoose.model("pullRequest", pullSchema);

module.exports = {
    
    list: function(callback) {
        
        
        pullForm.find( function(err, results) {
            
            if (err) {
                console.error(err);
            }
            callback(results);
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