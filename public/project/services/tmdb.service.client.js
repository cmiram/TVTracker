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
            popular: popular
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

        function airingToday() {
            var url = baseUrl + 'airingToday';
            return $http.get(url);
        }

        function topRated() {
            var url = baseUrl + 'topRated';
            return $http.get(url);
        }

        function popular() {
            var url = baseUrl + 'popular';
            return $http.get(url);
        }
    }
})();