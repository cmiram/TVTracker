module.exports = function() {
    var mongoose = require('mongoose');
    var UserSchema = require('./user.schema.server.js');
    var User = mongoose.model('User', UserSchema);

    var api = {
        createUser: createUser,
        findUserById: findUserById,
        findUserByUsername: findUserByUsername,
        findUserByCredentials: findUserByCredentials,
        updateUser: updateUser,
        deleteUser: deleteUser,
        pushShow: pushShow,
        pullShow: pullShow,
        pushFollow: pushFollow,
        pullFollow: pullFollow,
        findUserByFacebookId: findUserByFacebookId,
        findUserByGoogleId: findUserByGoogleId
    };
    return api;

    function createUser(user) {
        return User.create(user);
    }

    
}