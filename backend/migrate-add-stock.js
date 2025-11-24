import { pool } from './src/config/db.js';

async function migrateAddStock() {
  try {
    console.log('Adding stock column to products table...');
    await pool.query(`
      ALTER TABLE products
      ADD COLUMN IF NOT EXISTS stock INT DEFAULT 0
    `);
    console.log('✓ stock column added to products table');

    // Set default stock = 100 for existing products
    await pool.query(`UPDATE products SET stock = 100 WHERE stock IS NULL OR stock = 0`);
    console.log('✓ Default stock set to 100 for existing products');

    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err.message);
    process.exit(1);
  }
}

migrateAddStock();
