var MongoClient = require('mongodb').MongoClient;
var mysql = require('mysql');

MongoClient.connect('mongodb://' + process.env.IP + '/githubWebHooks', function(err, db) {

    var cursor = db.collection('pullRequests').find();
    cursor.each( function(err, doc) {
        
        if(err) {
            console.error(err);
        }
        else {
            
            if (doc === null) { db.close(); }
            
            else {
                
                console.log("inserting row");
                var mysqlConnection = mysql.createConnection({
                    host: process.env.IP,
                    user: process.env.C9_USER,
                    password: '',
                    database: 'githubbers'
                });
                mysqlConnection.connect();
                var toInsert = {
                    
                    pullRequestId:   doc.pull_request.id,
                    action:         doc.action,
                    createdAt:      doc.pull_request.created_at,
                    updatedAt:      doc.pull_request.updated_at,
                    closedAt:       doc.pull_request.closed_at,
                    baseUserName:   doc.pull_request.base.user.login,
                    baseUserId:     doc.pull_request.base.user.id,
                    baseRepoName:   doc.pull_request.base.repo.name,
                    baseRepoId:     doc.pull_request.base.repo.id,
                    headUserName:   doc.pull_request.head.user.login,
                    headUserId:     doc.pull_request.head.user.id,
                    headRepoName:   doc.pull_request.head.repo.name,
                    headRepoId:     doc.pull_request.head.repo.id,
                    
                };
                
                for(var key in toInsert) {
                    if (toInsert[key] === null) {
                        toInsert[key] = 'NULL';
                    }
                }
                
                var insertQuery = 'INSERT INTO pullRequests '
                +'(pullRequestId, action, createdAt, updatedAt, closedAt, '
                +'baseUserName, baseUserId, baseRepoName, baseRepoId, '
                +'headUserName, headUserId, headRepoName, headRepoId) '
                +'VALUE ('+toInsert.pullRequestId+', "'+toInsert.action+'", "'+toInsert.createdAt+'", "'
                +toInsert.updatedAt+'", "'+toInsert.closedAt+'", "'
                +toInsert.baseUserName+'", '+toInsert.baseUserId+', "'
                +toInsert.baseRepoName+'", '+toInsert.baseRepoId+', "'
                +toInsert.headUserName+'", '+toInsert.headUserId+', "'
                +toInsert.headRepoName+'", '+toInsert.headRepoId+');';
                
                // console.log(insertQuery+'\n');

                mysqlConnection.query(insertQuery, function(err, rows, field) {
                    
                    if(err) throw err;
                    
                    else {
                        console.log("Inserted into MySQL!");
                    }
                    
                });
                mysqlConnection.end();
                
            }

        }
    });
    

})