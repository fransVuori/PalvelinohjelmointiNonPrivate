const express = require('express');
const router = express.Router();
const filterController = require('../controllers/filterController');

// GET /api/filter - Filter products by various criteria
router.get('/', filterController.filterProducts);

module.exports = router;
