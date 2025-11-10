const express = require('express');
const router = express.Router();
const { supportedLanguages } = require('../utils/languageFallback');

// GET /api/languages - Get supported languages
router.get('/', (req, res) => {
  res.json({ languages: supportedLanguages });
});

module.exports = router;
