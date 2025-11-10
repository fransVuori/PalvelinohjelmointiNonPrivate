const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// GET /api/search - Free text search in names and descriptions
router.get('/', searchController.searchProducts);

module.exports = router;
