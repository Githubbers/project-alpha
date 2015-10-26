var MongoClient = require('mongodb').MongoClient;

module.exports = {
    
    insert: function(reqBody) {
        
        MongoClient.connect('mongodb://' + process.env.IP + '/decodemtl', function(err, db) {
    
            db.collection("pullRequests")
            .findOne({
                'pull_request.id': reqBody.pull_request.id,
                'pull_request.updated_at': reqBody.pull_request.updated_at
            }, function(err, res) {
                
                if (res) {
                    console.log("This pull_request hook is a duplicate. Not inserting it\n");
                    db.close();
                }
                else {
                    
                    db.collection("members")
                    .findOne({
                        "id": reqBody.sender.id
                    }, function(err, res1) {
                        
                        if(res1) {
                            
                            db.collection('pullRequests').insert(reqBody, function(err) {
    
                                if (err) {
                                    console.error(err);
                                }
                                else {
                                    console.log("pull_request hook inserted to MongoDb\n");
                                }
                                
                        
                            });
                            
                        }
                        else {
                            console.log("This pull request hook is not from a member. Not inserting it.")
                        }
                        db.close();
                    })

                }
                
            });
            
        });
        
    }
   
};
