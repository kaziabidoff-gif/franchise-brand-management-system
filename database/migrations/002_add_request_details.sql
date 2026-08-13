-- Migration: add category, due_date, reference_url and the "needs_revision" status
-- to customization_requests. Additive only — safe to run on an existing database
-- without losing data. Run this once per environment (local DB, teammates' DBs, etc).
--
-- Usage:
--   mysql -u root -p fbms < database/migrations/002_add_request_details.sql

USE fbms;

ALTER TABLE customization_requests
  ADD COLUMN category VARCHAR(100) NULL AFTER description,
  ADD COLUMN due_date DATE NULL AFTER category,
  ADD COLUMN reference_url VARCHAR(255) NULL AFTER asset_id;

ALTER TABLE customization_requests
  MODIFY status ENUM('pending', 'in_review', 'approved', 'rejected', 'needs_revision')
  NOT NULL DEFAULT 'pending';
