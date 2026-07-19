const express = require('express');
const reportController = require('../controllers/report.controller');
const { requireAuth, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);
router.get('/', authorize('super_admin', 'brand_manager', 'marketing_executive'), reportController.getReports);

module.exports = router;
