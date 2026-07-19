const express = require('express');
const userController = require('../controllers/user.controller');
const validate = require('../middleware/validate');
const { requireAuth, authorize } = require('../middleware/auth');
const {
  idParam,
  createUserRules,
  updateUserRules,
  statusRules
} = require('../validations/user.validation');

const router = express.Router();

router.use(requireAuth);
router.get('/roles', userController.listRoles);
router.get('/', authorize('super_admin', 'brand_manager'), userController.listUsers);
router.post('/', authorize('super_admin', 'brand_manager'), createUserRules, validate, userController.createUser);
router.get('/:id', authorize('super_admin', 'brand_manager'), idParam, validate, userController.getUser);
router.put('/:id', authorize('super_admin', 'brand_manager'), updateUserRules, validate, userController.updateUser);
router.patch('/:id/status', authorize('super_admin', 'brand_manager'), statusRules, validate, userController.updateStatus);
router.delete('/:id', authorize('super_admin'), idParam, validate, userController.deleteUser);

module.exports = router;
