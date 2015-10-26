var express = require('express');
var url = require('url');
var http = require('http');
var request = require('request');
var app = express();
var bodyParser = require("body-parser");
var jsonfile = require('jsonfile');

app.use(bodyParser.json());

var pullRequestsToMongo = require('./databases/pullRequestsToMongo.js');
var commentsToMongo = require('./databases/commentsToMongo.js');
var forkessToMongo = require('./databases/forkeesToMongo.js');

app.post('/api/pullRequests/', function(req, res) {

   handleWebhook(req.body);
   res.end();

});

app.post('/api/comments/', function(req, res) {

   handleWebhook(req.body);
   res.end();

});

app.post('/api/allwebhooks/', function(req, res) {

   handleWebhook(req.body);
   res.end();

});

app.post('/decodeMTL')

var server = app.listen(process.env.PORT, process.env.IP, function() {
   var host = server.address().address;
   var port = server.address().port;

   console.log('Example app listening at http://%s:%s', host, port);
});


function handleWebhook(reqBody) {
   
   MongoClient.connect('mongodb://' + process.env.IP + '/decodemtl', function(err, db) {

         
      if (reqBody.hasOwnProperty("pull_request")) {
         console.log("\n"+reqBody.sender.login+" "+requBody.action+" a pull request");
         pullRequestsToMongo.insert(reqBody);
      }
      else if (reqBody.hasOwnProperty("comment")) {
         console.log("\n"+reqBody.comment.user.login+" commented on "+reqBody.issue.title);
         commentsToMongo.insert(reqBody);
      }
      else if (reqBody.hasOwnProperty("forkee")) {
         console.log("\n"+reqBody.owner.login+" forked "+reqBody.repository.name+" repository.");
         forkeesToMongo.insert(reqBody)
      }
      else {
         console.log("This web hook is non relevant. Not inserting it.");
      }

   
   });
   
}