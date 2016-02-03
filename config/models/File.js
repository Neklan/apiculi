var uuid = require("node-uuid")

module.exports = {
    name: "File",
    routeName: "files",
    schema: {
        _id: {
            type: String,
            default: uuid.v4
        },
        name: String,
        _user: {
            type: String,
            ref: "User"
        },
        cloudinary: {},
        createdAt: Number,
        updatedAt: Number
    }
}