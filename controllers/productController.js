const express = require('express');
const cloudinary = require("cloudinary").v2;
const multer = require('multer');

var router = express.Router();

var Product = require('../models/products');
var Photo = require('../models/photos');

//Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

//Multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images/')
    },
    filename: function(req, file, cb) {
        console.log(file)
        cb(null, file.originalname)
    }
});

router.get('/', (req , res) => {
    Product.find().populate('productPhotos').
    exec(function (err , doc){
        if(!err) { res.send(doc); }
        else { console.log('Error retriving data from Database :' + JSON.stringify(err, undefined, 2));}
    });
    // res.send(Product);

    // Product.find((err , doc) => {
    //     if(!err) { res.send(doc); }
    //     else { console.log('Error retriving data from Database :' + JSON.stringify(err, undefined, 2));}
    // });
});

router.post('/addproduct', (req , res) => {
    
    // if(req.body.productPhoto) {
    //     var photo = cloudinary.uploader.upload(req.body.productPhoto);
    //     var newPhoto = new Photo({
    //         publicId : photo.public_id,
    //         url : photo.url
    //     });
    //     newPhoto.save((err , doc) => {
    //         if(!err) { res.send(doc); }
    //         else { console.log('Error retriving data from Database :' + JSON.stringify(err, undefined, 2));}
    //     });
    // }
    var newProduct = new Product(req.body);
    newProduct.save((err , doc) => {
        if(!err) { res.send(doc); }
        else { console.log('Error saving data from Database :' + JSON.stringify(err, undefined, 2));}
    });
});

router.post('/add-photo/:productId', (req , res) => {
    const upload = multer({storage}).single('image');
    upload(req, res, (err) => {
        if (err) {
          return res.send(err)
        }
        const path = req.file.path;
        console.log(path + 'path');
        cloudinary.uploader.upload(path, function(err , image){
            if (err) return res.send(err)
            console.log('file uploaded to Cloudinary')
            // remove file from server
            const fs = require('fs')
            fs.unlinkSync(path)
            // return image details
            var newPhoto = new Photo ({
                publicId : image.public_Id,
                url : image.url,
                productId: req.params.productid
            });
            newPhoto.save((err , doc) => {
                if(!err) {
                    Product.findById((req.params.productId), (err , prod) => {
                        if(err) return res.send(err);
                        prod.productPhotos.push(doc._id)
                        prod.save((err , doc) => {
                            if(!err) { res.send(doc); }
                            else { console.log('Error retriving data from Database :' + JSON.stringify(err, undefined, 2));}
                        });
                    });
                }
                else { console.log('Error retriving data from Database :' + JSON.stringify(err, undefined, 2));}
            });
        });
    });
});

// function uploadPhoto(path) {
//     cloudinary.uploader.upload(path)
//     .then((result) => {
        
//         return result;
//       }).catch((error) => {
//         response.status(500).send({
//           message: "failure",
//           error,
//         });
//       });
// }

module.exports = router;