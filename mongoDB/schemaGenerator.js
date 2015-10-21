var jsonfile = require('jsonfile');
var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require("body-parser");

var app = express();

app.use(bodyParser.json());

var objInstance = require('./pullRequestInstance.js')

function printTypeOf(objInstance) {
    
    for (var key in objInstance) {
        
        if( typeof objInstance[key] === "object" && !Array.isArray(objInstance[key]) && objInstance[key]) {
            printTypeOf(objInstance[key]);
        }
        else if (typeof objInstance[key] !== "object" && typeof objInstance[key]) {
            objInstance[key] = typeof objInstance[key];
        }
        else {
            objInstance[key] = "string";
        }
        
    }
}

printTypeOf(objInstance);

jsonfile.writeFile("./mongoDB/pullSchemaInstance.json", objInstance, function(err) {
    if (err) {
      console.error(err);
    }
});