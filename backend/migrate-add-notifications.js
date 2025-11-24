import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function migrate() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ecommerce',
      port: process.env.DB_PORT || 3306
    });

    console.log('Connected to DB, checking users table for notifications column...');

    // Add notifications column if not exists
    await connection.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS notifications LONGTEXT NULL");
    console.log('Migration applied: users.notifications (if not existed)');

    await connection.end();
  } catch (err) {
    console.error('Migration error:', err.message);
    process.exit(1);
  }
}

migrate();
