const { query } = require('../config/db');

const branchSelect = `
  SELECT b.id, b.code, b.name, b.location, b.address, b.city, b.country,
    b.phone, b.email, b.status, b.manager_id, b.created_at, b.updated_at,
    u.name AS manager_name
  FROM branches b
  LEFT JOIN users u ON u.id = b.manager_id
`;

const buildFilters = (filters) => {
  const where = [];
  const params = [];

  if (filters.search) {
    where.push('(b.name LIKE ? OR b.code LIKE ? OR b.city LIKE ? OR b.location LIKE ?)');
    const search = `%${filters.search}%`;
    params.push(search, search, search, search);
  }

  if (filters.status) {
    where.push('b.status = ?');
    params.push(filters.status);
  }

  return {
    whereSql: where.length ? `WHERE ${where.join(' AND ')}` : '',
    params
  };
};

const findAll = async (filters, pagination) => {
  const { whereSql, params } = buildFilters(filters);

  const totalRows = await query(
    `SELECT COUNT(*) AS total
     FROM branches b
     ${whereSql}`,
    params
  );

  // mysql2's pool.execute() (prepared statements) does not reliably support
  // LIMIT/OFFSET as placeholders. limit/offset are already sanitized to
  // integers in getPagination(), so it's safe to inline them directly.
  const safeLimit = Number.isInteger(pagination.limit) ? pagination.limit : parseInt(pagination.limit, 10) || 10;
  const safeOffset = Number.isInteger(pagination.offset) ? pagination.offset : parseInt(pagination.offset, 10) || 0;

  const sql = `
    ${branchSelect}
    ${whereSql}
    ORDER BY b.created_at DESC
    LIMIT ${safeLimit} OFFSET ${safeOffset}
  `;

  const rows = await query(sql, params);

  return {
    rows,
    total: totalRows[0].total
  };
};

const findOptions = () => query('SELECT id, name, code FROM branches ORDER BY name ASC');

const findById = async (id) => {
  const rows = await query(`${branchSelect} WHERE b.id = ? LIMIT 1`, [id]);
  return rows[0] || null;
};

const create = async (data) => {
  const result = await query(
    `INSERT INTO branches
      (code, name, location, address, city, country, phone, email, status, manager_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.code,
      data.name,
      data.location,
      data.address || null,
      data.city,
      data.country || 'Bangladesh',
      data.phone || null,
      data.email || null,
      data.status || 'active',
      data.manager_id || null
    ]
  );

  return findById(result.insertId);
};

const update = async (id, data) => {
  const fields = [];
  const params = [];

  ['code', 'name', 'location', 'address', 'city', 'country', 'phone', 'email', 'status', 'manager_id'].forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(data, field)) {
      fields.push(`${field} = ?`);
      params.push(data[field] || null);
    }
  });

  if (!fields.length) {
    return findById(id);
  }

  await query(`UPDATE branches SET ${fields.join(', ')} WHERE id = ?`, [...params, id]);
  return findById(id);
};

const remove = async (id) => {
  await query('DELETE FROM branches WHERE id = ?', [id]);
};

module.exports = { findAll, findOptions, findById, create, update, remove };
