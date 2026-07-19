const asyncHandler = require('../utils/asyncHandler');
const reportModel = require('../models/report.model');

const getReports = asyncHandler(async (req, res) => {
  const reports = await reportModel.getReports();
  res.json({ data: reports });
});

module.exports = { getReports };
