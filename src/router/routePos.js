const express = require('express')
const route = express.Router()

// Product Controller
const { getProd, addProd, updateProd, deleteProd, getProdDetail } = require('../controller/ctrlProduct')
const { getCategory, addCategory } = require('../controller/ctrlCategory')
const { getHistory, addHistory } = require('../controller/ctrlHistory')

// History Controller

// Category Controller

// Middleware Tokenization
// const { getToken } = require('../middleware/tokenMgmt')

route
    // Product
    .get('/product', getProd)
    .get('/productDetail/:id', getProdDetail)
    .post('/product', addProd)
    .patch('/product/:id', updateProd)
    .delete('/product/:id', deleteProd)
    // Category
    .get('/category/', getCategory)
    .post('/category/', addCategory)
    // History
    .get('/history/', getHistory)
    .post('/history/', addHistory)

module.exports = route