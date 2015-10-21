var express = require('express');
var url = require('url');
var http = require('http');
var request = require('request');
var app = express();
var bodyParser = require("body-parser");
var jsonfile = require('jsonfile');
var mongoose = require('mongoose');

// var file = 'data.json';
// var rawfile = 'rawData.json';

// app.use(bodyParser.json());

// app.post('/', function(req, res) {

//   console.log(Object.keys(req.body));
  
//   jsonfile.writeFile(rawfile, req.body, function(err) {
//     if (err) {
//       console.error(err);
//     }
//     else {
      
//       var data = {
//         action:       req.body.action,
//         username:     req.body.pull_request.user.login,
//         userAvatar:   req.body.pull_request.user.avatar_url,
//         userRepoUrl:  req.body.pull_request.url,
//         createdAt:    req.body.pull_request.created_at,
//         closedAt:     req.body.pull_request.closed_at,
//         title:        req.body.pull_request.title
//       };

//       var dataArray = [];
//       jsonfile.readFile(file, function(err, obj) {
//         dataArray = obj;
//         dataArray.push(data);
//         console.log(dataArray);
    
//         jsonfile.writeFile(file, dataArray, function(err) {
//           console.error(err);
//           res.end();
//         });
        
//       });

//     }
    
//   });

// });



// var dataArray = [];
// jsonfile.readFile(file, function(err, obj) {
//   dataArray = obj;
//   console.log("inside");
//   console.log(dataArray);
// });

// console.log("outside");
// console.log(dataArray);

var pullRequests = require('./routes/pullRequests_routes');

app.use('/pullRequests', pullRequests);

var server = app.listen(process.env.PORT, process.env.IP, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});