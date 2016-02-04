module.exports = {
    users: false,
    models: require("./models/index"),
    local: {
        port: 3000,
        mongo: "MONGO_CONNECTION_URL",
        redis: "REDIS_CONNECTION_URL"
    },
}