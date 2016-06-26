module.exports = function (app) {
    app.get('/browseShows/browse', browseHandler);
    //var tmdbService = require('/project/services/tmdb.service.server')(app);

    function browseHandler(req, res) {
        res.render('browseShows/browse')
    }
};