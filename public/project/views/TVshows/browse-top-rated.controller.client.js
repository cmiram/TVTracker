(function() {
    angular
        .module("TVTracker")
        .controller("BrowseTopController", BrowseTopController);

    function BrowseTopController($sce, $routeParams, $rootScope, $location, TmdbService) {
        var vm = this;

        vm.route = $routeParams;
        vm.user = $rootScope.currentUser;
        vm.getShowArt = getShowArt;
        vm.navigateToShowPage = navigateToShowPage;
        vm.searchShows = searchShows;
        vm.goBack = goBack;
        vm.onEnter = onEnter;
        vm.loadMore = loadMore;

        function init() {
            vm.tmdbPage = 1;
            TmdbService
                .topRated(vm.tmdbPage++)
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

        function loadMore() {
            TmdbService
                .topRated(vm.tmdbPage++)
                .then(function(res) {
                    var results = JSON.parse(res.data).results;
                    for(var i in results) {
                        vm.shows.push(results[i]);
                    }
                });
        }

        function goBack() {
            window.history.back();
        }
    }

})();