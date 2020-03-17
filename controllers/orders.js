const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

//Lay tat ca cac order
exports.orders_get_all =  (req , res, next) => {
    Order.find()
    .select('product quantity _id')
    .populate('product', 'name')
    .exec()
    .then( docs => {
        console.log(docs);
        res.status(200).json({
            count: docs.length,
            orders: docs.map( doc =>{
                return {
                    _id : doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/'+ doc._id
                    }
                }
            })
        })
    })
    .catch( err => {
        console.log(err);
        error = err;
    })
}

//Tao 1 order moi
exports.orders_create_order =  (req , res, next) => {
    Product.findById(req.body.productId)
     .then( product => {
         if(!product) {
             return res.status(404).json({
                 message: "Product not found"
             });
         }
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            product: req.body.productId,
            quantity: req.body.quantity
        });
        return order.save(); 
     })
    .then( result => {
        console.log(result);
        res.status(201).json({
            message : "Orders Stored",
            createOrder: {
                _id: result._id,
                product : result.product,
                quantity: result.quantity,
            },
            request:{
                type: 'POST',
                url: 'http://localhost:3000/orders/'+result._id
            }
        });
    })
    .catch( err => {
        console.log(err);
        res.status(500).json({ error: err });
    })
};

//Lay danh sach orders
exports.orders_get_order = (req , res, next) => {
    const id = req.params.orderId
    Order.findById(id)
    .exec()
    .then( result => {
        res.status(200).json({
            order: result,
            request:{
                type: 'POST',
                url: 'http://localhost:3000/orders/'+result._id
            }
        });
    })
    .catch( err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
};

//Xoa 1 orders
exports.orders_delete_order =  (req , res, next) => {
    Order.remove({_id: req.params.orderId})
    .exec()
    .then( result => {
         res.status(200).json({
             message: 'Order deleted',
             request:{
                 type: 'POST',
                 url: 'http://localhost:3000/orders/'+result._id
             }
         });
    })
    .catch(
         err => {
             console.log(err);
             res.status(500).json({
                 error: err
             })
         }
    )
 }

