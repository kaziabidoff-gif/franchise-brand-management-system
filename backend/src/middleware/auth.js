const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { env } = require('../config/env');
const { query } = require('../config/db');

const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization || '';
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  return req.cookies?.[env.jwt.cookieName];
};

const requireAuth = asyncHandler(async (req, res, next) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    throw new ApiError(401, 'Authentication required.');
  }

  const payload = jwt.verify(token, env.jwt.secret);
  const users = await query(
    `SELECT u.id, u.name, u.email, u.phone, u.avatar_url, u.status, u.branch_id,
      r.name AS role_name, r.slug AS role_slug, b.name AS branch_name
     FROM users u
     INNER JOIN roles r ON r.id = u.role_id
     LEFT JOIN branches b ON b.id = u.branch_id
     WHERE u.id = ? LIMIT 1`,
    [payload.id]
  );

  if (!users.length || users[0].status !== 'active') {
    throw new ApiError(401, 'Your session is no longer valid.');
  }

  req.user = users[0];
  next();
});

const authorize = (...allowedRoles) => (req, res, next) => {
  if (!allowedRoles.length || allowedRoles.includes(req.user.role_slug)) {
    next();
    return;
  }

  next(new ApiError(403, 'You do not have permission to perform this action.'));
};

module.exports = { requireAuth, authorize };
