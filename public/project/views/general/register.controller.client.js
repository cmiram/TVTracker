(function() {
    angular
        .module("TVTracker")
        .controller("RegisterController", RegisterController);

        function RegisterController($location, $rootScope, UserService) {
            var vm = this;

            vm.register = function(username, password, passconfirm){
                if(password === passconfirm) {
                    UserService
                        .register(username, password)
                        .then(
                            function(response){
                                var user = response.data;
                                $rootScope.currentUser = user;
                                $location.url("/profile/"+user._id);
                            },
                            function(error){
                                vm.error = error.data;
                            }
                        );
                }
                else{
                    vm.error = "Password does not match confirmation";
                }
            }

        }
    })();