import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import productsRouter from './routes/products.js';
import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
import ordersRouter from './routes/orders.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Serve images from frontend public folder so stored paths like /images/product_1.png are accessible
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagesPath = path.join(__dirname, '..', '..', 'frontend', 'public', 'images');
app.use('/images', express.static(imagesPath));

// Routes
app.use('/api/products', productsRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/orders', ordersRouter);

// Ensure schema on startup (add cart/notifications columns and orders table if missing)
async function ensureSchema() {
  try {
    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS cart LONGTEXT NULL");
    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS notifications LONGTEXT NULL");
    await pool.query("ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INT DEFAULT 0");
    await pool.query(`CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      total_amount DECIMAL(10,2) NOT NULL,
      items_json LONGTEXT,
      status VARCHAR(50) DEFAULT 'completed',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);
    console.log('Schema ensured: users.cart, users.notifications, products.stock, orders');
  } catch (err) {
    console.error('Schema ensure error:', err.message);
  }
}

(async () => {
  await ensureSchema();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();
