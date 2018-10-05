import { createError } from 'apollo-errors'

export const CustomError = createError('CustomError', {
    message: ''
})
