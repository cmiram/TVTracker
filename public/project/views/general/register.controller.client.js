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
                        password: password
                    };
                    UserService
                        .register(user)
                        .then(
                            function(response){
                                var user = response.data;
                                $rootScope.currentUser = user;
                                login($rootScope.currentUser.username, $rootScope.currentUser.password);
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

            function login(username, password) {
                UserService
                    .login(username, password)
                    .then(
                        function(response) {
                            var user = response.data;
                            if(user) {
                                $rootScope.currentUser = user;
                                var id = user._id;
                                $location.url("/user/home/" + id);
                            }
                        },
                        function (error) {
                            vm.error = "User not found";
                        }
                    );
            }
        }
    })();