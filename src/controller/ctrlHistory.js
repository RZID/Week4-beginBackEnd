const { md_getHistory, md_addHistory, md_deleteHistory, md_updateHistory, md_getAllHistory, md_getHistory_rds } = require("../model/mdHistory")
const { md_getProdHistory } = require("../model/mdProduct")
const { month } = require("../helper/helperText")
const responser = require("../helper/helperResponse")
const htmlspecialchars = require('htmlspecialchars')
const redisClient = require('../config/redis')

module.exports = {
    redisHistory: (req, res) => {
        md_getHistory_rds().then((response) => {
            const resToText = JSON.stringify(response)
            redisClient.set('dataHistory', resToText)
        }).catch((err) => {
            responser.internalError(res, err.message)
        })
    },
    getHistory: async (req, res) => {
        try {
            const countRow = await md_getAllHistory()
            // Ternary of searching query
            const search = htmlspecialchars(req.query.where) && htmlspecialchars(req.query.whereVal) ? `WHERE ${htmlspecialchars(req.query.where)}_history like '%${htmlspecialchars(req.query.whereVal)}%'` : ''
            const date = htmlspecialchars(req.query.betweenStart) && htmlspecialchars(req.query.betweenEnd) ? `WHERE UNIX_TIMESTAMP(date_history) >= ${htmlspecialchars(req.query.betweenStart)} AND UNIX_TIMESTAMP(date_history) <= ${htmlspecialchars(req.query.betweenEnd)}` : ''
            // Ternary of ordering to uppercase

            const countFilteredRow = await md_getAllHistory(date)
            const reOrder = htmlspecialchars(req.query.orderMethod) ? htmlspecialchars(req.query.orderMethod.toUpperCase()) : ""
            // Ternary of ordering query
            const order = htmlspecialchars(req.query.orderBy) && reOrder == "ASC" || reOrder == "DESC" ? `ORDER BY ${htmlspecialchars(req.query.orderBy)}_history ${reOrder}` : ''
            // Ternary of current page
            const page = htmlspecialchars(req.query.page) ? htmlspecialchars(req.query.page) : 1
            // Limit, if in body key limit exist, the valu will set to body.limit, else set to 3
            const limit = htmlspecialchars(req.query.limit) ? _.toNumber(htmlspecialchars(req.query.limit)) : 10
            // Offset, if page equal to 1, the offset will be start at 0 in limit key of array
            const offset = page === 1 ? 0 : (page - 1) * limit
            // Ternary of limit query
            const limiter = limit ? `LIMIT ${offset},${limit}` : ''

            md_getHistory(search, order, limiter, date).then(async (resolve) => {
                resolve.map(el => {
                    const fullDate = new Date(el.date * 1000)
                    const getDate = fullDate.getDate()
                    const getMonth = month(fullDate.getMonth())
                    const getYear = fullDate.getFullYear()
                    el.invoice = `#${el.invoice}`
                    el.date = `${getDate} ${getMonth} ${getYear}`
                })
                if (resolve.length <= 0) {
                    responser.noContent(res)
                } else {
                    // Set redis for caching
                    module.exports.redisHistory()
                    responser.success(res, resolve, page, countRow, limit, countFilteredRow)
                }
            }).catch(err => responser.internalError(res, err.message))
        } catch (err) {
            responser.internalError(res, err)
        }
    },
    addHistory: async (req, res) => {
        try {
            const body = req.body
            let data = {}
            data.cashier = htmlspecialchars(body.cashier)
            data.product = htmlspecialchars(body.product)
            if (!body.cashier || !body.product) {
                responser.inputError(res, 'You must fill all of input!')
            } else {
                // Array of product container
                let arrProduct = []
                // Array of amount container
                let arrAmount = []
                // Error handling for undefined id of product
                let error = false
                // From body.product filtering number and comma only, make to array and sorting the result 
                const arrOfIdProduct = data.product.replace(/[^\d,]+/g, "").split(",").sort((a, b) => a - b).filter(el => el !== null && el !== "")
                // Get unique of id only
                const arrOfUniqueProduct = arrOfIdProduct.filter((val, i, self) => self.indexOf(val) === i)
                // Looping for get product detail of orders
                for (let element of arrOfUniqueProduct) {
                    await md_getProdHistory(`WHERE id_product = ${element}`).then(resolve => {
                        if (resolve.length < 1) {
                            // Set Error
                            error = true
                            // Return Error for undefined in response
                            responser.inputError(res, `Undefined id ${element} in Product! don't make any creative for ID of Product!`)
                        } else {
                            // Push to array of object
                            arrProduct.push(`${resolve[0].name} x${arrOfIdProduct.filter(el => el.indexOf(element) > -1).length}`)
                        }
                    })
                }

                // Looping for get summary product prices of orders
                for (let element of arrOfIdProduct) {
                    await md_getProdHistory(`WHERE id_product = ${element}`).then(resolve => {
                        if (resolve.length > 0) {
                            arrAmount.push(resolve[0].price)
                        }
                    })
                }
                // Result of final product to storing in DB
                const joinedProduct = arrProduct.length > 0 ? arrProduct.join(", ") : ""
                // Result of final amount to storing in DB
                const reducedPrice = arrAmount.length > 0 ? (arrAmount.reduce((a, b) => a + b) + arrAmount.reduce((a, b) => a + b) / 10) : ""
                if (!error) {
                    // Set redis for caching
                    module.exports.redisHistory()
                    md_addHistory(data.cashier, joinedProduct, reducedPrice)
                        .then(resolve => { responser.success(res, `Inserted in id : ${resolve}`) }).catch(err => responser.internalError(res, err.message))
                }
            }
        } catch (err) {
            responser.internalError(res, err)
        }
    },
    deleteHistory: (req, res) => {
        try {
            if (!req.params.id) {
                responser.inputError(res, "ID must be filled!")
            } else {
                md_deleteHistory(htmlspecialchars(req.params.id)).then(resolve => {
                    // Set redis for caching
                    module.exports.redisHistory()
                    responser.success(res, resolve)
                }).catch(err => responser.internalError(res, err.message))
            }
        } catch (err) {
            responser.internalError(res, err)
        }
    },
    updateHistory: async (req, res) => {
        try {
            const body = htmlspecialchars(req.body)
            if (!body.cashier && !body.product) {
                responser.inputError(res, 'You must fill one or all of input!')
            } else {
                const id = htmlspecialchars(req.params.id)
                id ? id : responser.inputError(res, 'ID Must be filled!')
                // If only cashier
                if (!body.product) {
                    md_updateHistory(id, { cashier: body.cashier })
                        .then(
                            resolve => {
                                responser.success(res, `Updated in id : ${resolve}`)
                            })
                        .catch(err => responser.internalError(res, err.message))
                } else {
                    // If Product isset
                    let arrProduct = []
                    // Array of amount container
                    let arrAmount = []

                    let error = false
                    // From body.product filtering number and comma only, make to array and sorting the result 
                    const arrOfIdProduct = body.product.replace(/[^\d,]+/g, "").split(",").sort((a, b) => a - b).filter(el => el !== null && el !== "")
                    // Get unique of id only
                    const arrOfUniqueProduct = arrOfIdProduct.filter((val, i, self) => self.indexOf(val) === i)
                    // Looping for get product detail of orders
                    for (let element of arrOfUniqueProduct) {
                        await md_getProdHistory(`WHERE id_product = ${element}`).then(resolve => {
                            if (resolve.length < 1) {
                                error = true
                                responser.inputError(res, `Undefined id: ${element} in id of product! Don't make any creative ID in there`)
                            } else {
                                arrProduct.push(`${resolve[0].name} x${arrOfIdProduct.filter(el => el.indexOf(element) > -1).length}`)
                            }
                        })
                    }

                    // Looping for get summary product prices of orders
                    for (let element of arrOfIdProduct) {
                        await md_getProdHistory(`WHERE id_product = ${element}`).then(resolve => {
                            if (resolve.length > 0) {
                                arrAmount.push(resolve[0].price)
                            }
                        })
                    }
                    // Result of final product to storing in DB
                    const joinedProduct = arrProduct.length > 0 ? arrProduct.join(", ") : ""
                    // Result of final amount to storing in DB
                    const reducedPrice = arrAmount.length > 0 ? (arrAmount.reduce((a, b) => a + b) + arrAmount.reduce((a, b) => a + b) / 10) : ""
                    if (!error) {
                        const objOfUpdate = {
                            cashier: body.cashier,
                            product: joinedProduct,
                            amount: reducedPrice
                        }
                        md_updateHistory(id, objOfUpdate)
                            .then(
                                resolve => {
                                    // Set redis for caching
                                    module.exports.redisHistory()
                                    responser.success(res, `Updated in id : ${resolve}`)
                                })
                            .catch(err => responser.internalError(res, err.message))
                    }
                }
            }
        } catch (err) {
            responser.internalError(res, err)
        }
    }
}