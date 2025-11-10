const filterService = require('../services/filterService');
const { getLanguage } = require('../utils/languageFallback');

const filterProducts = async (req, res, next) => {
  try {
    const lang = getLanguage(req);
    const filters = req.query;
    const products = await filterService.filterProducts(filters, lang);
    res.json(products);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  filterProducts,
};
