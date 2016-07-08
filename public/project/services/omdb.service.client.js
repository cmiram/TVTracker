(function() {
    angular
        .module("TVTracker")
        .factory("OmdbService", OmdbService);

    function OmdbService($http) {

        var api = {
            showData: showData
        };
        return api;

        function showData(imdbId) {
            var url = '/api/omdb/info/' + imdbId;
            return $http.get(url);
        }
    }
})();