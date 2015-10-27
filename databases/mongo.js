var MongoClient = require('mongodb').MongoClient;

var db;
module.exports = function() {
    return db;
};

MongoClient.connect('mongodb://' + process.env.IP + '/decodemtl', function(err, database) {
    if (err) {
        console.error('Couldnt connect to Mongo:', err);
    }
    else {
        db = database;
    }
});