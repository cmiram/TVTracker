(function() {
    angular
        .module("TVTracker")
        .factory("UserService", UserService);

    function UserService($http) {
        var apiKey = "77c6e46c7c8297c719b1cd52b441fcb8";

        var api = {
            getPopShows: getPopShows
        };
        return api;

        function getPopShows() {
            var url = "http://api.themoviedb.org/3/tv/popular?api_key=" + apiKey;
            return $http.get(url);
        }
    }
})();