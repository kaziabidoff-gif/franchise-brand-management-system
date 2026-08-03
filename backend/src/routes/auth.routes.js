const express = require('express');
const authController = require('../controllers/auth.controller');
const validate = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const { loginRules } = require('../validations/auth.validation');

const router = express.Router();

router.post('/login', loginRules, validate, authController.login);
router.get('/me', requireAuth, authController.me);
router.post('/logout', authController.logout);

module.exports = router;