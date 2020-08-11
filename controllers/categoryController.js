const express = require('express');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
var router = express.Router();

var Category = require('../models/category');


//Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

//Multer
// const storage = shared.multerStorage;
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images/')
    },
    filename: function(req, file, cb) {
        console.log(file)
        cb(null, file.originalname)
    }
});


router.post('/addcategory', (req, res) => {
    var newCategory = new Category(req.body);
    newCategory.save((err, doc) => {
        if(!err) {
            res.send(doc);
        }
        else { 
            console.log('Error saving data from Database :' + JSON.stringify(err, undefined, 2));
        }
    });
});

router.post('/add-category-photo/:categoryId', (req,res) => {
    console.log(storage);
    const upload = multer({storage}).single('image');
    upload(req , res, (err) => {
        if(err) {
            return res.send(err);
        }
        const path = req.file.path;
        cloudinary.uploader.upload(path, (err, image) => { 
            if(err) {
                return res.send(err);
            }
            const fs = require('fs');
            fs.unlinkSync(path);
            Category.findById((req.params.categoryId), (err , cat) => {
                if(err) {
                    return res.send(err);
                }
                else {
                    cat.categoryPhotoUrl = image.url;
                }
                cat.save((err , doc) => {
                    if(!err) { res.send(doc); }
                    else { console.log('Error retriving data from Database :' + JSON.stringify(err, undefined, 2));}
                });
            });
        });
    });
}); 

module.exports = router;