var env = process.env.NODE_ENV || 'local',
    config = require('./config/config.js')

var express = require("express"),
    mongoose = require("mongoose"),
    fs = require("fs"),
    _ = require("underscore")


var models = fs.readdirSync("./app/api/models");
models.forEach(function(model) {
    require("./app/api/models/" + model);
});


var passport, expressSession, RedisStore, redis, sessionStore = null

if (config.users) {
    passport = require("passport"),
    expressSession = require("express-session"),
    RedisStore = require('connect-redis')(expressSession),
    redis = require("./app/middleware/redis.js"),
    sessionStore = new RedisStore({
        client: redis.pub
    })

    // passport settings
    require('./app/middleware/passport')(passport)
}

if(config[env].mongo != "MONGO_CONNECTION_URL") {
    mongoose.connect(config[env].mongo)
}

var app = express();



// express settings
require('./app/express')(app, sessionStore, passport, config)

// router settings
require('./app/router')(app)


app.listen(app.get("port"), function() {
    console.log("Server running at port " + app.get("port") + " on process pid " + process.pid + ".")
})