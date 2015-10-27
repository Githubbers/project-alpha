var db = require('./mongo.js');

module.exports = {
    
    insert: function(reqBody) {
            
        db().collection("members").findOne({
            "id": reqBody.sender.id
        }, function(err, res2) {
            
            if (res2) {
                
                db().collection("comments").findOne({"comment.id": reqBody.comment.id}, function(err, res) {
            
                    if(res) {
                        console.log("This comment hook is a duplicate. Not inserting it.\n");
                    }
                    else {
                        console.log("fetching the id of the Pull request of the comment.");
                        db().collection('pullRequests')
                        .findOne( {"pull_request.url" : reqBody.issue.pull_request.url}, function(err, res1) {
                                
                            reqBody.issue.pull_request.id = res1.pull_request.id;
                            
                            db().collection('comments').insert(reqBody, function(err) {
                                
                                if(err) {
                                    console.error(err);
                                }
                                else {
                                    console.log("Comment hook inserted to MongoDb.\n");
                                }
                                
                            });
                            
                        });
        
                    }
                    
                });

            }
            else {
                console.log("This comment is not from a member. Not inserting it.");
            }
            
        });
        
    }

};