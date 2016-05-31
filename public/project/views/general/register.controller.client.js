(function() {
    angular
        .module("TVTracker")
        .controller("RegisterController", RegisterController);

    function RegisterController($location, UserService) {
        var vm = this;

        vm.register = register;

        function register(username, password, passwordVerify) {
            if (password === passwordVerify) {
                var newUser = {
                    username: username,
                    password: password
                }
                if (UserService.createUser(newUser)) {
                    $location.url("/user/" + UserService.findUserByUsernameAndPassword(username, password)._id);
                }
                else {
                    vm.error = "Username already taken";
                }
            }
            else {
                vm.error = "Passwords do not match";
            }
        }

    }
})();