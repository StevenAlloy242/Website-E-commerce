-- Script untuk check database setup
-- Jalankan ini di phpMyAdmin Query tab untuk verify semuanya OK

-- 1. Check database ecommerce exists
SHOW DATABASES LIKE 'ecommerce';

-- 2. Check users table
SHOW TABLES FROM ecommerce;

-- 3. Check users table structure
DESCRIBE ecommerce.users;

-- 4. Check products table structure
DESCRIBE ecommerce.products;

-- 5. Check admin user exists
SELECT * FROM ecommerce.users WHERE username = 'admin';

-- 6. Check products
SELECT * FROM ecommerce.products;

-- 7. Check user count
SELECT COUNT(*) as total_users FROM ecommerce.users;

-- 8. Check product count
SELECT COUNT(*) as total_products FROM ecommerce.products;
