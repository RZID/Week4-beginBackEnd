const express = require('express')
const route = express.Router()

const { getHistory, addHistory, deleteHistory, updateHistory } = require('../controller/ctrlHistory')
const { authentication, authAdmin } = require('../helper/middleware/auth')
const { history } = require('../helper/redis/history')

route
    .get('/history/', authentication, history, getHistory)
    .post('/history/', authentication, addHistory)
    .delete('/history/:id', authentication, authAdmin, deleteHistory)
    .patch('/history/:id', authentication, authAdmin, updateHistory)

module.exports = route