const { body, param } = require('express-validator');

const idParam = [param('id').isInt({ min: 1 }).withMessage('Valid guideline id is required.')];

const guidelineRules = [
  body('title').trim().notEmpty().withMessage('Title is required.'),
  body('content').trim().notEmpty().withMessage('Content is required.'),
  body('version').optional({ nullable: true, checkFalsy: true }).trim(),
  body('status').optional().isIn(['draft', 'published', 'archived'])
];

const updateGuidelineRules = [
  ...idParam,
  body('title').optional().trim().notEmpty(),
  body('content').optional().trim().notEmpty(),
  body('version').optional({ nullable: true, checkFalsy: true }).trim(),
  body('status').optional().isIn(['draft', 'published', 'archived'])
];

module.exports = { idParam, guidelineRules, updateGuidelineRules };
