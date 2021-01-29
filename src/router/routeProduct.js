const express = require('express')
const route = express.Router()

const { getProd, addProd, updateProd, deleteProd, getProdDetail } = require('../controller/ctrlProduct')
const { authentication, authAdmin } = require('../helper/middleware/auth')
const { singleUpload } = require('../helper/middleware/upload')
const { product: redisProduct } = require('../helper/redis/product')
route
    .get('/product', authentication, redisProduct, getProd)                                 // Admin Dan Kasir
    .get('/productDetail/:id', authentication, getProdDetail)                               // Admin Dan Kasir
    .post('/product', authentication, authAdmin, singleUpload, addProd)                     // Khusus Admin
    .patch('/product/:id', authentication, authAdmin, singleUpload, updateProd)             // Khusus Admin
    .delete('/product/:id', authentication, authAdmin, deleteProd)                          // Khusus Admin

module.exports = route