var pagination = require("../../middleware/pagination"),
    _ = require("underscore"),
    config = require("../../../config/config")

var parseErrors = function(err) {
    var errors = []
    _.each(err.errors, function(error) {
        errors.push(error.message)
    })
    return errors
}

exports.create = function(req, Model, next) {
    configModel = _.findWhere(config.models, {
        name: Model.modelName
    })
    var save = function(lastItem) {
        var item = new Model(req.body)
        item.set("updatedAt", new Date().getTime())
        item.set("createdAt", new Date().getTime())
        if (configModel.positionable) {
            item.set("position", lastItem != null ? lastItem.get("position") + 1 : 0)
        }
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
    if (configModel.positionable) {
        Model.findOne({}).sort({
            position: -1
        }).exec(function(err, lastItem) {
            save(lastItem)
        })
    } else {
        save()
    }

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
    configModel = _.findWhere(config.models, {
        name: Model.modelName
    })
    Model.findOne({
        _id: req.params.id
    }, function(err, item) {
        if (err) {
            console.log(err)
        }
        if (item) {
            delete req.body._id
            delete req.body.createdAt
            if(configModel.positionable) {
                delete req.body.position
            }
            _.each(req.body, function(value, key) {
                item.set(key, value)
            })
            item.set("__v", item.get("__v") + 1)
            item.set("updatedAt", new Date().getTime())
            item.save(function(err) {
                next({
                    code: 200,
                    type: "success"
                }, item)
            })
        } else {
            next({
                code: 404,
                type: "error",
                message: "Item not found."
            }, item)
        }
    })
}

exports.changePosition = function(req, Model, next) {
    pagination.changePosition(req, Model, function(err, item) {
        if (err) {
            console.log(err)
            next({
                code: 400,
                type: "error",
                message: err
            }, null)
        } else {
            next({
                code: 200,
                type: "success"
            }, item)
        }
    })
}

exports.deleteAll = function(req, Model, next) {
    Model.remove({}, function(err) {
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

exports.deleteById = function(req, Model, next) {
    Model.findOne({
        _id: req.params.id
    }, function(err, item) {
        if (err) {
            console.log(err)
        }
        if (item) {
            item.remove(function() {
                next({
                    code: 200,
                    type: "success"
                }, {})
            })
        } else {
            next({
                code: 404,
                type: "error",
                message: "Item not found."
            }, item)
        }
    })
}