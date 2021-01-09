const conn = require("../config/database")
const textHelper = require("../helper/helperText")
module.exports = {
    md_getCategory: (id) => {
        return new Promise((resolve, reject) => {
            const getWhere = id ? `WHERE id_category = ${id}` : ""
            conn.query(`SELECT * FROM tb_category ${getWhere}`, (err, res) => {
                if (err) {
                    reject(new Error(err))
                } else if (res.length < 1) {
                    reject(new Error(`undefined ${id} in id of category`))
                } else {
                    resolve(res)
                }
            })
        })
    },
    md_deleteCategory: (id) => {
        return new Promise((resolve, reject) => {
            conn.query(`SELECT id_category FROM tb_category WHERE id_category = '${id}'`, (err, res) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    if (res.length < 1) {
                        reject(new Error(`ID ${id} isn't exist!`))
                    }
                    conn.query(`DELETE FROM tb_category WHERE id_category = '${id}'`, (err) => {
                        if (err) {
                            reject(new Error(err))
                        } else {
                            resolve({ id })
                        }
                    })
                }
            })
        })
    },
    md_addCategory: (data) => {
        return new Promise((resolve, reject) => {
            if (!data.name) {
                reject(new Error("Name of category is not defined"))
            } else {
                const capitalize = textHelper.upperCasing(data.name)
                conn.query(`INSERT INTO tb_category (name_category) VALUES ('${capitalize}')`, (err, res) => {
                    if (err) {
                        reject(new Error(err))
                    } else {
                        resolve({ success: `category added as id = ${res.insertId}` })
                    }
                })
            }
        })
    },
    md_updateCategory: (data) => {
        return new Promise((resolve, reject) => {
            conn.query(`SELECT id_category FROM tb_category WHERE id_category = '${data.id}'`, (err, res) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    if (res.length < 1) {
                        reject(new Error(`ID ${data.id} isn't exist!`))
                    } else {
                        conn.query(`UPDATE tb_category SET name_category = '${data.name}' WHERE id_category = '${data.id}' `, (err) => {
                            if (err) {
                                reject(new Error(err))
                            } else {
                                resolve({ Updated: data.id })
                            }
                        })
                    }
                }
            })
        })
    }
}