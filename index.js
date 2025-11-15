const express = require("express");
const cors = require("cors");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();
app.use(cors());
app.use(express.json());

// --- SEQUELIZE-YHTEYDET ---

// Kategoriat (Categories.db)
const categoriesSequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "db-tiedostot", "Categories.db"),
  logging: false,
});

const Category = categoriesSequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    // oletus: kielikentät, jos näitä ei ole, ei haittaa kun käytämme raw:true
    nameFI: DataTypes.STRING,
    nameSV: DataTypes.STRING,
    nameEN: DataTypes.STRING,
    name: DataTypes.STRING,
  },
  {
    tableName: "Categories",
    timestamps: false,
  }
);

// CategoryItems (CategoryItems.db)
const categoryItemsSequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "db-tiedostot", "CategoryItems.db"),
  logging: false,
});

const CategoryItem = categoryItemsSequelize.define(
  "CategoryItem",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    categoryId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
  },
  {
    tableName: "CategoryItems",
    timestamps: false,
  }
);

// Products FI / SV / EN (ProductsFI.db jne.)
function createProductModel(storagePath) {
  const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: storagePath,
    logging: false,
  });

  const Product = sequelize.define(
    "Product",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      // *** NÄMÄ OVAT OIKEAT SARAMET TAULUSSA ***
      name: DataTypes.STRING,
      details: DataTypes.TEXT,
      description: DataTypes.TEXT,
      price: DataTypes.STRING,

      // dieetti / allergia-kentät (0/1)
      gluten: DataTypes.INTEGER,
      milk: DataTypes.INTEGER,
      lactose: DataTypes.INTEGER,
      nuts: DataTypes.INTEGER,
      meat: DataTypes.INTEGER,
      animal: DataTypes.INTEGER,
      fish: DataTypes.INTEGER,
      seafood: DataTypes.INTEGER,
      soy: DataTypes.INTEGER,
      egg: DataTypes.INTEGER,
    },
    {
      tableName: "Products",
      timestamps: false,
    }
  );

  return { sequelize, Product };
}

const { Product: ProductFI } = createProductModel(
  path.join(__dirname, "db-tiedostot", "ProductsFI.db")
);
const { Product: ProductSV } = createProductModel(
  path.join(__dirname, "db-tiedostot", "ProductsSV.db")
);
const { Product: ProductEN } = createProductModel(
  path.join(__dirname, "db-tiedostot", "ProductsEN.db")
);

// Apufunktio: valitse oikea Product-malli kielen mukaan
function getProductModel(lang) {
  const l = (lang || "fi").toLowerCase();
  if (l === "sv") return ProductSV;
  if (l === "en") return ProductEN;
  return ProductFI;
}

// --- TESTI ---
app.get("/api/test", (req, res) => {
  res.json({ message: "SQLite backend (FI/SV/EN) Sequelize-versio toimii!" });
});

// --- HAE KAIKKI KATEGORIAT ---
app.get("/api/categories", async (req, res) => {
  try {
    const rows = await Category.findAll({ raw: true });
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Category fetch error" });
  }
});

// --- HAE TUOTTEET TIETYSTÄ KATEGORIASTA ---
app.get("/api/category/:id", async (req, res) => {
  const categoryId = req.params.id;
  const lang = req.query.lang;
  const Product = getProductModel(lang);

  try {
    // hae tähän kategoriaan kuuluvat productId:t CategoryItems-taulusta
    const itemRows = await CategoryItem.findAll({
      where: { categoryId: Number(categoryId) },
      raw: true,
    });

    const ids = itemRows.map((row) => row.productId);
    if (ids.length === 0) {
      return res.json([]);
    }

    const productsList = await Product.findAll({
      where: { id: ids },
      raw: true,
    });

    res.json(productsList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Category product fetch error" });
  }
});

// --- HAE YKSI TUOTE ---
app.get("/api/product/:id", async (req, res) => {
  const lang = req.query.lang;
  const Product = getProductModel(lang);

  try {
    const product = await Product.findByPk(req.params.id, { raw: true });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Product fetch error" });
  }
});

// --- HAE KAIKKI TUOTTEET JA SUODATA TARVITTAESSA ---
app.get("/api/products", async (req, res) => {
  const lang = req.query.lang;
  const Product = getProductModel(lang);

  try {
    let rows = await Product.findAll({ raw: true });

    // Poista lang-parametri, loput ovat filttereitä
    const filters = { ...req.query };
    delete filters.lang;

    // Suodata backendissä:
    // UI-logiikka: filteri = true tarkoittaa "EI saa sisältää tätä" → sarakkeen arvo pitää olla 0
    Object.entries(filters).forEach(([key, value]) => {
      if (value === "true") {
        rows = rows.filter((product) => product[key] === 0);
      }
    });

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Product fetch error" });
  }
});

// --- KÄYNNISTÄ PALVELIN ---
const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
