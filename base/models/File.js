var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    paginate = require('mongoose-paginate'),
    config = require('../../config/config.js');

var FileSchema = new Schema(config.models[1].schema);

FileSchema.plugin(paginate);
mongoose.model('File', FileSchema);