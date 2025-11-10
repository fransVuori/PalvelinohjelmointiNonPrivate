const productService = require('../services/productService');
const { getLanguage } = require('../utils/languageFallback');

const getAllProducts = async (req, res, next) => {
  try {
    const lang = getLanguage(req);
    const { page = 1, limit = 10, sortBy = 'name', sortOrder = 'asc' } = req.query;
    const products = await productService.getAllProducts(lang, page, limit, sortBy, sortOrder);
    res.json(products);
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lang = getLanguage(req);
    const product = await productService.getProductById(id, lang);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

const getProductsByLanguage = async (req, res, next) => {
  try {
    const lang = req.query.lang || 'fi';
    const products = await productService.getProductsByLanguage(lang);
    res.json(products);
  } catch (error) {
    next(error);
  }
};

const getProductsByTag = async (req, res, next) => {
  try {
    const { tag } = req.query;
    const lang = getLanguage(req);
    if (!tag) {
      return res.status(400).json({ message: 'Tag parameter is required' });
    }
    const products = await productService.getProductsByTag(tag, lang);
    res.json(products);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getProductsByLanguage,
  getProductsByTag,
};
