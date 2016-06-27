(function() {
    angular
        .module("TVTracker")
        .controller("UserHomeController", UserHomeController);

    function UserHomeController($location, $routeParams, $rootScope, EpguidesService, TmdbService, $sce, UserService) {
        var vm = this;
        vm.route = $routeParams;
        vm.searchShows = searchShows;
        vm.getShowArt = getShowArt;
        vm.daysToCheck = setDaysArray();
        vm.daySelectedEvent = daySelectedEvent;
        vm.getFollowerUsername = getFollowerUsername;

        function init() {
            vm.user = $rootScope.currentUser;
            vm.dayOffset = 0;
            vm.day = findDayByOffset(vm.dayOffset);
            vm.showListByNextEpisode = [];
            getNextEpisodesForUser();
        }
        init();

        function setDaysArray() {
            var days = [];
            for(var i=0; i<7; i++) {
                var name = findDayByOffset(i);
                var niceName = name;
                
                if(i === 0) {
                    niceName = 'Today';
                }
                else if(i === 1) {
                    niceName = 'Tomorrow';
                }
                
                var day = {
                    niceName: niceName,
                    name: name
                }
                days.push(day);
            }
            return days;
        }

        function daySelectedEvent(day) {
            vm.day = day;
        }

        function searchShows(searchText) {
            if(searchText) {
                searchText = searchText.split(' ').join('');
                $location.url('/shows/search/' + searchText);
            }
        }

        function findDayByOffset(offsetFromToday) {
            var date = new Date();
            date.setDate(date.getDate() + offsetFromToday);

            var year = date.getFullYear();
            var month = date.getMonth() + 1;

            if(month < 10) {
                month = '0' + month;
            }

            var day = date.getDate();

            return year + '-' + month + '-' + day;
        }

        function getNextEpisodesForUser() {
            for(var i in vm.user.shows) {
                var name = vm.user.shows[i].name;
                EpguidesService
                    .nextEpisode(name)
                    .then(function(res) {
                        var show = JSON.parse(res.data);
                        show.tmdbId = getTmdbIdFromUserArray(show.episode.show.epguide_name);
                        return show;
                    })
                    .then(function(show) {
                        TmdbService
                            .showImages(show.tmdbId)
                            .then(function(res) {
                                var images = res.data;
                                images = JSON.parse(images);
                                show.backdropFilePath = images.backdrops[0].file_path;
                                vm.showListByNextEpisode.push(show);
                            });
                    });
            }
        }

        function getTmdbIdFromUserArray(name) {
            for(var i in vm.user.shows) {
                if(name === vm.user.shows[i].name) {
                    return vm.user.shows[i].tmdbId;
                }
            }
            return null;
        }

        function getShowArt(show) {
            var baseUrl = "http://image.tmdb.org/t/p/w370/";
            return $sce.trustAsResourceUrl(baseUrl + show.backdropFilePath);
        }
        
        function getFollowerUsername(user) {
            UserService
                .findUserById(user)
                .then(function(user) {
                    return user.username;
                });
        }
    }
})();