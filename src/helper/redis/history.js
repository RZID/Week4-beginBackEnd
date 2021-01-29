const client = require('../../config/redis')
const _ = require('lodash')
const responser = require('../helperResponse')
const Moment = require('moment')
const htmlspecialchars = require('htmlspecialchars')

module.exports = {
    history: (req, res, next) => {
        client.get('dataHistory', (err, result) => {
            if (err) {
                responser.internalError(res, err)
            } else {
                if (result) {
                    const data = JSON.parse(result)
                    res.json({ status: 'ini dari redis', data: data })
                    // const search = htmlspecialchars(req.query.where) && htmlspecialchars(req.query.whereVal) ? `WHERE ${htmlspecialchars(req.query.where)}_history like '%${htmlspecialchars(req.query.whereVal)}%'` : ''

                    // const date = htmlspecialchars(req.query.betweenStart) && htmlspecialchars(req.query.betweenEnd) ? `WHERE UNIX_TIMESTAMP(date_history) >= ${htmlspecialchars(req.query.betweenStart)} AND UNIX_TIMESTAMP(date_history) <= ${htmlspecialchars(req.query.betweenEnd)}` : ''
                } else {
                    next()
                }
            }
        })
    }
}