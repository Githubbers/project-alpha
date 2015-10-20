console.log("running");
var express = require('express');
var url = require('url');
var http = require('http');
var request = require('request');
var app = express();
var bodyParser = require("body-parser");
var jsonfile = require('jsonfile');
var mongoose = require('mongoose');

mongoose.connect('mongodb://' + process.env.IP + '/data', function(err, res) {
  console.log(err);
});

var db = mongoose.connection;

app.use(bodyParser.json());

var pullSchema = new mongoose.Schema({
  action: "string",
  username: "string",
  createdAt: "string",
  closedAt: "string",
  title: "string"
});

var pullRequest = mongoose.model('pullRequest', pullSchema);

app.get('/copyfile', function(request, response) {
  
  var file = 'data.json';
  jsonfile.readFile(file, function(err, obj) {
    
    obj.forEach( function(pReq) {
      new pullRequest({
        action: pReq.action,
        username: pReq.username,
        createdAt: pReq.createdAt,
        closedAt: pReq.closedAt,
        title: pReq.title
      })
      .save( function(err, doc) {
        if (err) {
          console.error(err);
        }
        else {
          console.log(doc);
        }
      });
    });
    
    pullRequest.find( function(err, docs) {
      response.send(docs);
      response.end();
    })
    
  });
});

app.get('/display', function(req, res) {
  pullRequest.find( function(err, pr) {
    res.send(pr);
    res.end();
  });
});

app.get('/remove', function(req, res) {
  pullRequest.remove({}, function(err, docs) {
    res.send(docs);
    res.end();
  });
 
});

app.post('/', function(req, res) {
  new pullRequest({
    action: req.body.action,
    username: req.body.pull_request.user.login,
    createdAt: req.body.pull_request.created_at,
    closedAt: req.body.pull_request.closed_at,
    title: req.body.pull_request.title
  })
  .save( function(err, doc) {
    if (err) {
      console.error(err);
    }
    else {
      console.log(doc);
    }
    res.end();
  });
})

var server = app.listen(process.env.PORT, process.env.IP, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});