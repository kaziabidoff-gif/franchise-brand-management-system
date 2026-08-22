const { body, param } = require('express-validator');

const idParam = [param('id').isInt({ min: 1 }).withMessage('Valid to-do id is required.')];

const PRIORITIES = ['low', 'medium', 'high', 'urgent'];

const createTodoRules = [
  body('title').trim().notEmpty().withMessage('To-do title is required.').isLength({ max: 255 }),
  body('priority').optional({ nullable: true, checkFalsy: true }).isIn(PRIORITIES).withMessage('Priority must be low, medium, high, or urgent.'),
  body('due_date').optional({ nullable: true, checkFalsy: true }).isISO8601().withMessage('Due date must be a valid date.'),
  body('is_done').optional().isBoolean()
];

const updateTodoRules = [
  ...idParam,
  body('title').optional().trim().notEmpty().withMessage('To-do title cannot be empty.').isLength({ max: 255 }),
  body('priority').optional({ nullable: true, checkFalsy: true }).isIn(PRIORITIES).withMessage('Priority must be low, medium, high, or urgent.'),
  body('due_date').optional({ nullable: true, checkFalsy: true }).isISO8601().withMessage('Due date must be a valid date.'),
  body('is_done').optional().isBoolean()
];

module.exports = { idParam, createTodoRules, updateTodoRules };
