var _ = require("underscore")

exports.isAdmin = function(req, res, next) {
    if (req.user && req.user.isAdmin) {
        next()
    } else {
        return res.status(403).json({
            type: "error",
            description: "You don't have permission to this action."
        })
    }
}

exports.checkParameters = function(parameters, rules, next, checkOnlyRequired) {
    if (!_.isObject(parameters)) {
        return next("Bad request.")
    }
    if (!Object.keys(parameters).length) {
        return next("No data was specified.")
    }
    for (var i in parameters) {
        var found = false;
        for (var j in rules) {
            if (i == j) {
                found = true;
                if (rules[j].validator) {
                    if (!rules[j].validator(parameters[i])) {
                        console.log(rules[j].message)
                        if (rules[j].message) {
                            return next("Wrong type of parameter " + i + ". " + rules[j].message)
                        } else {
                            return next("Wrong type of parameter " + i + ".")
                        }

                    }
                }
            }
        }
        if (!found && !checkOnlyRequired) {
            return next("Parameter " + i + " is not supported.")
        }
    }

    for (var i in rules) {
        if (rules[i].required) {
            var found = false;
            for (var j in parameters) {
                if (j == i) {
                    found = true
                }
            }
            if (!found) {
                return next("Parameter " + i + " is required.")
            }
        }
    }
    if (!parameters.updatedAt)
        parameters.updatedAt = new Date().getTime()
    next(null, parameters)
}