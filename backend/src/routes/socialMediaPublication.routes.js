const express = require('express');
const socialMediaPublicationController = require('../controllers/socialMediaPublication.controller');
const validate = require('../middleware/validate');
const { requireAuth, authorize } = require('../middleware/auth');
const { idParam } = require('../validations/campaign.validation');

const router = express.Router();

router.use(requireAuth);

router.get(
       '/campaigns/:id/publications',
       idParam,
       validate,
       socialMediaPublicationController.listPublications
);

router.post(
       '/campaigns/:id/publications',
       authorize('super_admin', 'brand_manager', 'marketing_executive'),
       idParam,
       validate,
       socialMediaPublicationController.createPublication
);

router.put(
       '/campaigns/:id/publications/:publicationId',
       authorize('super_admin', 'brand_manager', 'marketing_executive'),
       idParam,
       validate,
       socialMediaPublicationController.updatePublication
);

router.delete(
       '/campaigns/:id/publications/:publicationId',
       authorize('super_admin', 'brand_manager'),
       idParam,
       validate,
       socialMediaPublicationController.deletePublication
);

module.exports = router;