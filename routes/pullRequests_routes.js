var express = require('express'),
    router = express.Router(),
    app = express(),
    pullRequests = require('../controllers/pullRequests_controllers');

app.route("/")

    .get( function(req, res, next) {
        pullRequests.list( function(results) {
            res.json(results);
            res.end();
        });
    })
    
    .post( function(req, res, next) {
        pullRequests.insert(req);
    });

app.route('/countAll')

    .get( function(req, res, next) {
        pullRequests.list( function(results) {
            res.send('There are '+results.length+' pullRequests stored in database.');
            res.end();
        })
    })


module.exports = app;