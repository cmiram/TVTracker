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
        vm.navigateToShowPage = navigateToShowPage;
        vm.searchShows = searchShows;
        vm.searchShows = searchShows;
        vm.searchUsers = searchUsers;

        function init() {
            vm.user = $rootScope.currentUser;
            vm.userNotFound = false;
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
            setNothingToday(day);
        }

        function setNothingToday(day) {
            for(var i in vm.showListByNextEpisode) {
                if(vm.showListByNextEpisode[i].episode.release_date == day) {
                    vm.nothingToday = false;
                    return;
                }
            }
            vm.nothingToday = true;
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
                        if(show.error) {
                            return null;
                        }
                        else{
                            //console.log(show);
                            show.tmdbId = getTmdbIdFromUserArray(show.episode.show.epguide_name);
                            return show;
                        }
                    })
                    .then(function(show) {
                        //console.log(show);
                        if(show) {
                            TmdbService
                                .showImages(show.tmdbId)
                                .then(function(res) {
                                    var images = res.data;
                                    images = JSON.parse(images);
                                    show.backdropFilePath = images.backdrops[0].file_path;
                                    vm.showListByNextEpisode.push(show);
                                    setNothingToday(vm.day);
                                });
                        }
                    });
            }
        }

        function getTmdbIdFromUserArray(name) {
            for(var i in vm.user.shows) {
                if(name.toUpperCase() === vm.user.shows[i].name.toUpperCase() || isSubstring(name, vm.user.shows[i].name)) {
                    return vm.user.shows[i].tmdbId;
                }
            }
            return null;
        }

        function isSubstring(str1, str2) {
            str1 = str1.toUpperCase();
            str2 = str2.toUpperCase();

            if(str1.indexOf(str2) > -1) {
                return true;
            }
            if(str2.indexOf(str1) > -1) {
                return true;
            }

            return false;
        }

        function getShowArt(show) {
            if(show.backdropFilePath) {
                var baseUrl = "http://image.tmdb.org/t/p/original/";
                return $sce.trustAsResourceUrl(baseUrl + show.backdropFilePath);
            }
            else {
                return $sce.trustAsResourceUrl('/project/resources/no_image_available.png');
            }
        }
        
        function getFollowerUsername(user) {
            UserService
                .findUserById(user)
                .then(function(user) {
                    return user.username;
                });
        }

        function navigateToShowPage(show) {
            $location.url('/shows/browse/' + show.tmdbId);
        }

        function searchShows(query) {
            query = replaceSpaces(query);
            $location.url('/shows/search/' + query);
        }

        function searchUsers(username) {
            UserService
                .findUserByUsername(username)
                .then(function(res) {
                    if(res.data) {
                        var uid = res.data._id;
                        $location.url('/user/other/' + uid);
                    }
                    else {
                        vm.userNotFound = true;
                    }
                });
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
    }

})();