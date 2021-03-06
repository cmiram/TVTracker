var express = require('express');
var app = express();
var mongoose = require('mongoose');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// configure a public directory to host static content
app.use(express.static(__dirname + '/public'));

var ipaddress = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
var port = 8675 //  process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
var passport = require('passport');
var session = require('express-session');

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

var connectionString;
if(process.env.MONGO_URL) {
    connectionString = process.env.MONGO_URL;
}
else {
    connectionString = 'mongodb://127.0.0.1:27017/webdev';
}

const options = {
    useMongoClient: true
};

mongoose.Promise = global.Promise;
mongoose.connect(connectionString, options);

require('./project/app')(app);
app.listen(port, ipaddress);
