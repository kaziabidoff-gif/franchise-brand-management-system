const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { getPagination, paginationMeta } = require('../utils/pagination');
const branchModel = require('../models/branch.model');

const listBranches = asyncHandler(async (req, res) => {
  const pagination = getPagination(req.query);
  const result = await branchModel.findAll(
    {
      search: req.query.search,
      status: req.query.status
    },
    pagination
  );

  res.json({ data: result.rows, meta: paginationMeta(result.total, pagination.page, pagination.limit) });
});

const branchOptions = asyncHandler(async (req, res) => {
  const branches = await branchModel.findOptions();
  res.json({ data: branches });
});

const getBranch = asyncHandler(async (req, res) => {
  const branch = await branchModel.findById(req.params.id);

  if (!branch) {
    throw new ApiError(404, 'Branch not found.');
  }

  res.json({ data: branch });
});

const createBranch = asyncHandler(async (req, res) => {
  const branch = await branchModel.create(req.body);
  res.status(201).json({ data: branch });
});

const updateBranch = asyncHandler(async (req, res) => {
  const existing = await branchModel.findById(req.params.id);

  if (!existing) {
    throw new ApiError(404, 'Branch not found.');
  }

  const branch = await branchModel.update(req.params.id, req.body);
  res.json({ data: branch });
});

const deleteBranch = asyncHandler(async (req, res) => {
  const existing = await branchModel.findById(req.params.id);

  if (!existing) {
    throw new ApiError(404, 'Branch not found.');
  }

  await branchModel.remove(req.params.id);
  res.status(204).send();
});

module.exports = { listBranches, branchOptions, getBranch, createBranch, updateBranch, deleteBranch };
