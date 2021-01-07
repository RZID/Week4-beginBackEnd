const { md_getCategory, md_addCategory } = require("../model/mdCategory")
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
    }
}