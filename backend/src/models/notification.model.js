const { query } = require('../config/db');

const findAll = async (userId, pagination = {}) => {
  const limit = Number(pagination.limit) || 10;
  const offset = Number(pagination.offset) || 0;

  const totalRows = await query(
    'SELECT COUNT(*) AS total FROM notifications WHERE user_id = ?',
    [userId]
  );

  const rows = await query(
    `SELECT id, title, message, type, is_read, created_at
     FROM notifications
     WHERE user_id = ?
     ORDER BY created_at DESC
     LIMIT ${limit} OFFSET ${offset}`,
    [userId]
  );

  return {
    rows,
    total: totalRows[0].total
  };
};

const unreadCount = async (userId) => {
  const rows = await query('SELECT COUNT(*) AS total FROM notifications WHERE user_id = ? AND is_read = 0', [userId]);
  return rows[0].total;
};

const create = async (data) => {
  const result = await query(
    `INSERT INTO notifications (user_id, title, message, type, is_read)
     VALUES (?, ?, ?, ?, ?)`,
    [data.user_id, data.title, data.message, data.type || 'info', data.is_read ? 1 : 0]
  );

  const rows = await query('SELECT id, title, message, type, is_read, created_at FROM notifications WHERE id = ?', [
    result.insertId
  ]);
  return rows[0];
};

const markRead = async (id, userId) => {
  await query('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?', [id, userId]);
};

const markAllRead = async (userId) => {
  await query('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [userId]);
};

module.exports = { findAll, unreadCount, create, markRead, markAllRead };
