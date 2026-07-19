const express = require('express');
const campaignController = require('../controllers/campaign.controller');
const validate = require('../middleware/validate');
const { requireAuth, authorize } = require('../middleware/auth');
const { idParam, campaignRules, updateCampaignRules } = require('../validations/campaign.validation');

const router = express.Router();

router.use(requireAuth);
router.get('/options', campaignController.campaignOptions);
router.get('/', campaignController.listCampaigns);
router.post('/', authorize('super_admin', 'brand_manager', 'marketing_executive'), campaignRules, validate, campaignController.createCampaign);
router.get('/:id', idParam, validate, campaignController.getCampaign);
router.put('/:id', authorize('super_admin', 'brand_manager', 'marketing_executive'), updateCampaignRules, validate, campaignController.updateCampaign);
router.delete('/:id', authorize('super_admin', 'brand_manager'), idParam, validate, campaignController.deleteCampaign);

module.exports = router;
