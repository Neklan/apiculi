var mongoose = require('mongoose'),
    Action = mongoose.model('Action'),
    baseController = require('../../base/controller.js');

exports.create = function(req, res) {
    baseController.create(req, Action, function(status, result) {
        if (status.type == 'success') {
            res.status(status.code).json(result)
        } else {
            res.status(status.code).json(status)
        }
    })
}

exports.getById = function(req, res) {
    baseController.getById(req, Action, function(status, result) {
        if (status.type == 'success') {
            res.status(status.code).json(result)
        } else {
            res.status(status.code).json(status)
        }
    })
}

exports.getAll = function(req, res) {
    baseController.getAll(req, Action, function(status, result) {
        if (status.type == 'success') {
            res.status(status.code).json(result)
        } else {
            res.status(status.code).json(status)
        }
    })
}

exports.update = function(req, res) {
    baseController.update(req, Action, function(status, result) {
        if (status.type == 'success') {
            res.status(status.code).json(result)
        } else {
            res.status(status.code).json(status)
        }
    })
}

exports.deleteById = function(req, res) {
    baseController.deleteById(req, Action, function(status, result) {
        if (status.type == 'success') {
            res.status(status.code).json(result)
        } else {
            res.status(status.code).json(status)
        }
    })
}

exports.deleteAll = function(req, res) {
    baseController.deleteAll(req, Action, function(status, result) {
        if (status.type == 'success') {
            res.status(status.code).json(result)
        } else {
            res.status(status.code).json(status)
        }
    })
}

exports.changePosition = function(req, res) {
    baseController.changePosition(req, Action, function(status, result) {
        if (status.type == 'success') {
            res.status(status.code).json(result)
        } else {
            res.status(status.code).json(status)
        }
    })
}