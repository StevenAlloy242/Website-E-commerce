import { pool } from './src/config/db.js';

// Seed list taken from setup.sql - simplified entries matching original order
const seed = [
  { id: 1, name: 'Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse', category: 'women', new_price: 50.00, old_price: 80.50, image: '/images/product_1.png' },
  { id: 2, name: 'Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse', category: 'women', new_price: 85.00, old_price: 120.50, image: '/images/product_2.png' },
  { id: 3, name: 'Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse', category: 'women', new_price: 60.00, old_price: 100.50, image: '/images/product_3.png' },
  { id: 4, name: 'Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse', category: 'women', new_price: 100.00, old_price: 150.00, image: '/images/product_4.png' },
  { id: 5, name: 'Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse', category: 'women', new_price: 85.00, old_price: 120.50, image: '/images/product_5.png' },
  { id: 6, name: 'Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse', category: 'women', new_price: 85.00, old_price: 120.50, image: '/images/product_6.png' },
  { id: 7, name: 'Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse', category: 'women', new_price: 85.00, old_price: 120.50, image: '/images/product_7.png' },
  { id: 8, name: 'Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse', category: 'women', new_price: 85.00, old_price: 120.50, image: '/images/product_8.png' },
  { id: 9, name: 'Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse', category: 'women', new_price: 85.00, old_price: 120.50, image: '/images/product_9.png' },
  { id: 10, name: 'Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse', category: 'women', new_price: 85.00, old_price: 120.50, image: '/images/product_10.png' },
  { id: 11, name: 'Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse', category: 'women', new_price: 85.00, old_price: 120.50, image: '/images/product_11.png' },
  { id: 12, name: 'Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse', category: 'women', new_price: 85.00, old_price: 120.50, image: '/images/product_12.png' },

  { id: 13, name: 'Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket', category: 'men', new_price: 85.00, old_price: 120.50, image: '/images/product_13.png' },
  { id: 14, name: 'Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket', category: 'men', new_price: 85.00, old_price: 120.50, image: '/images/product_14.png' },
  { id: 15, name: 'Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket', category: 'men', new_price: 85.00, old_price: 120.50, image: '/images/product_15.png' },
  { id: 16, name: 'Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket', category: 'men', new_price: 85.00, old_price: 120.50, image: '/images/product_16.png' },
  { id: 17, name: 'Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket', category: 'men', new_price: 85.00, old_price: 120.50, image: '/images/product_17.png' },
  { id: 18, name: 'Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket', category: 'men', new_price: 85.00, old_price: 120.50, image: '/images/product_18.png' },
  { id: 19, name: 'Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket', category: 'men', new_price: 85.00, old_price: 120.50, image: '/images/product_19.png' },
  { id: 20, name: 'Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket', category: 'men', new_price: 85.00, old_price: 120.50, image: '/images/product_20.png' },
  { id: 21, name: 'Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket', category: 'men', new_price: 85.00, old_price: 120.50, image: '/images/product_21.png' },
  { id: 22, name: 'Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket', category: 'men', new_price: 85.00, old_price: 120.50, image: '/images/product_22.png' },
  { id: 23, name: 'Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket', category: 'men', new_price: 85.00, old_price: 120.50, image: '/images/product_23.png' },
  { id: 24, name: 'Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket', category: 'men', new_price: 85.00, old_price: 120.50, image: '/images/product_24.png' },

  { id: 25, name: 'Boys Orange Colourblocked Hooded Sweatshirt', category: 'kid', new_price: 85.00, old_price: 120.50, image: '/images/product_25.png' },
  { id: 26, name: 'Boys Orange Colourblocked Hooded Sweatshirt', category: 'kid', new_price: 85.00, old_price: 120.50, image: '/images/product_26.png' },
  { id: 27, name: 'Boys Orange Colourblocked Hooded Sweatshirt', category: 'kid', new_price: 85.00, old_price: 120.50, image: '/images/product_27.png' },
  { id: 28, name: 'Boys Orange Colourblocked Hooded Sweatshirt', category: 'kid', new_price: 85.00, old_price: 120.50, image: '/images/product_28.png' },
  { id: 29, name: 'Boys Orange Colourblocked Hooded Sweatshirt', category: 'kid', new_price: 85.00, old_price: 120.50, image: '/images/product_29.png' },
  { id: 30, name: 'Boys Orange Colourblocked Hooded Sweatshirt', category: 'kid', new_price: 85.00, old_price: 120.50, image: '/images/product_30.png' },
  { id: 31, name: 'Boys Orange Colourblocked Hooded Sweatshirt', category: 'kid', new_price: 85.00, old_price: 120.50, image: '/images/product_31.png' },
  { id: 32, name: 'Boys Orange Colourblocked Hooded Sweatshirt', category: 'kid', new_price: 85.00, old_price: 120.50, image: '/images/product_32.png' },
  { id: 33, name: 'Boys Orange Colourblocked Hooded Sweatshirt', category: 'kid', new_price: 85.00, old_price: 120.50, image: '/images/product_33.png' },
  { id: 34, name: 'Boys Orange Colourblocked Hooded Sweatshirt', category: 'kid', new_price: 85.00, old_price: 120.50, image: '/images/product_34.png' },
  { id: 35, name: 'Boys Orange Colourblocked Hooded Sweatshirt', category: 'kid', new_price: 85.00, old_price: 120.50, image: '/images/product_35.png' },
  { id: 36, name: 'Boys Orange Colourblocked Hooded Sweatshirt', category: 'kid', new_price: 85.00, old_price: 120.50, image: '/images/product_36.png' }
];

async function resetProductsPreserveStock() {
  try {
    console.log('Reading existing stock values...');
    const [rows] = await pool.query('SELECT id, stock FROM products');
    const stockMap = new Map();
    rows.forEach(r => stockMap.set(r.id, Number(r.stock || 0)));

    console.log('Clearing products table...');
    await pool.query('DELETE FROM products');

    console.log('Inserting seed products while preserving stock where possible...');
    for (const p of seed) {
      const stockVal = stockMap.has(p.id) ? stockMap.get(p.id) : 100;
      await pool.query(
        'INSERT INTO products (id, name, category, new_price, old_price, image, owner_id, stock) VALUES (?, ?, ?, ?, ?, ?, NULL, ?)',
        [p.id, p.name, p.category, p.new_price, p.old_price, p.image, stockVal]
      );
    }

    // Reset AUTO_INCREMENT to max(id)+1
    await pool.query('ALTER TABLE products AUTO_INCREMENT = ?', [seed.length + 1]);

    console.log('Products reset complete (stock preserved where available).');
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err.message || err);
    process.exit(1);
  }
}

resetProductsPreserveStock();
