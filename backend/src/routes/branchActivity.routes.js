const express = require('express');
const branchActivityController = require('../controllers/branchActivity.controller');
const { requireAuth, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);
router.get('/', authorize('super_admin', 'brand_manager', 'marketing_executive', 'branch_manager'), branchActivityController.listBranchActivities);

module.exports = router;
