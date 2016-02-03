var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    baseController = require('../../base/userController.js');

exports.register = function(req, res) {
    baseController.register(req, User, function(status, result) {
        if (status.type == 'success') {
            res.status(status.code).json(result)
        } else {
            res.status(status.code).json(status)
        }
    })
}

exports.create = function(req, res) {
    baseController.create(req, User, function(status, result) {
        if (status.type == 'success') {
            res.status(status.code).json(result)
        } else {
            res.status(status.code).json(status)
        }
    })
}

exports.activate = function(req, res) {
    baseController.activate(req, User, function(status, result) {
        if (status.type == 'success') {
            res.status(status.code).json(result)
        } else {
            res.status(status.code).json(status)
        }
    })
}

exports.getById = function(req, res) {
    baseController.getById(req, User, function(status, result) {
        if (status.type == 'success') {
            res.status(status.code).json(result)
        } else {
            res.status(status.code).json(status)
        }
    })
}

exports.getAll = function(req, res) {
    baseController.getAll(req, User, function(status, result) {
        if (status.type == 'success') {
            res.status(status.code).json(result)
        } else {
            res.status(status.code).json(status)
        }
    })
}

exports.getMe = function(req, res) {
    baseController.getMe(req, User, function(status, result) {
        if (status.type == 'success') {
            res.status(status.code).json(result)
        } else {
            res.status(status.code).json(status)
        }
    })
}

exports.updateMe = function(req, res) {
    baseController.updateMe(req, User, function(status, result) {
        if (status.type == 'success') {
            res.status(status.code).json(result)
        } else {
            res.status(status.code).json(status)
        }
    })
}

exports.updateUser = function(req, res) {
    baseController.updateUser(req, User, function(status, result) {
        if (status.type == 'success') {
            res.status(status.code).json(result)
        } else {
            res.status(status.code).json(status)
        }
    })
}

exports.deleteById = function(req, res) {
    baseController.deleteById(req, User, function(status, result) {
        if (status.type == 'success') {
            res.status(status.code).json(result)
        } else {
            res.status(status.code).json(status)
        }
    })
}

exports.deleteAll = function(req, res) {
    baseController.deleteAll(req, User, function(status, result) {
        if (status.type == 'success') {
            res.status(status.code).json(result)
        } else {
            res.status(status.code).json(status)
        }
    })
}

exports.accessToken = function(req, res) {
    baseController.accessToken(req, User, function(status, result) {
        if (status.type == 'success') {
            res.status(status.code).json(result)
        } else {
            res.status(status.code).json(status)
        }
    })
}