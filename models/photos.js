const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ProductSchema = require('../models/products').schema;

let PhotoSchema = new mongoose.Schema({
    publicId : { type : String },
    url : { type : String },
    productId: { type: Schema.Types.ObjectId, ref: 'Product' }
});

module.exports = mongoose.model('Photo', PhotoSchema);