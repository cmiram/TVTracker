module.exports = function(app) {
    var request = require('request');

    var baseUrl = 'http://api.tvmaze.com';

    app.get('/api/tvmaze/show/:id/:season/:episode', showByEpisode);

    function showByEpisode(req, res) {
        var showId = req.params.id;
        var season = req.params.season;
        var episode = req.params.episode;
        var url = baseUrl + '/shows/' + showId + '/episodebynumber?season=' + season + '&number=' + episode;

        request(url, function(error, response, body) {
            if(!error && response.statusCode === 200) {
                res.json(body);
            }
            else if(response.statusCode === 404) {
                res.json(error);
            }
            else {
                res.status(400).send('error with api call');
            }
        });
    }
};