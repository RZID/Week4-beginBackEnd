const { md_getCategory, md_addCategory, md_deleteCategory, md_updateCategory } = require("../model/mdCategory")
const responser = require("../helper/helperResponse")
const htmlspecialchars = require('htmlspecialchars')
module.exports = {
    getCategory: (req, res) => {
        try {
            const id = htmlspecialchars(req.query.id)
            md_getCategory(id).then(result => {
                if (result.length <= 0) {
                    responser.noContent(res)
                }
                else {
                    responser.success(res, result)
                }
            }).catch(err => responser.internalError(res, err.message))
        } catch (err) {
            responser.internalError(res, err)
        }
    },
    addCategory: (req, res) => {
        try {
            const body = req.body
            let data = body.name = htmlspecialchars(body.name)
            if (!data.name) {
                responser.inputError(res, 'You must fill name field!')
            } else {
                md_addCategory(data).then(result => {
                    responser.success(res, result)
                }).catch(err => responser.internalError(res, err.message))
            }
        } catch (err) {
            responser.internalError(res, err)
        }
    },
    deleteCategory: (req, res) => {
        try {
            const data = htmlspecialchars(req.params.id)
            if (!data) {
                responser.inputError(res, "ID Must be filled!")
            } else {
                md_deleteCategory(data).then(result => {
                    responser.success(res, result)
                }).catch(err => responser.internalError(res, err.message))
            }
        } catch (err) {
            responser.internalError(res, err)
        }
    },
    updateCategory: (req, res) => {
        try {
            const name = htmlspecialchars(req.body.name)
            const id = htmlspecialchars(req.params.id)
            if (!name || !id) {
                responser.inputError(res, 'Name and ID must be filled!')
            } else {
                md_getCategory(id).then((resolve) => {
                    if (resolve.length <= 0) {
                        responser.inputError(res, `Undefined ID (${id}) Of Category!`)
                    } else {
                        const data = { name: name, id: id }
                        md_updateCategory(data).then(result => {
                            responser.success(res, result)
                        }).catch(err => responser.internalError(res, err.message))
                    }
                }).catch(err => responser.internalError(res, err.message))
            }
        } catch (err) {
            responser.internalError(res, err)
        }
    }
}