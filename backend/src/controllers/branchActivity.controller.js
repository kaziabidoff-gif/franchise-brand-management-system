const asyncHandler = require('../utils/asyncHandler');
const { getPagination, paginationMeta } = require('../utils/pagination');
const branchActivityModel = require('../models/branchActivity.model');

const listBranchActivities = asyncHandler(async (req, res) => {
  const pagination = getPagination(req.query);

  let branchId = req.query.branch_id ? Number(req.query.branch_id) : null;

  if (req.user.role_slug === 'branch_manager') {
    if (branchId && branchId !== Number(req.user.branch_id)) {
      branchId = Number(req.user.branch_id);
    }
    branchId = Number(req.user.branch_id);
  }

  const result = await branchActivityModel.findAll(
    {
      search: req.query.search,
      branchId,
      entityType: 'branch'
    },
    pagination
  );

  res.json({
    data: result.rows,
    meta: paginationMeta(result.total, pagination.page, pagination.limit)
  });
});

module.exports = { listBranchActivities };
