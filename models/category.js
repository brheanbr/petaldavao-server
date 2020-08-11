const mongoose = require('mongoose');

let CategorySchema = mongoose.Schema({
    categoryType: {type: String},
    categoryPhotoUrl: {type: String}
});

module.exports = mongoose.model('Category', CategorySchema);