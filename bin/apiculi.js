#!/usr/bin/env node

var fs = require("fs"),
    _ = require("underscore"),
    beautify = require("js-beautify").js_beautify,
    program = require("commander"),
    mkdirp = require("mkdirp"),
    readline = require('readline'),
    path = require("path")


var config = require("../config/config.js"),
    pkg = require("../package.json")


program
    .version(pkg.version)
    .usage('[options] [dir]')
    .option('    --git', 'add .gitignore')
    .option('-f, --force', 'force on non-empty directory')
    .option('-m, --mongo <url>', 'set mongo connection url')
    .option('-r, --redis <url>', 'set redis connection url')
    .parse(process.argv);

/**
 * Create application at the given directory `path`.
 *
 * @param {String} path
 */

var createApplication = function(app_name, path) {
    var wait = 10

    console.log()
    var complete = function() {
        if (--wait) return;

        var prompt = launchedFromCmd() ? '>' : '$';

        console.log();
        console.log('   install dependencies:');
        console.log('     %s cd %s && npm install', prompt, path);
        console.log();
        if (!program.mongo) {
            console.log('   replace mongo and redis connection urls in config file');
            console.log();
        }

        console.log('   run the app:');

        if (launchedFromCmd()) {
            console.log('     %s npm start', prompt);
        } else {
            console.log('     %s npm start', prompt);
        }

        console.log();


    }

    // Main file
    var server = loadTemplate("templates/server.js")

    // Base settings
    var express = loadTemplate("templates/express.js")
    var router = loadTemplate("templates/router.js")
    var routes = loadTemplate("templates/routes.js")

    // Middleware
    var pagination = loadTemplate("templates/middleware/pagination.js")
    var passport = loadTemplate("templates/middleware/passport.js")
    var verification = loadTemplate("templates/middleware/verification.js")
    var redis = loadTemplate("templates/middleware/redis.js")
    var response = loadTemplate("templates/middleware/response.js")

    // Api controllers
    var baseController = loadTemplate("templates/api/controllers/baseController.js")
    var mockupController = loadTemplate("templates/api/controllers/mockupController.js")
    var userController = loadTemplate("templates/api/controllers/userController.js")

    // Models
    var BaseModel = loadTemplate("templates/api/models/Base.js")
    var UserModel = loadTemplate("templates/api/models/User.js")
    var MockupModel = loadTemplate("templates/api/models/Mockup.js")

    // Config files
    var config = loadTemplate("config/config.js")
    var modelsIndex = loadTemplate("config/models/index.js")
    var modelUser = loadTemplate("config/models/User.js")
    var modelMockup = loadTemplate("config/models/Mockup.js")

    // Frontend part
    var frontendController = loadTemplate("templates/frontend/controller.js")
    var layout = loadTemplate("templates/frontend/layout.jade")
    var view = loadTemplate("templates/frontend/view.jade")

    mkdir(path, function() {
        mkdir(path + "/app", function() {
            write(path + "/app/router.js", router)
            write(path + "/app/routes.js", routes)
            write(path + "/app/express.js", express)
            complete()
        })

        // Api part
        mkdir(path + "/app/api")

        // Controllers
        mkdir(path + "/app/api/controllers", function() {
            write(path + "/app/api/controllers/base.js", baseController)
            write(path + "/app/api/controllers/mockup.js", mockupController)
            write(path + "/app/api/controllers/user.js", userController)
            complete()
        })

        // Models
        mkdir(path + "/app/api/models", function() {            
            write(path + "/app/api/models/User.js", UserModel)
            write(path + "/app/api/models/Base.js", BaseModel)
            write(path + "/app/api/models/Mockup.js", MockupModel)
            complete()
        })

        // Frontend part
        mkdir(path + "/app/frontend")

        // Frontend controllers
        mkdir(path + "/app/frontend/controllers", function() {
            write(path + "/app/frontend/controllers/index.js", frontendController)
            complete()
        })

        // Views
        mkdir(path + "/app/frontend/views/index", function() {
            write(path + "/app/frontend/views/index/index.jade", view)
            complete()
        })

        // Layouts
        mkdir(path + "/app/frontend/views/layouts", function() {
            write(path + "/app/frontend/views/layouts/default.jade", layout)
            complete()
        })

        // Public folders
        mkdir(path + '/public');
        mkdir(path + '/public/javascripts');
        mkdir(path + '/public/images');        
        mkdir(path + '/public/stylesheets');

        // Middleware
        mkdir(path + "/app/middleware", function() {
            write(path + "/app/middleware/pagination.js", pagination)
            write(path + "/app/middleware/passport.js", passport)
            write(path + "/app/middleware/verification.js", verification)
            write(path + "/app/middleware/redis.js", redis)
            write(path + "/app/middleware/response.js", response)
            complete()
        })

        mkdir(path + "/config", function() {

            // Replace mongo url
            if (program.mongo) {
                config = config.replace("MONGO_CONNECTION_URL", program.mongo)
            }

            // Replace redis url
            if (program.redis) {
                config = config.replace("REDIS_CONNECTION_URL", program.redis)
            }
            write(path + "/config/config.js", config)
            mkdir(path + "/config/models", function() {
                write(path + "/config/models/index.js", modelsIndex)
                write(path + "/config/models/User.js", modelUser)
                write(path + "/config/models/Mockup.js", modelMockup)
                complete()
            })
            complete()
        })

        // package.json
        var pkg = {
            name: app_name,
            version: '0.0.1',
            private: true,
            scripts: {
                start: 'node server.js'
            },
            dependencies: {
                "body-parser": "~1.13.2",
                "connect-flash": "^0.1.1",
                "connect-redis": "^3.0.2",
                "cookie-parser": "~1.3.5",
                "crypto": "latest",
                "debug": "~2.2.0",
                "express": "~4.13.1",
                "express-session": "^1.13.0",
                "form-data": "^1.0.0-rc3",
                "iconv": "^2.1.11",
                "jade": "~1.11.0",
                "js-beautify": "^1.6.2",
                "mongoose": "latest",
                "mongoose-paginate": "^4.2.0",
                "morgan": "~1.6.1",
                "multer": "latest",
                "node-uuid": "latest",
                "passport": "latest",
                "passport-http-bearer": "latest",
                "passport-local": "latest",
                "redis": "latest",
                "request": "latest",
                "serve-favicon": "^2.3.0",
                "token-facilitator": "latest",
                "underscore": "latest"
            }
        }

        // write files
        write(path + '/package.json', JSON.stringify(pkg, null, 4));
        write(path + "/server.js", server)
        if (program.git) {
            write(path + '/.gitignore', fs.readFileSync(__dirname + '/../templates/gitignore', 'utf-8'));
        }
        complete()
    })
}

