const Product = require('../models/product');
const mongoose = require('mongoose');

exports.product_get_all =  (req, res, next) => {
    Product.find()
    .select("name price _id productImage")
    .exec()
    .then( docs => {
        console.log("All product in database",docs);
        const reponse ={
            count: docs.length,
            AllProducts: docs.map( doc => {
                return {
                  name: doc.name,
                  price: doc.price,
                  productImage: doc.productImage,
                  _id: doc._id,
                  request: {
                      type: 'GET',
                      url: 'localhost:3000/products/'+ doc._id
                  }
                }
            })
        }
        res.status(200).json(reponse);
    })
    .catch( err => { 
        console.log(err);
        res.status(500).json({
            error : err
        })
     });
 }

 //Them 1 san pham moi
 exports.products_create_product = (req, res, next) => {
    console.log(req.file)
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            massege: 'Create Product Success',
            createdProduct: {
                  name: result.name,
                  price: result.price,
                  productImage: result.productImage,
                  _id: result._id,
                  request: {
                      type: 'POST',
                      url: 'localhost:3000/products/'+ result._id
                }
            }   
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err })
    });
}

//Lay san pham bang id
exports.product_get_id = (req , res ,next ) => {
    const id = req.params.productId;
    Product.findById(id)
    .select("name price _id productImage")
    .exec()
    .then(doc => {
        console.log('From datatbase',doc);
        if (doc) {
        res.status(200).json({
            Product: doc,
            request: {
                type: 'GET',
                url: 'localhost:3000/products/'+doc._id
            }
        });
        } else {
            res.status(404).json({ massege: 'No valid entry found for provided ID'});
        }
    })
    .catch( err => {
        console.log(err);
        res.status(500).json({error : err});
    })
}

//Cap nhat va thay doi thuoc tinh trong san pham
exports.products_update_product = (req , res ,next ) => {
    const id = req.params.productId;
    const updateOps = {};
    for ( const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id },{ $set: updateOps })
    .exec()
    .then( result => {
        console.log(result);
        res.status(200).json({
            massege: 'Product was changed',
            request: {
                type: 'GET',
                url: 'localhost:3000/products/'+ id
            }
        })
    })
    .catch( err =>{
        console.log(err);
        res.status(500).json( { error: err })
    })
}

//Xoa san pham da dang ki
exports.products_delete_product =  (req , res ,next ) => {
    const id = req.params.productId;
    Product.remove({ _id : id })
    .exec()
    .then( result => {
        console.log( result );
        res.status(200).json({
            massege: 'Product was deleted',
            request: {
                type: 'POST',
                url: 'localhost:3000/products',
                data: {name: 'String', price: 'Number'}
            }
        })
    })
    .catch( err => {
        console.log( err );
        res.status(500).json({ error : err })
    })
}
