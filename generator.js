var fs = require("fs"),
    _ = require("underscore"),
    beautify = require("js-beautify").js_beautify,
    rewrite = process.env.NODE_FORCE

var config = require("./config/config.js"),
    jsonPackage = require("./package.json")

var parseProperty = function(key, value) {
    if (_.isFunction(value)) {
        return key + ": " + value.name + ","
    } else if (_.isObject(value) || _.isArray(value)) {
        var text = key + ": {"
        _.each(value, function(property, index) {
            text += parseProperty(index, property)
        })
        text += "},"
        return text
    } else if (_.isString(value)) {
        return key + ": '" + value + "',"
    } else if (_.isBoolean(value)) {
        return key + ": " + value + ", "
    }
    return ""
}

var generateModel = function(model, index) {
    var js = "var mongoose = require('mongoose')," +
        "Schema = mongoose.Schema," +
        "paginate = require('mongoose-paginate')," +
        "config = require('../../config/config.js');\n\n"
    /*var properties = "{"
    properties += "_id: {" +
        "type: String," +
        "default: uuid.v4" +
        "},"
    _.each(model.properties, function(property, index) {
        properties += parseProperty(index, property)
    })
    properties += "}"*/
    js += "var " + model.name + "Schema = new Schema(config.models[" + index + "].schema);\n\n"
    js += model.name + "Schema.plugin(paginate);" +
        "mongoose.model('" + model.name + "', " + model.name + "Schema);"
    js = beautify(js)
    fs.writeFile("./base/models/" + model.name + ".js", js, function(err) {
        if (err) {
            console.log(err)
        }
        console.log("Model " + model.name + " was created.")
    })
}

