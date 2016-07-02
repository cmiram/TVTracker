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
            .when("/user/home", {
                templateUrl: "project/views/user/user-home.view.client.html",
                controller: "UserHomeController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when("/user/home/:uid", {
                templateUrl: "project/views/user/user-home.view.client.html",
                controller: "UserHomeController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when("/user/home/:uid/edit", {
                templateUrl: "project/views/user/user-edit.view.client.html",
                controller: "UserEditController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when("/user/other/:uid", {
                templateUrl: "project/views/user/user-other.view.client.html",
                controller: "UserOtherController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when("/user/shows/:uid", {
                templateUrl: "project/views/user/user-shows.view.client.html",
                controller: "UserShowsController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when("/shows/browse/popular", {
                templateUrl: "project/views/TVshows/browse-popular.view.client.html",
                controller: "BrowseShowsController",
                controllerAs: "model"
            })
            .when("/shows/browse/topRated", {
                templateUrl: "project/views/TVshows/browse-top-rated.view.client.html",
                controller: "BrowseTopController",
                controllerAs: "model"
            })
            .when("/shows/browse/:showId", {
                templateUrl: "project/views/TVshows/specific-show.view.client.html",
                controller: "SpecificShowController",
                controllerAs: "model"
            })
            .when("/shows/search/:query", {
                templateUrl: "project/views/TVshows/search-shows.view.client.html",
                controller: "SearchShowsController",
                controllerAs: "model"
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
                        $rootScope.currentUser = null;
                        deferred.reject();
                    }
                );

            return deferred.promise;
        }
    }
})();