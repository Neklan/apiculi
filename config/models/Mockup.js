module.exports = {
    name: "Mockup",
    routeName: "mockups",
    positionable: true,
    schema: {
        title: {
            type: String,
            required: true
        },
        createdAt: Number,
        updatedAt: Number
    }
}