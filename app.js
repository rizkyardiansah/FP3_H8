require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const userRoute = require('./routes/userRoute')
const categoryRoute = require('./routes/categoryRoute')
const productRoute = require('./routes/productRoute');
const transactionRoute = require('./routes/transactionRoute');

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/users/', userRoute)
app.use('/categories/', categoryRoute)
app.use('/products/', productRoute);
app.use('/transactions/', transactionRoute);

app.listen(port, () => console.log(`Running on port ${port}`))