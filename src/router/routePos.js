const express = require('express')
const route = express.Router()

// Product Controller
const { getProd, addProd, updateProd, deleteProd } = require('../controller/ctrlProduct')
const { getCategory } = require('../controller/ctrlCategory')

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

module.exports = route