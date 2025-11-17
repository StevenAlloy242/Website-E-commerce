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
('Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse', 'women', 50.00, 80.50, '/images/product_1.png'),
('Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket', 'men', 85.00, 120.50, '/images/product_13.png');

-- Create table users to store buyers and admin
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('buyer','admin') NOT NULL DEFAULT 'buyer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (username: admin, password: admin123 - hashed with bcrypt)
-- Password hash: $2b$10$aMO.FeGWpLRvJXxJpLbxE.GhL6GvSCWDXh3LGmMuVQPlmCKvPqaHu (bcrypt hash of 'admin123')
INSERT INTO users (username, password, role) VALUES
('admin', '$2b$10$aMO.FeGWpLRvJXxJpLbxE.GhL6GvSCWDXh3LGmMuVQPlmCKvPqaHu', 'admin')
ON DUPLICATE KEY UPDATE username = username;
