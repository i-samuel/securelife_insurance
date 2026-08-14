const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const { protect, requireRole } = require('../middleware/authMiddleware');
const { validateLead } = require('../middleware/validateMiddleware');

router.use(protect);

router.get('/', leadController.getLeads);
router.post('/', validateLead, leadController.createLead);
router.get('/:id', leadController.getLead);
router.patch('/:id/status', leadController.updateStatus);
router.patch('/:id/assign', requireRole('ADMIN'), leadController.assignLeadAdvisor);
router.post('/:id/notes', leadController.addNote);

module.exports = router;
