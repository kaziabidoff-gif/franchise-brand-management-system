const express = require('express');
const { body } = require('express-validator');
const profileController = require('../controllers/profile.controller');
const validate = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);
router.get('/', profileController.getProfile);
router.put(
  '/',
  [
    body('name').optional().trim().notEmpty(),
    body('phone').optional({ nullable: true, checkFalsy: true }).trim(),
    body('avatar_url').optional({ nullable: true, checkFalsy: true }).isString(),
    body('password').optional({ nullable: true, checkFalsy: true }).isLength({ min: 6 })
  ],
  validate,
  profileController.updateProfile
);

module.exports = router;
