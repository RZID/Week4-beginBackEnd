const conn = require("../config/database")
module.exports = {
    md_getHistory_rds: () => {
        return new Promise((resolve, reject) => {
            conn.query(`SELECT id_history AS invoice, UNIX_TIMESTAMP(date_history) AS date,UNIX_TIMESTAMP(date_history) AS date_number, cashier_history AS cashier, product_history AS product, amount_history AS amount FROM tb_history`, (err, res) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(res)
                }
            })
        })
    },
    md_getAllHistory: (search) => {
        return new Promise((resolve, reject) => {
            conn.query(`SELECT COUNT(*) FROM tb_history ${search}`, (err, res) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res[0]['COUNT(*)'])
                }
            })
        })
    },
    md_getHistory: (search, order, limit, date) => {
        return new Promise((resolve, reject) => {
            const searcher = search ? search : ''
            const orderer = order ? order : ''
            const limiter = limit ? limit : ''
            const separate = search && date ? ' AND ' : ''
            conn.query(`SELECT id_history AS invoice, UNIX_TIMESTAMP(date_history) AS date,UNIX_TIMESTAMP(date_history) AS date_number, cashier_history AS cashier, product_history AS product, amount_history AS amount FROM tb_history ${date} ${separate} ${searcher} ${orderer} ${limiter}`, (err, res) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(res)
                }
            })
        })
    },
    md_addHistory: (cashier, product, amount) => {
        return new Promise((resolve, reject) => {
            conn.query(`INSERT INTO tb_history (cashier_history, product_history, amount_history) VALUES ('${cashier}', '${product}', '${amount}')`, (err, res) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(res.insertId)
                }
            })
        })
    },
    md_deleteHistory: (id) => {
        return new Promise((resolve, reject) => {
            conn.query(`SELECT * FROM tb_history WHERE id_history = '${id}'`, (err, res) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    if (res.length < 1) {
                        reject(new Error(`Undefined id = ${id} in history!`))
                    } else {
                        conn.query(`DELETE FROM tb_history WHERE id_history = '${id}'`, err => {
                            if (err) {
                                reject(new Error(err))
                            } else {
                                resolve({ Success: `Deleted : ${id}` })
                            }
                        })
                    }
                }
            })
        })
    },
    md_updateHistory: (id, data) => {
        return new Promise((resolve, reject) => {
            conn.query(`SELECT * FROM tb_history WHERE id_history = ${id}`, (err, result) => {
                if (result.length < 1 || err) {
                    reject(new Error(`undefined ${id} in id of history`))
                } else {
                    let arrayData = {}
                    // If each data exist in body
                    data.cashier ? arrayData.cashier_history = data.cashier : ''
                    data.product ? arrayData.product_history = data.product : ''
                    data.amount ? arrayData.amount_history = data.amount : ''
                    conn.query(`UPDATE tb_history SET ? WHERE id_history = ?`, [arrayData, id], (err) => {
                        if (err) {
                            reject(new Error(err))
                        } else {
                            resolve(id)
                        }
                    })
                }
            })
        })
    }
}