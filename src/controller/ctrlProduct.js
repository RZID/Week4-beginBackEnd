const { md_getProd, md_addProd, md_updateProd, md_deleteProd } = require("../model/mdProduct")
module.exports = {
    getProd: (req, res) => {
        // If isset query searchLike in URL
        const search = req.query.searchLike ? `WHERE name_product LIKE '%${req.query.searchLike}%'` : ``
        // If in body, key order exist
        const order = req.body.order ? `ORDER BY ${req.body.order}_product ${req.body.orderMethod}` : ``
        // Pagination, if in query isset page the value will set to query page, else set to 1
        const page = req.query.page ? req.query.page : 1
        // Limit, if in body key limit exist, the valu will set to body.limit, else set to 3
        const limit = req.body.limit ? req.body.limit : 3
        // Offset, if page equal to 1, the offset will be start at 0 in limit key of array
        const offset = page === 1 ? 0 : (page - 1) * limit
        const limiter = `LIMIT ${offset},${limit}`
        // Join Table Category
        const join = `LEFT JOIN tb_category ON id_category = category_product`
        md_getProd(search, order, limiter, join).then((resolve) => {
            res.json(resolve)
        }).catch((err) => res.json(err.message))
    },
    addProd: (req, res) => {
        const data = req.body
        if (!data.name || !data.price || !data.category || !data.image) {
            res.json({ Error: `You must fill all of input!` })
        } else {
            md_addProd(data).then((resolve) => {
                res.json(resolve)
            }).catch((err) => res.json(err.message))
        }
    },
    updateProd: (req, res) => {
        const id = req.params.id
        const data = req.body
        md_updateProd(id, data).then((resolve) => {
            res.json(resolve)
        }).catch(err => res.json(err.message))
    },
    deleteProd: (req, res) => {
        const id = req.params.id
        md_deleteProd(id).then((resolve) => {
            res.json(resolve)
        }).catch(err => res.json(err.message))
    }
}