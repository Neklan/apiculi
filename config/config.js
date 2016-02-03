module.exports = {    
    models: require("./models"),
    local: {
        port: 13000,
        importExportSecret: "secret",
        root: require('path').normalize(__dirname),
        mongo: {
            url: "mongodb://heroku_rj5n1g0h:6r03r511d4e207o4h16nn3usu1@ds047514.mongolab.com:47514/heroku_rj5n1g0h"
        },
        redis: {
            url: "redis://rediscloud:xNQhJxZPLwoEvMSK@pub-redis-17179.eu-west-1-1.2.ec2.garantiadata.com:17179"
        },
        cloudinary: {
            cloud_name: "hmcoiplak",
            api_key: "775381495392617",
            api_secret: "vBpTaMNCpDedcsafIW5AyXQnmZA"
        }
    },
}