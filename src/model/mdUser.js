const conn = require('../config/database')
module.exports = {
    mdRole: () => {
        return new Promise((resolve, reject) => {
            conn.query(`SELECT * FROM tb_role`, (err, res) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(res)
                }
            })
        })
    },
    mdCheckEmail: (email) => {
        return new Promise((resolve, reject) => {
            conn.query(`SELECT * FROM tb_user LEFT JOIN tb_role ON tb_user.access_user = tb_role.id_role WHERE email_user = '${email}'`, (err, res) => {
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