const { body, param } = require('express-validator');

const idParam = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid campaign id is required.')
];

// Helper function: get today's date as YYYY-MM-DD
const getToday = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const campaignRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Campaign name is required.'),

  body('description')
    .optional({ nullable: true, checkFalsy: true })
    .trim(),

  body('start_date')
    .isISO8601()
    .withMessage('Start date is required.')
    .custom((value) => {
      const today = getToday();

      if (value < today) {
        throw new Error('Start date cannot be in the past.');
      }

      return true;
    }),

  body('end_date')
    .isISO8601()
    .withMessage('End date is required.')
    .custom((value, { req }) => {
      if (req.body.start_date && value < req.body.start_date) {
        throw new Error(
          'End date cannot be before the start date.'
        );
      }

      return true;
    }),

  body('budget')
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ min: 0 }),

  body('status')
    .optional()
    .isIn([
      'draft',
      'scheduled',
      'active',
      'completed',
      'cancelled'
    ]),

  body('branch_ids').optional(),

  body('asset_ids').optional()
];

const updateCampaignRules = [
  ...idParam,

  body('name')
    .optional()
    .trim()
    .notEmpty(),

  body('description')
    .optional({ nullable: true, checkFalsy: true })
    .trim(),

  body('start_date')
    .optional()
    .isISO8601()
    .custom((value) => {
      const today = getToday();

      if (value < today) {
        throw new Error('Start date cannot be in the past.');
      }

      return true;
    }),

  body('end_date')
    .optional()
    .isISO8601()
    .custom((value, { req }) => {
      // If both dates are being updated together,
      // end date cannot be before start date.
      if (req.body.start_date && value < req.body.start_date) {
        throw new Error(
          'End date cannot be before the start date.'
        );
      }

      return true;
    }),

  body('budget')
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ min: 0 }),

  body('status')
    .optional()
    .isIn([
      'draft',
      'scheduled',
      'active',
      'completed',
      'cancelled'
    ]),

  body('branch_ids').optional(),

  body('asset_ids').optional()
];

module.exports = {
  idParam,
  campaignRules,
  updateCampaignRules
};