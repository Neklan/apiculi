var pagination = require("./middleware/pagination"),
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
                    user.set("updatedAt", new Date().getTime())
                    user.set("createdAt", new Date().getTime())
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

exports.create = function(req, res, next) {

}

exports.activate = function(req, res, next) {

}

exports.get = function(req, res, next) {

}

exports.getById = function(req, res, next) {

}

exports.me = function(req, res, next) {

}


exports.update = function(req, res, next) {


}

exports.updateUser = function(req, res, next) {

}

exports.delete = function(req, res, next) {

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

exports.accessToken = function(req, res, next) {

}