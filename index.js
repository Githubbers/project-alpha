var express = require('express');
var url = require('url');
var http = require('http');
var request = require('request');
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.json());

app.post('/', function (req, res) {
  
  console.log(Object.keys(req.body));
  res.status(200).send('hello world');
  res.end('ending');
});

var server = app.listen(process.env.PORT, process.env.IP, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});