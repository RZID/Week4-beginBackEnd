const conn = require("../config/database")
module.exports = {
    md_getHistory: (search, order, limit) => {
        return new Promise((resolve, reject) => {
            const searcher = search ? search : ''
            const orderer = order ? order : ''
            const limiter = limit ? limit : ''
            conn.query(`SELECT id_history AS invoice, UNIX_TIMESTAMP(date_history) AS date, cashier_history AS cashier, product_history AS product, amount_history AS amount FROM tb_history ${searcher} ${orderer} ${limiter}`, (err, res) => {
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
    }
}