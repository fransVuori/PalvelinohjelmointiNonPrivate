const prisma = require('../utils/prisma');
const { supportedLanguages } = require('../utils/languageFallback');

const getAllProducts = async (lang, page, limit, sortBy, sortOrder) => {
  const skip = (page - 1) * limit;
  const orderBy = {};

  if (sortBy === 'name') {
    orderBy.translations = {
      name: sortOrder,
    };
  } else if (sortBy === 'price') {
    orderBy.price = sortOrder;
  } else {
    orderBy.id = sortOrder;
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      skip,
      take: parseInt(limit),
      orderBy,
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
    }),
    prisma.product.count(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: products.map((product) => ({
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
    })),
    pagination: {
      total,
      totalPages,
      currentPage: parseInt(page),
      pageSize: parseInt(limit),
    },
  };
};

const getProductById = async (id, lang) => {
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
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

  if (!product) {
    return null;
  }

  return {
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
  };
};

const getProductsByLanguage = async (lang) => {
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

const getProductsByTag = async (tag, lang) => {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        {
          translations: {
            some: {
              name: {
                contains: tag,
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
                contains: tag,
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
  getAllProducts,
  getProductById,
  getProductsByLanguage,
  getProductsByTag,
};
