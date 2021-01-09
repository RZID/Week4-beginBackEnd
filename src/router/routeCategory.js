const express = require('express')
const route = express.Router()
const { getCategory, addCategory, deleteCategory, updateCategory } = require('../controller/ctrlCategory')

route
    .get('/category/', getCategory)
    .post('/category/', addCategory)
    .delete('/category/:id', deleteCategory)
    .patch('/category/:id', updateCategory)

module.exports = route