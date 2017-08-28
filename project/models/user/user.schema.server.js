module.exports = function () {
    var mongoose = require('mongoose');

    var UserSchema = mongoose.Schema({
        username: String,
        password: String,
        firstName: String,
        lastName: String,
        email: String,
        lastSeen: {
            type: Date,
            default: Date.now
        }
        shows: [{
            name: String,
            tmdbId: String
        }],
        follows: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        dateCreated: {
            type: Date,
            default: Date.now
        },
        facebook: {
            id: String,
            token: String
        },
        google: {
            id: String,
            token: String
        }
    }, {collection: "project.user"});
    
    return UserSchema;
};