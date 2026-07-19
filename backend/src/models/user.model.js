const { query } = require('../config/db');

const userSelect = `
  SELECT u.id, u.role_id, u.branch_id, u.name, u.email, u.phone, u.avatar_url,
    u.status, u.last_login, u.created_at, u.updated_at,
    r.name AS role_name, r.slug AS role_slug,
    b.name AS branch_name
  FROM users u
  INNER JOIN roles r ON r.id = u.role_id
  LEFT JOIN branches b ON b.id = u.branch_id
`;

const buildFilters = (filters) => {
  const where = [];
  const params = [];

  if (filters.search) {
    where.push('(u.name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)');
    const search = `%${filters.search}%`;
    params.push(search, search, search);
  }

  if (filters.status) {
    where.push('u.status = ?');
    params.push(filters.status);
  }

  if (filters.roleId) {
    where.push('u.role_id = ?');
    params.push(Number(filters.roleId));
  }

  if (filters.branchId) {
    where.push('u.branch_id = ?');
    params.push(Number(filters.branchId));
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
     FROM users u
     INNER JOIN roles r ON r.id = u.role_id
     LEFT JOIN branches b ON b.id = u.branch_id
     ${whereSql}`,
    params
  );
  const rows = await query(
    `${userSelect}
     ${whereSql}
     ORDER BY u.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, pagination.limit, pagination.offset]
  );

  return { rows, total: totalRows[0].total };
};

const findById = async (id) => {
  const rows = await query(`${userSelect} WHERE u.id = ? LIMIT 1`, [id]);
  return rows[0] || null;
};

const findByEmail = async (email) => {
  const rows = await query(
    `SELECT u.id, u.role_id, u.branch_id, u.name, u.email, u.password_hash, u.phone,
      u.avatar_url, u.status, u.last_login, u.created_at, u.updated_at,
      r.name AS role_name, r.slug AS role_slug,
      b.name AS branch_name
     FROM users u
     INNER JOIN roles r ON r.id = u.role_id
     LEFT JOIN branches b ON b.id = u.branch_id
     WHERE u.email = ? LIMIT 1`,
    [email]
  );
  return rows[0] || null;
};

const create = async (data) => {
  const result = await query(
    `INSERT INTO users
      (role_id, branch_id, name, email, password_hash, phone, avatar_url, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.role_id,
      data.branch_id || null,
      data.name,
      data.email,
      data.password_hash,
      data.phone || null,
      data.avatar_url || null,
      data.status || 'active'
    ]
  );

  return findById(result.insertId);
};

const update = async (id, data) => {
  const fields = [];
  const params = [];

  [
    'role_id',
    'branch_id',
    'name',
    'email',
    'phone',
    'avatar_url',
    'status',
    'password_hash'
  ].forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(data, field)) {
      fields.push(`${field} = ?`);
      params.push(data[field] || null);
    }
  });

  if (!fields.length) {
    return findById(id);
  }

  await query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, [...params, id]);
  return findById(id);
};

const remove = async (id) => {
  await query('DELETE FROM users WHERE id = ?', [id]);
};

const updateLastLogin = (id) => query('UPDATE users SET last_login = NOW() WHERE id = ?', [id]);

module.exports = { findAll, findById, findByEmail, create, update, remove, updateLastLogin };
