(function() {
    angular
        .module("TVTracker")
        .controller("BrowseShowsController", BrowseShowsController);

    function BrowseShowsController($location, $routeParams, $rootScope, UserService, TmdbService) {
        var vm = this;
        vm.route = $routeParams;
        vm.user = $rootScope.currentUser;
        vm.shows = [];
        TmdbService
            .popular()
            .then(
                function (res) {
                    data = res.data;
                    data = JSON.parse(data);
                    vm.shows= (data);

                }
            );
        function init() {

        }
        init();
    }

})();