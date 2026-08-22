const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const todoModel = require('../models/todo.model');

const listTodos = asyncHandler(async (req, res) => {
  const rows = await todoModel.findAllForUser(req.user.id);
  const totals = await todoModel.summary(req.user.id);

  res.json({ data: rows, summary: totals });
});

const createTodo = asyncHandler(async (req, res) => {
  const todo = await todoModel.create(req.user.id, {
    title: req.body.title,
    priority: req.body.priority,
    due_date: req.body.due_date,
    is_done: req.body.is_done
  });

  res.status(201).json({ data: todo, message: 'To-do added.' });
});

const updateTodo = asyncHandler(async (req, res) => {
  const existing = await todoModel.findById(req.params.id, req.user.id);

  if (!existing) {
    throw new ApiError(404, 'To-do not found.');
  }

  const todo = await todoModel.update(req.params.id, req.user.id, {
    title: req.body.title,
    priority: req.body.priority,
    due_date: req.body.due_date,
    is_done: req.body.is_done
  });

  res.json({ data: todo, message: 'To-do updated.' });
});

const deleteTodo = asyncHandler(async (req, res) => {
  const existing = await todoModel.findById(req.params.id, req.user.id);

  if (!existing) {
    throw new ApiError(404, 'To-do not found.');
  }

  await todoModel.remove(req.params.id, req.user.id);
  res.json({ message: 'To-do removed.' });
});

const clearCompleted = asyncHandler(async (req, res) => {
  await todoModel.clearCompleted(req.user.id);
  res.json({ message: 'Completed to-dos cleared.' });
});

module.exports = { listTodos, createTodo, updateTodo, deleteTodo, clearCompleted };
