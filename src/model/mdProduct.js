const conn = require("../config/database")
module.exports = {
    md_getProd: (where, order, limiter) => {
        return new Promise((resolve, reject) => {
            conn.query(`SELECT * FROM tb_product ${where} ${order} ${limiter}`, (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    md_addProd: (body) => {
        return new Promise((resolve, reject) => {
            const product = [body.name, body.price, body.category, body.image]
            conn.query(`INSERT INTO tb_product (name_product, price_product, category_product, image_product) VALUES ('${product[0]}',${product[1]},'${product[2]}','${product[3]}')`, (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve({ inserted: `${result.insertId}` })
                }
            })
        })
    },
    md_updateProd: (id, data) => {
        return new Promise((resolve, reject) => {
            conn.query(`SELECT * FROM tb_product WHERE id_product = ${id}`, (err, result) => {
                if (result.length < 1 || err) {
                    reject({ message: `undefined ${id} in id of product` })
                } else {
                    let arrayData = {}

                    // If each data exist in body
                    data.name ? arrayData.name_product = data.name : ''
                    data.price ? arrayData.price_product = data.price : ''
                    data.category ? arrayData.category_product = data.category : ''
                    data.image ? arrayData.image_product = data.image : ''

                    conn.query(`UPDATE tb_product SET ? WHERE id_product = ?`, [arrayData, id], (err) => {
                        if (err) {
                            reject(new Error(err))
                        } else {
                            resolve({ updated: `${id}` })
                        }
                    })
                }
            })
        })
    },
    md_deleteProd: (id) => {
        return new Promise((resolve, reject) => {
            conn.query(`SELECT * FROM tb_product WHERE id_product = ${id}`, (err) => {
                if (err) {
                    reject({ message: `undefined ${id} of id product` })
                } else {
                    conn.query(`DELETE FROM tb_product WHERE id_product = ${id}`, (err) => {
                        if (err) {
                            reject(new Error(err))
                        } else {
                            resolve({ deleted: `${id}` })
                        }
                    })
                }
            })
        })
    }
}
