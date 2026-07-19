const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { getPagination, paginationMeta } = require('../utils/pagination');
const campaignModel = require('../models/campaign.model');

const listCampaigns = asyncHandler(async (req, res) => {
  const pagination = getPagination(req.query);
  const result = await campaignModel.findAll(
    {
      search: req.query.search,
      status: req.query.status,
      branchId: req.user.role_slug === 'branch_manager' ? req.user.branch_id : req.query.branch_id
    },
    pagination
  );

  res.json({ data: result.rows, meta: paginationMeta(result.total, pagination.page, pagination.limit) });
});

const campaignOptions = asyncHandler(async (req, res) => {
  const campaigns = await campaignModel.findOptions();
  res.json({ data: campaigns });
});

const getCampaign = asyncHandler(async (req, res) => {
  const campaign = await campaignModel.findById(req.params.id);

  if (!campaign) {
    throw new ApiError(404, 'Campaign not found.');
  }

  res.json({ data: campaign });
});

const createCampaign = asyncHandler(async (req, res) => {
  const campaign = await campaignModel.create({ ...req.body, created_by: req.user.id });
  res.status(201).json({ data: campaign });
});

const updateCampaign = asyncHandler(async (req, res) => {
  const existing = await campaignModel.findById(req.params.id);

  if (!existing) {
    throw new ApiError(404, 'Campaign not found.');
  }

  const campaign = await campaignModel.update(req.params.id, req.body);
  res.json({ data: campaign });
});

const deleteCampaign = asyncHandler(async (req, res) => {
  const existing = await campaignModel.findById(req.params.id);

  if (!existing) {
    throw new ApiError(404, 'Campaign not found.');
  }

  await campaignModel.remove(req.params.id);
  res.status(204).send();
});

module.exports = { listCampaigns, campaignOptions, getCampaign, createCampaign, updateCampaign, deleteCampaign };
