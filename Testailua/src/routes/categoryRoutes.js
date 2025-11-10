const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// GET /api/categories - List all categories
router.get('/', categoryController.getAllCategories);

// GET /api/categories/:id - Get a single category by ID
router.get('/:id', categoryController.getCategoryById);

// GET /api/categories/by-slug/:slug - Get a single category by slug
router.get('/by-slug/:slug', categoryController.getCategoryBySlug);

module.exports = router;
