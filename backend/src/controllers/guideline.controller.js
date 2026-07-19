const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { getPagination, paginationMeta } = require('../utils/pagination');
const guidelineModel = require('../models/guideline.model');

const listGuidelines = asyncHandler(async (req, res) => {
  const pagination = getPagination(req.query);
  const result = await guidelineModel.findAll(
    {
      search: req.query.search,
      status: req.query.status
    },
    pagination
  );

  res.json({ data: result.rows, meta: paginationMeta(result.total, pagination.page, pagination.limit) });
});

const getGuideline = asyncHandler(async (req, res) => {
  const guideline = await guidelineModel.findById(req.params.id);

  if (!guideline) {
    throw new ApiError(404, 'Guideline not found.');
  }

  res.json({ data: guideline });
});

const createGuideline = asyncHandler(async (req, res) => {
  const guideline = await guidelineModel.create({ ...req.body, published_by: req.user.id });
  res.status(201).json({ data: guideline });
});

const updateGuideline = asyncHandler(async (req, res) => {
  const existing = await guidelineModel.findById(req.params.id);

  if (!existing) {
    throw new ApiError(404, 'Guideline not found.');
  }

  const guideline = await guidelineModel.update(req.params.id, req.body);
  res.json({ data: guideline });
});

const publishGuideline = asyncHandler(async (req, res) => {
  const existing = await guidelineModel.findById(req.params.id);

  if (!existing) {
    throw new ApiError(404, 'Guideline not found.');
  }

  const guideline = await guidelineModel.publish(req.params.id, req.user.id);
  res.json({ data: guideline });
});

const deleteGuideline = asyncHandler(async (req, res) => {
  const existing = await guidelineModel.findById(req.params.id);

  if (!existing) {
    throw new ApiError(404, 'Guideline not found.');
  }

  await guidelineModel.remove(req.params.id);
  res.status(204).send();
});

module.exports = {
  listGuidelines,
  getGuideline,
  createGuideline,
  updateGuideline,
  publishGuideline,
  deleteGuideline
};
