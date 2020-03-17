const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const checkAuth = require('../middleware/check-auth');
const multer = require('multer');

// const storage = multer.diskStorage({
//     destination: function(req , file, cb){
//         cb(null, './uploads/');
//     },
//     filename: function(req, file, cb){
//         cb(null, new Date().toISOString() + file.originalname);
//     }
// });

// const fileFilter = (req, file, cb) => {
//     //reject a file
//     if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
//         cb(null, true);
//     } else {
//         cb(null, false);
//     }
// }

// const upload = multer({
//     storage: storage ,
//     limits:{
//     fileSize: 1024 * 1024 * 5   
//     },
//     fileFilter: fileFilter
// });

const upload = multer({dest: 'uploads/'});

const Product = require('../models/product');
const ProductController = require('../controllers/product');
//Dung de get 
router.get('/',checkAuth,ProductController.product_get_all);

//Dung de them du lieu tu database
router.post('/',checkAuth, upload.single('productImage'), ProductController.products_create_product);

//Dung de Lay chi so id cua product trong database
router.get('/:productId', checkAuth,ProductController.product_get_id);

//Dung de thay doi noi dung da dang ki
router.patch('/:productId',checkAuth, ProductController.products_update_product);

//Xoa id da dang ki
router.delete('/:productId',checkAuth, ProductController.products_delete_product);


module.exports = router;