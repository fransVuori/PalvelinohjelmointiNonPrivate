const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create categories
  const starter = await prisma.category.create({
    data: {
      slug: 'starter',
      translations: {
        create: [
          { language: 'fi', name: 'Alkuruoka' },
          { language: 'sv', name: 'Förrätt' },
          { language: 'en', name: 'Starter' },
        ],
      },
    },
  });

  const mainCourse = await prisma.category.create({
    data: {
      slug: 'main-course',
      translations: {
        create: [
          { language: 'fi', name: 'Pääruoka' },
          { language: 'sv', name: 'Huvudrätt' },
          { language: 'en', name: 'Main Course' },
        ],
      },
    },
  });

  // Create products
  await prisma.product.create({
    data: {
      categoryId: starter.id,
      price: 990, // 9.90 EUR
      containsGluten: true,
      containsLactose: false,
      containsNuts: false,
      isVegetarian: true,
      isVegan: false,
      translations: {
        create: [
          {
            language: 'fi',
            name: 'Bruschetta',
            description: 'Paahdettu leipä, tomaatti, valkosipuli ja basilika',
          },
          {
            language: 'sv',
            name: 'Bruschetta',
            description: 'Rostat bröd, tomat, vitlök och basilikum',
          },
          {
            language: 'en',
            name: 'Bruschetta',
            description: 'Toasted bread, tomato, garlic, and basil',
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      categoryId: mainCourse.id,
      price: 1990, // 19.90 EUR
      containsGluten: true,
      containsLactose: true,
      containsNuts: false,
      isVegetarian: false,
      isVegan: false,
      translations: {
        create: [
          {
            language: 'fi',
            name: 'Spaghetti Bolognese',
            description: 'Perinteinen italialainen pasta-annos',
          },
          {
            language: 'sv',
            name: 'Spaghetti Bolognese',
            description: 'Traditionell italiensk pastarätt',
          },
          {
            language: 'en',
            name: 'Spaghetti Bolognese',
            description: 'Traditional Italian pasta dish',
          },
        ],
      },
    },
  });

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
