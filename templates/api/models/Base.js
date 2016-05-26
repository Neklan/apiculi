var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    paginate = require('mongoose-paginate'),
    config = require('../../../config/config.js'),
    _ = require("underscore"),
    shortid = require('shortid');

_.each(config.models, function(model) {
    if (model.name != "User") {
        if (model.schema) {
            model.schema._id = {
                type: String,
                default: shortid.generate
            }
            model.schema.createdAt = {
                type: Date,
                default: Date
            },
            model.schema.updatedAt = {
                type: Date,
                default: Date
            }
        }
        var ModelSchema = new Schema(model.schema || {})
        ModelSchema.plugin(paginate);
        mongoose.model(model.name, ModelSchema)
    }
})