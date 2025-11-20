import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function diagnose() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ecommerce',
      port: process.env.DB_PORT || 3306
    });

    console.log('✓ Connected to database');

    // Check users table
    const [userCols] = await connection.query("SHOW COLUMNS FROM users");
    console.log('\n📋 Users table columns:');
    userCols.forEach(col => console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`));

    // Check if orders table exists
    const [tables] = await connection.query("SHOW TABLES LIKE 'orders'");
    if (tables.length === 0) {
      console.log('\n❌ Orders table DOES NOT EXIST - creating it now...');
      await connection.query(`
        CREATE TABLE orders (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          total_amount DECIMAL(10,2) NOT NULL,
          items_json LONGTEXT,
          status VARCHAR(50) DEFAULT 'completed',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);
      console.log('✓ Orders table created successfully');
    } else {
      console.log('\n✓ Orders table EXISTS');
      const [orderCols] = await connection.query("SHOW COLUMNS FROM orders");
      console.log('📋 Orders table columns:');
      orderCols.forEach(col => console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`));
    }

    // Check sample user
    const [users] = await connection.query('SELECT id, username, role, balance FROM users LIMIT 1');
    if (users.length > 0) {
      console.log('\n✓ Sample user:');
      console.log(`  - ID: ${users[0].id}`);
      console.log(`  - Username: ${users[0].username}`);
      console.log(`  - Role: ${users[0].role}`);
      console.log(`  - Balance: ${users[0].balance}`);
    }

    console.log('\n✅ Database diagnostic complete');
    await connection.end();
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

diagnose();
