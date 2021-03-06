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
        vm.searchShows = searchShows;
        vm.goBack = goBack;
        vm.onEnter = onEnter;

        function init() {
            var query = $routeParams.query;

            TmdbService
                .searchShows(query)
                .then(
                    function (res) {
                        vm.results =  JSON.parse(res.data).results;
                        if(vm.results.length === 0) {
                            vm.error = 'Your search returned no results';
                        }
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
            else {
                return $sce.trustAsResourceUrl('/project/resources/no_image_available.png');
            }
        }

        function searchShows(query) {
            query = replaceSpaces(query);
            $location.url('/shows/search/' + query);
        }

        function replaceSpaces(str) {
            var result = '';
            for(var i in str) {
                if(str[i] == ' ') {
                    result = result + '%20';
                }
                else {
                    result = result + str[i];
                }
            }
            return result;
        }

        function onEnter(event, query) {
            if(event === 13) {
                searchShows(query);
            }
        }

        function goBack() {
            window.history.back();
        }
    }

})();