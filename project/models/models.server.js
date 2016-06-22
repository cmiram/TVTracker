module.exports = function() {
    var userModel = require('./user/user.model.server.js');
    
    var models = {
        userModel: userModel
    };
    
    return models;
};