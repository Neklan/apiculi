var pkg = require("../../../package.json")

exports.index = function(req, res) {
    res.render("index/index", {
        title: "Welcome to " + pkg.name
    })
}