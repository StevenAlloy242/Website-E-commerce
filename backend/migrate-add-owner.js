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

    console.log('Adding owner_id column to products table...');
    
    // Check if column already exists
    const [columns] = await connection.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'products' AND COLUMN_NAME = 'owner_id'`
    );

    if (columns.length === 0) {
      // Add the column with foreign key
      await connection.query(`
        ALTER TABLE products 
        ADD COLUMN owner_id INT,
        ADD CONSTRAINT fk_product_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
      `);
      console.log('✓ Column owner_id added successfully');

      // Set admin user as owner for existing products (assuming admin is user id 1)
      const [adminUser] = await connection.query('SELECT id FROM users WHERE role = "admin" LIMIT 1');
      if (adminUser.length > 0) {
        const adminId = adminUser[0].id;
        await connection.query('UPDATE products SET owner_id = ? WHERE owner_id IS NULL', [adminId]);
        console.log('✓ Existing products assigned to admin user');
      }
    } else {
      console.log('✓ Column owner_id already exists');
    }

    await connection.end();
    console.log('✓ Migration complete!');
  } catch (err) {
    console.error('✗ Error:', err.message);
    process.exit(1);
  }
}

migrate();
