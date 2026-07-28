const { query, getConnection } = require('../config/db');
const { toIntArray } = require('../utils/serializers');

const campaignSelect = `
  SELECT c.id, c.name, c.description, c.start_date, c.end_date, c.budget, c.status,
    c.created_by, c.created_at, c.updated_at, u.name AS created_by_name,
    COUNT(DISTINCT cb.branch_id) AS branches_count,
    COUNT(DISTINCT ca.asset_id) AS assets_count
  FROM campaigns c
  LEFT JOIN users u ON u.id = c.created_by
  LEFT JOIN campaign_branches cb ON cb.campaign_id = c.id
  LEFT JOIN campaign_assets ca ON ca.campaign_id = c.id
`;

const buildFilters = (filters) => {
  const where = [];
  const params = [];

  if (filters.search) {
    where.push('(c.name LIKE ? OR c.description LIKE ?)');
    const search = `%${filters.search}%`;
    params.push(search, search);
  }

  if (filters.status) {
    where.push('c.status = ?');
    params.push(filters.status);
  }

  if (filters.branchId) {
    where.push('EXISTS (SELECT 1 FROM campaign_branches cb_filter WHERE cb_filter.campaign_id = c.id AND cb_filter.branch_id = ?)');
    params.push(Number(filters.branchId));
  }

  return {
    whereSql: where.length ? `WHERE ${where.join(' AND ')}` : '',
    params
  };
};

const findAll = async (filters, pagination) => {
  const { whereSql, params } = buildFilters(filters);

  console.log("\n========== CAMPAIGN DEBUG ==========");
  console.log("WHERE SQL:", whereSql);
  console.log("PARAMS:", params);
  console.log("PAGINATION:", pagination);
  console.log("QUERY PARAMS:", [...params, pagination.limit, pagination.offset]);
  console.log("====================================\n");

  const totalRows = await query(
    `SELECT COUNT(*) AS total FROM campaigns c ${whereSql}`,
    params
  );

  const rows = await query(
    `${campaignSelect}
   ${whereSql}
   GROUP BY c.id
   ORDER BY c.created_at DESC
   LIMIT ${Number(pagination.limit)}
   OFFSET ${Number(pagination.offset)}`,
    params
  );

  return {
    rows,
    total: totalRows[0].total
  };
};
const findOptions = () => query('SELECT id, name, status FROM campaigns ORDER BY name ASC');

const findById = async (id) => {
  const rows = await query(`${campaignSelect} WHERE c.id = ? GROUP BY c.id LIMIT 1`, [id]);

  if (!rows.length) {
    return null;
  }

  const [branches, assets] = await Promise.all([
    query(
      `SELECT b.id, b.name, b.code
       FROM campaign_branches cb
       INNER JOIN branches b ON b.id = cb.branch_id
       WHERE cb.campaign_id = ?
       ORDER BY b.name ASC`,
      [id]
    ),
    query(
      `SELECT a.id, a.title, a.category, a.version
       FROM campaign_assets ca
       INNER JOIN brand_assets a ON a.id = ca.asset_id
       WHERE ca.campaign_id = ?
       ORDER BY a.title ASC`,
      [id]
    )
  ]);

  return { ...rows[0], branches, assets };
};

const syncRelations = async (connection, campaignId, branchIds, assetIds) => {
  await connection.execute('DELETE FROM campaign_branches WHERE campaign_id = ?', [campaignId]);
  await connection.execute('DELETE FROM campaign_assets WHERE campaign_id = ?', [campaignId]);

  for (const branchId of toIntArray(branchIds)) {
    await connection.execute(
      'INSERT INTO campaign_branches (campaign_id, branch_id) VALUES (?, ?)',
      [campaignId, branchId]
    );
  }

  for (const assetId of toIntArray(assetIds)) {
    await connection.execute(
      'INSERT INTO campaign_assets (campaign_id, asset_id) VALUES (?, ?)',
      [campaignId, assetId]
    );
  }
};

const create = async (data) => {
  const connection = await getConnection();

  try {
    await connection.beginTransaction();
    const [result] = await connection.execute(
      `INSERT INTO campaigns
        (name, description, start_date, end_date, budget, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.description || null,
        data.start_date,
        data.end_date,
        data.budget || 0,
        data.status || 'draft',
        data.created_by || null
      ]
    );

    await syncRelations(connection, result.insertId, data.branch_ids, data.asset_ids);
    await connection.commit();
    return findById(result.insertId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const update = async (id, data) => {
  const connection = await getConnection();

  try {
    await connection.beginTransaction();

    const fields = [];
    const params = [];
    ['name', 'description', 'start_date', 'end_date', 'budget', 'status'].forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(data, field)) {
        fields.push(`${field} = ?`);
        params.push(data[field] ?? null);
      }
    });

    if (fields.length) {
      await connection.execute(`UPDATE campaigns SET ${fields.join(', ')} WHERE id = ?`, [...params, id]);
    }

    if (Object.prototype.hasOwnProperty.call(data, 'branch_ids') || Object.prototype.hasOwnProperty.call(data, 'asset_ids')) {
      const existing = await findById(id);
      await syncRelations(
        connection,
        id,
        Object.prototype.hasOwnProperty.call(data, 'branch_ids') ? data.branch_ids : existing.branches.map((branch) => branch.id),
        Object.prototype.hasOwnProperty.call(data, 'asset_ids') ? data.asset_ids : existing.assets.map((asset) => asset.id)
      );
    }

    await connection.commit();
    return findById(id);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const remove = async (id) => {
  await query('DELETE FROM campaigns WHERE id = ?', [id]);
};

module.exports = { findAll, findOptions, findById, create, update, remove };
