(function() {
    angular
        .module("TVTracker")
        .factory("TvmazeService", TvmazeService);

    function TvmazeService($http) {

        var baseUrl = '/api/tvmaze/';

        var api = {
            showLookupByImdbId: showLookupByImdbId,
            showByEpisode: showByEpisode
        };
        return api;

        function showLookupByImdbId(imdbId) {
            var url = baseUrl + 'showLookup/imdbId/' + imdbId;
            return $http.get(url);
        }

        function showByEpisode(id, season, episode) {
            var url = baseUrl + 'show/' + id + '/' + season + '/' + episode;
            return $http.get(url);
        }
    }
})();