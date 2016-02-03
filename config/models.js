var uuid = require('node-uuid')

module.exports = [{
    name: "Action",
    routeName: "actions",
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
        _user: {
            type: String,
            ref: "User"
        },
        imageFile: {
            type: String,
            required: true,
        },
        startDate: Number,
        endDate: Number,
        club: String,
        place: String,
        address: String,
        email: String,
        url: String,
        description: String,
        youtubeUrl: String,
        publicFrom: Number,
        publicEnd: Number,
        price: Number,
        priceType: String,
        totalTickets: Number,
        ticketsPerRegistration: Number,
        eventType: String,
        position: Number,
        createdAt: Number,
        updatedAt: Number
    }
}, {
    name: "File",
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
}, {
    name: "User",
    routeName: "users",
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
        isAdmin: Boolean,
        createdAt: Number,
        updatedAt: Number
    }
}]