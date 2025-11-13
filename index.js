const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// --- LADATAAN TIETOKANNAT ---
const categoriesDb = new Database(path.join(__dirname, "db-tiedostot", "Categories.db"));
const categoryItemsDb = new Database(path.join(__dirname, "db-tiedostot", "CategoryItems.db"));

// Tuotteet kieliversioina
const products = {
  fi: new Database(path.join(__dirname, "db-tiedostot", "ProductsFI.db")),
  sv: new Database(path.join(__dirname, "db-tiedostot", "ProductsSV.db")),
  en: new Database(path.join(__dirname, "db-tiedostot", "ProductsEN.db")),
};

// Apufunktio: valitse oikea kielitietokanta
function getProductDb(lang) {
  const l = (lang || "fi").toLowerCase();
  if (products[l]) return products[l];
  return products.fi; // fallback FI
}


// --- TESTI ---
app.get("/api/test", (req, res) => {
  res.json({ message: "SQLite backend (FI/SV/EN) toimii!" });
});


// --- HAE KAIKKI KATEGORIAT ---
app.get("/api/categories", (req, res) => {
  try {
    const rows = categoriesDb.prepare("SELECT * FROM Categories").all();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Category fetch error" });
  }
});


// --- HAE TUOTTEET TIETYSTÄ KATEGORIASTA ---
app.get("/api/category/:id", (req, res) => {
  const categoryId = req.params.id;
  const lang = req.query.lang;
  const productDb = getProductDb(lang);

  try {
    const itemIds = categoryItemsDb
      .prepare("SELECT productId FROM CategoryItems WHERE categoryId = ?")
      .all(categoryId)
      .map(row => row.productId);

    const productsList = itemIds.map(id =>
      productDb.prepare("SELECT * FROM Products WHERE id = ?").get(id)
    );

    res.json(productsList.filter(Boolean));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Category product fetch error" });
  }
});


// --- HAE YKSI TUOTE ---
app.get("/api/product/:id", (req, res) => {
  const lang = req.query.lang;
  const productDb = getProductDb(lang);

  try {
    const product = productDb.prepare("SELECT * FROM Products WHERE id = ?").get(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Product fetch error" });
  }
});


// --- HAE KAIKKI TUOTTEET ---
app.get("/api/products", (req, res) => {
  const lang = req.query.lang;
  const productDb = getProductDb(lang);

  try {
    const rows = productDb.prepare("SELECT * FROM Products").all();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Product fetch error" });
  }
});


// --- KÄYNNISTÄ PALVELIN ---
const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
