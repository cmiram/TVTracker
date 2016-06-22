module.exports = function() {
    var mongoose = require('mongoose');
    var UserSchema = require('./user.schema.server.js')();
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
    function findUserById(userId) {
        return User.findOne({_id: userId});
    }

    function findUserByUsername(username) {
        return User.findOne({username: username});
    }

    function findUserByCredentials(username, password) {
        return User.findOne({username: username, password: password});
    }

    function updateUser(userId, newUser) {
        return User.update(
            {_id: userId},
            {$set: newUser}
        );
    }

    function deleteUser(userId) {
        return User.remove({_id: userId});
    }

    function pushShow(userId, showId) {
        return User.update(
            {_id: userId},
            {$pushAll: {shows: [showId]}}
        );
    }

    function pullShow(userId, showId) {
        return User.update(
            {_id: userId},
            {$pullAll: {shows: [showId]}}
        );
    }

    function pushFollow(userId, followId) {
        return User.update(
            {_id: userId},
            {$pushAll: {follows: [followId]}}
        );
    }

    function pullFollow(userId, followId) {
        return User.update(
            {_id: userId},
            {$pullAll: {follows: [followId]}}
        );
    }

    function findUserByFacebookId(facebookId) {
        return User.findOne({'facebook.id': facebookId});
    }

    function findUserByGoogleId(googleId) {
        return User.findOne({'google.id': googleId});
    }
<<<<<<< HEAD
};

=======
};
>>>>>>> updated user api to match new user model
