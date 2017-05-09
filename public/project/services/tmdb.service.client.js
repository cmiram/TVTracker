(function() {
    angular
        .module("TVTracker")
        .factory("TmdbService", TmdbService);

    function TmdbService($http) {

        var baseUrl = '/api/tmdb/';

        var api = {
            showInfo: showInfo,
            contentRating: contentRating,
            credits: credits,
            externalIds: externalIds,
            showImages: showImages,
            similarShows: similarShows,
            videos: videos,
            nextSevenDays: nextSevenDays,
            airingToday: airingToday,
            topRated: topRated,
            popular: popular,
            searchShows: searchShows,
            specificShow: specificShow,
            seasonInfo: seasonInfo
        };
        return api;

        function showInfo(id) {
            var url = baseUrl + id;
            return $http.get(url);
        }

        function contentRating(id) {
            var url = baseUrl + id + '/contentRating';
            return $http.get(url);
        }

        function credits(id) {
            var url = baseUrl + id + '/credits';
            return $http.get(url);
        }

        function externalIds(id) {
            var url = baseUrl + id + '/externalIds';
            return $http.get(url);
        }

        function showImages(id) {
            var url = baseUrl + id + '/images';
            return $http.get(url);
        }

        function similarShows(id) {
            var url = baseUrl + id + '/similar';
            return $http.get(url);
        }

        function videos(id) {
            var url = baseUrl + id + '/videos';
            return $http.get(url);
        }

        function nextSevenDays() {
            var url = baseUrl + 'onTheAir';
            return $http.get(url);
        }

        function airingToday(page) {
            var url = baseUrl + 'airingToday/' + page;
            return $http.get(url);
        }

        function topRated(page) {
            var url = baseUrl + 'topRated/' + page;
            return $http.get(url);
        }

        function popular(page) {
            var url = baseUrl + 'popular/' + page;
            return $http.get(url);
        }
        
        function searchShows(query) {
            var url = baseUrl + 'search/' + query;
            return $http.get(url);
        }

        function specificShow(id, season, episode) {
            var url = baseUrl + 'episode/' + id + '/' + season + '/' + episode;
            return $http.get(url);
        }

        function seasonInfo(id, season) {
            var url = baseUrl + 'season/' + id + '/' + season;
            return $http.get(url);
        }
    }
})();