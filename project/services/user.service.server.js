module.exports = function(app,models) {
    var userModel = models.userModel;
    var passport      = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var FacebookStrategy = require('passport-facebook').Strategy;
    var bcrypt = require("bcrypt-nodejs");

    app.post('/api/login', passport.authenticate('tvt'), login);
    app.post('/api/logout', logout);
    app.post('/api/register', register);
    app.get('/api/loggedin', loggedin);
    app.get("/api/user", getUsers);
    app.get("/api/user/:userId", findUserById);
    app.put("/api/user/:userId", updateUser);
    app.get("/api/user/username/:username", findUserByUsername);
    app.delete("/api/user/:userId", deleteUser);
    app.put('/api/:userId/followShow/:name/:tmdbId', pushShow);
    app.delete('/api/:userId/unfollowShow/:name/:tmdbId/:objId', pullShow);
    app.put('/api/:userId/follow/:followId', pushFollow);
    app.delete('/api/:userId/unfollow/:followId', pullFollow);

    app.get("/auth/facebook", passport.authenticate('facebook', {scope : 'email' }));
    app.get("/auth/facebook/callback",
        passport.authenticate('facebook', {
            successRedirect : '/#/user/home',
            failureRedirect : '/#/home'
        }));

    var facebookConfig = {
        clientID     : process.env.FACEBOOK_CLIENT_ID,
        clientSecret : process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL  : process.env.FACEBOOK_CALLBACK_URL,
        enableProof: true
    };
    
    passport.use('tvt', new LocalStrategy(localStrategy));
    passport.use('facebook', new FacebookStrategy(facebookConfig, facebookStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    function authorized (req, res, next) {
        if (!req.isAuthenticated()) {
            res.send(401);
        } else {
            next();
        }
    }

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        userModel
            .findUserById(user._id)
            .then(
                function(user){
                    done(null, user);
                },
                function(err){
                    done(err, null);
                }
            );
    }

    function localStrategy(username, password, done) {
        userModel
            .findUserByUsername(username)
            .then(
                function(user) {
                    if(user && bcrypt.compareSync(password, user.password)) {
                        return done(null, user);
                    }
                    else {
                        return done(null, false);
                    }
                },
                function(err) {
                    if(err) {
                        return done(err);
                    }
                }
            );
    }

    function facebookStrategy(token, refreshToken, profile, done) {
        var id = profile.id;
        userModel
            .findUserByFacebookId(id)
            .then(
                function(user) {
                    if(user) {
                        return done(null, user);
                    }
                    else {
                        var user = {
                            username: profile.displayName.replace(/ /g, ''),
                            facebook: {
                                id: profile.id,
                                displayName: profile.displayName,
                                token: token
                            }
                        };
                        return userModel.createUser(user);
                    }
                }
            )
            .then(
                function (user) {
                    return done(null, user);
                }
            );
    }

    function register(req, res) {
        var user = req.body;
        user.password = bcrypt.hashSync(user.password);

        userModel
            .createUser(user)
            .then(function(user) {
                if(user) {
                    req.login(user, function(error) {
                        if(error) {
                            res.status(400).send(error);
                        }
                        else {
                            res.json(user);
                        }
                    });
                }
            });
    }

    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    function logout(req, res) {
        req.logOut();
        res.sendStatus(200);
    }

    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function deleteUser(req, res) {
        var id = req.params.userId;

        userModel
            .deleteUser(id)
            .then(
                function (status) {
                    res.send(200);
                },
                function (error) {
                    res.status(404).send("Unable to remove user with ID: " + id);
                }
            );
    }

    function updateUser(req, res) {
        var id = req.params.userId;
        var newUser = req.body;
        userModel
            .updateUser(id, newUser)
            .then(
                function(user) {
                    res.json(user);
                },
                function(error) {
                    res.status(404).send("Unable to update user with ID: " + id);
                }
            );
    }

    function findUserById(req, res) {
        var userId = req.params.userId;
        userModel
            .findUserById(userId)
            .then(
                function(user){
                    res.send(user);
                },
                function(error){
                    res.status(400).send(error);
                }
            );
    }

    function getUsers(req, res) {
        var username = req.query["username"];
        var password = req.query["password"];
        if(username && password) {
            findUserByCredentials(username, password, res);
        } else if(username) {
            findUserByUsername(username, res);
        } else {
            res.send(users);
        }
    }
    function findUserByCredentials(username, password, res) {
        userModel
            .findUserByCredentials(username, password)
            .then(
                function(user) {
                    res.json(user);
                },
                function(error) {
                    res.status(403).send("Unable to login");
                }
            );
    }

    function findUserByUsername(username, res) {
        userModel
            .findUserByUsername(username)
            .then(function(user) {
                    res.json(user);
                },
                function(error) {
                    res.status(403).send("Unable to login");
                });
    }

    function pushShow(req, res) {
        var name = req.params.name;
        var tmdbId = req.params.tmdbId;
        var userId = req.params.userId;

        userModel
            .pushShow(userId, name, tmdbId)
            .then(function() {
                    res.send(200);
                },
                function(error) {
                    res.status(400).send("Unable to add show");
                });
    }

    function pullShow(req, res) {
        var name = req.params.name;
        var tmdbId = req.params.tmdbId;
        var userId = req.params.userId;
        var objId = req.params.objId;

        userModel
            .pullShow(userId, name, tmdbId, objId)
            .then(function() {
                    res.send(200);
                },
                function(error) {
                    res.status(400).send("Unable to remove show");
                });
    }

    function pushFollow(req, res) {
        var userId = req.params.userId;
        var followId = req.params.followId;

        userModel
            .pushFollow(userId, followId)
            .then(function() {
                    res.send(200);
                },
                function(error) {
                    res.status(400).send("Unable to follow user");
                });
    }

    function pullFollow(req, res) {
        var userId = req.params.userId;
        var followId = req.params.unfollowId;

        userModel
            .pullFollow(userId, followId)
            .then(function() {
                    res.send(200);
                },
                function(error) {
                    res.status(400).send("Unable to unfollow user");
                });
    }

    function findUserByUsername(req, res) {
        var username = req.params.username;
         userModel
             .findUserByUsername(username)
             .then(function(user) {
                 res.json(user);
             },
             function(error) {
                 res.status(404).send('could not find user');
             });
    }
};