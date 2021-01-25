const client = require('../../config/redis')

module.exports = {
    product: (req, res, next) => {
        client.get('dataProduct', (err, result) => {
            if (err) {
                res.json({ error: err })
            } else {
                if (result) {
                    console.log(result)
                } else {
                    next()
                }
            }
        })
    }
}