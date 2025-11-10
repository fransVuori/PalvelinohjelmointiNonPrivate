const prisma = require('../utils/prisma');

const filterProducts = async (filters, lang) => {
  const {
    containsGluten,
    containsLactose,
    containsNuts,
    isVegetarian,
    isVegan,
    priceMax,
    categoryId,
  } = filters;

  const where = {};

  if (containsGluten !== undefined) {
    where.containsGluten = containsGluten === 'true';
  }

  if (containsLactose !== undefined) {
    where.containsLactose = containsLactose === 'true';
  }

  if (containsNuts !== undefined) {
    where.containsNuts = containsNuts === 'true';
  }

  if (isVegetarian !== undefined) {
    where.isVegetarian = isVegetarian === 'true';
  }

  if (isVegan !== undefined) {
    where.isVegan = isVegan === 'true';
  }

  if (priceMax) {
    where.price = {
      lte: parseInt(priceMax),
    };
  }

  if (categoryId) {
    where.categoryId = parseInt(categoryId);
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      translations: {
        where: {
          language: lang,
        },
      },
      category: {
        include: {
          translations: {
            where: {
              language: lang,
            },
          },
        },
      },
    },
  });

  return products.map((product) => ({
    id: product.id,
    name: product.translations[0]?.name || `Product ${product.id}`,
    description: product.translations[0]?.description || '',
    price: product.price,
    category: {
      id: product.category.id,
      name: product.category.translations[0]?.name || `Category ${product.category.id}`,
    },
    containsGluten: product.containsGluten,
    containsLactose: product.containsLactose,
    containsNuts: product.containsNuts,
    isVegetarian: product.isVegetarian,
    isVegan: product.isVegan,
  }));
};

module.exports = {
  filterProducts,
};
