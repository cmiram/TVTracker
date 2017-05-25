module.exports = function(app) {
    var request = require('request');
    var apiKey = process.env.OMDB_API_KEY;

    var baseUrl = 'http://www.omdbapi.com/?';
    var endUrl = '&apikey=' + apiKey;

    app.get('/api/omdb/info/:imdbId', showData);

    function showData(req, res) {
        var imdbId = req.params.imdbId;
        var url = baseUrl + 'i=' + imdbId + endUrl;

        request(url, function(error, response, body) {
            if(!error && response.statusCode == 200) {
                res.json(body);
            }
            else if(response.statusCode == 404) {
                res.json(error);
            }
            else {
                res.status(400).send('error with api call');
            }
        });
    }
};