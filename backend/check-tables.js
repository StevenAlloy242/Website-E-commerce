import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function testDb() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ecommerce',
      port: process.env.DB_PORT || 3306
    });

    console.log('Products table structure:');
    const [columns] = await connection.query('DESCRIBE products');
    console.table(columns);

    console.log('\nUsers table structure:');
    const [userColumns] = await connection.query('DESCRIBE users');
    console.table(userColumns);

    await connection.end();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

testDb();
