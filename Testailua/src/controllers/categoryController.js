const categoryService = require('../services/categoryService');
const { getLanguage } = require('../utils/languageFallback');

const getAllCategories = async (req, res, next) => {
  try {
    const lang = getLanguage(req);
    const categories = await categoryService.getAllCategories(lang);
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lang = getLanguage(req);
    const category = await categoryService.getCategoryById(id, lang);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    next(error);
  }
};

const getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const lang = getLanguage(req);
    const category = await categoryService.getCategoryBySlug(slug, lang);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
};
