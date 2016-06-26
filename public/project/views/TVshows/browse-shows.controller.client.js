(function() {
    angular
        .module("TVTracker")
        .controller("BrowseShowsController", BrowseShowsController);

    function BrowseShowsController($location, $routeParams, $rootScope, UserService, TmdbService) {
        var vm = this;

        vm.route = $routeParams;
        vm.user = $rootScope.currentUser;

        function init() {
            TmdbService
                .popular()
                .then(
                    function (res) {
                        console.log(JSON.parse(res.data).results);
                        vm.shows =  JSON.parse(res.data).results;
                        //vm.shows = vm.shows
                    }
                );
        }
        init();

    }

})();