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
    
    db.collection("forkees").find().toArray( function(err, docs) {
        
        insertToMysql(docs, db);
        
    });

});

function insertToMysql(inputArray, db, count) {
    
    if (!count) {
        count=0;
    }
    var reqBody = inputArray[count];
    
    var queryStr = 'INSERT INTO forkees '
    +'(id, userId, repoId, createdAt) '
    +'VALUE ('
    +reqBody.forkee.id+', '+reqBody.forkee.owner.id+', '+reqBody.repository.id+', "'+reqBody.forkee.created_at+'"'
    +');';
    
    console.log('1. Inserting forkees');
    connection.queryAsync(queryStr)
    
    //Fetching the repo from where the forks come from.
    //If the repo doesn't exist, add it to TABLE repositories, else do nothing
    .then( function(results) {
        
        console.log("2. Looking for repository");
        
        var queryStr = 'SELECT id FROM repositories '
        +'WHERE id='+reqBody.repository.id+';';
        return connection.queryAsync(queryStr);

    }).spread( function(rows, fields) {
        
        if (rows.length === 0) {
            console.log("3. The repo doesn't exist. Inserting it to MySQL.");
            
            var queryStr = 'INSERT INTO repositories '
            +'(id, name) '
            +'VALUE ('+reqBody.repository.id+', "'+reqBody.repository.name+'");';
            
            return connection.queryAsync(queryStr);
        }
        else {
            console.log("3. The repo already exist. Do Nothing");
            return ;
        }
        
    })

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
