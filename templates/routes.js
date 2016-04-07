var passport = require("passport")

module.exports = {
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