const menuService = require('../services/menuService');
const { getLanguage } = require('../utils/languageFallback');

const getMenuItems = async (req, res, next) => {
  try {
    const lang = getLanguage(req);
    const menuItems = await menuService.getMenuItems(lang);
    res.json(menuItems);
  } catch (error) {
    next(error);
  }
};

const getMenuOfTheDay = async (req, res, next) => {
  try {
    const { date } = req.query;
    const lang = getLanguage(req);
    if (!date) {
      return res.status(400).json({ message: 'Date parameter is required' });
    }
    const menuOfTheDay = await menuService.getMenuOfTheDay(date, lang);
    res.json(menuOfTheDay);
  } catch (error) {
    next(error);
  }
};

const getRecommendations = async (req, res, next) => {
  try {
    const { type } = req.query;
    const lang = getLanguage(req);
    const recommendations = await menuService.getRecommendations(type, lang);
    res.json(recommendations);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMenuItems,
  getMenuOfTheDay,
  getRecommendations,
};
