const express = require('express');
const todoController = require('../controllers/todo.controller');
const validate = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const { idParam, createTodoRules, updateTodoRules } = require('../validations/todo.validation');

const router = express.Router();

router.use(requireAuth);
router.get('/', todoController.listTodos);
router.post('/', createTodoRules, validate, todoController.createTodo);
router.patch('/clear-completed', todoController.clearCompleted);
router.patch('/:id', updateTodoRules, validate, todoController.updateTodo);
router.delete('/:id', idParam, validate, todoController.deleteTodo);

module.exports = router;
