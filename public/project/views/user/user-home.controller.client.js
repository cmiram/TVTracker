(function() {
    angular
        .module("TVTracker")
        .controller("UserHomeController", UserHomeController);

    function UserHomeController($location, $routeParams, $rootScope, UserService) {
        var vm = this;
        vm.route = $routeParams;
        vm.user = $rootScope.currentUser;
        console.log(vm.user);
        function init() {

        }
        init();
    }

})();