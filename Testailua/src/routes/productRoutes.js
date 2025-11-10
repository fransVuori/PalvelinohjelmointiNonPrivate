const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /api/products - List all products with pagination and sorting
router.get('/', productController.getAllProducts);

// GET /api/products/:id - Get a single product by ID
router.get('/:id', productController.getProductById);

// GET /api/products/by-language - Get products by language for checklist
router.get('/by-language', productController.getProductsByLanguage);

// GET /api/products/by-tag - Get products by tag (e.g., burger)
router.get('/by-tag', productController.getProductsByTag);

module.exports = router;
