const { query } = require('../config/db');

const roleMenu = {
  super_admin: ['dashboard', 'users', 'branches', 'assets', 'campaigns', 'guidelines', 'requests', 'reports', 'notifications', 'profile'],
  brand_manager: ['dashboard', 'users', 'branches', 'assets', 'campaigns', 'guidelines', 'requests', 'reports', 'notifications', 'profile'],
  marketing_executive: ['dashboard', 'assets', 'campaigns', 'requests', 'reports', 'notifications', 'profile'],
  graphic_designer: ['dashboard', 'assets', 'requests', 'notifications', 'profile'],
  branch_manager: ['dashboard', 'assets', 'campaigns', 'requests', 'notifications', 'profile']
};

const count = async (sql, params = []) => {
  const rows = await query(sql, params);
  return rows[0].total;
};

const getDashboard = async (user) => {
  const branchFilter = user.role_slug === 'branch_manager' ? ' WHERE branch_id = ?' : '';
  const branchParams = user.role_slug === 'branch_manager' ? [user.branch_id] : [];

  const [users, branches, assets, campaigns, requests, unread] = await Promise.all([
    count('SELECT COUNT(*) AS total FROM users'),
    count('SELECT COUNT(*) AS total FROM branches'),
    count(`SELECT COUNT(*) AS total FROM brand_assets${branchFilter}`, branchParams),
    count(
      user.role_slug === 'branch_manager'
        ? `SELECT COUNT(DISTINCT c.id) AS total
           FROM campaigns c
           INNER JOIN campaign_branches cb ON cb.campaign_id = c.id
           WHERE cb.branch_id = ?`
        : 'SELECT COUNT(*) AS total FROM campaigns',
      branchParams
    ),
    count(`SELECT COUNT(*) AS total FROM customization_requests${branchFilter}`, branchParams),
    count('SELECT COUNT(*) AS total FROM notifications WHERE user_id = ? AND is_read = 0', [user.id])
  ]);

  const recentActivities = await query(
    `SELECT a.id, a.entity_type, a.entity_id, a.action, a.description, a.created_at,
      u.name AS actor_name
     FROM activities a
     LEFT JOIN users u ON u.id = a.actor_id
     ORDER BY a.created_at DESC
     LIMIT 8`
  );

  return {
    cards: [
      { label: 'Users', value: users, trend: '+8%', tone: 'blue' },
      { label: 'Branches', value: branches, trend: '+2', tone: 'green' },
      { label: 'Brand Assets', value: assets, trend: '+14%', tone: 'violet' },
      { label: 'Campaigns', value: campaigns, trend: '+4', tone: 'amber' },
      { label: 'Requests', value: requests, trend: 'live', tone: 'rose' },
      { label: 'Unread Alerts', value: unread, trend: 'now', tone: 'slate' }
    ],
    quickActions: roleMenu[user.role_slug] || roleMenu.branch_manager,
    recentActivities
  };
};

module.exports = { getDashboard, roleMenu };
