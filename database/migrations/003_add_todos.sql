-- Migration: add todos table for the per-account dashboard to-do list.
-- Additive only — safe to run on an existing database without losing data.
-- Run this once per environment (local DB, teammates' DBs, etc).
--
-- Usage:
--   mysql -u root -p fbms < database/migrations/003_add_todos.sql

USE fbms;

CREATE TABLE IF NOT EXISTS todos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  is_done TINYINT(1) NOT NULL DEFAULT 0,
  due_date DATE NULL,
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_todos_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_todos_user_done (user_id, is_done),
  INDEX idx_todos_user_position (user_id, position)
);
