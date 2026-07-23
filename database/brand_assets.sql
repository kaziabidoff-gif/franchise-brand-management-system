USE fbms;

CREATE TABLE IF NOT EXISTS brand_assets (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT NULL,
  category VARCHAR(100) NOT NULL,
  asset_type VARCHAR(50) NOT NULL DEFAULT 'document',
  file_url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500) NULL,
  version VARCHAR(50) NOT NULL DEFAULT '1.0',
  status ENUM('active', 'archived', 'draft') NOT NULL DEFAULT 'draft',
  tags JSON NULL,
  branch_id BIGINT UNSIGNED NULL,
  uploaded_by BIGINT UNSIGNED NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_brand_assets_title (title),
  INDEX idx_brand_assets_category (category),
  INDEX idx_brand_assets_status (status),
  INDEX idx_brand_assets_branch_id (branch_id),
  INDEX idx_brand_assets_uploaded_by (uploaded_by)
);