const express = require('express');
const branchController = require('../controllers/branch.controller');
const validate = require('../middleware/validate');
const { requireAuth, authorize } = require('../middleware/auth');
const { idParam, branchRules, updateBranchRules } = require('../validations/branch.validation');

const router = express.Router();

router.use(requireAuth);
router.get('/options', branchController.branchOptions);
router.get('/', branchController.listBranches);
router.post('/', authorize('super_admin', 'brand_manager'), branchRules, validate, branchController.createBranch);
router.get('/:id', idParam, validate, branchController.getBranch);
router.put('/:id', authorize('super_admin', 'brand_manager'), updateBranchRules, validate, branchController.updateBranch);
router.delete('/:id', authorize('super_admin'), idParam, validate, branchController.deleteBranch);

module.exports = router;
