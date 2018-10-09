import mongoose from 'mongoose'
const Schema = mongoose.Schema
import shortid from 'shortid'
import paginate from 'mongoose-paginate'

import User from './models/User'

const models = [User]

models.forEach(model => {
    model.schema._id = {
        type: String,
        default: shortid.generate
    }
    model.schema.createdAt = {
        type: Date,
        default: Date
    }
    model.schema.updatedAt = {
        type: Date,
        default: Date
    }
    var ModelSchema = new Schema(model.schema || {})
    ModelSchema.plugin(paginate)
    mongoose.model(model.name, ModelSchema)
})
