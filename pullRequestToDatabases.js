var MongoClient = require('mongodb').MongoClient;
var mysql = require('mysql');

module.exports = {
    
    toMongoDb: function(reqBody) {
        
        MongoClient.connect('mongodb://' + process.env.IP + '/githubbers', function(err, db) {
            
            db.collection('pullRequestAPIs').insertOne(reqBody, function(err) {
                
                if(err) {console.error(err);}
                else {
                    console.log("API inserted to MongoDb.");
                }
                
            });
            
        });
        
    },

    toMysql: function(reqBody) {

        var mysqlConnection = mysql.createConnection({
            host: process.env.IP,
            user: process.env.C9_USER,
            password: '',
            database: 'githubbers'
        });
        mysqlConnection.connect();
        
        //Inserting pullEvent
        var queryStr = 'INSERT INTO pullEvents '
        +'(pullRequestId, action) '
        +'VALUE ('+reqBody.pull_request.id+', "'+reqBody.action+'");';
        
        mysql.connection.query(queryStr, function(err, rows, fields) {
            console.log("Inserted new pullEvent into MySQL.");
        });
        
        //Inserting pullRequest
        //Check if pullRequest already exists if so, update it, if not, insert it
        queryStr = 'SELECT * FROM pullRequests '
        +'WHERE id='+reqBody.pull_request.id+';';
        
        mysql.connection.query(queryStr, function(err, rows, fields) {
            
            if (rows.length === 0) {
                
                var queryStr = 'INSERT INTO pullRequests '
                +'(id, title, baseUserId, baseRepoId, baseBranch, '
                +'headUserId, headRepoId, headBranch, '
                +'createdAt, updatedAt, status) '
                +'VALUES ('+reqBody.pullRequest.id+', "'+reqBody.pull_request.title+'", '
                +reqBody.pull_request.base.user.id+', '+reqBody.pull_request.base.repo.id+', "'
                +reqBody.pull_request.base.ref+'", '+reqBody.pull_request.head.user.id+', '
                +reqBody.pull_request.head.repo.id+', "'+reqBody.pull_request.head.ref+'", '
                +'NOW(), "NULL", open")';
                
            }
            else if (rows.length === 1) {
                
                if (rows[0].action === 'opened' || rows[0].action === "reopened") {
                    var status = "open";
                    var closedTime = '"NULL"';
                }
                else if (rows[0].action === 'closed') {
                    var status = "closed";
                    var closedTime = "NOW()";
                }
                var queryStr = 'UPDATE pullRequests '
                +'SET updatedAt = '+closedTime+', status = "'+status+'" '
                +'WHERE id = '+rows[0].id+';';
            }
            
            mysql.connection.query(queryStr, function(err, rows, fields) {
                console.log("pullRequest inserted/updated tu MySQL.");
            });
            
        });

        mysqlConnection.end();
        
    }

};

            

   


