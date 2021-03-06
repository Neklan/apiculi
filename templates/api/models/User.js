var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    paginate = require('mongoose-paginate'),
    crypto = require("crypto"),
    config = require('../../../config/config.js'),
    _ = require("underscore"),
    shortid = require('shortid'),
    configModel = _.findWhere(config.models, {
        name: "User"
    })


var requiredSchema = {
    _id: {
        type: String,
        default: shortid.generate
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                return re.test(value);
            },
            message: "{VALUE} is not valid email address."
        }
    },
    isActivated: Boolean,
    activationHash: String,
    hashedPassword: String,
    salt: String
}

if (configModel) {
    _.each(requiredSchema, function(value, key) {
        configModel.schema[key] = value
    })
}



var UserSchema = new Schema(configModel ? configModel.schema : requiredSchema);

/**
 * Methods
 */

UserSchema.methods = {

    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */

    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashedPassword
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */

    makeSalt: function() {
        return Math.round((new Date().valueOf() * Math.random())) + ''
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */

    encryptPassword: function(password) {
        if (!password) return ''
        return crypto.createHmac('sha1', this.salt).update(password).digest('hex')
    }
}

UserSchema.plugin(paginate);

mongoose.model("User", UserSchema)