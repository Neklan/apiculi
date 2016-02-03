var env = process.env.NODE_ENV || 'local',
    config = require('../config')[env]

var redis = require("redis").createClient
var clients = {
    pub: redis(config.redis.url, {auth_pass: config.redis.pass}),
    sub: redis(config.redis.url, {detect_buffers: true, auth_pass: config.redis.pass} )
}

clients.pub.on("error", function(err) {
    console.error(err)
})

clients.sub.on("error", function(err) {
    console.error(err)
})

module.exports = clients