const asyncHandler = require('../utils/asyncHandler');
const dashboardModel = require('../models/dashboard.model');

const getDashboard = asyncHandler(async (req, res) => {
  const dashboard = await dashboardModel.getDashboard(req.user);
  res.json({ data: dashboard });
});

module.exports = { getDashboard };
