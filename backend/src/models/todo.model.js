const { query } = require('../config/db');

const todoSelect =
  'SELECT id, user_id, title, priority, is_done, due_date, position, created_at, updated_at FROM todos';

const PRIORITY_ORDER = "FIELD(priority, 'urgent', 'high', 'medium', 'low')";

const findAllForUser = async (userId) => {
  const rows = await query(
    `${todoSelect} WHERE user_id = ? ORDER BY is_done ASC, ${PRIORITY_ORDER} ASC, position ASC, created_at ASC`,
    [userId]
  );
  return rows;
};

const findById = async (id, userId) => {
  const rows = await query(`${todoSelect} WHERE id = ? AND user_id = ? LIMIT 1`, [id, userId]);
  return rows[0] || null;
};

const nextPosition = async (userId) => {
  const rows = await query('SELECT COALESCE(MAX(position), -1) + 1 AS next_position FROM todos WHERE user_id = ?', [
    userId
  ]);
  return rows[0].next_position;
};

const create = async (userId, data) => {
  const position = await nextPosition(userId);

  const result = await query(
    `INSERT INTO todos (user_id, title, priority, is_done, due_date, position)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, data.title, data.priority || 'medium', data.is_done ? 1 : 0, data.due_date || null, position]
  );

  return findById(result.insertId, userId);
};

const update = async (id, userId, data) => {
  const fields = [];
  const params = [];

  if (typeof data.title !== 'undefined') {
    fields.push('title = ?');
    params.push(data.title);
  }

  if (typeof data.priority !== 'undefined') {
    fields.push('priority = ?');
    params.push(data.priority);
  }

  if (typeof data.is_done !== 'undefined') {
    fields.push('is_done = ?');
    params.push(data.is_done ? 1 : 0);
  }

  if (typeof data.due_date !== 'undefined') {
    fields.push('due_date = ?');
    params.push(data.due_date || null);
  }

  if (!fields.length) {
    return findById(id, userId);
  }

  params.push(id, userId);
  await query(`UPDATE todos SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`, params);

  return findById(id, userId);
};

const remove = async (id, userId) => {
  await query('DELETE FROM todos WHERE id = ? AND user_id = ?', [id, userId]);
};

const clearCompleted = async (userId) => {
  await query('DELETE FROM todos WHERE user_id = ? AND is_done = 1', [userId]);
};

const summary = async (userId) => {
  const rows = await query(
    'SELECT COUNT(*) AS total, SUM(is_done = 0) AS open FROM todos WHERE user_id = ?',
    [userId]
  );
  return {
    total: Number(rows[0].total) || 0,
    open: Number(rows[0].open) || 0
  };
};

module.exports = { findAllForUser, findById, create, update, remove, clearCompleted, summary };
