(function() {
    angular
        .module("TVTracker")
        .factory("UserService", UserService);

    function UserService() {
        var users = [
            {_id: "123", username: "alice",    password: "alice",    firstName: "Alice",  lastName: "Wonder"  },
            {_id: "234", username: "bob",      password: "bob",      firstName: "Bob",    lastName: "Marley"  },
            {_id: "345", username: "charly",   password: "charly",   firstName: "Charly", lastName: "Garcia"  },
            {_id: "456", username: "jannunzi", password: "jannunzi", firstName: "Jose",   lastName: "Annunzi" }
        ];

        var api = {
            createUser: createUser,
            findUserByUsernameAndPassword: findUserByUsernameAndPassword,
            findUserById: findUserById,
            updateUser: updateUser,
            deleteUser: deleteUser
        };
        return api;

        function createUser(user) {
            for(var i in users) {
                if (users[i].username === user.username) {
                    return false;
                }
            }

            var newUser = {
                _id: (new Date()).getTime().toString(),
                username: user.username,
                password: user.password,
                firstname: null,
                lastname: null
            }
            users.push(newUser);
            return true;
        }
        function findUserByUsernameAndPassword(username, password) {
            for(var i in users) {
                if (users[i].username === username && users[i].password === password) {
                    return users[i];
                }
            }
            return null;
        }
        function findUserById(id) {
            for(var i in users) {
                if (users[i]._id === id) {
                    return users[i];
                }
            }
            return null;
        }
        function updateUser(id, user) {
            for(var i in users) {
                if(users[i]._id === id) {
                    users[i].firstName = user.firstName;
                    users[i].lastName = user.lastName;
                    users[i].email = user.email;
                    return true;
                }
            }
            return false;
        }
        function deleteUser(id) {
            for(var i in users) {
                if(users[i]._id === id) {
                    users.remove(i);
                    return true;
                }
            }
            return false;
        }
    }
})();