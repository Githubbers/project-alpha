var express = require('express');
var url = require('url');
var http = require('http');
var request = require('request');
var app = express();
var bodyParser = require("body-parser");
var jsonfile = require('jsonfile');
var mongoose = require('mongoose');

app.use(bodyParser.json());

var file = './issue_samples.json';

app.post('/api/comments', function(req, res) {

  jsonfile.readFile(file, function(err, arr) {
    arr.push(req);

    jsonfile.writeFile(file, arr, function(err) {
      console.error(err);
      res.end();
    });

  });


});

var server = app.listen(process.env.PORT, process.env.IP, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});