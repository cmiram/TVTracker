module.exports = function (app) {
    app.get('/browseShows/browse', browseHandler);
    app.get('/project/services/tmdb.service.server.js');

    function browseHandler(req, res) {
        res.render('browseShows/browse')
    }
};