module.exports = function(app) {
    var request = require('request');
    var apiKey = process.env.TMDB_API_KEY;

    var baseUrl = "https://api.themoviedb.org/3/tv/";
    var endUrl = "?api_key=" + apiKey;


    app.get('/api/tmdb/topRated/:page', topRated);
    app.get('/api/tmdb/popular/:page', popular);
    app.get('/api/tmdb/search/:query', searchShows);
    app.get('/api/tmdb/:id/contentRating', contentRating);
    app.get('/api/tmdb/:id/credits', credits);
    app.get('/api/tmdb/:id/externalIds', externalIds);
    app.get('/api/tmdb/:id/images', showImages);
    app.get('/api/tmdb/:id/similar', similarShows);
    app.get('/api/tmdb/:id/videos', videos);
    app.get('/api/tmdb/:id', showInfo);
    app.get('/api/tmdb/onTheAir', nextSevenDays);
    app.get('/api/tmdb/airingToday/:page', airingToday);

    function searchShows(req, res) {
        var query = req.params.query;
        var url = 'https://api.themoviedb.org/3/' + 'search/tv?query=' + query + '&api_key=' + apiKey;
        
        request(url, function(error, response, body) {
            if(!error && response.statusCode == 200) {
                res.json(body);
            }
            else {
                res.status(400).send('error with search');
            }
        });
    }

    function showInfo(req, res) {
        var id = req.params.id;
        var url = baseUrl + id + endUrl;

        request(url, function(error, response, body) {
            if(!error && response.statusCode == 200) {
                res.json(body);
            }
            else {
                res.status(400).send('error with api call');
            }
        });
    }

    function contentRating(req, res) {
        var id = req.params.id;
        var url = baseUrl + id + '/content_ratings' + endUrl;

        request(url, function(error, response, body) {
            if(!error && response.statusCode == 200) {
                res.json(body);
            }
            else {
                res.status(400).send('error with api call');
            }
        });
    }

    function credits(req, res) {
        var id = req.params.id;
        var url = baseUrl + id + '/credits' + endUrl;
        request(url, function(error, response, body) {
            if(!error && response.statusCode == 200) {
                res.json(body);
            }
            else {
                res.status(400).send('error with api call');
            }
        });
    }

    function externalIds(req, res) {
        var id = req.params.id;
        var url = baseUrl + id + '/external_ids' + endUrl;
        request(url, function(error, response, body) {
            if(!error && response.statusCode == 200) {
                res.json(body);
            }
            else {
                res.status(400).send('error with api call');
            }
        });
    }

    function showImages(req, res) {
        var id = req.params.id;
        var url = baseUrl + id + '/images' + endUrl;
        request(url, function(error, response, body) {
            if(!error && response.statusCode == 200) {
                res.json(body);
            }
            else {
                res.status(400).send('error with api call');
            }
        });
    }

    function similarShows(req, res) {
        var id = req.params.id;
        var url = baseUrl + id + '/similar' + endUrl;
        request(url, function(error, response, body) {
            if(!error && response.statusCode == 200) {
                res.json(body);
            }
            else {
                res.status(400).send('error with api call');
            }
        });
    }

    function videos(req, res) {
        var id = req.params.id;
        var url = baseUrl + id + '/videos' + endUrl;
        request(url, function(error, response, body) {
            if(!error && response.statusCode == 200) {
                res.json(body);
            }
            else {
                res.status(400).send('error with api call');
            }
        });
    }

    function nextSevenDays(req, res) {
        var url = baseUrl + 'on_the_air' + endUrl;
        request(url, function(error, response, body) {
            if(!error && response.statusCode == 200) {
                res.json(body);
            }
            else {
                res.status(400).send('error with api call');
            }
        });
    }

    function airingToday(req, res) {
        var page = req.params.page;
        var url = baseUrl + 'airing_today' + endUrl + '&page=' + page;
        request(url, function(error, response, body) {
            if(!error && response.statusCode == 200) {
                res.json(body);
            }
            else {
                res.status(400).send('error with api call');
            }
        });
    }

    function topRated(req, res) {
        var page = req.params.page;
        var url = baseUrl + 'top_rated' + endUrl + '&page=' + page;
        request(url, function(error, response, body) {
            if(!error && response.statusCode == 200) {
                res.json(body);
            }
            else {
                res.status(400).send('error with api call');
            }
        });
    }

    function popular(req, res) {
        var page = req.params.page;
        var url = baseUrl + 'popular' + endUrl  + '&page=' + page;
        request(url, function(error, response, body) {
            if(!error && response.statusCode == 200) {
                res.json(body);
            }
            else {
                res.status(400).send('error with api call');
            }
        });
    }
};