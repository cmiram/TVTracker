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
        vm.searchUsers = searchUsers;
        vm.getShowArtButtons = getShowArtButtons;
        vm.goBack = goBack;
        vm.onEnter = onEnter;
        vm.onSearchUser = onSearchUser;

        function init() {
            vm.user = $rootScope.currentUser;
            vm.userNotFound = false;
            vm.dayOffset = 0;
            vm.day = findDayByOffset(vm.dayOffset);
            vm.showListByNextEpisode = [];
            vm.userFollows = [];
            vm.daySelected = vm.daysToCheck[0];
            vm.showsOnSelectedDay = [];
            getNextEpisodesForUser();
            getFollowsUsers();
            setTopRated();
            setPopular();
            setSimilar();
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
                else {
                    var temp = name.split('-');
                    niceName = temp[1] + '-' + temp[2] + '-' + temp[0];
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
            updateSelectedDayArray();
            if(vm.showsOnSelectedDay.length == 0) {
                vm.nothingToday = true;
            }
            else {
                vm.nothingToday = false;
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
            if(day < 10) {
                day = '0' + day;
            }

            return year + '-' + month + '-' + day;
        }

        function getNextEpisodesForUser() {
            for(var i in vm.user.shows) {
                var storedShow = window.sessionStorage.getItem(vm.user.shows[i].tmdbId);
                if(storedShow) {
                    storedShow = JSON.parse(storedShow);
                    vm.showListByNextEpisode.push(storedShow);
                }
                else {
                    var name = formatForEpguides(vm.user.shows[i].name);
                    EpguidesService
                        .nextEpisode(name)
                        .then(function (res) {
                            var show = JSON.parse(res.data);
                            if (show.error) {
                                return show;
                            }
                            else {
                                show.tmdbId = getTmdbIdFromUserArray(show.episode.show.epguide_name);
                                return show;
                            }
                        })
                        .then(function (show) {
                            if (!show.error && nextInNextSevenDays(show.episode.release_date)) {
                                TmdbService
                                    .showInfo(show.tmdbId)
                                    .then(function (res) {
                                        var data = JSON.parse(res.data);
                                        show.backdropFilePath = data.backdrop_path;
                                        vm.showListByNextEpisode.push(show);
                                        updateSelectedDayArray();
                                        window.sessionStorage.setItem(show.tmdbId, JSON.stringify(show));
                                    });
                            }
                        });
                }
            }
        }

        function updateSelectedDayArray() {
            vm.showsOnSelectedDay = [];
            for(var i in vm.showListByNextEpisode) {
                if(vm.showListByNextEpisode[i].episode.release_date === vm.day) {
                    vm.showsOnSelectedDay.push(vm.showListByNextEpisode[i]);
                }
            }
        }

        function nextInNextSevenDays(day) {
            for(var i in vm.daysToCheck) {
                if(vm.daysToCheck[i].name === day) {
                    return true;
                }
            }
            return false;
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

        function getTmdbIdFromUserArray(name) {
            for(var i in vm.user.shows) {
                if(name.toUpperCase() === formatForEpguides(vm.user.shows[i].name.toUpperCase()) || isSubstring(name, vm.user.shows[i].name)) {
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
        
        function getFollowsUsers() {
            for(var i in vm.user.follows) {
                UserService
                    .findUserById(vm.user.follows[i])
                    .then(function(res) {
                        var user = res.data;
                        vm.userFollows.push(user);
                    });
            }
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

        function getShowArtButtons(show) {
            if(show.backdrop_path) {
                var baseUrl = "http://image.tmdb.org/t/p/original/";
                return $sce.trustAsResourceUrl(baseUrl + show.backdrop_path);
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

        function setPopular() {
            var popular = window.sessionStorage.getItem('popular');
            var results = [];
            if(popular) {
                popular = JSON.parse(popular);
                var randIndex;
                for(var i=0; i<3; i++) {
                    randIndex = Math.floor(Math.random() * popular.length);
                    results.push(popular[randIndex]);
                    popular.splice(randIndex,1);
                }
                vm.popularShows = results;
                return;
            }

            TmdbService
                .popular()
                .then(function(res) {
                    popular = JSON.parse(res.data).results;
                    window.sessionStorage.setItem('popular', JSON.stringify(popular));
                    var randIndex;
                    for(var i=0; i<3; i++) {
                        randIndex = Math.floor(Math.random() * popular.length);
                        results.push(popular[randIndex]);
                        popular.splice(randIndex,1);
                    }
                    vm.popularShows = results;
                });
        }

        function setTopRated() {
            var topRated = window.sessionStorage.getItem('topRated');
            var results = [];
            if(topRated) {
                topRated = JSON.parse(topRated);
                var randIndex;
                for(var i=0; i<3; i++) {
                    randIndex = Math.floor(Math.random() * topRated.length);
                    results.push(topRated[randIndex]);
                    topRated.splice(randIndex,1);
                }
                vm.topRatedShows = results;
                return;

            }
            TmdbService
                .topRated()
                .then(function(res) {
                    topRated = JSON.parse(res.data).results;
                    window.sessionStorage.setItem('topRated', JSON.stringify(topRated));
                    var randIndex;
                    for(var i=0; i<3; i++) {
                        randIndex = Math.floor(Math.random() * topRated.length);
                        results.push(topRated[randIndex]);
                        topRated.splice(randIndex,1);
                    }
                    vm.topRatedShows = results;
                });
        }

        function setSimilar() {
            var similar = window.sessionStorage.getItem('similar');
            var results = [];
            if(similar) {
                similar = JSON.parse(similar);
                if(similar.length > 2) {
                    var randIndex;
                    for (var i = 0; i < 3; i++) {
                        randIndex = Math.floor(Math.random() * similar.length);
                        results.push(similar[randIndex]);
                        similar.splice(randIndex, 1);
                    }
                    vm.similarShows = results;
                    return;
                }
            }

            var index = Math.floor(Math.random() * vm.user.shows.length);
            var show = vm.user.shows[index];
            TmdbService
                .similarShows(show.tmdbId)
                .then(function(res) {
                    similar = JSON.parse(res.data).results;
                    window.sessionStorage.setItem('similar', JSON.stringify(similar));
                    if(similar.length > 2) {
                        var randIndex;
                        for(var i=0; i<3; i++) {
                            randIndex = Math.floor(Math.random() * similar.length);
                            results.push(similar[randIndex]);
                            similar.splice(randIndex,1);
                        }
                        vm.similarShows = results;
                    }
                    else {
                        setSimilar();
                    }
                });
        }

        function onEnter(event, query) {
            if(event === 13) {
                searchShows(query);
            }
        }

        function onSearchUser(event, query) {
            if(event === 13) {
                searchUsers(query);
            }
        }

        function goBack() {
            window.history.back();
        }
    }

})();