var pagination = require("../../middleware/pagination"),
    _ = require("underscore")

var parseErrors = function(err) {
    var errors = []
    _.each(err.errors, function(error) {
        errors.push(error.message)
    })
    return errors
}

exports.register = function(req, User, next) {
    User.count({}, function(err, count) {
        req.body.email = req.body.email.toLowerCase()
        User.findOne({
            email: req.body.email
        }, function(err, user) {
            if (user) {
                next({
                    code: 400,
                    type: "error",
                    message: "User with this email already exists."
                })
            } else {
                if (!req.body.password) {
                    next({
                        code: 400,
                        type: "error",
                        message: "Path `password` is required."
                    })
                } else {
                    var user = new User(req.body);
                    user.set("isAdmin", count == 0 ? true : false);
                    user.set("isActivated", count == 0 ? true : false);
                    user.set("salt", user.makeSalt());
                    user.set("hashedPassword", user.encryptPassword(req.body.password));
                    user.set("activationHash", user.encryptPassword(user.salt));
                    user.save(function(err) {
                        if (err) {
                            next({
                                code: 400,
                                type: "error",
                                message: err.message,
                                errors: parseErrors(err)
                            })
                        } else {
                            next({
                                code: 200,
                                type: "success"
                            }, user)
                        }
                    })
                }

            }
        })
    })
}

exports.activate = function(req, User, next) {
    User.findOne({
        activationHash: req.params.hash
    }, function(err, user) {
        if (err) {
            console.log(err)
        }
        if (user) {
            if (!user.isActivated) {
                user.isActivated = true
                user.save(function() {
                    next({
                        code: 200,
                        type: "success",
                        message: "Activation was successfull."
                    }, user)
                })

            } else {
                next({
                    code: 404,
                    type: "error",
                    message: "User is already activated."
                }, user)
            }

        } else {
            next({
                code: 404,
                type: "error",
                message: "User not found."
            }, user)
        }
    })
}

exports.getAll = function(req, User, next) {
    var options = pagination.init(req)
    User.count({}, function(err, count) {
        User.paginate({}, options, function(err, users) {
            next({
                code: 200,
                type: "success"

            }, {
                results: users,
                total: count
            })
        })
    })
}

exports.getById = function(req, User, next) {
    User.findOne({
        _id: req.params.id
    }, function(err, user) {
        if (user) {
            next({
                code: 200,
                type: "success"
            }, user)
        } else {
            next({
                code: 404,
                type: "error",
                message: "User not found."
            }, user)
        }
    })
}

exports.getMe = function(req, User, next) {
    User.findOne({
        _id: req.user._id
    }, function(err, user) {
        if (user) {
            next({
                code: 200,
                type: "success"
            }, user)
        } else {
            next({
                code: 404,
                type: "error",
                message: "User not found."
            }, user)
        }
    })
}

exports.updateMe = function(req, User, next) {
    User.findOne({
        _id: req.user._id
    }, function(err, user) {
        if (err) {
            console.log(err)
        }
        if (user) {
            delete req.body._id
            delete req.body.isAdmin
            delete req.body.isActivated
            delete req.body.activationHash
            delete req.body.hashedPassword
            delete req.body.salt
            delete req.body.createdAt

            _.each(req.body, function(value, key) {
                user.set(key, value)
            })

            user.set("__v", user.get("__v") + 1)
            user.set("updatedAt", Date())
            user.save(function(err) {
                next({
                    code: 200,
                    type: "success"
                }, user)
            })
        } else {
            next({
                code: 404,
                type: "error",
                message: "User not found."
            }, user)
        }
    })
}

exports.updateById = function(req, User, next) {
    User.findOne({
        _id: req.params.id
    }, function(err, user) {
        if (err) {
            console.log(err)
        }
        if (user) {
            delete req.body._id
            delete req.body.isAdmin
            delete req.body.isActivated
            delete req.body.activationHash
            delete req.body.hashedPassword
            delete req.body.salt
            delete req.body.createdAt

            _.each(req.body, function(value, key) {
                user.set(key, value)
            })

            user.set("__v", user.get("__v") + 1)
            user.set("updatedAt", Date())
            user.save(function(err) {
                next({
                    code: 200,
                    type: "success"
                }, user)
            })
        } else {
            next({
                code: 404,
                type: "error",
                message: "User not found."
            }, user)
        }
    })
}

exports.deleteById = function(req, User, next) {
    User.findOne({
        _id: req.params.id
    }, function(err, user) {
        if (err) {
            console.log(err)
        }
        if (user) {
            user.remove(function() {
                next({
                    code: 200,
                    type: "success"
                }, {})
            })
        } else {
            next({
                code: 404,
                type: "error",
                message: "User not found."
            }, user)
        }
    })
}

exports.deleteAll = function(req, User, next) {
    User.remove({}, function(err) {
        if (err) {
            next({
                code: 400,
                type: "error",
                message: err.message
            }, null)
        } else {
            next({
                code: 200,
                type: "success"
            }, {})
        }
    })
}

exports.accessToken = function(req, User, next) {
    if (req.user) {
        next({
            code: 200,
            type: "success"
        }, req.user)
    } else {
        next({
            code: 400,
            type: "error",
            message: "No user found by this token."
        }, null)
    }
}