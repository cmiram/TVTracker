module.exports = function(app) {
    var request = require('request');
    
    var baseUrl = 'https://epguides.frecar.no';

    app.get('/api/epguides/metadata/:show', showMetadata);
    app.get('/api/epguides/allepisodes/:show', allEpisodes);
    app.get('/api/epguides/:show/:season/:episode', specificEpisode);
    app.get('/api/epguides/:show/next', nextEpisode);
    app.get('/api/epguides/:show/last', lastEpisode);

    function showMetadata(req, res) {
        var show = req.params.show;
        request(baseUrl + '/show/' + show + '/info/', function(error, response, body) {
            if(!error && response.statusCode == 200) {
                res.json(body);
            }
            else {
                res.status(400).send('error with api call');
            }
        });
    }

    function allEpisodes(req, res) {
        var show = req.params.show;
        request(baseUrl + '/show/' + show + '/', function(error, response, body) {
            if(!error && response.statusCode == 200) {
                res.json(body);
            }
            else {
                res.status(400).send('error with api call');
            }
        });
    }

    function specificEpisode(req, res) {
        var show = req.params.show;
        var season = req.params.season;
        var episode = req.params.episode;
        request(baseUrl + '/show/' + show + '/' + season + '/' + episode + '/', function(error, response, body) {
            if(!error && response.statusCode == 200) {
                res.json(body);
            }
            else {
                res.status(400).send('error with api call');
            }
        });
    }

    function nextEpisode(req, res) {
        var show = req.params.show;
        request(baseUrl + '/show/' + show + '/next/', function(error, response, body) {
            if(!error && response.statusCode == 200) {
                res.json(body);
            }
            else {
                res.status(400).send('error with api call');
            }
        });
    }

    function lastEpisode(req, res) {
        var show = req.params.show;
        request(baseUrl + '/show/' + show + '/last/', function(error, response, body) {
            if(!error && response.statusCode == 200) {
                res.json(body);
            }
            else {
                res.status(400).send('error with api call');
            }
        });
    }
};