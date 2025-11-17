import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function testDb() {
  try {
    console.log('Connecting to database...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ecommerce',
      port: process.env.DB_PORT || 3306
    });
    console.log('✓ Connected successfully');

    console.log('\nChecking tables...');
    const [tables] = await connection.query('SHOW TABLES');
    console.log('Tables found:', tables.map(t => Object.values(t)[0]));

    console.log('\nChecking products...');
    const [products] = await connection.query('SELECT COUNT(*) as count FROM products');
    console.log('Products count:', products[0].count);

    console.log('\nFetching all products...');
    const [rows] = await connection.query(
      'SELECT p.*, u.username as owner_username FROM products p LEFT JOIN users u ON p.owner_id = u.id'
    );
    console.log('Products data:', rows);

    await connection.end();
    console.log('\n✓ All tests passed!');
  } catch (err) {
    console.error('✗ Error:', err.message);
    console.error('Stack:', err.stack);
    process.exit(1);
  }
}

testDb();
