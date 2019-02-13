const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const productController = require('../controllers/products');

const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null,'./uploads');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    //reject a file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb (null, true);
    } else{
        cb (new Error('images extension not valid should must be jpeg/png'), false);
    }
}

const upload = multer({
    storage : storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
}).single('productImg');



// PRODUCTS GET
router.get('/', productController.product_get_all );

//products post
router.post("/", checkAuth, upload, productController.product_create_product);

//Product get by Id
router.get('/:productId', checkAuth, productController.product_get_productid);

router.patch('/:productId', checkAuth, productController.product_updated);

router.delete('/:productId', checkAuth, productController.product_delete);


module.exports = router;