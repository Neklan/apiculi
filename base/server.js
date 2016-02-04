var env = process.env.NODE_ENV || 'local',
    config = require(process.cwd() + '/config/config.js')

var express = require("express"),
    mongoose = require("mongoose"),
    fs = require("fs"),
    _ = require("underscore")


require(process.cwd() + "/base/User.js")

var models = fs.readdirSync(process.cwd() + "/app/generated/models");
models.forEach(function(model) {
    require(process.cwd() + "/app/generated/models/" + model);
});


var passport, expressSession, RedisStore, redis, sessionStore = null

if (config.users) {
    passport = require("passport"),
    expressSession = require("express-session"),
    RedisStore = require('connect-redis')(expressSession),
    redis = require(process.cwd() + "/base/redis.js"),
    sessionStore = new RedisStore({
        client: redis.pub
    })

    // passport settings
    require(process.cwd() + '/base/middleware/passport')(passport)
}

mongoose.connect(config[env].mongo)

var app = express();



// express settings
require(process.cwd() + '/base/express')(app, sessionStore, passport, config)

// router settings
require(process.cwd() + '/app/generated/router')(app, passport)


app.listen(app.get("port"), function() {
    console.log("Server running at port " + app.get("port") + " on process pid " + process.pid + ".")
})