var MongoClient = require('mongodb').MongoClient;

module.exports = {
    
    insert: function(reqBody) {
        
        MongoClient.connect('mongodb://' + process.env.IP + '/decodemtl', function(err, db) {
    
            db.collection("forkees")
            .findOne({
                "forkee.id": reqBody.forkee.id
            }, function(err, res) {
                
                if (res) {
                    console.log("This forkee hook is a duplicate. Not inserting it\n");
                    db.close();
                }
                else {
                    
                    db.collection("members").findOne( {
                        "id": reqBody.forkee.owner.id
                    }, function(err, res1) {
                        
                        if(res1) {
                            
                            db.collection('forkees').insert(reqBody, function(err) {
    
                                if (err) {
                                    console.error(err);
                                }
                                else {
                                    console.log("forkee hook inserted to MongoDb");
                                }
                        
                            });

                        }
                        else {
                            console.log("This forkee is not from a member. Not inserting it.")
                        }
                        db.close();

                    })
 
                }
                
            });
            
        });
        
    }
   
};