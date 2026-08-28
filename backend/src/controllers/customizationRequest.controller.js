const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { getPagination, paginationMeta } = require('../utils/pagination');
const requestModel = require('../models/customizationRequest.model');
const { logActivity } = require('../models/activity.model');
const notificationService = require('../services/notification.service');

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

  const branchManagerId = await notificationService.getBranchManagerId(branchId);
  await notificationService.notifyOne(
    branchManagerId,
    {
      title: 'New Customization Request',
      message: `"${request.title}" was submitted for ${request.branch_name || 'your branch'}.`,
      type: 'info'
    },
    req.user.id
  );

  res.status(201).json({ data: request });
});

const updateRequest = asyncHandler(async (req, res) => {
  const existing = await requestModel.findById(req.params.id);

  if (!existing) {
    throw new ApiError(404, 'Customization request not found.');
  }

  const decisionRoles = ['super_admin', 'brand_manager', 'marketing_executive'];
  const isOwner = existing.requested_by === req.user.id;
  const isDecisionMaker = decisionRoles.includes(req.user.role_slug);
  const ownerCanStillEdit = isOwner && ['pending', 'needs_revision'].includes(existing.status);

  if (!isDecisionMaker && !ownerCanStillEdit) {
    throw new ApiError(403, 'You do not have permission to edit this request.');
  }

  const payload = { ...req.body };

  // Only decision-makers may set status/response through this endpoint - that's
  // what /approve, /reject, and /request-revision are for. Without this, a
  // requester could PUT { status: 'approved' } and approve their own request.
  if (!isDecisionMaker) {
    delete payload.status;
    delete payload.response;
  }

  if (req.file) {
    payload.reference_url = `/uploads/${req.file.filename}`;
  }
  const request = await requestModel.update(req.params.id, payload);

  if (payload.assigned_to && payload.assigned_to !== existing.assigned_to) {
    await notificationService.notifyOne(
      payload.assigned_to,
      {
        title: 'Customization Request Assigned',
        message: `You have been assigned "${request.title}".`,
        type: 'info'
      },
      req.user.id
    );
  }

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

  await notificationService.notifyOne(
    request.requested_by,
    {
      title: 'Request Approved',
      message: `Your customization request "${request.title}" has been approved.`,
      type: 'success'
    },
    req.user.id
  );

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

  await notificationService.notifyOne(
    request.requested_by,
    {
      title: 'Request Rejected',
      message: `Your customization request "${request.title}" was rejected.${request.response ? ` Reason: ${request.response}` : ''}`,
      type: 'warning'
    },
    req.user.id
  );

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

  await notificationService.notifyOne(
    request.requested_by,
    {
      title: 'Revision Requested',
      message: `Revisions have been requested for "${request.title}". ${request.response || 'Please review the feedback.'}`,
      type: 'warning'
    },
    req.user.id
  );

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
