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
                    const data = JSON.parse(result)                                                             // All Data
                    const searchBy = htmlspecialchars(req.query.where)                                          // Where field
                    const search = htmlspecialchars(req.query.whereVal)                                         // Where value
                    const startDate = htmlspecialchars(req.query.betweenStart)                                  // Ranging start
                    const endDate = htmlspecialchars(req.query.betweenEnd)                                      // Ranging End
                    const page = htmlspecialchars(req.query.page) ? _.toNumber(htmlspecialchars(req.query.page)) : 1        // Pagination
                    // Limit, if in body key limit exist, the valu will set to body.limit, else set to 10
                    const limit = htmlspecialchars(req.query.limit) ? _.toNumber(htmlspecialchars(req.query.limit)) : 10    // Limitation
                    // Offset, if page equal to 1, the offset will be start at 0 in limit key of array
                    const offset = page === 1 ? 0 : (page - 1) * limit                                                      // Offset
                    let filtered = []       // For filter data (search)
                    let dataLimited = []    // For data after search and limit

                    // Ranging Time
                    if (startDate && endDate) {
                        filtered = _.filter(data, (el) => el.date_number >= _.toNumber(startDate) && el.date_number <= _.toNumber(endDate))
                    } else {
                        filtered = data // Skip
                    }

                    // Searching Query
                    if (search && searchBy) {
                        filtered = _.filter(data, (el) =>
                            el[searchBy].toString().toLowerCase().indexOf(search.toLowerCase()) > -1
                        )
                    }

                    // Ordering query
                    if (req.query.orderBy && req.query.orderMethod) {
                        const orderBy = req.query.orderBy.toLowerCase()
                        const orderMethod = req.query.orderMethod.toLowerCase() === "asc" ? "asc" : req.query.orderMethod.toLowerCase() === "desc" ? "desc" : null
                        filtered = _.orderBy(filtered, orderBy, orderMethod)
                    }

                    // Limit and pagination
                    const limiter = _.slice(filtered, offset, offset + limit)
                    dataLimited = limiter   // Limited data
                    _.map(dataLimited, el => el.date = Moment.unix(el.date).format('DD MMMM YYYY'))
                    // Response()
                    responser.success(res, dataLimited, page, data.length, limit, filtered.length)
                } else {
                    next()  // Skip
                }
            }
        })
    }
}