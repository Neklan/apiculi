var verification = require('./middleware/verification');

module.exports = function(app, passport) {
    var userController = require('./controllers/user');
    app.delete('/api/users', userController.deleteAll);
}