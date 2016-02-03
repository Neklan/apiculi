var mongoose = require('mongoose'),
    File = mongoose.model('File'),
    baseController = require('../../base/controller.js');

exports.create = function(req, res) {
    baseController.create(req, File, function(status, result) {
        res.status(status.code).json(result)
    })
}

exports.getById = function(req, res) {
    baseController.getById(req, File, function(status, result) {
        res.status(status.code).json(result)
    })
}

exports.getAll = function(req, res) {
    baseController.getAll(req, File, function(status, result) {
        res.status(status.code).json(result)
    })
}

exports.update = function(req, res) {
    baseController.update(req, File, function(status, result) {
        res.status(status.code).json(result)
    })
}

exports.deleteById = function(req, res) {
    baseController.deleteById(req, File, function(status, result) {
        res.status(status.code).json(result)
    })
}

exports.deleteAll = function(req, res) {
    baseController.deleteAll(req, File, function(status, result) {
        res.status(status.code).json(result)
    })
}