const searchService = require('../services/searchService');
const { getLanguage } = require('../utils/languageFallback');

const searchProducts = async (req, res, next) => {
  try {
    const { query } = req.query;
    const lang = getLanguage(req);
    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }
    const products = await searchService.searchProducts(query, lang);
    res.json(products);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchProducts,
};
