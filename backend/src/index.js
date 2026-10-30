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
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="utf-8">
      <title>E-Commerce REST API Backend</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px 20px; line-height: 1.6; }
        .container { max-width: 680px; margin: 0 auto; background: #1e293b; padding: 32px; border-radius: 14px; border: 1px solid #334155; box-shadow: 0 10px 25px rgba(0,0,0,0.3); }
        h1 { color: #38bdf8; margin-top: 0; font-size: 22px; display: flex; align-items: center; gap: 10px; }
        .badge { background: #10b981; color: white; font-size: 11px; padding: 3px 8px; border-radius: 20px; font-weight: bold; }
        p { color: #cbd5e1; font-size: 14px; }
        .endpoint-card { background: #0f172a; border-radius: 8px; padding: 14px 18px; margin: 12px 0; border: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; }
        .method { background: #2563eb; color: white; font-weight: bold; font-size: 11px; padding: 3px 8px; border-radius: 4px; margin-right: 8px; }
        a { color: #38bdf8; text-decoration: none; font-weight: 500; font-size: 13.5px; }
        a:hover { text-decoration: underline; }
        .btn { display: inline-block; background: #2563eb; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px; font-size: 14px; }
        .btn:hover { background: #1d4ed8; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1><span>⚡</span> E-Commerce Backend REST API <span class="badge">Online (Port 5000)</span></h1>
        <p>Server Backend REST API berhasil aktif dan terhubung ke database MySQL.</p>
        
        <div class="endpoint-card">
          <div><span class="method">GET</span> <code>/api/products</code> — 36 Produk Katalog Busana</div>
          <a href="/api/products" target="_blank">Buka JSON &rarr;</a>
        </div>
        <div class="endpoint-card">
          <div><span class="method">POST</span> <code>/api/auth/login</code> — Login &amp; Token JWT</div>
          <span style="color:#64748b; font-size:12px;">Endpoint POST</span>
        </div>
        <div class="endpoint-card">
          <div><span class="method">GET</span> <code>/api/orders</code> — Transaksi &amp; Checkout</div>
          <span style="color:#64748b; font-size:12px;">Bearer Token</span>
        </div>

        <a class="btn" href="http://localhost:5173" target="_blank">&larr; Buka Frontend Toko (Port 5173)</a>
      </div>
    </body>
    </html>
  `);
});

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
