(function() {
    angular
        .module("TVTracker")
        .controller("UserOtherController", UserOtherController);

    function UserOtherController($location, $routeParams, $rootScope, EpguidesService, TmdbService, $sce, UserService) {
        var vm = this;
        vm.user = $rootScope.currentUser;
        
        function init() {
            UserService
                .findUserById($routeParams.uid)
                .then(function(res) {
                    vm.otherUser = res.data;
                });
        }
        init();
    }
})();