(function () {
    angular
        .module("TVTracker")
        .factory("UserService", UserService);

    function UserService($http) {
        var apiKey = "77c6e46c7c8297c719b1cd52b441fcb8";

        var api = {
            getPopShows: getPopShows,
            checkLoggedin: checkLoggedin,
            register: register,
            login: login,
            logout: logout,
            findUserByUsernameAndPassword: findUserByUsernameAndPassword,
            findUserById: findUserById,
            findUserByUsername: findUserByUsername,
            updateUser: updateUser,
            deleteUser: deleteUser,
            pushShow: pushShow,
            pullShow: pullShow
        };
        return api;

        function getPopShows() {
            var url = "http://api.themoviedb.org/3/tv/popular?api_key=" + apiKey;
            return $http.get(url);
        }


        function checkLoggedin() {
            return $http.get("/api/loggedin");
        }

        function logout() {
            return $http.post('/api/logout');
        }

        function updateUser(id, newUser) {
            var url = "/api/user/" + id;
            return $http.put(url, newUser);
        }

        function login(username, password) {
            var url = "/api/login";
            var user = {
                username: username,
                password: password
            };
            return $http.post(url, user);
        }

        function register(user) {
            var url = "/api/register";
            return $http.post(url, user);
        }


        function deleteUser(id) {
            var url = "/api/user/" + id;
            return $http.delete(url);
        }

        function findUserByUsernameAndPassword(username, password) {
            var url = "/api/user?username=" + username + "&password=" + password;
            return $http.get(url);
        }

        function findUserById(id) {
            var url = "/api/user/" + id;
            return $http.get(url);
        }
        
        function pushShow(userId, name, tmdbId) {
            var url = "/api/" + userId + "/followShow/" + name + "/" + tmdbId;
            return $http.put(url);
        }

        function pullShow(userId, name, tmdbId, objId) {
            var url = "/api/" + userId + "/unfollowShow/" + name + "/" + tmdbId + '/' + objId;
            return $http.delete(url);
        }

        function findUserByUsername(username) {
            var url = "/api/user/username/" + username;
            return $http.get(url);
        }
    }
})();
