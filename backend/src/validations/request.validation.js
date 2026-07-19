const { body, param } = require('express-validator');

const idParam = [param('id').isInt({ min: 1 }).withMessage('Valid request id is required.')];

const requestRules = [
  body('title').trim().notEmpty().withMessage('Request title is required.'),
  body('description').trim().notEmpty().withMessage('Description is required.'),
  body('branch_id').isInt({ min: 1 }).withMessage('Branch is required.'),
  body('assigned_to').optional({ nullable: true, checkFalsy: true }).isInt({ min: 1 }),
  body('asset_id').optional({ nullable: true, checkFalsy: true }).isInt({ min: 1 }),
  body('status').optional().isIn(['pending', 'in_review', 'approved', 'rejected']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('response').optional({ nullable: true, checkFalsy: true }).trim()
];

const updateRequestRules = [
  ...idParam,
  body('title').optional().trim().notEmpty(),
  body('description').optional().trim().notEmpty(),
  body('branch_id').optional().isInt({ min: 1 }),
  body('assigned_to').optional({ nullable: true, checkFalsy: true }).isInt({ min: 1 }),
  body('asset_id').optional({ nullable: true, checkFalsy: true }).isInt({ min: 1 }),
  body('status').optional().isIn(['pending', 'in_review', 'approved', 'rejected']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('response').optional({ nullable: true, checkFalsy: true }).trim()
];

const decisionRules = [
  ...idParam,
  body('response').optional({ nullable: true, checkFalsy: true }).trim()
];

module.exports = { idParam, requestRules, updateRequestRules, decisionRules };
