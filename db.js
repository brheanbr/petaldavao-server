require('dotenv').config();
const mongoose = require('mongoose');


mongoose.connect(process.env.MONGODB_URI, {useUnifiedTopology: true, useNewUrlParser: true},
    (err) => {
        if(!err)
            console.log('Database connection succeeded.');
        else
            console.log('Error in Database connection : ' + JSON.stringify(err, undefined, 2));
});

module.exports = mongoose;
