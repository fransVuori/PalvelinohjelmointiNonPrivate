const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// GET /api/menu-items - Get categories with their products in a single request
router.get('/items', menuController.getMenuItems);

// GET /api/menu-of-the-day - Get menu of the day
router.get('/of-the-day', menuController.getMenuOfTheDay);

// GET /api/recommendations - Get recommendations
router.get('/recommendations', menuController.getRecommendations);

module.exports = router;
