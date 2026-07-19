const express = require('express');
const { param } = require('express-validator');
const notificationController = require('../controllers/notification.controller');
const validate = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);
router.get('/', notificationController.listNotifications);
router.patch('/read-all', notificationController.markAllRead);
router.patch('/:id/read', param('id').isInt({ min: 1 }), validate, notificationController.markRead);

module.exports = router;
