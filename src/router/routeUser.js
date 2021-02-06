const { login, register, role } = require('../controller/ctrlUser')
const express = require('express')
const Router = express.Router()
Router
    .get('/user_role', role)
    .post('/login', login)
    .post('/register', register)
module.exports = Router