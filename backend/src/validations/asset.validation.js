const { body, param } = require('express-validator');

const idParam = [param('id').isInt({ min: 1 }).withMessage('Valid asset id is required.')];

const assetRules = [
  body('title').trim().notEmpty().withMessage('Asset title is required.'),
  body('category').trim().notEmpty().withMessage('Category is required.'),
  body('description').optional({ nullable: true, checkFalsy: true }).trim(),
  body('asset_type').optional().isIn(['image', 'document', 'video', 'template', 'logo', 'other']),
  body('file_url').optional({ nullable: true, checkFalsy: true }).isString(),
  body('thumbnail_url').optional({ nullable: true, checkFalsy: true }).isString(),
  body('version').optional({ nullable: true, checkFalsy: true }).trim(),
  body('status').optional().isIn(['active', 'archived', 'draft']),
  body('branch_id').optional({ nullable: true, checkFalsy: true }).isInt({ min: 1 }),
  body('tags').optional()
];

const updateAssetRules = [
  ...idParam,
  body('title').optional().trim().notEmpty(),
  body('category').optional().trim().notEmpty(),
  body('description').optional({ nullable: true, checkFalsy: true }).trim(),
  body('asset_type').optional().isIn(['image', 'document', 'video', 'template', 'logo', 'other']),
  body('file_url').optional({ nullable: true, checkFalsy: true }).isString(),
  body('thumbnail_url').optional({ nullable: true, checkFalsy: true }).isString(),
  body('version').optional({ nullable: true, checkFalsy: true }).trim(),
  body('status').optional().isIn(['active', 'archived', 'draft']),
  body('branch_id').optional({ nullable: true, checkFalsy: true }).isInt({ min: 1 }),
  body('tags').optional()
];

module.exports = { idParam, assetRules, updateAssetRules };
