const express = require('express')
const route = express.Router()

const { getProd, addProd, updateProd, deleteProd, getProdDetail } = require('../controller/ctrlProduct')
const { authentication, authAdmin, authCashier } = require('../helper/middleware/auth')
const { product: redisProduct } = require('../helper/redis/product')
route
    .get('/product', authentication, authAdmin, getProd)                    // Khusus Admin
    .get('/productDetail/:id', authentication, authCashier, getProdDetail)  // Khusus Kasir
    .post('/product', authentication, addProd)                              // Semua Akses Wajib Login
    .patch('/product/:id', authentication, updateProd)                      // Semua Akses Wajib Login
    .delete('/product/:id', authentication, deleteProd)                     // Semua Akses Wajib Login

module.exports = route