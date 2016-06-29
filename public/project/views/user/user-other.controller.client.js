(function() {
    angular
        .module("TVTracker")
        .controller("UserOtherController", UserOtherController);

    function UserOtherController($location, $routeParams, $rootScope, EpguidesService, TmdbService, $sce, UserService) {
        var vm = this;
        vm.user = $rootScope.currentUser;
        vm.getShowArt = getShowArt;
        vm.toggleFollow = toggleFollow;
        vm.searchShows = searchShows;
        vm.goBack = goBack;

        function init() {
            vm.userShows = [];
            vm.otherShows = [];
            vm.similarShows = [];

            UserService
                .findUserById($routeParams.uid)
                .then(function(res) {
                    vm.otherUser = res.data;
                    checkIfFollowing();
                    getCommonShows();
                });
        }
        init();

        function getCommonShows() {
            var userShows = vm.user.shows;
            var otherShows = vm.otherUser.shows;
            vm.commonShows = [];

            if(userShows.length == 0 || otherShows.length == 0) {
                return;
            }

            for(var i in userShows) {
                for(var j in otherShows) {
                    if(userShows[i].tmdbId === otherShows[j].tmdbId) {
                        TmdbService
                            .showInfo(userShows[i].tmdbId)
                            .then(function(res) {
                                var show = JSON.parse(res.data);
                                vm.commonShows.push(show);
                                getSimilarShows(show.id);
                            });
                    }
                }
            }
        }

        function getSimilarShows(tmdbId) {
            TmdbService
                .similarShows(tmdbId)
                .then(function(res) {
                    var result = JSON.parse(res.data).results;
                    if(result.length > 3) {
                        for(var i=0; i<3; i++) {
                            var randIndex = Math.floor(Math.random() * result.length);
                            vm.similarShows.push(result[randIndex]);
                            result.splice(randIndex,1);
                        }
                    }
                    else {
                        for(var i in result) {
                            vm.similarShows.push(result[i]);
                        }
                    }
                });
        }

        function toggleFollow() {
            var following = vm.user.follows;
            if(vm.isFollowing) {
                for(var i in following) {
                    if(following[i] == vm.otherUser._id) {
                        following = removeUser(following, vm.otherUser._id);
                        vm.user.follows = following;
                        UserService
                            .updateUser(vm.user._id, vm.user);
                    }
                }
            }
            else {
                vm.user.follows.push(vm.otherUser._id);
                UserService
                    .updateUser(vm.user._id, vm.user);
            }
            vm.isFollowing = !vm.isFollowing;
        }

        function removeUser(followArray, id) {
            var result = [];
            for(var i in followArray) {
                if(followArray[i] !== id) {
                    result.push(followArray[i]);
                }
            }
            return result;
        }

        function checkIfFollowing() {
            for(var i in vm.user.follows) {
                if(vm.user.follows[i] == vm.otherUser._id) {
                    vm.isFollowing = true;
                    return;
                }
            }
            vm.isFollowing = false;
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

        function goBack() {
            window.history.back();
        }
    }
})();