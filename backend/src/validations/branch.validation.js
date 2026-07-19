const { body, param } = require('express-validator');

const idParam = [param('id').isInt({ min: 1 }).withMessage('Valid branch id is required.')];

const branchRules = [
  body('code').trim().notEmpty().withMessage('Branch code is required.'),
  body('name').trim().notEmpty().withMessage('Branch name is required.'),
  body('location').trim().notEmpty().withMessage('Location is required.'),
  body('city').trim().notEmpty().withMessage('City is required.'),
  body('country').optional({ nullable: true, checkFalsy: true }).trim(),
  body('address').optional({ nullable: true, checkFalsy: true }).trim(),
  body('phone').optional({ nullable: true, checkFalsy: true }).trim(),
  body('email').optional({ nullable: true, checkFalsy: true }).isEmail().normalizeEmail(),
  body('status').optional().isIn(['active', 'inactive']),
  body('manager_id').optional({ nullable: true, checkFalsy: true }).isInt({ min: 1 })
];

const updateBranchRules = [
  ...idParam,
  body('code').optional().trim().notEmpty(),
  body('name').optional().trim().notEmpty(),
  body('location').optional().trim().notEmpty(),
  body('city').optional().trim().notEmpty(),
  body('country').optional({ nullable: true, checkFalsy: true }).trim(),
  body('address').optional({ nullable: true, checkFalsy: true }).trim(),
  body('phone').optional({ nullable: true, checkFalsy: true }).trim(),
  body('email').optional({ nullable: true, checkFalsy: true }).isEmail().normalizeEmail(),
  body('status').optional().isIn(['active', 'inactive']),
  body('manager_id').optional({ nullable: true, checkFalsy: true }).isInt({ min: 1 })
];

module.exports = { idParam, branchRules, updateBranchRules };
