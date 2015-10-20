var express = require('express');
var url = require('url');
var http = require('http');
var request = require('request');
var app = express();
var bodyParser = require("body-parser");
var jsonfile = require('jsonfile');

var file = 'data.json';

app.use(bodyParser.json());

app.post('/', function(req, res) {

  console.log(Object.keys(req.body));

  var data = {
    action: req.body.action,
    username: req.body.pull_request.user.login,
    createdAt: req.body.pull_request.created_at,
    closedAt: req.body.pull_request.closed_at,
    title: req.body.pull_request.title
  };

  var dataArray = [];
  jsonfile.readFile(file, function(err, obj) {
    dataArray = obj;
    dataArray.push(data);
    console.log(dataArray);

    jsonfile.writeFile(file, dataArray, function(err) {
      console.error(err);
      res.end();
    });
    
  });

});



// var dataArray = [];
// jsonfile.readFile(file, function(err, obj) {
//   dataArray = obj;
//   console.log("inside");
//   console.log(dataArray);
// });

// console.log("outside");
// console.log(dataArray);

var server = app.listen(process.env.PORT, process.env.IP, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});