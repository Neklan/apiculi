import http from 'http'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import config from './config'
import router from './router'
import db from './db'

let app = express()
app.server = http.createServer(app)

// logger
app.use(morgan('dev'))

// 3rd party middleware
// app.use(
//     cors({
//         exposedHeaders: config.corsHeaders
//     })
// )

app.use(
    bodyParser.json({
        limit: config.bodyLimit || '50mb'
    })
)

app.use(
    bodyParser.urlencoded({
        limit: '50mb',
        extended: true
    })
)
if (config.mongo) {
    mongoose.Promise = global.Promise
    mongoose.connect(
        config.mongo,
        {
            useNewUrlParser: true
        }
    )
    mongoose.set('debug', process.env.NODE_ENV != 'production')
    db.init()
}
app.use('/', router(app))

app.server.listen(process.env.PORT || config.port, () => {
    console.log(`Started on port ${app.server.address().port}`)
})
export default app
