const conn = require("../config/database")
module.exports = {
    md_getProd_rds: () => {
        const join = `LEFT JOIN tb_category ON id_category = category_product`
        return new Promise((resolve, reject) => {
            conn.query(`SELECT id_product AS 'id', name_product AS 'name', price_product AS 'price', image_product AS 'image', name_category AS 'category' , category_product AS 'category_id' FROM tb_product ${join}`, (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    md_getCountProd: (where) => {
        return new Promise((resolve, reject) => {
            conn.query(`SELECT COUNT(*) FROM tb_product ${where}`, (err, res) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(res)
                }
            })
        })
    },
    md_getProd: (where, order, limiter) => {
        where = where ? where : ""
        order = order ? order : ""
        limiter = limiter ? limiter : ""
        const join = `LEFT JOIN tb_category ON id_category = category_product`
        return new Promise((resolve, reject) => {
            conn.query(`SELECT id_product AS 'id', name_product AS 'name', price_product AS 'price', image_product AS 'image', name_category AS 'category' , category_product AS 'category_id' FROM tb_product ${join} ${where} ${order} ${limiter}`, (err, result) => {
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
            const product = [body.name, body.price, body.category, body.image ? body.image : '']
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
                    reject(new Error(`undefined ${id} in id of product`))
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
            conn.query(`SELECT * FROM tb_product WHERE id_product = '${id}'`, (err, res) => {
                conn.query(`DELETE FROM tb_product WHERE id_product = '${id}'`, (err) => {
                    if (err) {
                        reject(new Error(err))
                    } else {
                        resolve({ deleted: `${id}` })
                    }
                })
            })
        })
    },
    md_getProdHistory: (where) => {
        return new Promise((resolve, reject) => {
            conn.query(`SELECT id_product AS id, name_product AS name, price_product AS price FROM tb_product ${where}`, (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    md_getPrice: (id) => {
        return new Promise((resolve, reject) => {
            conn.query(`SELECT id_product FROM tb_product WHERE id_product = '${id}'`, (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    if (result.length < 1) {
                        reject(new Error(`id of product doesn't exist! don't make unique id of product!`))
                    } else {
                        conn.query(`SELECT price_product AS price FROM tb_product WHERE id_product = '${id}'`, (err, result) => {
                            if (err) {
                                reject(new Error(err))
                            } else {
                                resolve(result)
                            }
                        })
                    }
                }
            })

        })
    }
}
