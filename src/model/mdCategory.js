const conn = require("../config/database")
module.exports = {
    md_getCategory: (id) => {
        return new Promise((resolve, reject) => {
            const getWhere = id ? `WHERE id = ${id}` : ""
            conn.query(`SELECT * FROM tb_category ${getWhere}`, (err, res) => {
                if (err) {
                    reject(new Error())
                } else if (res.length < 1) {
                    reject({ message: `undefined ${id} in id of category` })
                } else {
                    resolve(res)
                }
            })
        })
    }
}