const express = require('express')
// const { Kategori } = require('../config/redis')
const route = express.Router()
const { getCategory, addCategory, deleteCategory, updateCategory } = require('../controller/ctrlCategory')
const { authentication, authAdmin } = require('../helper/middleware/auth')

route
    .get('/category/', authentication, getCategory)
    .post('/category/', authentication, authAdmin, addCategory)
    .delete('/category/:id', authentication, authAdmin, deleteCategory)
    .patch('/category/:id', authentication, authAdmin, updateCategory)

module.exports = route