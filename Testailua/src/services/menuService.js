const prisma = require('../utils/prisma');

const getMenuItems = async (lang) => {
  const categories = await prisma.category.findMany({
    include: {
      translations: {
        where: {
          language: lang,
        },
      },
      products: {
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

  return categories.map((category) => ({
    id: category.id,
    slug: category.slug,
    name: category.translations[0]?.name || `Category ${category.id}`,
    products: category.products.map((product) => ({
      id: product.id,
      name: product.translations[0]?.name || `Product ${product.id}`,
      description: product.translations[0]?.description || '',
      price: product.price,
      containsGluten: product.containsGluten,
      containsLactose: product.containsLactose,
      containsNuts: product.containsNuts,
      isVegetarian: product.isVegetarian,
      isVegan: product.isVegan,
    })),
  }));
};

const getMenuOfTheDay = async (date, lang) => {
  // In a real application, you would have a more sophisticated logic to determine the menu of the day.
  // For simplicity, we'll just return a random selection of products.
  const products = await prisma.product.findMany({
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
    take: 5, // Return 5 random products
    orderBy: {
      id: 'asc', // For simplicity, we'll just take the first 5 products
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

const getRecommendations = async (type, lang) => {
  // In a real application, you would have a more sophisticated recommendation logic.
  // For simplicity, we'll just return a random selection of products based on the type.
  let where = {};

  if (type === 'child') {
    where = {
      OR: [
        { price: { lt: 1000 } }, // Products cheaper than 10 EUR
        { isVegetarian: true },
      ],
    };
  } else if (type === 'quick') {
    where = {
      price: { lt: 1500 }, // Products cheaper than 15 EUR
    };
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
    take: 5, // Return 5 random products
    orderBy: {
      id: 'asc', // For simplicity, we'll just take the first 5 products
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
  getMenuItems,
  getMenuOfTheDay,
  getRecommendations,
};
