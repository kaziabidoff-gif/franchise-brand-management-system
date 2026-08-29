const { query } = require('../config/db');

const buildFilters = (filters = {}) => {
  const where = [];
  const params = [];

  if (filters.entityType) {
    where.push('a.entity_type = ?');
    params.push(filters.entityType);
  }

  if (filters.branchId) {
    where.push('a.entity_id = ?');
    params.push(Number(filters.branchId));
  }

  if (filters.search) {
    where.push('(a.description LIKE ? OR a.action LIKE ? OR u.name LIKE ?)');
    const value = `%${filters.search}%`;
    params.push(value, value, value);
  }

  return {
    whereSql: where.length ? `WHERE ${where.join(' AND ')}` : '',
    params
  };
};

const findAll = async (filters = {}, pagination = {}) => {
  const { whereSql, params } = buildFilters(filters);

  const totalRows = await query(
    `SELECT COUNT(*) AS total
     FROM activities a
     LEFT JOIN users u ON u.id = a.actor_id
     ${whereSql}`,
    params
  );

  const safeLimit = Number.isInteger(pagination.limit) ? pagination.limit : parseInt(pagination.limit, 10) || 10;
  const safeOffset = Number.isInteger(pagination.offset) ? pagination.offset : parseInt(pagination.offset, 10) || 0;

  const rows = await query(
    `SELECT a.id, a.entity_type, a.entity_id AS branch_id, a.action, a.description, a.created_at,
      u.name AS actor_name
     FROM activities a
     LEFT JOIN users u ON u.id = a.actor_id
     ${whereSql}
     ORDER BY a.created_at DESC
     LIMIT ${safeLimit} OFFSET ${safeOffset}`,
    params
  );

  return {
    rows,
    total: totalRows[0].total
  };
};

module.exports = { findAll };
