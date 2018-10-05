import mongoose from 'mongoose'

exports.batch = (sources, args, context, info) => {
    let values = sources.map(source => {
        if (source[info.fieldName]) {
            return source[info.fieldName]
        }
    })
    values = [].concat.apply([], values)
    // Check, if we ask only for _ids
    if (
        info.fieldNodes.length == 1 &&
        info.fieldNodes[0].selectionSet.selections.length == 1 &&
        info.fieldNodes[0].selectionSet.selections[0].name.value == '_id'
    ) {
        return sources.map(source => {
            if (typeof source[info.fieldName] === 'string') {
                let _id = null
                values.forEach(value => {
                    _id = {
                        _id: value
                    }
                })
                return _id
            }
            if (typeof source[info.fieldName] === 'object') {
                let _ids = []
                values.forEach(value => {
                    let insertValue = {
                        _id: value
                    }
                    if (
                        source[info.fieldName] != null &&
                        typeof source[info.fieldName].indexOf === 'function' &&
                        source[info.fieldName].indexOf(value) != -1 &&
                        !_ids.find(insertValue)
                    ) {
                        _ids.push(insertValue)
                    }
                })
                return _ids
            }
        })
    } else {
        const returnType = info.returnType
            .toString()
            .replace('[', '')
            .replace(']', '')
            .replace('!', '')
        return mongoose
            .model(returnType)
            .find({
                _id: {
                    $in: values
                }
            })
            .skip(args.skip || 0)
            .limit(args.limit || 10000)
            .sort(args.sort || 'createdAt -1')
            .then(results => {
                return sources.map(source => {
                    if (typeof source[info.fieldName] === 'string') {
                        let value = null
                        results.forEach(result => {
                            if (result._id == source[info.fieldName]) {
                                value = result
                            }
                        })
                        return value
                    }
                    if (typeof source[info.fieldName] === 'object') {
                        let values = []
                        results.forEach(result => {
                            if (
                                source[info.fieldName] != null &&
                                typeof source[info.fieldName].indexOf ===
                                    'function' &&
                                source[info.fieldName].indexOf(result._id) != -1
                            ) {
                                values.push(result)
                            }
                        })
                        return values
                    }
                })
            })
    }
}
