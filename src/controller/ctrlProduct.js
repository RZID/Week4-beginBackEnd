const { md_getProd, md_addProd, md_updateProd, md_deleteProd, md_getCountProd } = require("../model/mdProduct")
const redistClient = require('../config/redis')
// const { toRupiah } = require("../helper/helperCurrency")
const responser = require("../helper/helperResponse")
module.exports = {
    setRedistData: () => {

    },
    getProd: async (req, res) => {
        try {
            // If isset query searchLike in URL
            const search = req.query.searchLike ? `WHERE name_product LIKE '%${req.query.searchLike}%'` : ``
            // If in body, key order exist
            const order = req.query.order ? `ORDER BY ${req.query.order}_product ${req.query.orderMethod}` : ``
            // Pagination, if in query isset page the value will set to query page, else set to 1
            const page = req.query.page ? req.query.page : 1
            // Limit, if in body key limit exist, the valu will set to body.limit, else set to 3
            const limit = req.query.limit ? req.query.limit : 6
            // Offset, if page equal to 1, the offset will be start at 0 in limit key of array
            const offset = page === 1 ? 0 : (page - 1) * limit
            const limiter = limit ? `LIMIT ${offset},${limit}` : ''
            const getAll = await md_getCountProd().then(res => res[0]['COUNT(*)']).catch(err => err)
            const getAllFiltered = await md_getCountProd(search).then(res => res[0]['COUNT(*)']).catch(err => err)
            // Join Table Category
            md_getProd(search, order, limiter).then((resolve) => {
                if (resolve.length <= 0) {
                    res.json(responser.noContent())
                } else {
                    res.json(responser.success(resolve, page, getAll, limit, getAllFiltered))
                }
            }).catch((err) => res.json(responser.internalError(err.message)))
        } catch (err) {
            res.json(responser.internalError(err))
        }
    },
    getProdDetail: (req, res) => {
        try {
            if (!req.params.id) {
                res.json(responser.inputError({ Error: "ID must be inserted in URL Params!" }))
            } else {
                const whereClause = `WHERE id_product = '${req.params.id}'`
                md_getProd(whereClause).then((result) => {
                    if (result.length < 1) {
                        res.json(responser.noContent())
                    } else {
                        md_getProd(whereClause).then((resolve) => {
                            res.json(responser.success(resolve))
                        }).catch(err => res.json(responser.internalError(err.message)))
                    }
                }).catch(err => res.json(responser.internalError(err.message)))
            }
        } catch (err) {
            res.json(responser.internalError(err))
        }

    },
    addProd: (req, res) => {
        try {
            const data = req.body
            if (!data.name || !data.price || !data.category) {
                res.json(responser.inputError('You must fill all of input!'))
            } else {
                md_addProd(data).then((resolve) => {
                    res.json(responser.success(resolve))
                }).catch((err) => {
                    const message = err.message.split(" ")
                    if (message[19] == "REFERENCES") {
                        res.json(responser.inputError('Identity of category isn\'t exist!'))
                    } else {
                        res.json(responser.internalError(err.message))
                    }
                })
            }
        } catch (err) {
            responser.internalError(err)
        }
    },
    updateProd: (req, res) => {
        try {
            const id = req.params.id
            const data = req.body
            if (!id) {
                return res.json(responser.inputError('ID must be filled!'))
            }
            md_updateProd(id, data).then((resolve) => {
                res.json(responser.success(resolve))
            }).catch(err => res.json(responser.internalError(err.message)))
        } catch (err) {
            res.json(responser.internalError(err))
        }
    },
    deleteProd: (req, res) => {
        try {
            const id = req.params.id
            if (!id) {
                res.json(responser.inputError("ID must be filled!"))
            }
            md_getProd(`WHERE id_product = ${id}`).then((resolve) => {
                if (resolve.length <= 0) {
                    res.json(responser.inputError(`Undefined ID (${id}) Of Product!`))
                } else {
                    md_deleteProd(id).then((resolve) => {
                        res.json(responser.success(resolve))
                    }).catch(err => res.json(responser.internalError(err.message)))
                }
            }).catch(err => res.json(responser.internalError(err.message)))
        } catch (err) {
            res.json(responser.internalError(err))
        }
    }
}