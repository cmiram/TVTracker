(function() {
    angular
        .module("TVTracker")
        .controller("UserEditController", UserEditController);

    function UserEditController($routeParams, $rootScope, UserService) {
        var vm = this;
        vm.route = $routeParams;
        vm.updateUser = updateUser;
        
        function init() {
            vm.user = $rootScope.currentUser;
        }
        init();
        
        function updateUser(user) {
            UserService
                .updateUser($routeParams.uid, user)
                .then(function(res) {
                    vm.success = 'Successfully Updated Profile';
                },
                function(err) {
                    vm.error = 'Unable to Update Profile';
                });
        }
    }

})();