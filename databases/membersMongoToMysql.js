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
    
    db.collection("members").find().toArray( function(err, docs) {
        
        insertToMysql(docs, db);
        
    });

});

function insertToMysql(inputArray, db, count) {
    
    if (!count) {
        count=0;
    }
    var reqBody = inputArray[count];
    
    //If the id of the entry is not Ziaad, Kevin or Paule, insert it as a student in cohort 1
    //Else insert it as an instructor with no cohor
    if (reqBody.id === 7604518 || reqBody.id === 3919995 || reqBody.id === 3943143) {
        var type = '"instructor"';
        var cohort = 'NULL';
    }
    else {
        type = '"student"';
        cohort = 1;
    }
    
    var queryStr = 'INSERT INTO members '
    +'(id, loginName, fullName, profileUrl, avatarUrl, cohort, type) '
    +'VALUE ('
    +reqBody.id+', "'+reqBody.login+'", "'+reqBody.name+'", "'+reqBody.url+'", "'+reqBody.avatar_url+'", '+cohort+', '+type
    +');';
    
    console.log('1. Inserting member');
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
