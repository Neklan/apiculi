var env = process.env.NODE_ENV || 'local',
    multer = require("multer"),
    storage = multer.memoryStorage(),
    bodyParser = require("body-parser"),
    flash = require('connect-flash'),
    cookieParser = require("cookie-parser"),
    logger = require("morgan"),
    session = require("express-session")



var allowCrossDomain = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, SessionToken, Authorization');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.status(200).end();
    } else {
        next();
    }
};

module.exports = function(app, sessionStore, passport, config) {
    app.set('port', process.env.PORT || config[env].port);
    app.use(logger(":method :url :response-time ms - :res[content-length] b"))

    app.set('views', require('path').normalize(__dirname) + '/../app/frontend/views')
    app.set('view engine', 'jade');
    app.set('view options', {
        layout: 'layouts/default'
    })

    app.use(allowCrossDomain);
    app.use(bodyParser.urlencoded({
        extended: true
    }))
    app.use(bodyParser.json({
        limit: '50mb'
    }))
    app.use(cookieParser())
    app.use(bodyParser.urlencoded({
        limit: '50mb',
        extended: true
    }))
    app.use(multer({
        storage: storage
    }).single("file"))

    if (sessionStore) {
        app.use(session({
            store: sessionStore,
            secret: 'secret',
            key: 'express.sid',
            saveUninitialized: true,
            resave: true
        }))

        // flash messages init
        app.use(flash());
    }

    if (passport) {
        app.use(passport.initialize())
        app.use(passport.session())
    }


}