const conn = require('../config/database')
module.exports = {
    mdLogin: () => {

    },
    mdCheckEmail: (email) => {
        return new Promise((resolve, reject) => {
            conn.query(`SELECT * FROM tb_user WHERE email_user = '${email}'`, (err, res) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(res)
                }
            })
        })
    },
    mdRegister: (userData) => {
        return new Promise((resolve, reject) => {
            conn.query(`INSERT INTO tb_user SET ?`, userData, (err, res) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(res)
                }
            })
        })
    }
}