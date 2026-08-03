const path = require('path');
const fs = require('fs');
const { query } = require('../config/db');
const { parseJson } = require('../utils/serializers');
const { env } = require('../config/env');

const assetSelect = `
  SELECT a.id, a.title, a.description, a.category, a.asset_type, a.file_url,
    a.thumbnail_url, a.version, a.status, a.tags, a.branch_id, a.uploaded_by,
    a.created_at, a.updated_at, u.name AS uploaded_by_name, b.name AS branch_name
  FROM brand_assets a
  LEFT JOIN users u ON u.id = a.uploaded_by
  LEFT JOIN branches b ON b.id = a.branch_id
`;

const normalizeAsset = (asset) => (asset ? { ...asset, tags: parseJson(asset.tags) } : null);

const buildFilters = (filters) => {
  const where = [];
  const params = [];

  if (filters.search) {
    where.push('(a.title LIKE ? OR a.description LIKE ? OR a.tags LIKE ?)');
    const search = `%${filters.search}%`;
    params.push(search, search, search);
  }

  if (filters.category) {
    where.push('a.category = ?');
    params.push(filters.category);
  }

  if (filters.status) {
    where.push('a.status = ?');
    params.push(filters.status);
  }

  if (filters.branchId) {
    where.push('(a.branch_id = ? OR a.branch_id IS NULL)');
    params.push(Number(filters.branchId));
  }

  return {
    whereSql: where.length ? `WHERE ${where.join(' AND ')}` : '',
    params
  };
};

const findAll = async (filters, pagination) => {
  const { whereSql, params } = buildFilters(filters);
  const totalRows = await query(`SELECT COUNT(*) AS total FROM brand_assets a ${whereSql}`, params);
  const limit = Number.parseInt(pagination.limit, 10) || 10;
  const offset = Number.parseInt(pagination.offset, 10) || 0;

  const rows = await query(
    
  `${assetSelect}
  ${whereSql}
  ORDER BY a.created_at DESC
  LIMIT ${limit} OFFSET ${offset}`,
  params
);
  
  return { rows: rows.map(normalizeAsset), total: totalRows[0].total };
};

const findOptions = () => query('SELECT id, title, category, version FROM brand_assets ORDER BY title ASC');

const findById = async (id) => {
  const rows = await query(`${assetSelect} WHERE a.id = ? LIMIT 1`, [id]);
  return normalizeAsset(rows[0]);
};

const create = async (data) => {
  const result = await query(
    `INSERT INTO brand_assets
      (title, description, category, asset_type, file_url, thumbnail_url, version, status, tags, branch_id, uploaded_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.title,
      data.description || null,
      data.category,
      data.asset_type || 'document',
      data.file_url,
      data.thumbnail_url || null,
      data.version || '1.0',
      data.status || 'active',
      JSON.stringify(data.tags || []),
      data.branch_id || null,
      data.uploaded_by || null
    ]
  );

  return findById(result.insertId);
};

const update = async (id, data) => {
  const fields = [];
  const params = [];

  ['title', 'description', 'category', 'asset_type', 'file_url', 'thumbnail_url', 'version', 'status', 'branch_id'].forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(data, field)) {
      fields.push(`${field} = ?`);
      params.push(data[field] || null);
    }
  });

  if (Object.prototype.hasOwnProperty.call(data, 'tags')) {
    fields.push('tags = ?');
    params.push(JSON.stringify(data.tags || []));
  }

  if (!fields.length) {
    return findById(id);
  }

  await query(`UPDATE brand_assets SET ${fields.join(', ')} WHERE id = ?`, [...params, id]);
  return findById(id);
};

const remove = async (id) => {
  await query('DELETE FROM brand_assets WHERE id = ?', [id]);
};

const getLocalFilePath = (fileUrl) => {
  if (!fileUrl?.startsWith('/uploads/')) {
    return null;
  }

  const filePath = path.join(env.uploadDir, path.basename(fileUrl));
  return fs.existsSync(filePath) ? filePath : null;
};

module.exports = { findAll, findOptions, findById, create, update, remove, getLocalFilePath };
