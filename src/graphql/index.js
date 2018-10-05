import { makeExecutableSchema } from 'graphql-tools'
import Types from './types/index'

import { createBatchResolver } from 'graphql-resolve-batch'

import { CustomError } from './errors/error'

import pubsub from '../middleware/pubsub'
import { withFilter } from 'graphql-subscriptions'

import indexController from './controllers/index'

import { batch } from './batch'

const Query = `
    # Root queries
    type Query{
        getMessage: String
    }
`

const Mutation = `
    # Root mutations
    type Mutation {
        createMessage(text: String!): String
    }
`

const Subscription = `
    # Root subscriptions
    type Subscription  {
        newMessage: String
    }
`

const SchemaDefinition = `
    schema {
        query: Query,
        mutation: Mutation,
        subscription: Subscription
    }
`

export default makeExecutableSchema({
    typeDefs: [SchemaDefinition, Query, Mutation, Subscription, Types],
    resolvers: {
        Query: {
            getMessage: indexController.getMessage
        },
        Mutation: {
            createMessage: (obj, args) => {
                return args.text
            }
        },
        Subscription: {
            newMessage: {
                subscribe: () => pubsub.asyncIterator('newMessage')
            }
        }
    }
})
