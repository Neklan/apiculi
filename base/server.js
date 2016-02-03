var env = process.env.NODE_ENV || 'local',
    config = require('../config/config.js')

var express = require("express"),
    mongoose = require("mongoose"),
    fs = require("fs"),
    _ = require("underscore")

var userModel = _.findWhere(config.models, {
    name: "User"
})

var models = fs.readdirSync("./base/models");
models.forEach(function(model) {
    require("./models/" + model);
});

if(userModel) {
    require("./User.js")
}



var passport, expressSession, RedisStore, redis, sessionStore = null

if (userModel) {
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
require('./router')(app, passport)


app.listen(app.get("port"), function() {
    console.log("Server running at port " + app.get("port") + " on process pid " + process.pid + ".")
})