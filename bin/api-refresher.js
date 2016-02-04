#!/usr/bin/env node

var fs = require("fs"),
    _ = require("underscore"),
    beautify = require("js-beautify").js_beautify,
    program = require("commander"),
    path = require("path")

var destinationPath, config, pkg


program
    .option('-f, --force', 'force rewrite api controllers')
    .parse(process.argv);

var generateModel = function(model, index) {
    if (model.name != "User") {
        var js = "var mongoose = require('mongoose')," +
            "Schema = mongoose.Schema," +
            "paginate = require('mongoose-paginate')," +
            "config = require('../../../config/config.js');\n\n"

        js += "var " + model.name + "Schema = new Schema(config.models[" + index + "].schema);\n\n"
        js += model.name + "Schema.plugin(paginate);" +
            "mongoose.model('" + model.name + "', " + model.name + "Schema);"
        js = beautify(js)

        write(destinationPath + "/app/generated/models/" + model.name + ".js", js)
    }
    var path = destinationPath + "/app/models/" + model.name + ".js"
    if (!fs.existsSync(path) || program.force) {
        js = "var mongoose = require('mongoose'), "
        js += model.name + " = mongoose.model('" + model.name + "');\n\n"
        js = beautify(js)
        write(path, js)
    }
}


var generateRoutes = function(model) {
    var name = model.name.toLowerCase()
    var routeName = model.routeName || name

    var authentication = ""
    if (config.users) {
        authentication = "passport.authenticate('bearer', {session: false}), "
    }
    var js = ""

    js += "var " + name + "Controller = require('../controllers/" + name + "');"
    js += "app.post('/api/" + routeName + "', " + authentication + name + "Controller.create);"
    js += "app.get('/api/" + routeName + "/:id', " + authentication + name + "Controller.getById);"
    js += "app.get('/api/" + routeName + "', " + authentication + name + "Controller.getAll);"
    js += "app.put('/api/" + routeName + "/:id', " + authentication + name + "Controller.update);"
    if (model.positionable) {
        js += "app.put('/api/" + routeName + "/:id/change-position/:position', " + authentication + name + "Controller.changePosition);"
    }
    js += "app.delete('/api/" + routeName + "/:id', " + authentication + name + "Controller.deleteById);"
    js += "app.delete('/api/" + routeName + "', " + authentication + name + "Controller.deleteAll);\n\n"

    return js
}

var generateUserRoutes = function() {
    var js = ""
    js += "var userController = require('../controllers/user');"
    js += "app.post('/api/users', userController.register);"
    js += "app.get('/api/users/me', passport.authenticate('bearer', {session: false}), userController.getMe);"
    js += "app.get('/api/users/access_token', passport.authenticate('local', {session: false}), userController.accessToken);"
    js += "app.get('/api/users', passport.authenticate('bearer', {session: false}), userController.getAll);"
    js += "app.get('/api/users/:id', passport.authenticate('bearer', {session: false}), userController.getById);"
    js += "app.get('/api/users/activate/:hash', passport.authenticate('bearer', {session: false}), userController.activate);"
    js += "app.put('/api/users/me', passport.authenticate('bearer', {session: false}), userController.updateMe);"
    js += "app.delete('/api/users/:id', passport.authenticate('bearer', {session: false}), userController.deleteById);"
    js += "app.delete('/api/users', passport.authenticate('bearer', {session: false}), userController.deleteAll);\n\n"

    return js
}

var generateRouter = function() {
    var js = "var verification = require('../../base/middleware/verification');\n\nmodule.exports = function(app, passport) {"
    js += "require('../router')(app, passport);\n\n"
    js += "app.get('/api', function(req, res) {" +
        "res.status(200).json({" +
        "name: '" + pkg.name + "'," +
        "version: '" + pkg.version + "'" +
        "})" +
        "})\n\n"
    var requests = ["post", "get", "put", "delete"]
    _.each(config.models, function(model) {
        if (model.name != "User") {
            var name = model.name.toLowerCase()
            js += generateRoutes(model)
        }

    })

    if (config.users) {
        js += generateUserRoutes()
    }


    js += "app.all('*', function(req, res) {" +
        "res.status(404).json({" +
        "type: 'error'," +
        "description: 'This endpoint does not exist.'" +
        "})" +
        "})\n\n"

    js += "}"
    js = beautify(js)
    write(destinationPath + "/app/generated/router.js", js)

    var path = destinationPath + "/app/router.js"
    if (!fs.existsSync(path) || program.force) {
        js = "var verification = require('./middleware/verification');\n\nmodule.exports = function(app, passport) {"

        js += "}"
        js = beautify(js)
        write(path, js)
    }
}

var generateController = function(model) {
    var path = destinationPath + "/app/controllers/" + model.name.toLowerCase() + ".js"
    if ((!fs.existsSync(path) || program.force) && model.name != "User") {
        var js = ""
        js += "var mongoose = require('mongoose')," +
            model.name + " = mongoose.model('" + model.name + "'),"

        var methods = []

        js += "baseController = require('../../base/controller.js');\n\n"
        methods = ["create", "getById", "getAll", "update", "deleteById", "deleteAll"]
        if (model.positionable) {
            methods.push("changePosition")
        }



        _.each(methods, function(method) {
            js += generateBaseMethod(method, model.name)
        })

        js = beautify(js)
        write(path, js)
    }

}

var generateBaseMethod = function(method, modelName) {
    return "exports." + method + " = function(req, res) {" +
        "baseController." + method + "(req, " + modelName + ", function(status, result) {" +
        "if(status.type == 'success') {" +
        "res.status(status.code).json(result)" +
        "}else{" +
        "res.status(status.code).json(status)" +
        "}" +
        "})" +
        "}\n\n"
}

var generateUserController = function() {
    var path = destinationPath + "/app/controllers/user.js"
    if ((!fs.existsSync(path) || program.force)) {
        var js = ""
        js += "var mongoose = require('mongoose')," +
            "User = mongoose.model('User'),"

        var methods = []
        js += "baseController = require('../../base/userController.js');\n\n"
        methods = ["register", "activate", "getById", "getAll", "getMe", "updateMe", "deleteById", "deleteAll", "accessToken"]

        _.each(methods, function(method) {
            js += generateBaseMethod(method, "User")
        })

        js = beautify(js)
        write(path, js)
    }
}

var generateVerification = function() {
    var path = destinationPath + "/app/middleware/verification.js"
    if (!fs.existsSync(path) || program.force) {
        var js = "exports.check = function(req, res, next) {"
        js += "next()}"

        js = beautify(js)
        write(path, js)
    }
}


/**
 * echo str > path.
 *
 * @param {String} path
 * @param {String} str
 */

function write(path, str, mode) {
    fs.writeFileSync(path, str, {
        mode: mode || 0666
    });
    console.log('   \x1b[36mcreate\x1b[0m : ' + path);
}


/**
 * Main program.
 */

var init = function() {
    // Path
    destinationPath = program.args[0] ? process.cwd() + "/" + program.args[0] : process.cwd();

    config = require(destinationPath + "/config/config.js"),
    pkg = require(destinationPath + "/package.json")

    // Models
    _.each(config.models, generateModel)

    // Controllers
    _.each(config.models, generateController)

    // Does have api users?
    if (config.users) {
        generateUserController()
    }

    // Router
    generateRouter()

    // Verification
    generateVerification()
}

init()