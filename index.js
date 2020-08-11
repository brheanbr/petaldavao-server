require('dotenv').config();

const expess = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db');
const productController = require('./controllers/productController');
const categoryController = require('./controllers/categoryController');

//
var app = expess();
app.use(bodyParser.json());

app.listen(process.env.PORT, () => console.log('Server listening on port: ' + process.env.PORT));

app.use('/product', productController);
app.use('/category', categoryController);
