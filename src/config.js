const ENV = process.env.NODE_ENV || 'local'
const BASE_SETTINGS = {
    mongo: ''
}
const SETTINGS = {
    local: {
        port: 8280,
        url: 'http://localhost:8280',
        subscriptionsEndpoint: 'ws://localhost:8280/graphql'
    },
    production: {
        port: 8280,
        url: 'https://apiculi.com',
        subscriptionsEndpoint: 'wss://apiculi.com/graphql'
    }
}
module.exports = Object.assign(BASE_SETTINGS, SETTINGS[ENV])
