CREATE DATABASE IF NOT EXISTS fbms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE fbms;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS activities;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS todos;
DROP TABLE IF EXISTS customization_requests;
DROP TABLE IF EXISTS campaign_assets;
DROP TABLE IF EXISTS campaign_branches;
DROP TABLE IF EXISTS campaigns;
DROP TABLE IF EXISTS brand_guidelines;
DROP TABLE IF EXISTS brand_assets;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS branches;
DROP TABLE IF EXISTS roles;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE branches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(30) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL,
  location VARCHAR(150) NOT NULL,
  address VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL DEFAULT 'Bangladesh',
  phone VARCHAR(40),
  email VARCHAR(150),
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  manager_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_branches_status (status),
  INDEX idx_branches_city (city)
);

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role_id INT NOT NULL,
  branch_id INT NULL,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(40),
  avatar_url VARCHAR(255),
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  last_login DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id),
  CONSTRAINT fk_users_branch FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
  INDEX idx_users_status (status),
  INDEX idx_users_role (role_id),
  INDEX idx_users_branch (branch_id)
);

ALTER TABLE branches
  ADD CONSTRAINT fk_branches_manager FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL;

CREATE TABLE brand_assets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  asset_type ENUM('image', 'document', 'video', 'template', 'logo', 'other') NOT NULL DEFAULT 'document',
  file_url VARCHAR(255) NOT NULL,
  thumbnail_url VARCHAR(255),
  version VARCHAR(40) NOT NULL DEFAULT '1.0',
  status ENUM('active', 'archived', 'draft') NOT NULL DEFAULT 'active',
  tags JSON,
  branch_id INT NULL,
  uploaded_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_assets_branch FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
  CONSTRAINT fk_assets_uploaded_by FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_assets_category (category),
  INDEX idx_assets_status (status),
  INDEX idx_assets_branch (branch_id)
);

CREATE TABLE campaigns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget DECIMAL(12, 2) NOT NULL DEFAULT 0,
  status ENUM('draft', 'scheduled', 'active', 'completed', 'cancelled') NOT NULL DEFAULT 'draft',
  created_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_campaigns_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_campaigns_status (status),
  INDEX idx_campaigns_dates (start_date, end_date)
);

CREATE TABLE campaign_branches (
  campaign_id INT NOT NULL,
  branch_id INT NOT NULL,
  PRIMARY KEY (campaign_id, branch_id),
  CONSTRAINT fk_campaign_branches_campaign FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
  CONSTRAINT fk_campaign_branches_branch FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE
);

CREATE TABLE campaign_assets (
  campaign_id INT NOT NULL,
  asset_id INT NOT NULL,
  PRIMARY KEY (campaign_id, asset_id),
  CONSTRAINT fk_campaign_assets_campaign FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
  CONSTRAINT fk_campaign_assets_asset FOREIGN KEY (asset_id) REFERENCES brand_assets(id) ON DELETE CASCADE
);

CREATE TABLE brand_guidelines (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  content LONGTEXT NOT NULL,
  version VARCHAR(40) NOT NULL DEFAULT '1.0',
  status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
  published_by INT NULL,
  published_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_guidelines_published_by FOREIGN KEY (published_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_guidelines_status (status)
);

CREATE TABLE customization_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NULL,
  due_date DATE NULL,
  branch_id INT NOT NULL,
  requested_by INT NULL,
  assigned_to INT NULL,
  asset_id INT NULL,
  reference_url VARCHAR(255) NULL,
  status ENUM('pending', 'in_review', 'approved', 'rejected', 'needs_revision') NOT NULL DEFAULT 'pending',
  priority ENUM('low', 'medium', 'high', 'urgent') NOT NULL DEFAULT 'medium',
  response TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_requests_branch FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
  CONSTRAINT fk_requests_requested_by FOREIGN KEY (requested_by) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_requests_assigned_to FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_requests_asset FOREIGN KEY (asset_id) REFERENCES brand_assets(id) ON DELETE SET NULL,
  INDEX idx_requests_status (status),
  INDEX idx_requests_priority (priority),
  INDEX idx_requests_branch (branch_id)
);

CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(180) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('info', 'success', 'warning', 'error') NOT NULL DEFAULT 'info',
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_notifications_user_read (user_id, is_read),
  INDEX idx_notifications_created_at (created_at)
);

CREATE TABLE activities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  actor_id INT NULL,
  entity_type VARCHAR(80) NOT NULL,
  entity_id INT NULL,
  action VARCHAR(80) NOT NULL,
  description VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_activities_actor FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_activities_created_at (created_at),
  INDEX idx_activities_entity (entity_type, entity_id)
);

CREATE TABLE todos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  priority ENUM('low', 'medium', 'high', 'urgent') NOT NULL DEFAULT 'medium',
  is_done TINYINT(1) NOT NULL DEFAULT 0,
  due_date DATE NULL,
  source_type VARCHAR(30) NULL,
  source_id INT NULL,
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_todos_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_todos_user_done (user_id, is_done),
  INDEX idx_todos_user_position (user_id, position),
  INDEX idx_todos_user_priority (user_id, priority),
  INDEX idx_todos_source (source_type, source_id)
);
