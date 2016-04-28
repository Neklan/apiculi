module.exports = function(code, error, success, res, next) {
    if (next) {
        if (error) {
            console.log(error)
            next({
                code: code,
                type: "error",
                description: error
            })
        } else {
            next({
                code: code,
                type: "success"
            }, success)
        }

    } else {
        if (error) {
            console.log(error)
            res.status(code).json({
                type: "error",
                description: error
            })
        } else {
            res.status(code).json(success)
        }

    }
}