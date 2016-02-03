var _ = require("underscore")

exports.init = function(req) {
    var options = {
        page: req.query.page || 1,
        limit: req.query.limit || 10,
        sortBy: {
            createdAt: -1
        }
    }
    if (req.query.sortBy != null) {
        var parts = req.query.sortBy.split(" ")
        if (parts[0] != null) {
            options.sortBy = {}
            options.sortBy[parts[0]] = parts[1] || 1
        }
    }
    return options
}

exports.changePosition = function(req, Model, next) {
    Model.count({}, function(err, count) {
        var newPosition = parseInt(req.params.position)
        if (_.isNumber(newPosition) && newPosition >= 0 && newPosition <= count - 1) {
            Model.findOne({
                _id: req.params.id
            }, function(err, item) {
                if (err) {
                    console.log(err)
                }
                if (item) {
                    var save = function(gte, lte, inc) {
                        Model.update({
                            position: {
                                "$gte": gte,
                                "$lte": lte
                            }
                        }, {
                            "$inc": {
                                position: inc
                            }
                        }, {
                            multi: true
                        }, function(err) {
                            if (err) {
                                console.log(err)
                            }
                            item.set("position", newPosition)
                            item.save(function(err) {
                                next(null, item)
                            })
                        })
                    }
                    if (newPosition < item.position) {
                        save(newPosition, item.position, 1)
                    } else if (newPosition > item.position) {
                        save(item.position, newPosition, -1)
                    } else {
                        next(null, item)
                    }
                } else {
                    next("Item was not found.")
                }
            })
        } else {
            next("Position must be number.")
        }
    })



}