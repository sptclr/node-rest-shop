const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

exports.order_get_all =  (req, res, next) => {
    Order.find()
      .select('product quantity _id')
      .populate('product', 'name')
      .exec()
      .then(docs => {
        if (!Order) {
          return res.status(404).json({
            message: 'order not found'
          });
        }
        res.status(200).json({
          count: docs.length,
          orders: docs.map(doc => {
            return {
              _id: doc._id,
              product: doc.product,
              quantity: doc.quantity,
              request: {
                type: 'GET',
                url: 'http://localhost:3000/orders/' + doc._id
              }
            };
          })
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  };

exports.order_create_order = (req, res, next) => {
    Product.findById(req.body.productId)
      .then(product => {
        if (!product) {
          return res.status(404).json({
            message: 'Product not found'
          });
        }
        const order = new Order({
          _id: mongoose.Types.ObjectId(),
          quantity: req.body.quantity,
          product: req.body.productId
        });
        return order.save();
        // exec doesnt work to real promise as a normal queries
        // .exec()
      })
      .then(result => {
        res.status(201).json({
          message: 'Order stored',
          createOrder: {
            _id: result._id,
            product: result.product,
            quantity: result.quantity
          },
          request: {
            type: 'GET',
            url: 'http://localhost:3000/orders/' + result._id
          }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  };

exports.order_get_order =  (req, res, next) => {
    Order.findById(req.params.orderId)
      .select('quantity _id product request')
      .populate('product', 'name _id price')
      .exec()
      .then(order => {
        res.status(200).json({
          order: order,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/orders'
          }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  };

exports.order_delete_order = (req, res, next) => {
    Order.remove({ _id: req.params.orderId })
      .exec()
      .then(result => {
        res.status(200).json({
          message: 'Order deleted',
          request: {
            type: 'POST',
            url: 'http://localhost:3000/orders',
            body: { productId: 'ID', quantity: 'Number' }
          }
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  };

