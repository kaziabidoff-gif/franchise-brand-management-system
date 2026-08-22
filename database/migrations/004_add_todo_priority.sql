-- Migration: add a priority column to todos so the dashboard to-do list can be
-- sorted by priority first, then by order of addition. Additive only — safe to
-- run on an existing database without losing data.
--
-- Usage:
--   mysql -u root -p fbms < database/migrations/004_add_todo_priority.sql

USE fbms;

ALTER TABLE todos
  ADD COLUMN priority ENUM('low', 'medium', 'high', 'urgent') NOT NULL DEFAULT 'medium' AFTER title;

ALTER TABLE todos
  ADD INDEX idx_todos_user_priority (user_id, priority);
