const jwt = require('jsonwebtoken')
const responser = require('../helperResponse')
module.exports = {
    authentication: (req, res, next) => {
        const headers = req.headers
        if (!headers.token) {
            responser.unauthenticated(res)
        } else {
            jwt.verify(headers.token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    responser.unauthenticated(res)
                } else {
                    res.roleAccess = decoded.role
                    next()
                }
            })
        }
    },
    authAdmin: (req, res, next) => {
        const role = res.roleAccess
        if (role === 1) {
            next()
        } else {
            responser.notAllowed(res, "You're not allowed to access this method")
        }
    },
    authCashier: (req, res, next) => {
        const role = res.roleAccess
        if (role === 2) {
            next()
        } else {
            responser.notAllowed(res, "You're not allowed to access this method")
        }
    }
}