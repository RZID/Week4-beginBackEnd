const express = require('express')
const route = express.Router()

// Product Controller
const { getProd, addProd, updateProd, deleteProd } = require('../controller/ctrlProduct')
const { getCategory, addCategory } = require('../controller/ctrlCategory')
const { getHistory, addHistory } = require('../controller/ctrlHistory')

// History Controller

// Category Controller

// Middleware Tokenization
// const { getToken } = require('../middleware/tokenMgmt')

route
    .get('/product', getProd)
    .post('/product', addProd)
    .patch('/product/:id', updateProd)
    .delete('/product/:id', deleteProd)
    .get('/category/', getCategory)
    .post('/category/', addCategory)
    .get('/history/', getHistory)
    .post('/history/', addHistory)

module.exports = route