const { md_getCategory, md_addCategory, md_deleteCategory, md_updateCategory } = require("../model/mdCategory")
module.exports = {
    getCategory: (req, res) => {
        const id = req.query.id
        md_getCategory(id).then(result => {
            res.json(result)
        }).catch(err => res.json(err.message))
    },
    addCategory: (req, res) => {
        const data = req.body
        md_addCategory(data).then(result => {
            res.json(result)
        }).catch(err => res.json(err.message))
    },
    deleteCategory: (req, res) => {
        const data = req.params.id
        if (!data) {
            res.json({ Error: "ID Must be filled!" })
        } else {
            md_deleteCategory(data).then(result => {
                res.json(result)
            }).catch(err => res.json(err.message))
        }
    },
    updateCategory: (req, res) => {
        const name = req.body.name
        const id = req.params.id
        if (!name) {
            res.json({ Error: "Name must be filled!" })
        } else {
            const data = { name: name, id: id }
            md_updateCategory(data).then(result => {
                res.json(result)
            }).catch(err => res.json(err.message))
        }
    }
}