const prisma = require('../utils/prisma');

const getStats = async () => {
  const [totalProducts, totalCategories, avgPrice, allergenStats] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.product.aggregate({
      _avg: {
        price: true,
      },
    }),
    prisma.product.groupBy({
      by: ['containsGluten', 'containsLactose', 'containsNuts'],
      _count: {
        _all: true,
      },
    }),
  ]);

  return {
    totalProducts,
    totalCategories,
    avgPrice: avgPrice._avg.price,
    allergenStats,
  };
};

module.exports = {
  getStats,
};
