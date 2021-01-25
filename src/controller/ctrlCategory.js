const { md_getCategory, md_addCategory, md_deleteCategory, md_updateCategory } = require("../model/mdCategory")
const responser = require("../helper/helperResponse")
module.exports = {
    getCategory: (req, res) => {
        try {
            const id = req.query.id
            md_getCategory(id).then(result => {
                if (result.length <= 0) {
                    res.json(responser.noContent())
                }
                else {
                    res.json(responser.success(result))
                }
            }).catch(err => res.json(responser.internalError(err.message)))
        } catch (err) {
            err.json(responser.internalError(err))
        }
    },
    addCategory: (req, res) => {
        try {
            const data = req.body
            if (!data.name) {
                res.json(responser.inputError('You must fill name field!'))
            } else {
                md_addCategory(data).then(result => {
                    res.json(responser.success(result))
                }).catch(err => res.json(responser.internalError(err.message)))
            }
        } catch (err) {
            res.json(responser.internalError(err))
        }
    },
    deleteCategory: (req, res) => {
        try {
            const data = req.params.id
            if (!data) {
                res.json(responser.inputError("ID Must be filled!"))
            } else {
                md_deleteCategory(data).then(result => {
                    res.json(responser.success(result))
                }).catch(err => res.json(responser.internalError(err.message)))
            }
        } catch (err) {
            res.json(responser.internalError(err))
        }
    },
    updateCategory: (req, res) => {
        try {
            const name = req.body.name
            const id = req.params.id
            if (!name || !id) {
                res.json(responser.inputError('Name and ID must be filled!'))
            } else {
                md_getCategory(id).then((resolve) => {
                    if (resolve.length <= 0) {
                        res.json(responser.inputError(`Undefined ID (${id}) Of Category!`))
                    } else {
                        const data = { name: name, id: id }
                        md_updateCategory(data).then(result => {
                            res.json(responser.success(result))
                        }).catch(err => res.json(responser.internalError(err.message)))
                    }
                }).catch(err => res.json(responser.internalError(err.message)))
            }
        } catch (err) {
            res.json(responser.internalError(err))
        }
    }
}