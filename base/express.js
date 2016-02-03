var env = process.env.NODE_ENV || 'local'

module.exports = function(app, sessionStore, passport, config) {
    app.set('port', process.env.PORT || config[env].port);
}