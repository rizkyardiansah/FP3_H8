require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const userRoute = require('./routes/userRoute')

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('users/', userRoute)

app.listen(port, () => console.log(`Running on port ${port}`))