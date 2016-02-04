var uuid = require("node-uuid")

module.exports = {
    name: "Mockup",
    routeName: "mockups",
    positionable: true,
    schema: {
        _id: {
            type: String,
            default: uuid.v4
        },
        title: {
            type: String,
            required: true
        },
        createdAt: Number,
        updatedAt: Number
    }
}