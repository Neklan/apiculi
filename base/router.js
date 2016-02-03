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
    app.post('/api/actions', actionController.create);
    app.get('/api/actions/:id', actionController.getById);
    app.get('/api/actions', actionController.getAll);
    app.put('/api/actions/:id', actionController.update);
    app.put('/api/actions/:id/change-position/:position', actionController.changePosition);
    app.delete('/api/actions/:id', actionController.deleteById);
    app.delete('/api/actions', actionController.deleteAll);

    var fileController = require('../app/controllers/file');
    app.post('/api/file', fileController.create);
    app.get('/api/file/:id', fileController.getById);
    app.get('/api/file', fileController.getAll);
    app.put('/api/file/:id', fileController.update);
    app.delete('/api/file/:id', fileController.deleteById);
    app.delete('/api/file', fileController.deleteAll);

    app.all('*', function(req, res) {
        res.status(404).json({
            type: 'error',
            description: 'This endpoint does not exist.'
        })
    })

}