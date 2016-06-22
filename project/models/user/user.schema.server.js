module.exports = function () {
    var mongoose = require('mongoose');

    var UserSchema = mongoose.schema({
        username: String,
        password: String,
        firstName: String,
        lastName: String,
        email: String,
        shows: [Number],
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