-- ==========================================================================
-- RESTAURANT.SQL — MySQL Database Schema for ADHIRATHA Family Restaurant (AC)
-- Targets Phase 2 Backend Deployment
-- ==========================================================================

CREATE DATABASE IF NOT EXISTS adhiratha_restaurant;
USE adhiratha_restaurant;

-- 1. Customers Table
CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(15) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NULL,
  password VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  landmark VARCHAR(150) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50) NOT NULL,
  emoji VARCHAR(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id VARCHAR(50) NOT NULL,
  name VARCHAR(150) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(255) NOT NULL,
  is_veg BOOLEAN DEFAULT TRUE,
  is_bestseller BOOLEAN DEFAULT FALSE,
  is_popular BOOLEAN DEFAULT FALSE,
  is_available BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_percent DECIMAL(5, 2) NOT NULL,
  min_order DECIMAL(10, 2) NOT NULL,
  max_discount DECIMAL(10, 2) NOT NULL,
  description VARCHAR(255) NOT NULL,
  expiry_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(50) PRIMARY KEY,
  customer_id INT NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  gst DECIMAL(10, 2) NOT NULL,
  delivery_charge DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) DEFAULT 0.00,
  coupon_code VARCHAR(50) NULL,
  total DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'cooking', 'delivered', 'cancelled') DEFAULT 'pending',
  payment_method ENUM('cod', 'upi', 'online') NOT NULL,
  payment_status ENUM('Pending', 'Paid', 'Failed') DEFAULT 'Pending',
  transaction_id VARCHAR(100) NULL,
  delivery_address TEXT NOT NULL,
  landmark VARCHAR(150) NOT NULL,
  coords VARCHAR(100) NULL,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Order Items Table (Relationship)
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(50) NOT NULL,
  menu_item_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Table Reservations Table
CREATE TABLE IF NOT EXISTS reservations (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  members INT NOT NULL,
  reservation_date DATE NOT NULL,
  reservation_time VARCHAR(20) NOT NULL,
  special_requests TEXT NULL,
  status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'confirmed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Customer Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Administrators Table
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'owner',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================================================
-- PRE-SEEDING CATEGORIES METADATA
-- ==========================================================================
INSERT INTO categories (id, name, icon, emoji) VALUES
('veg-starters', 'Veg Starters', 'fa-leaf', '🥗'),
('non-veg-curry', 'Non-Veg Curry', 'fa-drumstick-bite', '🍗'),
('veg-curry', 'Veg Curry', 'fa-carrot', '🥘'),
('biryani', 'Biryani', 'fa-bowl-rice', '🍚'),
('mandi', 'Mandi', 'fa-fire', '🔥'),
('rice', 'Rice', 'fa-bowl-rice', '🍛'),
('tandoori', 'Tandoori', 'fa-fire-flame-curved', '🍖'),
('fry-items', 'Fry Items', 'fa-utensils', '🍳'),
('fish', 'Fish', 'fa-fish', '🐟'),
('prawns', 'Prawns', 'fa-shrimp', '🦐'),
('egg', 'Egg', 'fa-egg', '🥚'),
('soups', 'Soups', 'fa-mug-hot', '🍲'),
('desserts', 'Desserts', 'fa-ice-cream', '🍨'),
('drinks', 'Drinks', 'fa-glass-water', '🥤');

-- ==========================================================================
-- SEED DEFAULT SYSTEM ADMINISTRATOR
-- ==========================================================================
-- Default login: admin / adhiratha2024
INSERT INTO admins (username, password, role) VALUES
('admin', '$2a$10$e0myzXy7sU/0j1W8wK7zH.17v6Y7O3c9yD7H/9J472462j4d7yG/q', 'owner');