var deleteFolderRecursive = function(path) {
    if (rewrite) {
        var files = [];
        if (fs.existsSync(path)) {
            files = fs.readdirSync(path);
            files.forEach(function(file, index) {
                var curPath = path + "/" + file;
                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                    deleteFolderRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    }

};

var generateFolders = function() {
    var folders = ["app", "app/models", "app/controllers", "app/middleware"]
    _.each(folders, function(folder) {
        if (!fs.existsSync("./" + folder)) {
            fs.mkdirSync("./" + folder)
        }
    })
}

var generateRoute = function(model, request, type) {
    if (type == undefined) {
        type = "one"
    }
    var name = model.name.toLowerCase()
    var routeName = model.routeName || name

    var authenticationType = "bearer"

    // Authentication type
    if (model.routes && model.routes[request] && model.routes[request][type] && model.routes[request][type].authentication !== undefined) {
        authenticationType = model.routes[request][type].authentication
    }

    // Authentication of route
    if (model.routes && model.routes[request] && model.routes[request].authentication !== undefined) {
        authenticationType = model.routes[request].authentication
    }

    var authentication = ""
    var userModel = _.findWhere(config.models, {
        name: "User"
    })
    if (authenticationType !== false && userModel) {
        switch (authenticationType) {
            case "bearer":
                authentication = "passport.authenticate('bearer', {session: false}), "
                break
            default:
                authentication = "passport.authenticate('bearer', {session: false}), "
                break
        }
    }



    /*var verificationObject = {
        isAdmin: true
    }

    // Verification types
    if (model.routes && model.routes[request] && model.routes[request][type] && model.routes[request][type].verification) {
        _.each(model.routes[request][type].verification, function(verification, index) {
            verificationObject[index] = verification
        })
    }

    // Verification route
    if (model.routes && model.routes[request] && model.routes[request].verification) {
        _.each(model.routes[request].verification, function(verification, index) {
            verificationObject[index] = verification
        })
    }

    
    _.each(verificationObject, function(verificate, index) {
        if (verificate) {
            verification += "verification." + index + ", "
        }
    })*/
    var verification = ""
    var js = ""
    switch (request) {
        case "post":
            js += "app.post('/api/" + routeName + "', " + authentication + verification + name + "Controller.create);"
            break
        case "get":
            if (type == "one") {
                js += "app.get('/api/" + routeName + "/:id', " + authentication + verification + name + "Controller.getById);"
            } else if (type == "all") {
                js += "app.get('/api/" + routeName + "', " + authentication + verification + name + "Controller.getAll);"
            }
            break
        case "put":
            js += "app.put('/api/" + routeName + "/:id', " + authentication + verification + name + "Controller.update);"
            if (model.positionable) {
                js += "app.put('/api/" + routeName + "/:id/change-position/:position', " + authentication + verification + name + "Controller.changePosition);"
            }
            break
        case "delete":
            if (type == "one") {
                js += "app.delete('/api/" + routeName + "/:id', " + authentication + verification + name + "Controller.deleteById);"
            } else if (type == "all") {
                js += "app.delete('/api/" + routeName + "', " + authentication + verification + name + "Controller.deleteAll);"
            }
            break
    }

    return js
}

var generateRouter = function() {
    var js = "var verification = require('./middleware/verification');\n\nmodule.exports = function(app, passport) {"
    js += "require('../app/router')(app, passport);\n\n"
    js += "app.get('/api', function(req, res) {" +
        "res.status(200).json({" +
        "name: '" + jsonPackage.name + "'," +
        "version: '" + jsonPackage.version + "'" +
        "})" +
        "})\n\n"
    _.each(config.models, function(model) {
        var name = model.name.toLowerCase()
        js += "var " + name + "Controller = require('../app/controllers/" + name + "');"
        js += generateRoute(model, "post")
        js += generateRoute(model, "get")
        js += generateRoute(model, "get", "all")
        js += generateRoute(model, "put")
        js += generateRoute(model, "delete")
        js += generateRoute(model, "delete", "all")
        js += "\n\n"
    })
    js += "}"
    js = beautify(js)
    fs.writeFile("./base/router.js", js, function(err) {
        if (err) {
            console.log(err)
        }
        console.log("Router was created.")
    })

    var path = "./app/router.js"
    if (!fs.existsSync(path) || rewrite) {
        js = "var verification = require('./middleware/verification');\n\nmodule.exports = function(app, passport) {"

        js += "}"
        js = beautify(js)
        fs.writeFile(path, js, function(err) {
            if (err) {
                console.log(err)
            }
            console.log("App router was created.")
        })
    }
}

var generateController = function(model) {
    var path = "./app/controllers/" + model.name.toLowerCase() + ".js"
    if (!fs.existsSync(path) || rewrite) {
        var js = ""
        js += "var mongoose = require('mongoose')," +
            model.name + " = mongoose.model('" + model.name + "')," +
            "baseController = require('../../base/controller.js');\n\n"

        var methods = ["create", "getById", "getAll", "update", "deleteById", "deleteAll"]
        if (model.positionable) {
            methods.push("changePosition")
        }

        _.each(methods, function(method) {
            js += "exports." + method + " = function(req, res) {" +
                "baseController." + method + "(req, " + model.name + ", function(status, result) { res.status(status.code).json(result)})" +
                "}\n\n"
        })

        js = beautify(js)
        fs.writeFile(path, js, function(err) {
            if (err) {
                console.log(err)
            }
            console.log("Controller " + model.name + " was created.")
        })
    }

}

var generateVerification = function() {
    var path = "./app/middleware/verification.js"
    if (!fs.existsSync(path) || rewrite) {
        var js = "exports.check = function(req, res, next) {"
        js += "next()}"

        js = beautify(js)
        fs.writeFile(path, js, function(err) {
            if (err) {
                console.log(err)
            }
            console.log("App verification was created.")
        })
    }
}

var generate = function() {
    // Folders
    deleteFolderRecursive("./app")
    generateFolders()

    // Models
    _.each(config.models, generateModel)

    // Controllers
    _.each(config.models, generateController)

    // Router
    generateRouter()

    // Verification
    generateVerification()
}

generate()

exports.generate = generate