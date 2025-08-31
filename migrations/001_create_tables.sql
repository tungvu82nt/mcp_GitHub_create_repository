-- ===========================================
-- Yapee E-commerce Database Schema
-- MySQL 8.0+ Compatible
-- ===========================================

-- Create database with proper charset
CREATE DATABASE IF NOT EXISTS yapee_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE yapee_db;

-- ===========================================
-- 1. USERS TABLE
-- ===========================================
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  role ENUM('user', 'admin') DEFAULT 'user',
  avatar VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_username (username),
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- ===========================================
-- 2. CATEGORIES TABLE (Hierarchical)
-- ===========================================
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  icon VARCHAR(50),
  parent_id INT DEFAULT NULL,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_slug (slug),
  INDEX idx_parent (parent_id),
  INDEX idx_sort_order (sort_order),
  INDEX idx_is_active (is_active)
);

-- ===========================================
-- 3. PRODUCTS TABLE
-- ===========================================
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2) DEFAULT NULL,
  category_id INT DEFAULT NULL,
  brand VARCHAR(100),
  sku VARCHAR(100) UNIQUE,
  stock_quantity INT DEFAULT 0,
  sold_count INT DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.00,
  review_count INT DEFAULT 0,
  images JSON DEFAULT ('[]'),
  specifications JSON DEFAULT ('{}'),
  tags JSON DEFAULT ('[]'),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_name (name),
  INDEX idx_slug (slug),
  INDEX idx_category (category_id),
  INDEX idx_brand (brand),
  INDEX idx_price (price),
  INDEX idx_is_active (is_active),
  INDEX idx_created_at (created_at),
  FULLTEXT idx_fulltext_search (name, brand, description)
);

-- ===========================================
-- 4. ORDERS TABLE
-- ===========================================
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  status ENUM('pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled', 'refunded') DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  shipping_fee DECIMAL(10,2) DEFAULT 0.00,
  discount_amount DECIMAL(10,2) DEFAULT 0.00,
  payment_method VARCHAR(50),
  payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  shipping_address JSON NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  INDEX idx_payment_status (payment_status)
);

-- ===========================================
-- 5. ORDER ITEMS TABLE
-- ===========================================
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT DEFAULT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
  INDEX idx_order_id (order_id),
  INDEX idx_product_id (product_id)
);

-- ===========================================
-- 6. REVIEWS TABLE
-- ===========================================
CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  order_id INT DEFAULT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  images JSON DEFAULT ('[]'),
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
  INDEX idx_product_id (product_id),
  INDEX idx_user_id (user_id),
  INDEX idx_rating (rating),
  INDEX idx_created_at (created_at)
);

-- ===========================================
-- 7. SESSIONS TABLE (For session management)
-- ===========================================
CREATE TABLE sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_session_token (session_token),
  INDEX idx_user_id (user_id),
  INDEX idx_expires_at (expires_at)
);

-- ===========================================
-- 9. INSERT INITIAL DATA
-- ===========================================

-- Insert default admin user (password will be hashed)
INSERT INTO users (username, email, password_hash, full_name, role) VALUES
('admin', 'admin@yapee.local', '$2b$10$hashedpassword', 'Administrator', 'admin');

-- Insert sample categories
INSERT INTO categories (name, slug, icon, sort_order) VALUES
('Điện Thoại - Máy Tính Bảng', 'dien-thoai', 'Smartphone', 1),
('Điện Tử', 'dien-tu', 'Laptop', 2),
('Thời Trang Nam', 'thoi-trang-nam', 'ShirtIcon', 3),
('Thời Trang Nữ', 'thoi-trang-nu', 'Shirt', 4),
('Mẹ & Bé', 'me-be', 'Baby', 5),
('Nhà Cửa & Đời Sống', 'nha-cua', 'Home', 6),
('Sách & Tiểu Thuyết', 'sach', 'Book', 7),
('Thể Thao & Du Lịch', 'the-thao', 'Bike', 8);

-- ===========================================
-- 10. USEFUL VIEWS
-- ===========================================

-- Products with category info
CREATE VIEW products_with_category AS
SELECT
  p.*,
  c.name as category_name,
  c.slug as category_slug
FROM products p
LEFT JOIN categories c ON p.category_id = c.id;

-- Order summary view
CREATE VIEW order_summary AS
SELECT
  o.*,
  u.username,
  u.full_name as user_full_name,
  COUNT(oi.id) as item_count
FROM orders o
JOIN users u ON o.user_id = u.id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, u.username, u.full_name;

-- ===========================================
-- 11. STORED PROCEDURES
-- ===========================================

-- Update product stock procedure
DELIMITER //
CREATE PROCEDURE update_product_stock(
  IN p_product_id INT,
  IN p_quantity_sold INT
)
BEGIN
  UPDATE products
  SET
    stock_quantity = stock_quantity - p_quantity_sold,
    sold_count = sold_count + p_quantity_sold
  WHERE id = p_product_id AND stock_quantity >= p_quantity_sold;
END //
DELIMITER ;

-- Get product recommendations
DELIMITER //
CREATE PROCEDURE get_product_recommendations(
  IN p_product_id INT,
  IN p_limit INT DEFAULT 4
)
BEGIN
  SELECT p.*
  FROM products p
  JOIN products base ON base.id = p_product_id
  WHERE p.category_id = base.category_id
    AND p.id != p_product_id
    AND p.is_active = TRUE
  ORDER BY p.rating DESC, p.sold_count DESC
  LIMIT p_limit;
END //
DELIMITER ;

-- ===========================================
-- 12. TRIGGERS
-- ===========================================

-- Update product rating when review is added/updated
DELIMITER //
CREATE TRIGGER update_product_rating
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
  UPDATE products
  SET
    rating = (SELECT AVG(rating) FROM reviews WHERE product_id = NEW.product_id),
    review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = NEW.product_id)
  WHERE id = NEW.product_id;
END //
DELIMITER ;

-- Show completion message
SELECT '✅ MySQL Database Schema Created Successfully!' as status;