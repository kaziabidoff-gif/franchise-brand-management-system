const express = require('express');
const authController = require('../controllers/auth.controller');
const validate = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const { loginRules } = require('../validations/auth.validation');

const router = express.Router();

router.post(
  '/login',
  (req, res, next) => {
    console.log('🔥 LOGIN REQUEST RECEIVED');
    console.log('BODY:', req.body);
    next();
  },
  loginRules,
  validate,
  authController.login
);
router.post('/login', authController.login);
router.get('/me', requireAuth, authController.me);
router.post('/logout', authController.logout);

module.exports = router;