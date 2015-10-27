var mysql = require('mysql');
var Promise = require('bluebird');
Promise.promisifyAll(mysql);
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

var MongoClient = require('mongodb').MongoClient;

var connection = mysql.createConnection({
    host: process.env.IP,
    user: process.env.C9_USER,
    password: '',
    database: 'githubbers'
});

MongoClient.connect('mongodb://' + process.env.IP + '/decodemtl', function(err, db) {
    
    db.collection("comments").find().toArray( function(err, docs) {
        
        insertToMysql(docs, db);
        
    });

});

function insertToMysql(inputArray, db, count) {
    
    if (!count) {
        count=0;
    }
    var reqBody = inputArray[count];
    
    var queryStr = 'INSERT INTO comments '
    +'(id, senderId, pullRequestId, content) '
    +'VALUE ('
    +reqBody.comment.id+', '+reqBody.comment.user.id+', '+reqBody.issue.pull_request.id+', "'+reqBody.comment.body+'"'
    +');';
    
    console.log('1. Inserting comments');
    connection.queryAsync(queryStr)

    .then( function(results) {
        
        if (count < inputArray.length-1) {
            insertToMysql(inputArray, db, count+1);
        }
        else {
            console.log("all done!");
            connection.end();
            db.close();
        }

    });

}
