const client = require('../../config/redis')
const _ = require('lodash')
const responser = require('../helperResponse')
const htmlspecialchars = require('htmlspecialchars')

module.exports = {
    product: (req, res, next) => {
        client.get('dataProduct', (err, result) => {
            if (err) {
                responser.internalError(res, err)
            } else {
                if (result) {
                    const searchBy = req.query.searchBy ? `${htmlspecialchars(req.query.searchBy)}` : 'name'
                    // If isset query searchLike in URL
                    const search = htmlspecialchars(req.query.searchLike)
                    // If in body, key order exist
                    const order = htmlspecialchars(req.query.order)
                    const orderMethod = htmlspecialchars(req.query.orderMethod)
                    // Pagination, if in query isset page the value will set to query page, else set to 1
                    const page = htmlspecialchars(req.query.page) ? htmlspecialchars(req.query.page) : 1
                    // Limit, if in body key limit exist, the valu will set to body.limit, else set to 3
                    const limit = htmlspecialchars(req.query.limit) ? _.toNumber(htmlspecialchars(req.query.limit)) : 6
                    // Offset, if page equal to 1, the offset will be start at 0 in limit key of array
                    const offset = page === 1 ? 0 : (page - 1) * limit

                    const data = JSON.parse(result)
                    let filtered = []

                    // Check if search isset, the array on top will be updated. else none
                    if (search) {
                        filtered = _.filter(data, (el) =>
                            el[searchBy].toString().toLowerCase().indexOf(search.toLowerCase()) > -1
                        )
                    } else {
                        filtered = data
                    }

                    // Order method 
                    if (order && orderMethod) {
                        filtered = _.orderBy(filtered, order, orderMethod.toLowerCase())
                    }
                    // Limit and pagination
                    if (limit && page) {
                        const limiter = _.slice(filtered, offset, offset + limit)
                        dataLimited = limiter
                    }
                    if (filtered.length > 0 && dataLimited.length > 0) {
                        responser.success(res, dataLimited, page, data.length, limit, filtered.length)
                    } else {
                        responser.noContent(res)
                    }
                } else {
                    next()
                }
            }
        })
    }
}