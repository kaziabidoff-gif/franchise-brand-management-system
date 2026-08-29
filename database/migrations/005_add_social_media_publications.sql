-- Migration: add social media publication tracking to campaigns.
-- Additive only — safe to run on an existing database without losing data.
--
-- Usage:
--   mysql -u root -p fbms < database/migrations/005_add_social_media_publications.sql

USE fbms;

CREATE TABLE IF NOT EXISTS social_media_publications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  campaign_id INT NOT NULL,
  platform ENUM('Facebook', 'Instagram', 'YouTube') NOT NULL,
  title VARCHAR(255) NOT NULL,
  post_url VARCHAR(500) NOT NULL,
  insights_url VARCHAR(500) NOT NULL,
  published_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_social_media_publications_campaign
    FOREIGN KEY (campaign_id)
    REFERENCES campaigns(id)
    ON DELETE CASCADE,

  INDEX idx_social_media_publications_campaign (campaign_id),
  INDEX idx_social_media_publications_platform (platform),
  INDEX idx_social_media_publications_published_at (published_at)
);