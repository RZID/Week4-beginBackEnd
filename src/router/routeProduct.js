const express = require('express')
const route = express.Router()

const { getProd, addProd, updateProd, deleteProd, getProdDetail } = require('../controller/ctrlProduct')

route
    .get('/product', getProd)
    .get('/productDetail/:id', getProdDetail)
    .post('/product', addProd)
    .patch('/product/:id', updateProd)
    .delete('/product/:id', deleteProd)

module.exports = route