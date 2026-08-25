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

// Compares rows created in the last 7 days against the 7 days before that,
// for the same WHERE condition. Every table here has created_at.
const getWeeklyTrend = async (table, whereSql = '', params = []) => {
  const condition = whereSql ? `${whereSql} AND` : 'WHERE';

  const rows = await query(
    `SELECT
      SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) AS current_period,
      SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 14 DAY)
                AND created_at < DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) AS previous_period
     FROM ${table}
     ${condition} 1 = 1`,
    params
  );

  const current = Number(rows[0].current_period) || 0;
  const previous = Number(rows[0].previous_period) || 0;

  if (previous === 0) {
    return current > 0
      ? { text: `+${current} new this week`, direction: 'up' }
      : { text: 'No change this week', direction: 'flat' };
  }

  const pctChange = Math.round(((current - previous) / previous) * 100);

  if (pctChange === 0) {
    return { text: 'Steady vs last week', direction: 'flat' };
  }

  return {
    text: `${pctChange > 0 ? '+' : ''}${pctChange}% vs last week`,
    direction: pctChange > 0 ? 'up' : 'down'
  };
};

// Marketing Executive: the campaign that should be front-and-center right now.
// Prefers a currently running campaign; falls back to the next scheduled one
// so this section is never just empty between campaigns.
const getCampaignSpotlight = async () => {
  const campaignQuery = (status, order) => query(
    `SELECT c.id, c.name, c.description, c.status, c.start_date, c.end_date,
      COUNT(DISTINCT cb.branch_id) AS branch_count,
      COUNT(DISTINCT ca.asset_id) AS asset_count
     FROM campaigns c
     LEFT JOIN campaign_branches cb ON cb.campaign_id = c.id
     LEFT JOIN campaign_assets ca ON ca.campaign_id = c.id
     WHERE c.status = ?
     GROUP BY c.id
     ORDER BY c.start_date ${order}
     LIMIT 1`,
    [status]
  );

  const active = await campaignQuery('active', 'DESC');
  if (active.length) {
    return { type: 'campaign_spotlight', campaign: active[0], upcoming: false };
  }

  const upcoming = await campaignQuery('scheduled', 'ASC');
  return { type: 'campaign_spotlight', campaign: upcoming[0] || null, upcoming: true };
};

// Graphic Designer: open work actually assigned to them, not the whole
// company's request list. This is the same assigned_to data that already
// existed on customization_requests - just never had a personalized view.
const getDesignTasks = async (userId) => {
  const tasks = await query(
    `SELECT cr.id, cr.title, cr.category, cr.due_date, cr.status, cr.priority, b.name AS branch_name
     FROM customization_requests cr
     LEFT JOIN branches b ON b.id = cr.branch_id
     WHERE cr.assigned_to = ?
       AND cr.status IN ('pending', 'in_review', 'needs_revision')
     ORDER BY cr.due_date IS NULL, cr.due_date ASC
     LIMIT 8`,
    [userId]
  );

  return { type: 'design_tasks', tasks };
};

// Branch Manager: their branch's own performance, not company-wide numbers.
const getBranchOverview = async (branchId) => {
  const [branchRows, campaigns, pendingRequests, userCountRows] = await Promise.all([
    query('SELECT id, name, code, location, status FROM branches WHERE id = ? LIMIT 1', [branchId]),
    query(
      `SELECT c.id, c.name, c.status, c.start_date, c.end_date
       FROM campaigns c
       INNER JOIN campaign_branches cb ON cb.campaign_id = c.id
       WHERE cb.branch_id = ? AND c.status IN ('active', 'scheduled')
       ORDER BY c.start_date ASC
       LIMIT 5`,
      [branchId]
    ),
    query(
      `SELECT id, title, category, status, priority, due_date
       FROM customization_requests
       WHERE branch_id = ? AND status IN ('pending', 'in_review', 'needs_revision')
       ORDER BY due_date IS NULL, due_date ASC
       LIMIT 5`,
      [branchId]
    ),
    query('SELECT COUNT(*) AS total FROM users WHERE branch_id = ?', [branchId])
  ]);

  return {
    type: 'branch_overview',
    branch: branchRows[0] || null,
    campaigns,
    pendingRequests,
    userCount: userCountRows[0].total
  };
};

