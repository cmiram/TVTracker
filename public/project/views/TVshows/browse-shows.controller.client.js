(function() {
    angular
        .module("TVTracker")
        .controller("BrowseShowsController", BrowseShowsController);

    function BrowseShowsController($location, $routeParams, $rootScope, UserService, TmdbService) {
        var vm = this;

        vm.route = $routeParams;
        vm.user = $rootScope.currentUser;

        function init() {
            vm.shows = TmdbService
                .popular()
                .then(
                    function (res) {
                        data = res.data;
                        data = JSON.parse(data);
                        vm.shows= data;
                        return data;
                    }
                );
        }
        init();
        var shows = vm.shows;
        console.log(shows);
    }

})();