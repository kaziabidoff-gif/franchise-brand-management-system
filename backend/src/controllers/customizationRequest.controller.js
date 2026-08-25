const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { getPagination, paginationMeta } = require('../utils/pagination');
const requestModel = require('../models/customizationRequest.model');
const { logActivity } = require('../models/activity.model');

const listRequests = asyncHandler(async (req, res) => {
  const pagination = getPagination(req.query);
  const result = await requestModel.findAll(
    {
      search: req.query.search,
      status: req.query.status,
      priority: req.query.priority,
      category: req.query.category,
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
  const referenceUrl = req.file ? `/uploads/${req.file.filename}` : req.body.reference_url;
  const request = await requestModel.create({
    ...req.body,
    branch_id: branchId,
    requested_by: req.user.id,
    reference_url: referenceUrl
  });

  await logActivity({
    actorId: req.user.id,
    entityType: 'request',
    entityId: request.id,
    action: 'submit',
    description: `${req.user.name} submitted a customization request: ${request.title}`
  });

  res.status(201).json({ data: request });
});

const updateRequest = asyncHandler(async (req, res) => {
  const existing = await requestModel.findById(req.params.id);

  if (!existing) {
    throw new ApiError(404, 'Customization request not found.');
  }

  const payload = { ...req.body };
  if (req.file) {
    payload.reference_url = `/uploads/${req.file.filename}`;
  }
  const request = await requestModel.update(req.params.id, payload);
  res.json({ data: request });
});

const deleteRequest = asyncHandler(async (req, res) => {
  const existing = await requestModel.findById(req.params.id);

  if (!existing) {
    throw new ApiError(404, 'Customization request not found.');
  }

  await requestModel.remove(req.params.id);

  await logActivity({
    actorId: req.user.id,
    entityType: 'request',
    entityId: existing.id,
    action: 'delete',
    description: `${req.user.name} removed request: ${existing.title}`
  });

  res.status(204).send();
});

const approveRequest = asyncHandler(async (req, res) => {
  const request = await requestModel.update(req.params.id, {
    status: 'approved',
    response: req.body.response || 'Approved.'
  });

  await logActivity({
    actorId: req.user.id,
    entityType: 'request',
    entityId: request.id,
    action: 'approve',
    description: `${req.user.name} approved request: ${request.title}`
  });

  res.json({ data: request });
});

const rejectRequest = asyncHandler(async (req, res) => {
  const request = await requestModel.update(req.params.id, {
    status: 'rejected',
    response: req.body.response || 'Rejected.'
  });

  await logActivity({
    actorId: req.user.id,
    entityType: 'request',
    entityId: request.id,
    action: 'reject',
    description: `${req.user.name} rejected request: ${request.title}`
  });

  res.json({ data: request });
});

const requestRevision = asyncHandler(async (req, res) => {
  const request = await requestModel.update(req.params.id, {
    status: 'needs_revision',
    response: req.body.response || 'Revision requested.'
  });

  await logActivity({
    actorId: req.user.id,
    entityType: 'request',
    entityId: request.id,
    action: 'request_revision',
    description: `${req.user.name} requested revisions for: ${request.title}`
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
  rejectRequest,
  requestRevision
};
