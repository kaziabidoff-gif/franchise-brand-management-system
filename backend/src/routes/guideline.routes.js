const express = require('express');
const guidelineController = require('../controllers/guideline.controller');
const validate = require('../middleware/validate');
const { requireAuth, authorize } = require('../middleware/auth');
const { idParam, guidelineRules, updateGuidelineRules } = require('../validations/guideline.validation');

const router = express.Router();

router.use(requireAuth);
router.get('/', guidelineController.listGuidelines);
router.post('/', authorize('super_admin', 'brand_manager'), guidelineRules, validate, guidelineController.createGuideline);
router.get('/:id', idParam, validate, guidelineController.getGuideline);
router.put('/:id', authorize('super_admin', 'brand_manager'), updateGuidelineRules, validate, guidelineController.updateGuideline);
router.patch('/:id/publish', authorize('super_admin', 'brand_manager'), idParam, validate, guidelineController.publishGuideline);
router.delete('/:id', authorize('super_admin'), idParam, validate, guidelineController.deleteGuideline);

module.exports = router;
