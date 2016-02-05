var verification = require('./middleware/verification'),
    config = require("../config/config.js"),
    pkg = require("../package.json"),
    _ = require("underscore"),
    mongoose = require('mongoose'),
    fs = require("fs");

var passport = require("passport")
var routes = {
    base: {
        urls: [{
            type: "post",
            endpoint: "/api/ROUTE_NAME",
            method: "create"
        }, {
            type: "get",
            endpoint: "/api/ROUTE_NAME/:id",
            method: "getById"
        }, {
            type: "get",
            endpoint: "/api/ROUTE_NAME",
            method: "getAll"
        }, {
            type: "put",
            endpoint: "/api/ROUTE_NAME/:id",
            method: "update"
        }, {
            type: "put",
            endpoint: "/api/ROUTE_NAME/:id/change-position/:position",
            method: "changePosition"
        }, {
            type: "delete",
            endpoint: "/api/ROUTE_NAME/:id",
            method: "deleteById"
        }, {
            type: "delete",
            endpoint: "/api/ROUTE_NAME",
            method: "deleteAll"
        }]
    },
    user: {
        middleware: [passport.authenticate("bearer", {
            session: false
        })],
        urls: [{
            type: "post",
            endpoint: "/api/users",
            method: "register",
            middleware: []
        }, {
            type: "get",
            endpoint: "/api/users/me",
            method: "getMe"
        }, {
            type: "get",
            endpoint: "/api/users/access_token",
            method: "accessToken",
            middleware: [passport.authenticate('local', {
                session: false
            })]
        }, {
            type: "get",
            endpoint: "/api/users",
            method: "getAll"
        }, {
            type: "get",
            endpoint: "/api/users/:id",
            method: "getById"
        }, {
            type: "get",
            endpoint: "/api/users/activate/:hash",
            method: "activate"
        }, {
            type: "put",
            endpoint: "/api/users/me",
            method: "updateMe"
        }, {
            type: "put",
            endpoint: "/api/users/:id",
            method: "updateById"
        }, {
            type: "delete",
            endpoint: "/api/users/:id",
            method: "deleteById"
        }, {
            type: "delete",
            endpoint: "/api/users",
            method: "deleteAll"
        }]
    }
}


module.exports = function(app) {

    // Frontend part
    var indexController = require('./frontend/controllers/index');
    app.get('/', indexController.index);

    // API part
    app.get('/api', function(req, res) {
        res.status(200).json({
            name: pkg.name,
            version: pkg.version
        });
    });

    var baseController = require("./api/controllers/base")

    var responseCallback = function(res, status, result) {
        if (status.type == 'success') {
            res.status(status.code).json(result)
        } else {
            res.status(status.code).json(status)
        }
    }

    var generateRoute = function(route, controller, Model) {
        if (!route.middleware) {
            route.middleware = function(req, res, next) {
                next()
            }
        }
        app[route.type](route.endpoint, route.middleware, function(req, res) {

            if (controller) {
                if (Model.modelName == "User") {
                    controller[route.method](req, Model, function(status, result) {
                        responseCallback(res, status, result)
                    })
                } else {
                    controller[route.method](req, res)
                }

            } else {
                baseController[route.method](req, Model, function(status, result) {
                    responseCallback(res, status, result)
                })
            }

        })
    }

    _.each(config.models, function(model) {
        if (model.name == "User") {
            if (config.users) {
                var User = mongoose.model("User")
                var controller = require("./api/controllers/user")
                _.each(routes.user.urls, function(route) {
                    if (!route.middleware) {
                        route.middleware = routes.user.middleware
                    }
                    generateRoute(route, controller, User)
                })
            }
        } else {
            var name = model.name.toLowerCase()
            var routeName = model.routeName || name
            var path = "./api/controllers/" + name
            var exists = fs.existsSync(path)
            var controller = null
            var Model = mongoose.model(model.name)
            if (exists) {
                controller = require(path)
            }
            var modelRoutes = routes[name] || routes.base
            _.each(modelRoutes.urls, function(route) {
                if (!route.middleware) {
                    route.middleware = modelRoutes.middleware
                }
                route.endpoint = route.endpoint.replace("ROUTE_NAME", routeName)
                if (route.method == "changePosition") {
                    if (model.positionable) {
                        generateRoute(route, controller, Model)
                    }
                } else {
                    generateRoute(route, controller, Model)
                }
            })
        }
    })

    app.all('*', function(req, res) {
        res.status(404).json({
            type: 'error',
            description: 'This endpoint does not exist.'
        })
    })

}