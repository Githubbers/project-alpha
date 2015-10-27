var documents = require('./pull_api_samples.js');
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://' + process.env.IP + '/githubWebHooks', function(err, db) {
    
    if(err) {console.error(err);}
    console.log("Connected correctly to server.");
    
    var cursor = db.collection('pullRequests').find();
    cursor.each( function(err, doc) {
        if(err) {
            console.error(err);
        }
        else {
            if (doc === null) {
                db.close();
            }
            else {
                db.collection('coreMetrics').insertOne({
                    pullRequestId:  doc.pull_request.id,
                    action:         doc.action,
                    created_at:     doc.pull_request.created_at,
                    updated_at:     doc.pull_request.updated_at,
                    closed_at:      doc.pull_request.closed_at,
                    baseUserName:   doc.pull_request.base.user.login,
                    baseUserId:     doc.pull_request.base.user.id,
                    baseRepoName:   doc.pull_request.base.repo.name,
                    baseRepoId:     doc.pull_request.base.repo.id,
                    headUserName:   doc.pull_request.head.user.login,
                    headUserId:     doc.pull_request.head.user.id,
                    headRepoName:   doc.pull_request.head.repo.name,
                    headRepoId:     doc.pull_request.head.repo.id
                });
            }
        }
    });
    
    
});