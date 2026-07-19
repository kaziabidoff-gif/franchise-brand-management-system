const express = require('express');
const brandAssetController = require('../controllers/brandAsset.controller');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');
const { requireAuth, authorize } = require('../middleware/auth');
const { idParam, assetRules, updateAssetRules } = require('../validations/asset.validation');

const router = express.Router();

router.use(requireAuth);
router.get('/options', brandAssetController.assetOptions);
router.get('/', brandAssetController.listAssets);
router.post(
  '/',
  authorize('super_admin', 'brand_manager', 'marketing_executive', 'graphic_designer'),
  upload.single('file'),
  assetRules,
  validate,
  brandAssetController.createAsset
);
router.get('/:id', idParam, validate, brandAssetController.getAsset);
router.get('/:id/download', idParam, validate, brandAssetController.downloadAsset);
router.put(
  '/:id',
  authorize('super_admin', 'brand_manager', 'marketing_executive', 'graphic_designer'),
  upload.single('file'),
  updateAssetRules,
  validate,
  brandAssetController.updateAsset
);
router.delete('/:id', authorize('super_admin', 'brand_manager'), idParam, validate, brandAssetController.deleteAsset);

module.exports = router;