/**
 * Load template file.
 */

function loadTemplate(name) {
    return fs.readFileSync(path.join(__dirname, '..', name), 'utf-8');
}

/**
 * echo str > path.
 *
 * @param {String} path
 * @param {String} str
 */

function write(path, str, mode) {
    fs.writeFileSync(path, str, {
        mode: mode || 0666
    });
    console.log('   \x1b[36mcreate\x1b[0m : ' + path);
}

/**
 * Mkdir -p.
 *
 * @param {String} path
 * @param {Function} fn
 */

function mkdir(path, fn) {
    mkdirp(path, 0755, function(err) {
        if (err) throw err;
        console.log('   \033[36mcreate\033[0m : ' + path);
        fn && fn();
    });
}

/**
 * Check if the given directory `path` is empty.
 *
 * @param {String} path
 * @param {Function} fn
 */

var emptyDirectory = function(path, fn) {
    fs.readdir(path, function(err, files) {
        if (err && 'ENOENT' != err.code) throw err;
        fn(!files || !files.length);
    });
}

/**
 * Prompt for confirmation on STDOUT/STDIN
 */

function confirm(msg, callback) {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question(msg, function(input) {
        rl.close();
        callback(/^y|yes|ok|true$/i.test(input));
    });
}

/**
 * Determine if launched from cmd.exe
 */

function launchedFromCmd() {
    return process.platform === 'win32' && process.env._ === undefined;
}

/**
 * Main program.
 */

var init = function() {
    // Path
    var destinationPath = program.args[0] || '.';

    // App name
    var appName = path.basename(path.resolve(destinationPath));

    // Generate application
    emptyDirectory(destinationPath, function(empty) {
        if (empty || program.force) {
            createApplication(appName, destinationPath);
        } else {
            confirm('destination is not empty, continue? [y/N] ', function(ok) {
                if (ok) {
                    process.stdin.destroy();
                    createApplication(appName, destinationPath);
                } else {
                    console.error('aborting');
                }
            });
        }
    });
}

exports.init = init

init()