(function() {
    angular
        .module("TVTracker")
        .controller("UserEditController", UserEditController);

    function UserEditController() {
        var vm = this;
        vm.route = $routeParams;
        function init() {

        }
        init();

    }

})();