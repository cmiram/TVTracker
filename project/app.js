module.exports = function(app) {

    var models = require("./models/models.server.js");
    

    var userService = require('./services/user.service.server')(app, models);
};

