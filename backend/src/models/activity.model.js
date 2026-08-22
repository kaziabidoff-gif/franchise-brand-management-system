const { query } = require('../config/db');

const logActivity = async ({ actorId, entityType, entityId, action, description }) => {
  await query(
    `INSERT INTO activities (actor_id, entity_type, entity_id, action, description)
     VALUES (?, ?, ?, ?, ?)`,
    [actorId || null, entityType, entityId || null, action, description]
  );
};

module.exports = { logActivity };
