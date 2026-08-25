const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { getPagination, paginationMeta } = require('../utils/pagination');
const { parseJson } = require('../utils/serializers');
const brandAssetModel = require('../models/brandAsset.model');
const { logActivity } = require('../models/activity.model');

const listAssets = asyncHandler(async (req, res) => {
  const pagination = getPagination(req.query);
  const result = await brandAssetModel.findAll(
    {
      search: req.query.search,
      category: req.query.category,
      status: req.query.status,
      branchId: req.user.role_slug === 'branch_manager' ? req.user.branch_id : req.query.branch_id
    },
    pagination
  );

  res.json({ data: result.rows, meta: paginationMeta(result.total, pagination.page, pagination.limit) });
});

const assetOptions = asyncHandler(async (req, res) => {
  const assets = await brandAssetModel.findOptions();
  res.json({ data: assets });
});

const getAsset = asyncHandler(async (req, res) => {
  const asset = await brandAssetModel.findById(req.params.id);

  if (!asset) {
    throw new ApiError(404, 'Asset not found.');
  }

  res.json({ data: asset });
});

const parseTags = (tags) => {
  if (Array.isArray(tags)) {
    return tags;
  }

  if (typeof tags === 'string') {
    return tags.includes('[') ? parseJson(tags) : tags.split(',').map((tag) => tag.trim()).filter(Boolean);
  }

  return [];
};

const createAsset = asyncHandler(async (req, res) => {
  const fileUrl = req.file ? `/uploads/${req.file.filename}` : req.body.file_url;

  if (!fileUrl) {
    throw new ApiError(422, 'Upload a file or provide a file URL.');
  }

  const asset = await brandAssetModel.create({
    ...req.body,
    tags: parseTags(req.body.tags),
    file_url: fileUrl,
    uploaded_by: req.user.id
  });

  await logActivity({
    actorId: req.user.id,
    entityType: 'asset',
    entityId: asset.id,
    action: 'upload',
    description: `${req.user.name} uploaded ${asset.title}`
  });

  res.status(201).json({ data: asset });
});

const updateAsset = asyncHandler(async (req, res) => {
  const existing = await brandAssetModel.findById(req.params.id);

  if (!existing) {
    throw new ApiError(404, 'Asset not found.');
  }

  const updates = {
    ...req.body,
    tags: Object.prototype.hasOwnProperty.call(req.body, 'tags') ? parseTags(req.body.tags) : existing.tags
  };

  if (req.file) {
    updates.file_url = `/uploads/${req.file.filename}`;
  }

  const asset = await brandAssetModel.update(req.params.id, updates);

  if (updates.status && updates.status !== existing.status) {
    await logActivity({
      actorId: req.user.id,
      entityType: 'asset',
      entityId: asset.id,
      action: updates.status,
      description: `${req.user.name} marked ${asset.title} as ${updates.status}`
    });
  }

  res.json({ data: asset });
});

const deleteAsset = asyncHandler(async (req, res) => {
  const existing = await brandAssetModel.findById(req.params.id);

  if (!existing) {
    throw new ApiError(404, 'Asset not found.');
  }

  await brandAssetModel.remove(req.params.id);

  await logActivity({
    actorId: req.user.id,
    entityType: 'asset',
    entityId: existing.id,
    action: 'delete',
    description: `${req.user.name} removed asset ${existing.title}`
  });

  res.status(204).send();
});

const downloadAsset = asyncHandler(async (req, res) => {
  const asset = await brandAssetModel.findById(req.params.id);

  if (!asset) {
    throw new ApiError(404, 'Asset not found.');
  }

  const filePath = brandAssetModel.getLocalFilePath(asset.file_url);

  if (filePath) {
    res.download(filePath);
    return;
  }

  res.json({ downloadUrl: asset.file_url });
});

module.exports = { listAssets, assetOptions, getAsset, createAsset, updateAsset, deleteAsset, downloadAsset };
