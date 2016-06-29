(function() {
    angular
        .module("TVTracker")
        .controller("RegisterController", RegisterController);

        function RegisterController($location, $rootScope, UserService) {
            var vm = this;
            vm.register = register;

            function register(username, password, passconfirm){
                if(password === passconfirm) {
                    var newUser = {
                        username: username,
                        password: password
                    };

                    UserService
                        .register(newUser)
                        .then(
                            function(response){
                                var user = response.data;
                                $rootScope.currentUser = user;
                                $location.url("/user/home/" + user._id);
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