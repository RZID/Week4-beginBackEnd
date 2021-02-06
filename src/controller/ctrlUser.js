const bcrypt = require('bcrypt')
const { mdRegister, mdCheckEmail, mdRole } = require('../model/mdUser')
const responser = require('../helper/helperResponse')
const jwt = require('jsonwebtoken')
const htmlspecialchars = require('htmlspecialchars')

module.exports = {
    login: (req, res) => {
        let body = req.body
        body.email = htmlspecialchars(body.email)
        body.password = htmlspecialchars(body.password)
        if (!body.email || !body.password) {
            return responser.notAccept(res, "E-Mail and Password Must Be Entered!")
        }
        mdCheckEmail(body.email).then(async (result) => {
            if (result.length === 1) {
                if (result[0].isActive_user != 1) {
                    return responser.notAccept(res, "Account is'nt activated! Contact your admin first!")
                } else {
                    const checkingPass = await bcrypt.compare(body.password, result[0].password_user)
                    if (checkingPass) {
                        const userData = {
                            id: result[0].id_user,
                            email: result[0].email_user,
                            role: result[0].access_user
                        }
                        // Signing Token
                        const tokenization = jwt.sign(userData, process.env.JWT_SECRET)
                        responser.accepted(res, "Success Login", tokenization, result[0].name_user, userData.role)
                    } else {
                        responser.notAccept(res, "You've entered wrong password!")
                    }
                }
            } else {
                responser.notAccept(res, `E-Mail that you've entered is'nt registered yet`)
            }
        }).catch(err => {
            responser.internalError(res, err.message)
        })
    },
    register: (req, res) => {
        const body = req.body
        !body.email || !body.name || !body.access || !body.password ? responser.inputError(res, "Fill all input!") : null
        mdCheckEmail(htmlspecialchars(body.email)).then(async (response) => {
            if (response.length >= 1) {
                return responser.conflict(res, 'User already exsist!')
            } else {
                const salt = await bcrypt.genSalt()
                const password = await bcrypt.hash(body.password, salt)
                const user = {
                    name_user: htmlspecialchars(body.name),
                    email_user: htmlspecialchars(body.email),
                    access_user: htmlspecialchars(body.access),
                    password_user: password
                }
                mdRegister(user).then(async (response) => {
                    responser.created(res, `Registered at ID = ${response.insertId}`)
                }).catch(err => (responser.internalError(res, err.message)))
            }
        }).catch(err => {
            responser.internalError(res, err.message)
        })
    },
    role: (req, res) => {
        mdRole().then(response => {
            responser.success(res, response)
        }).catch(err => {
            responser.internalError(err.message)
        })
    }
}