var express = require('express'),
    router = express.Router(),
    app = express(),
    pullRequests = require('../controllers/pullRequests_controller');

app.route("/")

    .get(function(req, res, next) {
        pullRequests.list( function(results) {
            res.send(results);
        })
    });

// app.route('/new').
// get(function(req, res, next) {
//         res.render('articles/new');
//     })
//     .post(function(req, res, next) {
//         articles.create(req.body, function(err, result) {
//             res.redirect('/articles/' + result.insertId);
//         });
//     });


module.exports = app;