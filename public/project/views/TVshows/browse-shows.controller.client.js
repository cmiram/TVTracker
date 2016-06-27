(function() {
    angular
        .module("TVTracker")
        .controller("BrowseShowsController", BrowseShowsController);

    function BrowseShowsController($sce, $routeParams, $rootScope, $location, TmdbService) {
        var vm = this;

        vm.route = $routeParams;
        vm.user = $rootScope.currentUser;
        vm.getShowArt = getShowArt;
        vm.navigateToShowPage = navigateToShowPage;

        function init() {
            TmdbService
                .popular()
                .then(
                    function (res) {
                        vm.shows =  JSON.parse(res.data).results;
                    }
                );
        }
        init();
        
        function navigateToShowPage(show) {
            $location.url('/shows/browse/' + show.id);
        }

        function getShowArt(show) {
            var baseUrl = "http://image.tmdb.org/t/p/original/";
            return $sce.trustAsResourceUrl(baseUrl + show.backdrop_path);
        }
    }

})();