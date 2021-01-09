const { md_getHistory, md_addHistory, md_deleteHistory, md_updateHistory } = require("../model/mdHistory")
const { md_getProdHistory } = require("../model/mdProduct")
const { month } = require("../helper/helperText")
const { toRupiah } = require("../helper/helperCurrency")

module.exports = {
    getHistory: (req, res) => {
        const search = req.body.where && req.body.whereVal ? `WHERE ${req.body.where}_history like '%${req.body.whereVal}%'` : ''
        const reOrder = req.body.orderMethod ? req.body.orderMethod.toUpperCase() : ""
        const order = req.body.orderBy && reOrder == "ASC" || reOrder == "DESC" ? `ORDER BY ${req.body.orderBy}_history ${reOrder}` : ''
        const page = req.query.page ? req.query.page : 1
        // Limit, if in body key limit exist, the valu will set to body.limit, else set to 3
        const limit = req.body.limit ? req.body.limit : 3
        // Offset, if page equal to 1, the offset will be start at 0 in limit key of array
        const offset = page === 1 ? 0 : (page - 1) * limit
        const limiter = `LIMIT ${offset},${limit}`

        md_getHistory(search, order, limiter).then(async (resolve) => {
            resolve.map(el => {
                const fullDate = new Date(el.date * 1000)
                const getDate = fullDate.getDate()
                const getMonth = month(fullDate.getMonth())
                const getYear = fullDate.getFullYear()
                el.invoice = `#${el.invoice}`
                el.date = `${getDate} ${getMonth} ${getYear}`
                el.amount = toRupiah(el.amount)
            })
            res.json(resolve)
        }).catch(err => res.json({ Error: err.message }))
    },
    addHistory: async (req, res) => {
        const body = req.body
        if (!body.cashier || !body.product) {
            res.json({ Error: `You must fill all of input!` })
        } else {
            // Array of product container
            let arrProduct = []
            // Array of amount container
            let arrAmount = []
            // From body.product filtering number and comma only, make to array and sorting the result 
            const arrOfIdProduct = body.product.replace(/[^\d,]+/g, "").split(",").sort((a, b) => a - b)
            // Get unique of id only
            const arrOfUniqueProduct = arrOfIdProduct.filter((val, i, self) => self.indexOf(val) === i)

            // Looping for get product detail of orders
            for (let element of arrOfUniqueProduct) {
                await md_getProdHistory(`WHERE id_product = ${element}`).then(resolve => {
                    if (resolve.length < 1) {
                        return res.json({ Error: `Undefined id: ${element} in id of product! Don't make any creative ID in there` })
                    } else {
                        arrProduct.push(`${resolve[0].name} x${arrOfIdProduct.filter(el => el.indexOf(element) > -1).length}`)
                    }
                })
            }

            // Looping for get summary product prices of orders
            for (let element of arrOfIdProduct) {
                await md_getProdHistory(`WHERE id_product = ${element}`).then(resolve => {
                    arrAmount.push(resolve[0].price)
                })
            }
            // Result of final product to storing in DB
            const joinedProduct = arrProduct.join(", ")
            // Result of final amount to storing in DB
            const reducedPrice = arrAmount.reduce((a, b) => a + b)
            md_addHistory(body.cashier, joinedProduct, reducedPrice)
                .then(
                    resolve => {
                        res.json({ success: `Inserted in id : ${resolve}` })
                    })
                .catch(err => res.json({
                    Error: err.message
                }))
        }
    },
    deleteHistory: (req, res) => {
        if (!req.params.id) {
            res.json({ Error: "ID must be filled!" })
        } else {
            md_deleteHistory(req.params.id).then(resolve => {
                res.json(resolve)
            }).catch(err => res.json(err.message))
        }
    },
    updateHistory: async (req, res) => {
        const body = req.body
        if (!body.cashier && !body.product) {
            res.json({ Error: `You must fill one or all of input!` })
        } else {
            const id = req.params.id
            id ? id : res.json({ Error: "ID Must be filled!" })
            // If only cashier
            if (!body.product) {
                md_updateHistory(id, { cashier: body.cashier })
                    .then(
                        resolve => {
                            res.json({ success: `Updated in id : ${resolve}` })
                        })
                    .catch(err => res.json({
                        Error: err.message
                    }))
            } else {
                // If Product isset
                let arrProduct = []
                // Array of amount container
                let arrAmount = []
                // From body.product filtering number and comma only, make to array and sorting the result 
                const arrOfIdProduct = body.product.replace(/[^\d,]+/g, "").split(",").sort((a, b) => a - b)
                // Get unique of id only
                const arrOfUniqueProduct = arrOfIdProduct.filter((val, i, self) => self.indexOf(val) === i)

                // Looping for get product detail of orders
                for (let element of arrOfUniqueProduct) {
                    await md_getProdHistory(`WHERE id_product = ${element}`).then(resolve => {
                        if (resolve.length < 1) {
                            return res.json({ Error: `Undefined id: ${element} in id of product! Don't make any creative ID in there` })
                        } else {
                            arrProduct.push(`${resolve[0].name} x${arrOfIdProduct.filter(el => el.indexOf(element) > -1).length}`)
                        }
                    })
                }

                // Looping for get summary product prices of orders
                for (let element of arrOfIdProduct) {
                    await md_getProdHistory(`WHERE id_product = ${element}`).then(resolve => {
                        arrAmount.push(resolve[0].price)
                    })
                }
                // Result of final product to storing in DB
                const joinedProduct = arrProduct.join(", ")
                // Result of final amount to storing in DB
                const reducedPrice = arrAmount.reduce((a, b) => a + b)
                const objOfUpdate = {
                    cashier: body.cashier,
                    product: joinedProduct,
                    amount: reducedPrice
                }
                md_updateHistory(id, objOfUpdate)
                    .then(
                        resolve => {
                            res.json({ success: `Updated in id : ${resolve}` })
                        })
                    .catch(err => res.json({
                        Error: err.message
                    }))
            }

        }
    }
}