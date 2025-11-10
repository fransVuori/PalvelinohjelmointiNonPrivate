const express = require('express');
const router = express.Router();
const categoryRoutes = require('./categoryRoutes');
const productRoutes = require('./productRoutes');
const feedbackRoutes = require('./feedbackRoutes');
const searchRoutes = require('./searchRoutes');
const filterRoutes = require('./filterRoutes');
const statsRoutes = require('./statsRoutes');
const menuRoutes = require('./menuRoutes');

router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/search', searchRoutes);
router.use('/filter', filterRoutes);
router.use('/stats', statsRoutes);
router.use('/menu', menuRoutes);

module.exports = router;