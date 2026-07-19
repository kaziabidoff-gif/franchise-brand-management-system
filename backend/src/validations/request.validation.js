const { body, param } = require('express-validator');

const idParam = [param('id').isInt({ min: 1 }).withMessage('Valid request id is required.')];

const requestRules = [
  body('title').trim().notEmpty().withMessage('Request title is required.'),
  body('description').trim().notEmpty().withMessage('Description is required.'),
  body('category').optional({ nullable: true, checkFalsy: true }).trim(),
  body('due_date').optional({ nullable: true, checkFalsy: true }).isISO8601().withMessage('Desired completion date must be a valid date.'),
  body('branch_id').isInt({ min: 1 }).withMessage('Branch is required.'),
  body('assigned_to').optional({ nullable: true, checkFalsy: true }).isInt({ min: 1 }),
  body('asset_id').optional({ nullable: true, checkFalsy: true }).isInt({ min: 1 }),
  body('reference_url').optional({ nullable: true, checkFalsy: true }).trim(),
  body('status').optional().isIn(['pending', 'in_review', 'approved', 'rejected', 'needs_revision']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('response').optional({ nullable: true, checkFalsy: true }).trim()
];

const updateRequestRules = [
  ...idParam,
  body('title').optional().trim().notEmpty(),
  body('description').optional().trim().notEmpty(),
  body('category').optional({ nullable: true, checkFalsy: true }).trim(),
  body('due_date').optional({ nullable: true, checkFalsy: true }).isISO8601().withMessage('Desired completion date must be a valid date.'),
  body('branch_id').optional().isInt({ min: 1 }),
  body('assigned_to').optional({ nullable: true, checkFalsy: true }).isInt({ min: 1 }),
  body('asset_id').optional({ nullable: true, checkFalsy: true }).isInt({ min: 1 }),
  body('reference_url').optional({ nullable: true, checkFalsy: true }).trim(),
  body('status').optional().isIn(['pending', 'in_review', 'approved', 'rejected', 'needs_revision']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('response').optional({ nullable: true, checkFalsy: true }).trim()
];

const decisionRules = [
  ...idParam,
  body('response').optional({ nullable: true, checkFalsy: true }).trim()
];

module.exports = { idParam, requestRules, updateRequestRules, decisionRules };
