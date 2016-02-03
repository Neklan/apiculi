var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    LocalStrategy = require('passport-local').Strategy,
    BearerStrategy = require('passport-http-bearer').Strategy,
    Facilitator = require("token-facilitator"),
    client = require("./redis").pub,
    prefix = "ovm-f8b818ae84582282122c39d332564bbf2cbe6c02:",
    crypto = require("crypto"),
    _ = require("underscore")


function generateToken(data, next) {
    var facilitator = new Facilitator({
        redis: client
    })
    var facilitatorOptions = {
        timeout: 14 * 24 * 60 * 60,
        prefix: prefix
    }
    facilitator.generate(data, facilitatorOptions, function(err, token) {
        if (err)
            console.error(err)
        next(token)
    })
}

function getKeyFromToken(token) {
    return prefix + crypto.createHash('sha1').update(token).digest('hex');
}

module.exports = function(passport) {


    // Local strategy
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },

        function(email, password, done) {
            User.findOne({
                email: email
            }, function(err, user) {
                if (err) {
                    done(err)
                } else {
                    if (!user) {
                        done(null, false, {
                            type: "error",
                            description: "User was not found."
                        })
                    } else if (!user.hashedPassword || !user.authenticate(password)) {
                        done(null, false, {
                            type: "error",
                            description: "Wrong password."
                        })
                    } else {
                        generateToken(user, function(token) {
                            user.save(function() {
                                done(null, {
                                    access_token: token
                                });
                            })
                        })
                    }
                }
            })
        }))

    // Bearer strategy
    passport.use(new BearerStrategy(
        function(token, done) {
            var key = getKeyFromToken(token)
            client.get(key, function(err, user) {
                if (user && _.isString(user)) {
                    user = JSON.parse(user)
                    done(null, user)
                } else {
                    done(null, false, {
                        type: "error",
                        description: "Access token is not valid."
                    })
                }
            })
        }));
}