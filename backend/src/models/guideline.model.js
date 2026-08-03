const { query } = require('../config/db');

const guidelineSelect = `
  SELECT g.id, g.title, g.content, g.version, g.status, g.published_by,
    g.published_at, g.created_at, g.updated_at, u.name AS published_by_name
  FROM brand_guidelines g
  LEFT JOIN users u ON u.id = g.published_by
`;

const findAll = async (filters, pagination) => {
  const where = [];
  const params = [];

  if (filters.search) {
    where.push('(g.title LIKE ? OR g.content LIKE ?)');
    const search = `%${filters.search}%`;
    params.push(search, search);
  }

  if (filters.status) {
    where.push('g.status = ?');
    params.push(filters.status);
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const totalRows = await query(`SELECT COUNT(*) AS total FROM brand_guidelines g ${whereSql}`, params);

  // mysql2's pool.execute() does not reliably support LIMIT/OFFSET as
  // placeholders. Values are already sanitized to integers in getPagination().
  const safeLimit = Number.isInteger(pagination.limit) ? pagination.limit : parseInt(pagination.limit, 10) || 10;
  const safeOffset = Number.isInteger(pagination.offset) ? pagination.offset : parseInt(pagination.offset, 10) || 0;

  const rows = await query(
    `${guidelineSelect}
     ${whereSql}
     ORDER BY g.updated_at DESC
     LIMIT ${safeLimit} OFFSET ${safeOffset}`,
    params
  );

  return { rows, total: totalRows[0].total };
};

const findById = async (id) => {
  const rows = await query(`${guidelineSelect} WHERE g.id = ? LIMIT 1`, [id]);
  return rows[0] || null;
};

const create = async (data) => {
  const result = await query(
    `INSERT INTO brand_guidelines (title, content, version, status, published_by, published_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      data.title,
      data.content,
      data.version || '1.0',
      data.status || 'draft',
      data.status === 'published' ? data.published_by : null,
      data.status === 'published' ? new Date() : null
    ]
  );

  return findById(result.insertId);
};

const update = async (id, data) => {
  const fields = [];
  const params = [];

  ['title', 'content', 'version', 'status'].forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(data, field)) {
      fields.push(`${field} = ?`);
      params.push(data[field]);
    }
  });

  if (!fields.length) {
    return findById(id);
  }

  await query(`UPDATE brand_guidelines SET ${fields.join(', ')} WHERE id = ?`, [...params, id]);
  return findById(id);
};

const publish = async (id, userId) => {
  await query(
    `UPDATE brand_guidelines
     SET status = 'published', published_by = ?, published_at = NOW()
     WHERE id = ?`,
    [userId, id]
  );

  return findById(id);
};

const remove = async (id) => {
  await query('DELETE FROM brand_guidelines WHERE id = ?', [id]);
};

module.exports = { findAll, findById, create, update, publish, remove };
