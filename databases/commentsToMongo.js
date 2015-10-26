var MongoClient = require('mongodb').MongoClient;

module.exports = {
    
    insert: function(reqBody) {
 
        MongoClient.connect('mongodb://' + process.env.IP + '/decodemtl', function(err, db) {
            
            db.collection("members").findOne({
                "id": reqBody.sender.id
            }, function(err, res2) {
                
                if (res2) {
                    
                    db.collection("comments").findOne({"comment.id": reqBody.comment.id}, function(err, res) {
                
                        if(res) {
                            console.log("This comment hook is a duplicate. Not inserting it.\n");
                            db.close();
                        }
                        else {
                            console.log("fetching the id of the Pull request of the comment.\n")
                            db.collection('pullRequests')
                            .findOne( {"pull_request.url" : reqBody.issue.pull_request.url}, function(err, res1) {
                                    
                                reqBody.issue.pull_request.id = res1.pull_request.id;
                                
                                db.collection('comments').insert(reqBody, function(err) {
                                    
                                    if(err) {
                                        console.error(err);
                                    }
                                    else {
                                        console.log("Comment hook inserted to MongoDb.");
                                    }
                                    db.close();
                                });
                                
                            });
            
                        }
                        
                    });

                }
                else {
                    console.log("This comment is not from a member. Not inserting it.");
                    db.close();
                }
                
            });

        });
        
    }

};