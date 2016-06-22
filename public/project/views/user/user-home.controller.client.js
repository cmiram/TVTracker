(function() {
    angular
        .module("TVTracker")
        .controller("UserHomeController", UserHomeController);

    function UserHomeController($location, $routeParams, $rootScope, UserService) {
        var vm = this;
        vm.route = $routeParams;
        function init() {

        }
        init();
    }
})();