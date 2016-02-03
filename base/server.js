var env = process.env.NODE_ENV || 'local',
    config = require('../config/config.js')

var express = require("express"),
    mongoose = require("mongoose"),
    fs = require("fs"),
    _ = require("underscore")


require("./User.js")

var models = fs.readdirSync("./app/generated/models");
models.forEach(function(model) {
    require("../app/generated/models/" + model);
});


var passport, expressSession, RedisStore, redis, sessionStore = null

if (config.users) {
    passport = require("passport"),
    expressSession = require("express-session"),
    RedisStore = require('connect-redis')(expressSession),
    redis = require("./redis.js"),
    sessionStore = new RedisStore({
        client: redis.pub
    })

    // passport settings
    require('./middleware/passport')(passport)
}

mongoose.connect(config[env].mongo.url)

var app = express();



// express settings
require('./express')(app, sessionStore, passport, config)

// router settings
require('../app/generated/router')(app, passport)


app.listen(app.get("port"), function() {
    console.log("Server running at port " + app.get("port") + " on process pid " + process.pid + ".")
})