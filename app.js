const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// ROUTES
const productsRoute = require('./api/routes/products');
const ordersRoute = require('./api/routes/orders');
const userRoute = require('./api/routes/user');

mongoose.connect("mongodb+srv://admin:" + process.env.MONGO_ATLAS_PW + "@cluster0-tfyxx.mongodb.net/node-shop?retryWrites=true", {
    useNewUrlParser: true,
});
process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', reason.stack || reason)
    // Recommended: send the information to sentry.io
    // or whatever crash reporting service you use
  });

//morgan middleware
app.use(morgan('dev'));
app.use('/uploads/', express.static('uploads'));
mongoose.set('useCreateIndex', true);
// body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// CORS Control Access for Browsers
app.use( (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// ROUTERS
app.use('/products', productsRoute);
app.use('/orders', ordersRoute);
app.use('/user', userRoute);

// Error Handling
app.use( (req, res, next) => {
    const error = new Error('not found');
    error.status = 404;
    next(error);
});

app.use( (error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error :{
            message: error.message
        }
    });
});

module.exports = app;