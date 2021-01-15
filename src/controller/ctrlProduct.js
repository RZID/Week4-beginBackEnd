const { md_getProd, md_addProd, md_updateProd, md_deleteProd } = require("../model/mdProduct")
const { toRupiah } = require("../helper/helperCurrency")
module.exports = {
    getProd: (req, res) => {
        // If isset query searchLike in URL
        const search = req.query.searchLike ? `WHERE name_product LIKE '%${req.query.searchLike}%'` : ``
        // If in body, key order exist
        const order = req.query.order ? `ORDER BY ${req.query.order}_product ${req.query.orderMethod}` : ``
        // Pagination, if in query isset page the value will set to query page, else set to 1
        const page = req.query.page ? req.query.page : 1
        // Limit, if in body key limit exist, the valu will set to body.limit, else set to 3
        const limit = req.query.limit ? req.query.limit : 3
        // Offset, if page equal to 1, the offset will be start at 0 in limit key of array
        const offset = page === 1 ? 0 : (page - 1) * limit
        const limiter = `LIMIT ${offset},${limit}`
        // Join Table Category

        md_getProd(search, order, limiter).then((resolve) => {
            resolve.map(el => el.price = toRupiah(el.price))
            res.json(resolve)
        }).catch((err) => res.json(err.message))
    },
    getProdDetail: (req, res) => {
        if (!req.params.id) {
            res.json({ Error: "ID must be inserted in URL Params!" })
        } else {
            const whereClause = `WHERE id_product = '${req.params.id}'`
            md_getProd(whereClause).then((result) => {
                if (result.length < 1) {
                    res.json({ Error: "Requested ID isn't exist in product!" })
                } else {
                    md_getProd(whereClause).then((resolve) => {
                        res.json(resolve)
                    }).catch(err => res.json(err.message))
                }
            }).catch(err => res.json({ Error: err.message }))
        }
    },
    addProd: (req, res) => {
        const data = req.body
        if (!data.name || !data.price || !data.category) {
            res.json({ Error: `You must fill all of input!` })
        } else {
            md_addProd(data).then((resolve) => {
                res.json(resolve)
            }).catch((err) => {
                const message = err.message.split(" ")
                if (message[19] == "REFERENCES") {
                    res.json({ Error: `Identity of category isn't exist!` })
                } else {
                    res.json({ Error: `${err.message}` })
                }
            })
        }
    },
    updateProd: (req, res) => {
        const id = req.params.id
        const data = req.body
        if (!id) {
            return res.json({ Error: "ID must be filled!" })
        }
        md_updateProd(id, data).then((resolve) => {
            res.json(resolve)
        }).catch(err => res.json(err.message))
    },
    deleteProd: (req, res) => {
        const id = req.params.id
        if (!id) {
            return res.json({ Error: "ID must be filled!" })
        }
        md_deleteProd(id).then((resolve) => {
            res.json(resolve)
        }).catch(err => res.json({ Error: err.message }))
    }
}