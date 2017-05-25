(function() {
    angular
        .module("TVTracker")
        .controller("SpecificShowController", SpecificShowController);

    function SpecificShowController($location, $routeParams, $rootScope, EpguidesService, TmdbService, $sce, UserService, OmdbService) {
        var vm = this;
        vm.getShowArt = getShowArt;
        vm.toggleFollow = toggleFollow;
        vm.searchShows = searchShows;
        vm.goBack = goBack;
        vm.onEnter = onEnter;
        vm.seasonSelectedEvent = seasonSelectedEvent;
        vm.episodeSelectedEvent = episodeSelectedEvent;

        function init() {
            vm.user = $rootScope.currentUser;
            vm.tmdbId = $routeParams.showId;
            vm.seasons = [{niceName: "Season", value: -1}];
            vm.episodes = [{niceName: "Episode", value: -1}];
            if(vm.user) {
                vm.isFollowing = checkIfFollowing();
            }
            TmdbService
                .showInfo(vm.tmdbId)
                .then(function(res) {
                    vm.show = JSON.parse(res.data);
                    vm.showArtPath = getShowArt(vm.show);
                    updateSeasonSelector();
                })
                .then(function() {
                    EpguidesService
                        .nextEpisode(formatForEpguides(vm.show.name))
                        .then(function(res) {
                            var data = JSON.parse(res.data);
                            if(data === null || data.error) {
                                vm.nextEpisode = false;
                            }
                            else {
                                vm.nextEpisode = data;
                            }
                        });
                    EpguidesService
                        .lastEpisode(formatForEpguides(vm.show.name))
                        .then(function(res) {
                            var data = JSON.parse(res.data);
                            if(data === null || data.error) {
                                vm.lastEpisode = false;
                            }
                            else {
                                vm.lastEpisode = data;
                            }
                        });
                });
            TmdbService
                .externalIds(vm.tmdbId)
                .then(function(res) {
                    var imdbId = JSON.parse(res.data).imdb_id;
                    OmdbService
                        .showData(imdbId)
                        .then(function(res) {
                            var showData = JSON.parse(res.data);
                            vm.show.vote_average = showData.imdbRating;
                            vm.showRating = vm.show.vote_average * 10;
                            vm.content_rating = showData.Rated;
                        });
                });
        }
        init();

        function checkIfFollowing() {
            for(var i in vm.user.shows) {
                if(vm.user.shows[i].tmdbId == vm.tmdbId) {
                    return true;
                }
            }
            return false;
        }

        function updateSeasonSelector() {
            var seasonJson = {};
            for(var i=1; i<=vm.show.number_of_seasons; i++) {
                seasonJson = {niceName: i.toString(), value: i};
                vm.seasons.push(seasonJson);
            }
        }

        function toggleFollow() {
            var shows = vm.user.shows;
            if(vm.isFollowing) {
                for(var i in shows) {
                    if(shows[i].tmdbId == vm.tmdbId) {
                        shows = removeShow(shows, shows[i].tmdbId);
                        vm.user.shows = shows;
                        UserService
                            .updateUser(vm.user._id, vm.user);
                    }
                }
            }
            else {
                var name = removeSpaces(vm.show.name);
                var show = {
                    name: name,
                    tmdbId: $routeParams.showId
                }
                vm.user.shows.push(show);
                UserService
                    .updateUser(vm.user._id, vm.user);
            }
            vm.isFollowing = !vm.isFollowing;
        }

        function removeShow(shows, tmdbId) {
            var result = [];
            for(var i in shows) {
                if(shows[i].tmdbId !== tmdbId) {
                    result.push(shows[i]);
                }
            }
            return result;
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

        function getShowArt(show) {
            if(show.backdrop_path) {
                var baseUrl = "http://image.tmdb.org/t/p/original/";
                return $sce.trustAsResourceUrl(baseUrl + show.backdrop_path);
            }
            else {
                return $sce.trustAsResourceUrl('/project/resources/no_image_available.png');
            }
        }

        function seasonSelectedEvent(season) {
            TmdbService
                .seasonInfo(vm.tmdbId, season)
                .then(function(res) {
                    var seasons = JSON.parse(res.data);
                    vm.seasonData = seasons;
                });
            var episode_json = {};
            for(var i=1; i<vm.show.seasons[season-1].episode_count; i++) {
                episode_json = {episode: i.toString(), value: i-1};
                vm.episodes.push(episode_json);
            }
        }

        function episodeSelectedEvent(episode) {
            var episodeData = vm.seasonData.episodes[episode];

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