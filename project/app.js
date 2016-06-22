module.exports = function(app) {

    var models = require("./models/models.server.js")();
    

<<<<<<< HEAD
    var userService = require('./services/user.service.server')(app, models);
    var epguidesService = require('./services/epguides.service.server')(app);
    var tmdbService = require('./services/tmdb.service.server')(app);
};
=======
    require("./services/user.service.server.js")(app, models);
};

>>>>>>> added directory structure for serverside files