// super_admin / brand_manager see the existing system-wide stat cards as
// their primary view, so there's no separate role section for them.
const getRoleSection = async (user) => {
  switch (user.role_slug) {
    case 'marketing_executive':
      return getCampaignSpotlight();
    case 'graphic_designer':
      return getDesignTasks(user.id);
    case 'branch_manager':
      return getBranchOverview(user.branch_id);
    default:
      return null;
  }
};

const getDashboard = async (user) => {
  const isBranchManager = user.role_slug === 'branch_manager';
  const branchFilter = isBranchManager ? ' WHERE branch_id = ?' : '';
  const branchParams = isBranchManager ? [user.branch_id] : [];
  const branchWhere = isBranchManager ? 'WHERE branch_id = ?' : '';

  const [
    users,
    branches,
    assets,
    activeCampaigns,
    pendingRequests,
    unread,
    usersTrend,
    branchesTrend,
    assetsTrend,
    campaignsTrend,
    requestsTrend,
    roleSection
  ] = await Promise.all([
    count('SELECT COUNT(*) AS total FROM users'),
    count('SELECT COUNT(*) AS total FROM branches'),
    count(`SELECT COUNT(*) AS total FROM brand_assets${branchFilter}`, branchParams),
    count(
      isBranchManager
        ? `SELECT COUNT(DISTINCT c.id) AS total
           FROM campaigns c
           INNER JOIN campaign_branches cb ON cb.campaign_id = c.id
           WHERE cb.branch_id = ? AND c.status = 'active'`
        : "SELECT COUNT(*) AS total FROM campaigns WHERE status = 'active'",
      branchParams
    ),
    count(
      `SELECT COUNT(*) AS total FROM customization_requests
       ${branchWhere ? `${branchWhere} AND status = 'pending'` : "WHERE status = 'pending'"}`,
      branchParams
    ),
    count('SELECT COUNT(*) AS total FROM notifications WHERE user_id = ? AND is_read = 0', [user.id]),
    getWeeklyTrend('users'),
    getWeeklyTrend('branches'),
    getWeeklyTrend('brand_assets', branchFilter.trim(), branchParams),
    getWeeklyTrend('campaigns', "WHERE status = 'active'"),
    getWeeklyTrend(
      'customization_requests',
      branchWhere ? `${branchWhere} AND status = 'pending'` : "WHERE status = 'pending'",
      branchParams
    ),
    getRoleSection(user)
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
      { label: 'Users', value: users, trend: usersTrend.text, direction: usersTrend.direction, tone: 'blue' },
      { label: 'Branches', value: branches, trend: branchesTrend.text, direction: branchesTrend.direction, tone: 'green' },
      { label: 'Brand Assets', value: assets, trend: assetsTrend.text, direction: assetsTrend.direction, tone: 'violet' },
      { label: 'Active Campaigns', value: activeCampaigns, trend: campaignsTrend.text, direction: campaignsTrend.direction, tone: 'amber' },
      { label: 'Pending Requests', value: pendingRequests, trend: requestsTrend.text, direction: requestsTrend.direction, tone: 'rose' },
      { label: 'Unread Alerts', value: unread, trend: unread > 0 ? 'Needs review' : 'All caught up', direction: unread > 0 ? 'up' : 'flat', tone: 'slate' }
    ],
    quickActions: roleMenu[user.role_slug] || roleMenu.branch_manager,
    recentActivities,
    roleSection
  };
};

module.exports = { getDashboard, roleMenu };