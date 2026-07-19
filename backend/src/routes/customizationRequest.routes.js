const express = require('express');
const requestController = require('../controllers/customizationRequest.controller');
const validate = require('../middleware/validate');
const { requireAuth, authorize } = require('../middleware/auth');
const {
  idParam,
  requestRules,
  updateRequestRules,
  decisionRules
} = require('../validations/request.validation');

const router = express.Router();

router.use(requireAuth);
router.get('/', requestController.listRequests);
router.post('/', requestRules, validate, requestController.createRequest);
router.get('/:id', idParam, validate, requestController.getRequest);
router.put('/:id', updateRequestRules, validate, requestController.updateRequest);
router.patch(
  '/:id/approve',
  authorize('super_admin', 'brand_manager', 'marketing_executive'),
  decisionRules,
  validate,
  requestController.approveRequest
);
router.patch(
  '/:id/reject',
  authorize('super_admin', 'brand_manager', 'marketing_executive'),
  decisionRules,
  validate,
  requestController.rejectRequest
);
router.delete('/:id', authorize('super_admin', 'brand_manager'), idParam, validate, requestController.deleteRequest);

module.exports = router;
