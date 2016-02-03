var mongoose = require('mongoose'),
    File = mongoose.model('File'),
    baseController = require('../../base/controller.js');

exports.create = function(req, res) {
    baseController.create(req, File, function(status, result) {
        if (status.type == 'success') {
            res.status(status.code).json(result)
        } else {
            res.status(status.code).json(status)
        }
    })
}

exports.getById = function(req, res) {
    baseController.getById(req, File, function(status, result) {
        if (status.type == 'success') {
            res.status(status.code).json(result)
        } else {
            res.status(status.code).json(status)
        }
    })
}

exports.getAll = function(req, res) {
    baseController.getAll(req, File, function(status, result) {
        if (status.type == 'success') {
            res.status(status.code).json(result)
        } else {
            res.status(status.code).json(status)
        }
    })
}

exports.update = function(req, res) {
    baseController.update(req, File, function(status, result) {
        if (status.type == 'success') {
            res.status(status.code).json(result)
        } else {
            res.status(status.code).json(status)
        }
    })
}

exports.deleteById = function(req, res) {
    baseController.deleteById(req, File, function(status, result) {
        if (status.type == 'success') {
            res.status(status.code).json(result)
        } else {
            res.status(status.code).json(status)
        }
    })
}

exports.deleteAll = function(req, res) {
    baseController.deleteAll(req, File, function(status, result) {
        if (status.type == 'success') {
            res.status(status.code).json(result)
        } else {
            res.status(status.code).json(status)
        }
    })
}