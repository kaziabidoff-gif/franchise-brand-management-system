const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { getPagination, paginationMeta } = require('../utils/pagination');
const requestModel = require('../models/customizationRequest.model');

const listRequests = asyncHandler(async (req, res) => {
  const pagination = getPagination(req.query);
  const result = await requestModel.findAll(
    {
      search: req.query.search,
      status: req.query.status,
      priority: req.query.priority,
      branchId: req.user.role_slug === 'branch_manager' ? req.user.branch_id : req.query.branch_id
    },
    pagination
  );

  res.json({ data: result.rows, meta: paginationMeta(result.total, pagination.page, pagination.limit) });
});

const getRequest = asyncHandler(async (req, res) => {
  const request = await requestModel.findById(req.params.id);

  if (!request) {
    throw new ApiError(404, 'Customization request not found.');
  }

  res.json({ data: request });
});

const createRequest = asyncHandler(async (req, res) => {
  const branchId = req.user.role_slug === 'branch_manager' ? req.user.branch_id : req.body.branch_id;
  const request = await requestModel.create({ ...req.body, branch_id: branchId, requested_by: req.user.id });
  res.status(201).json({ data: request });
});

const updateRequest = asyncHandler(async (req, res) => {
  const existing = await requestModel.findById(req.params.id);

  if (!existing) {
    throw new ApiError(404, 'Customization request not found.');
  }

  const request = await requestModel.update(req.params.id, req.body);
  res.json({ data: request });
});

const deleteRequest = asyncHandler(async (req, res) => {
  const existing = await requestModel.findById(req.params.id);

  if (!existing) {
    throw new ApiError(404, 'Customization request not found.');
  }

  await requestModel.remove(req.params.id);
  res.status(204).send();
});

const approveRequest = asyncHandler(async (req, res) => {
  const request = await requestModel.update(req.params.id, {
    status: 'approved',
    response: req.body.response || 'Approved.'
  });

  res.json({ data: request });
});

const rejectRequest = asyncHandler(async (req, res) => {
  const request = await requestModel.update(req.params.id, {
    status: 'rejected',
    response: req.body.response || 'Rejected.'
  });

  res.json({ data: request });
});

module.exports = {
  listRequests,
  getRequest,
  createRequest,
  updateRequest,
  deleteRequest,
  approveRequest,
  rejectRequest
};
