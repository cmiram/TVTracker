(function () {
    angular
        .module("TVTracker")
        .config(Config);

    function Config($routeProvider) {
        $routeProvider
            .when("/home", {
                templateUrl: "project/views/general/home.view.client.html",
                controller: "HomeController",
                controllerAs: "model"
            })
            .when("/register", {
                templateUrl: "project/views/general/register.view.client.html",
                controller: "RegisterController",
                controllerAs: "model"
            })
            .when("/user/home/:uid", {
                templateUrl: "project/views/user/user-home.view.client.html",
                controller: "UserHomeController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .otherwise({

                redirectTo: "/home"
        
            });

        function checkLoggedin(UserService, $q, $location, $rootScope) {

            var deferred = $q.defer();

            UserService
                .checkLoggedin()
                .then(
                    function (response) {
                        var user = response.data;
                        console.log(user);
                        if (user == '0') {
                            deferred.reject();
                            $rootScope.currentUser = null;
                            $location.url("/login")
                        } else {
                            $rootScope.currentUser = user;
                            deferred.resolve();
                        }
                    },
                    function (err) {
                        console.log(err);
                        $rootScope.currentUser = null;
                        deferred.reject();
                    }
                );

            return deferred.promise;
        }
    }
})();