const prisma = require('../utils/prisma');
const { supportedLanguages } = require('../utils/languageFallback');

const getAllCategories = async (lang) => {
  const categories = await prisma.category.findMany({
    include: {
      translations: {
        where: {
          language: lang,
        },
      },
    },
  });

  return categories.map((category) => ({
    id: category.id,
    slug: category.slug,
    name: category.translations[0]?.name || `Category ${category.id}`,
  }));
};

const getCategoryById = async (id, lang) => {
  const category = await prisma.category.findUnique({
    where: { id: parseInt(id) },
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

  if (!category) {
    return null;
  }

  return {
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
  };
};

const getCategoryBySlug = async (slug, lang) => {
  const category = await prisma.category.findUnique({
    where: { slug },
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

  if (!category) {
    return null;
  }

  return {
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
  };
};

module.exports = {
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
};
