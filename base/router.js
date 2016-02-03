var verification = require('./middleware/verification');

module.exports = function(app, passport) {
    require('../app/router')(app, passport);

    app.get('/api', function(req, res) {
        res.status(200).json({
            name: 'api-generator',
            version: '0.0.1'
        })
    })

    var actionController = require('../app/controllers/action');
    app.post('/api/actions', passport.authenticate('bearer', {
        session: false
    }), actionController.create);
    app.get('/api/actions/:id', passport.authenticate('bearer', {
        session: false
    }), actionController.getById);
    app.get('/api/actions', passport.authenticate('bearer', {
        session: false
    }), actionController.getAll);
    app.put('/api/actions/:id', passport.authenticate('bearer', {
        session: false
    }), actionController.update);
    app.put('/api/actions/:id/change-position/:position', passport.authenticate('bearer', {
        session: false
    }), actionController.changePosition);
    app.delete('/api/actions/:id', passport.authenticate('bearer', {
        session: false
    }), actionController.deleteById);
    app.delete('/api/actions', passport.authenticate('bearer', {
        session: false
    }), actionController.deleteAll);

    var fileController = require('../app/controllers/file');
    app.post('/api/file', passport.authenticate('bearer', {
        session: false
    }), fileController.create);
    app.get('/api/file/:id', passport.authenticate('bearer', {
        session: false
    }), fileController.getById);
    app.get('/api/file', passport.authenticate('bearer', {
        session: false
    }), fileController.getAll);
    app.put('/api/file/:id', passport.authenticate('bearer', {
        session: false
    }), fileController.update);
    app.delete('/api/file/:id', passport.authenticate('bearer', {
        session: false
    }), fileController.deleteById);
    app.delete('/api/file', passport.authenticate('bearer', {
        session: false
    }), fileController.deleteAll);

    var userController = require('../app/controllers/user');
    app.post('/api/users', userController.register);
    app.post('/api/users/create', passport.authenticate('bearer', {
        session: false
    }), userController.create);
    app.get('/api/users/me', passport.authenticate('bearer', {
        session: false
    }), userController.getMe);
    app.get('/api/users', passport.authenticate('bearer', {
        session: false
    }), userController.getAll);
    app.get('/api/users/:id', passport.authenticate('bearer', {
        session: false
    }), userController.getById);
    app.get('/api/users/activate/:hash', passport.authenticate('bearer', {
        session: false
    }), userController.activate);
    app.get('/api/users/access_token', passport.authenticate('bearer', {
        session: false
    }), userController.accessToken);
    app.put('/api/users/me', passport.authenticate('bearer', {
        session: false
    }), userController.updateMe);
    app.put('/api/users/:id', passport.authenticate('bearer', {
        session: false
    }), userController.updateUser);
    app.delete('/api/users/:id', passport.authenticate('bearer', {
        session: false
    }), userController.deleteById);
    app.delete('/api/users', passport.authenticate('bearer', {
        session: false
    }), userController.deleteAll);

    app.all('*', function(req, res) {
        res.status(404).json({
            type: 'error',
            description: 'This endpoint does not exist.'
        })
    })

}