var mongoose = require('mongoose');

module.exports = {
    
    transfer: function(documents) {
        
        mongoose.connect('mongodb://' + process.env.IP + '/data', function(err, res) {
          console.log(err);
        });
        
        var db = mongoose.connection;
    }
    
}