(function() {
    angular
        .module("TVTracker")
        .controller("UserEditController", UserEditController);

    function UserEditController($routeParams, $rootScope, $location, UserService) {
        var vm = this;
        vm.route = $routeParams;
        vm.updateUser = updateUser;
        vm.searchShows = searchShows;
        vm.logout = logout;
        
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

        function logout() {
            UserService
                .logout()
                .then(function(res) {
                    $rootScope.currentUser = null;
                    $location.url("/");
                })
        }
    }

})();