var uuid = require("node-uuid")

module.exports = {
    name: "User",
    schema: {
        _id: {
            type: String,
            default: uuid.v4
        },
        firstName: String,
        lastName: String,
        createdAt: Number,
        updatedAt: Number
    }
}