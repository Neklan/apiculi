var uuid = require("node-uuid")

module.exports = {
    name: "User",
    schema: {
        _id: {
            type: String,
            default: uuid.v4
        },
        name: String,
        surname: String,
        address: String,
        photo: String,
        totalPoints: Number,
        createdAt: Number,
        updatedAt: Number
    }
}