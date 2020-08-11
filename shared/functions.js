const multer = require('multer');

//multer
exports.storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, 'images/')
        },
        filename: function(req, file, cb) {
            console.log(file)
            cb(null, file.originalname)
        }
    });