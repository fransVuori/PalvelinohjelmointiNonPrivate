const prisma = require('../utils/prisma');

const searchProducts = async (query, lang) => {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        {
          translations: {
            some: {
              name: {
                contains: query,
                mode: 'insensitive',
              },
              language: lang,
            },
          },
        },
        {
          translations: {
            some: {
              description: {
                contains: query,
                mode: 'insensitive',
              },
              language: lang,
            },
          },
        },
      ],
    },
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
  searchProducts,
};
