(function() {
    angular
        .module("TVTracker")
        .controller("SearchShowsController", SearchShowsController);

    function SearchShowsController($sce, $routeParams, $rootScope, $location, TmdbService) {
        var vm = this;

        vm.route = $routeParams;
        vm.user = $rootScope.currentUser;
        vm.getShowArt = getShowArt;
        vm.navigateToShowPage = navigateToShowPage;
        vm.results = [];

        function init() {
            var query = $routeParams.query;

            TmdbService
                .searchShows(query)
                .then(
                    function (res) {
                        vm.results =  JSON.parse(res.data).results;
                        console.log(vm.results);
                    }
                );
        }
        init();

        function navigateToShowPage(show) {
            $location.url('/shows/browse/' + show.id);
        }

        function getShowArt(show) {
            if(show.backdrop_path) {
                var baseUrl = "http://image.tmdb.org/t/p/original/";
                return $sce.trustAsResourceUrl(baseUrl + show.backdrop_path);
            }
        }
    }

})();