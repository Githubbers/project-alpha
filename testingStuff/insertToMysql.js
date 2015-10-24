var sampleAPIs = require('./pull_api_samples.js');

var mysql = require('mysql');
var Promise = require('bluebird');
Promise.promisifyAll(mysql);
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);




// function insertToMysql(reqBody) {

//     var connection = mysql.createConnection({
//         host: process.env.IP,
//         user: process.env.C9_USER,
//         password: '',
//         database: 'githubbers'
//     });
//     connection.connect();

//     //Inserting pullEvent
//     var queryStr = 'INSERT INTO pullEvents '
//     +'(userId, pullRequestId, action, time) '
//     +'VALUE ('+reqBody.sender.id+', '+reqBody.pull_request.id+', "'+reqBody.action+'", "'+reqBody.pull_request.updated_at+'");';

//     connection.query(queryStr, function(err, rows, fields) {

//         //Inserting pullRequest
//         //Check if pullRequest already exists if so, update it, if not, insert it
//         queryStr = 'SELECT * FROM pullRequests '
//         +'WHERE id='+reqBody.pull_request.id+';';

//         connection.query(queryStr, function(err, rows, fields) {

//             rows.forEach( function(row) {

//             if (rows.length === 0) {

//                 var queryStr = 'INSERT INTO pullRequests '
//                 +'(id, title, baseUserId, baseRepoId, baseBranch, '
//                 +'headUserId, headRepoId, headBranch, '
//                 +'createdAt, closedAt, status) '
//                 +'VALUE ('+reqBody.pull_request.id+', "'+reqBody.pull_request.title+'", '
//                 +reqBody.pull_request.base.user.id+', '+reqBody.pull_request.base.repo.id+', "'
//                 +reqBody.pull_request.base.ref+'", '+reqBody.pull_request.head.user.id+', '
//                 +reqBody.pull_request.head.repo.id+', "'+reqBody.pull_request.head.ref+'", "'
//                 +reqBody.pull_request.created_at+'", NULL, "open");';

//                 console.log(queryStr);

//             }
//             else if (rows.length === 1) {

//                 if (rows[0].action === 'opened' || rows[0].action === "reopened") {
//                     var status = "open";
//                     var closedTime = 'NULL';
//                 }
//                 else if (rows[0].action === 'closed') {
//                     status = "closed";
//                     closedTime = '"'+reqBody.pull_request.updated_at+'"';
//                 }
//                 queryStr = 'UPDATE pullRequests '
//                 +'SET closedAt = '+closedTime+', status = "'+status+'" '
//                 +'WHERE id = '+rows[0].id+';';
//             }

//             connection.query(queryStr, function(err, rows, fields) {
//                 connection.end();
//             });

//         });

//     });

// }

function insertToMysql(reqBody) {

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

    connection.queryAsync(queryStr)
    
    .then( function(results) {
        
        // Inserting datas into TABLE pullRequest the following:
        // If pullRequest already exists, update it
        // If pullRequest doesn't exist, update it
        return connection.queryAsync("SELECT id FROM pullRequests WHERE id=" + reqBody.pull_request.id + ';');

    })
    
    .spread( function(rows, fields) {
        
        if (rows.length === 0) {
            
            var queryStr = 'INSERT INTO pullRequests'
            +'(id, title, '
            + 'baseUserId, baseRepoId, baseBranch, '
            +'headUserId, headRepoId, headBranch, '
            +'createdAt, closedAt, status) '+
            'VALUES (' + reqBody.pull_request.id+', "'+reqBody.pull_request.title+'", '+reqBody.pull_request.base.user.id+', '
            +reqBody.pull_request.base.repo.id+', "'+reqBody.pull_request.base.ref+'", '+reqBody.pull_request.head.user.id+', '
            +reqBody.pull_request.head.repo.id+', "'+reqBody.pull_request.head.ref+'", "'+reqBody.pull_request.created_at
            +'", NULL, "open");';
            
            return connection.queryAsync(queryStr)
            
        }
        else { return ;}
        
    }).then( function(results) {
        connection.end();
    });
}

sampleAPIs.forEach(function(sample) {
    insertToMysql(sample);

});