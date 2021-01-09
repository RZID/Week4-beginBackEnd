const express = require('express')
require('dotenv').config()
const bodyParser = require('body-parser')
const route = require("./src/router/routePos")

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(route)

app.listen(process.env.PORT, () => {
    console.log(`Service running on port ${process.env.PORT}`)
})