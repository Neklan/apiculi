var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    paginate = require('mongoose-paginate'),
    config = require('../../config/config.js');

var ActionSchema = new Schema(config.models[0].schema);

ActionSchema.plugin(paginate);
mongoose.model('Action', ActionSchema);