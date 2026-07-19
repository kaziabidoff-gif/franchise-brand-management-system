const { body, param } = require('express-validator');

const idParam = [param('id').isInt({ min: 1 }).withMessage('Valid campaign id is required.')];

const campaignRules = [
  body('name').trim().notEmpty().withMessage('Campaign name is required.'),
  body('description').optional({ nullable: true, checkFalsy: true }).trim(),
  body('start_date').isISO8601().withMessage('Start date is required.'),
  body('end_date').isISO8601().withMessage('End date is required.'),
  body('budget').optional({ nullable: true, checkFalsy: true }).isFloat({ min: 0 }),
  body('status').optional().isIn(['draft', 'scheduled', 'active', 'completed', 'cancelled']),
  body('branch_ids').optional(),
  body('asset_ids').optional()
];

const updateCampaignRules = [
  ...idParam,
  body('name').optional().trim().notEmpty(),
  body('description').optional({ nullable: true, checkFalsy: true }).trim(),
  body('start_date').optional().isISO8601(),
  body('end_date').optional().isISO8601(),
  body('budget').optional({ nullable: true, checkFalsy: true }).isFloat({ min: 0 }),
  body('status').optional().isIn(['draft', 'scheduled', 'active', 'completed', 'cancelled']),
  body('branch_ids').optional(),
  body('asset_ids').optional()
];

module.exports = { idParam, campaignRules, updateCampaignRules };
