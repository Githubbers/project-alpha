var MongoClient = require('mongodb').MongoClient;

var members = require('./members_list.json');

MongoClient.connect('mongodb://' + process.env.IP + '/decodemtl', function(err, db) {
    
    db.collection("members").insert(members, function(err) {
        
        if (err) {
            console.error(err);
        }
        else {
            console.log("Members inserted into MongoDb.");
            db.close();
        }
        
    });
    
});