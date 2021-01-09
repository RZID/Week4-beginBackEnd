const express = require('express')
const route = express.Router()

const { getHistory, addHistory, deleteHistory, updateHistory } = require('../controller/ctrlHistory')

route
    .get('/history/', getHistory)
    .post('/history/', addHistory)
    .delete('/history/:id', deleteHistory)
    .patch('/history/:id', updateHistory)

module.exports = route