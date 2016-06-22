module.exports = function() {
<<<<<<< HEAD
    
    var userModel = require('./user/user.model.server.js')();
=======
    var userModel = require('./user/user.model.server.js');
>>>>>>> added directory structure for serverside files
    
    var models = {
        userModel: userModel
    };
    
    return models;
};