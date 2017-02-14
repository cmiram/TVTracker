(function() {
    angular
        .module("TVTracker")
        .controller("UserShowsController", UserShowsController);

    function UserShowsController($location, $routeParams, $rootScope, EpguidesService, TmdbService, $sce) {
        var vm = this;
        vm.route = $routeParams;
        vm.searchShows = searchShows;
        vm.getShowArt = getShowArt;
        vm.navigateToShowPage = navigateToShowPage;
        vm.searchShows = searchShows;
        vm.goBack = goBack;
        vm.onEnter = onEnter;

        function init() {
            vm.user = $rootScope.currentUser;
            vm.shows = [];
            getShowsInfo();
        }
        init();

        function getShowsInfo() {
            for(var i in vm.user.shows) {
                TmdbService
                    .showInfo(vm.user.shows[i].tmdbId)
                    .then(function (res) {
                        var show = JSON.parse(res.data);
                        pushShowAlphabetically(show);
                        EpguidesService
                            .nextEpisode(formatForEpguides(show.name))
                            .then(function (res) {
                                var show = JSON.parse(res.data);
                                if(!show.error) {
                                    updateShowArray(show);
                                }
                            });
                    });
            }
        }

        function pushShowAlphabetically(show) {
            if(vm.shows.length === 0) {
                vm.shows.push(show);
            }
            else {
                var index = 0;
                while(index < vm.shows.length && vm.shows[index].name.localeCompare(show.name) < 0) {
                    index++;
                }
                vm.shows.splice(index, 0, show);
                vm.shows.join();
            }
        }

        function formatForEpguides(str) {
            var result = '';
            str = removeSpaces(str);
            for(var i in str) {
                var charCode = str.charCodeAt(i);
                if((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123)) {
                    result += str[i];
                }
            }
            return result;
        }

        function removeSpaces(str) {
            str = str.replace(/\s/g, '');
            return str;
        }

        function updateShowArray(show) {
            var name = show.episode.show.epguide_name.toUpperCase();
            for(var i in vm.shows) {
                if(name == formatForEpguides(vm.shows[i].name).toUpperCase()) {
                    vm.shows[i].next = show.episode.release_date;
                    return;
                }
            }
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

        function navigateToShowPage(show) {
            $location.url('/shows/browse/' + show.id);
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