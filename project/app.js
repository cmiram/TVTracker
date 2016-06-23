module.exports = function(app) {
    var models = require("./models/models.server.js")();
    

    var userService = require('./services/user.service.server')(app, models);
    var epguidesService = require('./services/epguides.service.server')(app);
    var tmdbService = require('./services/tmdb.service.server')(app);
};
