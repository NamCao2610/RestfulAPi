const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');


//Danh sach tai khoan da dang ki
router.get('/', (req , res, next) => {
    User.find()
    .exec()
    .then( result => {
        res.status(200).json({
            massage: 'Day la danh sach user',
            Acount: result
        })
    })
    .catch( err => {
        res.status(500).json({
            error: err
        })
    })
})

//Dang ki thanh vien moi
router.post('/signup', (req, res, next) => {
    User.find({ email: req.body.email })
    .exec()
    .then( user => {
        if( user.length >= 1 ) {
            return res.status(409).json({
                massage: "mail exist"
            })
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                    user.save()
                    .then( result => {
                        console.log(result);
                        res.status(201).json({
                            
                            massage: 'Create success'
                        });
                    })
                    .catch( err => {
                        res.status(500).json({
                            error : err
                        })
                    })
                }
            });
        }
    });
     
});

//Dang nhap user login
router.post('/login', (req , res , next) => {
    User.find({email: req.body.email })
    .exec()
    .then( user => {
        if ( user.length < 1)
        {
            return res.status(401).json({
                massage: 'Auth failed'
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err , result) =>{
            if( err )
            {
                return res.status(401).json({
                    massage: 'Auth failed'
                });
            }
            if(result)
            {
               const token = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id
                }, process.env.JWT_KEY,
                {
                    expiresIn: '1h'
                });
                return res.status(200).json({
                    massage: 'Auth successful',
                    token: token
                })
            }
            res.status(401).json({
                massage: 'Auth failed'
            });
        })
    })
    .catch( err => {
        res.status(500).json({
            error : err
        })
    })
});

//Xoa user
router.delete('/:userId', (req, res, next ) => {
    User.remove({ _id: req.params.userId})
    .exec()
    .then( result => {
        res.status(200).json({
            massage: 'User deleted',
          
        });
    })
    .catch( err => {
        res.status(500).json({
            error: err
        });
    })
});

module.exports = router;
