var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    paginate = require('mongoose-paginate'),
    config = require('../../../config/config.js'),
    _ = require("underscore");

_.each(config.models, function(model) {
    if (model.name != "User") {
        var ModelSchema = new Schema(model.schema || {})
        ModelSchema.plugin(paginate);
        mongoose.model(model.name, ModelSchema)
    }

})