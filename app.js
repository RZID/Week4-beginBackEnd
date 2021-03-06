const express = require('express')
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser')
const routeProduct = require("./src/router/routeProduct")
const routeCategory = require("./src/router/routeCategory")
const routeHistory = require("./src/router/routeHistory")

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(routeProduct)
app.use(routeCategory)
app.use(routeHistory)

app.listen(process.env.PORT, cors(), () => {
    console.log(`Service running on port ${process.env.PORT}`)
})