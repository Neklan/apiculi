import { Router } from 'express'
import { createServer } from 'http'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { execute, subscribe } from 'graphql'
import { ApolloServer } from 'apollo-server-express'
import { formatError } from 'apollo-errors'
import bodyParser from 'body-parser'
import schema from './graphql'
import graphql from './middleware/graphql'

import indexController from './rest/controllers/index'

export default app => {
    let router = Router()
    let websocketServer = createServer(app)
    websocketServer.listen(app.get('port'), () => {
        console.log(
            'Server running at port ' +
                app.get('port') +
                ' on process pid ' +
                process.pid +
                '.'
        )
        SubscriptionServer.create(
            {
                rootValue: {
                    user: null
                },
                schema,
                execute,
                subscribe,
                keepAlive: 60 * 1000,
                onConnect: connectionParams => {
                    if (connectionParams.authToken) {
                        return {
                            authToken: connectionParams.authToken
                        }
                    } else {
                        return {
                            error: 401
                        }
                    }
                },
                onOperation: (message, connectionParams, webSocket) => {
                    if (
                        graphql.publicRoutes.indexOf(
                            message.payload.operationName
                        ) != -1
                    ) {
                        message.payload.context = {}
                        return message.payload
                    } else {
                        if (
                            connectionParams.context &&
                            connectionParams.context.authToken
                        ) {
                            return authentication
                                .getUserByToken(
                                    connectionParams.context.authToken
                                )
                                .then(user => {
                                    message.payload.context = {
                                        user,
                                        token:
                                            connectionParams.context.authToken
                                    }
                                    return message.payload
                                })
                                .catch(error => {
                                    console.log(error)
                                    return {
                                        error
                                    }
                                })
                        } else {
                            return {
                                error: 'Missing auth token!'
                            }
                        }
                    }
                }
            },
            {
                server: websocketServer,
                path: '/graphql'
            }
        )
    })
    const server = new ApolloServer({
        schema,
        context: ({ req }) => {
            return {
                user: req.user
            }
        },
        rootValue: ({ req }) => {
            return req
        },
        formatError,
        pretty: true,
        tracing: true,
        cacheControl: true
    })
    server.applyMiddleware({ app })
    router.get('/', indexController.index)
    return router
}
