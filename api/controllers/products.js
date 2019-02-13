const mongoose = require('mongoose');

//Product Model
const Product = require('../models/product');

exports.product_get_all = (req, res, next) => {
    Product.find()
        .select('name price _id productImg')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products : docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        productImg: doc.productImg,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            };
            res.status(200).json(response)
        })
        .catch( err => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
};

exports.product_create_product =  (req, res, next) => {
    // console.log(req.file); 
    const product = new Product({
        _id : new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImg: req.file.path,
    });
    product
        .save()
        .then( result => {
                console.log(result);
                res.status(201).json({
                    message: 'Created product successfully',
                    createdProduct: {
                        name: result.name,
                        price: result.price,
                        _id : result._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products'+ result._id
                        }
                    },
                });
            })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
};


exports.product_get_productid =  (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id productImg')
        .exec()
        .then(doc => {
            console.log("from the database", doc);
            if(doc){
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        description: 'GET_ALL_PRODUCT',
                        url: 'http://localhost:3000/' + doc._id
                    }
                })
            }else{
                res.status(404).json({message: "no valid entry found for provided ID"})
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err})
        })
};

exports.product_updated =  (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.updateOne({ _id : id }, { $set : updateOps})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product Updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/' + id
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
            })
        })
};

exports.product_delete = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id : id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product Deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products',
                    body: { name: 'String', price: 'Number'}
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error : err,
            })
        })
};