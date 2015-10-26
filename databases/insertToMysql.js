var sampleAPIs = require('./pull_api_samples.json');

var mysql = require('mysql');
var Promise = require('bluebird');
Promise.promisifyAll(mysql);
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

console.log(sampleAPIs);

function insertToMysql(inputArray, count) {
    
    if (!count) {
        var count=0;
    }
    var reqBody = inputArray[count];

    var connection = mysql.createConnection({
        host: process.env.IP,
        user: process.env.C9_USER,
        password: '',
        database: 'githubbers'
    });
    
    var queryStr = 'INSERT INTO pullEvents '
    +'(userId, pullRequestId, action, time) '
    +'VALUE (' + reqBody.sender.id + ', '
    + reqBody.pull_request.id + ', "'+reqBody.action+'", "'+reqBody.pull_request.updated_at+'");';
    
    console.log('1. Inserting pull Event');
    connection.queryAsync(queryStr)
    
    .then( function(results) {
        
        // Inserting datas into TABLE pullRequest the following:
        // If pullRequest already exists, update it
        // If pullRequest doesn't exist, create it
        console.log('2. Looking for existence of pullRequest '+reqBody.pull_request.id)
        return connection.queryAsync("SELECT id FROM pullRequests WHERE id=" + reqBody.pull_request.id + ';');

    })
    
    .spread( function(rows, fields) {
        
        if (rows.length === 0) {
            
            console.log("3. pullRequest "+reqBody.pull_request.id+" doesn't exist. Inserting it");
            
            //the pull request doesn't exist; insert it.
            var queryStr = 'INSERT INTO pullRequests'
            +'(id, title, '
            +'baseUserId, baseRepoId, baseBranch, '
            +'headUserId, headRepoId, headBranch, '
            +'createdAt, closedAt, status) '
            +'VALUES ('+reqBody.pull_request.id+', "'+reqBody.pull_request.title+'", '+reqBody.pull_request.base.user.id+', '
            +reqBody.pull_request.base.repo.id+', "'+reqBody.pull_request.base.ref+'", '+reqBody.pull_request.head.user.id+', '
            +reqBody.pull_request.head.repo.id+', "'+reqBody.pull_request.head.ref+'", "'+reqBody.pull_request.created_at
            +'", NULL, "open");';
            
            return connection.queryAsync(queryStr);

        }
        else {
            
            // The pull request exists; update it by fetching the last pullEvent
            // in descending chronological order, and updating the status of the pullRequest.
            console.log("3. pullRequest "+reqBody.pull_request.id+" exists. Updating it");
            return connection.queryAsync('SELECT action, time '
            +'FROM pullEvents WHERE pullRequestId='+reqBody.pull_request.id+' '
            +'ORDER BY time DESC LIMIT 1;')
            
            .spread( function(rows, fileds) {
                
                if (rows[0].action === "closed") {
                    var status = '"closed"';
                    var time = '"'+rows[0].time+'"';
                }
                else {
                    status = '"open"';
                    time = 'NULL';
                }
                
                var queryStr = 'UPDATE pullRequests '
                +'SET status='+status+', closedAt='+time+' '
                +'WHERE id='+reqBody.pull_request.id+';';
                
                return connection.queryAsync(queryStr);
                
            });
        
        }
        
    })
    .spread( function(rows, fields) {
        
        connection.end();
        if (count < inputArray.length-1) {
            insertToMysql(inputArray, count+1);
        }
        else {
            console.log("all done!");
        }
        
    });
}


insertToMysql(sampleAPIs);
