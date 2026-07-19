const { body, param } = require('express-validator');

const idParam = [param('id').isInt({ min: 1 }).withMessage('Valid user id is required.')];

const createUserRules = [
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('email').isEmail().withMessage('Valid email is required.').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
  body('role_id').isInt({ min: 1 }).withMessage('Role is required.'),
  body('branch_id').optional({ nullable: true, checkFalsy: true }).isInt({ min: 1 }),
  body('phone').optional({ nullable: true, checkFalsy: true }).trim(),
  body('avatar_url').optional({ nullable: true, checkFalsy: true }).isString(),
  body('status').optional().isIn(['active', 'inactive'])
];

const updateUserRules = [
  ...idParam,
  body('name').optional().trim().notEmpty(),
  body('email').optional().isEmail().normalizeEmail(),
  body('password').optional({ nullable: true, checkFalsy: true }).isLength({ min: 6 }),
  body('role_id').optional().isInt({ min: 1 }),
  body('branch_id').optional({ nullable: true, checkFalsy: true }).isInt({ min: 1 }),
  body('phone').optional({ nullable: true, checkFalsy: true }).trim(),
  body('avatar_url').optional({ nullable: true, checkFalsy: true }).isString(),
  body('status').optional().isIn(['active', 'inactive'])
];

const statusRules = [
  ...idParam,
  body('status').isIn(['active', 'inactive']).withMessage('Status must be active or inactive.')
];

module.exports = { idParam, createUserRules, updateUserRules, statusRules };
