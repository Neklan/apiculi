var mongoose = require('mongoose'),
    Mockup = mongoose.model('Mockup'),
    baseController = require('./base.js');

exports.create = function(req, res) {
    baseController.create(req, Mockup, function(status, result) {
        if (status.type == 'success') {
            res.status(status.code).json(result)
        } else {
            res.status(status.code).json(status)
        }
    })
}

exports.getById = function(req, res) {
    baseController.getById(req, Mockup, function(status, result) {
        if (status.type == 'success') {
            res.status(status.code).json(result)
        } else {
            res.status(status.code).json(status)
        }
    })
}

exports.getAll = function(req, res) {
    baseController.getAll(req, Mockup, function(status, result) {
        if (status.type == 'success') {
            res.status(status.code).json(result)
        } else {
            res.status(status.code).json(status)
        }
    })
}

exports.update = function(req, res) {
    baseController.update(req, Mockup, function(status, result) {
        if (status.type == 'success') {
            res.status(status.code).json(result)
        } else {
            res.status(status.code).json(status)
        }
    })
}

exports.deleteById = function(req, res) {
    baseController.deleteById(req, Mockup, function(status, result) {
        if (status.type == 'success') {
            res.status(status.code).json(result)
        } else {
            res.status(status.code).json(status)
        }
    })
}

exports.deleteAll = function(req, res) {
    baseController.deleteAll(req, Mockup, function(status, result) {
        if (status.type == 'success') {
            res.status(status.code).json(result)
        } else {
            res.status(status.code).json(status)
        }
    })
}

exports.changePosition = function(req, res) {
    baseController.changePosition(req, Mockup, function(status, result) {
        if (status.type == 'success') {
            res.status(status.code).json(result)
        } else {
            res.status(status.code).json(status)
        }
    })
}