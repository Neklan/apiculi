var pagination = require("./middleware/pagination"),
    _ = require("underscore")

var parseErrors = function(err) {
    var errors = []
    _.each(err.errors, function(error) {
        errors.push(error.message)
    })
    return errors
}

exports.create = function(req, Model, next) {
    var item = new Model(req.body)
    item.set("updatedAt", new Date().getTime())
    item.set("createdAt", new Date().getTime())
    item.save(function(err) {
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
            }, item)
        }

    })
}

exports.getAll = function(req, Model, next) {
    var options = pagination.init(req)
    Model.count({}, function(err, count) {
        Model.paginate({}, options, function(err, results) {
            next({
                code: 200,
                type: "success"

            }, {
                results: results,
                total: count
            })
        })
    })
}

exports.getById = function(req, Model, next) {
    Model.findOne({
        _id: req.params.id
    }, function(err, item) {
        if (err) {
            console.log(err)
        }
        if (item) {
            next({
                code: 200,
                type: "success"
            }, item)
        } else {
            next({
                code: 404,
                type: "error",
                message: "Item not found."
            }, item)
        }
    })
}

exports.update = function(req, Model, next) {

}

exports.changePosition = function(req, Model, next) {

}

exports.deleteAll = function(req, Model, next) {

}

exports.deleteById = function(req, Model, next) {

}