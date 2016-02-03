exports.isAdmin = function(req, res, next) {
    if (req.user && req.user.isAdmin) {
        next()
    } else {
        return res.status(403).json({
            type: "error",
            description: "You don't have permission to this action."
        })
    }
}