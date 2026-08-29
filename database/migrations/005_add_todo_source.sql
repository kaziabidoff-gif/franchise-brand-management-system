-- Migration: add source_type/source_id to todos so a to-do can optionally be
-- linked back to the record that created it (e.g. a customization request
-- assigned to a designer), instead of building a second, separate task table.
-- Additive only — safe to run on an existing database without losing data.
--
-- Usage:
--   mysql -u root -p fbms < database/migrations/005_add_todo_source.sql

USE fbms;

ALTER TABLE todos
  ADD COLUMN source_type VARCHAR(30) NULL AFTER due_date,
  ADD COLUMN source_id INT NULL AFTER source_type;

ALTER TABLE todos
  ADD INDEX idx_todos_source (source_type, source_id);
