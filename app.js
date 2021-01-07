const express = require('express')
const bodyParser = require('body-parser')
const route = require("./src/router/routePos")
const port = 3000

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(route)


app.listen(port, () => {
    console.log(`Service running on port ${port}`)
})