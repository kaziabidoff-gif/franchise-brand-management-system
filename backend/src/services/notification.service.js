const { query } = require('../config/db');
const notificationModel = require('../models/notification.model');

// Sends the same notification to multiple recipients. Deduplicates, drops any
// null/undefined id, and never notifies the actor about their own action.
const notifyMany = async (userIds, { title, message, type = 'info' }, actorId = null) => {
  const uniqueIds = [...new Set(userIds.filter((id) => id && id !== actorId))];

  await Promise.all(
    uniqueIds.map((userId) => notificationModel.create({ user_id: userId, title, message, type }))
  );
};

const notifyOne = async (userId, payload, actorId = null) => notifyMany([userId], payload, actorId);

// Active users in the given roles. Used for "notify relevant management"
// style events - super_admin/brand_manager, optionally marketing_executive.
const getUsersByRole = async (roleSlugs) => {
  const roles = Array.isArray(roleSlugs) ? roleSlugs : [roleSlugs];

  if (!roles.length) {
    return [];
  }

  const placeholders = roles.map(() => '?').join(',');
  const rows = await query(
    `SELECT u.id FROM users u
     INNER JOIN roles r ON r.id = u.role_id
     WHERE r.slug IN (${placeholders}) AND u.status = 'active'`,
    roles
  );

  return rows.map((row) => row.id);
};

const getManagementUserIds = async (includeMarketing = false) =>
  getUsersByRole(includeMarketing ? ['super_admin', 'brand_manager', 'marketing_executive'] : ['super_admin', 'brand_manager']);

const getBranchManagerId = async (branchId) => {
  if (!branchId) {
    return null;
  }

  const rows = await query('SELECT manager_id FROM branches WHERE id = ? LIMIT 1', [branchId]);
  return rows[0]?.manager_id || null;
};

module.exports = {
  notifyMany,
  notifyOne,
  getUsersByRole,
  getManagementUserIds,
  getBranchManagerId
};
