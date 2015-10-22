var express = require('express'),
    router = express.Router(),
    app = express(),
    pullRequests = require('../controllers/pullRequests_controllers'),
    coreMetrics = require('../controllers/coreMetrics_controllers');

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
    
app.route('/copyMetrics')

    .get( function(req, res, next) {
        pullRequests.list( function(results) {
            var filtered = [];
            results.forEach( function(doc) {
                filtered.push({
                    created_at:             doc.pull_request.created_at,
                    updated_at:             doc.pull_request.updated_at,
                    closed_at:              doc.pull_request.closed_at,
                    baseRepoId:             doc.pullResquest.base.id,
                    baseRepoName:           doc.pull_request.base.login,
                    userId:                 doc.pullResquest.head.id,
                    userName:               doc.pullResquest.head.login,
                });
            });
            coreMetrics.insert
            
        });
    });

module.exports = app;