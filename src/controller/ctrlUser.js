const bcrypt = require('bcrypt')
const { mdRegister, mdCheckEmail } = require('../model/mdUser')
const responser = require('../helper/helperResponse')

module.exports = {
    login: (req, res) => {
        const body = req.body
        mdCheckEmail(body.email).then(async (response) => {
            // Pengecekan Email
        }).catch(err => {
            // Error
        })
    },
    register: (req, res) => {
        const body = req.body
        mdCheckEmail(body.email).then(async (response) => {
            if (response.length >= 1) {
                res.json({ err: 'USER IS REGISTERED!' })
            } else {
                const salt = await bcrypt.genSalt()
                const password = await bcrypt.hash(body.password, salt)
                const user = {
                    name_user: body.name,
                    email_user: body.email,
                    access_user: body.access,
                    password_user: password
                }
                mdRegister(user).then(response => res.json(responser.success(response))).catch(err => res.json(responser.internalError(err.message)))
            }
        }).catch(err => {
            res.json(err.message)
        })
    }
}