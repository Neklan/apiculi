const publicRoutes = ['__schema']
const adminRoutes = []

exports.publicRoutes = publicRoutes
exports.adminRoutes = adminRoutes
exports.middleware = (req, res, next) => {
    next()
}
