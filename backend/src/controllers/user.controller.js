const bcrypt = require('bcrypt');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { getPagination, paginationMeta } = require('../utils/pagination');
const userModel = require('../models/user.model');
const roleModel = require('../models/role.model');

const listUsers = asyncHandler(async (req, res) => {
  const pagination = getPagination(req.query);
  const result = await userModel.findAll(
    {
      search: req.query.search,
      status: req.query.status,
      roleId: req.query.role_id,
      branchId: req.query.branch_id
    },
    pagination
  );

  res.json({ data: result.rows, meta: paginationMeta(result.total, pagination.page, pagination.limit) });
});

const listRoles = asyncHandler(async (req, res) => {
  const roles = await roleModel.findAll();
  res.json({ data: roles });
});

const getUser = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  res.json({ data: user });
});

const createUser = asyncHandler(async (req, res) => {
  const existing = await userModel.findByEmail(req.body.email);

  if (existing) {
    throw new ApiError(409, 'A user with this email already exists.');
  }

  const passwordHash = await bcrypt.hash(req.body.password, 10);
  const user = await userModel.create({ ...req.body, password_hash: passwordHash });

  res.status(201).json({ data: user });
});

const updateUser = asyncHandler(async (req, res) => {
  const existing = await userModel.findById(req.params.id);

  if (!existing) {
    throw new ApiError(404, 'User not found.');
  }

  const updates = { ...req.body };

  if (updates.password) {
    updates.password_hash = await bcrypt.hash(updates.password, 10);
    delete updates.password;
  }

  const user = await userModel.update(req.params.id, updates);
  res.json({ data: user });
});

const deleteUser = asyncHandler(async (req, res) => {
  const existing = await userModel.findById(req.params.id);

  if (!existing) {
    throw new ApiError(404, 'User not found.');
  }

  await userModel.remove(req.params.id);
  res.status(204).send();
});

const updateStatus = asyncHandler(async (req, res) => {
  const user = await userModel.update(req.params.id, { status: req.body.status });
  res.json({ data: user });
});

module.exports = { listUsers, listRoles, getUser, createUser, updateUser, deleteUser, updateStatus };
