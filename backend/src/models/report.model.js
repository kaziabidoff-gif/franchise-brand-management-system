const { query } = require('../config/db');

const grouped = (sql, params = []) => query(sql, params);

const getReports = async () => {
  const [requestStatuses, campaignStatuses, assetCategories, branchActivity, totals] = await Promise.all([
    grouped('SELECT status AS label, COUNT(*) AS value FROM customization_requests GROUP BY status ORDER BY value DESC'),
    grouped('SELECT status AS label, COUNT(*) AS value FROM campaigns GROUP BY status ORDER BY value DESC'),
    grouped('SELECT category AS label, COUNT(*) AS value FROM brand_assets GROUP BY category ORDER BY value DESC'),
    grouped(
      `SELECT b.name AS label, COUNT(cr.id) AS value
       FROM branches b
       LEFT JOIN customization_requests cr ON cr.branch_id = b.id
       GROUP BY b.id
       ORDER BY value DESC
       LIMIT 8`
    ),
    query(
      `SELECT
        (SELECT COUNT(*) FROM users) AS users,
        (SELECT COUNT(*) FROM branches) AS branches,
        (SELECT COUNT(*) FROM brand_assets) AS assets,
        (SELECT COUNT(*) FROM campaigns) AS campaigns,
        (SELECT COUNT(*) FROM customization_requests WHERE status = 'approved') AS approved_requests,
        (SELECT COUNT(*) FROM customization_requests WHERE status = 'pending') AS pending_requests`
    )
  ]);

  return {
    totals: totals[0],
    requestStatuses,
    campaignStatuses,
    assetCategories,
    branchActivity
  };
};

module.exports = { getReports };
