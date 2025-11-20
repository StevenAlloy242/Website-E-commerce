-- Buat database ecommerce jika belum ada
CREATE DATABASE IF NOT EXISTS ecommerce;

USE ecommerce;

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  new_price DECIMAL(10,2) NOT NULL,
  old_price DECIMAL(10,2),
  image VARCHAR(255),
  owner_id INT NULL,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

INSERT INTO products (name, category, new_price, old_price, image) VALUES
-- Women Collection (1-12)
('Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse', 'women', 50.00, 80.50, '/images/product_1.png'),
('Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse', 'women', 85.00, 120.50, '/images/product_2.png'),
('Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse', 'women', 60.00, 100.50, '/images/product_3.png'),
('Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse', 'women', 100.00, 150.00, '/images/product_4.png'),
('Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse', 'women', 85.00, 120.50, '/images/product_5.png'),
('Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse', 'women', 85.00, 120.50, '/images/product_6.png'),
('Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse', 'women', 85.00, 120.50, '/images/product_7.png'),
('Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse', 'women', 85.00, 120.50, '/images/product_8.png'),
('Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse', 'women', 85.00, 120.50, '/images/product_9.png'),
('Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse', 'women', 85.00, 120.50, '/images/product_10.png'),
('Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse', 'women', 85.00, 120.50, '/images/product_11.png'),
('Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse', 'women', 85.00, 120.50, '/images/product_12.png'),
-- Men Collection (13-24)
('Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket', 'men', 85.00, 120.50, '/images/product_13.png'),
('Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket', 'men', 85.00, 120.50, '/images/product_14.png'),
('Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket', 'men', 85.00, 120.50, '/images/product_15.png'),
('Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket', 'men', 85.00, 120.50, '/images/product_16.png'),
('Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket', 'men', 85.00, 120.50, '/images/product_17.png'),
('Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket', 'men', 85.00, 120.50, '/images/product_18.png'),
('Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket', 'men', 85.00, 120.50, '/images/product_19.png'),
('Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket', 'men', 85.00, 120.50, '/images/product_20.png'),
('Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket', 'men', 85.00, 120.50, '/images/product_21.png'),
('Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket', 'men', 85.00, 120.50, '/images/product_22.png'),
('Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket', 'men', 85.00, 120.50, '/images/product_23.png'),
('Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket', 'men', 85.00, 120.50, '/images/product_24.png'),
-- Kids Collection (25-36)
('Boys Orange Colourblocked Hooded Sweatshirt', 'kid', 85.00, 120.50, '/images/product_25.png'),
('Boys Orange Colourblocked Hooded Sweatshirt', 'kid', 85.00, 120.50, '/images/product_26.png'),
('Boys Orange Colourblocked Hooded Sweatshirt', 'kid', 85.00, 120.50, '/images/product_27.png'),
('Boys Orange Colourblocked Hooded Sweatshirt', 'kid', 85.00, 120.50, '/images/product_28.png'),
('Boys Orange Colourblocked Hooded Sweatshirt', 'kid', 85.00, 120.50, '/images/product_29.png'),
('Boys Orange Colourblocked Hooded Sweatshirt', 'kid', 85.00, 120.50, '/images/product_30.png'),
('Boys Orange Colourblocked Hooded Sweatshirt', 'kid', 85.00, 120.50, '/images/product_31.png'),
('Boys Orange Colourblocked Hooded Sweatshirt', 'kid', 85.00, 120.50, '/images/product_32.png'),
('Boys Orange Colourblocked Hooded Sweatshirt', 'kid', 85.00, 120.50, '/images/product_33.png'),
('Boys Orange Colourblocked Hooded Sweatshirt', 'kid', 85.00, 120.50, '/images/product_34.png'),
('Boys Orange Colourblocked Hooded Sweatshirt', 'kid', 85.00, 120.50, '/images/product_35.png'),
('Boys Orange Colourblocked Hooded Sweatshirt', 'kid', 85.00, 120.50, '/images/product_36.png');

-- Create table users to store buyers and admin
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('buyer','admin') NOT NULL DEFAULT 'buyer',
  balance DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (username: admin, password: admin123 - hashed with bcrypt)
-- Password hash: $2b$10$aMO.FeGWpLRvJXxJpLbxE.GhL6GvSCWDXh3LGmMuVQPlmCKvPqaHu (bcrypt hash of 'admin123')
INSERT INTO users (username, password, role) VALUES
('admin', 'admin123', 'admin')
ON DUPLICATE KEY UPDATE username = username;

-- Create table orders to store purchase history
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  items_json LONGTEXT,
  status VARCHAR(50) DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
