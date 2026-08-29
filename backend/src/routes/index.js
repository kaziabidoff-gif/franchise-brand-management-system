const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const branchRoutes = require('./branch.routes');
const assetRoutes = require('./brandAsset.routes');
const campaignRoutes = require('./campaign.routes');
const guidelineRoutes = require('./guideline.routes');
const requestRoutes = require('./customizationRequest.routes');
const notificationRoutes = require('./notification.routes');
const dashboardRoutes = require('./dashboard.routes');
const reportRoutes = require('./report.routes');
const profileRoutes = require('./profile.routes');
const todoRoutes = require('./todo.routes');
const branchActivityRoutes = require('./branchActivity.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/users', userRoutes);
router.use('/branches', branchRoutes);
router.use('/assets', assetRoutes);
router.use('/campaigns', campaignRoutes);
router.use('/guidelines', guidelineRoutes);
router.use('/requests', requestRoutes);
router.use('/notifications', notificationRoutes);
router.use('/reports', reportRoutes);
router.use('/profile', profileRoutes);
router.use('/todos', todoRoutes);
router.use('/branch-activities', branchActivityRoutes);

module.exports = router;
