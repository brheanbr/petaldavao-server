const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var PhotoSchema = require('../models/photos').schema;

let ProductSchema = mongoose.Schema({
    productName: { type: String },
    productType: { type: String },
    productPrice: { type: Number },
    productStock: { type: Number },
    productPhotos: [{type: Schema.Types.ObjectId, ref: 'Photo' }]
});

module.exports = mongoose.model('Product', ProductSchema);