const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// --- LADATAAN TIETOKANNAT ---
const categoriesDb = new Database(path.join(__dirname, "db-tiedostot/Categories.db"));
const categoryItemsDb = new Database(path.join(__dirname, "db-tiedostot/CategoryItems.db"));
const productsDb = new Database(path.join(__dirname, "db-tiedostot/Products.db"));


// --- TESTI ---
app.get("/api/test", (req, res) => {
  res.json({ message: "SQLite backend toimii!" });
});


// --- HAE KAIKKI KATEGORIAT ---
app.get("/api/categories", (req, res) => {
  try {
    const stmt = categoriesDb.prepare("SELECT * FROM Categories");
    const rows = stmt.all();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Category fetch error" });
  }
});


// --- HAE TUOTTEET TIETYSTÄ KATEGORIASTA ---
app.get("/api/category/:id", (req, res) => {
  const categoryId = req.params.id;

  try {
    const itemIds = categoryItemsDb
      .prepare("SELECT productId FROM CategoryItems WHERE categoryId = ?")
      .all(categoryId)
      .map(row => row.productId);

    const products = itemIds.map(id => {
      return productsDb.prepare("SELECT * FROM Products WHERE id = ?").get(id);
    });

    res.json(products.filter(Boolean)); // poistaa null-arvot
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Category product fetch error" });
  }
});


// --- HAE YKSI TUOTE ---
app.get("/api/product/:id", (req, res) => {
  try {
    const stmt = productsDb.prepare("SELECT * FROM Products WHERE id = ?");
    const product = stmt.get(req.params.id);

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
  try {
    const stmt = productsDb.prepare("SELECT * FROM Products");
    const rows = stmt.all();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Product fetch error" });
  }
});


// --- KÄYNNISTÄ PALVELIN ---
const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
