const { query } = require('../config/db');

const requestSelect = `
  SELECT cr.id, cr.title, cr.description, cr.category, cr.due_date, cr.branch_id, cr.requested_by,
    cr.assigned_to, cr.asset_id, cr.reference_url, cr.status, cr.priority, cr.response,
    cr.created_at, cr.updated_at,
    b.name AS branch_name,
    requester.name AS requested_by_name,
    assignee.name AS assigned_to_name,
    a.title AS asset_title
  FROM customization_requests cr
  LEFT JOIN branches b ON b.id = cr.branch_id
  LEFT JOIN users requester ON requester.id = cr.requested_by
  LEFT JOIN users assignee ON assignee.id = cr.assigned_to
  LEFT JOIN brand_assets a ON a.id = cr.asset_id
`;

const buildFilters = (filters) => {
  const where = [];
  const params = [];

  if (filters.search) {
    where.push('(cr.title LIKE ? OR cr.description LIKE ? OR cr.response LIKE ?)');
    const search = `%${filters.search}%`;
    params.push(search, search, search);
  }

  if (filters.status) {
    where.push('cr.status = ?');
    params.push(filters.status);
  }

  if (filters.priority) {
    where.push('cr.priority = ?');
    params.push(filters.priority);
  }

  if (filters.category) {
    where.push('cr.category = ?');
    params.push(filters.category);
  }

  if (filters.branchId) {
    where.push('cr.branch_id = ?');
    params.push(Number(filters.branchId));
  }

  return {
    whereSql: where.length ? `WHERE ${where.join(' AND ')}` : '',
    params
  };
};

const findAll = async (filters, pagination) => {
  const { whereSql, params } = buildFilters(filters);
  const totalRows = await query(`SELECT COUNT(*) AS total FROM customization_requests cr ${whereSql}`, params);
  const rows = await query(
    `${requestSelect}
     ${whereSql}
     ORDER BY cr.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, pagination.limit, pagination.offset]
  );

  return { rows, total: totalRows[0].total };
};

const findById = async (id) => {
  const rows = await query(`${requestSelect} WHERE cr.id = ? LIMIT 1`, [id]);
  return rows[0] || null;
};

const create = async (data) => {
  const result = await query(
    `INSERT INTO customization_requests
      (title, description, category, due_date, branch_id, requested_by, assigned_to, asset_id, reference_url, status, priority, response)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.title,
      data.description,
      data.category || null,
      data.due_date || null,
      data.branch_id,
      data.requested_by || null,
      data.assigned_to || null,
      data.asset_id || null,
      data.reference_url || null,
      data.status || 'pending',
      data.priority || 'medium',
      data.response || null
    ]
  );

  return findById(result.insertId);
};

const update = async (id, data) => {
  const fields = [];
  const params = [];

  ['title', 'description', 'category', 'due_date', 'branch_id', 'assigned_to', 'asset_id', 'reference_url', 'status', 'priority', 'response'].forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(data, field)) {
      fields.push(`${field} = ?`);
      params.push(data[field] || null);
    }
  });

  if (!fields.length) {
    return findById(id);
  }

  await query(`UPDATE customization_requests SET ${fields.join(', ')} WHERE id = ?`, [...params, id]);
  return findById(id);
};

const remove = async (id) => {
  await query('DELETE FROM customization_requests WHERE id = ?', [id]);
};

module.exports = { findAll, findById, create, update, remove };
