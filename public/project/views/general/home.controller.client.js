(function() {
    angular
        .module("TVTracker")
        .controller("HomeController", HomeController);

    function HomeController($location, $rootScope, $sce, UserService, TmdbService) {
        var vm = this;
        vm.login = login;
        vm.getShowArt = getShowArt;

        function init() {
            vm.popularShows = [];
            vm.topRatedShows = [];

            setPopular();
            setTopRated();

            UserService
                .getPopShows()
                .then(function(res) {
                    vm.popShows = res.data.results;
                    vm.popShows.splice(0,5);
                })
        }
        init();

        function setPopular() {
            TmdbService
                .popular()
                .then(function(res) {
                    var results = [];
                    var popular = JSON.parse(res.data).results;
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
            TmdbService
                .topRated()
                .then(function(res) {
                    var results = [];
                    var topRated = JSON.parse(res.data).results;
                    var randIndex;
                    for(var i=0; i<3; i++) {
                        randIndex = Math.floor(Math.random() * topRated.length);
                        results.push(topRated[i]);
                        topRated.splice(randIndex,1);
                    }
                    vm.topRatedShows = results;
                });
        }

        function login(username, password) {
            UserService
                .login(username, password)
                .then(
                    function(response) {
                        var user = response.data;
                        if(user) {
                            $rootScope.currentUser = user;
                            var id = user._id;
                            $location.url("/user/home/" + id);
                        }
                    },
                    function (error) {
                        vm.error = "User not found";
                    }
                );
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
    }
})();


