module.exports = function(app) {
    var models = require("./models/models.server.js")();
    
    var userService = require('./services/user.service.server')(app, models);
    var epguidesService = require('./services/epguides.service.server')(app);
    var tmdbService = require('./services/tmdb.service.server')(app);
    var omdbService = require('./services/omdb.service.server')(app);
    var tvmazeService = require('./services/tvmaze.service.server')(app);
};

