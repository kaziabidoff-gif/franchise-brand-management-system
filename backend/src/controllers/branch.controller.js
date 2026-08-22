const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { getPagination, paginationMeta } = require('../utils/pagination');
const branchModel = require('../models/branch.model');
const brandAssetModel = require('../models/brandAsset.model');
const { logActivity } = require('../models/activity.model');

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

// Branch View: assets scoped to this branch, plus globally-visible assets
// (branch_id IS NULL) — same rule the generic /assets listing already uses
// for a branch_manager. Also logs a real activity entry each time someone
// opens a branch's library, so it shows up in the dashboard's recent
// activity feed.
const getBranchAssets = asyncHandler(async (req, res) => {
  const branch = await branchModel.findById(req.params.id);

  if (!branch) {
    throw new ApiError(404, 'Branch not found.');
  }

  const pagination = getPagination(req.query);
  const [assetResult, categoryBreakdown] = await Promise.all([
    brandAssetModel.findAll({ branchId: branch.id, search: req.query.search, category: req.query.category }, pagination),
    brandAssetModel.countByCategory(branch.id)
  ]);

  await logActivity({
    actorId: req.user.id,
    entityType: 'branch',
    entityId: branch.id,
    action: 'view_assets',
    description: `${req.user.name} viewed the asset library for ${branch.name}`
  });

  res.json({
    data: assetResult.rows,
    meta: paginationMeta(assetResult.total, pagination.page, pagination.limit),
    branch,
    summary: {
      total: assetResult.total,
      byCategory: categoryBreakdown
    }
  });
});

module.exports = {
  listBranches,
  branchOptions,
  getBranch,
  createBranch,
  updateBranch,
  deleteBranch,
  getBranchAssets
};
