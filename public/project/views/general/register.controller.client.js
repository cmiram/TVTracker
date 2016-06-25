(function() {
    angular
        .module("TVTracker")
        .controller("RegisterController", RegisterController);

        function RegisterController($location, $rootScope, UserService) {
            var vm = this;

            vm.register = function(username, email, password, passconfirm){
                if(password === passconfirm) {
                    var user = {
                        username: username,
                        password: password,
                        email: email
                    };
                    UserService
                        .register(user)
                        .then(
                            function(response){
                                var user = response.data;
                                $rootScope.currentUser = user;
                                $location.url("/user/profile/"+user._id);
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