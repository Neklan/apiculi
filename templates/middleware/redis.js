var env = process.env.NODE_ENV || 'local',
    config = require('../../config/config')[env]

if (!config.redis) {
    throw new Error("You need to define redis url, if you want to use bearer authentication.")
} else {
    var redis = require("redis").createClient

    var clients = {
        pub: redis(config.redis, {
            auth_pass: config.redis.pass
        }),
        sub: redis(config.redis, {
            detect_buffers: true,
            auth_pass: config.redis.pass
        })
    }

    clients.pub.on("error", function(err) {
        console.error(err)
    })

    clients.sub.on("error", function(err) {
        console.error(err)
    })

    module.exports = clients
}