const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

let products = [
  // Sample products, can be replaced with DB later
  {
    id: 1,
    name: "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse",
    category: "women",
    new_price: 50.0,
    old_price: 80.5,
    image: "/images/product_1.png"
  },
  {
    id: 2,
    name: "Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket",
    category: "men",
    new_price: 85.0,
    old_price: 120.5,
    image: "/images/product_13.png"
  }
];

// Get all products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Get product by id
app.get('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

// Add new product
app.post('/api/products', (req, res) => {
  const newProduct = req.body;
  newProduct.id = products.length ? products[products.length - 1].id + 1 : 1;
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Update product
app.put('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...req.body };
    res.json(products[index]);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products.splice(index, 1);
    res.json({ message: "Product deleted" });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
