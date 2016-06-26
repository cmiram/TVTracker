(function() {
    angular
        .module("TVTracker")
        .controller("UserHomeController", UserHomeController);

    function UserHomeController($location, $routeParams, $rootScope, EpguidesService, TmdbService, $sce) {
        var vm = this;
        vm.route = $routeParams;
        vm.searchShows = searchShows;
        vm.getShowArt = getShowArt;

        function init() {
            vm.user = $rootScope.currentUser;
            vm.day = findDayByOffset(0);
            vm.showListByNextEpisode = [];
            getNextEpisodesForUser();
        }
        init();

        function searchShows(searchText) {
            if(searchText) {
                searchText = searchText.split(' ').join('');
                $location.url('/shows/search/' + searchText);
            }
        }

        function findDayByOffset(offsetFromToday) {
            var date = new Date();
            date.setDate(date.getDate() + offsetFromToday);
            var month = date.getMonth() + 1;
            if(month < 10) {
                month = '0' + month;
            }
            return date.getFullYear() + '-' + month + '-' + date.getDate();
        }

        function getNextEpisodesForUser() {
            for(var i in vm.user.shows) {
                var name = vm.user.shows[i].name;
                var tmdbId = vm.user.shows[i].tmdbId;
                EpguidesService
                    .nextEpisode(name)
                    .then(function(res) {
                        var show = JSON.parse(res.data);
                        show.tmdbId = tmdbId;
                        vm.showListByNextEpisode.push(show);
                    });
            }
        }

        function getShowArt(show) {
            var baseUrl = "http://image.tmdb.org/t/p/w500";
            console.log(show);
            /*TmdbService
                .showImages(show.tmdbId)
                .then(function(res) {
                    console.log(res.data);
                });*/

            return $sce.trustAsResourceUrl('http://lorempixel.com/400/200/sports');
        }
    }
})();