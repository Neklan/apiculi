const env = process.env.NODE_ENV || 'local'
import pkg from '../../../package.json'

exports.index = (req, res) => {
    res.json({
        name: 'Apiculi API',
        version: pkg.version,
        env
    })
}
