const conn = require("../config/database")
module.exports = {
    md_getHistory: (search, order, limit) => {
        return new Promise((resolve, reject) => {
            const searcher = search ? search : ''
            const orderer = order ? order : ''
            const limiter = limit ? limit : ''
            conn.query(`SELECT *, UNIX_TIMESTAMP(date_history) AS date_history FROM tb_history ${searcher} ${limiter} ${orderer}`, (err, res) => {
                if (err) {
                    reject(new Err(err))
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