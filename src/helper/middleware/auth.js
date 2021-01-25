const jwt = require('jsonwebtoken')
module.exports = {
    authentication: (req, res, next) => {
        const headers = req.headers
        if (!headers.token) {
            // ERROR
        } else {
            jwt.verify(headers.token, process.env.JWT_SECRET, (err, res) => {
                if (err) {
                    // ERROR
                } else {
                    next()
                }
            })
        }
    },
    authAdmin: (req, res, next) => {
        const access = res.userAccess
        if (access === 0) {
            next()
        } else {
            // Error
        }
    },
    authCashier: (req, res, next) => {
        const access = res.userAccess
        if (access === 1) {
            next()
        } else {
            // Error
        }
    }
}