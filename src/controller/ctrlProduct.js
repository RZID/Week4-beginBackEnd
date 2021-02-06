const { md_getProd_rds, md_getProd, md_addProd, md_updateProd, md_deleteProd, md_getCountProd } = require("../model/mdProduct")
const { upperCasing } = require('../helper/helperText')
const redisClient = require('../config/redis')
const responser = require("../helper/helperResponse")
const htmlspecialchars = require('htmlspecialchars')
const fs = require('fs')
const _ = require('lodash')
module.exports = {
    redistProduct: () => {
        md_getProd_rds().then((response) => {
            const resToText = JSON.stringify(response)
            redisClient.set('dataProduct', resToText)
        }).catch((err) => {
            responser.internalError(res, err.message)
        })
    },
    getProd: async (req, res) => {
        try {
            const searchBy = req.query.searchBy ? `${htmlspecialchars(req.query.searchBy)}_product` : null
            // If isset query searchLike in URL
            const search = htmlspecialchars(req.query.searchLike) ? `WHERE ${searchBy} LIKE '%${htmlspecialchars(req.query.searchLike)}%'` : ``
            // If in body, key order exist
            const order = htmlspecialchars(req.query.order) ? `ORDER BY ${htmlspecialchars(req.query.order)}_product ${htmlspecialchars(req.query.orderMethod)}` : ``
            // Pagination, if in query isset page the value will set to query page, else set to 1
            const page = htmlspecialchars(req.query.page) ? _.toNumber(htmlspecialchars(req.query.page)) : 1
            // Limit, if in body key limit exist, the valu will set to body.limit, else set to 3
            const limit = htmlspecialchars(req.query.limit) ? _.toNumber(htmlspecialchars(req.query.limit)) : 9
            // Offset, if page equal to 1, the offset will be start at 0 in limit key of array
            const offset = page === 1 ? 0 : (page - 1) * limit
            const limiter = limit ? `LIMIT ${offset},${limit}` : ''
            const getAll = await md_getCountProd().then(res => res[0]['COUNT(*)']).catch(err => err)
            const getAllFiltered = await md_getCountProd(search).then(res => res[0]['COUNT(*)']).catch(err => err)
            // Join Table Category
            md_getProd(search, order, limiter).then((resolve) => {
                if (resolve.length <= 0) {
                    responser.noContent(res)
                } else {
                    // Send to redis for caching
                    module.exports.redistProduct()
                    responser.success(res, resolve, page, getAll, limit, getAllFiltered)
                }
            }).catch((err) => responser.internalError(res, err.message))
        } catch (err) {
            responser.internalError(res, err)
        }
    },
    getProdDetail: (req, res) => {
        try {
            if (!req.params.id) {
                responser.inputError(res, "ID must be inserted in URL Params!")
            } else {
                const whereClause = `WHERE id_product = '${htmlspecialchars(req.params.id)}'`
                md_getProd(whereClause).then((result) => {
                    if (result.length < 1) {
                        responser.noContent(res)
                    } else {
                        md_getProd(whereClause).then((resolve) => {
                            responser.success(res, resolve)
                        }).catch(err => responser.internalError(res, err.message))
                    }
                }).catch(err => responser.internalError(res, err.message))
            }
        } catch (err) {
            responser.internalError(res, err)
        }

    },
    addProd: (req, res) => {
        try {
            const body = req.body
            if (!body.name || !body.price || !body.category) {
                responser.inputError(res, 'You must fill all of input!')
                if (req.file) {
                    const beforeImage = req.file.filename
                    const path = `${process.cwd()}/public/imageProduct/${beforeImage}` // * CWD is Current Working Directory (which is root folder)
                    // Process delete
                    if (fs.existsSync(path)) {
                        fs.unlink(path, (err) => {
                            // if error, throw error
                            if (err) {
                                responser.internalError(res, err)
                            }
                        })
                    }
                }
            } else {
                let data = {}
                data.name = upperCasing(htmlspecialchars(body.name))
                data.price = htmlspecialchars(body.price)
                data.category = htmlspecialchars(body.category)
                // Push file name if exist by spread operator
                data = { ...data, image: !req.file ? 'default.jpg' : htmlspecialchars(req.file.filename) }
                md_addProd(data).then((resolve) => {
                    // Send to redis for caching
                    module.exports.redistProduct()
                    responser.success(res, resolve)
                }).catch((err) => {
                    const message = err.message.split(" ")
                    if (message[19] == "REFERENCES") {
                        responser.inputError(res, 'Identity of category isn\'t exist!')
                    } else {
                        responser.internalError(res, err.message)
                    }
                })
            }
        } catch (err) {
            responser.internalError(res, err.message)
            if (req.file) {
                const beforeImage = req.file.filename
                const path = `${process.cwd()}/public/imageProduct/${beforeImage}` // * CWD is Current Working Directory (which is root folder)
                // Process delete
                if (fs.existsSync(path)) {
                    fs.unlink(path, (err) => {
                        // if error, throw error
                        if (err) {
                            responser.internalError(res, err)
                        }
                    })
                }
            }
        }
    },
    updateProd: (req, res) => {
        try {
            const id = htmlspecialchars(req.params.id)
            const body = req.body
            if (!id) {
                return responser.inputError(res, 'ID must be filled!')
            }
            let data = {}
            data.name = htmlspecialchars(body.name)
            data.price = htmlspecialchars(body.price)
            data.category = htmlspecialchars(body.category)
            // If client input the file
            // Set image key in obj data to the name of uploaded image
            if (req.file) {
                data.image = htmlspecialchars(req.file.filename)
            }
            // First we delete the file attached in product image 
            md_getProd(`WHERE id_product=${id}`).then((resolve) => {
                if (resolve.length > 0) {
                    const beforeImage = resolve[0].image
                    if (beforeImage && beforeImage !== 'default.jpg') {
                        const path = `${process.cwd()}/public/imageProduct/${beforeImage}` // * CWD is Current Working Directory (which is root folder)
                        // Process delete
                        if (fs.existsSync(path)) {
                            fs.unlink(path, err => {
                                if (err) {
                                    responser.internalError(res, err)
                                }
                            })
                        }
                    }
                }
            }).catch(err => responser.internalError(res, err.message))
            // Then update new data
            md_updateProd(id, data).then((resolve) => {
                module.exports.redistProduct()  // Send to redis for caching
                responser.success(res, resolve)
            }).catch(err => {
                responser.internalError(res, err.message)
            })
        } catch (err) {
            responser.internalError(res, err.message)
        }
    },
    deleteProd: (req, res) => {
        try {
            const id = htmlspecialchars(req.params.id)
            if (!id) {
                responser.inputError(res, "ID must be filled!")
            }
            md_getProd(`WHERE id_product = ${id}`).then((resolve) => {
                if (resolve.length <= 0) {
                    responser.inputError(res, `Undefined ID (${id}) Of Product!`)
                } else {
                    md_getProd(`WHERE id_product='${id}'`).then((resolve) => {
                        const beforeImage = resolve[0].image
                        if (beforeImage && beforeImage !== "default.jpg") {
                            const path = `${process.cwd()}/public/imageProduct/${beforeImage}`
                            if (fs.existsSync(path)) {
                                fs.unlink(path, (err) => {
                                    if (err) {
                                        responser.internalError(res, err)
                                    }
                                })
                            }
                        }
                    }).catch(err => responser.internalError(res, err.message))
                    md_deleteProd(id).then((resolve) => {
                        // Send to redis for caching
                        module.exports.redistProduct()
                        responser.success(res, resolve)
                    }).catch(err => responser.internalError(res, err.message))
                }
            }).catch(err => responser.internalError(res, err.message))
        } catch (err) {
            responser.internalError(res, err)
        }
    }
}